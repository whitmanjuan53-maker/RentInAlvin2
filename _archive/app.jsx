/* global React, ReactDOM */
const { useState, useEffect, useRef } = React;

/* ============================================================
   YELLOWSTONE MANAGEMENT, Landing Page
   Aesthetic: editorial, warm, residential. Instrument Serif +
   Inter. Cream / forest green / clay accents.
============================================================ */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "forest",
  "displayFont": "Instrument Serif",
  "showStats": true,
  "heroVariant": "split"
} /*EDITMODE-END*/;

const PALETTES = {
  forest: {
    bg: "#F4EEE4",
    paper: "#FBF7F0",
    ink: "#1A1815",
    inkSoft: "#5C5750",
    primary: "#1F3A2E",
    primarySoft: "#2A4A3C",
    accent: "#B5703D",
    line: "rgba(26,24,21,0.12)"
  },
  midnight: {
    bg: "#EFEDE7",
    paper: "#FAF8F3",
    ink: "#15161B",
    inkSoft: "#55575F",
    primary: "#1B2238",
    primarySoft: "#2A3252",
    accent: "#A8612E",
    line: "rgba(21,22,27,0.12)"
  },
  clay: {
    bg: "#F1E9DD",
    paper: "#FBF6EC",
    ink: "#231812",
    inkSoft: "#665850",
    primary: "#5A2A1E",
    primarySoft: "#7A3A2A",
    accent: "#3F5A3D",
    line: "rgba(35,24,18,0.12)"
  }
};

const PROPERTIES = [
{
  name: "Kings Haven Apartments",
  addr: "410 S 2nd St",
  tag: "Flagship · Office on-site",
  units: "2BR · 1BA · 850 sq ft",
  price: "from $890",
  note: "Headquarters of Yellowstone Management. Walkable to downtown Alvin.",
  img: "apartment exterior · brick + landscaping"
},
{
  name: "Kings Manor Townhomes",
  addr: "328 S 2nd St",
  tag: "Townhome",
  units: "2BR · 2.5BA  ·  3BR · 2.5BA · 1,250 sq ft",
  price: "from $1,250",
  note: "Two-story townhomes with private entries and 2.5 baths.",
  img: "townhome row · two story"
},
{
  name: "Kings Haven Apartments",
  addr: "100 S 2nd St",
  tag: "Apartments",
  units: "2BR · 1BA · 850 sq ft",
  price: "from $850",
  note: "Quiet block near 100 S 2nd; renovated interiors.",
  img: "garden apartments · oak shade"
},
{
  name: "French Quarter Residency",
  addr: "2550 S Bypass 35",
  tag: "Apartments",
  units: "2BR · 1BA · 850 sq ft",
  price: "from $950",
  note: "Larger community along the bypass with ample parking.",
  img: "courtyard apartments · wrought iron"
},
{
  name: "The Royal Oaks Townhomes",
  addr: "418 S Jackson St",
  tag: "Townhome",
  units: "2BR · 2BA · 1,150 sq ft",
  price: "from $1,350",
  note: "Spacious townhomes under mature oak canopy.",
  img: "townhomes · oak canopy"
},
{
  name: "The White House Apartments",
  addr: "1606 W Sealy St",
  tag: "Apartments",
  units: "2BR · 1BA · 850 sq ft",
  price: "from $900",
  note: "Classic white-clad apartments on a quiet residential street.",
  img: "white clapboard apartments"
}];


const FLOORPLANS = [
{ type: "1 Bed · 1 Bath", sqft: "600 sq ft", price: "$850 – $999", available: 2 },
{ type: "2 Bed · 1 Bath", sqft: "850 sq ft", price: "$900 – $975", available: 4 },
{ type: "2 Bed · 2 Bath", sqft: "1,150 sq ft", price: "$1,250 – $1,395", available: 3 },
{ type: "2 Bed · 2.5 Bath", sqft: "1,250 sq ft (townhome)", price: "$1,295 – $1,450", available: 2 },
{ type: "3 Bed · 2.5 Bath", sqft: "1,250 sq ft (townhome)", price: "$1,495 – $1,650", available: 1 }];


/* ----------------------------- placeholder image ----------------------------- */

function Placeholder({ label, accent, ink, paper }) {
  // subtle striped placeholder w/ monospace label, never invent imagery
  const stripeA = paper;
  const stripeB = `color-mix(in oklab, ${ink} 6%, ${paper})`;
  return (
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: `repeating-linear-gradient(135deg, ${stripeA} 0 14px, ${stripeB} 14px 28px)`,
      display: "flex", alignItems: "flex-end", padding: 14,
      color: ink, opacity: 0.95
    }}>
      <span style={{
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
        background: paper, padding: "4px 8px",
        border: `1px solid color-mix(in oklab, ${ink} 15%, transparent)`,
        borderRadius: 2
      }}>
        {label}
      </span>
    </div>);

}

