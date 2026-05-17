'use client';

import { useState, useEffect } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import TourBooking from '@/components/TourBooking';
import dynamic from 'next/dynamic';
const AlvinMap = dynamic(() => import('@/components/AlvinMap'), { ssr: false });
import { PALETTES, PROPERTIES, FLOORPLANS, FAQS, AVAILABILITY } from '@/lib/data';

const p = PALETTES.forest;
const displayFont = 'Instrument Serif';

function Placeholder({ label }: { label: string }) {
  const stripeA = p.paper;
  const stripeB = `color-mix(in oklab, ${p.ink} 6%, ${p.paper})`;
  return (
    <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(135deg, ${stripeA} 0 14px, ${stripeB} 14px 28px)`, display: 'flex', alignItems: 'flex-end', padding: 14, color: p.ink, opacity: 0.95 }}>
      <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', background: p.paper, padding: '4px 8px', border: `1px solid color-mix(in oklab, ${p.ink} 15%, transparent)`, borderRadius: 2 }}>{label}</span>
    </div>
  );
}

function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <div className="ys-section-head" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, alignItems: 'start', marginBottom: 56 }}>
      <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, fontWeight: 600, paddingTop: 14 }}>{eyebrow}</div>
      <div>
        <h2 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(36px, 4.6vw, 60px)', lineHeight: 1.02, letterSpacing: '-0.02em', margin: 0, color: p.ink, fontWeight: 400, maxWidth: '16ch' }}>{title}</h2>
        {lead && <p style={{ fontSize: 17, lineHeight: 1.6, color: p.inkSoft, maxWidth: '55ch', marginTop: 24 }}>{lead}</p>}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="ys-hero" style={{ position: 'relative', padding: '180px var(--pad-x) 80px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.inkSoft, marginBottom: 32, fontWeight: 500 }}>
          <span style={{ width: 32, height: 1, background: p.inkSoft }}></span>
          Managed by Yellowstone Asset Management
        </div>
        <h1 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(56px, 8vw, 132px)', lineHeight: 0.95, letterSpacing: '-0.02em', margin: 0, color: p.ink, fontWeight: 400, maxWidth: '13ch' }}>
          A home in <em style={{ color: p.primary }}>Alvin,</em><br />made simple.
          <span style={{ display: 'inline-block', marginLeft: 18, verticalAlign: 'middle', fontSize: '0.55em', letterSpacing: 0, transform: 'translateY(-0.15em)', whiteSpace: 'nowrap' }} aria-label="home and love">
            <span style={{ display: 'inline-block', animation: 'ys-float 3.4s ease-in-out infinite' }}></span>
            <span style={{ display: 'inline-block', marginLeft: 6, color: '#E63946', animation: 'ys-beat 1.8s ease-in-out infinite' }}>♥︎</span>
          </span>
        </h1>
        <div className="ys-hero-row" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 80, marginTop: 72, alignItems: 'end' }}>
          <p style={{ fontSize: 19, lineHeight: 1.55, color: p.inkSoft, maxWidth: '44ch', margin: 0 }}>
            Yellowstone Management cares for over <strong style={{ color: p.ink }}>160 units across six properties</strong> in the city of Alvin, apartments and townhomes priced from $800 to $1,650, leased and maintained by a local team that picks up the phone.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button onClick={() => { if (typeof window !== 'undefined' && (window as any).__openBooking) (window as any).__openBooking(); }} style={{ padding: '16px 28px', background: p.primary, color: p.paper, textDecoration: 'none', fontSize: 15, fontWeight: 600, borderRadius: 4, letterSpacing: '0.01em', display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'transform 180ms ease, background 180ms ease', cursor: 'pointer', border: 'none', fontFamily: 'inherit' }} onMouseOver={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = p.primarySoft; el.style.transform = 'translateY(-1px)'; }} onMouseOut={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = p.primary; el.style.transform = 'translateY(0)'; }}>
              Book a tour
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            <a href="#properties" style={{ padding: '16px 28px', background: 'transparent', color: p.ink, textDecoration: 'none', fontSize: 15, fontWeight: 600, borderRadius: 4, border: `1px solid ${p.ink}` }}>See properties</a>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', marginTop: 80, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: `1px solid ${p.line}`, paddingTop: 28 }} className="ys-hero-stats">
        {[['150+', 'units under management'], ['6', 'properties in Alvin'], ['$899', 'starting rent'], ['Local', 'team, family-run']].map(([n, label], i) => (
          <div key={i} style={{ borderLeft: i === 0 ? 'none' : `1px solid ${p.line}`, paddingLeft: i === 0 ? 0 : 28 }}>
            <div style={{ fontFamily: `'${displayFont}', serif`, fontSize: 56, lineHeight: 1, color: p.ink, letterSpacing: '-0.02em' }}>{n}</div>
            <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: p.inkSoft, marginTop: 10, fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PropertyCard({ prop, idx }: { prop: (typeof PROPERTIES)[0]; idx: number }) {
  const [hover, setHover] = useState(false);
  return (
    <article onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ background: p.paper, border: `1px solid ${p.line}`, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 240ms ease, box-shadow 240ms ease', transform: hover ? 'translateY(-4px)' : 'translateY(0)', boxShadow: hover ? `0 24px 48px -24px color-mix(in oklab, ${p.ink} 30%, transparent)` : 'none' }}>
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
        <Placeholder label={prop.img} />
        <div style={{ position: 'absolute', top: 14, left: 14, background: p.paper, padding: '5px 10px', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.primary, fontWeight: 600, border: `1px solid ${p.line}` }}>
          {String(idx + 1).padStart(2, '0')} · {prop.tag}
        </div>
      </div>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <div>
          <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, lineHeight: 1.05, letterSpacing: '-0.01em', margin: 0, color: p.ink, fontWeight: 400 }}>{prop.name}</h3>
          <div style={{ fontSize: 14, color: p.inkSoft, marginTop: 4 }}>{prop.addr} · Alvin, TX</div>
        </div>
        <p style={{ fontSize: 14, color: p.inkSoft, lineHeight: 1.55, margin: 0, flex: 1 }}>{prop.note}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 14, borderTop: `1px solid ${p.line}` }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 500 }}>{prop.units}</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: p.primary, marginTop: 2 }}>{prop.price}</div>
          </div>
          <a href="#contact" style={{ fontSize: 13, fontWeight: 600, color: p.ink, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Inquire
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7m0 0L6.5 3m3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          </a>
        </div>
      </div>
    </article>
  );
}

function Properties() {
  return (
    <section id="properties" style={{ padding: 'var(--pad-x-lg) var(--pad-x)', borderTop: `1px solid ${p.line}` }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <SectionHead eyebrow="Six properties · One zip code" title="Every address we manage, all within Alvin." lead="From the flagship Kings Haven on South 2nd Street to the townhomes on Jackson, six communities, one local team." />
        <div className="ys-prop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {PROPERTIES.map((prop, i) => <PropertyCard key={i} prop={prop} idx={i} />)}
        </div>
      </div>
    </section>
  );
}

function Floorplans() {
  const [active, setActive] = useState(0);
  return (
    <section id="floorplans" style={{ padding: 'var(--pad-x-lg) var(--pad-x)', background: p.primary, color: p.paper }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="ys-section-head" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, alignItems: 'start', marginBottom: 56 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, fontWeight: 600, paddingTop: 14 }}>Floor plans · $800 to $1,650</div>
          <div>
            <h2 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(36px, 4.6vw, 60px)', lineHeight: 1.02, letterSpacing: '-0.02em', margin: 0, fontWeight: 400, maxWidth: '16ch', color: p.paper }}>Five layouts, honestly priced.</h2>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: `color-mix(in oklab, ${p.paper} 75%, transparent)`, maxWidth: '55ch', marginTop: 24 }}>Rents are listed up-front with no surprise fees. Availability changes weekly, call us to confirm what&apos;s open today.</p>
          </div>
        </div>
        <div className="ys-floor-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
          <div style={{ borderTop: `1px solid color-mix(in oklab, ${p.paper} 20%, transparent)` }}>
            {FLOORPLANS.map((f, i) => (
              <button key={i} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)} style={{ width: '100%', textAlign: 'left', padding: '24px 0', borderBottom: `1px solid color-mix(in oklab, ${p.paper} 20%, transparent)`, background: 'transparent', border: 'none', borderTop: 'none', cursor: 'pointer', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 24, alignItems: 'center', color: p.paper, opacity: active === i ? 1 : 0.55, transition: 'opacity 180ms ease', fontFamily: 'inherit' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: p.accent }}>0{i + 1}</span>
                <span style={{ fontFamily: `'${displayFont}', serif`, fontSize: 32, fontWeight: 400, letterSpacing: '-0.01em' }}>{f.type}</span>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{f.price}</span>
              </button>
            ))}
          </div>
          <div className="ys-floor-detail" style={{ background: `color-mix(in oklab, ${p.paper} 8%, transparent)`, border: `1px solid color-mix(in oklab, ${p.paper} 20%, transparent)`, padding: 40, position: 'sticky', top: 100 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, fontWeight: 600 }}>Layout 0{active + 1}</div>
            <h3 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 56, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1, margin: '16px 0 0' }}>{FLOORPLANS[active].type}</h3>
            <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div><div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 6 }}>Square feet</div><div style={{ fontSize: 18 }}>{FLOORPLANS[active].sqft}</div></div>
              <div><div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 6 }}>Monthly rent</div><div style={{ fontSize: 18 }}>{FLOORPLANS[active].price}</div></div>
              <div><div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 6 }}>Available now</div><div style={{ fontSize: 18 }}>{FLOORPLANS[active].available} units</div></div>
              <div><div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 6 }}>Deposit</div><div style={{ fontSize: 18 }}>One month&apos;s rent</div></div>
            </div>
            <button onClick={() => { if (typeof window !== 'undefined' && (window as any).__openBooking) (window as any).__openBooking(); }} style={{ marginTop: 32, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 24px', background: p.accent, color: p.paper, textDecoration: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}>
              Schedule a viewing
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  const items = [
    { n: '01', title: 'Local & responsive', body: 'Our office sits at 410 S 2nd St, the same building as Kings Haven. When you call, you reach the team that manages your home, not a national call center.' },
    { n: '02', title: 'Honest leasing', body: 'Rents are published on this page. No application bait-and-switch, no surprise admin fees. What you see is what you sign.' },
    { n: '03', title: 'Maintenance, handled', body: 'Submit a request and a technician we know personally is dispatched. Most non-emergency issues are closed within 48 hours.' },
  ];
  return (
    <section id="about" style={{ padding: 'var(--pad-x-lg) var(--pad-x)', borderTop: `1px solid ${p.line}` }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <SectionHead eyebrow="Why Yellowstone" title="Built around the way Alvin actually lives." lead="We're not a corporate landlord with a portfolio scattered across five states. Every property we manage is within ten minutes of our office, and that proximity is the whole point." />
        <div className="ys-about-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginTop: 24 }}>
          {items.map((it) => (
            <div key={it.n} style={{ padding: '32px 0', borderTop: `2px solid ${p.ink}` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: p.accent, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 16 }}>{it.n} / 03</div>
              <h3 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 32, fontWeight: 400, letterSpacing: '-0.01em', margin: 0, lineHeight: 1.05, color: p.ink }}>{it.title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: p.inkSoft, marginTop: 16 }}>{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [hovered, setHovered] = useState<string | null>(null);
  const channels = [
    { key: 'book', eyebrow: 'Preferred', label: 'Book a viewing', detail: '30 minutes · in-person or virtual · confirms in 24h', action: 'Schedule a tour', href: '#', onClick: (e: React.MouseEvent) => { e.preventDefault(); if (typeof window !== 'undefined' && (window as any).__openBooking) (window as any).__openBooking(); } },
    { key: 'call', eyebrow: 'Mon–Fri · 9–5 CT', label: '(832) 210-3968', detail: 'Direct line to the leasing office.', action: 'Call now', href: 'tel:8322103968' },
    { key: 'email', eyebrow: 'We reply within a business day', label: 'office@yellowstone-am.com', detail: 'Best for documents and lease questions.', action: 'Compose email', href: 'mailto:office@yellowstone-am.com' },
  ];
  return (
    <section id="contact" style={{ padding: 'var(--pad-x-lg) var(--pad-x)', background: p.paper, borderTop: `1px solid ${p.line}` }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="ys-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 80 }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, fontWeight: 600, marginBottom: 32 }}>Visit · Call · Schedule</div>
            <h2 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(40px, 6vw, 88px)', lineHeight: 0.98, letterSpacing: '-0.02em', margin: 0, fontWeight: 400, color: p.ink }}>Stop by the office, or pick a time online.</h2>
            <div style={{ marginTop: 48, padding: 32, border: `1px solid ${p.line}`, background: p.bg }}>
              <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 500 }}>Leasing office</div>
              <div style={{ fontFamily: `'${displayFont}', serif`, fontSize: 36, lineHeight: 1.1, color: p.ink, marginTop: 10, fontWeight: 400 }}>410 S 2nd Street<br />Alvin, TX 77511</div>
              <div style={{ marginTop: 20, display: 'flex', gap: 28, fontSize: 13, color: p.inkSoft, flexWrap: 'wrap' }}>
                <div><div style={{ fontWeight: 600, color: p.ink }}>Mon – Fri</div>9:00am – 5:00pm</div>
                <div><div style={{ fontWeight: 600, color: p.ink }}>Saturday</div>By appointment</div>
                <div><div style={{ fontWeight: 600, color: p.ink }}>Sunday</div>Closed</div>
              </div>
              <a href="https://maps.google.com/?q=410+S+2nd+St+Alvin+TX+77511" target="_blank" rel="noopener" style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: p.primary, textDecoration: 'none' }}>
                Get directions
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7m0 0L6.5 3m3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              </a>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {channels.map((c, i) => (
              <a key={c.key} href={c.href} onClick={c.onClick} onMouseEnter={() => setHovered(c.key)} onMouseLeave={() => setHovered(null)} style={{ display: 'block', padding: '32px 0', borderTop: i === 0 ? `1px solid ${p.line}` : 'none', borderBottom: `1px solid ${p.line}`, textDecoration: 'none', color: p.ink, transition: 'padding 220ms ease', paddingLeft: hovered === c.key ? 16 : 0, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: hovered === c.key ? 8 : 0, height: hovered === c.key ? 8 : 0, background: p.accent, transition: 'all 220ms ease' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 500, marginBottom: 12 }}>
                  <span>{c.eyebrow}</span>
                  <span style={{ color: p.accent }}>{c.action} →</span>
                </div>
                <div style={{ fontFamily: `'${displayFont}', serif`, fontSize: c.key === 'email' ? 'clamp(22px, 2.6vw, 30px)' : 36, lineHeight: 1.15, fontWeight: 400, letterSpacing: '-0.01em', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{c.label}</div>
                <div style={{ fontSize: 14, color: p.inkSoft, marginTop: 12 }}>{c.detail}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" style={{ padding: 'var(--pad-x-lg) var(--pad-x)', borderTop: `1px solid ${p.line}`, background: p.bg }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="ys-faq-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, fontWeight: 600, marginBottom: 18 }}>Common questions</div>
            <h2 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(36px, 4.6vw, 60px)', lineHeight: 1.02, letterSpacing: '-0.02em', margin: 0, color: p.ink, fontWeight: 400, maxWidth: '12ch' }}>Things renters usually ask first.</h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: p.inkSoft, marginTop: 24, maxWidth: '40ch' }}>Don&apos;t see your question? Call <a href="tel:8322103968" style={{ color: p.primary, textDecoration: 'none', fontWeight: 600 }}>(832) 210-3968</a>, a real person picks up.</p>
          </div>
          <div>
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={i} style={{ borderTop: i === 0 ? `1px solid ${p.line}` : 'none', borderBottom: `1px solid ${p.line}` }}>
                  <button onClick={() => setOpen(isOpen ? -1 : i)} style={{ width: '100%', textAlign: 'left', padding: '26px 0', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 20, color: p.ink }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: p.accent, fontWeight: 600, flexShrink: 0, width: 30 }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ flex: 1, fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(20px, 2.4vw, 28px)', fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{f.q}</span>
                    <span style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${p.line}`, display: 'grid', placeItems: 'center', flexShrink: 0, transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 220ms ease', background: isOpen ? p.ink : 'transparent', color: isOpen ? p.paper : p.ink }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                    </span>
                  </button>
                  <div style={{ maxHeight: isOpen ? 999 : 0, overflow: 'hidden', transition: 'max-height 320ms ease, padding 320ms ease', paddingBottom: isOpen ? 26 : 0, paddingLeft: 50 }}>
                    <p style={{ fontSize: 16, lineHeight: 1.65, color: p.inkSoft, margin: 0, maxWidth: '60ch' }}>{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Availability() {
  const [filter, setFilter] = useState('all');
  const filtered = AVAILABILITY.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'now') return a.ready.includes('now');
    if (filter === '1br') return a.type.startsWith('1 Bed');
    if (filter === '2br') return a.type.startsWith('2 Bed');
    if (filter === '3br') return a.type.startsWith('3 Bed');
    return true;
  });
  const filters = [['all', 'All open units'], ['now', 'Move-in now'], ['1br', '1 Bed'], ['2br', '2 Bed'], ['3br', '3 Bed']];
  return (
    <section id="availability" style={{ padding: 'var(--pad-x-lg) var(--pad-x)', background: p.paper, borderTop: `1px solid ${p.line}`, borderBottom: `1px solid ${p.line}` }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, gap: 32, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 0 rgba(34,197,94,0.5)', animation: 'ys-pulse 2s infinite' }}></span>
              Open this week
            </div>
            <h2 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 0.95, letterSpacing: '-0.02em', margin: 0, fontWeight: 400, color: p.ink, maxWidth: '16ch' }}>Available right now.</h2>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {filters.map(([k, label]) => (
              <button key={k} onClick={() => setFilter(k)} style={{ padding: '8px 14px', background: filter === k ? p.ink : 'transparent', color: filter === k ? p.paper : p.ink, border: `1px solid ${filter === k ? p.ink : p.line}`, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 999, transition: 'all 160ms ease' }}>{label}</button>
            ))}
          </div>
        </div>
        <div className="ys-avail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, background: p.line, border: `1px solid ${p.line}` }}>
          {filtered.length === 0 && <div style={{ gridColumn: '1 / -1', padding: 60, textAlign: 'center', background: p.paper, color: p.inkSoft, fontSize: 15 }}>No units match, call us, we may have something coming up.</div>}
          {filtered.map((u, i) => (
            <div key={i} style={{ background: p.paper, padding: 24, display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
              {u.featured && <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.accent, fontWeight: 600 }}>★ Featured</div>}
              <div>
                <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 500 }}>{u.property}</div>
                <div style={{ fontFamily: `'${displayFont}', serif`, fontSize: 26, lineHeight: 1.05, color: p.ink, marginTop: 6, fontWeight: 400, letterSpacing: '-0.01em' }}>{u.type}</div>
                <div style={{ fontSize: 13, color: p.inkSoft, marginTop: 4 }}>{u.addr} · {u.sqft} sq ft</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 14, borderTop: `1px solid ${p.line}`, marginTop: 'auto' }}>
                <div>
                  <div style={{ fontFamily: `'${displayFont}', serif`, fontSize: 28, color: p.primary, fontWeight: 400 }}>${u.price.toLocaleString()}<span style={{ fontSize: 13, color: p.inkSoft, fontFamily: 'Inter, sans-serif' }}>/mo</span></div>
                  <div style={{ fontSize: 11, color: u.ready.includes('now') ? '#16a34a' : p.inkSoft, marginTop: 2, fontWeight: 500 }}>{u.ready}</div>
                </div>
                <button onClick={() => { if (typeof window !== 'undefined' && (window as any).__openBooking) { const idMap: Record<string,string> = { 'Kings Haven': 'kings-haven', 'Kings Manor': 'kings-manor', 'Kings Haven (100)': 'kings-haven-100', 'French Quarter': 'french-quarter', 'Royal Oaks': 'royal-oaks', 'White House': 'white-house' }; (window as any).__openBooking(idMap[u.property] || ''); } }} style={{ fontSize: 12, fontWeight: 600, color: p.ink, textDecoration: 'none', padding: '8px 12px', border: `1px solid ${p.ink}`, borderRadius: 999, background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>Tour</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Apply() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState({ firstName: '', lastName: '', email: '', phone: '', dob: '', currentAddress: '', coApplicants: '0', pets: 'no', petDesc: '', vehicles: '1', employer: '', jobTitle: '', income: '', employedSince: '', prevLandlord: '', prevLandlordPhone: '', reasonLeaving: '', property: '', unitType: '', moveIn: '', budget: '', notes: '', consent: false });
  const update = (k: string, v: string | boolean) => setData((d) => ({ ...d, [k]: v }));

  const canAdvance = () => {
    if (step === 0) return data.firstName && data.lastName && data.email && data.phone;
    if (step === 2) return data.employer && data.income;
    if (step === 4) return data.property && data.unitType && data.moveIn;
    if (step === 5) return data.consent;
    return true;
  };

  const STEPS = [{ id: 'applicant', label: 'About you' }, { id: 'household', label: 'Household' }, { id: 'income', label: 'Employment & income' }, { id: 'history', label: 'Rental history' }, { id: 'preferences', label: 'Unit preferences' }, { id: 'review', label: 'Review & submit' }];
  const PROPERTY_OPTIONS = ['Kings Haven Apartments, 410 S 2nd St', 'Kings Manor Townhomes, 328 S 2nd St', 'Kings Haven Apartments, 100 S 2nd St', 'French Quarter Residency, 2550 S Bypass 35', 'The Royal Oaks Townhomes, 418 S Jackson St', 'The White House Apartments, 1606 W Sealy St', 'No preference, recommend one for me'];
  const UNIT_TYPES = ['1 Bed · 1 Bath', '2 Bed · 1 Bath', '2 Bed · 2 Bath', '3 Bed · 2 Bath', '3 Bed · 2.5 Bath'];

  async function handleSubmit() {
    if (!canAdvance()) return;
    setSubmitting(true); setError('');
    try {
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, type: 'apply' }) });
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Something went wrong.'); setSubmitting(false); return; }
      setSubmitted(true);
    } catch { setError('Network error. Please try again or call us.'); setSubmitting(false); }
  }

  const txt = { padding: '12px 14px', fontSize: 15, background: p.bg, border: `1px solid ${p.line}`, borderRadius: 4, color: p.ink, fontFamily: 'inherit', outline: 'none', transition: 'border-color 160ms ease', width: '100%' };

  if (submitted) {
    return (
      <section id="apply" style={{ padding: 'var(--pad-x-lg) var(--pad-x)', background: p.primary, color: p.paper, borderTop: `1px solid ${p.line}` }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: p.accent, color: p.paper, display: 'grid', placeItems: 'center', margin: '0 auto', fontSize: 28 }}>✓</div>
          <h2 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(40px, 5.5vw, 72px)', lineHeight: 1.02, margin: '32px 0 0', fontWeight: 400, letterSpacing: '-0.02em' }}>Application received.</h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: `color-mix(in oklab, ${p.paper} 80%, transparent)`, marginTop: 20 }}>Thanks, {data.firstName || 'there'}. A confirmation will hit <strong>{data.email || 'your inbox'}</strong> within an hour, and someone from the leasing office will follow up by phone within one business day.</p>
          <div style={{ marginTop: 40, display: 'inline-flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="tel:8322103968" style={{ padding: '14px 24px', background: p.paper, color: p.primary, textDecoration: 'none', fontWeight: 600, fontSize: 14, borderRadius: 4 }}>Call (832) 210-3968</a>
            <a href="mailto:office@yellowstone-am.com" style={{ padding: '14px 24px', background: 'transparent', color: p.paper, textDecoration: 'none', fontWeight: 600, fontSize: 14, border: `1px solid ${p.paper}`, borderRadius: 4 }}>office@yellowstone-am.com</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" style={{ padding: 'var(--pad-x-lg) var(--pad-x)', background: p.bg, borderTop: `1px solid ${p.line}` }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="ys-section-head" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, alignItems: 'start', marginBottom: 56 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, fontWeight: 600, paddingTop: 14 }}>Apply online · 5 minutes</div>
          <div>
            <h2 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(36px, 4.6vw, 60px)', lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0, color: p.ink, fontWeight: 400, maxWidth: '16ch' }}>Start your application from anywhere.</h2>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: p.inkSoft, maxWidth: '55ch', marginTop: 28 }}>Most applications are decided within 48 hours. Have an ID and a recent pay stub handy, that&apos;s it.</p>
          </div>
        </div>
        <div className="ys-apply-grid" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 48 }}>
          <div className="ys-apply-stepper">
            {STEPS.map((s, i) => {
              const done = i < step; const active = i === step;
              return (
                <button key={s.id} onClick={() => i < step && setStep(i)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', background: 'transparent', border: 'none', borderBottom: `1px solid ${p.line}`, cursor: i <= step ? 'pointer' : 'default', fontFamily: 'inherit', textAlign: 'left', width: '100%', opacity: active ? 1 : done ? 0.85 : 0.45 }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: active ? p.ink : done ? p.accent : 'transparent', color: active || done ? p.paper : p.inkSoft, border: active || done ? 'none' : `1px solid ${p.line}`, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" }}>{done ? '✓' : i + 1}</span>
                  <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: p.ink }}>{s.label}</span>
                </button>
              );
            })}
          </div>
          <div className="ys-apply-form" style={{ background: p.paper, border: `1px solid ${p.line}`, padding: '40px 44px', minHeight: 480, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.accent, fontWeight: 600 }}>Step {step + 1} of {STEPS.length}</div>
            <h3 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 36, fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.05, margin: '8px 0 32px' }}>{STEPS[step].label}</h3>
            {error && <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: 13, borderRadius: 4, marginBottom: 16 }}>{error}</div>}
            <div style={{ flex: 1 }}>
              {step === 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="ys-form-grid">
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>First name <span style={{ color: p.accent }}>*</span></span><input style={txt} value={data.firstName} onChange={(e) => update('firstName', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Last name <span style={{ color: p.accent }}>*</span></span><input style={txt} value={data.lastName} onChange={(e) => update('lastName', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Email <span style={{ color: p.accent }}>*</span></span><input type="email" style={txt} value={data.email} onChange={(e) => update('email', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Phone <span style={{ color: p.accent }}>*</span></span><input type="tel" style={txt} value={data.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(___) ___-____" /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Date of birth</span><input type="date" style={txt} value={data.dob} onChange={(e) => update('dob', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Current address</span><input style={txt} value={data.currentAddress} onChange={(e) => update('currentAddress', e.target.value)} placeholder="Street, city, state, zip" /></label>
                </div>
              )}
              {step === 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="ys-form-grid">
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Co-applicants (18+)</span><select style={txt} value={data.coApplicants} onChange={(e) => update('coApplicants', e.target.value)}>{['0','1','2','3','4+'].map(n => <option key={n}>{n}</option>)}</select></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Vehicles</span><select style={txt} value={data.vehicles} onChange={(e) => update('vehicles', e.target.value)}>{['0','1','2','3+'].map(n => <option key={n}>{n}</option>)}</select></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Pets</span><div style={{ display: 'flex', gap: 8 }}>{['no','cat','dog','both'].map(v => <button key={v} type="button" onClick={() => update('pets', v)} style={{ padding: '10px 16px', flex: 1, background: data.pets === v ? p.ink : 'transparent', color: data.pets === v ? p.paper : p.ink, border: `1px solid ${data.pets === v ? p.ink : p.line}`, borderRadius: 4, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>{v === 'no' ? 'No pets' : v}</button>)}</div></label>
                  {data.pets !== 'no' && <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Pet details (breed, weight, age)</span><input style={txt} value={data.petDesc} onChange={(e) => update('petDesc', e.target.value)} placeholder="e.g. Labrador, 65 lbs, 4 years" /></label>}
                </div>
              )}
              {step === 2 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="ys-form-grid">
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Employer <span style={{ color: p.accent }}>*</span></span><input style={txt} value={data.employer} onChange={(e) => update('employer', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Job title</span><input style={txt} value={data.jobTitle} onChange={(e) => update('jobTitle', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Employed since</span><input type="month" style={txt} value={data.employedSince} onChange={(e) => update('employedSince', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Gross monthly income <span style={{ color: p.accent }}>*</span></span><div style={{ position: 'relative' }}><span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: p.inkSoft, fontSize: 15 }}>$</span><input style={{ ...txt, paddingLeft: 28 }} value={data.income} onChange={(e) => update('income', e.target.value)} placeholder="3,500" /></div></label>
                </div>
              )}
              {step === 3 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="ys-form-grid">
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Previous landlord (name)</span><input style={txt} value={data.prevLandlord} onChange={(e) => update('prevLandlord', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Landlord phone</span><input type="tel" style={txt} value={data.prevLandlordPhone} onChange={(e) => update('prevLandlordPhone', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Reason for leaving</span><textarea rows={3} style={{ ...txt, resize: 'vertical', fontFamily: 'inherit' }} value={data.reasonLeaving} onChange={(e) => update('reasonLeaving', e.target.value)} /></label>
                  <div style={{ gridColumn: '1 / -1', fontSize: 13, color: p.inkSoft, lineHeight: 1.5, padding: 14, background: p.bg, border: `1px solid ${p.line}`, borderRadius: 4 }}>First-time renter? Leave these blank, we&apos;ll discuss your situation when we follow up.</div>
                </div>
              )}
              {step === 4 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="ys-form-grid">
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Preferred property <span style={{ color: p.accent }}>*</span></span><select style={txt} value={data.property} onChange={(e) => update('property', e.target.value)}><option value="">Choose a property…</option>{PROPERTY_OPTIONS.map(o => <option key={o}>{o}</option>)}</select></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Unit type <span style={{ color: p.accent }}>*</span></span><select style={txt} value={data.unitType} onChange={(e) => update('unitType', e.target.value)}><option value="">Select…</option>{UNIT_TYPES.map(o => <option key={o}>{o}</option>)}</select></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Earliest move-in <span style={{ color: p.accent }}>*</span></span><input type="date" style={txt} value={data.moveIn} onChange={(e) => update('moveIn', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Monthly budget</span><div style={{ position: 'relative' }}><span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: p.inkSoft, fontSize: 15 }}>$</span><input style={{ ...txt, paddingLeft: 28 }} value={data.budget} onChange={(e) => update('budget', e.target.value)} placeholder="1,200" /></div></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Anything else we should know?</span><textarea rows={3} style={{ ...txt, resize: 'vertical', fontFamily: 'inherit' }} value={data.notes} onChange={(e) => update('notes', e.target.value)} /></label>
                </div>
              )}
              {step === 5 && (
                <div>
                  <div style={{ background: p.bg, border: `1px solid ${p.line}`, padding: 24, borderRadius: 4, marginBottom: 24 }}>
                    <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600, marginBottom: 12 }}>Summary</div>
                    <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 24px', margin: 0, fontSize: 14 }}>
                      {[
                        ['Applicant', `${data.firstName || ''} ${data.lastName || ''}`.trim() || '—'],
                        ['Contact', data.email && data.phone ? `${data.email} · ${data.phone}` : '—'],
                        ['Pets', data.pets === 'no' ? 'None' : data.petDesc || data.pets],
                        ['Income', data.income ? `$${data.income}/mo` : '—'],
                        ['Property', data.property || '—'],
                        ['Unit type', data.unitType || '—'],
                        ['Move-in', data.moveIn || '—'],
                      ].map(([k, v]) => (
                        <div key={k} style={{ display: 'contents' }}>
                          <dt style={{ color: p.inkSoft, fontWeight: 500 }}>{k}</dt>
                          <dd style={{ margin: 0, color: p.ink }}>{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, border: `1px solid ${p.line}`, borderRadius: 4, cursor: 'pointer', background: data.consent ? p.bg : 'transparent' }}>
                    <input type="checkbox" checked={data.consent} onChange={(e) => update('consent', e.target.checked)} style={{ marginTop: 2, accentColor: p.primary }} />
                    <span style={{ fontSize: 13, color: p.inkSoft, lineHeight: 1.55 }}>I authorize Yellowstone Asset Management to verify the information above, including credit history, rental history, employment, and background. I understand the $40 application fee is non-refundable. Equal Housing Opportunity.</span>
                  </label>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 24, borderTop: `1px solid ${p.line}` }}>
              <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{ padding: '12px 20px', background: 'transparent', border: `1px solid ${step === 0 ? p.line : p.ink}`, color: step === 0 ? p.inkSoft : p.ink, fontSize: 14, fontWeight: 500, borderRadius: 4, cursor: step === 0 ? 'default' : 'pointer', fontFamily: 'inherit' }}>← Back</button>
              {step < STEPS.length - 1 ? (
                <button onClick={() => canAdvance() && setStep(s => s + 1)} disabled={!canAdvance()} style={{ padding: '12px 24px', background: canAdvance() ? p.primary : p.line, color: p.paper, fontSize: 14, fontWeight: 600, border: 'none', borderRadius: 4, cursor: canAdvance() ? 'pointer' : 'default', fontFamily: 'inherit' }}>Continue →</button>
              ) : (
                <button onClick={handleSubmit} disabled={!canAdvance() || submitting} style={{ padding: '14px 28px', background: canAdvance() && !submitting ? p.accent : p.line, color: p.paper, fontSize: 14, fontWeight: 600, border: 'none', borderRadius: 4, cursor: canAdvance() && !submitting ? 'pointer' : 'default', fontFamily: 'inherit' }}>{submitting ? 'Submitting…' : 'Submit application'}</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SellProperty() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', addr: '', type: 'Single-family', beds: '', baths: '', sqft: '', timeline: 'Just exploring', notes: '' });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, type: 'sell' }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong.'); setSubmitting(false); return; }
      setSent(true);
    } catch { setError('Network error. Please try again or call us.'); setSubmitting(false); }
  }

  const fieldStyle = { width: '100%', padding: '12px 14px', background: p.bg, border: `1px solid ${p.line}`, color: p.ink, fontSize: 15, fontFamily: 'inherit', borderRadius: 3, outline: 'none', transition: 'border-color 160ms ease' };
  const labelStyle = { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 500, marginBottom: 8, display: 'block' };

  return (
    <section id="sell" style={{ padding: 'var(--pad-x-lg) var(--pad-x)', borderTop: `1px solid ${p.line}`, background: p.ink, color: p.paper }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="ys-sell-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, fontWeight: 600, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 32, height: 1, background: p.accent }}></span>For property owners
            </div>
            <h2 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(40px, 6vw, 88px)', lineHeight: 0.98, letterSpacing: '-0.02em', margin: 0, fontWeight: 400, color: p.paper }}>Skip the agent. <em style={{ color: p.accent }}>Sell direct.</em></h2>
            <p style={{ fontSize: 18, lineHeight: 1.55, color: `color-mix(in oklab, ${p.paper} 80%, transparent)`, maxWidth: '50ch', marginTop: 28 }}>
              Yellowstone is actively buying single-family homes, duplexes, and small multifamily properties in Alvin and the surrounding area. We pay fair market value, close on your timeline, and cut the broker out, so you keep the commission.
            </p>
            <div className="ys-sell-features" style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                ['No commissions', 'Sell directly to us, no 6% fee, no listing agent.'],
                ['Honest offer', 'We make one fair, transparent offer. No bait-and-switch.'],
                ['Close on your terms', '30 days, 90 days, or whenever works, your call.'],
              ].map(([t, d], i) => (
                <div key={i} style={{ paddingTop: 18, borderTop: `1px solid color-mix(in oklab, ${p.paper} 25%, transparent)` }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: p.accent, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 10 }}>0{i + 1}</div>
                  <div style={{ fontFamily: `'${displayFont}', serif`, fontSize: 22, lineHeight: 1.1, color: p.paper, fontWeight: 400, letterSpacing: '-0.01em' }}>{t}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.55, color: `color-mix(in oklab, ${p.paper} 65%, transparent)`, marginTop: 8 }}>{d}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 40, padding: 24, background: `color-mix(in oklab, ${p.paper} 6%, transparent)`, border: `1px solid color-mix(in oklab, ${p.paper} 18%, transparent)`, display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: p.accent, color: p.paper, display: 'grid', placeItems: 'center', fontFamily: `'${displayFont}', serif`, fontSize: 22, flexShrink: 0 }}>★</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: p.paper }}>Prefer to talk first?</div>
                <div style={{ fontSize: 13, color: `color-mix(in oklab, ${p.paper} 70%, transparent)`, marginTop: 2 }}>Call <a href="tel:8322103968" style={{ color: p.accent, textDecoration: 'none', fontWeight: 600 }}>(832) 210-3968</a>, no obligation, no pressure.</div>
              </div>
            </div>
          </div>
          <div style={{ background: p.paper, color: p.ink, padding: 36, borderRadius: 2, border: `1px solid color-mix(in oklab, ${p.paper} 30%, transparent)` }}>
            {sent ? (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <div style={{ fontFamily: `'${displayFont}', serif`, fontSize: 36, color: p.primary, lineHeight: 1.05, marginBottom: 16 }}>Thanks, we&apos;ll be in touch.</div>
                <p style={{ fontSize: 15, color: p.inkSoft, lineHeight: 1.6, maxWidth: '32ch', margin: '0 auto' }}>Your inquiry has been sent. We typically respond within one business day.</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, fontWeight: 600, marginBottom: 8 }}>Step 1 of 1 · ~60 seconds</div>
                <h3 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 32, fontWeight: 400, letterSpacing: '-0.01em', margin: 0, color: p.ink, lineHeight: 1.05 }}>Tell us about your property.</h3>
                {error && <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: 13, borderRadius: 4, marginTop: 16 }}>{error}</div>}
                <div className="ys-sell-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 24 }}>
                  <div><label style={labelStyle}>Your name</label><input required style={fieldStyle} value={form.name} onChange={e => update('name', e.target.value)} /></div>
                  <div><label style={labelStyle}>Phone</label><input required type="tel" style={fieldStyle} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="(___) ___-____" /></div>
                </div>
                <div style={{ marginTop: 14 }}><label style={labelStyle}>Email</label><input required type="email" style={fieldStyle} value={form.email} onChange={e => update('email', e.target.value)} /></div>
                <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${p.line}` }}>
                  <label style={labelStyle}>Property address</label><input required style={fieldStyle} value={form.addr} onChange={e => update('addr', e.target.value)} placeholder="Street, city, ZIP" />
                </div>
                <div className="ys-sell-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
                  <div><label style={labelStyle}>Property type</label><select style={fieldStyle} value={form.type} onChange={e => update('type', e.target.value)}>{['Single-family','Duplex','Triplex / Fourplex','Small multifamily (5+)','Townhome / Condo','Land / Lot','Other'].map(t => <option key={t}>{t}</option>)}</select></div>
                  <div><label style={labelStyle}>Timeline</label><select style={fieldStyle} value={form.timeline} onChange={e => update('timeline', e.target.value)}>{['Just exploring','Within 30 days','1–3 months','3–6 months','6+ months'].map(t => <option key={t}>{t}</option>)}</select></div>
                </div>
                <div className="ys-sell-form-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginTop: 14 }}>
                  <div><label style={labelStyle}>Beds</label><input style={fieldStyle} value={form.beds} onChange={e => update('beds', e.target.value)} placeholder="3" /></div>
                  <div><label style={labelStyle}>Baths</label><input style={fieldStyle} value={form.baths} onChange={e => update('baths', e.target.value)} placeholder="2" /></div>
                  <div><label style={labelStyle}>Sq ft</label><input style={fieldStyle} value={form.sqft} onChange={e => update('sqft', e.target.value)} placeholder="1,500" /></div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={labelStyle}>Anything else? <span style={{ textTransform: 'none', letterSpacing: 0, color: p.inkSoft }}>(Optional)</span></label>
                  <textarea rows={3} style={{ ...fieldStyle, resize: 'vertical', minHeight: 80 }} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Condition, occupancy, why you're selling…" />
                </div>
                <button type="submit" disabled={submitting} style={{ marginTop: 28, width: '100%', padding: '16px 24px', background: p.primary, color: p.paper, border: 'none', fontSize: 15, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', letterSpacing: '0.01em', borderRadius: 3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? 'Sending…' : 'Send my property info'}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
                <p style={{ fontSize: 12, color: p.inkSoft, marginTop: 14, lineHeight: 1.5, textAlign: 'center' }}>We&apos;ll review and reach out within one business day. No spam, no listing pressure.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingPropId, setBookingPropId] = useState('');

  useEffect(() => {
    (window as any).__openBooking = (propId?: string) => { setBookingPropId(propId || ''); setBookingOpen(true); };
    return () => { delete (window as any).__openBooking; };
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.background = p.bg;
      document.body.style.color = p.ink;
      return () => {
        document.body.style.background = '';
        document.body.style.color = '';
      };
    }
  }, []);

  return (
    <div style={{ background: p.bg, color: p.ink, minHeight: '100vh' }}>
      <Nav p={p} locale="en" />
      <Hero />
      <div style={{ padding: '20px var(--pad-x)', background: p.ink, color: p.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', fontSize: 14 }}>
        <span style={{ opacity: 0.85 }}>Ready to move? Apply online in 5 minutes.</span>
        <a href="#apply" style={{ color: p.accent, fontWeight: 600, textDecoration: 'none' }}>Start application →</a>
      </div>
      <Availability />
      <Properties />
      <AlvinMap p={p} displayFont={displayFont} />
      <Floorplans />
      <About />
      <Apply />
      <FAQ />
      <SellProperty />
      <Contact />
      <Footer p={p} displayFont={displayFont} />
      <TourBooking open={bookingOpen} onClose={() => setBookingOpen(false)} p={p} displayFont={displayFont} initialPropertyId={bookingPropId} />

      <div className="ys-fab-stack" aria-label="Quick actions">
        <a className="ys-fab-text" href="sms:+18322103968?body=Hi%20Yellowstone%2C%20I%27m%20interested%20in%20a%20unit.">Text Us</a>
      </div>
    </div>
  );
}
