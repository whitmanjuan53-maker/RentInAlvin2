'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MAP_PROPS = [
  { id: 0, name: 'Kings Haven', addr: '410 S 2nd St, Alvin, TX 77511', lat: 29.4208044, lng: -95.2554917, office: true },
  { id: 1, name: 'Kings Manor', addr: '328 S 2nd St, Alvin, TX 77511', lat: 29.4213292, lng: -95.2556986, office: false },
  { id: 2, name: 'Kings Haven (100)', addr: '100 S 2nd St, Alvin, TX 77511', lat: 29.4233620, lng: -95.2557670, office: false },
  { id: 3, name: 'French Quarter', addr: '2550 S Bypass 35, Alvin, TX 77511', lat: 29.40315, lng: -95.23971, office: false },
  { id: 4, name: 'White House', addr: '1606 W Sealy St, Alvin, TX 77511', lat: 29.4234731, lng: -95.2600658, office: false },
  { id: 5, name: 'Royal Oaks', addr: '418 S Jackson St, Alvin, TX 77511', lat: 29.4208186, lng: -95.2497543, office: false, comingSoon: true },
];

function createPinIcon(color: string, label: string, isActive: boolean) {
  const size = isActive ? 36 : 28;
  return L.divIcon({
    className: 'custom-pin',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        background: ${color};
        border: 2px solid #FBF7F0;
        box-shadow: 0 2px 6px rgba(26,24,21,0.25);
        display: grid;
        place-items: center;
      ">
        <span style="
          transform: rotate(45deg);
          color: #FBF7F0;
          font-size: ${isActive ? 14 : 11}px;
          font-weight: 700;
          font-family: Inter, sans-serif;
        ">${label}</span>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

function BoundsFitter() {
  const map = useMap();
  useEffect(() => {
    if (MAP_PROPS.length > 0) {
      const bounds = L.latLngBounds(MAP_PROPS.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default function AlvinMap({
  p,
  displayFont,
}: {
  p: typeof import('@/lib/data').PALETTES.forest;
  displayFont: string;
}) {
  const [active, setActive] = useState(0);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Defer mount to the next tick so React Strict Mode's
    // double-invoke (mount → unmount → remount) finishes
    // before Leaflet tries to initialize the map container.
    const timer = setTimeout(() => setMapReady(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="map"
      style={{
        padding: 'var(--pad-x-lg) var(--pad-x)',
        borderTop: `1px solid ${p.line}`,
        background: p.bg,
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div
          className="ys-section-head"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: 60,
            alignItems: 'start',
            marginBottom: 48,
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: p.accent,
              fontWeight: 600,
              paddingTop: 14,
            }}
          >
            All within Alvin city limits
          </div>
          <div>
            <h2
              style={{
                fontFamily: `'${displayFont}', serif`,
                fontSize: 'clamp(36px, 4.6vw, 60px)',
                lineHeight: 1.02,
                letterSpacing: '-0.02em',
                margin: 0,
                color: p.ink,
                fontWeight: 400,
                maxWidth: '16ch',
              }}
            >
              Six communities, one neighborhood.
            </h2>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.6,
                color: p.inkSoft,
                maxWidth: '55ch',
                marginTop: 24,
              }}
            >
              The furthest community is a seven-minute drive from our office. Tap any pin for the address and
              directions.
            </p>
          </div>
        </div>

        <div
          className="ys-map-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: 32,
          }}
        >
          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {MAP_PROPS.map((m) => (
              <button
                key={m.id}
                onMouseEnter={() => setActive(m.id)}
                onClick={() => setActive(m.id)}
                style={{
                  textAlign: 'left',
                  padding: '18px 16px',
                  background: active === m.id ? p.paper : 'transparent',
                  border: 'none',
                  borderTop: m.id === 0 ? `1px solid ${p.line}` : 'none',
                  borderBottom: `1px solid ${p.line}`,
                  borderLeft: `2px solid ${active === m.id ? p.accent : 'transparent'}`,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  transition: 'all 160ms ease',
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: m.office ? p.accent : m.comingSoon ? p.inkSoft : p.primary,
                    color: p.paper,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {m.office ? '★' : m.id}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: `'${displayFont}', serif`,
                      fontSize: 20,
                      color: p.ink,
                      lineHeight: 1.1,
                      fontWeight: 400,
                    }}
                  >
                    {m.name}
                  </div>
                  <div style={{ fontSize: 12, color: p.inkSoft, marginTop: 2 }}>
                    {m.addr}
                    {m.office ? ' · Leasing office' : ''}
                    {m.comingSoon ? ' · Coming soon' : ''}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Map */}
          <div
            style={{
              position: 'relative',
              aspectRatio: '4/3',
              background: `color-mix(in oklab, ${p.primary} 6%, ${p.paper})`,
              border: `1px solid ${p.line}`,
              overflow: 'hidden',
              minHeight: 300,
            }}
          >
            {mapReady ? (
              <MapContainer
                center={[29.417, -95.252]}
                zoom={14}
                scrollWheelZoom={false}
                style={{ width: '100%', height: '100%' }}
              >
                <BoundsFitter />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {MAP_PROPS.map((m) => {
                  const isActive = active === m.id;
                  return (
                    <Marker
                      key={m.id}
                      position={[m.lat, m.lng]}
                      icon={createPinIcon(m.office ? p.accent : m.comingSoon ? p.inkSoft : p.primary, m.office ? '★' : String(m.id), isActive)}
                      eventHandlers={{
                        mouseover: () => setActive(m.id),
                        click: () => setActive(m.id),
                      }}
                    >
                      <Popup>
                        <div style={{ fontFamily: "'Inter', sans-serif", minWidth: 180 }}>
                          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{m.name}</div>
                          <div style={{ fontSize: 13, color: '#5C5750', marginBottom: 10 }}>{m.addr}</div>
                          {m.comingSoon && (
                            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: p.accent, fontWeight: 600, marginBottom: 10 }}>
                              Coming Soon
                            </div>
                          )}
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(m.addr)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: 13,
                              fontWeight: 600,
                              color: p.primary,
                              textDecoration: 'none',
                            }}
                          >
                            Get directions
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6h7m0 0L6.5 3m3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            ) : (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: p.inkSoft,
                  fontSize: 14,
                }}
              >
                Loading map…
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