/* ----------------------------- nav ----------------------------- */

function Nav({ p }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
  ["Available", "#availability"],
  ["Properties", "#properties"],
  ["Map", "#map"],
  ["Plans", "#floorplans"],
  ["Apply", "#apply"],
  ["Sell", "#sell"],
  ["FAQ", "#faq"],
  ["Contact", "#contact"]];


  return (
    <header className="ys-nav" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      padding: scrolled ? "14px var(--pad-x)" : "24px var(--pad-x)",
      transition: "all 220ms ease",
      background: scrolled ? `color-mix(in oklab, ${p.bg} 88%, transparent)` : "transparent",
      backdropFilter: scrolled ? "blur(10px)" : "none",
      borderBottom: scrolled ? `1px solid ${p.line}` : "1px solid transparent",
      display: "flex", alignItems: "center", justifyContent: "space-between"
    }}>
      <a href="#top" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: p.ink }}>
        <YsLogo p={p} />
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, letterSpacing: "-0.01em" }}>
            Yellowstone
          </span>
          <span style={{ fontSize: 9.5, letterSpacing: "0.22em", textTransform: "uppercase", color: p.inkSoft, fontWeight: 500 }}>
            Asset Management
          </span>
        </div>
      </a>
      <nav className="ys-nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {links.map(([label, href]) =>
        <a key={href} href={href} style={{
          color: p.ink, textDecoration: "none", fontSize: 14, fontWeight: 500,
          letterSpacing: "0.01em",
          transition: "color 180ms ease",
          padding: "4px 0", borderRadius: 2
        }}
        onMouseOver={(e) => e.currentTarget.style.color = p.accent}
        onMouseOut={(e) => e.currentTarget.style.color = p.ink}>
          {label}</a>
        )}
        <a href="tel:8322103968" style={{
          color: p.primary, textDecoration: "none", fontSize: 14, fontWeight: 600,
          padding: "8px 16px", border: `1px solid ${p.primary}`, borderRadius: 999,
          transition: "all 180ms ease"
        }}
        onMouseOver={(e) => {e.currentTarget.style.background = p.primary;e.currentTarget.style.color = p.paper;}}
        onMouseOut={(e) => {e.currentTarget.style.background = "transparent";e.currentTarget.style.color = p.primary;}}>
          (832) 210-3968</a>
      </nav>
      <button className="ys-nav-burger" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu" style={{
        display: "none",
        background: "transparent", border: `1px solid ${p.line}`, borderRadius: 4,
        width: 40, height: 40, padding: 0, cursor: "pointer",
        alignItems: "center", justifyContent: "center"
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          {menuOpen ?
          <path d="M4 4l10 10M14 4L4 14" stroke={p.ink} strokeWidth="1.6" strokeLinecap="round" /> :
          <><path d="M2 5h14M2 9h14M2 13h14" stroke={p.ink} strokeWidth="1.6" strokeLinecap="round" /></>}
        </svg>
      </button>
      {menuOpen &&
      <div className="ys-nav-mobile" style={{
        position: "absolute", top: "100%", left: 0, right: 0,
        background: p.paper, borderBottom: `1px solid ${p.line}`,
        padding: "16px var(--pad-x) 24px",
        display: "flex", flexDirection: "column", gap: 4
      }}>
          {links.map(([label, href]) =>
        <a key={href} href={href} onClick={() => setMenuOpen(false)} style={{
          color: p.ink, textDecoration: "none",
          fontFamily: "'Instrument Serif', serif", fontSize: 24,
          padding: "10px 0", borderBottom: `1px solid ${p.line}`,
          transition: "color 160ms ease, padding-left 180ms ease",
          borderRadius: 2
        }}
        onMouseOver={(e) => { e.currentTarget.style.color = p.accent; e.currentTarget.style.paddingLeft = "8px"; }}
        onMouseOut={(e) => { e.currentTarget.style.color = p.ink; e.currentTarget.style.paddingLeft = "0px"; }}>{label}</a>
        )}
          <a href="tel:8322103968" style={{
          marginTop: 12, padding: "14px 20px",
          background: p.primary, color: p.paper,
          textDecoration: "none", fontSize: 15, fontWeight: 600,
          textAlign: "center", borderRadius: 4,
          transition: "background 180ms ease, transform 180ms ease",
          display: "block"
        }}
        onMouseOver={(e) => { e.currentTarget.style.background = p.primarySoft; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseOut={(e) => { e.currentTarget.style.background = p.primary; e.currentTarget.style.transform = "translateY(0)"; }}>Call (832) 210-3968</a>
        </div>
      }
    </header>);

}

