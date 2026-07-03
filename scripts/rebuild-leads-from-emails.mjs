// One-time reconstruction of historical leads from imported Resend email logs.
// The old contact endpoint emailed notifications but never saved leads to the
// database — this rebuilds the missing lead rows from those emails.
// Safe to re-run: notifications already linked to a lead are skipped.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function parseSubject(subject) {
  let m = subject.match(/^\[Tour Request\]\s*(.+?)\s*—\s*(.+)$/);
  if (m) return { leadType: 'booking', rawType: 'tour', name: m[1], property: m[2] };
  m = subject.match(/^\[Property Sale Inquiry\]\s*(.+?)\s*—\s*(.+)$/);
  if (m) return { leadType: 'property_inquiry', rawType: 'sell', name: m[1], property: m[2] };
  m = subject.match(/^\[Application\]\s*(.+?)\s*—\s*(.+)$/);
  if (m) return { leadType: 'application_interest', rawType: 'apply', name: m[1], property: m[2] };
  m = subject.match(/^\[Lead\]\s*(.+?)\s*—\s*(.+)$/);
  if (m) return { leadType: 'contact', rawType: 'contact', name: m[1], property: m[2] };
  m = subject.match(/^New Apply\s*-\s*(.+)$/);
  if (m) return { leadType: 'application_interest', rawType: 'apply', name: m[1], property: null };
  m = subject.match(/^New (?:Contact|Tour Booking|Sell Inquiry)?\s*-\s*(.+)$/);
  if (m) return { leadType: 'contact', rawType: 'contact', name: m[1], property: null };
  return null;
}

const notifications = await prisma.emailLog.findMany({
  where: {
    leadId: null,
    emailType: { in: ['booking_notification', 'lead_notification'] },
  },
  orderBy: { createdAt: 'asc' },
});

const confirmations = await prisma.emailLog.findMany({
  where: { emailType: 'confirmation' },
  orderBy: { createdAt: 'asc' },
});

let created = 0;
let skipped = 0;

for (const n of notifications) {
  const parsed = parseSubject(n.subject);
  if (!parsed) {
    console.log('skip (unparseable subject):', n.subject);
    skipped++;
    continue;
  }

  // Avoid duplicating a lead that already exists with same name + same day
  const dayStart = new Date(n.createdAt); dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
  const existing = await prisma.lead.findFirst({
    where: { name: parsed.name, leadType: parsed.leadType, createdAt: { gte: dayStart, lt: dayEnd } },
  });
  if (existing) {
    await prisma.emailLog.update({ where: { id: n.id }, data: { leadId: existing.id } });
    console.log('linked to existing lead:', parsed.name);
    skipped++;
    continue;
  }

  // Customer email: the confirmation sent within 15 minutes of this notification
  const windowMs = 15 * 60 * 1000;
  const match = confirmations.find(
    (c) => Math.abs(c.createdAt.getTime() - n.createdAt.getTime()) < windowMs && !c.leadId
  );

  const lead = await prisma.lead.create({
    data: {
      type: parsed.rawType,
      leadType: parsed.leadType,
      name: parsed.name,
      email: match ? match.toEmail : null,
      property: parsed.property,
      sourcePage: 'Imported from Resend history',
      resendEmailId: n.resendEmailId,
      createdAt: n.createdAt,
    },
  });

  await prisma.emailLog.update({ where: { id: n.id }, data: { leadId: lead.id } });
  if (match) await prisma.emailLog.update({ where: { id: match.id }, data: { leadId: lead.id } });

  console.log(`created lead: ${parsed.name} (${parsed.leadType}) — ${n.createdAt.toISOString().slice(0, 10)}${match ? ' — ' + match.toEmail : ''}`);
  created++;
}

console.log(`\nDone. Created ${created} leads, skipped ${skipped}.`);
await prisma.$disconnect();
