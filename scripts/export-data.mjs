// Exports all analytics/lead data to a JSON file for migration between
// databases. Usage: node scripts/export-data.mjs [output.json]
import { writeFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const out = process.argv[2] || 'data-export.json';

const [leads, tours, applications, emailLogs, analyticsEvents, weeklyReports] = await Promise.all([
  prisma.lead.findMany(),
  prisma.tour.findMany(),
  prisma.application.findMany(),
  prisma.emailLog.findMany(),
  prisma.analyticsEvent.findMany(),
  prisma.weeklyReport.findMany(),
]);

const data = { exportedAt: new Date().toISOString(), leads, tours, applications, emailLogs, analyticsEvents, weeklyReports };
writeFileSync(out, JSON.stringify(data, null, 1));
console.log(`Exported to ${out}:`);
console.log(`  leads: ${leads.length}, tours: ${tours.length}, applications: ${applications.length}`);
console.log(`  emailLogs: ${emailLogs.length}, analyticsEvents: ${analyticsEvents.length}, weeklyReports: ${weeklyReports.length}`);
await prisma.$disconnect();