function YsLogo({ p }) {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: 4,
      background: p.primary, color: p.paper,
      display: "grid", placeItems: "center",
      fontFamily: "'Instrument Serif', serif",
      fontSize: 22, fontStyle: "italic", lineHeight: 1
    }}>
      Y
    </div>);

}

/* ----------------------------- hero ----------------------------- */

function Hero({ p, displayFont, showStats }) {
  return (
    <section id="top" style={{
      position: "relative",
      padding: "180px var(--pad-x) 80px",
      minHeight: "100vh",
      display: "flex", flexDirection: "column", justifyContent: "space-between"
    }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", width: "100%" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase",
          color: p.inkSoft, marginBottom: 32, fontWeight: 500
        }}>
          <span style={{ width: 32, height: 1, background: p.inkSoft }}></span>
          Established in Alvin, Texas
        </div>

        <h1 style={{
          fontFamily: `'${displayFont}', serif`,
          fontSize: "clamp(56px, 8vw, 132px)",
          lineHeight: 0.95,
          letterSpacing: "-0.02em",
          margin: 0,
          color: p.ink,
          fontWeight: 400,
          maxWidth: "13ch"
        }}>
          A home in <em style={{ color: p.primary }}>Alvin,</em><br />
          made simple.
          <span style={{
            display: "inline-block",
            marginLeft: 18,
            verticalAlign: "middle",
            fontSize: "0.55em",
            letterSpacing: 0,
            transform: "translateY(-0.15em)",
            whiteSpace: "nowrap"
          }} aria-label="home and love">
            <span style={{
              display: "inline-block",
              animation: "ys-float 3.4s ease-in-out infinite"
            }}></span>
            <span style={{
              display: "inline-block",
              marginLeft: 6,
              color: "#E63946",
              animation: "ys-beat 1.8s ease-in-out infinite"
            }}>♥︎</span>
          </span>
        </h1>

        <div className="ys-hero-row" style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 80,
          marginTop: 72,
          alignItems: "end"
        }}>
          <p style={{
            fontSize: 19, lineHeight: 1.55, color: p.inkSoft,
            maxWidth: "44ch", margin: 0
          }}>
            Yellowstone Management cares for over <strong style={{ color: p.ink }}>160 units across six properties</strong> in the city of Alvin, apartments and townhomes priced from $800 to $1,650, leased and maintained by a local team that picks up the phone.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); window.__openBooking && window.__openBooking(); }} style={{
              padding: "16px 28px", background: p.primary, color: p.paper,
              textDecoration: "none", fontSize: 15, fontWeight: 600,
              borderRadius: 4, letterSpacing: "0.01em",
              display: "inline-flex", alignItems: "center", gap: 10,
              transition: "transform 180ms ease, background 180ms ease",
              cursor: "pointer"
            }}
            onMouseOver={(e) => {e.currentTarget.style.background = p.primarySoft;e.currentTarget.style.transform = "translateY(-1px)";}}
            onMouseOut={(e) => {e.currentTarget.style.background = p.primary;e.currentTarget.style.transform = "translateY(0)";}}>
              
              Book a tour
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </a>
            <a href="#properties" style={{
              padding: "16px 28px", background: "transparent", color: p.ink,
              textDecoration: "none", fontSize: 15, fontWeight: 600,
              borderRadius: 4, border: `1px solid ${p.ink}`,
              transition: "background 180ms ease, color 180ms ease, transform 180ms ease"
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = p.ink; e.currentTarget.style.color = p.paper; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = p.ink; e.currentTarget.style.transform = "translateY(0)"; }}>
              See properties
            </a>
          </div>
        </div>
      </div>

      {showStats &&
      <div style={{
        maxWidth: 1400, margin: "0 auto", width: "100%",
        marginTop: 80,
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        borderTop: `1px solid ${p.line}`,
        paddingTop: 28
      }} className="ys-hero-stats">
          {[
        ["150+", "units under management"],
        ["6", "properties in Alvin"],
        ["$899", "starting rent"],
        ["Local", "team, family-run"]].
        map(([n, label], i) =>
        <div key={i} style={{
          borderLeft: i === 0 ? "none" : `1px solid ${p.line}`,
          paddingLeft: i === 0 ? 0 : 28
        }}>
              <div style={{
            fontFamily: `'${displayFont}', serif`,
            fontSize: 56, lineHeight: 1, color: p.ink,
            letterSpacing: "-0.02em"
          }}>{n}</div>
              <div style={{
            fontSize: 12, letterSpacing: "0.12em",
            textTransform: "uppercase", color: p.inkSoft,
            marginTop: 10, fontWeight: 500
          }}>{label}</div>
            </div>
        )}
        </div>
      }
    </section>);

}

