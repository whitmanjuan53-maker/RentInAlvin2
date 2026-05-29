'use client';

import { useState, useEffect } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import TourBooking from '@/components/TourBooking';
import LeadForm from '@/components/LeadForm';
import PropertyModal from '@/components/PropertyModal';
import dynamic from 'next/dynamic';
const AlvinMap = dynamic(() => import('@/components/AlvinMap'), { ssr: false });
import { PALETTES, COMMUNITIES, FLOORPLANS, FAQS, AVAILABILITY } from '@/lib/data.es';

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
        <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.inkSoft, marginBottom: 32, fontWeight: 500 }}>
          Administrado por Yellowstone Asset Management
        </div>
        <h1 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(56px, 8vw, 132px)', lineHeight: 0.95, letterSpacing: '-0.02em', margin: 0, color: p.ink, fontWeight: 400, maxWidth: '13ch' }}>
          Un hogar en <em style={{ color: p.primary }}>Alvin,</em><br />hecho simple.
          <span style={{ display: 'inline-block', marginLeft: 18, verticalAlign: 'middle', fontSize: '0.55em', letterSpacing: 0, transform: 'translateY(-0.15em)', whiteSpace: 'nowrap' }} aria-label="casa y amor">
            <span style={{ display: 'inline-block', animation: 'ys-float 3.4s ease-in-out infinite' }}></span>
            <span style={{ display: 'inline-block', marginLeft: 6, color: '#E63946', animation: 'ys-beat 1.8s ease-in-out infinite' }}>♥︎</span>
          </span>
        </h1>
        <div className="ys-hero-row" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 80, marginTop: 72, alignItems: 'end' }}>
          <p style={{ fontSize: 19, lineHeight: 1.55, color: p.inkSoft, maxWidth: '44ch', margin: 0 }}>
            Yellowstone Management cuida más de <strong style={{ color: p.ink }}>160 unidades en seis comunidades</strong> en la ciudad de Alvin, apartamentos y townhomes con precios desde $800 hasta $1,650, arrendados y mantenidos por un equipo local que contesta el teléfono.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button onClick={() => { if (typeof window !== 'undefined' && (window as any).__openBooking) (window as any).__openBooking(); }} style={{ padding: '16px 28px', background: p.primary, color: p.paper, textDecoration: 'none', fontSize: 15, fontWeight: 600, borderRadius: 4, letterSpacing: '0.01em', display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'transform 180ms ease, background 180ms ease', cursor: 'pointer', border: 'none', fontFamily: 'inherit' }} onMouseOver={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = p.primarySoft; el.style.transform = 'translateY(-1px)'; }} onMouseOut={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = p.primary; el.style.transform = 'translateY(0)'; }}>
              Reservar un tour
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            <a href="#comunidades" style={{ padding: '16px 28px', background: 'transparent', color: p.ink, textDecoration: 'none', fontSize: 15, fontWeight: 600, borderRadius: 4, border: `1px solid ${p.ink}` }}>Ver comunidades</a>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', marginTop: 80, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', paddingTop: 28 }} className="ys-hero-stats">
        {[['150+', 'unidades administradas'], ['6', 'comunidades en Alvin'], ['$899', 'renta inicial'], ['Local', 'equipo familiar']].map(([n, label], i) => (
          <div key={i} style={{ paddingLeft: i === 0 ? 0 : 28 }}>
            <div style={{ fontFamily: `'${displayFont}', serif`, fontSize: 56, lineHeight: 1, color: p.ink, letterSpacing: '-0.02em' }}>{n}</div>
            <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: p.inkSoft, marginTop: 10, fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CommunityCard({ prop, idx, onOpen }: { prop: (typeof COMMUNITIES)[0]; idx: number; onOpen?: () => void }) {
  const [hover, setHover] = useState(false);
  const [slide, setSlide] = useState(0);
  const gallery = prop.gallery || [];

  useEffect(() => {
    if (gallery.length <= 1) return;
    if (hover) return;
    const interval = setInterval(() => setSlide((s) => (s + 1) % gallery.length), 4000);
    return () => clearInterval(interval);
  }, [gallery.length, hover]);

  return (
    <article onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ background: p.paper, border: `1px solid ${p.line}`, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 240ms ease, box-shadow 240ms ease', transform: hover ? 'translateY(-4px)' : 'translateY(0)', boxShadow: hover ? `0 24px 48px -24px color-mix(in oklab, ${p.ink} 30%, transparent)` : 'none', cursor: onOpen ? 'pointer' : 'default' }} onClick={onOpen}>
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
        {gallery.length > 0 ? (
          <>
            <img src={gallery[slide]} alt={prop.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 500ms ease, opacity 300ms ease', transform: hover ? 'scale(1.04)' : 'scale(1)' }} />
            {gallery.length > 1 && hover && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setSlide((s) => (s - 1 + gallery.length) % gallery.length); }} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer', color: p.ink, zIndex: 5 }} aria-label="Foto anterior">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button onClick={(e) => { e.stopPropagation(); setSlide((s) => (s + 1) % gallery.length); }} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer', color: p.ink, zIndex: 5 }} aria-label="Siguiente foto">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </>
            )}
            {gallery.length > 1 && (
              <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5, zIndex: 4 }}>
                {gallery.map((_, i) => (
                  <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i === slide ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'background 200ms ease' }} />
                ))}
              </div>
            )}
          </>
        ) : (
          <Placeholder label={prop.img} />
        )}
        <div style={{ position: 'absolute', top: 14, left: 14, background: p.paper, padding: '5px 10px', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.primary, fontWeight: 600, border: `1px solid ${p.line}`, zIndex: 4 }}>
          {String(idx + 1).padStart(2, '0')} · {prop.tag}
        </div>
        {prop.comingSoon && (
          <div style={{ position: 'absolute', top: 14, right: 14, background: p.accent, color: p.paper, padding: '5px 10px', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, border: `1px solid ${p.accent}`, zIndex: 4 }}>
            Próximamente
          </div>
        )}
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
          {prop.comingSoon ? (
            <span style={{ fontSize: 13, fontWeight: 600, color: p.inkSoft }}>Próximamente</span>
          ) : (
            <a href="#contacto" onClick={(e) => e.stopPropagation()} style={{ fontSize: 13, fontWeight: 600, color: p.ink, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              Consultar
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7m0 0L6.5 3m3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function Communities({ onOpenProperty }: { onOpenProperty?: (prop: (typeof COMMUNITIES)[0]) => void }) {
  return (
    <section id="comunidades" style={{ padding: 'var(--pad-x-lg) var(--pad-x)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <SectionHead eyebrow="Seis comunidades · Un código postal" title="Cada dirección que administramos, todo en Alvin." lead="Desde el insignia Kings Haven en South 2nd Street hasta los townhomes en Jackson, seis comunidades, un equipo local." />
        <div className="ys-prop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {COMMUNITIES.map((prop, i) => <CommunityCard key={i} prop={prop} idx={i} onOpen={prop.gallery ? () => onOpenProperty?.(prop) : undefined} />)}
        </div>
      </div>
    </section>
  );
}

function Floorplans() {
  const [active, setActive] = useState(0);
  return (
    <section id="planes" style={{ padding: 'var(--pad-x-lg) var(--pad-x)', background: p.primary, color: p.paper }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="ys-section-head" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, alignItems: 'start', marginBottom: 56 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, fontWeight: 600, paddingTop: 14 }}>Planos · $800 a $1,650</div>
          <div>
            <h2 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(36px, 4.6vw, 60px)', lineHeight: 1.02, letterSpacing: '-0.02em', margin: 0, fontWeight: 400, maxWidth: '16ch', color: p.paper }}>Cinco diseños, precios honestos.</h2>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: `color-mix(in oklab, ${p.paper} 75%, transparent)`, maxWidth: '55ch', marginTop: 24 }}>Las rentas se muestran de antemano sin cargos sorpresa. La disponibilidad cambia semanalmente, llámenos para confirmar qué hay disponible hoy.</p>
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
              <div><div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 6 }}>Pies cuadrados</div><div style={{ fontSize: 18 }}>{FLOORPLANS[active].sqft}</div></div>
              <div><div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 6 }}>Renta mensual</div><div style={{ fontSize: 18 }}>{FLOORPLANS[active].price}</div></div>
              <div><div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 6 }}>Disponible ahora</div><div style={{ fontSize: 18 }}>{FLOORPLANS[active].available} unidades</div></div>
              <div><div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 6 }}>Depósito</div><div style={{ fontSize: 18 }}>Un mes de renta</div></div>
            </div>
            <button onClick={() => { if (typeof window !== 'undefined' && (window as any).__openBooking) (window as any).__openBooking(); }} style={{ marginTop: 32, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 24px', background: p.accent, color: p.paper, textDecoration: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}>
              Programar una visita
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
    { n: '01', title: 'Local y responsivo', body: 'Nuestra oficina está en 410 S 2nd St, el mismo edificio que Kings Haven. Cuando llama, llega al equipo que administra su hogar, no a un call center nacional.' },
    { n: '02', title: 'Arrendamiento honesto', body: 'Las rentas se publican en esta página. Sin cebo de aplicación, sin cargos administrativos sorpresa. Lo que ve es lo que firma.' },
    { n: '03', title: 'Mantenimiento, resuelto', body: 'Envíe una solicitud y un técnico que conocemos personalmente es enviado. La mayoría de los problemas no urgentes se resuelven en 48 horas.' },
  ];
  return (
    <section id="nosotros" style={{ padding: 'var(--pad-x-lg) var(--pad-x)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <SectionHead eyebrow="Por qué Yellowstone" title="Construido alrededor de cómo Alvin realmente vive." lead="No somos un arrendador corporativo con un portafolio disperso en cinco estados. Cada propiedad que administramos está a diez minutos de nuestra oficina, y esa proximidad es el punto clave." />
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
    { key: 'book', eyebrow: 'Preferido', label: 'Reservar un tour', detail: '30 minutos · en persona o virtual · confirma en 24h', action: 'Programar tour', href: '#', onClick: (e: React.MouseEvent) => { e.preventDefault(); if (typeof window !== 'undefined' && (window as any).__openBooking) (window as any).__openBooking(); } },
    { key: 'call', eyebrow: 'Lun–Vie · 9–5 CT', label: '(832) 210-3968', detail: 'Línea directa a la oficina de arrendamiento.', action: 'Llamar ahora', href: 'tel:8322103968' },
    { key: 'email', eyebrow: 'Respondemos en un día hábil', label: 'office@yellowstone-am.com', detail: 'Ideal para documentos y preguntas de arrendamiento.', action: 'Escribir correo', href: 'mailto:office@yellowstone-am.com' },
  ];
  return (
    <section id="contacto" style={{ padding: 'var(--pad-x-lg) var(--pad-x)', background: p.paper }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="ys-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 80 }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, fontWeight: 600, marginBottom: 32 }}>Visitar · Llamar · Programar</div>
            <h2 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(40px, 6vw, 88px)', lineHeight: 0.98, letterSpacing: '-0.02em', margin: 0, fontWeight: 400, color: p.ink }}>Pase por la oficina, o elija una hora en línea.</h2>
            <div style={{ marginTop: 48, padding: 32, border: `1px solid ${p.line}`, background: p.bg }}>
              <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 500 }}>Oficina de arrendamiento</div>
              <div style={{ fontFamily: `'${displayFont}', serif`, fontSize: 36, lineHeight: 1.1, color: p.ink, marginTop: 10, fontWeight: 400 }}>410 S 2nd Street<br />Alvin, TX 77511</div>
              <div style={{ marginTop: 20, display: 'flex', gap: 28, fontSize: 13, color: p.inkSoft, flexWrap: 'wrap' }}>
                <div><div style={{ fontWeight: 600, color: p.ink }}>Lun – Vie</div>9:00am – 5:00pm</div>
                <div><div style={{ fontWeight: 600, color: p.ink }}>Sábado</div>Con cita</div>
                <div><div style={{ fontWeight: 600, color: p.ink }}>Domingo</div>Cerrado</div>
              </div>
              <a href="https://maps.google.com/?q=410+S+2nd+St+Alvin+TX+77511" target="_blank" rel="noopener" style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: p.primary, textDecoration: 'none' }}>
                Cómo llegar
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

        {/* Lead Inquiry Form */}
        <div style={{ marginTop: 64, paddingTop: 48, borderTop: `1px solid ${p.line}` }}>
          <div className="ys-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 80, alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, fontWeight: 600, marginBottom: 16 }}>Consulta general</div>
              <h3 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.05, letterSpacing: '-0.02em', margin: 0, fontWeight: 400, color: p.ink }}>¿Aún no listo para reservar un tour?</h3>
              <p style={{ fontSize: 17, lineHeight: 1.6, color: p.inkSoft, maxWidth: '44ch', marginTop: 16 }}>Envíenos un mensaje rápido y nos comunicaremos con usted con disponibilidad, precios y siguientes pasos.</p>
              <div style={{ marginTop: 28, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <a href="tel:8322103968" style={{ padding: '12px 20px', background: p.ink, color: p.paper, textDecoration: 'none', fontWeight: 600, fontSize: 14, borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 2.5a2 2 0 012-2h1.5l1 2.5-1.5 1a7 7 0 004 4l1-1.5 2.5 1V10a2 2 0 01-2 2h-.5A7.5 7.5 0 012.5 4.5V4a2 2 0 012-1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                  Llamar (832) 210-3968
                </a>
                <a href="sms:+18322103968?body=Hola%20Yellowstone%2C%20estoy%20interesado%20en%20una%20unidad." style={{ padding: '12px 20px', background: 'transparent', color: p.ink, textDecoration: 'none', fontWeight: 600, fontSize: 14, border: `1px solid ${p.ink}`, borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7c0 3.5 2.5 6 6 6h2.5a1.5 1.5 0 001.5-1.5V10a1 1 0 00-1-1h-1a1 1 0 00-1 1v.5h-1C5.5 10.5 3.5 8.5 3.5 6H4a1 1 0 001-1V4a1 1 0 00-1-1h-.5A1.5 1.5 0 002 4.5V7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                  Envíenos un mensaje
                </a>
              </div>
            </div>
            <LeadForm p={p} displayFont={displayFont} />
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="preguntas" style={{ padding: 'var(--pad-x-lg) var(--pad-x)', background: p.bg }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="ys-faq-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, fontWeight: 600, marginBottom: 18 }}>Preguntas frecuentes</div>
            <h2 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(36px, 4.6vw, 60px)', lineHeight: 1.02, letterSpacing: '-0.02em', margin: 0, color: p.ink, fontWeight: 400, maxWidth: '12ch' }}>Lo que los inquilinos suelen preguntar primero.</h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: p.inkSoft, marginTop: 24, maxWidth: '40ch' }}>¿No ve su pregunta? Llame al <a href="tel:8322103968" style={{ color: p.primary, textDecoration: 'none', fontWeight: 600 }}>(832) 210-3968</a>, una persona real contesta.</p>
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
    if (filter === 'now') return a.ready.includes('Disponible ahora');
    if (filter === '1br') return a.type.startsWith('1 Rec');
    if (filter === '2br') return a.type.startsWith('2 Rec');
    if (filter === '3br') return a.type.startsWith('3 Rec');
    return true;
  });
  const filters = [['all', 'Todas las unidades'], ['now', 'Mudanza inmediata'], ['1br', '1 Rec'], ['2br', '2 Rec'], ['3br', '3 Rec']];
  return (
    <section id="disponibilidad" style={{ padding: 'var(--pad-x-lg) var(--pad-x)', background: p.paper }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, gap: 32, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 0 rgba(34,197,94,0.5)', animation: 'ys-pulse 2s infinite' }}></span>
              Abierto esta semana
            </div>
            <h2 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 0.95, letterSpacing: '-0.02em', margin: 0, fontWeight: 400, color: p.ink, maxWidth: '16ch' }}>Disponible ahora mismo.</h2>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {filters.map(([k, label]) => (
              <button key={k} onClick={() => setFilter(k)} style={{ padding: '8px 14px', background: filter === k ? p.ink : 'transparent', color: filter === k ? p.paper : p.ink, border: `1px solid ${filter === k ? p.ink : p.line}`, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 999, transition: 'all 160ms ease' }}>{label}</button>
            ))}
          </div>
        </div>
        <div className="ys-avail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, background: p.line, border: `1px solid ${p.line}` }}>
          {filtered.length === 0 && <div style={{ gridColumn: '1 / -1', padding: 60, textAlign: 'center', background: p.paper, color: p.inkSoft, fontSize: 15 }}>No hay coincidencias, llámenos, podemos tener algo próximamente.</div>}
          {filtered.map((u, i) => (
            <div key={i} style={{ background: p.paper, padding: 24, display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
              {u.featured && <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.accent, fontWeight: 600 }}>★ Featured</div>}
              <div>
                <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 500 }}>{u.property}</div>
                <div style={{ fontFamily: `'${displayFont}', serif`, fontSize: 26, lineHeight: 1.05, color: p.ink, marginTop: 6, fontWeight: 400, letterSpacing: '-0.01em' }}>{u.type}</div>
                <div style={{ fontSize: 13, color: p.inkSoft, marginTop: 4 }}>{u.addr} · {u.sqft} ft²</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 14, borderTop: `1px solid ${p.line}`, marginTop: 'auto' }}>
                <div>
                  <div style={{ fontFamily: `'${displayFont}', serif`, fontSize: 28, color: u.ready.includes('Próximamente') ? p.inkSoft : p.primary, fontWeight: 400 }}>${u.price.toLocaleString()}<span style={{ fontSize: 13, color: p.inkSoft, fontFamily: 'Inter, sans-serif' }}>/mes</span></div>
                  <div style={{ fontSize: 11, color: u.ready.includes('ahora') ? '#16a34a' : u.ready.includes('Próximamente') ? p.accent : p.inkSoft, marginTop: 2, fontWeight: 500 }}>{u.ready}</div>
                </div>
                {u.ready.includes('Próximamente') ? (
                  <span style={{ fontSize: 12, fontWeight: 600, color: p.inkSoft }}>Próximamente</span>
                ) : (
                  <button onClick={() => { if (typeof window !== 'undefined' && (window as any).__openBooking) { const idMap: Record<string,string> = { 'Kings Haven': 'kings-haven', 'Kings Manor': 'kings-manor', 'Kings Haven (100)': 'kings-haven-100', 'French Quarter': 'french-quarter', 'Royal Oaks': 'royal-oaks', 'White House': 'white-house' }; (window as any).__openBooking(idMap[u.property] || ''); } }} style={{ fontSize: 12, fontWeight: 600, color: p.ink, textDecoration: 'none', padding: '8px 12px', border: `1px solid ${p.ink}`, borderRadius: 999, background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>Tour</button>
                )}
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

  const STEPS = [{ id: 'applicant', label: 'Sobre usted' }, { id: 'household', label: 'Hogar' }, { id: 'income', label: 'Empleo e ingresos' }, { id: 'history', label: 'Historial de renta' }, { id: 'preferences', label: 'Preferencias de unidad' }, { id: 'review', label: 'Revisar y enviar' }];
  const PROPERTY_OPTIONS = ['Kings Haven Apartments, 410 S 2nd St', 'Kings Manor Townhomes, 328 S 2nd St', 'Kings Haven Apartments, 100 S 2nd St', 'French Quarter Residency, 2550 S Bypass 35', 'The White House Apartments, 1606 W Sealy St', 'The Royal Oaks Townhomes, 418 S Jackson St', 'Sin preferencia, recomiéndame una'];
  const UNIT_TYPES = ['1 Rec · 1 Baño', '2 Rec · 1 Baño', '2 Rec · 2 Baños', '3 Rec · 2 Baños', '3 Rec · 2.5 Baños'];

  async function handleSubmit() {
    if (!canAdvance()) return;

    // Final validation before submit
    if (!data.firstName.trim() || !data.lastName.trim() || !data.email.trim() || !data.phone.trim()) {
      setError('Por favor complete todos los campos requeridos en el Paso 1 (Sobre usted).');
      setSubmitting(false);
      return;
    }
    if (!data.employer.trim() || !data.income.trim()) {
      setError('Por favor complete todos los campos requeridos en el Paso 3 (Empleo e ingresos).');
      setSubmitting(false);
      return;
    }
    if (!data.property || !data.unitType || !data.moveIn) {
      setError('Por favor complete todos los campos requeridos en el Paso 5 (Preferencias de unidad).');
      setSubmitting(false);
      return;
    }

    setSubmitting(true); setError('');
    console.log('[Apply ES] Submitting application...');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          formType: 'Apply',
          pageUrl: typeof window !== 'undefined' ? window.location.href : ''
        })
      });
      const json = await res.json();
      console.log('[Apply ES] Response:', json);
      if (!res.ok) { setError(json.message || json.error || 'Algo salió mal.'); setSubmitting(false); return; }
      setSubmitted(true);
    } catch { setError('Error de red. Intente de nuevo o llámenos.'); setSubmitting(false); }
  }

  const txt = { padding: '12px 14px', fontSize: 15, background: p.bg, border: `1px solid ${p.line}`, borderRadius: 4, color: p.ink, fontFamily: 'inherit', outline: 'none', transition: 'border-color 160ms ease', width: '100%' };

  if (submitted) {
    return (
      <section id="aplicar" style={{ padding: 'var(--pad-x-lg) var(--pad-x)', background: p.primary, color: p.paper }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: p.accent, color: p.paper, display: 'grid', placeItems: 'center', margin: '0 auto', fontSize: 28 }}>✓</div>
          <h2 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(40px, 5.5vw, 72px)', lineHeight: 1.02, margin: '32px 0 0', fontWeight: 400, letterSpacing: '-0.02em' }}>Aplicación recibida.</h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: `color-mix(in oklab, ${p.paper} 80%, transparent)`, marginTop: 20 }}>Gracias, {data.firstName || 'amigo'}. Una confirmación llegará a <strong>{data.email || 'su correo'}</strong> dentro de una hora, y alguien de la oficina de arrendamiento hará seguimiento por teléfono dentro de un día hábil.</p>
          <div style={{ marginTop: 40, display: 'inline-flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="tel:8322103968" style={{ padding: '14px 24px', background: p.paper, color: p.primary, textDecoration: 'none', fontWeight: 600, fontSize: 14, borderRadius: 4 }}>Llamar (832) 210-3968</a>
            <a href="mailto:office@yellowstone-am.com" style={{ padding: '14px 24px', background: 'transparent', color: p.paper, textDecoration: 'none', fontWeight: 600, fontSize: 14, border: `1px solid ${p.paper}`, borderRadius: 4 }}>office@yellowstone-am.com</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="aplicar" style={{ padding: 'var(--pad-x-lg) var(--pad-x)', background: p.bg }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="ys-section-head" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, alignItems: 'start', marginBottom: 56 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, fontWeight: 600, paddingTop: 14 }}>Aplique en línea · 5 minutos</div>
          <div>
            <h2 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(36px, 4.6vw, 60px)', lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0, color: p.ink, fontWeight: 400, maxWidth: '16ch' }}>Comience su aplicación desde cualquier lugar.</h2>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: p.inkSoft, maxWidth: '55ch', marginTop: 28 }}>La mayoría de las aplicaciones se deciden en 48 horas. Tenga una identificación y un recibo de pago reciente a la mano, eso es todo.</p>
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
            <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.accent, fontWeight: 600 }}>Paso {step + 1} de {STEPS.length}</div>
            <h3 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 36, fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.05, margin: '8px 0 32px' }}>{STEPS[step].label}</h3>
            {error && <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: 13, borderRadius: 4, marginBottom: 16 }}>{error}</div>}
            <div style={{ flex: 1 }}>
              {step === 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="ys-form-grid">
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Nombre <span style={{ color: p.accent }}>*</span></span><input style={txt} value={data.firstName} onChange={(e) => update('firstName', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Apellido <span style={{ color: p.accent }}>*</span></span><input style={txt} value={data.lastName} onChange={(e) => update('lastName', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Correo <span style={{ color: p.accent }}>*</span></span><input type="email" style={txt} value={data.email} onChange={(e) => update('email', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Teléfono <span style={{ color: p.accent }}>*</span></span><input type="tel" style={txt} value={data.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(832) 210-3968" /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Fecha de nacimiento</span><input type="date" style={txt} value={data.dob} onChange={(e) => update('dob', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Dirección actual</span><input style={txt} value={data.currentAddress} onChange={(e) => update('currentAddress', e.target.value)} placeholder="Calle, ciudad, estado, zip" /></label>
                </div>
              )}
              {step === 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="ys-form-grid">
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Co-solicitantes (18+)</span><select style={txt} value={data.coApplicants} onChange={(e) => update('coApplicants', e.target.value)}>{['0','1','2','3','4+'].map(n => <option key={n}>{n}</option>)}</select></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Vehículos</span><select style={txt} value={data.vehicles} onChange={(e) => update('vehicles', e.target.value)}>{['0','1','2','3+'].map(n => <option key={n}>{n}</option>)}</select></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Mascotas</span><div style={{ display: 'flex', gap: 8 }}>{['no','cat','dog','both'].map(v => <button key={v} type="button" onClick={() => update('pets', v)} style={{ padding: '10px 16px', flex: 1, background: data.pets === v ? p.ink : 'transparent', color: data.pets === v ? p.paper : p.ink, border: `1px solid ${data.pets === v ? p.ink : p.line}`, borderRadius: 4, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>{v === 'no' ? 'Sin mascotas' : v === 'cat' ? 'Gato' : v === 'dog' ? 'Perro' : 'Ambos'}</button>)}</div></label>
                  {data.pets !== 'no' && <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Detalles de mascota (raza, peso, edad)</span><input style={txt} value={data.petDesc} onChange={(e) => update('petDesc', e.target.value)} placeholder="ej. Labrador, 65 lbs, 4 años" /></label>}
                </div>
              )}
              {step === 2 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="ys-form-grid">
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Empleador <span style={{ color: p.accent }}>*</span></span><input style={txt} value={data.employer} onChange={(e) => update('employer', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Puesto</span><input style={txt} value={data.jobTitle} onChange={(e) => update('jobTitle', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Empleado desde</span><input type="month" style={txt} value={data.employedSince} onChange={(e) => update('employedSince', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Ingreso mensual bruto <span style={{ color: p.accent }}>*</span></span><div style={{ position: 'relative' }}><span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: p.inkSoft, fontSize: 15 }}>$</span><input style={{ ...txt, paddingLeft: 28 }} value={data.income} onChange={(e) => update('income', e.target.value)} placeholder="3,500" /></div></label>
                </div>
              )}
              {step === 3 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="ys-form-grid">
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Arrendador anterior (nombre)</span><input style={txt} value={data.prevLandlord} onChange={(e) => update('prevLandlord', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Teléfono del arrendador</span><input type="tel" style={txt} value={data.prevLandlordPhone} onChange={(e) => update('prevLandlordPhone', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Motivo de salida</span><textarea rows={3} style={{ ...txt, resize: 'vertical', fontFamily: 'inherit' }} value={data.reasonLeaving} onChange={(e) => update('reasonLeaving', e.target.value)} /></label>
                  <div style={{ gridColumn: '1 / -1', fontSize: 13, color: p.inkSoft, lineHeight: 1.5, padding: 14, background: p.bg, border: `1px solid ${p.line}`, borderRadius: 4 }}>¿Primer inquilino? Déjelos en blanco, hablaremos de su situación cuando hagamos seguimiento.</div>
                </div>
              )}
              {step === 4 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="ys-form-grid">
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Comunidad preferida <span style={{ color: p.accent }}>*</span></span><select style={txt} value={data.property} onChange={(e) => update('property', e.target.value)}><option value="">Elija una comunidad…</option>{PROPERTY_OPTIONS.map(o => <option key={o}>{o}</option>)}</select></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Tipo de unidad <span style={{ color: p.accent }}>*</span></span><select style={txt} value={data.unitType} onChange={(e) => update('unitType', e.target.value)}><option value="">Seleccionar…</option>{UNIT_TYPES.map(o => <option key={o}>{o}</option>)}</select></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Mudanza más temprana <span style={{ color: p.accent }}>*</span></span><input type="date" style={txt} value={data.moveIn} onChange={(e) => update('moveIn', e.target.value)} /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>Presupuesto mensual</span><div style={{ position: 'relative' }}><span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: p.inkSoft, fontSize: 15 }}>$</span><input style={{ ...txt, paddingLeft: 28 }} value={data.budget} onChange={(e) => update('budget', e.target.value)} placeholder="1,200" /></div></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}><span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600 }}>¿Algo más que debamos saber?</span><textarea rows={3} style={{ ...txt, resize: 'vertical', fontFamily: 'inherit' }} value={data.notes} onChange={(e) => update('notes', e.target.value)} /></label>
                </div>
              )}
              {step === 5 && (
                <div>
                  <div style={{ background: p.bg, border: `1px solid ${p.line}`, padding: 24, borderRadius: 4, marginBottom: 24 }}>
                    <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 600, marginBottom: 12 }}>Resumen</div>
                    <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 24px', margin: 0, fontSize: 14 }}>
                      {[
                        ['Solicitante', `${data.firstName || ''} ${data.lastName || ''}`.trim() || '—'],
                        ['Contacto', data.email && data.phone ? `${data.email} · ${data.phone}` : '—'],
                        ['Mascotas', data.pets === 'no' ? 'Ninguna' : data.petDesc || data.pets],
                        ['Ingresos', data.income ? `$${data.income}/mes` : '—'],
                        ['Comunidad', data.property || '—'],
                        ['Tipo de unidad', data.unitType || '—'],
                        ['Mudanza', data.moveIn || '—'],
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
                    <span style={{ fontSize: 13, color: p.inkSoft, lineHeight: 1.55 }}>Autorizo a Yellowstone Asset Management a verificar la información anterior, incluyendo historial de crédito, historial de renta, empleo y antecedentes. Entiendo que la cuota de aplicación de $40 no es reembolsable. Igualdad de Oportunidades de Vivienda.</span>
                  </label>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 24, borderTop: `1px solid ${p.line}` }}>
              <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{ padding: '12px 20px', background: 'transparent', border: `1px solid ${step === 0 ? p.line : p.ink}`, color: step === 0 ? p.inkSoft : p.ink, fontSize: 14, fontWeight: 500, borderRadius: 4, cursor: step === 0 ? 'default' : 'pointer', fontFamily: 'inherit' }}>← Atrás</button>
              {step < STEPS.length - 1 ? (
                <button onClick={() => canAdvance() && setStep(s => s + 1)} disabled={!canAdvance()} style={{ padding: '12px 24px', background: canAdvance() ? p.primary : p.line, color: p.paper, fontSize: 14, fontWeight: 600, border: 'none', borderRadius: 4, cursor: canAdvance() ? 'pointer' : 'default', fontFamily: 'inherit' }}>Continuar →</button>
              ) : (
                <button onClick={handleSubmit} disabled={!canAdvance() || submitting} style={{ padding: '14px 28px', background: canAdvance() && !submitting ? p.accent : p.line, color: p.paper, fontSize: 14, fontWeight: 600, border: 'none', borderRadius: 4, cursor: canAdvance() && !submitting ? 'pointer' : 'default', fontFamily: 'inherit' }}>{submitting ? 'Enviando…' : 'Enviar aplicación'}</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SellProperty() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', addr: '', type: 'Unifamiliar', beds: '', baths: '', sqft: '', timeline: 'Solo explorando', notes: '' });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!form.name.trim()) { setError('Por favor ingrese su nombre.'); return; }
    if (!form.phone.trim()) { setError('Por favor ingrese su número de teléfono.'); return; }
    if (!form.email.trim()) { setError('Por favor ingrese su correo electrónico.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) { setError('Por favor ingrese un correo electrónico válido.'); return; }
    if (!form.addr.trim()) { setError('Por favor ingrese la dirección de la propiedad.'); return; }

    setSubmitting(true); setError('');
    console.log('[SellProperty ES] Submitting sell inquiry...');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          formType: 'Sell',
          pageUrl: typeof window !== 'undefined' ? window.location.href : ''
        })
      });
      const data = await res.json();
      console.log('[SellProperty ES] Response:', data);
      if (!res.ok) { setError(data.message || data.error || 'Algo salió mal.'); setSubmitting(false); return; }
      setSent(true);
    } catch { setError('Error de red. Intente de nuevo o llámenos.'); setSubmitting(false); }
  }

  const fieldStyle = { width: '100%', padding: '12px 14px', background: p.bg, border: `1px solid ${p.line}`, color: p.ink, fontSize: 15, fontFamily: 'inherit', borderRadius: 3, outline: 'none', transition: 'border-color 160ms ease' };
  const labelStyle = { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.inkSoft, fontWeight: 500, marginBottom: 8, display: 'block' };

  return (
    <section id="vender" style={{ padding: 'var(--pad-x-lg) var(--pad-x)', background: p.ink, color: p.paper }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="ys-sell-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, fontWeight: 600, marginBottom: 24 }}>
              Para propietarios
            </div>
            <h2 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(40px, 6vw, 88px)', lineHeight: 0.98, letterSpacing: '-0.02em', margin: 0, fontWeight: 400, color: p.paper }}>Omita el agente. <em style={{ color: p.accent }}>Venda directo.</em></h2>
            <p style={{ fontSize: 18, lineHeight: 1.55, color: `color-mix(in oklab, ${p.paper} 80%, transparent)`, maxWidth: '50ch', marginTop: 28 }}>
              Yellowstone está comprando activamente casas unifamiliares, dúplex y propiedades multifamiliares pequeñas en Alvin y el área circundante. Pagamos el valor justo de mercado, cerramos en su timeline, y eliminamos al corredor, para que usted se quede con la comisión.
            </p>
            <div className="ys-sell-features" style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                ['Sin comisiones', 'Venda directo a nosotros, sin tarifa del 6%, sin agente.'],
                ['Oferta honesta', 'Hacemos una oferta justa y transparente. Sin engaños.'],
                ['Cierre a su manera', '30 días, 90 días, o cuando funcione, usted decide.'],
              ].map(([t, d], i) => (
                <div key={i} style={{ paddingTop: 18 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: p.accent, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 10 }}>0{i + 1}</div>
                  <div style={{ fontFamily: `'${displayFont}', serif`, fontSize: 22, lineHeight: 1.1, color: p.paper, fontWeight: 400, letterSpacing: '-0.01em' }}>{t}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.55, color: `color-mix(in oklab, ${p.paper} 65%, transparent)`, marginTop: 8 }}>{d}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 40, padding: 24, background: `color-mix(in oklab, ${p.paper} 6%, transparent)`, display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: p.accent, color: p.paper, display: 'grid', placeItems: 'center', fontFamily: `'${displayFont}', serif`, fontSize: 22, flexShrink: 0 }}>★</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: p.paper }}>¿Prefiere hablar primero?</div>
                <div style={{ fontSize: 13, color: `color-mix(in oklab, ${p.paper} 70%, transparent)`, marginTop: 2 }}>Llame al <a href="tel:8322103968" style={{ color: p.accent, textDecoration: 'none', fontWeight: 600 }}>(832) 210-3968</a>, sin obligación, sin presión.</div>
              </div>
            </div>
          </div>
          <div style={{ background: p.paper, color: p.ink, padding: 36, borderRadius: 2, border: `1px solid color-mix(in oklab, ${p.paper} 30%, transparent)` }}>
            {sent ? (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <div style={{ fontFamily: `'${displayFont}', serif`, fontSize: 36, color: p.primary, lineHeight: 1.05, marginBottom: 16 }}>Gracias, nos pondremos en contacto.</div>
                <p style={{ fontSize: 15, color: p.inkSoft, lineHeight: 1.6, maxWidth: '32ch', margin: '0 auto' }}>Su consulta ha sido enviada. Típicamente respondemos dentro de un día hábil.</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, fontWeight: 600, marginBottom: 8 }}>Paso 1 de 1 · ~60 segundos</div>
                <h3 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 32, fontWeight: 400, letterSpacing: '-0.01em', margin: 0, color: p.ink, lineHeight: 1.05 }}>Cuéntenos sobre su propiedad.</h3>
                {error && <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: 13, borderRadius: 4, marginTop: 16 }}>{error}</div>}
                <div className="ys-sell-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 24 }}>
                  <div><label style={labelStyle}>Su nombre</label><input required style={fieldStyle} value={form.name} onChange={e => update('name', e.target.value)} /></div>
                  <div><label style={labelStyle}>Teléfono</label><input required type="tel" style={fieldStyle} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="(832) 210-3968" /></div>
                </div>
                <div style={{ marginTop: 14 }}><label style={labelStyle}>Correo</label><input required type="email" style={fieldStyle} value={form.email} onChange={e => update('email', e.target.value)} /></div>
                <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${p.line}` }}>
                  <label style={labelStyle}>Dirección de la propiedad</label><input required style={fieldStyle} value={form.addr} onChange={e => update('addr', e.target.value)} placeholder="Calle, ciudad, ZIP" />
                </div>
                <div className="ys-sell-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
                  <div><label style={labelStyle}>Tipo de propiedad</label><select style={fieldStyle} value={form.type} onChange={e => update('type', e.target.value)}>{['Unifamiliar','Dúplex','Tríplex / Cuádruplex','Multifamiliar pequeña (5+)','Townhome / Condo','Terreno','Otro'].map(t => <option key={t}>{t}</option>)}</select></div>
                  <div><label style={labelStyle}>Timeline</label><select style={fieldStyle} value={form.timeline} onChange={e => update('timeline', e.target.value)}>{['Solo explorando','En 30 días','1–3 meses','3–6 meses','6+ meses'].map(t => <option key={t}>{t}</option>)}</select></div>
                </div>
                <div className="ys-sell-form-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginTop: 14 }}>
                  <div><label style={labelStyle}>Recámaras</label><input style={fieldStyle} value={form.beds} onChange={e => update('beds', e.target.value)} placeholder="3" /></div>
                  <div><label style={labelStyle}>Baños</label><input style={fieldStyle} value={form.baths} onChange={e => update('baths', e.target.value)} placeholder="2" /></div>
                  <div><label style={labelStyle}>Pies cuadrados</label><input style={fieldStyle} value={form.sqft} onChange={e => update('sqft', e.target.value)} placeholder="1,500" /></div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={labelStyle}>¿Algo más? <span style={{ textTransform: 'none', letterSpacing: 0, color: p.inkSoft }}>(Opcional)</span></label>
                  <textarea rows={3} style={{ ...fieldStyle, resize: 'vertical', minHeight: 80 }} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Condición, ocupación, por qué vende…" />
                </div>
                <button type="submit" disabled={submitting} style={{ marginTop: 28, width: '100%', padding: '16px 24px', background: p.primary, color: p.paper, border: 'none', fontSize: 15, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', letterSpacing: '0.01em', borderRadius: 3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? 'Enviando…' : 'Enviar información de mi propiedad'}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
                <p style={{ fontSize: 12, color: p.inkSoft, marginTop: 14, lineHeight: 1.5, textAlign: 'center' }}>Revisaremos y nos comunicaremos dentro de un día hábil. Sin spam, sin presión de listado.</p>
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
  const [modalProp, setModalProp] = useState<(typeof COMMUNITIES)[0] | null>(null);
  const getBookingIdForCommunity = (prop: (typeof COMMUNITIES)[0] | null) => {
    if (!prop) return 'any';
    const key = `${prop.name}|${prop.addr}`;
    switch (key) {
      case 'Kings Haven Apartments|410 S 2nd St':
        return 'kings-haven';
      case 'Kings Manor Townhomes|328 S 2nd St':
        return 'kings-manor';
      case 'Kings Haven Apartments|100 S 2nd St':
        return 'kings-haven-100';
      case 'French Quarter Residency|2550 S Bypass 35':
        return 'french-quarter';
      case 'The White House Apartments|1606 W Sealy St':
        return 'white-house';
      case 'The Royal Oaks Townhomes|418 S Jackson St':
        return 'royal-oaks';
      default:
        return 'any';
    }
  };

  useEffect(() => {
    (window as any).__openBooking = (propId?: string) => { setBookingPropId(propId || ''); setBookingOpen(true); };
    return () => { delete (window as any).__openBooking; };
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.background = p.bg;
      document.body.style.color = p.ink;
      document.documentElement.lang = 'es';
      return () => {
        document.body.style.background = '';
        document.body.style.color = '';
      };
    }
  }, []);

  return (
    <div style={{ background: p.bg, color: p.ink, minHeight: '100vh' }}>
      <Nav p={p} locale="es" />
      <Hero />
      <div style={{ padding: '20px var(--pad-x)', background: p.ink, color: p.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', fontSize: 14 }}>
        <span style={{ opacity: 0.85 }}>¿Listo para mudarse? Aplique en línea en 5 minutos.</span>
        <a href="#aplicar" style={{ color: p.accent, fontWeight: 600, textDecoration: 'none' }}>Comenzar aplicación →</a>
      </div>
      <Availability />
      <Communities onOpenProperty={setModalProp} />
      <div id="mapa" />
      <AlvinMap p={p} displayFont={displayFont} />
      <Floorplans />
      <About />
      <Apply />
      <FAQ />
      <SellProperty />
      <Contact />
      <Footer p={p} displayFont={displayFont} locale="es" />
      <TourBooking open={bookingOpen} onClose={() => setBookingOpen(false)} p={p} displayFont={displayFont} initialPropertyId={bookingPropId} />
      <PropertyModal open={!!modalProp} onClose={() => setModalProp(null)} property={modalProp} onBookTour={() => { setBookingPropId(getBookingIdForCommunity(modalProp)); setBookingOpen(true); }} p={p} displayFont={displayFont} locale="es" />

      <div className="ys-fab-stack" aria-label="Acciones rápidas">
        <a className="ys-fab-guide" href="/vivir-en-alvin">
          <em>Vivir en Alvin</em>
          <span>→</span>
        </a>
        <div className="ys-fab-pill" role="group" aria-label="Idioma">
          <a href="/" hrefLang="en">EN</a>
          <span className="ys-fab-sep">·</span>
          <a href="/es" hrefLang="es" className="active">ES</a>
        </div>
        <a className="ys-fab-text" href="sms:+18322103968?body=Hola%20Yellowstone%2C%20estoy%20interesado%20en%20una%20unidad." aria-label="Envíenos un SMS">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          <span>Mensaje</span>
        </a>
      </div>
    </div>
  );
}
