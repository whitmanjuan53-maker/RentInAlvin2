// Seeds the Property table from the current hardcoded COMMUNITIES so the site
// looks identical, then managers edit from there. Safe to re-run: upserts by slug.
// Usage: node scripts/seed-properties.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SLUGS = ['kings-haven', 'kings-manor', 'kings-haven-100', 'french-quarter', 'white-house', 'royal-oaks'];

// Mirror of src/lib/data.ts COMMUNITIES (kept inline so this script has no TS deps).
const COMMUNITIES = [
  { name: 'Kings Haven Apartments', addr: '410 S 2nd St', tag: 'Flagship · Office on-site', units: '2BR · 1BA · 850 sq ft', price: 'from $890', note: 'Headquarters of Yellowstone Management. Walkable to downtown Alvin.', gallery: ['/images/kings-haven/01-001-cmup.jpg','/images/kings-haven/02-001-dard.jpg','/images/kings-haven/03-001-p00q.jpg','/images/kings-haven/04-001-yf4i.jpg','/images/kings-haven/05-001-yp1q.jpg','/images/kings-haven/06-002-bzmx.jpg','/images/kings-haven/07-002-twdh.jpg','/images/kings-haven/08-003-83lx.jpg','/images/kings-haven/09-003-btkm.jpg','/images/kings-haven/10-004-c4qy.jpg','/images/kings-haven/11-006-xrk5.jpg'] },
  { name: 'Kings Manor Townhomes', addr: '328 S 2nd St', tag: 'Townhome', units: '2BR · 2.5BA · 3BR · 2.5BA · 1,250 sq ft', price: 'from $1,250', note: 'Two-story townhomes with private entries and 2.5 baths.', gallery: ['/images/kings-manor/01-exterior-front.jpg','/images/kings-manor/02-community-grounds.jpg','/images/kings-manor/03-living-room-fireplace.jpg','/images/kings-manor/04-living-room-entry.jpg','/images/kings-manor/05-living-room-alt.jpg','/images/kings-manor/06-kitchen-staged.jpg','/images/kings-manor/07-kitchen-bar.jpg','/images/kings-manor/08-kitchen-empty.jpg','/images/kings-manor/09-dining-entry.jpg','/images/kings-manor/10-bedroom-master.jpg','/images/kings-manor/11-bedroom-window.jpg','/images/kings-manor/12-bedroom-closets.jpg','/images/kings-manor/13-bedroom-light.jpg','/images/kings-manor/14-bathroom-vanity.jpg','/images/kings-manor/15-bathroom-double.jpg','/images/kings-manor/16-bathroom-tub.jpg','/images/kings-manor/17-bathroom-tub-alt.jpg','/images/kings-manor/18-powder-room.jpg','/images/kings-manor/19-closet.jpg','/images/kings-manor/20-laundry.jpg'] },
  { name: 'Kings Haven Apartments', addr: '100 S 2nd St', tag: 'Apartments', units: '2BR · 1BA · 850 sq ft', price: 'from $850', note: 'Quiet block near 100 S 2nd; renovated interiors.', gallery: [] },
  { name: 'French Quarter Residency', addr: '2550 S Bypass 35', tag: 'Apartments', units: '2BR · 1BA · 850 sq ft', price: 'from $950', note: 'Larger community along the bypass with ample parking.', gallery: ['/images/french-quarter/01-exterior-front.png','/images/french-quarter/02-exterior-street.png','/images/french-quarter/03-kitchen-classic.jpg','/images/french-quarter/04-kitchen-updated.jpg','/images/french-quarter/05-bathroom.jpg','/images/french-quarter/06-living-room.jpg','/images/french-quarter/07-dining-kitchen.jpg','/images/french-quarter/08-bedroom.jpg'] },
  { name: 'The White House Apartments', addr: '1606 W Sealy St', tag: 'Apartments', units: '2BR · 1BA · 850 sq ft', price: 'from $900', note: 'Classic white-clad apartments on a quiet residential street.', gallery: [] },
  { name: 'The Royal Oaks Townhomes', addr: '418 S Jackson St', tag: 'Townhome', units: '2BR · 2BA · 1,150 sq ft', price: 'from $1,350', note: 'Spacious townhomes under mature oak canopy.', gallery: [], comingSoon: true },
];

let created = 0, updated = 0;
for (let i = 0; i < COMMUNITIES.length; i++) {
  const c = COMMUNITIES[i];
  const slug = SLUGS[i];
  const data = {
    name: c.name, addr: c.addr, tag: c.tag || '', units: c.units || '',
    price: c.price || '', description: c.note || '', gallery: c.gallery || [],
    amenities: [], availability: c.comingSoon ? 'Coming soon' : 'Available now',
    featured: !c.comingSoon && i < 3, published: true, sortOrder: i,
  };
  const existing = await prisma.property.findUnique({ where: { slug } }).catch(() => null);
  if (existing) {
    // Only re-seed if it still matches the seed (never clobber manager edits): skip if updated since create.
    await prisma.property.update({ where: { slug }, data: {} }); // touch nothing
    updated++;
    console.log(`skip (exists): ${slug}`);
  } else {
    await prisma.property.create({ data: { slug, ...data } });
    created++;
    console.log(`created: ${slug}`);
  }
}
console.log(`\nDone. created ${created}, existing ${updated}.`);
await prisma.$disconnect();
