# RentInAlvin.com — Complete SEO Audit & Implementation Plan

**Audited:** the actual codebase (Next.js 16 App Router, `src/app`, `src/lib/data.ts`).
**Date:** 2026-06-19
**Auditor scope:** technical SEO, local SEO, real-estate listing SEO, structured data, content, AI-overview readiness.

---

## 0. The headline finding (read this first)

The brief asks to rank **property pages** for property name, full address, city, neighborhood, type, and "near me" searches.

**There are currently no property pages.** The six communities exist only as objects in `COMMUNITIES` (`src/lib/data.ts`) rendered as cards + a JS modal on the homepage (`src/app/page.tsx`). Consequences:

- Google has **one** URL (`/`) carrying six properties → it cannot rank a unique page for "Kings Manor Townhomes" or "328 S 2nd St Alvin TX."
- The property detail content lives inside a client-side modal (`PropertyModal.tsx`) → much of it is not in the initial HTML and is invisible to crawlers/AI.
- There is **no `sitemap.xml` and no `robots.txt`** (the `public/` folder contains only `images/`).

**Fix order:** (1) generate per-property pages, (2) add sitemap + robots, (3) add per-page metadata + canonicals, (4) add structured data, (5) enrich content, (6) off-site/local citations.

---

## 1. Technical SEO Audit

| # | Issue | Severity | Evidence in code | Fix |
|---|-------|----------|------------------|-----|
| 1.1 | **No per-property pages** | 🔴 Critical | `COMMUNITIES` rendered only on `/` | Create `/communities/[slug]` dynamic route (§2) |
| 1.2 | **No `sitemap.xml`** | 🔴 Critical | no `sitemap.ts`/`sitemap.xml` | Add `src/app/sitemap.ts` (§1A) |
| 1.3 | **No `robots.txt`** | 🔴 Critical | `public/` only has `images/` | Add `src/app/robots.ts` (§1B) |
| 1.4 | **Homepage is `'use client'`** | 🟠 High | `src/app/page.tsx:1` and `es/page.tsx:1` | Can't export `metadata` from a client page; move metadata to a server wrapper or split server/client (§1C) |
| 1.5 | **`/es` has no own metadata** | 🟠 High | no `metadata` export in `es/page.tsx` | `/es` inherits the English root title AND the root canonical `https://rentinalvin.com` → Spanish page self-canonicalizes to English homepage = duplicate/wrong hreflang (§1C, §1D) |
| 1.6 | **Canonical hardcoded to homepage** | 🟠 High | `layout.tsx:13` `canonical: 'https://rentinalvin.com'` | Root canonical leaks to every route lacking its own. Set canonical per route (§1D) |
| 1.7 | **`images.unoptimized: true`** | 🟠 High | `next.config.js` | No WebP/AVIF, no responsive `srcset` → poor LCP. Re-enable Next/Image optimization or pre-generate responsive images (§1E) |
| 1.8 | **Property detail content in JS modal** | 🟠 High | `PropertyModal.tsx` opened via state | Crawlers/AI see little. Move canonical content to real pages (§2, §5) |
| 1.9 | **Duplicate property name** | 🟡 Medium | two `Kings Haven Apartments` (410 & 100 S 2nd) in `data.ts` | Keyword cannibalization; rename the 100 S 2nd one + unique slug (§2A) |
| 1.10 | **Inconsistent NAP / geo / counts** | 🟡 Medium | geo `29.4238` in `layout.tsx` vs `29.4208` in `MAP_PROPS`; "150+" vs "160 units" vs 6 properties | Pick one canonical NAP + counts; reuse everywhere (§6) |
| 1.11 | **No breadcrumb / FAQ / listing schema** | 🟠 High | only `RealEstateAgent` in `layout.tsx` | Add `RealEstateListing`, `Apartment`, `FAQPage`, `BreadcrumbList` (§4) |
| 1.12 | **Single H1 strategy** | 🟡 Medium | homepage H1 "A home in Alvin, made simple." | Fine for brand, but each property page needs its own keyworded H1 (§2) |
| 1.13 | **No OG image** | 🟡 Medium | `openGraph` has no `images` | Add a real OG image per page for social + AI cards (§2) |
| 1.14 | **Image alt text generic/placeholder** | 🟡 Medium | gallery `alt={prop.name}`; placeholders like `img: 'apartment exterior · brick'` | Descriptive, keyworded alt text (§2C) |

