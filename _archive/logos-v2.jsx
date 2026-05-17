/* global React */
const { useState: useStateW } = React;

/* ============================================================
   Logo set II — institutional / wealth / big real-estate firm
   References: Tishman Speyer, Related, Blackstone, JLL, Hines,
   Brookfield, Cushman & Wakefield, RXR.
   Visual cues: heavy serif wordmarks, ornamental marks,
   architectural lockups, "Est." dates, rule lines.
============================================================ */

const PAL = {
  ink: "#1F3A2E",
  inkDeep: "#0F1E18",
  cream: "#FBF7F0",
  paper: "#F4EEE4",
  rule: "rgba(31, 58, 46, 0.2)",
  ruleStrong: "rgba(31, 58, 46, 0.5)",
  gold: "#9B7B3F"
};

const SERIF_HEAVY = `'DM Serif Display', 'Playfair Display', Georgia, serif`;
const SERIF_BODY = `'EB Garamond', 'Instrument Serif', Georgia, serif`;
const SERIF_ITALIC = `'Instrument Serif', 'EB Garamond', Georgia, serif`;
const SANS = `'Inter', system-ui, -apple-system, sans-serif`;

/* Shared frame */
function Frame({ children, label, bg = PAL.cream, ink = PAL.ink, sub }) {
  return (
    <div style={{
      width: 800, height: 500,
      background: bg, color: ink,
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden"
    }}>
      <div style={{
        position: "absolute", top: 18, left: 24,
        fontFamily: SANS, fontSize: 10,
        letterSpacing: "0.22em", textTransform: "uppercase",
        color: ink, opacity: 0.45, fontWeight: 500
      }}>{label}</div>
      <div style={{ flex: 1, display: "grid", placeItems: "center", padding: "70px 50px 40px" }}>
        {children}
      </div>
      <div style={{
        borderTop: `1px solid ${PAL.rule}`,
        padding: "14px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: SANS, fontSize: 10, opacity: 0.55, letterSpacing: "0.16em",
        textTransform: "uppercase"
      }}>
        <span>{sub || "Established 2018"}</span>
        <span>Alvin · Texas</span>
      </div>
    </div>
  );
}

/* ============================================================
   01 · TISHMAN-STYLE WORDMARK
   Set in classic heavy serif, generously letterspaced,
   centered with two thin rules. Pure typographic confidence.
============================================================ */
function W01() {
  return (
    <Frame label="01 · Heritage wordmark" sub="Tishman Speyer · Related · Hines">
      <div style={{ textAlign: "center", maxWidth: 660 }}>
        <div style={{
          fontFamily: SERIF_HEAVY, fontSize: 64,
          letterSpacing: "0.03em", lineHeight: 1,
          color: PAL.ink, fontWeight: 400
        }}>YELLOWSTONE</div>
        <div style={{
          marginTop: 22,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 16
        }}>
          <div style={{ flex: 1, height: 1, background: PAL.ruleStrong }}></div>
          <span style={{
            fontFamily: SANS, fontSize: 11, letterSpacing: "0.5em",
            textTransform: "uppercase", fontWeight: 500
          }}>Asset Management</span>
          <div style={{ flex: 1, height: 1, background: PAL.ruleStrong }}></div>
        </div>
      </div>
    </Frame>
  );
}

/* ============================================================
   02 · BLACKSTONE-STYLE BLOCK + WORDMARK
   Solid emblem (initial in a tall block) + heavy wordmark.
   Reads like a financial-services firm.
============================================================ */
function W02() {
  return (
    <Frame label="02 · Block emblem" sub="Blackstone · KKR · Apollo">
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div style={{
          width: 90, height: 130, background: PAL.ink,
          color: PAL.cream, display: "grid", placeItems: "center",
          position: "relative"
        }}>
          <span style={{
            fontFamily: SERIF_HEAVY, fontSize: 86, lineHeight: 1,
            fontWeight: 400
          }}>Y</span>
          <div style={{
            position: "absolute", bottom: 8, left: 0, right: 0,
            textAlign: "center", fontFamily: SANS, fontSize: 8,
            letterSpacing: "0.32em", opacity: 0.7
          }}>EST. 2018</div>
        </div>
        <div>
          <div style={{
            fontFamily: SERIF_HEAVY, fontSize: 40, lineHeight: 1,
            color: PAL.ink, fontWeight: 400, letterSpacing: "0.01em"
          }}>YELLOWSTONE</div>
          <div style={{
            fontFamily: SERIF_BODY, fontSize: 22, lineHeight: 1,
            color: PAL.ink, fontWeight: 400, marginTop: 8,
            fontStyle: "italic", letterSpacing: "0.02em"
          }}>Asset Management</div>
        </div>
      </div>
    </Frame>
  );
}

