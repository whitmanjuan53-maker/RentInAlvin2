'use client';

import { useEffect, useState } from 'react';
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
  const [recipient, setRecipient] = useState('');
  const [savedRecipient, setSavedRecipient] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState('');
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const unsaved = savedRecipient !== null && recipient.trim() !== savedRecipient;

  async function loadSettings() {
    setSettingsError('');
    try {
      const res = await fetch('/api/reports/settings', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not load settings.');
      setRecipient(data.recipient);
      setSavedRecipient(data.recipient);
    } catch (error) {
      setSettingsError(error instanceof Error ? error.message : 'Could not load settings.');
    }
  }

  useEffect(() => { void loadSettings(); }, []);

  async function saveRecipient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || sending) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/reports/settings', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: recipient.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save the recipient.');
      setRecipient(data.recipient);
      setSavedRecipient(data.recipient);
      setMessage('Weekly report recipient saved. Future weekly reports will go to this address.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save the recipient.');
    } finally { setSaving(false); }
  }

  async function downloadLeads() {
    if (exporting) return;
    setExporting(true);
    setMessage('');
    try {
      const res = await fetch('/api/reports/leads', { cache: 'no-store' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Could not download leads.');
      }
      const url = URL.createObjectURL(await res.blob());
      const link = document.createElement('a');
      link.href = url;
      link.download = res.headers.get('Content-Disposition')?.match(/filename="([^"]+)"/)?.[1] || 'RentInAlvin-all-leads.docx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage('Your lead document is ready. Attach it to an email whenever you want to share it.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not download leads.');
    } finally { setExporting(false); }
  }

  async function sendReport(type: 'weekly' | 'monthly') {
    if (sending || saving || (type === 'weekly' && (unsaved || savedRecipient === null || !savedRecipient))) return;
    if (!confirm(type === 'weekly' ? `Send the weekly report to ${savedRecipient} now?` : 'Send the monthly report email now?')) return;
    setSending(type);
    setMessage('');
    try {
      const res = await fetch(`/api/reports/${type}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Report failed.');
      } else {
        setMessage(data.emailSent ? `${type === 'weekly' ? 'Weekly' : 'Monthly'} report sent and saved.` : 'Report saved, but email was not sent. Check the recipient and email service settings.');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', maxWidth: '100%', minWidth: 0 }}>
      <form onSubmit={saveRecipient} style={{ width: '100%', maxWidth: 620 }}>
        <label htmlFor="weekly-recipient" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Weekly report recipient</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <input id="weekly-recipient" type="email" required maxLength={254} value={recipient}
            onChange={(event) => setRecipient(event.target.value)} disabled={savedRecipient === null || saving || !!sending}
            placeholder="name@example.com" aria-describedby="recipient-help"
            style={{ minWidth: 180, flex: 1, padding: '9px 12px', border: '1px solid #b5b0a8', borderRadius: 4, font: 'inherit', fontSize: 14 }} />
          <button type="submit" disabled={saving || !!sending || savedRecipient === null || !unsaved || !recipient.trim()} style={{ ...btnStyle, background: '#fff', color: '#1F3A2E' }}>
            {saving ? 'Saving…' : 'Save recipient'}
          </button>
        </div>
        <p id="recipient-help" style={{ fontSize: 12, color: '#5C5750', margin: '6px 0' }}>
          {unsaved ? 'Save your change before sending a weekly report.' : 'Used for scheduled and manually sent weekly reports. Monthly reports keep their existing recipient.'}
        </p>
        {settingsError && <p role="alert" style={{ fontSize: 13, color: '#a12b2b' }}>{settingsError} <button type="button" onClick={loadSettings}>Retry</button></p>}
      </form>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => sendReport('weekly')} disabled={!!sending || saving || unsaved || !savedRecipient} style={{ ...btnStyle, background: '#1F3A2E', color: '#fff', opacity: sending ? 0.6 : 1 }}>
          {sending === 'weekly' ? 'Sending…' : 'Send weekly report'}
        </button>
        <button onClick={() => sendReport('monthly')} disabled={!!sending || saving} style={{ ...btnStyle, background: '#1F3A2E', color: '#fff', opacity: sending ? 0.6 : 1 }}>
          {sending === 'monthly' ? 'Sending…' : 'Send monthly report'}
        </button>
        <button onClick={() => router.refresh()} style={{ ...btnStyle, background: 'transparent', color: '#1F3A2E' }}>
          Refresh
        </button>
        <button onClick={logout} style={{ ...btnStyle, background: 'transparent', color: '#5C5750', border: '1px solid #d5d0c8' }}>
          Log out
        </button>
      </div>
      <div style={{ width: '100%', padding: '12px 0', borderTop: '1px solid #d5d0c8' }}>
        <button onClick={downloadLeads} disabled={exporting} style={{ ...btnStyle, background: '#1F3A2E', color: '#fff' }}>
          {exporting ? 'Preparing document…' : 'Download all leads (Word)'}
        </button>
        <p style={{ fontSize: 12, color: '#5C5750', margin: '6px 0 0' }}>All saved leads, from every date, in one document you can edit and email.</p>
      </div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <a href="/api/reports/emails" style={linkStyle}>Download 7-day email CSV</a>
        <a href="/api/reports/weekly?preview=1" target="_blank" rel="noopener" style={linkStyle}>Preview weekly email</a>
        <a href="/api/reports/monthly?preview=1" target="_blank" rel="noopener" style={linkStyle}>Preview monthly email</a>
      </div>
      {message && <p role="status" style={{ fontSize: 13, color: '#5C5750', maxWidth: 620, margin: 0 }}>{message}</p>}
    </div>
  );
}
