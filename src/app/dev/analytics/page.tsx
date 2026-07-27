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
  accent: '#C9A24B',
};

const cardShadow = '0 1px 2px rgba(26,24,21,0.04), 0 1px 8px rgba(26,24,21,0.03)';

function fmt(d: Date): string {
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago',
  });
}

function fmtDay(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago' });
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'America/Chicago' });
}

function monthKey(d: Date): string {
  return d.toLocaleDateString('en-US', { month: '2-digit', year: 'numeric', timeZone: 'America/Chicago' });
}

function groupByMonth<T>(items: T[], getDate: (item: T) => Date): { key: string; label: string; items: T[] }[] {
  const groups = new Map<string, { label: string; items: T[] }>();
  for (const item of items) {
    const d = getDate(item);
    const key = monthKey(d);
    if (!groups.has(key)) groups.set(key, { label: monthLabel(d), items: [] });
    groups.get(key)!.items.push(item);
  }
  return [...groups.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, v]) => ({ key, ...v }));
}

function Card({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div style={{ background: palette.card, border: `1px solid ${palette.line}`, borderRadius: 8, padding: '16px 18px', boxShadow: cardShadow }}>
      <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: palette.soft, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 600, color: palette.ink, marginTop: 6 }}>{value}</div>
      {hint && <div style={{ fontSize: 12, color: palette.soft, marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function Section({ id, title, count, children }: { id?: string; title: string; count?: number; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginTop: 32, scrollMarginTop: 20 }}>
      <h2 style={{ fontSize: 15, fontWeight: 600, color: palette.green, margin: '0 0 10px', display: 'flex', alignItems: 'baseline', gap: 8 }}>
        {title}
        {count != null && (
          <span style={{ fontSize: 11, fontWeight: 600, color: palette.soft, background: palette.bg, border: `1px solid ${palette.line}`, borderRadius: 10, padding: '1px 8px' }}>
            {count}
          </span>
        )}
      </h2>
      {children}
    </section>
  );
}

function MonthGroup({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '0 0 6px' }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: palette.ink, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</h3>
        <span style={{ fontSize: 11, color: palette.soft }}>({count})</span>
      </div>
      {children}
    </div>
  );
}

