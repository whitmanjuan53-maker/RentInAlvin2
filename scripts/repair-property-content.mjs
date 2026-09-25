// One-time repair for the September 2026 galleries already deployed as static assets.
// Preview: node scripts/repair-property-content.mjs
// Apply with the intended DATABASE_URL: node scripts/repair-property-content.mjs --apply
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const repairs = JSON.parse(readFileSync(new URL('./property-content-repair.json', import.meta.url), 'utf8'));

export function repairPatch(property, repair) {
  const data = {};
  // Only the exact observed legacy list qualifies. Preserve later manager edits.
  if (JSON.stringify(property.gallery) === JSON.stringify(repair.beforeGallery) &&
      JSON.stringify(property.gallery) !== JSON.stringify(repair.afterGallery)) {
    data.gallery = repair.afterGallery;
  }
  if (repair.beforeAvailability && property.availability === repair.beforeAvailability) {
    data.availability = repair.afterAvailability;
  }
  return data;
}

export async function repairContent(prisma, apply, log = console.log, selectedRepairs = repairs) {
  await prisma.$transaction(async (tx) => {
    for (const repair of selectedRepairs) {
      const property = await tx.property.findUnique({ where: { slug: repair.slug } });
      if (!property) throw new Error(`Missing property: ${repair.slug}`);
      const data = repairPatch(property, repair);
      if (!Object.keys(data).length) {
        log(`Unchanged (already repaired or edited): ${repair.slug}`);
        continue;
      }
      if (apply) {
        const result = await tx.property.updateMany({
          where: { id: property.id, updatedAt: property.updatedAt },
          data,
        });
        if (result.count !== 1) throw new Error(`Concurrent edit: ${repair.slug}; repair rolled back.`);
      }
      log(`${apply ? 'Repaired' : 'Would repair'} ${repair.slug}: ${Object.keys(data).join(', ')}`);
    }
  }, { timeout: 30000 });
}

async function main() {
  const deployment = process.argv.includes('--production-deploy');
  if (deployment && process.env.VERCEL_ENV !== 'production') {
    console.log('Skipping content repair outside Vercel production.');
    return;
  }
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required for content repair.');
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const selectedRepairs = process.argv.includes('--kings-haven-100')
      ? JSON.parse(readFileSync(new URL('./kings-haven-100-repair.json', import.meta.url), 'utf8'))
      : repairs;
    await repairContent(prisma, deployment || process.argv.includes('--apply'), console.log, selectedRepairs);
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => {
    // Do not include connection strings or credentials in build logs.
    console.error('Property content repair failed. No partial repair was committed.');
    process.exitCode = 1;
  });
}
