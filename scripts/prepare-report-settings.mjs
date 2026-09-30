import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export async function prepareReportSettings(prisma) {
  // Fixed, additive statements: never drop or overwrite existing data.
  const reportSql = readFileSync(new URL('../prisma/report-settings.sql', import.meta.url), 'utf8');
  const managerGallerySql = readFileSync(new URL('../prisma/manager-gallery.sql', import.meta.url), 'utf8');
  await prisma.$transaction(async (tx) => {
    // Serialize concurrent production builds before the idempotent changes.
    await tx.$executeRawUnsafe('SELECT pg_advisory_xact_lock(724186301)');
    await tx.$executeRawUnsafe(reportSql);
    await tx.$executeRawUnsafe(managerGallerySql);
    await tx.reportSettings.findUnique({ where: { id: 'weekly' } });
    await tx.property.findFirst({ select: { galleryManaged: true } });
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
      console.log('[PRODUCTION SCHEMA] Report settings and manager galleries verified. Existing data preserved.');
    } finally {
      await prisma.$disconnect();
    }
  }
}
