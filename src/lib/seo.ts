import { COMMUNITIES, BUSINESS } from './data';

// ---------------------------------------------------------------------------
// Per-property SEO layer.
//
// COMMUNITIES (data.ts) stays the single source of truth for the visible
// listing facts (name, address, price, gallery). This file *enriches* each
// community with the extra fields a dedicated, crawlable property page needs:
// a stable URL slug, geo coordinates, numeric beds/baths/sqft for schema, and
// unique long-form local content. The two arrays are merged by position, so
// keep ENRICH in the same order as COMMUNITIES.
// ---------------------------------------------------------------------------

export type PropertyType = 'Apartments' | 'Townhomes';

type Enrichment = {
  slug: string;
  type: PropertyType;
  lat: number;
  lng: number;
  beds: number;
  baths: number;
  sqft: number;
  priceFrom: number;
  neighborhood: string;
  amenities: string[];
  /** 2–4 paragraphs of unique prose. Server-rendered so crawlers + AI read it. */
  paragraphs: string[];
  faqs: { q: string; a: string }[];
};

// Same order as COMMUNITIES in data.ts.
const ENRICH: Enrichment[] = [
  // 0 — Kings Haven Apartments · 410 S 2nd St (flagship / office)
  {
    slug: 'kings-haven-apartments',
    type: 'Apartments',
    lat: 29.4208044,
    lng: -95.2554917,
    beds: 2,
    baths: 1,
    sqft: 850,
    priceFrom: 890,
    neighborhood: 'Downtown Alvin',
    amenities: [
      'On-site leasing office',
      'Assigned parking',
      'Walkable to downtown Alvin',
      'Renovated interiors',
      'Local on-call maintenance',
      'Online rent payment & maintenance portal',
    ],
    paragraphs: [
      'Kings Haven Apartments at 410 S 2nd Street is the flagship community of Yellowstone Asset Management and home to our on-site leasing office in Alvin, Texas. Each two-bedroom, one-bath apartment offers roughly 850 square feet of comfortable, move-in-ready living space with renovated interiors and at least one assigned parking spot. Because our office is right here, maintenance and leasing questions are answered by a local team that knows the building.',
      'The location is one of the most walkable in Alvin. You are just a couple of blocks from downtown Alvin, City Hall, the Alvin Farmers Market, and the shops and restaurants along Gordon Street, with quick access to TX-35 and Highway 6 for the commute toward Pearland, the Texas Medical Center, and the NASA / Clear Lake area. Alvin Community College is a short drive away, making this a practical home base for students and staff.',
      'Kings Haven apartments are zoned to Alvin ISD. Rent starts from $890/month and availability is updated weekly. Water and trash are billed separately, and most units welcome cats and dogs under 50 lbs. To see a unit, call our office at (832) 210-3968 or schedule a tour online — we typically decide applications within 48 hours.',
    ],
    faqs: [
      { q: 'How much is rent at Kings Haven Apartments in Alvin?', a: 'Two-bedroom, one-bath apartments at 410 S 2nd St start from $890/month. Pricing depends on the specific unit and current availability — call (832) 210-3968 for today’s openings.' },
      { q: 'Is the leasing office at Kings Haven?', a: 'Yes. 410 S 2nd Street is our flagship community and the on-site home of Yellowstone Asset Management’s leasing office, so tours and applications are handled right here.' },
      { q: 'Is Kings Haven close to downtown Alvin?', a: 'Yes — it sits a couple of blocks from downtown Alvin and is walkable to City Hall, local shops, and the farmers market, with fast access to TX-35 and Hwy 6.' },
    ],
  },
  // 1 — Kings Manor Townhomes · 328 S 2nd St
  {
    slug: 'kings-manor-townhomes',
    type: 'Townhomes',
    lat: 29.4213292,
    lng: -95.2556986,
    beds: 3,
    baths: 2.5,
    sqft: 1250,
    priceFrom: 1250,
    neighborhood: 'Downtown Alvin',
    amenities: [
      'Two-story townhome layout',
      'Private entry',
      '2.5 bathrooms',
      'Private driveway',
      'In-unit laundry',
      'Fireplace (select homes)',
    ],
    paragraphs: [
      'Kings Manor Townhomes at 328 S 2nd Street offers two- and three-bedroom townhomes for rent in the heart of Alvin, Texas. Each two-story home includes 2.5 bathrooms, a private entry, in-unit laundry, and a private driveway across roughly 1,250 square feet — the extra space and privacy of a townhome without leaving central Alvin. Select homes feature a living-room fireplace.',
      'Located just south of downtown Alvin and a short walk from our Kings Haven leasing office, Kings Manor puts you minutes from TX-35, Highway 6, Alvin Community College, and the everyday essentials along South Bypass 35. The commute reaches Pearland in roughly 15 minutes and the NASA / Clear Lake and Texas Medical Center areas in about 30–35 minutes.',
      'Kings Manor is leased and maintained by Yellowstone Asset Management’s local team and zoned to Alvin ISD. Townhomes start from $1,250/month with a three-bed, 2.5-bath layout recently available from $1,595. Every home includes at least one assigned space plus the private driveway. To tour, call (832) 210-3968 or book online.',
    ],
    faqs: [
      { q: 'How much is rent at Kings Manor Townhomes?', a: 'Two- and three-bedroom townhomes at 328 S 2nd St start from $1,250/month, with three-bed, 2.5-bath homes recently listed from $1,595. Call (832) 210-3968 for current availability.' },
      { q: 'Do Kings Manor townhomes have a private driveway?', a: 'Yes. Each Kings Manor townhome includes a private driveway and at least one assigned parking space, plus free guest parking.' },
      { q: 'How many bathrooms do Kings Manor townhomes have?', a: 'Each two-story townhome has 2.5 bathrooms — a full bath upstairs by the bedrooms and a convenient half bath on the main floor.' },
    ],
  },
  // 2 — Kings Haven Apartments · 100 S 2nd St (disambiguated)
  {
    slug: 'kings-haven-100-s-2nd-st',
    type: 'Apartments',
    lat: 29.423362,
    lng: -95.255767,
    beds: 1,
    baths: 1,
    sqft: 600,
    priceFrom: 850,
    neighborhood: 'North 2nd Street',
    amenities: [
      'Renovated interiors',
      'Quiet residential block',
      'Assigned parking',
      'One- and two-bedroom layouts',
      'Oak-shaded grounds',
      'Local on-call maintenance',
    ],
    paragraphs: [
      'This Kings Haven community at 100 S 2nd Street sits on a quiet, oak-shaded block at the north end of 2nd Street in Alvin, Texas. It’s a smaller, low-density building with renovated interiors — a good fit for renters who want a calm setting and one of the most affordable starting rents in our Alvin portfolio. One-bedroom homes run about 600 square feet from $850, with roomier two-bedroom, one-bath layouts around 850 square feet.',
      'You are minutes from downtown Alvin and our 410 S 2nd Street leasing office, with easy access to TX-35, Highway 6, and Alvin Community College. The block is residential and quiet, yet close enough that errands, dining, and the commute toward Pearland and Houston stay short.',
      'Like all Yellowstone Asset Management communities, this building is zoned to Alvin ISD, includes assigned parking, and is supported by a local maintenance team. Water and trash are billed separately and most units welcome pets under 50 lbs. Call (832) 210-3968 or apply online to check current openings.',
    ],
    faqs: [
      { q: 'What are the cheapest apartments at Kings Haven on 100 S 2nd St?', a: 'One-bedroom apartments here start from $850/month at about 600 square feet — among the most affordable starting rents in our Alvin portfolio. Two-bedroom layouts are also available.' },
      { q: 'Is 100 S 2nd Street a quiet location?', a: 'Yes. It’s a smaller, low-density building on a quiet, oak-shaded residential block at the north end of 2nd Street, while still being minutes from downtown Alvin.' },
    ],
  },
  // 3 — French Quarter Residency · 2550 S Bypass 35
  {
    slug: 'french-quarter-residency',
    type: 'Apartments',
    lat: 29.40315,
    lng: -95.23971,
    beds: 2,
    baths: 1,
    sqft: 850,
    priceFrom: 950,
    neighborhood: 'South Bypass 35',
    amenities: [
      'On-site laundry',
      'BBQ & picnic area',
      'Ample parking',
      'Larger community',
      'Renovated interiors',
      'Quick TX-35 access',
    ],
    paragraphs: [
      'French Quarter Residency at 2550 S Bypass 35 is one of our larger Alvin communities, set along the South Bypass 35 corridor with ample parking and quick highway access. Two-bedroom, one-bath apartments offer about 850 square feet of updated living space from $950/month, with both classic and renovated kitchen finishes available.',
      'This community is built for convenience. It includes on-site laundry plus a shared BBQ and picnic area, and its position right on Bypass 35 makes the drive toward Pearland, Manvel, and Houston straightforward. Everyday shopping, groceries, and dining along the bypass are just minutes away, and Alvin Community College and downtown Alvin are a short drive north.',
      'French Quarter is managed by Yellowstone Asset Management’s local team and zoned to Alvin ISD. Assigned parking is included with every unit, water and trash are billed separately, and most homes welcome cats and dogs under 50 lbs. Call (832) 210-3968 or schedule a tour online to see what’s available now.',
    ],
    faqs: [
      { q: 'Does French Quarter Residency have on-site laundry?', a: 'Yes. French Quarter includes on-site laundry along with a shared BBQ and picnic area, plus ample parking — it’s one of our larger Alvin communities.' },
      { q: 'How much is rent at French Quarter in Alvin?', a: 'Two-bedroom, one-bath apartments at 2550 S Bypass 35 start from $950/month. Call (832) 210-3968 for current availability.' },
      { q: 'Is French Quarter easy to reach from the highway?', a: 'Yes — it sits directly on South Bypass 35 with ample parking, making the commute toward Pearland, Manvel, and Houston quick and simple.' },
    ],
  },
  // 4 — The White House Apartments · 1606 W Sealy St
  {
    slug: 'the-white-house-apartments',
    type: 'Apartments',
    lat: 29.4234731,
    lng: -95.2600658,
    beds: 2,
    baths: 1,
    sqft: 850,
    priceFrom: 900,
    neighborhood: 'West Sealy Street',
    amenities: [
      'Quiet residential street',
      'Classic white-clad exteriors',
      'Assigned parking',
      'Renovated interiors',
      'Two-bedroom layouts',
      'Local on-call maintenance',
    ],
    paragraphs: [
      'The White House Apartments at 1606 W Sealy Street are classic white-clad apartment homes on a quiet, established residential street in Alvin, Texas. Two-bedroom, one-bath apartments offer about 850 square feet from $900/month, with renovated interiors and the calm, neighborly setting renters consistently ask for.',
      'West Sealy Street keeps you close to everything that matters in Alvin while staying off the busier corridors. You’re a short drive from downtown Alvin, Alvin Community College, and TX-35, with an easy route toward Pearland and Houston for work. It’s a practical, low-key location for families and professionals who want quiet without giving up convenience.',
      'The White House is leased and maintained by Yellowstone Asset Management’s local team and zoned to Alvin ISD. Every unit includes assigned parking, water and trash are billed separately, and most homes welcome pets under 50 lbs. Call (832) 210-3968 or apply online to check availability.',
    ],
    faqs: [
      { q: 'Are The White House Apartments in a quiet area?', a: 'Yes. They sit on a quiet, established residential street on West Sealy in Alvin — a calm setting that’s still a short drive from downtown and TX-35.' },
      { q: 'How much is rent at The White House Apartments?', a: 'Two-bedroom, one-bath apartments at 1606 W Sealy St start from $900/month. Call (832) 210-3968 for current openings.' },
    ],
  },
  // 5 — The Royal Oaks Townhomes · 418 S Jackson St (coming soon)
  {
    slug: 'the-royal-oaks-townhomes',
    type: 'Townhomes',
    lat: 29.4208186,
    lng: -95.2497543,
    beds: 2,
    baths: 2,
    sqft: 1150,
    priceFrom: 1350,
    neighborhood: 'South Jackson Street',
    amenities: [
      'Spacious two-story townhomes',
      'Mature oak canopy',
      '2 full bathrooms',
      'Private entry',
      'Assigned parking',
      'Coming soon',
    ],
    paragraphs: [
      'The Royal Oaks Townhomes at 418 S Jackson Street are spacious two-story townhomes set under a mature oak canopy in Alvin, Texas. Each two-bedroom, two-bath home offers about 1,150 square feet with a private entry and the room to spread out that a townhome provides. Royal Oaks is coming soon — join the interest list now to be first in line.',
      'The South Jackson Street location keeps you close to downtown Alvin, Alvin Community College, and TX-35, with a quick connection toward Pearland and Houston. Shaded streets and a residential setting make it an appealing option for renters who want a quieter, established part of Alvin.',
      'Royal Oaks will be leased and maintained by Yellowstone Asset Management’s local team and zoned to Alvin ISD, with assigned parking included. Townhomes are expected to start from $1,350/month. To be notified the moment homes are released, call (832) 210-3968 or register your interest online.',
    ],
    faqs: [
      { q: 'When will The Royal Oaks Townhomes be available?', a: 'Royal Oaks at 418 S Jackson St is coming soon. Call (832) 210-3968 or register online to join the interest list and be notified the moment homes are released.' },
      { q: 'How big are the Royal Oaks townhomes?', a: 'Each two-story townhome is about 1,150 square feet with two bedrooms, two full bathrooms, and a private entry, expected to start from $1,350/month.' },
    ],
  },
];

