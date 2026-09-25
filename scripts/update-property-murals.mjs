// Preview: node scripts/update-property-murals.mjs
// Apply after deploying the image files: node scripts/update-property-murals.mjs --apply
// DATABASE_URL must point to the intended database. Only gallery fields change.
import { readFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';

const murals = JSON.parse(readFileSync(new URL('./property-murals.json', import.meta.url), 'utf8'));
const frenchQuarterGallery = JSON.parse(readFileSync(new URL('../src/lib/french-quarter-gallery.json', import.meta.url), 'utf8'));
const royalOaksGallery = JSON.parse(readFileSync(new URL('../src/lib/royal-oaks-gallery.json', import.meta.url), 'utf8'));
const apply = process.argv.includes('--apply');
const prisma = new PrismaClient();

try {
  await prisma.$transaction(async (tx) => {
    for (const [slug, mural] of Object.entries(murals)) {
      const property = await tx.property.findUnique({ where: { slug } });
      if (!property) {
        console.log(`Missing property (skipped): ${slug}`);
        continue;
      }
      const orderedPhotos = slug === 'royal-oaks' ? royalOaksGallery : slug === 'french-quarter' ? frenchQuarterGallery : [mural];
      const gallery = [...orderedPhotos, ...property.gallery.filter((src) => !orderedPhotos.includes(src))];
      if (JSON.stringify(gallery) === JSON.stringify(property.gallery)) {
        console.log(`Already current: ${slug}`);
        continue;
      }
      if (apply) {
        // Abort instead of overwriting a gallery edited after the read.
        const result = await tx.property.updateMany({
          where: { id: property.id, updatedAt: property.updatedAt },
          data: { gallery },
        });
        if (result.count !== 1) throw new Error(`Gallery changed concurrently: ${slug}. Retry the update.`);
      }
      console.log(`${apply ? 'Updated' : 'Would update'} ${slug}: ${gallery.length} photos; first: ${mural}`);
    }
  });
} catch (error) {
  console.error('Mural update failed; no changes committed.', error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
