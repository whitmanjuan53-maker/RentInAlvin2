import { prisma, isDbReady } from './db';
import { COMMUNITIES } from './data';

// A property in the shape the public pages already expect (COMMUNITIES-compatible),
// plus the fields the manager dashboard edits.
export interface PropertyView {
  id: string;
  slug: string;
  name: string;
  addr: string;
  tag: string;
  units: string;
  price: string;
  note: string;          // description (kept as `note` for public-page compatibility)
  gallery: string[];
  amenities: string[];
  availability: string;  // Available now | Coming soon | Waitlist | Not listed
  featured: boolean;
  published: boolean;
  comingSoon: boolean;   // derived from availability, for public-page compatibility
  img?: string;
}

// Stable slugs matching the booking form ids where possible.
const SLUGS = ['kings-haven', 'kings-manor', 'kings-haven-100', 'french-quarter', 'white-house', 'royal-oaks'];

// Fallback data derived from the hardcoded COMMUNITIES. Used whenever the database
// is empty or unreachable, so the public site never breaks.
export const STATIC_PROPERTIES: PropertyView[] = COMMUNITIES.map((c, i) => ({
  id: SLUGS[i] || `property-${i}`,
  slug: SLUGS[i] || `property-${i}`,
  name: c.name,
  addr: c.addr,
  tag: c.tag || '',
  units: c.units || '',
  price: c.price || '',
  note: c.note || '',
  gallery: c.gallery || [],
  amenities: [],
  availability: c.comingSoon ? 'Coming soon' : 'Available now',
  featured: !c.comingSoon && i < 3,
  published: true,
  comingSoon: !!c.comingSoon,
  img: c.img,
}));

function toView(p: {
  id: string; slug: string; name: string; addr: string; tag: string; units: string;
  price: string; description: string; gallery: string[]; amenities: string[];
  availability: string; featured: boolean; published: boolean;
}): PropertyView {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    addr: p.addr,
    tag: p.tag,
    units: p.units,
    price: p.price,
    note: p.description,
    gallery: p.gallery,
    amenities: p.amenities,
    availability: p.availability,
    featured: p.featured,
    published: p.published,
    comingSoon: p.availability === 'Coming soon',
  };
}

// Public read: database first, static fallback on empty/error. Only published rows.
export async function getProperties(): Promise<PropertyView[]> {
  if (!isDbReady() || !prisma) return STATIC_PROPERTIES;
  try {
    const rows = await prisma.property.findMany({ orderBy: { sortOrder: 'asc' } });
    if (rows.length === 0) return STATIC_PROPERTIES;
    return rows.filter((r) => r.published).map(toView);
  } catch (err) {
    console.error('[PROPERTIES] DB read failed, using static fallback:', err);
    return STATIC_PROPERTIES;
  }
}

// Manager read: every row (including unpublished), for the dashboard.
export async function getAllPropertiesForAdmin(): Promise<PropertyView[]> {
  if (!isDbReady() || !prisma) return STATIC_PROPERTIES;
  const rows = await prisma.property.findMany({ orderBy: { sortOrder: 'asc' } });
  if (rows.length === 0) return STATIC_PROPERTIES;
  return rows.map(toView);
}
