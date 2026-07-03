import { NextRequest, NextResponse } from 'next/server';
import { hashIp, recordEvent } from '@/lib/analytics';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limit = checkRateLimit(`track:${ip}`, 60, 60000);
    if (!limit.allowed) {
      return NextResponse.json({ ok: false }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const path = typeof body.path === 'string' ? body.path.slice(0, 512) : null;
    const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 512) : null;
    const visitorId = typeof body.visitorId === 'string' ? body.visitorId.slice(0, 64) : null;

    if (!path || !path.startsWith('/')) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Never track the private dashboard area.
    if (path.startsWith('/dev') || path.startsWith('/admin')) {
      return NextResponse.json({ ok: true });
    }

    await recordEvent({
      eventType: 'page_view',
      pagePath: path,
      referrer,
      userAgent: (req.headers.get('user-agent') || '').slice(0, 512),
      ipHash: hashIp(ip),
      visitorId,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[API /analytics/track] Error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
