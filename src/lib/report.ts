import { prisma, isDbReady } from './db';
import { sendAdminEmail } from './email';
import { logEmail, extractEmailId } from './analytics';

export type ReportType = 'weekly' | 'monthly';

export interface RangeStats {
  totalVisits: number;
  uniqueVisitors: number;
  totalLeads: number;
  bookingLeads: number;
  contactLeads: number;
  otherLeads: number;
  emailsSent: number;
  emailsDelivered: number;
  emailsOpened: number;
  emailsClicked: number;
  emailsBounced: number;
  emailsFailed: number;
  trafficByPage: { page: string; views: number }[];
}

export async function getRangeStats(since: Date, until: Date = new Date()): Promise<RangeStats> {
  const empty: RangeStats = {
    totalVisits: 0, uniqueVisitors: 0, totalLeads: 0, bookingLeads: 0, contactLeads: 0,
    otherLeads: 0, emailsSent: 0, emailsDelivered: 0, emailsOpened: 0, emailsClicked: 0,
    emailsBounced: 0, emailsFailed: 0, trafficByPage: [],
  };
  if (!isDbReady() || !prisma) return empty;

  const range = { gte: since, lt: until };
  const pageViewWhere = { eventType: 'page_view', createdAt: range };

  const [totalVisits, visitors, leadGroups, emailGroups, pageGroups] = await Promise.all([
    prisma.analyticsEvent.count({ where: pageViewWhere }),
    prisma.analyticsEvent.findMany({
      where: { ...pageViewWhere, visitorId: { not: null } },
      distinct: ['visitorId'],
      select: { visitorId: true },
    }),
    prisma.lead.groupBy({ by: ['leadType'], where: { createdAt: range }, _count: { _all: true } }),
    prisma.emailLog.groupBy({ by: ['status'], where: { createdAt: range }, _count: { _all: true } }),
    prisma.analyticsEvent.groupBy({
      by: ['pagePath'],
      where: { ...pageViewWhere, pagePath: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { pagePath: 'desc' } },
      take: 20,
    }),
  ]);

  const leadCount = (type: string) => leadGroups.find((g) => g.leadType === type)?._count._all || 0;
  const emailCount = (status: string) => emailGroups.find((g) => g.status === status)?._count._all || 0;
  const totalLeads = leadGroups.reduce((sum, g) => sum + g._count._all, 0);
  const totalEmails = emailGroups.reduce((sum, g) => sum + g._count._all, 0);
  const bookingLeads = leadCount('booking');
  const contactLeads = leadCount('contact');

  return {
    totalVisits,
    uniqueVisitors: visitors.length,
    totalLeads,
    bookingLeads,
    contactLeads,
    otherLeads: totalLeads - bookingLeads - contactLeads,
    emailsSent: totalEmails - emailCount('failed'),
    emailsDelivered: emailCount('delivered') + emailCount('opened') + emailCount('clicked'),
    emailsOpened: emailCount('opened') + emailCount('clicked'),
    emailsClicked: emailCount('clicked'),
    emailsBounced: emailCount('bounced'),
    emailsFailed: emailCount('failed'),
    trafficByPage: pageGroups.map((g) => ({ page: g.pagePath || '(unknown)', views: g._count._all })),
  };
}

// Lightweight visit counts for a range — used for the 30-day reach numbers.
export async function getVisitCounts(since: Date, until: Date = new Date()): Promise<{ visits: number; uniqueVisitors: number }> {
  if (!isDbReady() || !prisma) return { visits: 0, uniqueVisitors: 0 };
  const where = { eventType: 'page_view', createdAt: { gte: since, lt: until } };
  const [visits, visitors] = await Promise.all([
    prisma.analyticsEvent.count({ where }),
    prisma.analyticsEvent.findMany({
      where: { ...where, visitorId: { not: null } },
      distinct: ['visitorId'],
      select: { visitorId: true },
    }),
  ]);
  return { visits, uniqueVisitors: visitors.length };
}

interface ReportLead {
  createdAt: Date;
  leadType: string;
  name: string;
  email: string | null;
  phone: string | null;
  property: string | null;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago' });
}

