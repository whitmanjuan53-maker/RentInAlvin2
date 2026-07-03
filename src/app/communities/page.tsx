import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { PALETTES } from '@/lib/data';
import { PROPERTIES, altFromImage } from '@/lib/seo';

const p = PALETTES.forest;
const displayFont = 'Instrument Serif';
const BASE = 'https://rentinalvin.com';

export const metadata: Metadata = {
  title: 'Apartments & Townhomes for Rent in Alvin, TX | RentInAlvin.com',
  description:
    'Browse all six apartment and townhome communities for rent in Alvin, TX from Yellowstone Asset Management. 1–3 bedroom homes from $850. View photos, pricing, and locations, then tour or apply online.',
  robots: 'index, follow',
  alternates: { canonical: `${BASE}/communities` },
  openGraph: {
    type: 'website',
    url: `${BASE}/communities`,
    siteName: 'RentInAlvin.com',
    title: 'Apartments & Townhomes for Rent in Alvin, TX | RentInAlvin.com',
    description: 'All six apartment and townhome communities for rent in Alvin, TX. 1–3 bedroom homes from $850.',
    images: [{ url: `${BASE}/images/kings-haven/01-001-cmup.jpg`, width: 1200, height: 800, alt: 'Apartments for rent in Alvin, TX' }],
  },
};

const itemListLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Apartments & Townhomes for Rent in Alvin, TX',
  itemListElement: PROPERTIES.map((prop, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `${BASE}/communities/${prop.slug}`,
    name: prop.name,
  })),
};

export default function CommunitiesHub() {
  const para: React.CSSProperties = { fontSize: 16.5, lineHeight: 1.75, color: p.inkSoft };

  return (
    <div style={{ background: p.bg, minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <Nav p={p} locale="en" />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '150px var(--pad-x) 80px' }}>
        <h1 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 1.05, color: p.ink, fontWeight: 400, margin: 0 }}>
          Apartments &amp; Townhomes for Rent in Alvin, TX
        </h1>
        <p style={{ ...para, marginTop: 20, maxWidth: '70ch' }}>
          Yellowstone Asset Management owns and operates six rental communities across Alvin, Texas (77511) — from
          affordable one- and two-bedroom apartments to spacious two-story townhomes. Every home is locally managed and
          maintained, with rent starting from $850/month. Browse each community below, then call{' '}
          <a href="tel:8322103968" style={{ color: p.primary, fontWeight: 600, textDecoration: 'none' }}>(832) 210-3968</a>{' '}
          or apply online.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18, marginTop: 40 }}>
          {PROPERTIES.map((prop) => (
            <a
              key={prop.slug}
              href={`/communities/${prop.slug}`}
              style={{ display: 'block', background: p.paper, border: `1px solid ${p.line}`, borderRadius: 14, overflow: 'hidden', textDecoration: 'none' }}
            >
              {prop.gallery?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={prop.gallery[0]}
                  alt={altFromImage(prop, prop.gallery[0])}
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={260}
                  style={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{ width: '100%', aspectRatio: '16 / 10', background: `color-mix(in oklab, ${p.primary} 12%, ${p.paper})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.inkSoft, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
                  {prop.comingSoon ? 'COMING SOON' : 'PHOTOS SOON'}
                </div>
              )}
              <div style={{ padding: '16px 18px 18px' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase', color: p.accent }}>
                  {prop.type}{prop.comingSoon ? ' · Coming soon' : ''}
                </span>
                <div style={{ fontFamily: `'${displayFont}', serif`, fontSize: 24, color: p.ink, lineHeight: 1.1, marginTop: 4 }}>{prop.name}</div>
                <div style={{ fontSize: 13.5, color: p.inkSoft, marginTop: 6 }}>{prop.addr}, Alvin, TX 77511</div>
                <div style={{ fontSize: 14, color: p.ink, marginTop: 8, fontWeight: 600 }}>{prop.units} · {prop.price}</div>
              </div>
            </a>
          ))}
        </div>
      </main>

      <Footer p={p} displayFont={displayFont} />
    </div>
  );
}
