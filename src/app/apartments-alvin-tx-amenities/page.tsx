import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { PALETTES } from '@/lib/data';

const p = PALETTES.forest;
const displayFont = 'Instrument Serif';

export const metadata: Metadata = {
  title: 'Apartments in Alvin, TX With Parking, Laundry & Quiet Streets | RentInAlvin.com',
  description:
    'Quiet, family-friendly apartments in Alvin, TX with assigned parking and on-site laundry. Well-maintained communities from $850.',
  robots: 'index, follow',
  alternates: { canonical: 'https://rentinalvin.com/apartments-alvin-tx-amenities' },
};

export default function AmenitiesPage() {
  const para: React.CSSProperties = { fontSize: 16, lineHeight: 1.7, color: p.inkSoft, marginBottom: 14 };
  const link: React.CSSProperties = { color: p.primary, fontWeight: 600, textDecoration: 'none' };

  return (
    <div style={{ background: p.bg, minHeight: '100vh' }}>
      <Nav p={p} locale="en" />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '160px var(--pad-x) 80px' }}>
        <h1 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 1.05, color: p.ink, fontWeight: 400, margin: 0 }}>
          Quiet, Family-Friendly Apartments in Alvin, TX
        </h1>
        <p style={{ ...para, marginTop: 24 }}>
          Our Alvin communities are built for everyday comfort. Every unit comes with at least one
          assigned parking spot &mdash; townhomes add private driveways &mdash; so you never circle for
          a space. French Quarter Residency includes on-site laundry plus a BBQ and picnic area, and
          units across the portfolio are renovated and move-in ready. Most of our streets are
          low-density and residential, the kind of quiet, family-friendly setting renters ask for,
          with a local team that maintains the properties and answers the phone. Want a specific
          feature &mdash; washer/dryer hookup, extra parking, a calmer building? Call{' '}
          <a href="tel:8322103968" style={link}>(832) 210-3968</a> and we&rsquo;ll match you to the
          right unit, or apply online at RentInAlvin.com.
        </p>
      </main>
      <Footer p={p} displayFont={displayFont} />
    </div>
  );
}
