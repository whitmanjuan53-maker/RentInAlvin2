/* global React */
const { useState: useStateL } = React;

/* ============================================================
   Logo set — 8 directions, all forest + cream, all "Yellowstone Asset Management"
   Each is sized for an 800x500 artboard with breathing room.
   Built with inline SVG so they scale crisp at any size.
============================================================ */

const PALETTE = {
  ink: "#1F3A2E",      // forest green (primary)
  inkDark: "#142922",
  cream: "#FBF7F0",
  paper: "#F4EEE4",
  rule: "rgba(31, 58, 46, 0.18)",
  accent: "#B6743F"
};

const SERIF = `'Instrument Serif', 'EB Garamond', Georgia, serif`;
const SERIF_DISPLAY = `'DM Serif Display', 'Playfair Display', Georgia, serif`;
const SANS = `'Inter', system-ui, -apple-system, sans-serif`;

/* ----------------------------- Shared frame ----------------------------- */
function LogoFrame({ children, bg = PALETTE.cream, ink = PALETTE.ink, label }) {
  return (
    <div style={{
      width: 800, height: 500,
      background: bg, color: ink,
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden"
    }}>
      {/* tag in corner */}
      <div style={{
        position: "absolute", top: 18, left: 24,
        fontFamily: SANS, fontSize: 10,
        letterSpacing: "0.22em", textTransform: "uppercase",
        color: ink, opacity: 0.4, fontWeight: 500
      }}>{label}</div>

      <div style={{ flex: 1, display: "grid", placeItems: "center", padding: "60px 40px 40px" }}>
        {children}
      </div>

      {/* footer mini-set: small variant + 1-color reduction */}
      <div style={{
        borderTop: `1px solid ${PALETTE.rule}`,
        padding: "14px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: SANS, fontSize: 10, opacity: 0.55, letterSpacing: "0.14em",
        textTransform: "uppercase"
      }}>
        <span>Forest #1F3A2E</span>
        <span>Cream #FBF7F0</span>
      </div>
    </div>
  );
}

/* ============================================================
   1. SERIF MONOGRAM CREST
   "Y" inside a thin circle, full name beneath.
============================================================ */
function Logo01() {
  return (
    <LogoFrame label="01 · Crest monogram">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="76" fill="none" stroke={PALETTE.ink} strokeWidth="1.5" />
          <circle cx="80" cy="80" r="68" fill="none" stroke={PALETTE.ink} strokeWidth="0.8" opacity="0.4" />
          <text x="80" y="108" textAnchor="middle"
                fontFamily={SERIF_DISPLAY} fontSize="110" fill={PALETTE.ink}
                fontStyle="italic" fontWeight="400">Y</text>
        </svg>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: SERIF, fontSize: 28, letterSpacing: "0.02em",
            lineHeight: 1, fontStyle: "italic"
          }}>Yellowstone</div>
          <div style={{
            fontFamily: SANS, fontSize: 10, letterSpacing: "0.42em",
            textTransform: "uppercase", marginTop: 8, fontWeight: 500
          }}>Asset Management</div>
        </div>
      </div>
    </LogoFrame>
  );
}

/* ============================================================
   2. PURE WORDMARK — no symbol
   "Yellowstone" in a refined italic display serif.
============================================================ */
function Logo02() {
  return (
    <LogoFrame label="02 · Wordmark only">
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: SERIF_DISPLAY, fontSize: 88,
          letterSpacing: "-0.02em", lineHeight: 0.95,
          fontStyle: "italic", fontWeight: 400, color: PALETTE.ink
        }}>Yellowstone</div>
        <div style={{
          marginTop: 18,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 14
        }}>
          <div style={{ width: 50, height: 1, background: PALETTE.ink, opacity: 0.6 }}></div>
          <span style={{
            fontFamily: SANS, fontSize: 11, letterSpacing: "0.46em",
            textTransform: "uppercase", fontWeight: 500
          }}>Asset Management</span>
          <div style={{ width: 50, height: 1, background: PALETTE.ink, opacity: 0.6 }}></div>
        </div>
      </div>
    </LogoFrame>
  );
}

