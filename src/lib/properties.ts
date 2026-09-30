import { prisma, isDbReady } from './db';
import { COMMUNITIES } from './data';
import { resolvePropertyGallery } from './property-gallery';

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
  galleryManaged: boolean;
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
  galleryManaged: false,
  amenities: [],
  availability: c.comingSoon ? 'Coming soon' : 'Available now',
  featured: !c.comingSoon && i < 3,
  published: true,
  comingSoon: !!c.comingSoon,
  img: c.img,
}));

function toView(p: {
  id: string; slug: string; name: string; addr: string; tag: string; units: string;
  price: string; description: string; gallery: string[]; galleryManaged: boolean; amenities: string[];
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
    galleryManaged: p.galleryManaged,
    amenities: p.amenities,
    availability: p.availability,
    featured: p.featured,
    published: p.published,
    comingSoon: p.availability === 'Coming soon',
  };
}

function withCanonicalGallery(view: PropertyView): PropertyView {
  const canonical = STATIC_PROPERTIES.find((property) => property.slug === view.slug);
  return canonical
    ? { ...view, gallery: resolvePropertyGallery(canonical.gallery, view.gallery, view.galleryManaged) }
    : view;
}

// Public read: database first, static fallback on empty/error. Only published rows.
export async function getProperties(): Promise<PropertyView[]> {
  if (!isDbReady() || !prisma) return STATIC_PROPERTIES;
  try {
    const rows = await prisma.property.findMany({ orderBy: { sortOrder: 'asc' } });
    if (rows.length === 0) return STATIC_PROPERTIES;
    return rows.filter((r) => r.published).map((row) => withCanonicalGallery(toView(row)));
  } catch {
    console.warn('[PROPERTIES] DB read unavailable, using built-in property list.');
    return STATIC_PROPERTIES;
  }
}

// Manager read: every row (including unpublished), for the dashboard.
// Falls back to the built-in list if the table does not exist yet or the DB is down,
// so the dashboard is always viewable (saves require the table to exist).
export async function getAllPropertiesForAdmin(): Promise<PropertyView[]> {
  if (!isDbReady() || !prisma) return STATIC_PROPERTIES;
  try {
    const rows = await prisma.property.findMany({ orderBy: { sortOrder: 'asc' } });
    if (rows.length === 0) return STATIC_PROPERTIES;
    // The manager sees the same effective gallery as the public site. Legacy
    // rows receive the committed baseline; manager-controlled rows retain the
    // exact saved order.
    return rows.map((row) => withCanonicalGallery(toView(row)));
  } catch {
    console.warn('[PROPERTIES] DB read unavailable, using built-in property list.');
    return STATIC_PROPERTIES;
  }
}
