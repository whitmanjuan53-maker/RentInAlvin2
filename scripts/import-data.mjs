// Imports a data-export.json produced by export-data.mjs into the database
// pointed at by DATABASE_URL. Skips records whose id already exists.
// Usage: node scripts/import-data.mjs [input.json]
import { readFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const file = process.argv[2] || 'data-export.json';
const data = JSON.parse(readFileSync(file, 'utf8'));

async function importTable(name, model, rows) {
  let created = 0, skipped = 0;
  for (const row of rows) {
    const exists = await model.findUnique({ where: { id: row.id }, select: { id: true } }).catch(() => null);
    if (exists) { skipped++; continue; }
    // Convert date strings back to Date objects
    for (const k of Object.keys(row)) {
      if (typeof row[k] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(row[k]) && (k.endsWith('At') || k.startsWith('week'))) {
        row[k] = new Date(row[k]);
      }
    }
    await model.create({ data: row });
    created++;
  }
  console.log(`${name}: created ${created}, skipped ${skipped}`);
}

await importTable('leads', prisma.lead, data.leads || []);
await importTable('tours', prisma.tour, data.tours || []);
await importTable('applications', prisma.application, data.applications || []);
await importTable('emailLogs', prisma.emailLog, data.emailLogs || []);
await importTable('analyticsEvents', prisma.analyticsEvent, data.analyticsEvents || []);
await importTable('weeklyReports', prisma.weeklyReport, data.weeklyReports || []);

console.log('\nImport complete.');
await prisma.$disconnect();