/* ============================================================
   3. GEOMETRIC Y / ROOF MARK
   The Y as architectural roofline, very minimal & modern.
============================================================ */
function Logo03() {
  return (
    <LogoFrame label="03 · Roofline mark">
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          {/* roof / Y as two converging lines */}
          <path d="M 20 100 L 60 30 L 100 100" fill="none" stroke={PALETTE.ink} strokeWidth="6" strokeLinecap="square" />
          <line x1="60" y1="30" x2="60" y2="100" stroke={PALETTE.ink} strokeWidth="6" strokeLinecap="square" />
          {/* baseline */}
          <line x1="14" y1="108" x2="106" y2="108" stroke={PALETTE.ink} strokeWidth="2" />
        </svg>
        <div style={{ borderLeft: `1px solid ${PALETTE.rule}`, paddingLeft: 28, height: 80, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{
            fontFamily: SANS, fontSize: 28, letterSpacing: "0.06em",
            fontWeight: 600, textTransform: "uppercase", color: PALETTE.ink
          }}>Yellowstone</div>
          <div style={{
            fontFamily: SANS, fontSize: 11, letterSpacing: "0.32em",
            textTransform: "uppercase", marginTop: 6, fontWeight: 400, opacity: 0.7
          }}>Asset Management</div>
        </div>
      </div>
    </LogoFrame>
  );
}

/* ============================================================
   4. LETTERPRESS STAMP / SEAL
   Concentric circles + "EST. 2018" type detail. High trust.
============================================================ */
function Logo04() {
  return (
    <LogoFrame label="04 · Letterpress seal">
      <svg width="280" height="280" viewBox="0 0 280 280">
        <defs>
          <path id="topArc" d="M 40 140 A 100 100 0 0 1 240 140" />
          <path id="botArc" d="M 40 140 A 100 100 0 0 0 240 140" />
        </defs>
        <circle cx="140" cy="140" r="120" fill="none" stroke={PALETTE.ink} strokeWidth="1.2" />
        <circle cx="140" cy="140" r="106" fill="none" stroke={PALETTE.ink} strokeWidth="0.6" opacity="0.5" />
        <text fontFamily={SANS} fontSize="11" letterSpacing="6" fill={PALETTE.ink} fontWeight="600">
          <textPath href="#topArc" startOffset="50%" textAnchor="middle">YELLOWSTONE · ASSET MANAGEMENT</textPath>
        </text>
        <text fontFamily={SANS} fontSize="10" letterSpacing="6" fill={PALETTE.ink} fontWeight="500">
          <textPath href="#botArc" startOffset="50%" textAnchor="middle">ALVIN · TEXAS · EST 2018</textPath>
        </text>
        {/* center mark */}
        <text x="140" y="158" textAnchor="middle"
              fontFamily={SERIF_DISPLAY} fontSize="78" fill={PALETTE.ink}
              fontStyle="italic" fontWeight="400">Y</text>
        {/* ornaments */}
        <circle cx="48" cy="140" r="2.5" fill={PALETTE.ink} />
        <circle cx="232" cy="140" r="2.5" fill={PALETTE.ink} />
      </svg>
    </LogoFrame>
  );
}

/* ============================================================
   5. MONOLITH BLOCK
   Solid forest-green rectangle with a cream Y, name beside.
   Architectural / monolithic / very confident.
============================================================ */
function Logo05() {
  return (
    <LogoFrame label="05 · Monolith block">
      <div style={{ display: "flex", alignItems: "stretch", gap: 28, height: 160 }}>
        <div style={{
          width: 130, background: PALETTE.ink, color: PALETTE.cream,
          display: "grid", placeItems: "center"
        }}>
          <span style={{
            fontFamily: SERIF_DISPLAY, fontSize: 110, lineHeight: 1,
            fontStyle: "italic", fontWeight: 400
          }}>Y</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{
            fontFamily: SERIF, fontSize: 44, lineHeight: 1,
            color: PALETTE.ink, fontWeight: 400, letterSpacing: "-0.01em"
          }}>Yellowstone</div>
          <div style={{
            fontFamily: SANS, fontSize: 12, letterSpacing: "0.32em",
            textTransform: "uppercase", marginTop: 12, color: PALETTE.ink,
            fontWeight: 500, opacity: 0.85
          }}>Asset Management</div>
          <div style={{ width: 60, height: 2, background: PALETTE.ink, marginTop: 14 }}></div>
        </div>
      </div>
    </LogoFrame>
  );
}