/* ============================================================
   03 · JLL-STYLE STACKED INITIALS WITH PILLAR RULE
   Two thin vertical rules flanking the wordmark.
   Architectural, formal, very institutional.
============================================================ */
function W03() {
  return (
    <Frame label="03 · Pillared lockup" sub="JLL · CBRE · Cushman & Wakefield">
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ width: 1.5, height: 160, background: PAL.ink }}></div>
        <div style={{ width: 1, height: 140, background: PAL.ruleStrong }}></div>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: SERIF_HEAVY, fontSize: 56,
            lineHeight: 1, color: PAL.ink, fontWeight: 400,
            letterSpacing: "0.02em"
          }}>YELLOWSTONE</div>
          <div style={{
            marginTop: 14,
            fontFamily: SANS, fontSize: 11, letterSpacing: "0.46em",
            textTransform: "uppercase", color: PAL.ink, fontWeight: 600
          }}>ASSET · MANAGEMENT</div>
        </div>
        <div style={{ width: 1, height: 140, background: PAL.ruleStrong }}></div>
        <div style={{ width: 1.5, height: 160, background: PAL.ink }}></div>
      </div>
    </Frame>
  );
}

/* ============================================================
   04 · BROOKFIELD-STYLE EMBLEM
   Diamond/lozenge mark with stacked monogram inside.
   Reads as a financial seal.
============================================================ */
function W04() {
  return (
    <Frame label="04 · Lozenge emblem" sub="Brookfield · Equinox · Mandarin Oriental">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <svg width="120" height="160" viewBox="0 0 120 160">
          {/* Outer lozenge */}
          <path d="M 60 4 L 116 80 L 60 156 L 4 80 Z"
                fill="none" stroke={PAL.ink} strokeWidth="2" />
          {/* Inner lozenge */}
          <path d="M 60 18 L 100 80 L 60 142 L 20 80 Z"
                fill="none" stroke={PAL.ink} strokeWidth="0.8" opacity="0.5" />
          {/* Y */}
          <text x="60" y="98" textAnchor="middle"
                fontFamily={SERIF_HEAVY} fontSize="62" fill={PAL.ink}
                fontWeight="400">Y</text>
        </svg>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: SERIF_HEAVY, fontSize: 30,
            letterSpacing: "0.06em", lineHeight: 1, fontWeight: 400
          }}>YELLOWSTONE</div>
          <div style={{
            marginTop: 8,
            fontFamily: SANS, fontSize: 10, letterSpacing: "0.42em",
            textTransform: "uppercase", fontWeight: 500
          }}>Asset Management</div>
        </div>
      </div>
    </Frame>
  );
}

/* ============================================================
   05 · RXR-STYLE BANNER LOCKUP
   Heavy wordmark on a horizontal forest band.
   The whole logo IS the banner — feels permanent, monumental.
============================================================ */
function W05() {
  return (
    <Frame label="05 · Banner lockup" bg={PAL.cream} sub="RXR · Tishman Realty">
      <div style={{ width: 600 }}>
        <div style={{ height: 4, background: PAL.ink, marginBottom: 8 }}></div>
        <div style={{
          background: PAL.ink, color: PAL.cream,
          padding: "26px 40px",
          textAlign: "center"
        }}>
          <div style={{
            fontFamily: SERIF_HEAVY, fontSize: 48,
            letterSpacing: "0.04em", lineHeight: 1, fontWeight: 400
          }}>YELLOWSTONE</div>
        </div>
        <div style={{ height: 1, background: PAL.ink, marginTop: 8 }}></div>
        <div style={{
          textAlign: "center", marginTop: 14,
          fontFamily: SERIF_BODY, fontSize: 22,
          fontStyle: "italic", color: PAL.ink, letterSpacing: "0.02em"
        }}>Asset Management Company</div>
        <div style={{
          textAlign: "center", marginTop: 8,
          fontFamily: SANS, fontSize: 10, letterSpacing: "0.42em",
          textTransform: "uppercase", color: PAL.ink, opacity: 0.6
        }}>Alvin · Texas · Established 2018</div>
      </div>
    </Frame>
  );
}