### 1A. Add a dynamic sitemap — `src/app/sitemap.ts`

> **Why:** A sitemap tells Google every URL that should be indexed and how fresh it is. With dynamic property pages this becomes the master index. Next.js App Router auto-serves `sitemap.ts` at `/sitemap.xml`.

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { COMMUNITIES } from '@/lib/data';
import { slugify } from '@/lib/seo'; // see §2A

const BASE = 'https://rentinalvin.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: `${BASE}/`, priority: 1.0 },
    { url: `${BASE}/es`, priority: 0.8 },
    { url: `${BASE}/living-in-alvin`, priority: 0.7 },
    { url: `${BASE}/vivir-en-alvin`, priority: 0.6 },
  ];

  const propertyPages = COMMUNITIES.map((c) => ({
    url: `${BASE}/communities/${slugify(c.name, c.addr)}`,
    priority: 0.9,
  }));

  return [...staticPages, ...propertyPages].map((p) => ({
    ...p,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
  }));
}
```

### 1B. Add robots — `src/app/robots.ts`

> **Why:** Without robots.txt Google guesses. Explicitly allow crawling and point to the sitemap.

```ts
// src/app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: 'https://rentinalvin.com/sitemap.xml',
    host: 'https://rentinalvin.com',
  };
}
```

### 1C. Fix the client-component metadata problem

> **Why:** `export const metadata` and `generateMetadata` are **ignored** in files marked `'use client'`. `src/app/page.tsx` and `src/app/es/page.tsx` are client components, so today they rely entirely on the root `layout.tsx` metadata — which is why `/es` shows an English title.

**Pattern:** keep the interactive UI in a client component, make the route file a server component that owns metadata.

```tsx
// src/app/es/page.tsx  (server component — NO 'use client')
import type { Metadata } from 'next';
import EsClient from './EsClient'; // move current client UI here

export const metadata: Metadata = {
  title: 'Apartamentos y Townhomes en Alquiler en Alvin, TX | RentInAlvin.com',
  description:
    'Administrado por Yellowstone Asset Management. Más de 150 apartamentos y townhomes en 6 comunidades en Alvin, Texas. Renta desde $890. Aplica en línea hoy.',
  alternates: {
    canonical: 'https://rentinalvin.com/es',
    languages: {
      'en-US': 'https://rentinalvin.com',
      'es-US': 'https://rentinalvin.com/es',
    },
  },
};

export default function Page() {
  return <EsClient />;
}
```

Do the same for the English homepage (rename current `page.tsx` body to `HomeClient.tsx`, add a server `page.tsx` with its own `metadata` and `canonical: 'https://rentinalvin.com'`).

### 1D. Canonical + hreflang per route

> **Why:** Right now every page that lacks its own metadata inherits `canonical: https://rentinalvin.com`, telling Google "this page is a duplicate of the homepage." Each URL must self-canonicalize and declare its language alternates.

- `/` → canonical `https://rentinalvin.com`, hreflang en + es.
- `/es` → canonical `https://rentinalvin.com/es`.
- `/communities/[slug]` → canonical to itself.
- `/living-in-alvin` ↔ `/vivir-en-alvin` already do this correctly (good — use as the template).

### 1E. Core Web Vitals / page speed

> **Why:** CWV (LCP, CLS, INP) is a ranking signal and directly affects conversion on mobile.

- `next.config.js` sets `images: { unoptimized: true }`. This ships full-size JP/PNG (your gallery images are large). **Re-enable optimization** (remove `unoptimized` and use `next/image`) or, if you must keep static export, pre-generate `webp`/`avif` + multiple widths and use `<img srcset>`.
- Galleries (`CommunityCard`, `PropertyModal`) load all images eagerly. Add `loading="lazy"` and `decoding="async"` to non-LCP images; mark the first hero/card image `priority`/`fetchpriority="high"`.
- Self-host or `display=swap` the Google Fonts (already `display=swap` — good). Consider trimming the 6 font families loaded in `layout.tsx:47` — each family is bytes + a render dependency. Keep 2–3.
- Set explicit `width`/`height` (or `aspect-ratio`, already used on cards) on every image to prevent CLS.

