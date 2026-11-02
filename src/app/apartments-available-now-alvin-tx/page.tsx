import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { PALETTES, BUSINESS } from '@/lib/data';
import { PROPERTIES } from '@/lib/seo';
import { PROPERTY_PRICING, formatCurrency } from '@/lib/property-pricing';

const p = PALETTES.forest;
const displayFont = 'Instrument Serif';

export const metadata: Metadata = {
  title: 'Townhomes and Apartments: Availability and Rental Questions in Alvin, TX | RentInAlvin.com',
  description:
    'Explore Alvin apartment and townhome communities, listed monthly rent, and answers about availability, tours and applications. Confirm openings with our local leasing team.',
  robots: 'index, follow',
  alternates: { canonical: 'https://rentinalvin.com/apartments-available-now-alvin-tx' },
};

export default function AvailableNowPage() {
  const para: React.CSSProperties = { fontSize: 16, lineHeight: 1.7, color: p.inkSoft, marginBottom: 14 };
  const link: React.CSSProperties = { color: p.primary, fontWeight: 600, textDecoration: 'none' };
  const heading: React.CSSProperties = { fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(26px, 4vw, 36px)', lineHeight: 1.2, fontWeight: 400, color: p.ink, margin: '36px 0 16px' };
  const faqs = [
    { q: 'How can I find apartments available now in Alvin, TX?', a: `Check the availability section on RentInAlvin.com, then call ${BUSINESS.phone} to confirm the specific home, move-in date and full charges. An available apartment can be leased at any time; a website listing does not reserve a home.` },
    { q: 'How can I confirm the lease details?', a: 'Contact our local leasing team for current rent, utility arrangements and the complete lease terms for your selected home.' },
    { q: 'How do I arrange an apartment tour or apply?', a: `Use the tour booking or application form on the homepage, or call ${BUSINESS.phone}. Tell the team which community interests you and when you want to move. Submitting an application does not guarantee approval or availability.` },
    { q: 'Are pets, parking or laundry available?', a: 'Features and pet policies vary by property and unit. Review the individual community page, then confirm pet restrictions, parking, laundry arrangements and any related fees with the leasing team before applying.' },
    { q: 'Who manages these Alvin rental communities?', a: `${BUSINESS.brand} is managed by ${BUSINESS.name}. The leasing office is at ${BUSINESS.street}, ${BUSINESS.city}, ${BUSINESS.region} ${BUSINESS.zip}. Call ${BUSINESS.phone} or email ${BUSINESS.email}.` },
  ];
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };

  return (
    <div style={{ background: p.bg, minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData).replace(/</g, '\\u003c') }} />
      <Nav p={p} locale="en" />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '160px var(--pad-x) 80px' }}>
        <h1 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 1.05, color: p.ink, fontWeight: 400, margin: 0 }}>
          Find Your Next Home: Townhomes and Apartments in Alvin, TX
        </h1>
        <p style={{ ...para, marginTop: 24 }}>
          Looking for apartments for rent in Alvin, Texas? Compare our apartment and townhome communities,
          review listed costs, and ask our local leasing team about current openings. Availability,
          move-in dates and charges depend on the home you select. Call{' '}
          <a href="tel:8322103968" style={link}>{BUSINESS.phone}</a> to confirm details before applying.
        </p>
        <p style={para}>
          <a href="/#availability" style={link}>Check rental availability</a>{' · '}
          <a href="/#contact" style={link}>Book a tour</a>{' · '}
          <a href="/#apply" style={link}>Apply online</a>
        </p>

        <h2 style={heading}>Compare Alvin rental communities</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 245px), 1fr))', gap: 16 }}>
          {PROPERTIES.map((property) => (
            <article key={property.slug} style={{ border: `1px solid ${p.line}`, borderRadius: 12, padding: 20, background: p.paper }}>
              <h3 style={{ margin: '0 0 10px', fontSize: 19, lineHeight: 1.3 }}>
                <a href={`/communities/${property.slug}`} style={link}>{property.name}</a>
              </h3>
              <p style={{ ...para, marginBottom: 8 }}>{property.addr}, Alvin, TX 77511</p>
              <a href={`/communities/${property.slug}`} style={link}>View photos and property details →</a>
            </article>
          ))}
        </div>

        <h2 style={heading}>Listed monthly rent</h2>
        <p style={para}>These are the listed starting monthly rents for the following communities. Confirm current pricing and all applicable charges with the leasing team.</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, lineHeight: 1.6, textAlign: 'left' }}>
            <caption style={{ textAlign: 'left', marginBottom: 12, color: p.inkSoft }}>Monthly pricing for selected Alvin communities</caption>
            <thead><tr>{['Community', 'Monthly rent'].map((label) => (
              <th key={label} scope="col" style={{ padding: 12, borderBottom: `2px solid ${p.line}` }}>{label}</th>
            ))}</tr></thead>
            <tbody>{PROPERTY_PRICING.map((pricing) => (
              <tr key={pricing.address}>
                <th scope="row" style={{ padding: 12, borderBottom: `1px solid ${p.line}`, fontWeight: 500 }}>{pricing.propertyName}<br /><span style={{ fontSize: 13, color: p.inkSoft }}>{pricing.address}</span></th>
                {[pricing.baseRent].map((amount, index) => (
                  <td key={index} style={{ padding: 12, borderBottom: `1px solid ${p.line}`, whiteSpace: 'nowrap' }}>{formatCurrency(amount)}</td>
                ))}
              </tr>
            ))}</tbody>
          </table>
        </div>

        <h2 style={heading}>Questions about renting in Alvin</h2>
        {faqs.map(({ q, a }) => (
          <section key={q} style={{ borderBottom: `1px solid ${p.line}`, padding: '16px 0' }}>
            <h3 style={{ fontSize: 19, lineHeight: 1.4, margin: '0 0 10px' }}>{q}</h3>
            <p style={{ ...para, margin: 0 }}>{a}</p>
          </section>
        ))}
        <p style={{ ...para, marginTop: 24 }}>
          Explore <a href="/apartments-alvin-tx-amenities" style={link}>amenities and features</a>,{' '}
          <a href="/apartments-near-houston-pearland-hwy-35" style={link}>locations and nearby areas</a>, or our{' '}
          <a href="/living-in-alvin" style={link}>guide to living in Alvin</a>.
        </p>
      </main>
      <Footer p={p} displayFont={displayFont} />
    </div>
  );
}
