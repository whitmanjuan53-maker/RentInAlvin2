'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/dev/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed.');
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
      setBusy(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#FBF7F0', padding: 20 }}>
      <form
        onSubmit={handleSubmit}
        style={{ width: '100%', maxWidth: 360, background: '#fff', border: '1px solid #e5e0d8', borderRadius: 6, padding: 28 }}
      >
        <h1 style={{ fontSize: 18, margin: '0 0 4px', color: '#1F3A2E', fontWeight: 600 }}>Site Analytics</h1>
        <p style={{ fontSize: 13, color: '#5C5750', margin: '0 0 20px' }}>Enter the password to continue.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          style={{
            width: '100%', padding: '10px 12px', fontSize: 15, border: '1px solid #d5d0c8',
            borderRadius: 4, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
          }}
        />
        {error && <div style={{ color: '#a33', fontSize: 13, marginTop: 10 }}>{error}</div>}
        <button
          type="submit"
          disabled={busy || !password}
          style={{
            width: '100%', marginTop: 16, padding: '10px 12px', fontSize: 14, fontWeight: 600,
            background: '#1F3A2E', color: '#fff', border: 'none', borderRadius: 4,
            cursor: busy || !password ? 'default' : 'pointer', opacity: busy || !password ? 0.6 : 1,
          }}
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
