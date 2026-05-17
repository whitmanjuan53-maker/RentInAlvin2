/* global React */
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS, useMemo: useMemoS } = React;

/* ============================================================
   Additional sections: Availability strip, Alvin map, FAQ
============================================================ */

const AVAILABILITY = [
  { property: "Kings Haven", addr: "410 S 2nd", type: "2 Bed · 1 Bath", sqft: 850, price: 925, ready: "Available now", featured: true },
  { property: "French Quarter", addr: "2550 S Bypass 35", type: "2 Bed · 1 Bath", sqft: 850, price: 950, ready: "Available now", featured: true },
  { property: "Royal Oaks", addr: "418 S Jackson", type: "2 Bed · 2 Bath", sqft: 1150, price: 1395, ready: "Available now", featured: false },
  { property: "White House", addr: "1606 W Sealy", type: "2 Bed · 1 Bath", sqft: 850, price: 925, ready: "Available now", featured: true },
  { property: "Kings Manor", addr: "328 S 2nd", type: "3 Bed · 2.5 Bath", sqft: 1250, price: 1595, ready: "Available now", featured: false },
  { property: "Kings Haven (100)", addr: "100 S 2nd", type: "1 Bed · 1 Bath", sqft: 600, price: 850, ready: "Available now", featured: false }
];

