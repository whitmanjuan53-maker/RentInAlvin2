import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export async function prepareReportSettings(prisma) {
  // A fixed, additive statement: never drops data or overwrites a recipient.
  const sql = readFileSync(new URL('../prisma/report-settings.sql', import.meta.url), 'utf8');
  await prisma.$transaction(async (tx) => {
    // Serialize concurrent production builds before the idempotent CREATE.
    await tx.$executeRawUnsafe('SELECT pg_advisory_xact_lock(724186301)');
    await tx.$executeRawUnsafe(sql);
    await tx.reportSettings.findUnique({ where: { id: 'weekly' } });
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.env.VERCEL_ENV !== 'production' && !process.argv.includes('--apply')) {
    console.log('[REPORT SETTINGS] Skipped outside production. Use --apply for a configured staging database.');
  } else {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required to prepare report settings.');
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    try {
      await prepareReportSettings(prisma);
      console.log('[REPORT SETTINGS] Table verified. Existing recipient preserved.');
    } finally {
      await prisma.$disconnect();
    }
  }
}
