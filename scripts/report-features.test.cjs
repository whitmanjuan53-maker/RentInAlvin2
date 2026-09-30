const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const JSZip = require('jszip');
const { NextRequest } = require('next/server');

function load(file, mocks = {}) {
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)(
    (name) => Object.hasOwn(mocks, name) ? mocks[name] : require(name), module, module.exports,
  );
  return module.exports;
}

const documentModule = load('src/lib/lead-document.ts');
const emailMetrics = load('src/lib/email-metrics.ts');
const lead = (index) => ({ id: `lead-${index}`, createdAt: new Date('2026-09-26T15:00:00Z'),
  leadType: 'contact', name: `Person ${index}`, email: `person${index}@example.com`,
  phone: '555-0100', property: 'Royal Oaks', status: 'new', message: 'First line\nSecond line',
  sourcePage: '/contact', metadata: '{"moveBy":"November","dob":"private"}' });

test('delivery rate excludes emails still awaiting provider confirmation', () => {
  assert.deepEqual(emailMetrics.getDeliverySummary({ sent: 3, delivered: 2, bounced: 0 }), {
    rate: '100%', hint: '2 confirmed · 1 awaiting confirmation', pending: 1,
  });
  assert.deepEqual(emailMetrics.getDeliverySummary({ sent: 3, delivered: 2, bounced: 1 }), {
    rate: '67%', hint: '2 confirmed · 1 bounced', pending: 0,
  });
  assert.deepEqual(emailMetrics.getDeliverySummary({ sent: 1, delivered: 0, bounced: 0 }), {
    rate: 'Pending', hint: '1 awaiting confirmation', pending: 1,
  });
});

test('Word export includes all 125 leads, both contact fields, notes and safe metadata', async () => {
  const leads = Array.from({ length: 125 }, (_, i) => lead(i));
  leads[0].name = 'A & B <script> José';
  leads[1].metadata = 'invalid JSON';
  const archive = await JSZip.loadAsync(await documentModule.buildLeadDocument(leads));
  const xml = await archive.file('word/document.xml').async('string');
  assert.match(xml, /125 leads/);
  assert.match(xml, /Person 124/);
  assert.match(xml, /person124@example.com/);
  assert.match(xml, /555-0100/);
  assert.match(xml, /First line/);
  assert.match(xml, /Second line/);
  assert.match(xml, /November/);
  assert.match(xml, /A &amp; B &lt;script&gt; José/);
  assert.doesNotMatch(xml, /private/);
});

test('empty Word export explains that there are no saved leads', async () => {
  const archive = await JSZip.loadAsync(await documentModule.buildLeadDocument([]));
  assert.match(await archive.file('word/document.xml').async('string'), /No leads have been saved yet/);
});

test('recipient settings persist, trim email, reject invalid input, and require admin access', async () => {
  const saved = {};
  let authed = true;
  const prisma = {
    reportSettings: {
      findUnique: async ({ where }) => saved[where.id],
      upsert: async ({ where, create, update }) => {
        saved[where.id] = saved[where.id] ? { ...saved[where.id], ...update } : create;
      },
    },
    $transaction: async (callback) => callback(prisma),
  };
  const settings = load('src/lib/report-settings.ts', { './db': { prisma } });
  const route = load('src/app/api/reports/settings/route.ts', {
    '@/lib/admin-auth': { isAdminRequest: () => authed }, '@/lib/db': { prisma },
    '@/lib/report-settings': settings,
  });
  const put = (weeklyRecipient, monthlyRecipient = 'monthly@example.com', origin = 'http://localhost') => new NextRequest('http://localhost/api/reports/settings', {
    method: 'PUT', headers: { 'Content-Type': 'application/json', origin }, body: JSON.stringify({ weeklyRecipient, monthlyRecipient }),
  });
  assert.equal((await route.PUT(put('bad'))).status, 400);
  assert.equal((await route.PUT(put('one@example.com,two@example.com'))).status, 400);
  assert.equal((await route.PUT(put('one@example.com\r\nBcc: other@example.com'))).status, 400);
  assert.equal((await route.PUT(put('one@example.com', 'monthly@example.com', 'http://other-site.test'))).status, 403);
  assert.equal((await route.PUT(put('one@example.com', 'monthly@example.com', 'null'))).status, 403);
  assert.deepEqual(saved, {});
  assert.equal((await route.PUT(put('  one@example.com  ', '  month@example.com  '))).status, 200);
  assert.equal(await settings.getReportRecipient('weekly'), 'one@example.com');
  assert.equal(await settings.getReportRecipient('monthly'), 'month@example.com');
  assert.equal((await route.PUT(put('two@example.com', 'monthly-two@example.com'))).status, 200);
  const proxied = new NextRequest('http://internal-host/api/reports/settings', {
    method: 'PUT', headers: { 'Content-Type': 'application/json', origin: 'https://www.rentinalvin.com', host: 'www.rentinalvin.com' },
    body: JSON.stringify({ weeklyRecipient: 'two@example.com', monthlyRecipient: 'monthly-two@example.com' }),
  });
  assert.equal((await route.PUT(proxied)).status, 200);
  assert.deepEqual(await (await route.GET(new NextRequest('http://localhost'))).json(), {
    weeklyRecipient: 'two@example.com', monthlyRecipient: 'monthly-two@example.com',
  });
  authed = false;
  assert.equal((await route.PUT(put('intruder@example.com'))).status, 401);
  assert.equal((await route.GET(new NextRequest('http://localhost'))).status, 401);
  assert.equal(saved.weekly.recipient, 'two@example.com');
  assert.equal(saved.monthly.recipient, 'monthly-two@example.com');
});

