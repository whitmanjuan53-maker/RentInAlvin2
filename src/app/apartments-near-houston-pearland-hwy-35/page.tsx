import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { PALETTES } from '@/lib/data';

const p = PALETTES.forest;
const displayFont = 'Instrument Serif';

export const metadata: Metadata = {
  title: 'Apartments Near Hwy 35, Pearland & Houston in Alvin, TX | RentInAlvin.com',
  description:
    'Apartments for rent in Alvin, TX just off Hwy 35 — easy commute to Pearland and Houston. Rents from $850. Tour today.',
  robots: 'index, follow',
  alternates: { canonical: 'https://rentinalvin.com/apartments-near-houston-pearland-hwy-35' },
};

export default function NearHoustonPearlandPage() {
  const para: React.CSSProperties = { fontSize: 16, lineHeight: 1.7, color: p.inkSoft, marginBottom: 14 };
  const link: React.CSSProperties = { color: p.primary, fontWeight: 600, textDecoration: 'none' };

  return (
    <div style={{ background: p.bg, minHeight: '100vh' }}>
      <Nav p={p} locale="en" />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '160px var(--pad-x) 80px' }}>
        <h1 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 1.05, color: p.ink, fontWeight: 400, margin: 0 }}>
          Apartments Near Hwy 35, Pearland &amp; Houston
        </h1>
        <p style={{ ...para, marginTop: 24 }}>
          Alvin sits about 30 miles south of downtown Houston and minutes from Pearland, which makes
          our communities a smart base for commuters who want lower rent without leaving the metro.
          Several of our properties &mdash; including French Quarter Residency on South Bypass 35 &mdash;
          offer quick access to Highway 35, so you&rsquo;re on the road to Houston or Pearland in
          moments. You get Alvin&rsquo;s quieter pace and rents starting at $850, while staying
          connected to Gulf Coast jobs, shopping, and the beaches near Galveston. Call{' '}
          <a href="tel:8322103968" style={link}>(832) 210-3968</a> to find the community with the
          commute that fits you, or apply online at RentInAlvin.com.
        </p>
      </main>
      <Footer p={p} displayFont={displayFont} />
    </div>
  );
}
