/* global React */
const { useState: useStateA } = React;

/* ============================================================
   Online Application, multi-step form
============================================================ */

const PROPERTY_OPTIONS = [
  "Kings Haven Apartments, 410 S 2nd St",
  "Kings Manor Townhomes, 328 S 2nd St",
  "Kings Haven Apartments, 100 S 2nd St",
  "French Quarter Residency, 2550 S Bypass 35",
  "The Royal Oaks Townhomes, 418 S Jackson St",
  "The White House Apartments, 1606 W Sealy St",
  "No preference, recommend one for me"
];

const UNIT_TYPES = [
  "1 Bed · 1 Bath",
  "2 Bed · 1 Bath",
  "2 Bed · 2 Bath",
  "3 Bed · 2 Bath",
  "3 Bed · 2.5 Bath"
];

const REQUIREMENTS = [
  { icon: "ID", label: "Government ID", detail: "Driver's license, state ID, or passport for each adult applicant." },
  { icon: "$", label: "Proof of income", detail: "Last two pay stubs, an offer letter, or last two months of bank statements. We typically look for 3× the monthly rent." },
  { icon: "✦", label: "Application fee", detail: "$40 per adult applicant, payable online or at the office. Non-refundable." },
  { icon: "✓", label: "Rental history", detail: "Names and phone numbers for your last two landlords (if applicable)." },
  { icon: "🐾", label: "Pet info", detail: "Breed, weight, and a photo if you'll be bringing a pet. $300 deposit + $25/month pet rent." }
];

const STEPS = [
  { id: "applicant", label: "About you" },
  { id: "household", label: "Household" },
  { id: "income", label: "Employment & income" },
  { id: "history", label: "Rental history" },
  { id: "preferences", label: "Unit preferences" },
  { id: "review", label: "Review & submit" }
];

function Field({ label, children, required, span, p }) {
  return (
    <label style={{
      display: "flex", flexDirection: "column", gap: 8,
      gridColumn: span ? `span ${span}` : "auto"
    }}>
      <span style={{
        fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
        color: p.inkSoft, fontWeight: 600
      }}>
        {label}{required && <span style={{ color: p.accent, marginLeft: 4 }}>*</span>}
      </span>
      {children}
    </label>
  );
}

function txt(p) {
  return {
    padding: "12px 14px",
    fontSize: 15,
    background: p.bg,
    border: `1px solid ${p.line}`,
    borderRadius: 4,
    color: p.ink,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 160ms ease, box-shadow 160ms ease",
    width: "100%"
  };
}