/* ----------------------------- section header ----------------------------- */

function SectionHead({ p, eyebrow, title, lead, displayFont }) {
  return (
    <div className="ys-section-head" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60, alignItems: "start", marginBottom: 56 }}>
      <div style={{
        fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase",
        color: p.accent, fontWeight: 600, paddingTop: 14
      }}>
        {eyebrow}
      </div>
      <div>
        <h2 style={{
          fontFamily: `'${displayFont}', serif`,
          fontSize: "clamp(36px, 4.6vw, 60px)",
          lineHeight: 1.02, letterSpacing: "-0.02em",
          margin: 0, color: p.ink, fontWeight: 400,
          maxWidth: "16ch"
        }}>{title}</h2>
        {lead &&
        <p style={{
          fontSize: 17, lineHeight: 1.6, color: p.inkSoft,
          maxWidth: "55ch", marginTop: 24
        }}>{lead}</p>
        }
      </div>
    </div>);

}

/* ----------------------------- properties ----------------------------- */

function PropertyCard({ prop, p, idx }) {
  const [hover, setHover] = useState(false);
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: p.paper,
        border: `1px solid ${p.line}`,
        borderRadius: 6,
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        transition: "transform 240ms ease, box-shadow 240ms ease",
        transform: hover ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hover ? `0 20px 40px -20px color-mix(in oklab, ${p.ink} 28%, transparent)` : "0 1px 2px rgba(26,24,21,0.04)"
      }}
      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: p.bg }}>
        <Placeholder label={prop.img} accent={p.accent} ink={p.ink} paper={p.paper} />
        <div style={{
          position: "absolute", top: 14, left: 14,
          background: p.paper, padding: "5px 10px",
          fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
          color: p.primary, fontWeight: 600,
          border: `1px solid ${p.line}`
        }}>
          {String(idx + 1).padStart(2, "0")} · {prop.tag}
        </div>
      </div>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        <div>
          <h3 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 28, lineHeight: 1.05, letterSpacing: "-0.01em",
            margin: 0, color: p.ink, fontWeight: 400
          }}>{prop.name}</h3>
          <div style={{ fontSize: 14, color: p.inkSoft, marginTop: 4 }}>{prop.addr} · Alvin, TX</div>
        </div>
        <p style={{ fontSize: 14, color: p.inkSoft, lineHeight: 1.55, margin: 0, flex: 1 }}>
          {prop.note}
        </p>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          paddingTop: 14, borderTop: `1px solid ${p.line}`
        }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: p.inkSoft, fontWeight: 500 }}>
              {prop.units}
            </div>
            <div style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 22, color: p.primary, marginTop: 2
            }}>
              {prop.price}
            </div>
          </div>
          <a href="#contact" style={{
            fontSize: 13, fontWeight: 600, color: p.ink, textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 10px", borderRadius: 4,
            transition: "background 160ms ease, color 160ms ease"
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = p.bg; e.currentTarget.style.color = p.primary; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = p.ink; }}>
            Inquire
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7m0 0L6.5 3m3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          </a>
        </div>
      </div>
    </article>);

}

function Properties({ p, displayFont }) {
  return (
    <section id="properties" className="ys-reveal" style={{ padding: "var(--pad-x-lg) var(--pad-x)", borderTop: `1px solid ${p.line}` }}
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <SectionHead
          p={p}
          displayFont={displayFont}
          eyebrow="Six properties · One zip code"
          title="Every address we manage, all within Alvin."
          lead="From the flagship Kings Haven on South 2nd Street to the townhomes on Jackson, six communities, one local team. Hover any property to see what's open." />
        
        <div className="ys-prop-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24
        }}>
          {PROPERTIES.map((prop, i) =>
          <PropertyCard key={i} prop={prop} p={p} idx={i} />
          )}
        </div>
      </div>
    </section>);

}

/* ----------------------------- floorplans / pricing ----------------------------- */

