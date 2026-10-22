'use client';

import { useEffect, useState } from 'react';
import type { PropertyAnnouncement } from '@/lib/announcements';
import { isAnnouncementActive } from '@/lib/announcements';

export default function PropertyAnnouncements({ announcements }: { announcements: PropertyAnnouncement[] }) {
  const [active, setActive] = useState<PropertyAnnouncement[]>([]);

  useEffect(() => {
    const refresh = () => setActive(announcements.filter((announcement) => isAnnouncementActive(announcement)));
    refresh();
    const timer = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(timer);
  }, [announcements]);

  if (active.length === 0) return null;

  return (
    <section aria-label="Property announcements" style={{ display: 'grid', gap: 12, margin: '26px 0 8px' }}>
      {active.map((announcement) => {
        const openHouse = announcement.type === 'open-house';
        return (
          <article
            key={announcement.id}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              gap: 20,
              alignItems: 'center',
              padding: '22px clamp(18px, 3vw, 28px)',
              borderRadius: 14,
              color: openHouse ? '#FBF7F0' : '#1A1815',
              background: openHouse ? '#1F3A2E' : '#F2E3D6',
              border: `1px solid ${openHouse ? '#2A4A3C' : '#D7B899'}`,
            }}
          >
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.78, marginBottom: 7 }}>
                {openHouse ? 'Open house' : 'Limited-time leasing special'}
              </div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(25px, 4vw, 34px)', lineHeight: 1.05, fontWeight: 400, margin: 0 }}>
                {announcement.title}
              </h2>
              {(announcement.dateLabel || announcement.timeLabel) && (
                <p style={{ fontSize: 15, fontWeight: 700, margin: '10px 0 0' }}>
                  {[announcement.dateLabel, announcement.timeLabel].filter(Boolean).join(' · ')}
                </p>
              )}
              <p style={{ maxWidth: '62ch', fontSize: 14.5, lineHeight: 1.6, margin: '10px 0 0', opacity: 0.86 }}>
                {announcement.message}
              </p>
            </div>
            {announcement.ctaLabel && announcement.ctaHref && (
              <a
                href={announcement.ctaHref}
                style={{
                  justifySelf: 'start',
                  whiteSpace: 'nowrap',
                  padding: '11px 18px',
                  borderRadius: 999,
                  background: openHouse ? '#B5703D' : '#1F3A2E',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                {announcement.ctaLabel} →
              </a>
            )}
          </article>
        );
      })}
      <style jsx>{`
        @media (max-width: 680px) {
          article { grid-template-columns: 1fr !important; }
          article a { white-space: normal !important; }
        }
      `}</style>
    </section>
  );
}
