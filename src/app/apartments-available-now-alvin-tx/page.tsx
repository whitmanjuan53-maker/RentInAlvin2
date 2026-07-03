import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { PALETTES } from '@/lib/data';

const p = PALETTES.forest;
const displayFont = 'Instrument Serif';

export const metadata: Metadata = {
  title: 'Apartments Available Now in Alvin, TX — Move-In Ready | RentInAlvin.com',
  description:
    'Move-in-ready apartments available now in Alvin, TX from $850. Renovated units, transparent pricing, fast applications. Call today.',
  robots: 'index, follow',
  alternates: { canonical: 'https://rentinalvin.com/apartments-available-now-alvin-tx' },
};

export default function AvailableNowPage() {
  const para: React.CSSProperties = { fontSize: 16, lineHeight: 1.7, color: p.inkSoft, marginBottom: 14 };
  const link: React.CSSProperties = { color: p.primary, fontWeight: 600, textDecoration: 'none' };

  return (
    <div style={{ background: p.bg, minHeight: '100vh' }}>
      <Nav p={p} locale="en" />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '160px var(--pad-x) 80px' }}>
        <h1 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 1.05, color: p.ink, fontWeight: 400, margin: 0 }}>
          Apartments Available Now in Alvin, TX
        </h1>
        <p style={{ ...para, marginTop: 24 }}>
          Need a place soon? We keep move-in-ready, renovated units open across our six Alvin
          communities, with rents starting at $850 and pricing shown up front &mdash; no surprise fees.
          Applications are typically decided within 48 hours, so you can go from tour to keys quickly.
          Availability changes weekly, so the fastest way to see what&rsquo;s open today is to call{' '}
          <a href="tel:8322103968" style={link}>(832) 210-3968</a> or apply online at RentInAlvin.com.
        </p>
      </main>
      <Footer p={p} displayFont={displayFont} />
    </div>
  );
}
