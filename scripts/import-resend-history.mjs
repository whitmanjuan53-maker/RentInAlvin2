// One-time import of previously sent Resend emails into the email_logs table.
// Usage:  node scripts/import-resend-history.mjs
// Requires RESEND_API_KEY in .env (and DATABASE_URL pointing at the DB you
// want to import into). Safe to re-run: already-imported emails are skipped.

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PrismaClient } from '@prisma/client';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Minimal .env loader (no dependency): real env vars take precedence.
try {
  for (const line of readFileSync(join(root, '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"#]*)"?\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
} catch { /* no .env file */ }

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error('RESEND_API_KEY is not set. Add it to .env and re-run.');
  process.exit(1);
}

const prisma = new PrismaClient();

function mapStatus(lastEvent) {
  switch ((lastEvent || '').toLowerCase()) {
    case 'delivered': return 'delivered';
    case 'opened': return 'opened';
    case 'clicked': return 'clicked';
    case 'bounced':
    case 'complained': return 'bounced';
    case 'failed':
    case 'canceled': return 'failed';
    default: return 'sent';
  }
}

function guessEmailType(subject) {
  const s = subject || '';
  if (/has been received|We received your inquiry|confirmation/i.test(s)) return 'confirmation';
  if (/^Weekly Report/i.test(s)) return 'weekly_report';
  if (/tour/i.test(s)) return 'booking_notification';
  return 'lead_notification';
}

async function fetchPage(cursor) {
  const url = new URL('https://api.resend.com/emails');
  url.searchParams.set('limit', '100');
  if (cursor) url.searchParams.set('after', cursor);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

let imported = 0;
let skipped = 0;

try {
  let cursor = null;
  let page = 1;
  for (;;) {
    const json = await fetchPage(cursor);
    const emails = json.data || json.emails || [];
    if (!Array.isArray(emails) || emails.length === 0) break;

    for (const e of emails) {
      if (!e.id) continue;
      const exists = await prisma.emailLog.findFirst({ where: { resendEmailId: e.id }, select: { id: true } });
      if (exists) { skipped++; continue; }

      const to = Array.isArray(e.to) ? e.to.join(', ') : String(e.to || 'unknown');
      await prisma.emailLog.create({
        data: {
          resendEmailId: e.id,
          emailType: guessEmailType(e.subject),
          toEmail: to,
          subject: e.subject || '(no subject)',
          status: mapStatus(e.last_event),
          createdAt: e.created_at ? new Date(e.created_at) : new Date(),
        },
      });
      imported++;
    }

    console.log(`page ${page}: imported ${imported}, skipped ${skipped} so far`);
    const hasMore = json.has_more === true || (json.pagination && json.pagination.has_more);
    const last = emails[emails.length - 1];
    if (!hasMore || !last?.id || emails.length < 100) break;
    cursor = last.id;
    page++;
  }

  console.log(`\nDone. Imported ${imported} emails from Resend history, skipped ${skipped} already-known.`);
} catch (err) {
  if (String(err.message).includes('404') || String(err.message).includes('405')) {
    console.error('\nResend did not accept the list request — this API key/plan may not support');
    console.error('listing past emails. Everything sent from now on is logged automatically,');
    console.error('and the webhook keeps delivery/open statuses up to date.');
  } else {
    console.error('\nImport failed:', err.message);
  }
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
