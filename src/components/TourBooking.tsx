'use client';

import { useState, useEffect, useMemo } from 'react';

const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function nextDays(count = 14) {
  const out: Date[] = [];
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (out.length < count) {
    if (d.getDay() !== 0) {
      out.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function formatDate(d: Date) {
  return `${DAY_LABELS[d.getDay()]}, ${MONTH_LABELS[d.getMonth()]} ${d.getDate()}`;
}
function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const BOOKING_PROPERTIES = [
  { id: 'kings-haven', name: 'Kings Haven', addr: '410 S 2nd St', bed: '2BR · 1BA', price: '$925' },
  { id: 'kings-manor', name: 'Kings Manor', addr: '328 S 2nd St', bed: '3BR · 2.5BA', price: '$1,595' },
  { id: 'kings-haven-100', name: 'Kings Haven (100)', addr: '100 S 2nd St', bed: '1BR · 1BA', price: '$850' },
  { id: 'french-quarter', name: 'French Quarter', addr: '2550 S Bypass 35', bed: '2BR · 1BA', price: '$950' },
  { id: 'royal-oaks', name: 'Royal Oaks', addr: '418 S Jackson', bed: '2BR · 2BA', price: '$1,395' },
  { id: 'white-house', name: 'White House', addr: '1606 W Sealy', bed: '2BR · 1BA', price: '$925' },
  { id: 'any', name: "I'm not sure yet", addr: "We'll show you a few options", bed: 'Mixed', price: '—' },
];

export default function TourBooking({
  open,
  onClose,
  p,
  displayFont,
  initialPropertyId,
}: {
  open: boolean;
  onClose: () => void;
  p: typeof import('@/lib/data').PALETTES.forest;
  displayFont: string;
  initialPropertyId?: string;
}) {
  const [step, setStep] = useState(1);
  const [propId, setPropId] = useState(initialPropertyId || '');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [moveBy, setMoveBy] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const days = useMemo(() => nextDays(14), []);

  useEffect(() => {
    if (open) {
      setStep(1);
      setSubmitted(false);
      setError('');
      setDate(null);
      setTime('');
      setName('');
      setPhone('');
      setEmail('');
      setMoveBy('');
      setNotes('');
      setPropId(initialPropertyId || '');
    }
  }, [open, initialPropertyId]);

  useEffect(() => {
    if (open) {
      document.body.classList.add('modal-open');
      return () => document.body.classList.remove('modal-open');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const selectedProp = BOOKING_PROPERTIES.find((b) => b.id === propId);
  const canNext1 = !!propId;
  const canNext2 = !!date && !!time;
  const canSubmit = !!name && (!!phone || !!email);

  async function handleSubmit() {
    if (!selectedProp || !date || !time) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'tour',
          property: selectedProp.name,
          date: isoDate(date),
          time,
          name,
          phone,
          email,
          moveBy,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError('Network error. Please try again or call us.');
      setSubmitting(false);
    }
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(26,24,21,0.6)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '60px 20px 20px',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Schedule a tour"
    >
      <div
        style={{
          background: p.paper,
          width: '100%',
          maxWidth: 720,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 30px 80px rgba(26,24,21,0.4)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: `1px solid ${p.line}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: p.paper,
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: p.accent,
                fontWeight: 600,
              }}
            >
              {submitted ? 'Request sent' : `Step ${step} of 3`}
            </div>
            <div
              style={{
                fontFamily: `'${displayFont}', serif`,
                fontSize: 26,
                color: p.ink,
                marginTop: 4,
                fontWeight: 400,
              }}
            >
              {submitted
                ? 'Tour request submitted'
                : step === 1
                ? 'Pick a property'
                : step === 2
                ? 'Pick a date & time'
                : 'How do we reach you?'}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: p.ink,
              padding: 8,
              fontSize: 20,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        {!submitted && (
          <div style={{ height: 3, background: p.line, position: 'relative', flexShrink: 0 }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                right: 'auto',
                width: `${(step / 3) * 100}%`,
                background: p.primary,
                transition: 'width 280ms ease',
              }}
            />
          </div>
        )}

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 28,
            background: p.paper,
          }}
        >
          {submitted && (
            <div style={{ textAlign: 'center', padding: '20px 0 40px' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: p.primary,
                  color: p.paper,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 32,
                  margin: '0 auto 24px',
                }}
              >
                ✓
              </div>
              <h3
                style={{
                  fontFamily: `'${displayFont}', serif`,
                  fontSize: 28,
                  fontWeight: 400,
                  margin: '0 0 16px',
                  color: p.ink,
                }}
              >
                We&apos;ll be in touch within 24 hours.
              </h3>
              <p style={{ color: p.inkSoft, maxWidth: '44ch', margin: '0 auto', lineHeight: 1.55 }}>
                A confirmation email has been queued. We respond same-day on weekdays before 4pm; otherwise the next
                morning.
              </p>
              <div
                style={{
                  marginTop: 28,
                  padding: 20,
                  background: p.bg,
                  border: `1px solid ${p.line}`,
                  textAlign: 'left',
                  fontSize: 14,
                  color: p.inkSoft,
                }}
              >
                <strong style={{ color: p.ink }}>{selectedProp?.name}</strong> · {selectedProp?.addr}
                <br />
                <strong style={{ color: p.ink }}>{date && formatDate(date)}</strong> at{' '}
                <strong style={{ color: p.ink }}>{time}</strong>
              </div>
              <button
                onClick={onClose}
                style={{
                  marginTop: 24,
                  padding: '12px 24px',
                  background: p.ink,
                  color: p.paper,
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Close
              </button>
            </div>
          )}

          {!submitted && step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {BOOKING_PROPERTIES.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setPropId(b.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap: 16,
                    alignItems: 'center',
                    padding: '16px 20px',
                    background: propId === b.id ? p.bg : 'transparent',
                    border: `1px solid ${propId === b.id ? p.primary : p.line}`,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    transition: 'all 160ms ease',
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: `2px solid ${propId === b.id ? p.primary : p.line}`,
                      background: propId === b.id ? p.primary : 'transparent',
                      flex: 'none',
                      boxShadow: propId === b.id ? `inset 0 0 0 3px ${p.paper}` : 'none',
                      transition: 'all 160ms ease',
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: `'${displayFont}', serif`,
                        fontSize: 19,
                        color: p.ink,
                        lineHeight: 1.2,
                      }}
                    >
                      {b.name}
                    </div>
                    <div style={{ fontSize: 12, color: p.inkSoft, marginTop: 2 }}>
                      {b.addr} · {b.bed}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: `'${displayFont}', serif`,
                      fontSize: 18,
                      color: p.primary,
                      fontStyle: 'italic',
                    }}
                  >
                    {b.price}
                  </div>
                </button>
              ))}
            </div>
          )}

          {!submitted && step === 2 && (
            <div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: p.inkSoft,
                  marginBottom: 12,
                  fontWeight: 600,
                }}
              >
                Choose a date
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(108px, 1fr))',
                  gap: 8,
                  marginBottom: 28,
                }}
              >
                {days.map((d) => {
                  const sel = date && isoDate(d) === isoDate(date);
                  return (
                    <button
                      key={isoDate(d)}
                      onClick={() => setDate(d)}
                      style={{
                        padding: '12px 8px',
                        background: sel ? p.primary : 'transparent',
                        color: sel ? p.paper : p.ink,
                        border: `1px solid ${sel ? p.primary : p.line}`,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        alignItems: 'center',
                        transition: 'all 140ms ease',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          opacity: 0.7,
                        }}
                      >
                        {DAY_LABELS[d.getDay()]}
                      </span>
                      <span style={{ fontFamily: `'${displayFont}', serif`, fontSize: 22, lineHeight: 1 }}>
                        {d.getDate()}
                      </span>
                      <span style={{ fontSize: 10, opacity: 0.7 }}>{MONTH_LABELS[d.getMonth()]}</span>
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: p.inkSoft,
                  marginBottom: 12,
                  fontWeight: 600,
                }}
              >
                Choose a time
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                  gap: 8,
                }}
              >
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    style={{
                      padding: '12px 8px',
                      background: time === t ? p.primary : 'transparent',
                      color: time === t ? p.paper : p.ink,
                      border: `1px solid ${time === t ? p.primary : p.line}`,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: 14,
                      transition: 'all 140ms ease',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!submitted && step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="Your name *" value={name} onChange={setName} placeholder="Maria Garcia" p={p} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="ys-book-row">
                <Field label="Phone" value={phone} onChange={setPhone} placeholder="(832) 210-3968" type="tel" p={p} />
                <Field label="Email" value={email} onChange={setEmail} placeholder="you@email.com" type="email" p={p} />
              </div>
              <div style={{ fontSize: 11, color: p.inkSoft, marginTop: -8 }}>
                Phone or email — at least one so we can confirm.
              </div>
              <Field
                label="Looking to move by"
                value={moveBy}
                onChange={setMoveBy}
                placeholder="June 1, ASAP, flexible…"
                p={p}
              />
              <Field
                label="Anything else we should know?"
                value={notes}
                onChange={setNotes}
                placeholder="Pets, parking needs, must-haves…"
                textarea
                p={p}
              />

              {error && (
                <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: 13, borderRadius: 4 }}>
                  {error}
                </div>
              )}

              <div
                style={{
                  marginTop: 8,
                  padding: 14,
                  background: p.bg,
                  border: `1px solid ${p.line}`,
                  fontSize: 13,
                  color: p.inkSoft,
                  lineHeight: 1.55,
                }}
              >
                <strong style={{ color: p.ink }}>{selectedProp?.name}</strong> · {date && formatDate(date)} at {time}
              </div>
            </div>
          )}
        </div>

        {/* Footer / nav */}
        {!submitted && (
          <div
            style={{
              padding: '16px 28px',
              borderTop: `1px solid ${p.line}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: p.paper,
              gap: 12,
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                color: p.inkSoft,
                fontFamily: 'inherit',
                padding: '10px 0',
              }}
            >
              {step === 1 ? 'Cancel' : '← Back'}
            </button>
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 ? !canNext1 : !canNext2}
                style={{
                  padding: '12px 22px',
                  background: (step === 1 ? canNext1 : canNext2) ? p.ink : p.line,
                  color: p.paper,
                  border: 'none',
                  cursor: (step === 1 ? canNext1 : canNext2) ? 'pointer' : 'not-allowed',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  opacity: (step === 1 ? canNext1 : canNext2) ? 1 : 0.5,
                }}
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                style={{
                  padding: '12px 22px',
                  background: canSubmit && !submitting ? p.primary : p.line,
                  color: p.paper,
                  border: 'none',
                  cursor: canSubmit && !submitting ? 'pointer' : 'not-allowed',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  opacity: canSubmit && !submitting ? 1 : 0.5,
                }}
              >
                {submitting ? 'Sending…' : 'Request tour →'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  textarea,
  p,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  p: typeof import('@/lib/data').PALETTES.forest;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span
        style={{
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: p.inkSoft,
          fontWeight: 600,
        }}
      >
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={{
            padding: '12px 14px',
            border: `1px solid ${p.line}`,
            background: p.bg,
            fontFamily: 'inherit',
            fontSize: 15,
            color: p.ink,
            resize: 'vertical',
          }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            padding: '12px 14px',
            border: `1px solid ${p.line}`,
            background: p.bg,
            fontFamily: 'inherit',
            fontSize: 15,
            color: p.ink,
          }}
        />
      )}
    </label>
  );
}