export type Property = (typeof COMMUNITIES)[number] & Enrichment;

export const PROPERTIES: Property[] = COMMUNITIES.map((c, i) => ({
  ...c,
  ...ENRICH[i],
}));

export function getPropertyBySlug(slug: string): Property | undefined {
  return PROPERTIES.find((p) => p.slug === slug);
}

/** Full street address as one line, e.g. "410 S 2nd St, Alvin, TX 77511". */
export function fullAddress(p: Property): string {
  return `${p.addr}, ${BUSINESS.city}, ${BUSINESS.region} ${BUSINESS.zip}`;
}

/** Build a descriptive, room-aware alt text from an image path. */
export function altFromImage(p: Property, src: string): string {
  const file = src.split('/').pop() || '';
  const stem = file.replace(/\.[a-z0-9]+$/i, '');
  const words = stem
    .replace(/^\d+[-_]?/, '') // strip leading index like "03-"
    .replace(/[-_]/g, ' ')
    .replace(/\b\d{3,}\b/g, '') // strip stray id numbers
    .replace(/\b[a-z0-9]{4}\b/gi, (m) => (/^[a-z]+$/i.test(m) ? m : '')) // drop hash-like tokens
    .replace(/\s+/g, ' ')
    .trim();
  const detail = words ? `${words} — ` : '';
  return `${p.name} ${detail}${p.type.replace(/s$/, '').toLowerCase()} for rent in Alvin, TX`.replace(/\s+—\s+/, ' — ');
}