function Floorplans({ p, displayFont }) {
  const [active, setActive] = useState(0);
  return (
    <section id="floorplans" className="ys-reveal" style={{
      padding: "var(--pad-x-lg) var(--pad-x)",
      background: p.primary,
      color: p.paper
    }}
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="ys-section-head" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60, alignItems: "start", marginBottom: 56 }}>
          <div style={{
            fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase",
            color: p.accent, fontWeight: 600, paddingTop: 14
          }}>
            Floor plans · $800 to $1,650
          </div>
          <div>
            <h2 style={{
              fontFamily: `'${displayFont}', serif`,
              fontSize: "clamp(36px, 4.6vw, 60px)",
              lineHeight: 1.02, letterSpacing: "-0.02em",
              margin: 0, fontWeight: 400, maxWidth: "16ch",
              color: p.paper
            }}>
              Five layouts, honestly priced.
            </h2>
            <p style={{
              fontSize: 17, lineHeight: 1.6,
              color: `color-mix(in oklab, ${p.paper} 75%, transparent)`,
              maxWidth: "55ch", marginTop: 24
            }}>
              Rents are listed up-front with no surprise fees. Availability changes weekly, call us to confirm what's open today.
            </p>
          </div>
        </div>

        <div className="ys-floor-grid" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start"
        }}>
          <div style={{ borderTop: `1px solid color-mix(in oklab, ${p.paper} 20%, transparent)` }}>
            {FLOORPLANS.map((f, i) =>
            <button
              key={i}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              style={{
                width: "100%", textAlign: "left",
                padding: "24px 0",
                borderBottom: `1px solid color-mix(in oklab, ${p.paper} 20%, transparent)`,
                background: "transparent", border: "none",
                borderTop: "none",
                cursor: "pointer",
                display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24,
                alignItems: "center",
                color: p.paper,
                opacity: active === i ? 1 : 0.55,
                transition: "opacity 180ms ease",
                fontFamily: "inherit"
              }}>
              
                <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12, color: p.accent
              }}>0{i + 1}</span>
                <span style={{
                fontFamily: `'${displayFont}', serif`,
                fontSize: 32, fontWeight: 400, letterSpacing: "-0.01em"
              }}>
                  {f.type}
                </span>
                <span style={{
                fontSize: 14, fontWeight: 500
              }}>
                  {f.price}
                </span>
              </button>
            )}
          </div>

          <div style={{
            background: `color-mix(in oklab, ${p.paper} 8%, transparent)`,
            border: `1px solid color-mix(in oklab, ${p.paper} 20%, transparent)`,
            padding: 40,
            position: "sticky", top: 100
          }}>
            <div style={{
              fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
              color: p.accent, fontWeight: 600
            }}>
              Layout 0{active + 1}
            </div>
            <h3 style={{
              fontFamily: `'${displayFont}', serif`,
              fontSize: 56, fontWeight: 400, letterSpacing: "-0.02em",
              lineHeight: 1, margin: "16px 0 0"
            }}>
              {FLOORPLANS[active].type}
            </h3>
            <div style={{
              marginTop: 32,
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24
            }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.6, marginBottom: 6 }}>Square feet</div>
                <div style={{ fontSize: 18 }}>{FLOORPLANS[active].sqft}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.6, marginBottom: 6 }}>Monthly rent</div>
                <div style={{ fontSize: 18 }}>{FLOORPLANS[active].price}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.6, marginBottom: 6 }}>Available now</div>
                <div style={{ fontSize: 18 }}>{FLOORPLANS[active].available} units</div>
              </div>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.6, marginBottom: 6 }}>Deposit</div>
                <div style={{ fontSize: 18 }}>One month's rent</div>
              </div>
            </div>
            <a href="#" onClick={(e) => { e.preventDefault(); window.__openBooking && window.__openBooking(); }} style={{
              marginTop: 32,
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "14px 24px",
              background: p.accent, color: p.paper,
              textDecoration: "none", fontWeight: 600, fontSize: 14,
              cursor: "pointer", borderRadius: 4,
              transition: "background 180ms ease, transform 180ms ease"
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = p.primarySoft; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = p.accent; e.currentTarget.style.transform = "translateY(0)"; }}
              Schedule a viewing
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </a>
          </div>
        </div>
      </div>
    </section>);

}

/* ----------------------------- about ----------------------------- */