function Availability({ p, displayFont }) {
  const [filter, setFilter] = useStateS("all");
  const { availability, status } = (window.useAvailability || (() => ({ availability: AVAILABILITY, status: "fallback" })))();
  const filtered = availability.filter(a => {
    if (filter === "all") return true;
    if (filter === "now") return a.ready.includes("now");
    if (filter === "1br") return a.type.startsWith("1 Bed");
    if (filter === "2br") return a.type.startsWith("2 Bed");
    if (filter === "3br") return a.type.startsWith("3 Bed");
    return true;
  });
  const filters = [
    ["all", "All open units"],
    ["now", "Move-in now"],
    ["1br", "1 Bed"],
    ["2br", "2 Bed"],
    ["3br", "3 Bed"]
  ];
  return (
    <section id="availability" className="ys-reveal" style={{
      padding: "var(--pad-x-lg) var(--pad-x)",
      background: p.paper,
      borderTop: `1px solid ${p.line}`,
      borderBottom: `1px solid ${p.line}`
    }}
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          marginBottom: 36, gap: 32, flexWrap: "wrap"
        }}>
          <div>
            <div style={{
              fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase",
              color: p.accent, fontWeight: 600, marginBottom: 14,
              display: "flex", alignItems: "center", gap: 10
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%", background: "#22c55e",
                boxShadow: "0 0 0 0 rgba(34,197,94,0.5)",
                animation: "ys-pulse 2s infinite"
              }}></span>
              Open this week
              {status === "live" && (
                <span style={{ color: p.inkSoft, fontWeight: 500, letterSpacing: "0.1em" }}>
                  · Synced live
                </span>
              )}
            </div>
            <h2 style={{
              fontFamily: `'${displayFont}', serif`,
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 0.95, letterSpacing: "-0.02em",
              margin: 0, fontWeight: 400, color: p.ink, maxWidth: "16ch"
            }}>
              Available right now.
            </h2>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {filters.map(([k, label]) => (
              <button key={k} onClick={() => setFilter(k)} style={{
                padding: "8px 14px",
                background: filter === k ? p.ink : "transparent",
                color: filter === k ? p.paper : p.ink,
                border: `1px solid ${filter === k ? p.ink : p.line}`,
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                fontFamily: "inherit",
                borderRadius: 999,
                transition: "all 160ms ease"
              }}>{label}</button>
            ))}
          </div>
        </div>

        <div className="ys-avail-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 1,
          background: p.line,
          border: `1px solid ${p.line}`
        }}>
          {filtered.length === 0 && (
            <div style={{
              gridColumn: "1 / -1", padding: 60, textAlign: "center",
              background: p.paper, color: p.inkSoft, fontSize: 15
            }}>
              No units match, call us, we may have something coming up.
            </div>
          )}
          {filtered.map((u, i) => (
            <div key={i} style={{
              background: p.paper,
              padding: 24,
              display: "flex", flexDirection: "column", gap: 14,
              position: "relative"
            }}>
              {u.featured && (
                <div style={{
                  position: "absolute", top: 16, right: 16,
                  fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
                  color: p.accent, fontWeight: 600
                }}>★ Featured</div>
              )}
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: p.inkSoft, fontWeight: 500 }}>
                  {u.property}
                </div>
                <div style={{
                  fontFamily: `'${displayFont}', serif`,
                  fontSize: 26, lineHeight: 1.05, color: p.ink,
                  marginTop: 6, fontWeight: 400, letterSpacing: "-0.01em"
                }}>{u.type}</div>
                <div style={{ fontSize: 13, color: p.inkSoft, marginTop: 4 }}>
                  {u.addr} · {u.sqft} sq ft
                </div>
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "baseline",
                paddingTop: 14, borderTop: `1px solid ${p.line}`, marginTop: "auto"
              }}>
                <div>
                  <div style={{
                    fontFamily: `'${displayFont}', serif`,
                    fontSize: 28, color: p.primary, fontWeight: 400
                  }}>${u.price.toLocaleString()}<span style={{ fontSize: 13, color: p.inkSoft, fontFamily: "Inter, sans-serif" }}>/mo</span></div>
                  <div style={{ fontSize: 11, color: u.ready.includes("now") ? "#16a34a" : p.inkSoft, marginTop: 2, fontWeight: 500 }}>
                    {u.ready}
                  </div>
                </div>
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  const idMap = {
                    "Kings Haven": "kings-haven",
                    "Kings Manor": "kings-manor",
                    "Kings Haven (100)": "kings-haven-100",
                    "French Quarter": "french-quarter",
                    "Royal Oaks": "royal-oaks",
                    "White House": "white-house"
                  };
                  window.__openBooking && window.__openBooking(idMap[u.property] || "");
                }} style={{
                  fontSize: 12, fontWeight: 600, color: p.ink,
                  textDecoration: "none",
                  padding: "8px 14px",
                  border: `1px solid ${p.ink}`,
                  borderRadius: 999,
                  transition: "background 160ms ease, color 160ms ease, transform 160ms ease",
                  display: "inline-flex", alignItems: "center", gap: 4
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = p.ink; e.currentTarget.style.color = p.paper; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = p.ink; e.currentTarget.style.transform = "translateY(0)"; }}>Tour</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Alvin Map ----------------------------- */

const MAP_PROPS = [
  { id: 0, name: "Kings Haven", addr: "410 S 2nd St", x: 48, y: 50, office: true },
  { id: 1, name: "Kings Manor", addr: "328 S 2nd St", x: 51, y: 38 },
  { id: 2, name: "Kings Haven (100)", addr: "100 S 2nd St", x: 56, y: 18 },
  { id: 3, name: "French Quarter", addr: "2550 S Bypass 35", x: 82, y: 70 },
  { id: 4, name: "Royal Oaks", addr: "418 S Jackson St", x: 38, y: 56 },
  { id: 5, name: "White House", addr: "1606 W Sealy St", x: 22, y: 32 }
];