function Apply({ p, displayFont }) {
  const [step, setStep] = useStateA(0);
  const [submitted, setSubmitted] = useStateA(false);
  const [data, setData] = useStateA({
    firstName: "", lastName: "", email: "", phone: "", dob: "",
    currentAddress: "",
    coApplicants: "0", pets: "no", petDesc: "", vehicles: "1",
    employer: "", jobTitle: "", income: "", employedSince: "",
    prevLandlord: "", prevLandlordPhone: "", reasonLeaving: "",
    property: "", unitType: "", moveIn: "", budget: "", notes: "",
    consent: false
  });
  const update = (k, v) => setData(d => ({ ...d, [k]: v }));

  const canAdvance = () => {
    if (step === 0) return data.firstName && data.lastName && data.email && data.phone;
    if (step === 4) return data.property && data.unitType && data.moveIn;
    if (step === 5) return data.consent;
    return true;
  };

  if (submitted) {
    return (
      <section id="apply" className="ys-reveal" style={{
        padding: "var(--pad-x-lg) var(--pad-x)",
        background: p.primary, color: p.paper,
        borderTop: `1px solid ${p.line}`
      }}
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: p.accent, color: p.paper,
            display: "grid", placeItems: "center", margin: "0 auto",
            fontSize: 28
          }}>✓</div>
          <h2 style={{
            fontFamily: `'${displayFont}', serif`,
            fontSize: "clamp(40px, 5.5vw, 72px)", lineHeight: 1.02,
            margin: "32px 0 0", fontWeight: 400, letterSpacing: "-0.02em"
          }}>
            Application received.
          </h2>
          <p style={{
            fontSize: 18, lineHeight: 1.6,
            color: `color-mix(in oklab, ${p.paper} 80%, transparent)`,
            marginTop: 20
          }}>
            Thanks, {data.firstName || "there"}. A confirmation will hit <strong>{data.email || "your inbox"}</strong> within an hour, and someone from the leasing office will follow up by phone within one business day.
          </p>
          <div style={{
            marginTop: 40, display: "inline-flex", gap: 14, flexWrap: "wrap", justifyContent: "center"
          }}>
            <a href="tel:8322103968" style={{
              padding: "14px 24px", background: p.paper, color: p.primary,
              textDecoration: "none", fontWeight: 600, fontSize: 14, borderRadius: 4
            }}>Call (832) 210-3968</a>
            <a href="mailto:office@yellowstone-am.com" style={{
              padding: "14px 24px", background: "transparent", color: p.paper,
              textDecoration: "none", fontWeight: 600, fontSize: 14,
              border: `1px solid ${p.paper}`, borderRadius: 4
            }}>office@yellowstone-am.com</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="ys-reveal" style={{
      padding: "var(--pad-x-lg) var(--pad-x)",
      background: p.bg,
      borderTop: `1px solid ${p.line}`
    }}
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="ys-section-head" style={{
          display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60,
          alignItems: "start", marginBottom: 56
        }}>
          <div style={{
            fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase",
            color: p.accent, fontWeight: 600, paddingTop: 14
          }}>Apply online · 5 minutes</div>
          <div>
            <h2 style={{
              fontFamily: `'${displayFont}', serif`,
              fontSize: "clamp(36px, 4.6vw, 60px)",
              lineHeight: 1.1, letterSpacing: "-0.02em",
              margin: 0, color: p.ink, fontWeight: 400, maxWidth: "16ch"
            }}>Start your application from anywhere.</h2>
            <p style={{
              fontSize: 17, lineHeight: 1.6, color: p.inkSoft,
              maxWidth: "55ch", marginTop: 28
            }}>Most applications are decided within 48 hours. Have an ID and a recent pay stub handy, that's it.</p>
          </div>
        </div>

        {/* Requirements row */}
        <div className="ys-req-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 1,
          background: p.line,
          border: `1px solid ${p.line}`,
          marginBottom: 56
        }}>
          {REQUIREMENTS.map((r, i) => (
            <div key={i} style={{
              background: p.paper, padding: 20,
              display: "flex", flexDirection: "column", gap: 8
            }}>
              <div style={{
                width: 36, height: 36,
                background: p.bg, color: p.primary,
                display: "grid", placeItems: "center",
                borderRadius: 4, fontSize: 14, fontWeight: 600,
                fontFamily: r.icon === "🐾" ? "inherit" : "'JetBrains Mono', monospace"
              }}>{r.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: p.ink }}>{r.label}</div>
              <div style={{ fontSize: 12, lineHeight: 1.5, color: p.inkSoft }}>{r.detail}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="ys-apply-grid" style={{
          display: "grid", gridTemplateColumns: "240px 1fr", gap: 48
        }}>
          {/* Stepper */}
          <div className="ys-apply-stepper">
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <button key={s.id}
                  onClick={() => i < step && setStep(i)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 0",
                    background: "transparent", border: "none",
                    borderBottom: `1px solid ${p.line}`,
                    cursor: i <= step ? "pointer" : "default",
                    fontFamily: "inherit", textAlign: "left",
                    width: "100%",
                    opacity: active ? 1 : (done ? 0.85 : 0.45)
                  }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: active ? p.ink : (done ? p.accent : "transparent"),
                    color: active || done ? p.paper : p.inkSoft,
                    border: active || done ? "none" : `1px solid ${p.line}`,
                    display: "grid", placeItems: "center",
                    fontSize: 12, fontWeight: 600, flexShrink: 0,
                    fontFamily: "'JetBrains Mono', monospace"
                  }}>{done ? "✓" : i + 1}</span>
                  <span style={{
                    fontSize: 13, fontWeight: active ? 600 : 500,
                    color: p.ink
                  }}>{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form panel */}
          <div style={{
            background: p.paper,
            border: `1px solid ${p.line}`,
            padding: "40px 44px",
            minHeight: 480,
            display: "flex", flexDirection: "column"
          }}>
            <div style={{
              fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
              color: p.accent, fontWeight: 600
            }}>Step {step + 1} of {STEPS.length}</div>
            <h3 style={{
              fontFamily: `'${displayFont}', serif`,
              fontSize: 36, fontWeight: 400, letterSpacing: "-0.01em",
              lineHeight: 1.05, margin: "8px 0 32px"
            }}>{STEPS[step].label}</h3>

            <div style={{ flex: 1 }}>
              {step === 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="ys-form-grid">
                  <Field label="First name" required p={p}>
                    <input style={txt(p)} value={data.firstName} onChange={e => update("firstName", e.target.value)} />
                  </Field>
                  <Field label="Last name" required p={p}>
                    <input style={txt(p)} value={data.lastName} onChange={e => update("lastName", e.target.value)} />
                  </Field>
                  <Field label="Email" required p={p}>
                    <input type="email" style={txt(p)} value={data.email} onChange={e => update("email", e.target.value)} />
                  </Field>
                  <Field label="Phone" required p={p}>
                    <input type="tel" style={txt(p)} value={data.phone} onChange={e => update("phone", e.target.value)} placeholder="(___) ___-____" />
                  </Field>
                  <Field label="Date of birth" p={p}>
                    <input type="date" style={txt(p)} value={data.dob} onChange={e => update("dob", e.target.value)} />
                  </Field>
                  <Field label="Current address" span={2} p={p}>
                    <input style={txt(p)} value={data.currentAddress} onChange={e => update("currentAddress", e.target.value)} placeholder="Street, city, state, zip" />
                  </Field>
                </div>
              )}

              {step === 1 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="ys-form-grid">
                  <Field label="Co-applicants (18+)" p={p}>
                    <select style={txt(p)} value={data.coApplicants} onChange={e => update("coApplicants", e.target.value)}>
                      {["0","1","2","3","4+"].map(n => <option key={n}>{n}</option>)}
                    </select>
                  </Field>
                  <Field label="Vehicles" p={p}>
                    <select style={txt(p)} value={data.vehicles} onChange={e => update("vehicles", e.target.value)}>
                      {["0","1","2","3+"].map(n => <option key={n}>{n}</option>)}
                    </select>
                  </Field>
                  <Field label="Pets" span={2} p={p}>
                    <div style={{ display: "flex", gap: 8 }}>
                      {["no", "cat", "dog", "both"].map(v => (
                        <button key={v} type="button" onClick={() => update("pets", v)} style={{
                          padding: "10px 16px", flex: 1,
                          background: data.pets === v ? p.ink : "transparent",
                          color: data.pets === v ? p.paper : p.ink,
                          border: `1px solid ${data.pets === v ? p.ink : p.line}`,
                          borderRadius: 4, fontSize: 13, fontWeight: 500,
                          cursor: "pointer", fontFamily: "inherit",
                          textTransform: "capitalize",
                          transition: "background 160ms ease, color 160ms ease, border-color 160ms ease, transform 160ms ease"
                        }}
                        onMouseOver={(e) => { if (data.pets !== v) e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>{v === "no" ? "No pets" : v}</button>
                      ))}
                    </div>
                  </Field>
                  {data.pets !== "no" && (
                    <Field label="Pet details (breed, weight, age)" span={2} p={p}>
                      <input style={txt(p)} value={data.petDesc} onChange={e => update("petDesc", e.target.value)} placeholder="e.g. Labrador, 65 lbs, 4 years" />
                    </Field>
                  )}
                </div>
              )}

              {step === 2 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="ys-form-grid">
                  <Field label="Employer" required p={p} span={2}>
                    <input style={txt(p)} value={data.employer} onChange={e => update("employer", e.target.value)} />
                  </Field>
                  <Field label="Job title" p={p}>
                    <input style={txt(p)} value={data.jobTitle} onChange={e => update("jobTitle", e.target.value)} />
                  </Field>
                  <Field label="Employed since" p={p}>
                    <input type="month" style={txt(p)} value={data.employedSince} onChange={e => update("employedSince", e.target.value)} />
                  </Field>
                  <Field label="Gross monthly income" required span={2} p={p}>
                    <div style={{ position: "relative" }}>
                      <span style={{
                        position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                        color: p.inkSoft, fontSize: 15
                      }}>$</span>
                      <input style={{ ...txt(p), paddingLeft: 28, width: "100%" }} value={data.income} onChange={e => update("income", e.target.value)} placeholder="3,500" />
                    </div>
                  </Field>
                </div>
              )}

              {step === 3 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="ys-form-grid">
                  <Field label="Previous landlord (name)" p={p}>
                    <input style={txt(p)} value={data.prevLandlord} onChange={e => update("prevLandlord", e.target.value)} />
                  </Field>
                  <Field label="Landlord phone" p={p}>
                    <input type="tel" style={txt(p)} value={data.prevLandlordPhone} onChange={e => update("prevLandlordPhone", e.target.value)} />
                  </Field>
                  <Field label="Reason for leaving" span={2} p={p}>
                    <textarea rows={3} style={{ ...txt(p), resize: "vertical", fontFamily: "inherit" }} value={data.reasonLeaving} onChange={e => update("reasonLeaving", e.target.value)} />
                  </Field>
                  <div style={{
                    gridColumn: "1 / -1",
                    fontSize: 13, color: p.inkSoft, lineHeight: 1.5,
                    padding: 14, background: p.bg, border: `1px solid ${p.line}`, borderRadius: 4
                  }}>
                    First-time renter? Leave these blank, we'll discuss your situation when we follow up.
                  </div>
                </div>
              )}

              {step === 4 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="ys-form-grid">
                  <Field label="Preferred property" required span={2} p={p}>
                    <select style={txt(p)} value={data.property} onChange={e => update("property", e.target.value)}>
                      <option value="">Choose a property…</option>
                      {PROPERTY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </Field>
                  <Field label="Unit type" required p={p}>
                    <select style={txt(p)} value={data.unitType} onChange={e => update("unitType", e.target.value)}>
                      <option value="">Select…</option>
                      {UNIT_TYPES.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </Field>
                  <Field label="Earliest move-in" required p={p}>
                    <input type="date" style={txt(p)} value={data.moveIn} onChange={e => update("moveIn", e.target.value)} />
                  </Field>
                  <Field label="Monthly budget" p={p}>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: p.inkSoft, fontSize: 15 }}>$</span>
                      <input style={{ ...txt(p), paddingLeft: 28, width: "100%" }} value={data.budget} onChange={e => update("budget", e.target.value)} placeholder="1,200" />
                    </div>
                  </Field>
                  <Field label="Anything else we should know?" span={2} p={p}>
                    <textarea rows={3} style={{ ...txt(p), resize: "vertical", fontFamily: "inherit" }} value={data.notes} onChange={e => update("notes", e.target.value)} />
                  </Field>
                </div>
              )}

              {step === 5 && (
                <div>
                  <div style={{
                    background: p.bg, border: `1px solid ${p.line}`,
                    padding: 24, borderRadius: 4, marginBottom: 24
                  }}>
                    <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: p.inkSoft, fontWeight: 600, marginBottom: 12 }}>Summary</div>
                    <dl style={{
                      display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 24px",
                      margin: 0, fontSize: 14
                    }}>
                      {[
                        ["Applicant", `${data.firstName || ", "} ${data.lastName || ""}`.trim()],
                        ["Contact", data.email && data.phone ? `${data.email} · ${data.phone}` : ", "],
                        ["Pets", data.pets === "no" ? "None" : (data.petDesc || data.pets)],
                        ["Income", data.income ? `$${data.income}/mo` : ", "],
                        ["Property", data.property || ", "],
                        ["Unit type", data.unitType || ", "],
                        ["Move-in", data.moveIn || ", "]
                      ].map(([k, v]) => (
                        <React.Fragment key={k}>
                          <dt style={{ color: p.inkSoft, fontWeight: 500 }}>{k}</dt>
                          <dd style={{ margin: 0, color: p.ink }}>{v}</dd>
                        </React.Fragment>
                      ))}
                    </dl>
                  </div>
                  <label style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    padding: 16, border: `1px solid ${p.line}`, borderRadius: 4,
                    cursor: "pointer", background: data.consent ? p.bg : "transparent"
                  }}>
                    <input type="checkbox" checked={data.consent} onChange={e => update("consent", e.target.checked)} style={{ marginTop: 2, accentColor: p.primary }} />
                    <span style={{ fontSize: 13, color: p.inkSoft, lineHeight: 1.55 }}>
                      I authorize Yellowstone Asset Management to verify the information above, including credit history, rental history, employment, and background. I understand the $40 application fee is non-refundable. Equal Housing Opportunity.
                    </span>
                  </label>
                </div>
              )}
            </div>

            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginTop: 32, paddingTop: 24, borderTop: `1px solid ${p.line}`
            }}>
              <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{
                padding: "12px 20px", background: "transparent",
                border: `1px solid ${step === 0 ? p.line : p.ink}`,
                color: step === 0 ? p.inkSoft : p.ink,
                fontSize: 14, fontWeight: 500, borderRadius: 4,
                cursor: step === 0 ? "default" : "pointer",
                fontFamily: "inherit",
                transition: "background 160ms ease, color 160ms ease, border-color 160ms ease, transform 160ms ease"
              }}
              onMouseOver={(e) => { if (step !== 0) { e.currentTarget.style.background = p.ink; e.currentTarget.style.color = p.paper; e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = step === 0 ? p.inkSoft : p.ink; e.currentTarget.style.transform = "translateY(0)"; }}>← Back</button>
              {step < STEPS.length - 1 ? (
                <button onClick={() => canAdvance() && setStep(s => s + 1)} disabled={!canAdvance()} style={{
                  padding: "12px 24px",
                  background: canAdvance() ? p.primary : p.line,
                  color: p.paper, fontSize: 14, fontWeight: 600,
                  border: "none", borderRadius: 4,
                  cursor: canAdvance() ? "pointer" : "default",
                  fontFamily: "inherit",
                  transition: "background 160ms ease, transform 160ms ease, box-shadow 160ms ease",
                  boxShadow: canAdvance() ? `0 4px 12px -4px color-mix(in oklab, ${p.primary} 40%, transparent)` : "none"
                }}
                onMouseOver={(e) => { if (canAdvance()) { e.currentTarget.style.background = p.primarySoft; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                onMouseOut={(e) => { e.currentTarget.style.background = canAdvance() ? p.primary : p.line; e.currentTarget.style.transform = "translateY(0)"; }}>Continue →</button>
              ) : (
                <button onClick={() => canAdvance() && setSubmitted(true)} disabled={!canAdvance()} style={{
                  padding: "14px 28px",
                  background: canAdvance() ? p.accent : p.line,
                  color: p.paper, fontSize: 14, fontWeight: 600,
                  border: "none", borderRadius: 4,
                  cursor: canAdvance() ? "pointer" : "default",
                  fontFamily: "inherit",
                  transition: "background 160ms ease, transform 160ms ease, box-shadow 160ms ease",
                  boxShadow: canAdvance() ? `0 4px 12px -4px color-mix(in oklab, ${p.accent} 40%, transparent)` : "none"
                }}
                onMouseOver={(e) => { if (canAdvance()) { e.currentTarget.style.background = p.primarySoft; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                onMouseOut={(e) => { e.currentTarget.style.background = canAdvance() ? p.accent : p.line; e.currentTarget.style.transform = "translateY(0)"; }}>Submit application</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Apply = Apply;
