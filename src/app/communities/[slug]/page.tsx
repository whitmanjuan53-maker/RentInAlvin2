import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { PALETTES, BUSINESS } from '@/lib/data';
import { PROPERTIES, getPropertyBySlug, fullAddress, altFromImage, type Property } from '@/lib/seo';

const p = PALETTES.forest;
const displayFont = 'Instrument Serif';
const BASE = 'https://rentinalvin.com';

export function generateStaticParams() {
  return PROPERTIES.map((prop) => ({ slug: prop.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const prop = getPropertyBySlug(slug);
  if (!prop) return {};
  const url = `${BASE}/communities/${slug}`;
  const title = `${prop.name} — ${prop.type} for Rent at ${prop.addr}, Alvin TX 77511`;
  const description = `${prop.name} in Alvin, TX. ${prop.units}, ${prop.price}. ${prop.note} Locally managed by Yellowstone Asset Management — tour today, (832) 210-3968.`;
  const ogImage = prop.gallery?.[0] ? `${BASE}${prop.gallery[0]}` : `${BASE}/images/kings-haven/01-001-cmup.jpg`;
  return {
    title,
    description,
    robots: 'index, follow',
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: 'RentInAlvin.com',
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 800, alt: `${prop.name} — ${prop.type.toLowerCase()} for rent in Alvin, TX` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  };
}

function jsonLd(prop: Property, slug: string) {
  const url = `${BASE}/communities/${slug}`;
  const images = (prop.gallery ?? []).slice(0, 6).map((g) => `${BASE}${g}`);

  const residence = {
    '@context': 'https://schema.org',
    '@type': ['Residence', 'Apartment'],
    '@id': `${url}#residence`,
    name: prop.name,
    url,
    description: prop.note,
    numberOfBedrooms: prop.beds,
    numberOfBathroomsTotal: prop.baths,
    numberOfRooms: prop.beds + 1,
    floorSize: { '@type': 'QuantitativeValue', value: prop.sqft, unitCode: 'FTK' },
    petsAllowed: true,
    ...(images.length ? { image: images } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: prop.addr,
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.zip,
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: prop.lat, longitude: prop.lng },
    amenityFeature: prop.amenities.map((a) => ({ '@type': 'LocationFeatureSpecification', name: a, value: true })),
    containedInPlace: { '@type': 'City', name: 'Alvin', address: { '@type': 'PostalAddress', addressRegion: 'TX', postalCode: '77511' } },
  };

  const listing = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${url}#listing`,
    name: `${prop.name} — ${prop.type} for Rent in Alvin, TX`,
    url,
    description: prop.note,
    ...(images.length ? { image: images } : {}),
    ...(prop.comingSoon
      ? {}
      : {
          offers: {
            '@type': 'Offer',
            price: prop.priceFrom,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
            url,
          },
        }),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Communities', item: `${BASE}/communities` },
      { '@type': 'ListItem', position: 3, name: prop.name, item: url },
    ],
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: prop.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return [residence, listing, breadcrumb, faqPage];
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const prop = getPropertyBySlug(slug);
  if (!prop) notFound();

  const others = PROPERTIES.filter((o) => o.slug !== slug);
  const para: React.CSSProperties = { fontSize: 16.5, lineHeight: 1.75, color: p.inkSoft, marginBottom: 16 };
  const h2: React.CSSProperties = { fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(26px, 3.5vw, 34px)', color: p.ink, fontWeight: 400, margin: '44px 0 16px' };
  const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(fullAddress(prop))}`;

  return (
    <div style={{ background: p.bg, minHeight: '100vh' }}>
      {jsonLd(prop, slug).map((block, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
      ))}
      <Nav p={p} locale="en" />

      <main style={{ maxWidth: 980, margin: '0 auto', padding: '150px var(--pad-x) 80px' }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: p.inkSoft, marginBottom: 18 }}>
          <a href="/" style={{ color: p.inkSoft, textDecoration: 'none' }}>Home</a>
          <span style={{ margin: '0 8px', opacity: 0.5 }}>/</span>
          <a href="/communities" style={{ color: p.inkSoft, textDecoration: 'none' }}>Communities</a>
          <span style={{ margin: '0 8px', opacity: 0.5 }}>/</span>
          <span style={{ color: p.ink }}>{prop.name}</span>
        </nav>

        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: p.accent }}>
          {prop.tag}{prop.comingSoon ? ' · Coming soon' : ''}
        </span>
        <h1 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(38px, 6vw, 60px)', lineHeight: 1.05, color: p.ink, fontWeight: 400, margin: '8px 0 0' }}>
          {prop.name} in Alvin, TX
        </h1>
        <p style={{ fontSize: 18, color: p.inkSoft, marginTop: 10 }}>
          {prop.type} for rent at{' '}
          <a href={mapsHref} target="_blank" rel="noopener noreferrer" style={{ color: p.primary, fontWeight: 600, textDecoration: 'none' }}>
            {fullAddress(prop)}
          </a>
        </p>

        {/* Fast-facts summary block (AI / featured-snippet friendly) */}
        <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 1, background: p.line, border: `1px solid ${p.line}`, borderRadius: 12, overflow: 'hidden', margin: '28px 0 8px' }}>
          {[
            ['Type', prop.type],
            ['Layout', `${prop.beds} bd · ${prop.baths} ba`],
            ['Size', `~${prop.sqft.toLocaleString()} sq ft`],
            ['Rent', prop.comingSoon ? 'Coming soon' : `from $${prop.priceFrom.toLocaleString()}`],
            ['Area', prop.neighborhood],
          ].map(([k, v]) => (
            <div key={k} style={{ background: p.paper, padding: '14px 16px' }}>
              <dt style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: p.inkSoft, marginBottom: 4 }}>{k}</dt>
              <dd style={{ margin: 0, fontSize: 15, fontWeight: 600, color: p.ink }}>{v}</dd>
            </div>
          ))}
        </dl>

        {/* Gallery */}
        {prop.gallery && prop.gallery.length > 0 && (
          <>
            <h2 style={h2}>Photos of {prop.name}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {prop.gallery.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt={altFromImage(prop, src)}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  width={440}
                  height={300}
                  style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 10, border: `1px solid ${p.line}`, background: p.paper }}
                />
              ))}
            </div>
          </>
        )}

        {/* Overview prose */}
        <h2 style={h2}>About {prop.name}</h2>
        {prop.paragraphs.map((text, i) => (
          <p key={i} style={para}>{text}</p>
        ))}

        {/* Amenities */}
        <h2 style={h2}>Amenities &amp; Features</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
          {prop.amenities.map((a) => (
            <li key={a} style={{ fontSize: 15.5, color: p.ink, display: 'flex', gap: 10, alignItems: 'center' }}>
              <span aria-hidden style={{ color: p.accent, fontWeight: 700 }}>✓</span>{a}
            </li>
          ))}
        </ul>

        {/* Location */}
        <h2 style={h2}>Location &amp; Commute</h2>
        <p style={para}>
          {prop.name} is in the {prop.neighborhood} area of Alvin, Texas (77511), zoned to Alvin ISD and within reach of
          Alvin Community College, downtown Alvin, and TX-35 / Highway 6. The drive reaches Pearland in roughly 15 minutes
          and the NASA / Clear Lake and Texas Medical Center areas in about 30–35 minutes.{' '}
          <a href={mapsHref} target="_blank" rel="noopener noreferrer" style={{ color: p.primary, fontWeight: 600, textDecoration: 'none' }}>
            View {prop.addr} on Google Maps →
          </a>
        </p>

        {/* FAQ */}
        <h2 style={h2}>Frequently Asked Questions</h2>
        <div>
          {prop.faqs.map((f) => (
            <details key={f.q} style={{ borderBottom: `1px solid ${p.line}`, padding: '14px 0' }}>
              <summary style={{ cursor: 'pointer', fontSize: 16.5, fontWeight: 600, color: p.ink, listStyle: 'none' }}>{f.q}</summary>
              <p style={{ ...para, marginTop: 10, marginBottom: 0 }}>{f.a}</p>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 44, padding: '28px 26px', background: p.primary, borderRadius: 16, color: p.paper }}>
          <div style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(24px, 3.5vw, 32px)', lineHeight: 1.1 }}>
            {prop.comingSoon ? `Join the interest list for ${prop.name}` : `Tour ${prop.name} this week`}
          </div>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: '12px 0 20px', color: `color-mix(in oklab, ${p.paper} 85%, transparent)` }}>
            Call our local Alvin office, apply online in about 5 minutes, or schedule a tour — most applications are decided within 48 hours.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={`tel:${BUSINESS.phone.replace(/[^0-9]/g, '')}`} style={{ background: p.accent, color: '#fff', padding: '12px 22px', borderRadius: 999, fontWeight: 600, textDecoration: 'none', fontSize: 15 }}>
              Call {BUSINESS.phone}
            </a>
            <a href="/#apply" style={{ background: p.paper, color: p.primary, padding: '12px 22px', borderRadius: 999, fontWeight: 600, textDecoration: 'none', fontSize: 15 }}>
              Apply online
            </a>
          </div>
        </div>

        {/* Internal links to siblings */}
        <h2 style={h2}>Other Alvin Communities</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {others.map((o) => (
            <a key={o.slug} href={`/communities/${o.slug}`} style={{ display: 'block', padding: '16px 18px', background: p.paper, border: `1px solid ${p.line}`, borderRadius: 12, textDecoration: 'none' }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: p.ink }}>{o.name}</div>
              <div style={{ fontSize: 13, color: p.inkSoft, marginTop: 4 }}>{o.type} · {o.addr} · {o.price}</div>
            </a>
          ))}
        </div>
        <p style={{ ...para, marginTop: 28 }}>
          New to the area? Read our guide to{' '}
          <a href="/living-in-alvin" style={{ color: p.primary, fontWeight: 600, textDecoration: 'none' }}>living in Alvin, TX</a>, or
          browse{' '}
          <a href="/communities" style={{ color: p.primary, fontWeight: 600, textDecoration: 'none' }}>all apartments and townhomes for rent in Alvin</a>.
        </p>
      </main>

      <Footer p={p} displayFont={displayFont} />
    </div>
  );
}
