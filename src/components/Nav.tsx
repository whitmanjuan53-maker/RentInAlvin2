'use client';

import { useState, useEffect } from 'react';

export default function Nav({ p, locale = 'en' }: { p: typeof import('@/lib/data').PALETTES.forest; locale?: 'en' | 'es' }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links =
    locale === 'es'
      ? [
          ['Disponibilidad', '#disponibilidad'],
          ['Propiedades', '#propiedades'],
          ['Mapa', '#mapa'],
          ['Planes', '#planes'],
          ['Aplicar', '#aplicar'],
          ['Vender', '#vender'],
          ['Preguntas', '#preguntas'],
          ['Contacto', '#contacto'],
        ]
      : [
          ['Available', '#availability'],
          ['Properties', '#properties'],
          ['Map', '#map'],
          ['Plans', '#floorplans'],
          ['Apply', '#apply'],
          ['Sell', '#sell'],
          ['FAQ', '#faq'],
          ['Contact', '#contact'],
        ];

  const isEs = locale === 'es';

  return (
    <header
      className="ys-nav"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? '14px var(--pad-x)' : '24px var(--pad-x)',
        transition: 'all 220ms ease',
        background: scrolled ? `color-mix(in oklab, ${p.bg} 88%, transparent)` : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? `1px solid ${p.line}` : '1px solid transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <a
        href={isEs ? '/es' : '/'}
        style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: p.ink }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, letterSpacing: '-0.01em' }}>
            Yellowstone
          </span>
          <span
            style={{
              fontSize: 9.5,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: p.inkSoft,
              fontWeight: 500,
            }}
          >
            Asset Management
          </span>
        </div>
      </a>

      <nav className="ys-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            style={{
              color: p.ink,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: '0.01em',
              padding: '4px 0',
              borderRadius: 2,
              transition: 'color 180ms ease',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = p.accent)}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = p.ink)}
          >
            {label}
          </a>
        ))}

        {/* Language toggle — no box, clean text */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.02em',
            marginLeft: 4,
          }}
          aria-label="Language"
          role="group"
        >
          <a
            href="/"
            hrefLang="en"
            style={{
              color: locale === 'en' ? p.primary : p.inkSoft,
              textDecoration: locale === 'en' ? 'underline' : 'none',
              textUnderlineOffset: '3px',
              transition: 'color 180ms ease',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = p.primary)}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = locale === 'en' ? p.primary : p.inkSoft)}
          >
            EN
          </a>
          <span style={{ color: p.inkSoft, opacity: 0.4, fontWeight: 400 }}>·</span>
          <a
            href="/es"
            hrefLang="es"
            style={{
              color: locale === 'es' ? p.primary : p.inkSoft,
              textDecoration: locale === 'es' ? 'underline' : 'none',
              textUnderlineOffset: '3px',
              transition: 'color 180ms ease',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = p.primary)}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = locale === 'es' ? p.primary : p.inkSoft)}
          >
            ES
          </a>
        </div>

        <a
          href="tel:8322103968"
          style={{
            color: p.primary,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
            padding: '8px 16px',
            border: `1px solid ${p.primary}`,
            borderRadius: 999,
            transition: 'all 180ms ease',
            marginLeft: 4,
          }}
          onMouseOver={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = p.primary;
            el.style.color = p.paper;
          }}
          onMouseOut={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'transparent';
            el.style.color = p.primary;
          }}
        >
          (832) 210-3968
        </a>
      </nav>

      <button
        className="ys-nav-burger"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Menu"
        aria-expanded={menuOpen}
        style={{
          display: 'none',
          background: 'transparent',
          border: `1px solid ${p.line}`,
          borderRadius: 4,
          width: 40,
          height: 40,
          padding: 0,
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          {menuOpen ? (
            <path d="M4 4l10 10M14 4L4 14" stroke={p.ink} strokeWidth="1.6" strokeLinecap="round" />
          ) : (
            <>
              <path d="M2 5h14M2 9h14M2 13h14" stroke={p.ink} strokeWidth="1.6" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>

      {menuOpen && (
        <div
          className="ys-nav-mobile"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: p.paper,
            borderBottom: `1px solid ${p.line}`,
            padding: '16px var(--pad-x) 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: p.ink,
                textDecoration: 'none',
                fontFamily: "'Instrument Serif', serif",
                fontSize: 24,
                padding: '10px 0',
                borderBottom: `1px solid ${p.line}`,
                transition: 'color 160ms ease, padding-left 180ms ease',
                borderRadius: 2,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = p.accent;
                e.currentTarget.style.paddingLeft = '8px';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = p.ink;
                e.currentTarget.style.paddingLeft = '0px';
              }}
            >
              {label}
            </a>
          ))}

          {/* Mobile language toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '14px 0',
              fontSize: 16,
              fontWeight: 600,
              borderBottom: `1px solid ${p.line}`,
            }}
          >
            <a
              href="/"
              style={{
                color: locale === 'en' ? p.primary : p.inkSoft,
                textDecoration: locale === 'en' ? 'underline' : 'none',
                textUnderlineOffset: '3px',
              }}
            >
              English
            </a>
            <span style={{ color: p.inkSoft, opacity: 0.4 }}>·</span>
            <a
              href="/es"
              style={{
                color: locale === 'es' ? p.primary : p.inkSoft,
                textDecoration: locale === 'es' ? 'underline' : 'none',
                textUnderlineOffset: '3px',
              }}
            >
              Español
            </a>
          </div>

          <a
            href="tel:8322103968"
            style={{
              marginTop: 12,
              padding: '14px 20px',
              background: p.primary,
              color: p.paper,
              textDecoration: 'none',
              fontSize: 15,
              fontWeight: 600,
              textAlign: 'center',
              borderRadius: 4,
              transition: 'background 180ms ease, transform 180ms ease',
              display: 'block',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = p.primarySoft;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = p.primary;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {isEs ? 'Llamar (832) 210-3968' : 'Call (832) 210-3968'}
          </a>
        </div>
      )}
    </header>
  );
}