### 1F. Mobile usability
The site uses responsive flex/grid and a mobile nav (`Nav.tsx`) — good. Verify tap targets ≥48px on the FAB stack and that the property modal is scrollable on small screens. Run each new property URL through Google's Mobile-Friendly Test / Lighthouse mobile.

---

## 2. Property Page SEO Optimization (the core build)

Create a dynamic route: **`src/app/communities/[slug]/page.tsx`**. URL pattern:

```
/communities/kings-haven-apartments
/communities/kings-manor-townhomes
/communities/kings-haven-100-s-2nd-st     ← disambiguated duplicate
/communities/french-quarter-residency
/communities/white-house-apartments
/communities/royal-oaks-townhomes
```

> **Why `/communities/[slug]` and not `/[slug]`:** a clear path segment groups all listings (good for breadcrumbs, internal linking, and a hub page at `/communities`), and avoids slug collisions with future pages.

### 2A. Slug + data helpers — `src/lib/seo.ts`

```ts
// src/lib/seo.ts
export function slugify(name: string, addr?: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  // disambiguate the two "Kings Haven Apartments" by address
  if (name === 'Kings Haven Apartments' && addr?.startsWith('100')) {
    return 'kings-haven-100-s-2nd-st';
  }
  return base; // "The White House Apartments" -> "the-white-house-apartments"
}
```

> **Action:** also extend `COMMUNITIES` with the fields a listing page/schema needs (most already exist elsewhere — consolidate `MAP_PROPS` lat/lng into `COMMUNITIES`): `zip: '77511'`, `lat`, `lng`, `beds`, `baths`, `sqft`, `petPolicy`, `amenities: string[]`, `neighborhood`, and a real prose `description`.

### 2B. The page + per-page metadata

```tsx
// src/app/communities/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { COMMUNITIES } from '@/lib/data';
import { slugify } from '@/lib/seo';

const BASE = 'https://rentinalvin.com';

function getProperty(slug: string) {
  return COMMUNITIES.find((c) => slugify(c.name, c.addr) === slug);
}

export function generateStaticParams() {
  return COMMUNITIES.map((c) => ({ slug: slugify(c.name, c.addr) }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const p = getProperty(slug);
  if (!p) return {};
  const url = `${BASE}/communities/${slug}`;
  const isTownhome = /townhome/i.test(p.tag);
  const type = isTownhome ? 'Townhomes' : 'Apartments';
  const title = `${p.name} — ${type} for Rent at ${p.addr}, Alvin, TX 77511 | RentInAlvin.com`;
  const description =
    `${p.name} in Alvin, TX. ${p.units}, ${p.price}. ${p.note} ` +
    `Managed locally by Yellowstone Asset Management. Tour today — (832) 210-3968.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: p.gallery?.[0] ? [{ url: `${BASE}${p.gallery[0]}` }] : undefined,
    },
  };
}

export default async function PropertyPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const p = getProperty(slug);
  if (!p) notFound();
  // render H1, gallery, details, local content, FAQ, JSON-LD (see §4, §5)
  return <PropertyDetail property={p} />;
}
```

### 2C. Per-element recommendations (apply on each property page)

| Element | Template | Example (Kings Manor) |
|---|---|---|
| **Title tag** | `{Name} — {Type} for Rent at {Address}, Alvin, TX 77511 \| RentInAlvin.com` (≤60 chars ideal; trim "RentInAlvin.com" if long) | `Kings Manor Townhomes — For Rent at 328 S 2nd St, Alvin TX` |
| **Meta description** | Name + type + beds/price + 1 differentiator + CTA (≤155 chars) | `Kings Manor Townhomes at 328 S 2nd St, Alvin TX. 2–3BR / 2.5BA, 1,250 sqft, from $1,250. Private entries, locally managed. Tour today.` |
| **H1** (one per page) | `{Name} in Alvin, TX` | `Kings Manor Townhomes in Alvin, TX` |
| **H2s** | `Floor Plans & Pricing` · `Amenities` · `Photos of {Name}` · `Location & Neighborhood` · `Schools & Commute` · `Frequently Asked Questions` · `Apply or Schedule a Tour` | — |
| **H3s** | per floor plan / per amenity group / per FAQ | `2 Bed · 2.5 Bath Townhome` |
| **URL** | `/communities/{slug}` lowercase, hyphenated | `/communities/kings-manor-townhomes` |
| **Image alt** | `{Name} {room/feature} — {type} in Alvin, TX` | `Kings Manor townhome living room with fireplace — Alvin TX rental` |
| **Internal links** | link to `/communities` hub, sibling properties, `/living-in-alvin`, `#apply` | "See other [Alvin townhomes](/communities/royal-oaks-townhomes)" |

