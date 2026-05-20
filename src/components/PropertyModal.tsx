'use client';

import { useState, useEffect, useCallback } from 'react';

interface PropertyModalProps {
  open: boolean;
  onClose: () => void;
  property: {
    name: string;
    addr: string;
    tag: string;
    units: string;
    price: string;
    note: string;
    gallery?: string[];
    comingSoon?: boolean;
  } | null;
  onBookTour: () => void;
  p: {
    bg: string;
    paper: string;
    ink: string;
    inkSoft: string;
    primary: string;
    primarySoft: string;
    accent: string;
    line: string;
  };
  displayFont: string;
  locale?: 'en' | 'es';
}

export default function PropertyModal({ open, onClose, property, onBookTour, p, displayFont, locale = 'en' }: PropertyModalProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const gallery = property?.gallery || [];

  const goNext = useCallback(() => {
    setActiveIdx((i) => (i + 1) % gallery.length);
  }, [gallery.length]);

  const goPrev = useCallback(() => {
    setActiveIdx((i) => (i - 1 + gallery.length) % gallery.length);
  }, [gallery.length]);

  useEffect(() => {
    if (!open) { setActiveIdx(0); return; }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, goNext, goPrev]);

  if (!open || !property) return null;

  const t = {
    close: locale === 'es' ? 'Cerrar' : 'Close',
    prev: locale === 'es' ? 'Foto anterior' : 'Previous photo',
    next: locale === 'es' ? 'Siguiente foto' : 'Next photo',
    noPhotos: locale === 'es' ? 'No hay fotos disponibles' : 'No photos available',
    viewPhoto: locale === 'es' ? 'Ver foto' : 'View photo',
    rent: locale === 'es' ? 'Renta mensual' : 'Monthly rent',
    tour: locale === 'es' ? 'Agendar recorrido' : 'Schedule a tour',
    inquire: locale === 'es' ? 'Consultar' : 'Inquire',
    soon: locale === 'es' ? 'Próximamente' : 'Coming Soon',
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 10001, background: 'rgba(26,24,21,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px, 4vw, 48px)' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: p.paper, width: '100%', maxWidth: 1100, maxHeight: '92vh', overflow: 'auto', borderRadius: 4, border: `1px solid ${p.line}`, boxShadow: '0 40px 80px -20px rgba(0,0,0,0.35)', position: 'relative' }}>

        {/* Close */}
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, width: 40, height: 40, borderRadius: '50%', background: p.paper, border: `1px solid ${p.line}`, color: p.ink, display: 'grid', placeItems: 'center', cursor: 'pointer', fontSize: 22, lineHeight: 1 }} aria-label={t.close}>
          ×
        </button>

        {/* Main image */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: p.bg, overflow: 'hidden' }}>
          {gallery.length > 0 ? (
            <>
              <img src={gallery[activeIdx]} alt={`${property.name} — ${activeIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              {gallery.length > 1 && (
                <>
                  <button onClick={goPrev} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer', color: p.ink }} aria-label={t.prev}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <button onClick={goNext} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer', color: p.ink }} aria-label={t.next}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                  <div style={{ position: 'absolute', bottom: 14, left: 14, background: 'rgba(26,24,21,0.6)', color: '#fff', padding: '5px 10px', borderRadius: 2, fontSize: 11, letterSpacing: '0.08em', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                    {activeIdx + 1} / {gallery.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: p.inkSoft, fontSize: 14 }}>{t.noPhotos}</div>
          )}
        </div>

        {/* Thumbnails */}
        {gallery.length > 1 && (
          <div style={{ display: 'flex', gap: 8, padding: '12px 16px', overflowX: 'auto', borderBottom: `1px solid ${p.line}`, background: p.bg }}>
            {gallery.map((src, i) => (
              <button key={i} onClick={() => setActiveIdx(i)} style={{ flexShrink: 0, width: 72, height: 54, border: i === activeIdx ? `2px solid ${p.primary}` : `1px solid ${p.line}`, padding: 0, background: 'none', cursor: 'pointer', opacity: i === activeIdx ? 1 : 0.6, borderRadius: 2, overflow: 'hidden' }} aria-label={`${t.viewPhoto} ${i + 1}`}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </button>
            ))}
          </div>
        )}

        {/* Property info — single column, no sidebar */}
        <div style={{ padding: '32px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
            <h2 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.05, margin: 0, color: p.ink, fontWeight: 400, letterSpacing: '-0.01em' }}>{property.name}</h2>
            <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.accent, fontWeight: 600 }}>{property.tag}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, flexWrap: 'wrap', marginBottom: 16 }}>
            <div style={{ fontSize: 15, color: p.inkSoft }}>{property.addr} · Alvin, TX</div>
            <div style={{ fontFamily: `'${displayFont}', serif`, fontSize: 24, color: p.primary, fontWeight: 400 }}>{property.price}</div>
          </div>

          <p style={{ fontSize: 15, lineHeight: 1.6, color: p.inkSoft, margin: 0, maxWidth: '60ch' }}>{property.note}</p>
          <div style={{ marginTop: 12, fontSize: 13, color: p.inkSoft, fontFamily: "'JetBrains Mono', ui-monospace, monospace", letterSpacing: '0.04em' }}>{property.units}</div>

          {/* Actions */}
          <div style={{ marginTop: 28, paddingTop: 24, borderTop: `1px solid ${p.line}`, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {!property.comingSoon && (
              <>
                <button onClick={() => { onBookTour(); onClose(); }} style={{ padding: '14px 28px', background: p.primary, color: p.paper, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', borderRadius: 3, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'background 180ms ease' }} onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = p.primarySoft; }} onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = p.primary; }}>
                  {t.tour}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
                <a href={locale === 'es' ? '#contacto' : '#contact'} onClick={onClose} style={{ padding: '14px 28px', background: 'transparent', color: p.ink, border: `1px solid ${p.ink}`, fontSize: 14, fontWeight: 600, textDecoration: 'none', borderRadius: 3, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {t.inquire}
                </a>
              </>
            )}
            {property.comingSoon && (
              <span style={{ fontSize: 14, fontWeight: 600, color: p.accent, padding: '14px 0' }}>{t.soon}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