function AlvinMap({ p, displayFont }) {
  const [active, setActive] = useStateS(0);
  return (
    <section id="map" className="ys-reveal" style={{
      padding: "var(--pad-x-lg) var(--pad-x)",
      borderTop: `1px solid ${p.line}`,
      background: p.bg
    }}
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60,
          alignItems: "start", marginBottom: 48
        }} className="ys-section-head">
          <div style={{
            fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase",
            color: p.accent, fontWeight: 600, paddingTop: 14
          }}>
            All within Alvin city limits
          </div>
          <div>
            <h2 style={{
              fontFamily: `'${displayFont}', serif`,
              fontSize: "clamp(36px, 4.6vw, 60px)",
              lineHeight: 1.02, letterSpacing: "-0.02em",
              margin: 0, color: p.ink, fontWeight: 400, maxWidth: "16ch"
            }}>Six communities, one neighborhood.</h2>
            <p style={{
              fontSize: 17, lineHeight: 1.6, color: p.inkSoft,
              maxWidth: "55ch", marginTop: 24
            }}>The furthest property is a seven-minute drive from our office. Tap any pin for the address.</p>
          </div>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 32
        }} className="ys-map-grid">
          {/* List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {MAP_PROPS.map(m => (
              <button
                key={m.id}
                onMouseEnter={() => setActive(m.id)}
                onClick={() => setActive(m.id)}
                style={{
                  textAlign: "left", padding: "18px 16px",
                  background: active === m.id ? p.paper : "transparent",
                  border: "none",
                  borderTop: m.id === 0 ? `1px solid ${p.line}` : "none",
                  borderBottom: `1px solid ${p.line}`,
                  borderLeft: `2px solid ${active === m.id ? p.accent : "transparent"}`,
                  cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 14,
                  transition: "all 160ms ease"
                }}>
                <span style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: m.office ? p.accent : p.primary,
                  color: p.paper,
                  display: "grid", placeItems: "center",
                  fontSize: 12, fontWeight: 600, flexShrink: 0
                }}>{m.office ? "★" : m.id}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: `'${displayFont}', serif`, fontSize: 20,
                    color: p.ink, lineHeight: 1.1, fontWeight: 400
                  }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: p.inkSoft, marginTop: 2 }}>
                    {m.addr}{m.office ? " · Leasing office" : ""}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Map */}
          <div style={{
            position: "relative",
            aspectRatio: "4/3",
            background: `color-mix(in oklab, ${p.primary} 6%, ${p.paper})`,
            border: `1px solid ${p.line}`,
            overflow: "hidden"
          }}>
            <svg viewBox="0 0 100 75" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              {/* stylized roads */}
              <defs>
                <pattern id="grid" width="6" height="6" patternUnits="userSpaceOnUse">
                  <path d="M 6 0 L 0 0 0 6" fill="none" stroke={p.line} strokeWidth="0.2"/>
                </pattern>
              </defs>
              <rect width="100" height="75" fill="url(#grid)" />
              {/* main roads */}
              <path d="M 50 0 L 52 75" stroke={`color-mix(in oklab, ${p.ink} 18%, transparent)`} strokeWidth="0.8" fill="none" />
              <path d="M 0 35 L 100 38" stroke={`color-mix(in oklab, ${p.ink} 18%, transparent)`} strokeWidth="0.8" fill="none" />
              <path d="M 60 75 L 95 50" stroke={`color-mix(in oklab, ${p.ink} 22%, transparent)`} strokeWidth="1.1" fill="none" />
              <path d="M 38 0 L 40 75" stroke={`color-mix(in oklab, ${p.ink} 12%, transparent)`} strokeWidth="0.5" fill="none" />
              <path d="M 22 0 L 24 75" stroke={`color-mix(in oklab, ${p.ink} 12%, transparent)`} strokeWidth="0.5" fill="none" />
              <path d="M 0 18 L 100 20" stroke={`color-mix(in oklab, ${p.ink} 12%, transparent)`} strokeWidth="0.5" fill="none" />
              <path d="M 0 56 L 100 58" stroke={`color-mix(in oklab, ${p.ink} 12%, transparent)`} strokeWidth="0.5" fill="none" />
              {/* road labels */}
              <text x="53" y="8" fontSize="1.6" fill={p.inkSoft} style={{ fontFamily: "'JetBrains Mono', monospace" }}>S 2ND ST</text>
              <text x="2" y="34" fontSize="1.6" fill={p.inkSoft} style={{ fontFamily: "'JetBrains Mono', monospace" }}>HWY 6</text>
              <text x="78" y="60" fontSize="1.6" fill={p.inkSoft} style={{ fontFamily: "'JetBrains Mono', monospace" }}>BYPASS 35</text>
              <text x="2" y="58" fontSize="1.6" fill={p.inkSoft} style={{ fontFamily: "'JetBrains Mono', monospace" }}>W SEALY ST</text>
              <text x="2" y="20" fontSize="1.6" fill={p.inkSoft} style={{ fontFamily: "'JetBrains Mono', monospace" }}>S JACKSON ST</text>
              {/* compass */}
              <g transform="translate(92, 6)">
                <circle r="3" fill="none" stroke={p.line} strokeWidth="0.2"/>
                <text y="-3.5" fontSize="1.8" fill={p.inkSoft} textAnchor="middle" style={{ fontFamily: "'JetBrains Mono', monospace" }}>N</text>
                <path d="M 0 -2 L 0.7 1 L 0 0.5 L -0.7 1 Z" fill={p.ink}/>
              </g>
            </svg>

            {/* pins */}
            {MAP_PROPS.map(m => {
              const isActive = active === m.id;
              return (
                <button
                  key={m.id}
                  onMouseEnter={() => setActive(m.id)}
                  onClick={() => setActive(m.id)}
                  style={{
                    position: "absolute",
                    left: `${m.x}%`, top: `${m.y}%`,
                    transform: "translate(-50%, -100%)",
                    background: "transparent", border: "none", padding: 0,
                    cursor: "pointer",
                    zIndex: isActive ? 5 : 2
                  }}>
                  <div style={{
                    width: isActive ? 36 : 28, height: isActive ? 36 : 28,
                    borderRadius: "50% 50% 50% 0",
                    transform: "rotate(-45deg)",
                    background: m.office ? p.accent : p.primary,
                    border: `2px solid ${p.paper}`,
                    boxShadow: isActive
                      ? `0 8px 24px -4px color-mix(in oklab, ${p.ink} 50%, transparent)`
                      : `0 2px 6px color-mix(in oklab, ${p.ink} 25%, transparent)`,
                    display: "grid", placeItems: "center",
                    transition: "all 200ms ease"
                  }}>
                    <span style={{
                      transform: "rotate(45deg)",
                      color: p.paper, fontSize: isActive ? 14 : 11,
                      fontWeight: 700,
                      fontFamily: "Inter, sans-serif"
                    }}>{m.office ? "★" : m.id}</span>
                  </div>
                  {isActive && (
                    <div style={{
                      position: "absolute",
                      top: 6, left: "50%",
                      transform: "translateX(-50%)",
                      whiteSpace: "nowrap",
                      background: p.ink, color: p.paper,
                      padding: "8px 14px",
                      fontSize: 12, fontWeight: 500,
                      letterSpacing: "0.02em",
                      borderRadius: 6,
                      boxShadow: `0 4px 12px rgba(26,24,21,0.25)`,
                      zIndex: 10,
                      lineHeight: 1.3
                    }}>{m.name}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- FAQ ----------------------------- */

const FAQS = [
  {
    q: "What's required to apply?",
    a: "A government-issued ID, proof of income (typically 3× monthly rent), and a $40 application fee per adult. We run standard credit and rental-history checks. Most applications are decided within 48 hours."
  },
  {
    q: "Are pets allowed?",
    a: "Yes, most properties accept cats and dogs under 50 lbs with a $300 pet deposit (one-time) and $25/month pet rent. Breed restrictions apply at some buildings. Just ask when you tour."
  },
  {
    q: "What's included in rent?",
    a: "Water and trash are not included at all six properties. Electric and internet are billed by the resident directly. "
  },
  {
    q: "How do I submit a maintenance request?",
    a: "Call the office at (832) 210-3968 or email office@yellowstone-am.com. Emergency requests (water leaks, no AC in summer, no heat in winter) are handled within 24 hours; standard requests within 48 hours during business days. We also allow online portal access for requests and online payments."
  },
  {
    q: "Do you offer short-term or month-to-month leases?",
    a: "Standard leases are 12 months. We can offer 6-month leases at a slight premium and month-to-month for existing residents on lease renewal. Call to discuss what works."
  },
  {
    q: "Is parking included?",
    a: "Yes, every unit comes with at least one assigned spot. Townhomes (Kings Manor, Royal Oaks) include private driveways. Additional/guest parking is free and on a first-come basis. Reserved parking is available for an additional fee."
  }
];

function FAQ({ p, displayFont }) {
  const [open, setOpen] = useStateS(0);
  return (
    <section id="faq" className="ys-reveal" style={{
      padding: "var(--pad-x-lg) var(--pad-x)",
      borderTop: `1px solid ${p.line}`,
      background: p.bg
    }}
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60, alignItems: "start"
        }} className="ys-faq-grid">
          <div>
            <div style={{
              fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase",
              color: p.accent, fontWeight: 600, marginBottom: 18
            }}>Common questions</div>
            <h2 style={{
              fontFamily: `'${displayFont}', serif`,
              fontSize: "clamp(36px, 4.6vw, 60px)",
              lineHeight: 1.02, letterSpacing: "-0.02em",
              margin: 0, color: p.ink, fontWeight: 400, maxWidth: "12ch"
            }}>Things renters usually ask first.</h2>
            <p style={{
              fontSize: 15, lineHeight: 1.6, color: p.inkSoft,
              marginTop: 24, maxWidth: "40ch"
            }}>Don't see your question? Call <a href="tel:8322103968" style={{ color: p.primary, textDecoration: "none", fontWeight: 600 }}>(832) 210-3968</a>, a real person picks up.</p>
          </div>
          <div>
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={i} style={{
                  borderTop: i === 0 ? `1px solid ${p.line}` : "none",
                  borderBottom: `1px solid ${p.line}`
                }}>
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    style={{
                      width: "100%", textAlign: "left",
                      padding: "26px 0",
                      background: "transparent", border: "none",
                      cursor: "pointer", fontFamily: "inherit",
                      display: "flex", alignItems: "center", gap: 20,
                      color: p.ink,
                      transition: "background 160ms ease",
                      borderRadius: 2
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = `color-mix(in oklab, ${p.primary} 4%, transparent)`}
                    onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12, color: p.accent, fontWeight: 600,
                      flexShrink: 0, width: 30
                    }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{
                      flex: 1,
                      fontFamily: `'${displayFont}', serif`,
                      fontSize: "clamp(20px, 2.4vw, 28px)",
                      fontWeight: 400, letterSpacing: "-0.01em",
                      lineHeight: 1.2
                    }}>{f.q}</span>
                    <span style={{
                      width: 32, height: 32, borderRadius: "50%",
                      border: `1px solid ${p.line}`,
                      display: "grid", placeItems: "center",
                      flexShrink: 0,
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 220ms ease",
                      background: isOpen ? p.ink : "transparent",
                      color: isOpen ? p.paper : p.ink
                    }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </button>
                  <div style={{
                    maxHeight: isOpen ? 300 : 0,
                    overflow: "hidden",
                    transition: "max-height 320ms ease, padding 320ms ease",
                    paddingBottom: isOpen ? 26 : 0,
                    paddingLeft: 50
                  }}>
                    <p style={{
                      fontSize: 16, lineHeight: 1.65, color: p.inkSoft,
                      margin: 0, maxWidth: "60ch"
                    }}>{f.a}</p>
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

window.Availability = Availability;
window.AlvinMap = AlvinMap;
window.FAQ = FAQ;