function About({ p, displayFont }) {
  const items = [
  {
    n: "01",
    title: "Local & responsive",
    body: "Our office sits at 410 S 2nd St, the same building as Kings Haven. When you call, you reach the team that manages your home, not a national call center."
  },
  {
    n: "02",
    title: "Honest leasing",
    body: "Rents are published on this page. No application bait-and-switch, no surprise admin fees. What you see is what you sign."
  },
  {
    n: "03",
    title: "Maintenance, handled",
    body: "Submit a request and a technician we know personally is dispatched. Most non-emergency issues are closed within 48 hours."
  }];

  return (
    <section id="about" className="ys-reveal" style={{ padding: "var(--pad-x-lg) var(--pad-x)", borderTop: `1px solid ${p.line}` }}
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <SectionHead
          p={p}
          displayFont={displayFont}
          eyebrow="Why Yellowstone"
          title="Built around the way Alvin actually lives."
          lead="We're not a corporate landlord with a portfolio scattered across five states. Every property we manage is within ten minutes of our office, and that proximity is the whole point." />
        
        <div className="ys-about-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, marginTop: 24 }}>
          {items.map((it) =>
          <div key={it.n} style={{
            padding: "32px 0",
            borderTop: `2px solid ${p.ink}`
          }}>
              <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12, color: p.accent, fontWeight: 600,
              letterSpacing: "0.1em", marginBottom: 16
            }}>{it.n} / 03</div>
              <h3 style={{
              fontFamily: `'${displayFont}', serif`,
              fontSize: 32, fontWeight: 400, letterSpacing: "-0.01em",
              margin: 0, lineHeight: 1.05, color: p.ink
            }}>{it.title}</h3>
              <p style={{
              fontSize: 15, lineHeight: 1.6, color: p.inkSoft,
              marginTop: 16
            }}>{it.body}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}

/* ----------------------------- contact ----------------------------- */

const CALENDAR_URL = "https://calendar.google.com/calendar/u/0/appointments/schedules/yellowstone-am";

function Contact({ p, displayFont }) {
  const [hovered, setHovered] = useState(null);
  const channels = [
  {
    key: "book",
    eyebrow: "Preferred",
    label: "Book a viewing",
    detail: "30 minutes · in-person or virtual · confirms in 24h",
    action: "Schedule a tour",
    href: "#",
    onClick: (e) => { e.preventDefault(); window.__openBooking && window.__openBooking(); }
  },
  {
    key: "call",
    eyebrow: "Mon–Fri · 9–5 CT",
    label: "(832) 210-3968",
    detail: "Direct line to the leasing office.",
    action: "Call now",
    href: "tel:8322103968"
  },
  {
    key: "email",
    eyebrow: "We reply within a business day",
    label: "office@yellowstone-am.com",
    detail: "Best for documents and lease questions.",
    action: "Compose email",
    href: "mailto:office@yellowstone-am.com"
  }];

  return (
    <section id="contact" className="ys-reveal" style={{
      padding: "var(--pad-x-lg) var(--pad-x)",
      background: p.paper,
      borderTop: `1px solid ${p.line}`
    }}
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="ys-contact-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 80 }}>
          <div>
            <div style={{
              fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase",
              color: p.accent, fontWeight: 600, marginBottom: 32
            }}>
              Visit · Call · Schedule
            </div>
            <h2 style={{
              fontFamily: `'${displayFont}', serif`,
              fontSize: "clamp(40px, 6vw, 88px)",
              lineHeight: 0.98, letterSpacing: "-0.02em",
              margin: 0, fontWeight: 400, color: p.ink
            }}>
              Stop by the office, or pick a time online.
            </h2>
            <div style={{
              marginTop: 48,
              padding: 32,
              border: `1px solid ${p.line}`,
              background: p.bg
            }}>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: p.inkSoft, fontWeight: 500 }}>
                Leasing office
              </div>
              <div style={{
                fontFamily: `'${displayFont}', serif`,
                fontSize: 36, lineHeight: 1.1, color: p.ink,
                marginTop: 10, fontWeight: 400
              }}>
                410 S 2nd Street<br />Alvin, TX 77511
              </div>
              <div style={{
                marginTop: 20, display: "flex", gap: 28,
                fontSize: 13, color: p.inkSoft
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: p.ink }}>Mon – Fri</div>
                  9:00am – 5:00pm
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: p.ink }}>Saturday</div>
                  By appointment
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: p.ink }}>Sunday</div>
                  Closed
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=410+S+2nd+St+Alvin+TX+77511"
                target="_blank" rel="noopener"
                style={{
                  marginTop: 24, display: "inline-flex", alignItems: "center", gap: 8,
                  fontSize: 13, fontWeight: 600, color: p.primary, textDecoration: "none"
                }}>
                
                Get directions
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7m0 0L6.5 3m3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              </a>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {channels.map((c, i) =>
            <a
              key={c.key}
              href={c.href}
              onClick={c.onClick}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noopener" : undefined}
              onMouseEnter={() => setHovered(c.key)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "block",
                padding: "32px 0",
                borderTop: i === 0 ? `1px solid ${p.line}` : "none",
                borderBottom: `1px solid ${p.line}`,
                textDecoration: "none", color: p.ink,
                transition: "transform 220ms ease",
                transform: hovered === c.key ? "translateX(8px)" : "translateX(0)",
                position: "relative"
              }}
              
                <div style={{
                position: "absolute", left: -12, top: "50%", transform: `translateY(-50%) scale(${hovered === c.key ? 1 : 0})`,
                width: 8, height: 8,
                background: p.accent,
                transition: "transform 220ms ease",
                borderRadius: "50%"
              }}></div>
                <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "baseline",
                fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
                color: p.inkSoft, fontWeight: 500, marginBottom: 12
              }}>
                  <span>{c.eyebrow}</span>
                  <span style={{ color: p.accent }}>{c.action} →</span>
                </div>
                <div style={{
                fontFamily: `'${displayFont}', serif`,
                fontSize: c.key === "email" ? "clamp(22px, 2.6vw, 30px)" : 36,
                lineHeight: 1.15, fontWeight: 400,
                letterSpacing: "-0.01em",
                wordBreak: "break-word",
                overflowWrap: "anywhere"
              }}>
                  {c.label}
                </div>
                <div style={{ fontSize: 14, color: p.inkSoft, marginTop: 12 }}>
                  {c.detail}
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>);

}