function QuickNav() {
  const links: [string, string][] = [
    ['#overview', 'Overview'],
    ['#traffic', 'Traffic'],
    ['#leads', 'Leads'],
    ['#emails', 'Emails'],
    ['#reach', 'Reach'],
    ['#history', 'History'],
  ];
  return (
    <nav style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 16 }}>
      {links.map(([href, label]) => (
        <a
          key={href}
          href={href}
          style={{
            fontSize: 12, fontWeight: 600, color: palette.green, textDecoration: 'none',
            background: palette.card, border: `1px solid ${palette.line}`, borderRadius: 999,
            padding: '5px 12px', boxShadow: cardShadow,
          }}
        >
          {label}
        </a>
      ))}
    </nav>
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
    <div style={{ background: palette.card, border: `1px solid ${palette.line}`, borderRadius: 8, overflowX: 'auto', boxShadow: cardShadow }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
        <thead>
          <tr>{headers.map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 1 ? palette.bg : 'transparent' }}>
              {r.map((cell, j) => <td key={j} style={tdStyle}>{cell === '' || cell == null ? '—' : cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function loadDashboardData(weekAgo: Date, monthAgo: Date, now: Date) {
  if (!prisma) throw new Error('Prisma client is not initialized.');

  const [weekStats, monthly, allTimeVisits, allTimeLeads, recentLeads, recentBookings, recentEmails, reports] =
    await Promise.all([
      getRangeStats(weekAgo, now),
      getVisitCounts(monthAgo, now),
      prisma.analyticsEvent.count({ where: { eventType: 'page_view' } }),
      prisma.lead.count(),
      prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 150 }),
      prisma.lead.findMany({ where: { leadType: 'booking' }, orderBy: { createdAt: 'desc' }, take: 10 }),
      prisma.emailLog.findMany({ orderBy: { createdAt: 'desc' }, take: 150 }),
      prisma.weeklyReport.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
    ]);

  const weekBuckets = await Promise.all(
    [0, 1, 2, 3].map(async (i) => {
      const end = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
      const counts = await getVisitCounts(start, end);
      return { start, end, ...counts };
    })
  );

  return { weekStats, monthly, allTimeVisits, allTimeLeads, recentLeads, recentBookings, recentEmails, reports, weekBuckets };
}

function DiagnosticsError({ message }: { message: string }) {
  return (
    <div style={{ minHeight: '100vh', background: palette.bg, padding: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: palette.green, margin: '0 0 12px' }}>Site Analytics</h1>
        <div style={{ background: palette.card, border: `1px solid ${palette.line}`, borderRadius: 6, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: palette.ink, margin: '0 0 10px' }}>Dashboard unavailable</h2>
          <p style={{ fontSize: 14, color: palette.soft, margin: '0 0 16px', lineHeight: 1.5 }}>
            The analytics dashboard could not connect to the database. This is usually a deployment/environment issue, not a code issue.
          </p>
          <pre style={{ background: '#f5f2ec', padding: 16, borderRadius: 4, fontSize: 13, overflowX: 'auto', color: palette.ink }}>
            {message}
          </pre>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: palette.ink, margin: '24px 0 10px' }}>How to fix</h3>
          <ol style={{ fontSize: 13, color: palette.soft, lineHeight: 1.7, paddingLeft: 20 }}>
            <li>Open your Vercel dashboard and check the latest deployment logs for errors.</li>
            <li>Verify <code>DATABASE_URL</code> is still set in Production environment variables.</li>
            <li>Verify <code>ADMIN_ANALYTICS_PASSWORD</code> is still set.</li>
            <li>Visit <code>/api/dev/diagnostics</code> (admin cookie required) for a live system check.</li>
            <li>If the database password/URL rotated, update it in Vercel and redeploy.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const authed = await isAdminAuthed();
  if (!authed) return <AdminLogin />;

  if (!isDbReady() || !prisma) {
    return <DiagnosticsError message="Database is not available. Check DATABASE_URL." />;
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let data: Awaited<ReturnType<typeof loadDashboardData>> | null = null;
  let dbError: string | null = null;

  try {
    data = await loadDashboardData(weekAgo, monthAgo, now);
  } catch (err) {
    dbError = err instanceof Error ? err.message : String(err);
    console.error('[AdminAnalyticsPage] Database error:', err);
  }

  if (dbError || !data) {
    return <DiagnosticsError message={dbError || 'Failed to load dashboard data.'} />;
  }

  const { weekStats, monthly, allTimeVisits, allTimeLeads, recentLeads, recentBookings, recentEmails, reports, weekBuckets } = data;

  const deliveryRate =
    weekStats.emailsSent > 0
      ? `${Math.round((weekStats.emailsDelivered / weekStats.emailsSent) * 100)}%`
      : '—';

  const leadsByMonth = groupByMonth(recentLeads, (l) => l.createdAt);
  const emailsByMonth = groupByMonth(recentEmails, (e) => e.createdAt);

  return (
    <div style={{ minHeight: '100vh', background: palette.bg, color: palette.ink, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 16px 60px' }}>
        <header
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12,
            paddingBottom: 18, borderBottom: `1px solid ${palette.line}`,
          }}
        >
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0, color: palette.green }}>Site Analytics</h1>
            <p style={{ fontSize: 13, color: palette.soft, margin: '4px 0 0' }}>
              Last 7 days · {allTimeVisits} total page views and {allTimeLeads} total leads all-time
            </p>
          </div>
          <AdminActions />
        </header>

        <QuickNav />

        {/* Top row cards */}
        <div id="overview" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginTop: 24, scrollMarginTop: 20 }}>
          <Card label="Visits this week" value={weekStats.totalVisits} />
          <Card label="Unique visitors" value={weekStats.uniqueVisitors} />
          <Card label="Total leads" value={weekStats.totalLeads} />
          <Card label="Booking leads" value={weekStats.bookingLeads} />
          <Card label="Emails sent" value={weekStats.emailsSent} />
          <Card label="Delivery rate" value={deliveryRate} hint={weekStats.emailsDelivered === 0 && weekStats.emailsSent > 0 ? 'Needs Resend webhook' : undefined} />
        </div>

        <Section id="traffic" title="Traffic by page (7 days)">
          <Table
            headers={['Page', 'Views']}
            rows={weekStats.trafficByPage.map((p) => [p.page, p.views])}
            empty="No data yet"
          />
        </Section>

        <Section id="leads" title="Leads by month" count={recentLeads.length}>
          {leadsByMonth.length === 0 ? (
            <Table headers={['Date', 'Type', 'Name', 'Email', 'Phone', 'Property', 'Status']} rows={[]} empty="No data yet" />
          ) : (
            leadsByMonth.map((group) => (
              <MonthGroup key={group.key} label={group.label} count={group.items.length}>
                <Table
                  headers={['Date', 'Type', 'Name', 'Email', 'Phone', 'Property', 'Status']}
                  rows={group.items.map((l) => [
                    fmt(l.createdAt), l.leadType, l.name, l.email || '', l.phone || '', l.property || '', l.status,
                  ])}
                  empty="No data yet"
                />
              </MonthGroup>
            ))
          )}
        </Section>

        <Section title="Recent booking leads" count={recentBookings.length}>
          <Table
            headers={['Date', 'Name', 'Email', 'Phone', 'Property']}
            rows={recentBookings.map((l) => [fmt(l.createdAt), l.name, l.email || '', l.phone || '', l.property || ''])}
            empty="No data yet"
          />
        </Section>

        <Section id="emails" title="Email activity by month" count={recentEmails.length}>
          {emailsByMonth.length === 0 ? (
            <Table headers={['Date', 'Type', 'To', 'Subject', 'Status']} rows={[]} empty="No data yet" />
          ) : (
            emailsByMonth.map((group) => (
              <MonthGroup key={group.key} label={group.label} count={group.items.length}>
                <Table
                  headers={['Date', 'Type', 'To', 'Subject', 'Status']}
                  rows={group.items.map((e) => [
                    fmt(e.createdAt), e.emailType, e.toEmail, e.subject.length > 60 ? `${e.subject.slice(0, 60)}…` : e.subject, e.status,
                  ])}
                  empty="No data yet"
                />
              </MonthGroup>
            ))
          )}
        </Section>

        <Section id="reach" title="Site reach — last 30 days">
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

        <Section id="history" title="Report history">
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