> **Alt text fix:** today gallery images use `alt={prop.name}` (all identical) and several properties only have a placeholder string in `img:`. Replace with descriptive, room-specific alt text derived from the filename (e.g. `03-living-room-fireplace.jpg` → "living room with fireplace"). This wins Google Images traffic for "[property] photos."

---

## 3. Local SEO — per-property keyword map

Alvin, TX 77511, Brazoria County. Anchor landmarks: **downtown Alvin, Alvin Community College, Alvin ISD, TX-35 / South Bypass 35, Hwy 6**, commute to **Pearland, NASA/Clear Lake, Houston Medical Center**.

| Property | Primary keyword | Address/local terms | Neighborhood / landmark terms |
|---|---|---|---|
| **Kings Haven Apartments (410 S 2nd)** | `apartments for rent Alvin TX` | `410 S 2nd St Alvin`, `2 bedroom apartments Alvin TX` | `downtown Alvin apartments`, `apartments near Alvin Community College`, `pet friendly apartments Alvin` |
| **Kings Manor Townhomes (328 S 2nd)** | `townhomes for rent Alvin TX` | `328 S 2nd St Alvin`, `3 bedroom townhome Alvin` | `townhomes near downtown Alvin`, `2.5 bath townhome Alvin TX` |
| **Kings Haven 100 S 2nd** | `1 bedroom apartments Alvin TX` | `100 S 2nd St Alvin` | `cheap apartments Alvin TX`, `renovated apartments Alvin` |
| **French Quarter Residency (2550 S Bypass 35)** | `apartments near Bypass 35 Alvin` | `2550 S Bypass 35 Alvin` | `apartments off Hwy 35 Alvin`, `apartments with parking Alvin TX` |
| **The White House Apartments (1606 W Sealy St)** | `apartments W Sealy St Alvin` | `1606 W Sealy St Alvin` | `quiet apartments Alvin TX`, `2 bedroom apartments near Sealy St` |
| **Royal Oaks Townhomes (418 S Jackson St)** | `townhomes for rent Alvin TX` (coming soon) | `418 S Jackson St Alvin` | `new townhomes Alvin TX`, `2 bed 2 bath townhome Alvin` |

**"Near me" capture:** "near me" is resolved by Google from the user's location, not a keyword you write. You win it by (a) accurate `geo`/`GeoCoordinates` schema per property, (b) a strong, NAP-consistent Google Business Profile, (c) embedded map + address text in HTML. Include natural-language proximity phrases on each page: *"apartments near downtown Alvin," "minutes from Alvin Community College and TX-35."*

---

## 4. Structured Data (JSON-LD)

> **Why:** Schema lets Google show rich results and feeds AI Overviews/assistants structured facts (price, beds, address, geo). Today you only have `RealEstateAgent` on every page.

### 4A. Per property page — `Apartment`/`RealEstateListing` + `Offer`

```tsx
// inside the property page, in a <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["Residence", "Apartment"],
  "name": "Kings Manor Townhomes",
  "url": "https://rentinalvin.com/communities/kings-manor-townhomes",
  "description": "Two-story townhomes with private entries and 2.5 baths in Alvin, TX.",
  "numberOfBedrooms": 3,
  "numberOfBathroomsTotal": 2.5,
  "floorSize": { "@type": "QuantitativeValue", "value": 1250, "unitCode": "FTK" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "328 S 2nd St",
    "addressLocality": "Alvin",
    "addressRegion": "TX",
    "postalCode": "77511",
    "addressCountry": "US"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 29.4213292, "longitude": -95.2556986 },
  "image": ["https://rentinalvin.com/images/kings-manor/01-exterior-front.jpg"],
  "petsAllowed": true,
  "numberOfRooms": 5,
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "Private driveway", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Fireplace", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "In-unit laundry", "value": true }
  ],
  "potentialAction": {
    "@type": "ReserveAction",
    "target": "https://rentinalvin.com/communities/kings-manor-townhomes#apply"
  }
}
```