/* ----------------------------- footer ----------------------------- */

function Footer({ p, displayFont }) {
  return (
    <footer style={{
      padding: "60px var(--pad-x) 40px",
      background: p.ink,
      color: `color-mix(in oklab, ${p.paper} 80%, transparent)`
    }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="ys-footer-grid" style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 60,
          paddingBottom: 40,
          borderBottom: `1px solid color-mix(in oklab, ${p.paper} 15%, transparent)`
        }}>
          <div>
            <div style={{
              fontFamily: `'${displayFont}', serif`,
              fontSize: 40, color: p.paper, lineHeight: 1, letterSpacing: "-0.01em"
            }}>
              Yellowstone <em style={{ color: p.accent }}>Asset Management</em>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, marginTop: 16, maxWidth: "42ch" }}>Family-run property management serving Alvin, Texas since opening the doors at 410 S 2nd St.
We care, We listen, We learn.
</p>
          </div>
          <div>
            <div style={{ color: p.paper, fontWeight: 600, fontSize: 13, marginBottom: 14 }}>Properties</div>
            {["Kings Haven", "Kings Manor", "French Quarter", "Royal Oaks", "White House"].map((n) =>
            <a key={n} href="#properties" style={{
              display: "block", fontSize: 13, color: "inherit",
              textDecoration: "none", padding: "4px 0",
              transition: "color 160ms ease, transform 160ms ease"
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = p.accent; e.currentTarget.style.transform = "translateX(2px)"; }}
            onMouseOut={(e) => { e.currentTarget.style.color = "inherit"; e.currentTarget.style.transform = "translateX(0)"; }}>{n}</a>
            )}
          </div>
          <div>
            <div style={{ color: p.paper, fontWeight: 600, fontSize: 13, marginBottom: 14 }}>Office</div>
            <div style={{ fontSize: 13, lineHeight: 1.7 }}>
              410 S 2nd Street<br />
              Alvin, TX 77511<br />
              Mon–Fri · 9–5 CT
            </div>
          </div>
          <div>
            <div style={{ color: p.paper, fontWeight: 600, fontSize: 13, marginBottom: 14 }}>Contact</div>
            <div style={{ fontSize: 13, lineHeight: 1.7 }}>
              <a href="tel:8322103968" style={{ color: "inherit", textDecoration: "none", display: "block", transition: "color 160ms ease, transform 160ms ease" }}
              onMouseOver={(e) => { e.currentTarget.style.color = p.accent; e.currentTarget.style.transform = "translateX(2px)"; }}
              onMouseOut={(e) => { e.currentTarget.style.color = "inherit"; e.currentTarget.style.transform = "translateX(0)"; }}>(832) 210-3968</a>
              <a href="mailto:office@yellowstone-am.com" style={{ color: "inherit", textDecoration: "none", display: "block", transition: "color 160ms ease, transform 160ms ease" }}
              onMouseOver={(e) => { e.currentTarget.style.color = p.accent; e.currentTarget.style.transform = "translateX(2px)"; }}
              onMouseOut={(e) => { e.currentTarget.style.color = "inherit"; e.currentTarget.style.transform = "translateX(0)"; }}>office@yellowstone-am.com</a>
              <a href="#" onClick={(e) => { e.preventDefault(); window.__openBooking && window.__openBooking(); }} style={{ color: p.accent, textDecoration: "none", display: "block", marginTop: 8, transition: "opacity 160ms ease" }}
              onMouseOver={(e) => e.currentTarget.style.opacity = "0.75"}
              onMouseOut={(e) => e.currentTarget.style.opacity = "1"}>Schedule a tour →</a>
            </div>
          </div>
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 24, fontSize: 12, opacity: 0.7
        }}>
          <span>© {new Date().getFullYear()} Yellowstone Asset Management. Equal Housing Opportunity.</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>ALVIN · TX · 77511</span>
        </div>
      </div>
    </footer>);

}