/* ============================================================
   6. HORIZON / LANDSCAPE MARK
   Subtle nod to Yellowstone-the-place: distant horizon ridges.
============================================================ */
function Logo06() {
  return (
    <LogoFrame label="06 · Horizon mark">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <svg width="200" height="80" viewBox="0 0 200 80">
          {/* far ridge */}
          <path d="M 0 60 Q 30 38 60 50 T 120 42 T 200 52 L 200 80 L 0 80 Z" fill={PALETTE.ink} opacity="0.18" />
          {/* mid ridge */}
          <path d="M 0 70 Q 40 50 80 62 T 160 58 T 200 66 L 200 80 L 0 80 Z" fill={PALETTE.ink} opacity="0.4" />
          {/* near ridge / ground */}
          <path d="M 0 76 L 200 76 L 200 80 L 0 80 Z" fill={PALETTE.ink} />
          {/* sun */}
          <circle cx="100" cy="34" r="14" fill="none" stroke={PALETTE.ink} strokeWidth="1.5" />
        </svg>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: SERIF, fontSize: 38, letterSpacing: "0.01em",
            lineHeight: 1, fontWeight: 400, color: PALETTE.ink
          }}>Yellowstone</div>
          <div style={{
            fontFamily: SANS, fontSize: 10, letterSpacing: "0.42em",
            textTransform: "uppercase", marginTop: 10, fontWeight: 500
          }}>Asset Management · Alvin, TX</div>
        </div>
      </div>
    </LogoFrame>
  );
}