Add a sibling `RealEstateListing` wrapper with an `offers`/price when a unit is actively available:

```jsonc
{
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "name": "3 Bed · 2.5 Bath Townhome — Kings Manor",
  "url": "https://rentinalvin.com/communities/kings-manor-townhomes",
  "datePosted": "2026-06-01",
  "offers": {
    "@type": "Offer",
    "price": 1595,
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "businessFunction": "http://purl.org/goodrelations/v1#LeaseOut"
  }
}
```

### 4B. `LocalBusiness` (the leasing office) — keep on homepage + footer

Refine the existing `RealEstateAgent` block (`layout.tsx:55`): fix the geo to match the office (Kings Haven 410 S 2nd = `29.4208044, -95.2554917`), add `sameAs` (GBP, Facebook, etc.), and `image`/`logo`.

### 4C. `BreadcrumbList` (every property page)

```jsonc
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://rentinalvin.com" },
    { "@type": "ListItem", "position": 2, "name": "Communities", "item": "https://rentinalvin.com/communities" },
    { "@type": "ListItem", "position": 3, "name": "Kings Manor Townhomes", "item": "https://rentinalvin.com/communities/kings-manor-townhomes" }
  ]
}
```

### 4D. `FAQPage` — you already have the content in `FAQS` (`data.ts:136`)

```tsx
// render from the FAQS array so it never drifts from the visible FAQ
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQS.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a }
  }))
}
```
> Only mark up FAQs that are actually visible on the page. Per-property pages should get property-specific FAQs (pets at *this* building, parking, etc.).

### 4E. `LodgingBusiness`
Not recommended — that type is for hotels/short-stay. These are 12-month residential leases, so `Apartment`/`Residence` + `RealEstateListing` is correct. Skip `LodgingBusiness`.

---

## 5. Content Improvements (per property page)

Each property page should have **600–900 words** of unique, useful content (today each property has ~1 sentence in `note`). Sections:

1. **Intro paragraph** — name, type, address, who it suits. Natural keywords.
2. **Floor plans & pricing** — table from `FLOORPLANS`/`AVAILABILITY` filtered to this property; beds/baths/sqft/price.
3. **Amenities** — bulleted, specific (in-unit laundry, private driveway, assigned parking, fireplace…).
4. **Photo gallery** — with descriptive alt text (§2C).
5. **Location & neighborhood** — what's around this exact address: *"410 S 2nd St sits two blocks from downtown Alvin, walkable to Alvin City Hall and the Alvin Farmers Market."*
6. **Nearby attractions / landmarks** — Alvin Community College, National Oak Park, Bayou Wildlife Zoo, downtown shops, Froberg's Farm.
7. **Transportation / commute** — TX-35 & Hwy 6 access; drive times to Pearland (~15 min), NASA/Clear Lake (~30 min), Houston Med Center (~35 min).
8. **Schools** — Alvin ISD (name the zoned elementary/middle/high if known).
9. **Property-specific FAQ** — 4–6 Qs (pets here, parking, lease terms, what's included).
10. **CTA block** — apply / book a tour / call, with `tel:` and the existing booking flow.

**Example SEO intro (Kings Manor):**
> *Kings Manor Townhomes at 328 S 2nd Street offers two- and three-bedroom townhomes for rent in the heart of Alvin, Texas. Each two-story home includes 2.5 bathrooms, a private entry, in-unit laundry, and an assigned driveway across roughly 1,250 square feet. Located just south of downtown Alvin and minutes from TX-35, Kings Manor is leased and maintained by Yellowstone Asset Management's local team. Townhomes start at $1,250/month with availability updated weekly.*

Also build a **`/communities` hub page** (H1 "Apartments & Townhomes for Rent in Alvin, TX") listing all six with cards linking to each detail page — this becomes your strongest internal-linking and category-ranking asset.

---

## 6. Google Business Profile & Local Citations

> **Why:** For "near me" / map-pack visibility, off-site signals (GBP + consistent citations) matter as much as the site.

**Canonical NAP (decide once, use everywhere):**
`Yellowstone Asset Management — RentInAlvin.com · 410 S 2nd St, Alvin, TX 77511 · (832) 210-3968 · office@yellowstone-am.com`
*(Fix the geo mismatch: use `29.4208044, -95.2554917` — the actual office — in `layout.tsx`.)*

**Google Business Profile:**
- Category: *Apartment rental agency* (primary) + *Property management company*, *Townhouse complex* (secondary).
- Add all 6 communities as service-area/locations if eligible; otherwise one office profile + photos of each.
- Upload real photos (reuse `/public/images/...`), post weekly availability updates, enable messaging, collect reviews with replies.
- Service area: Alvin, Manvel, Pearland (matches your `areaServed` schema).

**Citations / directories (consistent NAP):**
- Tier 1 rentals: Apartments.com, Zillow Rentals, Trulia, Rent.com, ApartmentList, HotPads, Realtor.com.
- Local/biz: Bing Places, Apple Business Connect, Yelp, Yellow Pages, BBB, Chamber of Commerce (Alvin-Manvel Area Chamber), Nextdoor.
- Data aggregators: Data Axle, Foursquare/Factual.

**Map optimization:** keep the Leaflet map, but also embed address text + a Google Maps link per property page; ensure `GeoCoordinates` schema matches GBP exactly.

---

## 7. Keyword Research

**Primary (site-level):** `apartments for rent in Alvin TX`, `townhomes for rent in Alvin TX`.

**Secondary:** `2 bedroom apartments Alvin TX`, `3 bedroom townhomes Alvin`, `cheap apartments Alvin TX`, `pet friendly apartments Alvin TX`, `apartments near Alvin Community College`, `Alvin TX rentals`.

**Long-tail / by property:** `Kings Manor Townhomes Alvin`, `Kings Haven Apartments 410 S 2nd St`, `French Quarter apartments Bypass 35 Alvin`, `White House apartments Sealy St Alvin`, `townhomes with 2.5 bath Alvin TX`, `apartments with assigned parking Alvin`.

**Questions people search (use as H2/FAQ + AI-overview bait):**
- "How much is rent in Alvin TX?"
- "Are there pet friendly apartments in Alvin?"
- "What apartments in Alvin accept large dogs?"
- "How far is Alvin TX from Houston / NASA / Pearland?"
- "Best neighborhoods to rent in Alvin TX."
- "Cheapest apartments in Alvin TX."

**Competitor opportunities:** target the gap between national portals (Apartments.com/Zillow listings for Alvin) and other Alvin property managers — your edge is *local, family-run, 6 communities, one phone number.* Build pages those portals can't: neighborhood guide (you have `/living-in-alvin` — expand it), school zoning, commute calculators.

---

## 8. Internal Linking Strategy

| From | To | Anchor text |
|---|---|---|
| Homepage community cards | each `/communities/[slug]` | property name + type ("Kings Manor Townhomes") |
| `/communities` hub | each property | `{Name} in Alvin, TX` |
| Each property page | 2–3 sibling properties | "Other Alvin townhomes", "Nearby 2-bedroom apartments" |
| Each property page | `/living-in-alvin` | "What it's like living in Alvin, TX" |
| Each property page | `#apply` / booking | "Apply online", "Schedule a tour" |
| `/living-in-alvin` | top properties | "See our Alvin apartments and townhomes" |
| Footer (all pages) | `/communities` + each property | property names |

**Hub pages to create:**
- `/communities` — all rentals (category page, primary keyword).
- Optionally `/apartments-for-rent-alvin-tx` and `/townhomes-for-rent-alvin-tx` filtered hubs (strong exact-match category targets) → link to relevant properties.

---

## 9. AI-Ready SEO (AI Overviews, ChatGPT, Claude, Copilot, voice)

> **Why:** Assistants extract structured, factual, well-cited content. The same fixes that help Google help them.

- **Server-render the facts.** Move property details out of the JS modal into static HTML (the dynamic pages do this). Assistants and many crawlers don't execute your modal.
- **Structured data** (§4) gives machines unambiguous price/beds/address/geo.
- **Answer questions directly** in plain language under question-style H2s ("How much is rent at Kings Manor? Townhomes start at $1,250/month.") — this is what gets quoted in AI Overviews.
- **Concise factual summary block** near the top of each property page (name, address, beds/baths, sqft, price, pets, parking) — easy to lift.
- **Consistent NAP + entities** everywhere so assistants confidently associate the brand with Alvin rentals.
- **Voice search**: target natural phrases ("apartments for rent near me in Alvin," "pet friendly townhomes in Alvin Texas") in FAQ answers.
- Keep `robots.txt` permissive to AI crawlers you want (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) — they're allowed by default with the `allow: '/'` rule above; only block deliberately.
- Add an `llms.txt` (optional, emerging convention) at `/public/llms.txt` summarizing the site + key URLs.

---

## 10. Prioritized Action Plan

### 🔴 Phase 1 — Quick wins / foundation (week 1)
1. Add `robots.ts` + `sitemap.ts` (§1A/1B). *Why: lets Google discover everything. ~1 hr.*
2. Build `/communities/[slug]` dynamic pages with `generateStaticParams`, per-page `generateMetadata`, H1, and the existing gallery/details moved out of the modal (§2). *Why: this is the only way property terms can rank.*
3. Build the `/communities` hub page + link cards from the homepage. *Why: category ranking + internal links.*
4. Fix `/es` (and `/`) metadata + canonicals by splitting server/client components (§1C/1D). *Why: stops Spanish page self-canonicalizing to English.*
5. Disambiguate the duplicate "Kings Haven Apartments" (rename 100 S 2nd, unique slug) and fix the geo mismatch (§1.9/1.10).

### 🟠 Phase 2 — Structure & content (weeks 2–4)
6. Add JSON-LD per property: `Apartment`/`RealEstateListing`, `BreadcrumbList`, property-specific `FAQPage` (§4).
7. Write 600–900 words of unique content per property (§5): location, landmarks, commute, schools, FAQ.
8. Descriptive image alt text across all galleries (§2C).
9. Re-enable image optimization / responsive images; lazy-load galleries (§1E).
10. Set up & optimize Google Business Profile; submit Tier-1 citations (§6).

### 🟡 Phase 3 — Authority & long-term (months 2–6)
11. Build keyword hub pages: `/apartments-for-rent-alvin-tx`, `/townhomes-for-rent-alvin-tx` (§8).
12. Expand `/living-in-alvin` into a genuine local resource (schools, parks, commute, cost of living) and interlink to properties.
13. Earn reviews on GBP + portals; add review/aggregateRating schema once you have legitimate reviews.
14. Add OG images per page; monitor Search Console (coverage, queries, CWV) and iterate.
15. Local link building: Alvin Chamber, community sponsorships, local press.

---

## Appendix — concrete file checklist for the developer

| Action | File |
|---|---|
| Sitemap | `src/app/sitemap.ts` (new) |
| Robots | `src/app/robots.ts` (new) |
| Slug/SEO helpers | `src/lib/seo.ts` (new) |
| Enrich property data (lat/lng/beds/baths/sqft/amenities/description/zip) | `src/lib/data.ts` (edit — merge `MAP_PROPS` into `COMMUNITIES`) |
| Property detail route | `src/app/communities/[slug]/page.tsx` (new) |
| Property detail UI + JSON-LD | `src/app/communities/[slug]/PropertyDetail.tsx` (new) |
| Communities hub | `src/app/communities/page.tsx` (new) |
| Split homepage server/client | `src/app/page.tsx` + `src/app/HomeClient.tsx` |
| Split Spanish server/client | `src/app/es/page.tsx` + `src/app/es/EsClient.tsx` |
| Fix office geo + add sameAs/logo | `src/app/layout.tsx` (edit) |
| FAQ + breadcrumb schema components | reusable in `src/components/` |
```
