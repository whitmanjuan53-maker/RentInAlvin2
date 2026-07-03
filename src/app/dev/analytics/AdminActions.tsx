'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const btnStyle: React.CSSProperties = {
  padding: '9px 16px',
  fontSize: 13,
  fontWeight: 600,
  border: '1px solid #1F3A2E',
  borderRadius: 4,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const linkStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#1F3A2E',
  textDecoration: 'underline',
};

export default function AdminActions() {
  const router = useRouter();
  const [sending, setSending] = useState<'weekly' | 'monthly' | null>(null);
  const [message, setMessage] = useState('');

  async function sendReport(type: 'weekly' | 'monthly') {
    if (sending) return;
    if (!confirm(`Send the ${type} report email now?`)) return;
    setSending(type);
    setMessage('');
    try {
      const res = await fetch(`/api/reports/${type}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Report failed.');
      } else {
        setMessage(data.emailSent ? `${type === 'weekly' ? 'Weekly' : 'Monthly'} report sent and saved.` : 'Report saved, but email was not sent (check ANALYTICS_REPORT_TO / RESEND_API_KEY).');
        router.refresh();
      }
    } catch {
      setMessage('Network error.');
    }
    setSending(null);
  }

  async function logout() {
    await fetch('/api/dev/login', { method: 'DELETE' });
    router.refresh();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => sendReport('weekly')} disabled={!!sending} style={{ ...btnStyle, background: '#1F3A2E', color: '#fff', opacity: sending ? 0.6 : 1 }}>
          {sending === 'weekly' ? 'Sending…' : 'Send weekly report'}
        </button>
        <button onClick={() => sendReport('monthly')} disabled={!!sending} style={{ ...btnStyle, background: '#1F3A2E', color: '#fff', opacity: sending ? 0.6 : 1 }}>
          {sending === 'monthly' ? 'Sending…' : 'Send monthly report'}
        </button>
        <button onClick={() => router.refresh()} style={{ ...btnStyle, background: 'transparent', color: '#1F3A2E' }}>
          Refresh
        </button>
        <button onClick={logout} style={{ ...btnStyle, background: 'transparent', color: '#5C5750', border: '1px solid #d5d0c8' }}>
          Log out
        </button>
      </div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <a href="/api/reports/weekly?preview=1" target="_blank" rel="noopener" style={linkStyle}>Preview weekly email</a>
        <a href="/api/reports/monthly?preview=1" target="_blank" rel="noopener" style={linkStyle}>Preview monthly email</a>
        {message && <span style={{ fontSize: 13, color: '#5C5750' }}>{message}</span>}
      </div>
    </div>
  );
}