/* ============================================================
   7. STACKED Y·A·M INITIALS
   Confident typographic monogram, treats each letter as a peer.
============================================================ */
function Logo07() {
  return (
    <LogoFrame label="07 · YAM monogram">
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <div style={{
          display: "flex", flexDirection: "column",
          fontFamily: SERIF_DISPLAY, color: PALETTE.ink,
          lineHeight: 0.85, fontWeight: 400
        }}>
          <span style={{ fontSize: 72, fontStyle: "italic" }}>Y.</span>
          <span style={{ fontSize: 72, fontStyle: "italic", marginLeft: 12 }}>A.</span>
          <span style={{ fontSize: 72, fontStyle: "italic", marginLeft: 24 }}>M.</span>
        </div>
        <div style={{ borderLeft: `1px solid ${PALETTE.rule}`, paddingLeft: 28, height: 180, display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
          <div style={{
            fontFamily: SANS, fontSize: 11, letterSpacing: "0.32em",
            textTransform: "uppercase", color: PALETTE.ink, fontWeight: 600
          }}>Yellowstone</div>
          <div style={{
            fontFamily: SANS, fontSize: 11, letterSpacing: "0.32em",
            textTransform: "uppercase", color: PALETTE.ink, fontWeight: 600
          }}>Asset</div>
          <div style={{
            fontFamily: SANS, fontSize: 11, letterSpacing: "0.32em",
            textTransform: "uppercase", color: PALETTE.ink, fontWeight: 600
          }}>Management</div>
          <div style={{ width: 36, height: 1, background: PALETTE.ink, marginTop: 10, opacity: 0.5 }}></div>
          <div style={{
            fontFamily: SANS, fontSize: 9, letterSpacing: "0.28em",
            textTransform: "uppercase", marginTop: 6, opacity: 0.55
          }}>Alvin · Texas</div>
        </div>
      </div>
    </LogoFrame>
  );
}

/* ============================================================
   8. DOORWAY / KEYHOLE MARK
   Property-management cue, but abstract enough not to be cliché.
   A simple arched doorway; subtle and warm.
============================================================ */
function Logo08() {
  return (
    <LogoFrame label="08 · Doorway mark">
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <svg width="100" height="140" viewBox="0 0 100 140">
          {/* Outer doorway frame */}
          <path d="M 8 132 L 8 50 Q 8 8 50 8 Q 92 8 92 50 L 92 132 Z"
                fill="none" stroke={PALETTE.ink} strokeWidth="2.5" />
          {/* Inner threshold */}
          <path d="M 22 132 L 22 56 Q 22 22 50 22 Q 78 22 78 56 L 78 132"
                fill="none" stroke={PALETTE.ink} strokeWidth="1.2" opacity="0.5" />
          {/* Y inside, like a keyhole stand-in */}
          <text x="50" y="92" textAnchor="middle"
                fontFamily={SERIF_DISPLAY} fontSize="56" fill={PALETTE.ink}
                fontStyle="italic" fontWeight="400">Y</text>
          {/* doorstep */}
          <line x1="0" y1="134" x2="100" y2="134" stroke={PALETTE.ink} strokeWidth="2" />
        </svg>
        <div>
          <div style={{
            fontFamily: SERIF, fontSize: 42, letterSpacing: "0.01em",
            lineHeight: 1, color: PALETTE.ink, fontWeight: 400
          }}>Yellowstone</div>
          <div style={{
            fontFamily: SANS, fontSize: 11, letterSpacing: "0.36em",
            textTransform: "uppercase", marginTop: 12, fontWeight: 500
          }}>Asset Management</div>
        </div>
      </div>
    </LogoFrame>
  );
}

/* ============================================================
   Reverse / dark-bg variant — shows logos work on forest green too
============================================================ */
function LogoReverse() {
  return (
    <div style={{
      width: 800, height: 500,
      background: PALETTE.ink, color: PALETTE.cream,
      display: "grid", placeItems: "center",
      position: "relative"
    }}>
      <div style={{
        position: "absolute", top: 18, left: 24,
        fontFamily: SANS, fontSize: 10,
        letterSpacing: "0.22em", textTransform: "uppercase",
        opacity: 0.5, fontWeight: 500
      }}>Reverse · on forest green</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="56" fill="none" stroke={PALETTE.cream} strokeWidth="1.5" />
          <text x="60" y="82" textAnchor="middle"
                fontFamily={SERIF_DISPLAY} fontSize="80" fill={PALETTE.cream}
                fontStyle="italic" fontWeight="400">Y</text>
        </svg>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: SERIF, fontSize: 32, letterSpacing: "0.02em",
            lineHeight: 1, fontStyle: "italic"
          }}>Yellowstone</div>
          <div style={{
            fontFamily: SANS, fontSize: 11, letterSpacing: "0.42em",
            textTransform: "uppercase", marginTop: 10, fontWeight: 500, opacity: 0.85
          }}>Asset Management</div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Mini-set: how each logo looks at favicon / business-card scale
============================================================ */
function MiniSet() {
  const items = [
    { label: "01", el: <svg width="40" height="40" viewBox="0 0 160 160"><circle cx="80" cy="80" r="76" fill="none" stroke={PALETTE.ink} strokeWidth="3" /><text x="80" y="112" textAnchor="middle" fontFamily={SERIF_DISPLAY} fontSize="110" fill={PALETTE.ink} fontStyle="italic">Y</text></svg> },
    { label: "02", el: <span style={{ fontFamily: SERIF_DISPLAY, fontSize: 22, fontStyle: "italic", color: PALETTE.ink }}>Yellowstone</span> },
    { label: "03", el: <svg width="40" height="40" viewBox="0 0 120 120"><path d="M 20 100 L 60 30 L 100 100" fill="none" stroke={PALETTE.ink} strokeWidth="10" strokeLinecap="square" /><line x1="60" y1="30" x2="60" y2="100" stroke={PALETTE.ink} strokeWidth="10" /></svg> },
    { label: "04", el: <svg width="40" height="40" viewBox="0 0 280 280"><circle cx="140" cy="140" r="120" fill="none" stroke={PALETTE.ink} strokeWidth="6" /><text x="140" y="170" textAnchor="middle" fontFamily={SERIF_DISPLAY} fontSize="100" fill={PALETTE.ink} fontStyle="italic">Y</text></svg> },
    { label: "05", el: <div style={{ width: 40, height: 40, background: PALETTE.ink, color: PALETTE.cream, display: "grid", placeItems: "center", fontFamily: SERIF_DISPLAY, fontSize: 32, fontStyle: "italic" }}>Y</div> },
    { label: "06", el: <svg width="40" height="40" viewBox="0 0 200 80"><path d="M 0 70 Q 40 50 80 62 T 160 58 T 200 66 L 200 80 L 0 80 Z" fill={PALETTE.ink} /><circle cx="100" cy="40" r="14" fill="none" stroke={PALETTE.ink} strokeWidth="4" /></svg> },
    { label: "07", el: <span style={{ fontFamily: SERIF_DISPLAY, fontSize: 22, fontStyle: "italic", color: PALETTE.ink, letterSpacing: "0.02em" }}>Y·A·M</span> },
    { label: "08", el: <svg width="32" height="40" viewBox="0 0 100 140"><path d="M 8 132 L 8 50 Q 8 8 50 8 Q 92 8 92 50 L 92 132 Z" fill="none" stroke={PALETTE.ink} strokeWidth="6" /><text x="50" y="92" textAnchor="middle" fontFamily={SERIF_DISPLAY} fontSize="56" fill={PALETTE.ink} fontStyle="italic">Y</text></svg> }
  ];
  return (
    <div style={{
      width: 800, height: 500, background: PALETTE.cream,
      display: "flex", flexDirection: "column",
      position: "relative", padding: "40px"
    }}>
      <div style={{
        fontFamily: SANS, fontSize: 10,
        letterSpacing: "0.22em", textTransform: "uppercase",
        color: PALETTE.ink, opacity: 0.5, fontWeight: 500
      }}>Favicon scale · 40px square</div>
      <div style={{
        fontFamily: SERIF, fontSize: 26, color: PALETTE.ink,
        marginTop: 8, fontWeight: 400, fontStyle: "italic"
      }}>Each mark, reduced.</div>
      <div style={{
        flex: 1, display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: 20, marginTop: 30,
        alignItems: "center", justifyItems: "center"
      }}>
        {items.map((it, i) => (
          <div key={i} style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 10,
            padding: "20px 16px",
            border: `1px solid ${PALETTE.rule}`,
            width: "100%", height: "100%",
            justifyContent: "center"
          }}>
            <div style={{ display: "grid", placeItems: "center", height: 50 }}>{it.el}</div>
            <div style={{
              fontFamily: SANS, fontSize: 9, letterSpacing: "0.18em",
              textTransform: "uppercase", color: PALETTE.ink, opacity: 0.5
            }}>Direction {it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   App — design canvas
============================================================ */
function LogoApp() {
  const DC = window.DesignCanvas;
  const DCSection = window.DCSection;
  const DCArtboard = window.DCArtboard;
  if (!DC) return <div style={{padding:40}}>Loading canvas…</div>;

  return (
    <DC title="Yellowstone Asset Management" subtitle="Eight logo directions · forest green + cream">
      <DCSection id="primary" title="Primary marks">
        <DCArtboard id="l1" label="01 · Crest monogram" width={800} height={500}><Logo01 /></DCArtboard>
        <DCArtboard id="l2" label="02 · Wordmark only" width={800} height={500}><Logo02 /></DCArtboard>
        <DCArtboard id="l3" label="03 · Roofline mark" width={800} height={500}><Logo03 /></DCArtboard>
        <DCArtboard id="l4" label="04 · Letterpress seal" width={800} height={500}><Logo04 /></DCArtboard>
        <DCArtboard id="l5" label="05 · Monolith block" width={800} height={500}><Logo05 /></DCArtboard>
        <DCArtboard id="l6" label="06 · Horizon mark" width={800} height={500}><Logo06 /></DCArtboard>
        <DCArtboard id="l7" label="07 · YAM monogram" width={800} height={500}><Logo07 /></DCArtboard>
        <DCArtboard id="l8" label="08 · Doorway mark" width={800} height={500}><Logo08 /></DCArtboard>
      </DCSection>

      <DCSection id="checks" title="Sanity checks">
        <DCArtboard id="reverse" label="Reverse · forest bg" width={800} height={500}><LogoReverse /></DCArtboard>
        <DCArtboard id="favicon" label="Favicon scale" width={800} height={500}><MiniSet /></DCArtboard>
      </DCSection>
    </DC>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<LogoApp />);