/* ----------------------------- tweaks panel ----------------------------- */

function Tweaks({ tweaks, setTweak }) {
  if (!window.TweaksPanel) return null;
  return (
    <window.TweaksPanel title="Tweaks">
      <window.TweakSection title="Palette">
        <window.TweakRadio
          label="Color system"
          value={tweaks.palette}
          onChange={(v) => setTweak("palette", v)}
          options={[
          { value: "forest", label: "Forest" },
          { value: "midnight", label: "Midnight" },
          { value: "clay", label: "Clay" }]
          } />
        
      </window.TweakSection>
      <window.TweakSection title="Typography">
        <window.TweakSelect
          label="Display font"
          value={tweaks.displayFont}
          onChange={(v) => setTweak("displayFont", v)}
          options={[
          { value: "Instrument Serif", label: "Instrument Serif" },
          { value: "DM Serif Display", label: "DM Serif Display" },
          { value: "Playfair Display", label: "Playfair Display" },
          { value: "EB Garamond", label: "EB Garamond" }]
          } />
        
      </window.TweakSection>
      <window.TweakSection title="Hero">
        <window.TweakToggle
          label="Show stat strip"
          value={tweaks.showStats}
          onChange={(v) => setTweak("showStats", v)} />
        
      </window.TweakSection>
    </window.TweaksPanel>);

}

/* ----------------------------- app ----------------------------- */

function App() {
  const [tweaks, setTweak] = (window.useTweaks || (() => [TWEAK_DEFAULTS, () => {}]))(TWEAK_DEFAULTS);

  const p = PALETTES[tweaks.palette] || PALETTES.forest;

  // Tour booking modal — exposed globally so any component can trigger it
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingPropId, setBookingPropId] = useState("");
  useEffect(() => {
    window.__openBooking = (propId) => {
      setBookingPropId(propId || "");
      setBookingOpen(true);
    };
    return () => { delete window.__openBooking; };
  }, []);

  useEffect(() => {
    document.body.style.background = p.bg;
    document.body.style.color = p.ink;
  }, [p]);

  // Scroll-reveal observer
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("ys-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".ys-reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: p.bg, color: p.ink, minHeight: "100vh" }}>
      <Nav p={p} />
      <Hero p={p} displayFont={tweaks.displayFont} showStats={tweaks.showStats} />
      {/* Apply CTA strip */}
      <div style={{
        padding: "20px var(--pad-x)",
        background: p.ink, color: p.paper,
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 16, flexWrap: "wrap", fontSize: 14
      }}>
        <span style={{ opacity: 0.85 }}>Ready to move? Apply online in 5 minutes.</span>
        <a href="#apply" style={{
          color: p.accent, fontWeight: 600, textDecoration: "none",
          transition: "opacity 160ms ease",
          borderRadius: 2
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = "0.75"}
        onMouseOut={(e) => e.currentTarget.style.opacity = "1"}>Start application →</a>
      </div>
      {window.Availability && <window.Availability p={p} displayFont={tweaks.displayFont} />}
      <Properties p={p} displayFont={tweaks.displayFont} />
      {window.AlvinMap && <window.AlvinMap p={p} displayFont={tweaks.displayFont} />}
      <Floorplans p={p} displayFont={tweaks.displayFont} />
      <About p={p} displayFont={tweaks.displayFont} />
      {window.Apply && <window.Apply p={p} displayFont={tweaks.displayFont} />}
      {window.FAQ && <window.FAQ p={p} displayFont={tweaks.displayFont} />}
      {window.SellProperty && <window.SellProperty p={p} displayFont={tweaks.displayFont} />}
      <Contact p={p} displayFont={tweaks.displayFont} />
      <Footer p={p} displayFont={tweaks.displayFont} />
      <Tweaks tweaks={tweaks} setTweak={setTweak} />
      {window.TourBooking && (
        <window.TourBooking
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
          p={p}
          displayFont={tweaks.displayFont}
          initialPropertyId={bookingPropId}
        />
      )}
    </div>);

}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);