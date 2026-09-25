// Preview by default; pass --apply after deploying the current site.
// Requires DATABASE_URL for the intended database.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const where = { slug: 'royal-oaks', availability: 'Coming soon' };
try {
  if (process.argv.includes('--apply')) {
    const result = await prisma.property.updateMany({ where, data: { availability: 'Available now' } });
    console.log(`Updated ${result.count} Royal Oaks availability record(s).`);
  } else {
    const count = await prisma.property.count({ where });
    console.log(`Would update ${count} Royal Oaks availability record(s). Use --apply to save.`);
  }
} catch (error) {
  console.error('Availability update failed:', error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
