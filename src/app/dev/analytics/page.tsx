import type { Metadata } from 'next';
import { prisma, isDbReady } from '@/lib/db';
import { isAdminAuthed } from '@/lib/admin-auth';
import { getRangeStats, getVisitCounts } from '@/lib/report';
import AdminLogin from './AdminLogin';
import AdminActions from './AdminActions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Site Analytics',
  robots: 'noindex, nofollow',
};

const palette = {
  bg: '#FBF7F0',
  card: '#ffffff',
  line: '#e5e0d8',
  ink: '#1A1815',
  soft: '#5C5750',
  green: '#1F3A2E',
};

function fmt(d: Date): string {
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago',
  });
}

function fmtDay(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago' });
}

function Card({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div style={{ background: palette.card, border: `1px solid ${palette.line}`, borderRadius: 6, padding: '16px 18px' }}>
      <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: palette.soft, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 600, color: palette.ink, marginTop: 6 }}>{value}</div>
      {hint && <div style={{ fontSize: 12, color: palette.soft, marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 28 }}>
      <h2 style={{ fontSize: 15, fontWeight: 600, color: palette.green, margin: '0 0 10px' }}>{title}</h2>
      {children}
    </section>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '8px 12px', fontSize: 11, letterSpacing: '0.06em',
  textTransform: 'uppercase', color: palette.soft, borderBottom: `1px solid ${palette.line}`, whiteSpace: 'nowrap',
};
const tdStyle: React.CSSProperties = {
  padding: '8px 12px', fontSize: 13, color: palette.ink, borderBottom: `1px solid ${palette.line}`, verticalAlign: 'top',
};

function Table({ headers, rows, empty }: { headers: string[]; rows: (string | number)[][]; empty: string }) {
  if (rows.length === 0) {
    return (
      <div style={{ background: palette.card, border: `1px solid ${palette.line}`, borderRadius: 6, padding: 20, fontSize: 13, color: palette.soft }}>
        {empty}
      </div>
    );
  }
  return (
    <div style={{ background: palette.card, border: `1px solid ${palette.line}`, borderRadius: 6, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
        <thead>
          <tr>{headers.map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => <td key={j} style={tdStyle}>{cell === '' || cell == null ? '—' : cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const authed = await isAdminAuthed();
  if (!authed) return <AdminLogin />;

  if (!isDbReady() || !prisma) {
    return (
      <div style={{ minHeight: '100vh', background: palette.bg, padding: 24 }}>
        <p style={{ color: palette.soft }}>Database is not available. Check DATABASE_URL.</p>
      </div>
    );
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [weekStats, monthly, allTimeVisits, allTimeLeads, recentLeads, recentBookings, recentEmails, reports] =
    await Promise.all([
      getRangeStats(weekAgo, now),
      getVisitCounts(monthAgo, now),
      prisma.analyticsEvent.count({ where: { eventType: 'page_view' } }),
      prisma.lead.count(),
      prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
      prisma.lead.findMany({ where: { leadType: 'booking' }, orderBy: { createdAt: 'desc' }, take: 10 }),
      prisma.emailLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
      prisma.weeklyReport.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
    ]);

  // Last 4 weeks, most recent first — shows how many people are seeing the site
  const weekBuckets = await Promise.all(
    [0, 1, 2, 3].map(async (i) => {
      const end = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
      const counts = await getVisitCounts(start, end);
      return { start, end, ...counts };
    })
  );

  const deliveryRate =
    weekStats.emailsSent > 0
      ? `${Math.round((weekStats.emailsDelivered / weekStats.emailsSent) * 100)}%`
      : '—';

  return (
    <div style={{ minHeight: '100vh', background: palette.bg, color: palette.ink, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 16px 60px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0, color: palette.green }}>Site Analytics</h1>
            <p style={{ fontSize: 13, color: palette.soft, margin: '4px 0 0' }}>
              Last 7 days · {allTimeVisits} total page views and {allTimeLeads} total leads all-time
            </p>
          </div>
          <AdminActions />
        </header>

        {/* Top row cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginTop: 20 }}>
          <Card label="Visits this week" value={weekStats.totalVisits} />
          <Card label="Unique visitors" value={weekStats.uniqueVisitors} />
          <Card label="Total leads" value={weekStats.totalLeads} />
          <Card label="Booking leads" value={weekStats.bookingLeads} />
          <Card label="Emails sent" value={weekStats.emailsSent} />
          <Card label="Delivery rate" value={deliveryRate} hint={weekStats.emailsDelivered === 0 && weekStats.emailsSent > 0 ? 'Needs Resend webhook' : undefined} />
        </div>

        <Section title="Traffic by page (7 days)">
          <Table
            headers={['Page', 'Views']}
            rows={weekStats.trafficByPage.map((p) => [p.page, p.views])}
            empty="No data yet"
          />
        </Section>

        <Section title="Recent leads">
          <Table
            headers={['Date', 'Type', 'Name', 'Email', 'Phone', 'Property', 'Status']}
            rows={recentLeads.map((l) => [
              fmt(l.createdAt), l.leadType, l.name, l.email || '', l.phone || '', l.property || '', l.status,
            ])}
            empty="No data yet"
          />
        </Section>

        <Section title="Recent booking leads">
          <Table
            headers={['Date', 'Name', 'Email', 'Phone', 'Property']}
            rows={recentBookings.map((l) => [fmt(l.createdAt), l.name, l.email || '', l.phone || '', l.property || ''])}
            empty="No data yet"
          />
        </Section>

        <Section title="Recent email activity">
          <Table
            headers={['Date', 'Type', 'To', 'Subject', 'Status']}
            rows={recentEmails.map((e) => [
              fmt(e.createdAt), e.emailType, e.toEmail, e.subject.length > 60 ? `${e.subject.slice(0, 60)}…` : e.subject, e.status,
            ])}
            empty="No data yet"
          />
        </Section>

        <Section title="Site reach — last 30 days">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
            <Card label="Visits (30 days)" value={monthly.visits} />
            <Card label="People reached (30 days)" value={monthly.uniqueVisitors} hint="Unique visitors" />
          </div>
          <Table
            headers={['Week', 'Visits', 'Unique visitors']}
            rows={weekBuckets.map((w) => [
              `${fmtDay(w.start)} – ${fmtDay(w.end)}`,
              w.visits,
              w.uniqueVisitors,
            ])}
            empty="No data yet"
          />
        </Section>

        <Section title="Report history">
          <Table
            headers={['Type', 'Period', 'Visits', 'Visitors', 'Leads', 'Bookings', 'Contacts', 'Emails', 'Delivered', 'Emailed']}
            rows={reports.map((r) => [
              r.reportType,
              `${fmtDay(r.weekStart)} – ${fmtDay(r.weekEnd)}`,
              r.totalVisits, r.uniqueVisitors, r.totalLeads, r.bookingLeads, r.contactLeads,
              r.emailsSent, r.emailsDelivered, r.sentAt ? fmt(r.sentAt) : 'not sent',
            ])}
            empty="No data yet"
          />
        </Section>
      </div>
    </div>
  );
}
