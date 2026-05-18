'use client';

import { useState } from 'react';

const PROPERTIES = [
  'Kings Haven Apartments, 410 S 2nd St',
  'Kings Manor Townhomes, 328 S 2nd St',
  'Kings Haven Apartments, 100 S 2nd St',
  'French Quarter Residency, 2550 S Bypass 35',
  'The White House Apartments, 1606 W Sealy St',
  'The Royal Oaks Townhomes, 418 S Jackson St',
  "I'm not sure yet — show me options",
];

const MOVE_IN_OPTIONS = ['ASAP', 'Within 2 weeks', 'Within 30 days', '1–2 months', '3+ months', 'Flexible'];

const BEDROOM_OPTIONS = ['1 Bedroom', '2 Bedrooms', '3 Bedrooms', 'No preference'];

export default function LeadForm({
  p,
  displayFont,
}: {
  p: typeof import('@/lib/data').PALETTES.forest;
  displayFont: string;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [property, setProperty] = useState('');
  const [moveBy, setMoveBy] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fieldStyle = {
    width: '100%',
    padding: '12px 14px',
    background: p.bg,
    border: `1px solid ${p.line}`,
    color: p.ink,
    fontSize: 15,
    fontFamily: 'inherit',
    borderRadius: 3,
    outline: 'none',
    transition: 'border-color 160ms ease',
  } as React.CSSProperties;

  const labelStyle = {
    fontSize: 11,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: p.inkSoft,
    fontWeight: 600,
    marginBottom: 8,
    display: 'block',
  } as React.CSSProperties;

  function validate(): string | null {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) return 'Please enter your full name.';
    if (!trimmedPhone) return 'Please enter your phone number.';
    if (!trimmedEmail) return 'Please enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return 'Please enter a valid email address.';
    }
    if (!trimmedMessage) return 'Please enter a message.';
    if (trimmedPhone && !/^[0-9\s\-\(\)\+\.]+$/.test(trimmedPhone)) {
      return 'Please enter a valid phone number.';
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Prevent duplicate submissions
    if (submitting) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Honeypot check
    if (website) {
      setError('Spam detected. Please try again.');
      return;
    }

    setSubmitting(true);
    setError('');

    console.log('[LeadForm] Submitting contact form...');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'Contact',
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          property: property || undefined,
          moveBy: moveBy || undefined,
          bedrooms: bedrooms || undefined,
          message: message.trim(),
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });

      const data = await res.json();
      console.log('[LeadForm] Response:', data);

      if (!res.ok) {
        setError(data.message || data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Network error. Please try again or call us.');
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ background: p.paper, border: `1px solid ${p.line}`, padding: 36, borderRadius: 2 }}>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
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
            Inquiry sent successfully.
          </h3>
          <p style={{ color: p.inkSoft, maxWidth: '44ch', margin: '0 auto', lineHeight: 1.55 }}>
            Thank you. Your request has been received. A member of the leasing team will contact you shortly.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setName('');
              setPhone('');
              setEmail('');
              setProperty('');
              setMoveBy('');
              setBedrooms('');
              setMessage('');
              setWebsite('');
            }}
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
            Send another inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Honeypot */}
      <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
        <label>
          <span>Website</span>
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <div className="ys-lead-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={labelStyle}>Full name <span style={{ color: p.accent }}>*</span></label>
          <input
            required
            style={fieldStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Maria Garcia"
          />
        </div>
        <div>
          <label style={labelStyle}>Phone <span style={{ color: p.accent }}>*</span></label>
          <input
            required
            type="tel"
            style={fieldStyle}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(832) 210-3968"
          />
        </div>
        <div>
          <label style={labelStyle}>Email <span style={{ color: p.accent }}>*</span></label>
          <input
            required
            type="email"
            style={fieldStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label style={labelStyle}>Community interested in</label>
          <select
            style={fieldStyle}
            value={property}
            onChange={(e) => setProperty(e.target.value)}
          >
            <option value="">Select a community…</option>
            {PROPERTIES.map((pName) => (
              <option key={pName} value={pName}>
                {pName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Move-in timeframe</label>
          <select
            style={fieldStyle}
            value={moveBy}
            onChange={(e) => setMoveBy(e.target.value)}
          >
            <option value="">Select…</option>
            {MOVE_IN_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Bedrooms needed</label>
          <select
            style={fieldStyle}
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
          >
            <option value="">Select…</option>
            {BEDROOM_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={labelStyle}>Message <span style={{ color: p.accent }}>*</span></label>
        <textarea
          required
          rows={3}
          style={{ ...fieldStyle, resize: 'vertical', minHeight: 80 }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your needs, pets, parking, etc."
        />
      </div>

      {error && (
        <div
          style={{
            padding: 12,
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            fontSize: 13,
            borderRadius: 4,
            marginTop: 16,
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          marginTop: 24,
          width: '100%',
          padding: '16px 24px',
          background: p.primary,
          color: p.paper,
          border: 'none',
          fontSize: 15,
          fontWeight: 600,
          cursor: submitting ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          letterSpacing: '0.01em',
          borderRadius: 3,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          opacity: submitting ? 0.7 : 1,
        }}
      >
        {submitting ? 'Sending…' : 'Send inquiry'}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <p style={{ fontSize: 12, color: p.inkSoft, marginTop: 14, lineHeight: 1.5, textAlign: 'center' }}>
        We respect your privacy. No spam, ever.
      </p>
    </form>
  );
}