function leadTypeLabel(t: string): string {
  switch (t) {
    case 'booking': return 'Tour booking';
    case 'contact': return 'Contact';
    case 'property_inquiry': return 'Property sale';
    case 'application_interest': return 'Application';
    case 'newsletter': return 'Newsletter';
    default: return 'Other';
  }
}

export function buildReportHtml(
  type: ReportType,
  stats: RangeStats,
  periodStart: Date,
  periodEnd: Date,
  leads: ReportLead[],
  monthly?: { visits: number; uniqueVisitors: number }
): string {
  const title = type === 'weekly' ? 'Weekly Report' : 'Monthly Report';

  const row = (label: string, value: string | number) =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e0d8;color:#5C5750;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e0d8;font-weight:600;color:#1A1815;text-align:right;">${value}</td></tr>`;

  const pageRows = stats.trafficByPage.slice(0, 10)
    .map((p) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#1A1815;font-size:13px;">${p.page}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right;font-size:13px;">${p.views}</td></tr>`)
    .join('');

  const leadRows = leads.slice(0, 30)
    .map((l) => `<tr>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:12px;white-space:nowrap;color:#5C5750;">${fmtDate(l.createdAt)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:12px;color:#1A1815;">${leadTypeLabel(l.leadType)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:12px;color:#1A1815;font-weight:600;">${l.name}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:12px;color:#1A1815;">${l.email || l.phone || '—'}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:12px;color:#5C5750;">${l.property || '—'}</td>
    </tr>`)
    .join('');

  return `<div style="font-family:Georgia,serif;max-width:620px;margin:0 auto;padding:32px 24px;background:#FBF7F0;color:#1A1815;">
  <h2 style="font-weight:400;font-size:22px;margin:0 0 4px;color:#1F3A2E;">${title} — RentInAlvin.com</h2>
  <p style="margin:0 0 20px;color:#5C5750;font-size:14px;">${fmtDate(periodStart)} – ${fmtDate(periodEnd)}</p>

  <h3 style="font-weight:400;font-size:16px;margin:0 0 8px;color:#1F3A2E;">Site analytics</h3>
  <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e0d8;margin-bottom:20px;">
    ${row('Total visits', stats.totalVisits)}
    ${row('Unique visitors', stats.uniqueVisitors)}
    ${row('Total leads', stats.totalLeads)}
    ${row('Tour booking leads', stats.bookingLeads)}
    ${row('Other leads', stats.otherLeads)}
    ${row('Emails sent', stats.emailsSent)}
    ${row('Emails delivered', stats.emailsDelivered)}
  </table>

  ${monthly ? `
  <h3 style="font-weight:400;font-size:16px;margin:0 0 8px;color:#1F3A2E;">Site reach — last 30 days</h3>
  <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e0d8;margin-bottom:20px;">
    ${row('Visits (30 days)', monthly.visits)}
    ${row('People reached (30 days)', monthly.uniqueVisitors)}
  </table>` : ''}

  <h3 style="font-weight:400;font-size:16px;margin:0 0 8px;color:#1F3A2E;">Leads this ${type === 'weekly' ? 'week' : 'month'}</h3>
  ${leads.length > 0 ? `
  <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e0d8;margin-bottom:20px;">
    <tr>
      <th style="text-align:left;padding:8px 10px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#5C5750;border-bottom:1px solid #e5e0d8;">Date</th>
      <th style="text-align:left;padding:8px 10px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#5C5750;border-bottom:1px solid #e5e0d8;">Type</th>
      <th style="text-align:left;padding:8px 10px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#5C5750;border-bottom:1px solid #e5e0d8;">Name</th>
      <th style="text-align:left;padding:8px 10px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#5C5750;border-bottom:1px solid #e5e0d8;">Contact</th>
      <th style="text-align:left;padding:8px 10px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#5C5750;border-bottom:1px solid #e5e0d8;">Property</th>
    </tr>
    ${leadRows}
  </table>` : `<p style="color:#5C5750;background:#fff;border:1px solid #e5e0d8;padding:14px;margin-bottom:20px;">No leads in this period.</p>`}

  ${stats.trafficByPage.length > 0 ? `
  <h3 style="font-weight:400;font-size:16px;margin:0 0 8px;color:#1F3A2E;">Top pages</h3>
  <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e0d8;">${pageRows}</table>` : ''}

  <p style="margin:24px 0 0;color:#5C5750;font-size:12px;">Generated automatically by the RentInAlvin analytics system.</p>
</div>`;
}

export interface ReportRenderResult {
  html: string;
  subject: string;
  text: string;
  stats: RangeStats;
  periodStart: Date;
  periodEnd: Date;
}

// Builds the report without sending or saving anything — used for previews too.
export async function renderReport(type: ReportType): Promise<ReportRenderResult> {
  const periodEnd = new Date();
  const days = type === 'weekly' ? 7 : 30;
  const periodStart = new Date(periodEnd.getTime() - days * 24 * 60 * 60 * 1000);
  const monthStart = new Date(periodEnd.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [stats, monthly, leads] = await Promise.all([
    getRangeStats(periodStart, periodEnd),
    type === 'weekly' ? getVisitCounts(monthStart, periodEnd) : Promise.resolve(undefined),
    isDbReady() && prisma
      ? prisma.lead.findMany({
          where: { createdAt: { gte: periodStart, lt: periodEnd } },
          orderBy: { createdAt: 'desc' },
          take: 30,
          select: { createdAt: true, leadType: true, name: true, email: true, phone: true, property: true },
        })
      : Promise.resolve([]),
  ]);

  const html = buildReportHtml(type, stats, periodStart, periodEnd, leads, monthly);
  const label = type === 'weekly' ? 'Weekly' : 'Monthly';
  const subject = `${label} Report: ${stats.totalVisits} visits, ${stats.totalLeads} leads — RentInAlvin.com`;
  const text = [
    `${label} Report ${fmtDate(periodStart)} - ${fmtDate(periodEnd)}`,
    `Total visits: ${stats.totalVisits}`,
    `Unique visitors: ${stats.uniqueVisitors}`,
    `Total leads: ${stats.totalLeads}`,
    `Tour booking leads: ${stats.bookingLeads}`,
    `Emails sent: ${stats.emailsSent}`,
    `Emails delivered: ${stats.emailsDelivered}`,
    ...(monthly ? [`Visits last 30 days: ${monthly.visits}`, `People reached last 30 days: ${monthly.uniqueVisitors}`] : []),
  ].join('\n');

  return { html, subject, text, stats, periodStart, periodEnd };
}

export interface RunReportResult {
  ok: boolean;
  reportId?: string;
  emailSent: boolean;
  error?: string;
  stats?: RangeStats;
}

export async function runReport(type: ReportType): Promise<RunReportResult> {
  if (!isDbReady() || !prisma) {
    return { ok: false, emailSent: false, error: 'Database not available' };
  }

  const { html, subject, text, stats, periodStart, periodEnd } = await renderReport(type);
  const reportTo = process.env.ANALYTICS_REPORT_TO || process.env.EMAIL_TO || '';

  let emailSent = false;
  let sentAt: Date | null = null;

  if (reportTo) {
    try {
      const result = await sendAdminEmail(reportTo, subject, text, html);
      const resendEmailId = extractEmailId(result);
      emailSent = !!result;
      sentAt = new Date();
      await logEmail({ resendEmailId, emailType: 'weekly_report', toEmail: reportTo, subject, status: 'sent' });
    } catch (err) {
      console.error('[REPORT] Report email failed:', err);
      await logEmail({
        emailType: 'weekly_report',
        toEmail: reportTo,
        subject,
        status: 'failed',
        errorMessage: err instanceof Error ? err.message : String(err),
      });
    }
  } else {
    console.warn('[REPORT] ANALYTICS_REPORT_TO not set — report saved but not emailed');
  }

  const report = await prisma.weeklyReport.create({
    data: {
      reportType: type,
      weekStart: periodStart,
      weekEnd: periodEnd,
      totalVisits: stats.totalVisits,
      uniqueVisitors: stats.uniqueVisitors,
      totalLeads: stats.totalLeads,
      bookingLeads: stats.bookingLeads,
      contactLeads: stats.contactLeads,
      emailsSent: stats.emailsSent,
      emailsDelivered: stats.emailsDelivered,
      emailsOpened: stats.emailsOpened,
      reportHtml: html,
      sentAt,
    },
  });

  return { ok: true, reportId: report.id, emailSent, stats };
}

// Backwards-compatible alias
export async function runWeeklyReport(): Promise<RunReportResult> {
  return runReport('weekly');
}
