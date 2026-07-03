import { createHash } from 'crypto';
import { prisma, isDbReady } from './db';

export type AnalyticsEventType =
  | 'page_view'
  | 'form_submit'
  | 'booking_submit'
  | 'email_sent'
  | 'email_delivered'
  | 'email_opened'
  | 'email_clicked'
  | 'email_bounced'
  | 'email_failed';

export type NormalizedLeadType =
  | 'contact'
  | 'booking'
  | 'property_inquiry'
  | 'application_interest'
  | 'newsletter'
  | 'other';

export type EmailLogType = 'lead_notification' | 'booking_notification' | 'weekly_report' | 'confirmation';

// Never store raw IPs — salted SHA-256 only.
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || process.env.ADMIN_ANALYTICS_PASSWORD || 'rentinalvin-analytics';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);
}

export function normalizeLeadType(rawType: string): NormalizedLeadType {
  const t = (rawType || '').toLowerCase();
  if (t === 'tour' || t.includes('tour') || t.includes('booking')) return 'booking';
  if (t === 'contact') return 'contact';
  if (t === 'sell') return 'property_inquiry';
  if (t === 'apply' || t.includes('appl')) return 'application_interest';
  if (t.includes('newsletter')) return 'newsletter';
  return 'other';
}

export async function recordEvent(event: {
  eventType: AnalyticsEventType;
  pagePath?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
  ipHash?: string | null;
  visitorId?: string | null;
  metadata?: Record<string, unknown> | null;
}): Promise<void> {
  if (!isDbReady() || !prisma) return;
  try {
    await prisma.analyticsEvent.create({
      data: {
        eventType: event.eventType,
        pagePath: event.pagePath || null,
        referrer: event.referrer || null,
        userAgent: event.userAgent || null,
        ipHash: event.ipHash || null,
        visitorId: event.visitorId || null,
        metadata: event.metadata ? JSON.stringify(event.metadata) : null,
      },
    });
  } catch (err) {
    console.error('[ANALYTICS] Failed to record event:', err);
  }
}

// Extract the Resend email id (or SMTP/SendGrid message id) from a send result.
export function extractEmailId(result: unknown): string | null {
  if (!result || typeof result !== 'object') return null;
  const r = result as { data?: { id?: string } | null; id?: string; messageId?: string };
  if (r.data && typeof r.data.id === 'string') return r.data.id;
  if (typeof r.id === 'string' && r.id !== 'simulated') return r.id;
  if (typeof r.messageId === 'string') return r.messageId;
  return null;
}

export async function logEmail(entry: {
  resendEmailId?: string | null;
  leadId?: string | null;
  emailType: EmailLogType;
  toEmail: string;
  subject: string;
  status?: 'sent' | 'failed';
  errorMessage?: string | null;
}): Promise<string | null> {
  if (!isDbReady() || !prisma) return null;
  try {
    const log = await prisma.emailLog.create({
      data: {
        resendEmailId: entry.resendEmailId || null,
        leadId: entry.leadId || null,
        emailType: entry.emailType,
        toEmail: entry.toEmail,
        subject: entry.subject,
        status: entry.status || 'sent',
        errorMessage: entry.errorMessage || null,
      },
    });
    return log.id;
  } catch (err) {
    console.error('[ANALYTICS] Failed to log email:', err);
    return null;
  }
}

export async function updateEmailStatus(
  resendEmailId: string,
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed',
  errorMessage?: string | null
): Promise<boolean> {
  if (!isDbReady() || !prisma) return false;
  try {
    const result = await prisma.emailLog.updateMany({
      where: { resendEmailId },
      data: { status, errorMessage: errorMessage || undefined },
    });
    return result.count > 0;
  } catch (err) {
    console.error('[ANALYTICS] Failed to update email status:', err);
    return false;
  }
}

// Unified lead record for the admin dashboard. Best-effort: never throws.
export async function saveUnifiedLead(entry: {
  rawType: string;
  leadType?: NormalizedLeadType;
  name: string;
  email?: string | null;
  phone?: string | null;
  property?: string | null;
  message?: string | null;
  metadata?: Record<string, unknown> | null;
  sourcePage?: string | null;
  resendEmailId?: string | null;
}): Promise<string | null> {
  if (!isDbReady() || !prisma) return null;
  try {
    const lead = await prisma.lead.create({
      data: {
        type: entry.rawType,
        leadType: entry.leadType || normalizeLeadType(entry.rawType),
        name: entry.name,
        email: entry.email || null,
        phone: entry.phone || null,
        property: entry.property || null,
        message: entry.message || null,
        metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
        sourcePage: entry.sourcePage || null,
        resendEmailId: entry.resendEmailId || null,
      },
    });
    return lead.id;
  } catch (err) {
    console.error('[ANALYTICS] Failed to save unified lead:', err);
    return null;
  }
}

export async function attachEmailToLead(leadId: string, resendEmailId: string): Promise<void> {
  if (!isDbReady() || !prisma) return;
  try {
    await prisma.lead.update({ where: { id: leadId }, data: { resendEmailId } });
  } catch (err) {
    console.error('[ANALYTICS] Failed to attach email to lead:', err);
  }
}