/* ============================================================
   06 · HINES-STYLE INITIAL + WORDMARK
   Big serif Y in italic ligature beside the heavy wordmark.
   Reads like a luxury hotel / private bank crest.
============================================================ */
function W06() {
  return (
    <Frame label="06 · Italic initial + wordmark" sub="Hines · Mandarin · Aman">
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <div style={{ position: "relative" }}>
          <span style={{
            fontFamily: SERIF_ITALIC, fontSize: 200, lineHeight: 0.85,
            fontStyle: "italic", color: PAL.ink, fontWeight: 400,
            display: "block"
          }}>Y</span>
          <div style={{
            position: "absolute", bottom: 14, right: -6,
            fontFamily: SANS, fontSize: 9, letterSpacing: "0.3em",
            color: PAL.gold, fontWeight: 600
          }}>est. 2018</div>
        </div>
        <div style={{ borderLeft: `1px solid ${PAL.ruleStrong}`, paddingLeft: 28, height: 130, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
          <div style={{
            fontFamily: SERIF_HEAVY, fontSize: 30,
            lineHeight: 1, color: PAL.ink, fontWeight: 400,
            letterSpacing: "0.04em"
          }}>YELLOWSTONE</div>
          <div style={{
            fontFamily: SERIF_BODY, fontSize: 18, fontStyle: "italic",
            color: PAL.ink, letterSpacing: "0.01em", marginTop: 4
          }}>Asset Management</div>
          <div style={{
            width: 50, height: 1, background: PAL.gold, marginTop: 8
          }}></div>
        </div>
      </div>
    </Frame>
  );
}

/* ============================================================
   07 · CHANCERY MONOGRAM SEAL
   Y monogram inside a rectangular border with corner ornaments.
   Feels like a private-equity firm or old-money real estate house.
============================================================ */
function W07() {
  return (
    <Frame label="07 · Chancery seal" sub="Apollo · Carlyle · Lazard">
      <div style={{
        padding: "32px 56px",
        border: `1.5px solid ${PAL.ink}`,
        position: "relative",
        textAlign: "center"
      }}>
        {/* corner ornaments */}
        {[[0, 0],[1, 0],[0, 1],[1, 1]].map(([x, y], i) => (
          <div key={i} style={{
            position: "absolute",
            top: y === 0 ? -4 : "auto", bottom: y === 1 ? -4 : "auto",
            left: x === 0 ? -4 : "auto", right: x === 1 ? -4 : "auto",
            width: 9, height: 9, background: PAL.ink
          }}></div>
        ))}
        <div style={{
          fontFamily: SERIF_ITALIC, fontSize: 80, lineHeight: 0.9,
          fontStyle: "italic", color: PAL.ink, fontWeight: 400
        }}>Y</div>
        <div style={{
          width: 60, height: 1, background: PAL.ruleStrong,
          margin: "16px auto 14px"
        }}></div>
        <div style={{
          fontFamily: SERIF_HEAVY, fontSize: 22,
          letterSpacing: "0.14em", color: PAL.ink, fontWeight: 400
        }}>YELLOWSTONE</div>
        <div style={{
          fontFamily: SANS, fontSize: 10, letterSpacing: "0.36em",
          textTransform: "uppercase", color: PAL.ink, marginTop: 8,
          fontWeight: 500, opacity: 0.7
        }}>Asset Management Co.</div>
      </div>
    </Frame>
  );
}

/* ============================================================
   08 · DOUBLE-RULE LEDGER LOCKUP
   Wordmark sandwiched between thick + thin rules,
   with metadata strip beneath. Reads like a financial document.
============================================================ */
function W08() {
  return (
    <Frame label="08 · Ledger lockup" sub="Goldman Sachs · Morgan Stanley">
      <div style={{ width: 600 }}>
        <div style={{ height: 3, background: PAL.ink }}></div>
        <div style={{ height: 1, background: PAL.ruleStrong, marginTop: 4 }}></div>
        <div style={{
          padding: "32px 0 28px",
          textAlign: "center"
        }}>
          <div style={{
            fontFamily: SERIF_HEAVY, fontSize: 56,
            letterSpacing: "0.04em", lineHeight: 1, fontWeight: 400,
            color: PAL.ink
          }}>YELLOWSTONE</div>
          <div style={{
            fontFamily: SERIF_BODY, fontSize: 24, marginTop: 10,
            fontStyle: "italic", color: PAL.ink, letterSpacing: "0.01em"
          }}>Asset Management</div>
        </div>
        <div style={{ height: 1, background: PAL.ruleStrong }}></div>
        <div style={{ height: 3, background: PAL.ink, marginTop: 4 }}></div>
        <div style={{
          marginTop: 14,
          display: "flex", justifyContent: "space-between",
          fontFamily: SANS, fontSize: 10, letterSpacing: "0.32em",
          textTransform: "uppercase", color: PAL.ink, opacity: 0.7
        }}>
          <span>Real Estate</span>
          <span>Established 2018</span>
          <span>Alvin · Texas</span>
        </div>
      </div>
    </Frame>
  );
}

/* ============================================================
   09 · CIRCULAR HEAVY SEAL
   Bigger, heavier version of the crest — type runs around
   the full circle. Most "old money / institution" feel.
============================================================ */
function W09() {
  return (
    <Frame label="09 · Heavy seal" sub="Coutts · Rolex · old-world banking">
      <svg width="320" height="320" viewBox="0 0 320 320">
        <defs>
          <path id="topArcW" d="M 50 160 A 110 110 0 0 1 270 160" />
          <path id="botArcW" d="M 60 160 A 100 100 0 0 0 260 160" />
        </defs>
        <circle cx="160" cy="160" r="140" fill="none" stroke={PAL.ink} strokeWidth="3" />
        <circle cx="160" cy="160" r="128" fill="none" stroke={PAL.ink} strokeWidth="0.8" opacity="0.5" />
        <circle cx="160" cy="160" r="92" fill="none" stroke={PAL.ink} strokeWidth="1.2" />
        <text fontFamily={SERIF_HEAVY} fontSize="20" letterSpacing="9" fill={PAL.ink} fontWeight="400">
          <textPath href="#topArcW" startOffset="50%" textAnchor="middle">YELLOWSTONE</textPath>
        </text>
        <text fontFamily={SANS} fontSize="11" letterSpacing="8" fill={PAL.ink} fontWeight="600">
          <textPath href="#botArcW" startOffset="50%" textAnchor="middle">ASSET MANAGEMENT · EST 2018</textPath>
        </text>
        {/* ornament dots */}
        <circle cx="50" cy="160" r="3" fill={PAL.ink} />
        <circle cx="270" cy="160" r="3" fill={PAL.ink} />
        {/* center monogram */}
        <text x="160" y="184" textAnchor="middle"
              fontFamily={SERIF_ITALIC} fontSize="92" fill={PAL.ink}
              fontStyle="italic" fontWeight="400">Y</text>
        {/* ornamental flourish */}
        <line x1="120" y1="195" x2="200" y2="195" stroke={PAL.ink} strokeWidth="0.8" opacity="0.5" />
      </svg>
    </Frame>
  );
}

/* ============================================================
   10 · BLACKSTONE-CROWN LOCKUP
   Wordmark with a small ornamental "crown" of geometric forms.
   Says scale + permanence without being literal.
============================================================ */
function W10() {
  return (
    <Frame label="10 · Crowned wordmark" sub="Cushman & Wakefield · Savills">
      <div style={{ textAlign: "center" }}>
        {/* Geometric crown / ornament */}
        <svg width="240" height="44" viewBox="0 0 240 44" style={{ display: "block", margin: "0 auto 20px" }}>
          <line x1="0" y1="22" x2="80" y2="22" stroke={PAL.ink} strokeWidth="1" />
          <line x1="160" y1="22" x2="240" y2="22" stroke={PAL.ink} strokeWidth="1" />
          {/* center geometric mark — three peaks (sub for "Yellowstone") */}
          <path d="M 92 30 L 104 12 L 116 30 Z" fill={PAL.ink} />
          <path d="M 110 30 L 120 8 L 130 30 Z" fill={PAL.ink} />
          <path d="M 124 30 L 136 12 L 148 30 Z" fill={PAL.ink} />
        </svg>
        <div style={{
          fontFamily: SERIF_HEAVY, fontSize: 60,
          letterSpacing: "0.05em", lineHeight: 1, fontWeight: 400,
          color: PAL.ink
        }}>YELLOWSTONE</div>
        <div style={{
          marginTop: 18,
          fontFamily: SANS, fontSize: 11, letterSpacing: "0.5em",
          textTransform: "uppercase", color: PAL.ink, fontWeight: 500
        }}>Asset Management Company</div>
      </div>
    </Frame>
  );
}

/* ============================================================
   Reverse / dark — most heritage option on forest green
============================================================ */
function ReverseSet() {
  return (
    <div style={{
      width: 800, height: 500,
      background: PAL.ink, color: PAL.cream,
      display: "grid", placeItems: "center",
      position: "relative"
    }}>
      <div style={{
        position: "absolute", top: 18, left: 24,
        fontFamily: SANS, fontSize: 10,
        letterSpacing: "0.22em", textTransform: "uppercase",
        opacity: 0.55, fontWeight: 500
      }}>Reverse · forest on cream → cream on forest</div>
      <div style={{ textAlign: "center", maxWidth: 660 }}>
        <div style={{
          fontFamily: SERIF_HEAVY, fontSize: 60,
          letterSpacing: "0.04em", lineHeight: 1,
          color: PAL.cream, fontWeight: 400
        }}>YELLOWSTONE</div>
        <div style={{
          marginTop: 22,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 16
        }}>
          <div style={{ flex: 1, height: 1, background: PAL.cream, opacity: 0.5 }}></div>
          <span style={{
            fontFamily: SANS, fontSize: 11, letterSpacing: "0.5em",
            textTransform: "uppercase", fontWeight: 500
          }}>Asset Management</span>
          <div style={{ flex: 1, height: 1, background: PAL.cream, opacity: 0.5 }}></div>
        </div>
        <div style={{
          marginTop: 18,
          fontFamily: SANS, fontSize: 10, letterSpacing: "0.36em",
          textTransform: "uppercase", opacity: 0.6
        }}>Established 2018 · Alvin, Texas</div>
      </div>
    </div>
  );
}

/* ============================================================
   Application — see how a logo lives in real-world contexts
============================================================ */
function Application() {
  return (
    <div style={{
      width: 800, height: 500,
      background: PAL.paper,
      display: "flex", flexDirection: "column",
      position: "relative", padding: 0
    }}>
      <div style={{
        position: "absolute", top: 18, left: 24,
        fontFamily: SANS, fontSize: 10,
        letterSpacing: "0.22em", textTransform: "uppercase",
        color: PAL.ink, opacity: 0.5, fontWeight: 500, zIndex: 2
      }}>In context · Direction 01 across surfaces</div>

      <div style={{
        flex: 1, display: "grid",
        gridTemplateColumns: "1.3fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: 1, marginTop: 50, background: PAL.rule
      }}>
        {/* Website header */}
        <div style={{ background: PAL.cream, padding: "22px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontFamily: SANS, fontSize: 8, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.5, color: PAL.ink }}>Website header</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: SERIF_HEAVY, fontSize: 22, letterSpacing: "0.04em", color: PAL.ink, lineHeight: 1 }}>YELLOWSTONE</div>
              <div style={{ fontFamily: SANS, fontSize: 7, letterSpacing: "0.36em", textTransform: "uppercase", color: PAL.ink, marginTop: 4, opacity: 0.7 }}>Asset Management</div>
            </div>
            <div style={{ display: "flex", gap: 16, fontFamily: SANS, fontSize: 9, color: PAL.ink, opacity: 0.7 }}>
              <span>Properties</span><span>Apply</span><span>Contact</span>
            </div>
          </div>
        </div>

        {/* Business card */}
        <div style={{ background: PAL.cream, padding: 18, display: "grid", placeItems: "center" }}>
          <div style={{
            width: 200, height: 120, background: PAL.cream,
            border: `1px solid ${PAL.rule}`, padding: 14,
            display: "flex", flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 6px 14px rgba(0,0,0,0.08)"
          }}>
            <div>
              <div style={{ fontFamily: SERIF_HEAVY, fontSize: 14, letterSpacing: "0.05em", color: PAL.ink, lineHeight: 1 }}>YELLOWSTONE</div>
              <div style={{ fontFamily: SANS, fontSize: 5, letterSpacing: "0.36em", textTransform: "uppercase", color: PAL.ink, marginTop: 3, opacity: 0.7 }}>Asset Management</div>
            </div>
            <div style={{ fontFamily: SANS, fontSize: 7, color: PAL.ink, lineHeight: 1.5 }}>
              <strong>Owner Name</strong><br/>
              <span style={{ opacity: 0.7 }}>410 S 2nd · Alvin, TX 77511<br/>(832) 210-3968</span>
            </div>
          </div>
        </div>

        {/* Yard sign */}
        <div style={{ background: PAL.ink, padding: 18, display: "grid", placeItems: "center" }}>
          <div style={{
            background: PAL.cream, padding: "20px 28px",
            textAlign: "center", border: `4px double ${PAL.ink}`
          }}>
            <div style={{ fontFamily: SERIF_HEAVY, fontSize: 26, letterSpacing: "0.04em", color: PAL.ink, lineHeight: 1 }}>YELLOWSTONE</div>
            <div style={{ fontFamily: SANS, fontSize: 8, letterSpacing: "0.4em", textTransform: "uppercase", color: PAL.ink, marginTop: 6, opacity: 0.7 }}>Asset Management</div>
            <div style={{ height: 1, background: PAL.ink, opacity: 0.4, margin: "12px 0" }}></div>
            <div style={{ fontFamily: SERIF_HEAVY, fontSize: 14, color: PAL.ink, fontStyle: "italic" }}>Now Leasing</div>
          </div>
        </div>

        {/* Letterhead */}
        <div style={{ background: PAL.cream, padding: 18, display: "grid", placeItems: "center" }}>
          <div style={{
            width: 180, height: 220, background: "#fff",
            padding: "18px 16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            border: `1px solid ${PAL.rule}`
          }}>
            <div style={{ textAlign: "center", paddingBottom: 10, borderBottom: `1px solid ${PAL.rule}` }}>
              <div style={{ fontFamily: SERIF_HEAVY, fontSize: 14, letterSpacing: "0.05em", color: PAL.ink, lineHeight: 1 }}>YELLOWSTONE</div>
              <div style={{ fontFamily: SANS, fontSize: 5, letterSpacing: "0.36em", textTransform: "uppercase", color: PAL.ink, marginTop: 3, opacity: 0.7 }}>Asset Management</div>
            </div>
            <div style={{ marginTop: 14, fontFamily: SERIF_BODY, fontSize: 7, lineHeight: 1.5, color: "#333" }}>
              <em>May 4, 2026</em><br/><br/>
              Dear Resident,<br/><br/>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua…
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const DC = window.DesignCanvas;
  const DCSection = window.DCSection;
  const DCArtboard = window.DCArtboard;
  if (!DC) return <div style={{padding:40, color: "#fff"}}>Loading canvas…</div>;

  return (
    <DC title="Yellowstone — Institutional Direction" subtitle="Trust, wealth, scale · forest green + cream">
      <DCSection id="primary" title="Heritage marks">
        <DCArtboard id="w1" label="01 · Heritage wordmark" width={800} height={500}><W01 /></DCArtboard>
        <DCArtboard id="w2" label="02 · Block emblem" width={800} height={500}><W02 /></DCArtboard>
        <DCArtboard id="w3" label="03 · Pillared lockup" width={800} height={500}><W03 /></DCArtboard>
        <DCArtboard id="w4" label="04 · Lozenge emblem" width={800} height={500}><W04 /></DCArtboard>
        <DCArtboard id="w5" label="05 · Banner lockup" width={800} height={500}><W05 /></DCArtboard>
        <DCArtboard id="w6" label="06 · Italic initial" width={800} height={500}><W06 /></DCArtboard>
        <DCArtboard id="w7" label="07 · Chancery seal" width={800} height={500}><W07 /></DCArtboard>
        <DCArtboard id="w8" label="08 · Ledger lockup" width={800} height={500}><W08 /></DCArtboard>
        <DCArtboard id="w9" label="09 · Heavy seal" width={800} height={500}><W09 /></DCArtboard>
        <DCArtboard id="w10" label="10 · Crowned wordmark" width={800} height={500}><W10 /></DCArtboard>
      </DCSection>

      <DCSection id="checks" title="Sanity checks">
        <DCArtboard id="reverse" label="Reverse · on forest" width={800} height={500}><ReverseSet /></DCArtboard>
        <DCArtboard id="ctx" label="In context · website / card / sign / letterhead" width={800} height={500}><Application /></DCArtboard>
      </DCSection>
    </DC>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
