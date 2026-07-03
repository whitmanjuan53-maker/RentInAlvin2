import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { updateEmailStatus, recordEvent, type AnalyticsEventType } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

// Resend webhooks are delivered via Svix. Signature scheme:
// HMAC-SHA256 over `${svix-id}.${svix-timestamp}.${rawBody}` keyed with the
// base64-decoded portion of the secret after the "whsec_" prefix.
function verifySvixSignature(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    // No secret configured — accept but warn. Set RESEND_WEBHOOK_SECRET in
    // production (from the Resend dashboard webhook settings) to enforce this.
    console.warn('[WEBHOOK/resend] RESEND_WEBHOOK_SECRET not set — skipping signature verification');
    return true;
  }

  const svixId = req.headers.get('svix-id');
  const svixTimestamp = req.headers.get('svix-timestamp');
  const svixSignature = req.headers.get('svix-signature');
  if (!svixId || !svixTimestamp || !svixSignature) return false;

  // Reject stale timestamps (> 5 minutes) to prevent replay
  const ts = Number(svixTimestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) return false;

  try {
    const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
    const expected = createHmac('sha256', key)
      .update(`${svixId}.${svixTimestamp}.${rawBody}`)
      .digest('base64');

    // Header may contain multiple space-delimited signatures like "v1,<sig>"
    return svixSignature.split(' ').some((part) => {
      const sig = part.split(',')[1] || '';
      const a = Buffer.from(sig);
      const b = Buffer.from(expected);
      return a.length === b.length && timingSafeEqual(a, b);
    });
  } catch (err) {
    console.error('[WEBHOOK/resend] Signature verification error:', err);
    return false;
  }
}

const STATUS_MAP: Record<string, { status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed'; event: AnalyticsEventType }> = {
  'email.sent': { status: 'sent', event: 'email_sent' },
  'email.delivered': { status: 'delivered', event: 'email_delivered' },
  'email.opened': { status: 'opened', event: 'email_opened' },
  'email.clicked': { status: 'clicked', event: 'email_clicked' },
  'email.bounced': { status: 'bounced', event: 'email_bounced' },
  'email.failed': { status: 'failed', event: 'email_failed' },
  'email.delivery_delayed': { status: 'sent', event: 'email_sent' },
  'email.complained': { status: 'bounced', event: 'email_bounced' },
};

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    if (!verifySvixSignature(req, rawBody)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventType: string = payload?.type || '';
    const emailId: string | undefined = payload?.data?.email_id;

    const mapped = STATUS_MAP[eventType];
    if (!mapped || !emailId) {
      // Unknown event — acknowledge so Resend does not retry forever
      return NextResponse.json({ received: true });
    }

    // "sent" events should not downgrade delivered/opened statuses
    if (eventType !== 'email.sent' && eventType !== 'email.delivery_delayed') {
      const errorMessage =
        eventType === 'email.bounced' || eventType === 'email.failed'
          ? payload?.data?.bounce?.message || payload?.data?.failed?.reason || null
          : null;
      await updateEmailStatus(emailId, mapped.status, errorMessage);
    }

    await recordEvent({
      eventType: mapped.event,
      metadata: { resendEmailId: emailId, webhookEvent: eventType },
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[WEBHOOK/resend] Error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
