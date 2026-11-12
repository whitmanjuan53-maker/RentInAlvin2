'use client';

export default function Footer({
  p,
  displayFont,
  onBookTour,
  locale = 'en',
}: {
  p: typeof import('@/lib/data').PALETTES.forest;
  displayFont: string;
  onBookTour?: () => void;
  locale?: 'en' | 'es';
}) {
  const isEs = locale === 'es';

  return (
    <footer
      style={{
        padding: '60px var(--pad-x) 40px',
        background: p.ink,
        color: `color-mix(in oklab, ${p.paper} 80%, transparent)`,
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div
          className="ys-footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr',
            gap: 32,
            paddingBottom: 40,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: `'${displayFont}', serif`,
                fontSize: 40,
                color: p.paper,
                lineHeight: 1,
                letterSpacing: '-0.01em',
              }}
            >
              Yellowstone <em style={{ color: p.accentLight }}>Asset Management</em>
            </div>
            <p style={{ fontSize: 'var(--text-small)', lineHeight: 1.6, marginTop: 16, maxWidth: '42ch' }}>
              {isEs
                ? 'Administración de propiedades familiar que sirve a Alvin, Texas. Nos importa, escuchamos, aprendemos.'
                : 'Family run property management serving Alvin, Texas. We care, We listen, We learn.'}
            </p>
          </div>
          <div>
            <div style={{ color: p.paper, fontWeight: 600, fontSize: 'var(--text-small)', marginBottom: 14 }}>
              {isEs ? 'Comunidades' : 'Communities'}
            </div>
            {[
              { n: 'Kings Haven', slug: 'kings-haven-apartments' },
              { n: 'Kings Manor', slug: 'kings-manor-townhomes' },
              { n: 'French Quarter', slug: 'french-quarter-residency' },
              { n: 'Royal Oaks', slug: 'the-royal-oaks-townhomes' },
              { n: 'White House', slug: 'the-white-house-apartments' },
            ].map(({ n, slug }) => (
              <a
                key={n}
                href={isEs ? '/es#comunidades' : `/communities/${slug}`}
                style={{
                  display: 'block',
                  fontSize: 'var(--text-small)',
                  color: 'inherit',
                  textDecoration: 'none',
                  padding: '8px 0',
                }}
              >
                {n}
              </a>
            ))}
            {!isEs && (
              <a
                href="/communities"
                style={{ display: 'block', fontSize: 'var(--text-small)', color: 'inherit', textDecoration: 'none', padding: '4px 0', opacity: 0.85 }}
              >
                View all →
              </a>
            )}
            {!isEs && [
              ['Rental availability and questions', '/apartments-available-now-alvin-tx'],
              ['Amenities and features', '/apartments-alvin-tx-amenities'],
              ['Locations and nearby areas', '/apartments-near-houston-pearland-hwy-35'],
              ['Living in Alvin', '/living-in-alvin'],
            ].map(([label, href]) => (
              <a key={href} href={href} style={{ display: 'block', fontSize: 'var(--text-small)', color: 'inherit', textDecoration: 'none', padding: '6px 0', lineHeight: 1.5 }}>
                {label}
              </a>
            ))}
          </div>
          <div>
            <div style={{ color: p.paper, fontWeight: 600, fontSize: 'var(--text-small)', marginBottom: 14 }}>
              {isEs ? 'Oficina' : 'Office'}
            </div>
            <div style={{ fontSize: 'var(--text-small)', lineHeight: 1.7 }}>
              410 S 2nd Street
              <br />
              Alvin, TX 77511
              <br />
              {isEs ? 'Lun a Vie · 9 a 5 CT' : 'Mon to Fri · 9 to 5 CT'}
            </div>
          </div>
          <div>
            <div style={{ color: p.paper, fontWeight: 600, fontSize: 'var(--text-small)', marginBottom: 14 }}>
              {isEs ? 'Contacto' : 'Contact'}
            </div>
            <div style={{ fontSize: 'var(--text-small)', lineHeight: 1.7 }}>
              <a
                href="tel:8322103968"
                style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}
              >
                (832) 210 3968
              </a>
              <a
                href="mailto:office@yellowstone-am.com"
                style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}
              >
                office@yellowstone-am.com
              </a>
              <button
                onClick={() => {
                  if (onBookTour) {
                    onBookTour();
                  } else if (typeof window !== 'undefined' && (window as any).__openBooking) {
                    (window as any).__openBooking();
                  }
                }}
                style={{
                  color: p.accentLight,
                  textDecoration: 'none',
                  display: 'block',
                  marginTop: 8,
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: 'var(--text-small)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {isEs ? 'Programar un tour →' : 'Schedule a tour →'}
              </button>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 24,
            fontSize: 'var(--text-caption)',
            opacity: 0.9,
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span>
              © {new Date().getFullYear()} Yellowstone Asset Management.{' '}
              {isEs ? 'Igualdad de Oportunidades de Vivienda.' : 'Equal Housing Opportunity.'}
            </span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Equal Housing Opportunity">
              <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 11l5-4 5 4v6.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-2v3.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V11z" fill="currentColor" />
              <path d="M6 11.5l6-4.5 6 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <a href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>
              {isEs ? 'Privacidad' : 'Privacy Policy'}
            </a>
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>ALVIN · TX · 77511</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
