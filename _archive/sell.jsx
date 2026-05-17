/* global React */
const { useState: useStateP } = React;

/* ============================================================
   Sell-your-property section + Apply CTA section
============================================================ */

function SellProperty({ p, displayFont }) {
  const [form, setForm] = useStateP({
    name: "", phone: "", email: "",
    addr: "", type: "Single-family",
    beds: "", baths: "", sqft: "",
    timeline: "Just exploring", notes: ""
  });
  const [sent, setSent] = useStateP(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    // wire to your inbox or backend; for now we mailto: a structured message
    const subject = `Property inquiry, ${form.addr || "(address pending)"}`;
    const body =
`Name: ${form.name}
Phone: ${form.phone}
Email: ${form.email}

Property address: ${form.addr}
Property type: ${form.type}
Beds / Baths: ${form.beds} / ${form.baths}
Approx. sq ft: ${form.sqft}
Timeline to sell: ${form.timeline}

Notes:
${form.notes}`;
    window.location.href = `mailto:office@yellowstone-am.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const fieldStyle = {
    width: "100%", padding: "12px 14px",
    background: p.bg, border: `1px solid ${p.line}`,
    color: p.ink, fontSize: 15,
    fontFamily: "inherit",
    borderRadius: 4, outline: "none",
    transition: "border-color 160ms ease, box-shadow 160ms ease"
  };
  const labelStyle = {
    fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
    color: p.inkSoft, fontWeight: 500, marginBottom: 8, display: "block"
  };

  return (
    <section id="sell" className="ys-reveal" style={{
      padding: "var(--pad-x-lg) var(--pad-x)",
      borderTop: `1px solid ${p.line}`,
      background: p.ink, color: p.paper
    }}
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="ys-sell-grid" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start"
        }}>
          {/* Left, pitch */}
          <div>
            <div style={{
              fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase",
              color: p.accent, fontWeight: 600, marginBottom: 24,
              display: "flex", alignItems: "center", gap: 10
            }}>
              <span style={{ width: 32, height: 1, background: p.accent }}></span>
              For property owners
            </div>
            <h2 style={{
              fontFamily: `'${displayFont}', serif`,
              fontSize: "clamp(40px, 6vw, 88px)",
              lineHeight: 0.98, letterSpacing: "-0.02em",
              margin: 0, fontWeight: 400,
              color: p.paper
            }}>
              Skip the agent. <em style={{ color: p.accent }}>Sell direct.</em>
            </h2>
            <p style={{
              fontSize: 18, lineHeight: 1.55,
              color: `color-mix(in oklab, ${p.paper} 80%, transparent)`,
              maxWidth: "50ch", marginTop: 28
            }}>
              Yellowstone is actively buying single-family homes, duplexes, and small multifamily properties in Alvin and the surrounding area. We pay fair market value, close on your timeline, and cut the broker out, so you keep the commission.
            </p>

            <div style={{
              marginTop: 40,
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24
            }}>
              {[
                ["No commissions", "Sell directly to us, no 6% fee, no listing agent."],
                ["Honest offer", "We make one fair, transparent offer. No bait-and-switch."],
                ["Close on your terms", "30 days, 90 days, or whenever works, your call."]
              ].map(([t, d], i) => (
                <div key={i} style={{
                  paddingTop: 18,
                  borderTop: `1px solid color-mix(in oklab, ${p.paper} 25%, transparent)`
                }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, color: p.accent, fontWeight: 600,
                    letterSpacing: "0.1em", marginBottom: 10
                  }}>0{i + 1}</div>
                  <div style={{
                    fontFamily: `'${displayFont}', serif`,
                    fontSize: 22, lineHeight: 1.1, color: p.paper,
                    fontWeight: 400, letterSpacing: "-0.01em"
                  }}>{t}</div>
                  <div style={{
                    fontSize: 13, lineHeight: 1.55,
                    color: `color-mix(in oklab, ${p.paper} 65%, transparent)`,
                    marginTop: 8
                  }}>{d}</div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 40, padding: 24,
              background: `color-mix(in oklab, ${p.paper} 6%, transparent)`,
              border: `1px solid color-mix(in oklab, ${p.paper} 18%, transparent)`,
              display: "flex", gap: 16, alignItems: "center"
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: p.accent, color: p.paper,
                display: "grid", placeItems: "center",
                fontFamily: `'${displayFont}', serif`, fontSize: 22,
                flexShrink: 0
              }}>★</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: p.paper }}>
                  Prefer to talk first?
                </div>
                <div style={{
                  fontSize: 13,
                  color: `color-mix(in oklab, ${p.paper} 70%, transparent)`,
                  marginTop: 2
                }}>
                  Call <a href="tel:8322103968" style={{ color: p.accent, textDecoration: "none", fontWeight: 600 }}>(832) 210-3968</a>, no obligation, no pressure.
                </div>
              </div>
            </div>
          </div>

          {/* Right, form */}
          <div style={{
            background: p.paper, color: p.ink,
            padding: 36,
            borderRadius: 2,
            border: `1px solid color-mix(in oklab, ${p.paper} 30%, transparent)`
          }}>
            {sent ? (
              <div style={{ padding: "40px 0", textAlign: "center" }}>
                <div style={{
                  fontFamily: `'${displayFont}', serif`,
                  fontSize: 36, color: p.primary, lineHeight: 1.05,
                  marginBottom: 16
                }}>Thanks, we'll be in touch.</div>
                <p style={{ fontSize: 15, color: p.inkSoft, lineHeight: 1.6, maxWidth: "32ch", margin: "0 auto" }}>
                  Your email client should have opened with the details. We typically respond within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div style={{
                  fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
                  color: p.accent, fontWeight: 600, marginBottom: 8
                }}>Step 1 of 1 · ~60 seconds</div>
                <h3 style={{
                  fontFamily: `'${displayFont}', serif`,
                  fontSize: 32, fontWeight: 400, letterSpacing: "-0.01em",
                  margin: 0, color: p.ink, lineHeight: 1.05
                }}>Tell us about your property.</h3>

                {/* Contact row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 24 }}>
                  <div>
                    <label style={labelStyle}>Your name</label>
                    <input required style={fieldStyle} value={form.name} onChange={e => update("name", e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input required type="tel" style={fieldStyle} value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="(___) ___-____" />
                  </div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={labelStyle}>Email</label>
                  <input required type="email" style={fieldStyle} value={form.email} onChange={e => update("email", e.target.value)} />
                </div>

                {/* Property */}
                <div style={{
                  marginTop: 28, paddingTop: 20,
                  borderTop: `1px solid ${p.line}`
                }}>
                  <label style={labelStyle}>Property address</label>
                  <input required style={fieldStyle} value={form.addr} onChange={e => update("addr", e.target.value)} placeholder="Street, city, ZIP" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
                  <div>
                    <label style={labelStyle}>Property type</label>
                    <select style={fieldStyle} value={form.type} onChange={e => update("type", e.target.value)}>
                      <option>Single-family</option>
                      <option>Duplex</option>
                      <option>Triplex / Fourplex</option>
                      <option>Small multifamily (5+)</option>
                      <option>Townhome / Condo</option>
                      <option>Land / Lot</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Timeline</label>
                    <select style={fieldStyle} value={form.timeline} onChange={e => update("timeline", e.target.value)}>
                      <option>Just exploring</option>
                      <option>Within 30 days</option>
                      <option>1–3 months</option>
                      <option>3–6 months</option>
                      <option>6+ months</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 14 }}>
                  <div>
                    <label style={labelStyle}>Beds</label>
                    <input style={fieldStyle} value={form.beds} onChange={e => update("beds", e.target.value)} placeholder="3" />
                  </div>
                  <div>
                    <label style={labelStyle}>Baths</label>
                    <input style={fieldStyle} value={form.baths} onChange={e => update("baths", e.target.value)} placeholder="2" />
                  </div>
                  <div>
                    <label style={labelStyle}>Sq ft</label>
                    <input style={fieldStyle} value={form.sqft} onChange={e => update("sqft", e.target.value)} placeholder="1,500" />
                  </div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={labelStyle}>Anything else? <span style={{ textTransform: "none", letterSpacing: 0, color: p.inkSoft }}>(Optional)</span></label>
                  <textarea rows={3} style={{ ...fieldStyle, resize: "vertical", minHeight: 80 }} value={form.notes} onChange={e => update("notes", e.target.value)} placeholder="Condition, occupancy, why you're selling…" />
                </div>

                <button type="submit" style={{
                  marginTop: 28, width: "100%",
                  padding: "16px 24px",
                  background: p.primary, color: p.paper,
                  border: "none", fontSize: 15, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                  letterSpacing: "0.01em", borderRadius: 4,
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
                  transition: "background 180ms ease, transform 180ms ease, box-shadow 180ms ease",
                  boxShadow: `0 4px 14px -4px color-mix(in oklab, ${p.primary} 35%, transparent)`
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = p.primarySoft; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = p.primary; e.currentTarget.style.transform = "translateY(0)"; }}
                  Send my property info
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
                <p style={{ fontSize: 12, color: p.inkSoft, marginTop: 14, lineHeight: 1.5, textAlign: "center" }}>
                  We'll review and reach out within one business day. No spam, no listing pressure.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

window.SellProperty = SellProperty;