test('missing settings fall back to environment, but database outages do not silently reroute', async () => {
  const before = process.env.ANALYTICS_REPORT_TO;
  process.env.ANALYTICS_REPORT_TO = 'original@example.com';
  try {
    let behavior = async () => null;
    const settings = load('src/lib/report-settings.ts', { './db': { prisma: {
      reportSettings: { findUnique: () => behavior() },
    } } });
    assert.equal(await settings.getReportRecipient('weekly'), 'original@example.com');
    assert.equal(await settings.getReportRecipient('monthly'), 'original@example.com');
    behavior = async () => { throw { code: 'P2021' }; };
    assert.equal(await settings.getReportRecipient('weekly'), 'original@example.com');
    behavior = async () => { throw new Error('Database offline'); };
    await assert.rejects(settings.getReportRecipient('monthly'), /Database offline/);
  } finally {
    if (before === undefined) delete process.env.ANALYTICS_REPORT_TO;
    else process.env.ANALYTICS_REPORT_TO = before;
  }
});

test('lead download requires admin and queries all dates without a row limit', async () => {
  let authed = false;
  let queries = 0;
  const route = load('src/app/api/reports/leads/route.ts', {
    '@/lib/admin-auth': { isAdminRequest: () => authed },
    '@/lib/db': { prisma: { lead: { findMany: async (query) => {
      queries++;
      assert.equal(query.take, undefined);
      assert.equal(query.where, undefined);
      return [lead(0)];
    } } } }, '@/lib/lead-document': documentModule,
  });
  const req = new NextRequest('http://localhost/api/reports/leads');
  assert.equal((await route.GET(req)).status, 401);
  assert.equal(queries, 0);
  authed = true;
  const res = await route.GET(req);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('Cache-Control'), 'private, no-store');
  assert.match(res.headers.get('Content-Disposition'), /\.docx"$/);
  assert.ok((await res.arrayBuffer()).byteLength > 1000);
});

test('weekly and monthly sends use their saved recipients, simulated email is not marked sent', async () => {
  const recipients = [];
  const reports = [];
  let simulated = false;
  let rejected = false;
  const prisma = {
    analyticsEvent: { count: async () => 0, findMany: async () => [], groupBy: async () => [] },
    lead: { groupBy: async () => [], findMany: async () => [] },
    emailLog: { groupBy: async () => [] },
    weeklyReport: { create: async ({ data }) => { reports.push(data); return { id: 'report' }; } },
  };
  const report = load('src/lib/report.ts', {
    './db': { prisma, isDbReady: () => true },
    './report-settings': { getReportRecipient: async (type) => `${type}@example.com` },
    './analytics': { logEmail: async () => {}, extractEmailId: (result) => result.id },
    './email': { sendAdminEmail: async (to) => { recipients.push(to); return rejected ? { error: { message: 'Rejected' }, data: null } : { id: simulated ? 'simulated' : 'sent' }; } },
  });
  assert.equal((await report.runReport('weekly')).emailSent, true);
  assert.equal((await report.runReport('monthly')).emailSent, true);
  assert.deepEqual(recipients, ['weekly@example.com', 'monthly@example.com']);
  simulated = true;
  assert.equal((await report.runReport('weekly')).emailSent, false);
  assert.equal(reports[2].sentAt, null);
  simulated = false;
  rejected = true;
  assert.equal((await report.runReport('weekly')).emailSent, false);
  assert.equal(reports[3].sentAt, null);
  const html = report.buildReportHtml('weekly', {
    trafficByPage: [{ page: '<script>alert(1)</script>', views: 1 }],
  }, new Date(), new Date(), [{ ...lead(1), name: '<img src=x onerror=alert(1)>', property: 'A&B' }]);
  assert.doesNotMatch(html, /<script>|<img src=x/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /A&amp;B/);
});

test('production setup locks, creates only the settings table, and verifies its schema', async () => {
  const { prepareReportSettings } = await import('./prepare-report-settings.mjs');
  const calls = [];
  await prepareReportSettings({ $transaction: async (callback) => callback({
    $executeRawUnsafe: async (sql) => calls.push(sql),
    reportSettings: { findUnique: async ({ where }) => { assert.equal(where.id, 'weekly'); calls.push('verified'); } },
  }) });
  assert.match(calls[0], /pg_advisory_xact_lock/);
  assert.match(calls[1], /CREATE TABLE IF NOT EXISTS "ReportSettings"/);
  assert.doesNotMatch(calls[1], /\b(DROP|DELETE|UPDATE|TRUNCATE)\b/i);
  assert.equal(calls[2], 'verified');
});

test('updated mail library builds report messages without contacting an email server', async () => {
  const transport = require('nodemailer').createTransport({ streamTransport: true, buffer: true });
  const result = await transport.sendMail({
    from: 'RentInAlvin <reports@example.com>', to: ['recipient@example.com'],
    subject: 'Weekly report', text: 'One lead', html: '<p>One lead</p>',
  });
  assert.deepEqual(result.envelope.to, ['recipient@example.com']);
  assert.match(result.message.toString(), /Subject: Weekly report/);
  assert.match(result.message.toString(), /<p>One lead<\/p>/);
});
