import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Living in Alvin | RentInAlvin.com',
  description: 'Learn about living in Alvin, Texas with Yellowstone Asset Management.',
};

export default function LivingInAlvinPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F4EEE4', color: '#1A1815', fontFamily: "'Inter', sans-serif" }}>
      <header style={{ padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(26,24,21,0.12)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#1A1815' }}>
          <div style={{ width: 40, height: 40, borderRadius: 4, background: '#1F3A2E', color: '#FBF7F0', display: 'grid', placeItems: 'center', fontFamily: "'Instrument Serif', serif", fontSize: 22, fontStyle: 'italic' }}>Y</div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, letterSpacing: '-0.01em' }}>Yellowstone</span>
            <span style={{ fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#5C5750', fontWeight: 500 }}>Asset Management</span>
          </div>
        </a>
        <a href="/" style={{ fontSize: 14, fontWeight: 600, color: '#1F3A2E', textDecoration: 'none' }}>← Back to home</a>
      </header>
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ textAlign: 'center', maxWidth: 600 }}>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(36px, 5vw, 56px)', margin: 0, color: '#1A1815' }}>Living in Alvin</h1>
          <p style={{ color: '#5C5750', marginTop: 16, fontSize: 17, lineHeight: 1.6 }}>
            This page is coming soon. In the meantime, explore our properties on the{' '}
            <a href="/" style={{ color: '#1F3A2E', fontWeight: 600, textDecoration: 'none' }}>homepage</a>.
          </p>
        </div>
      </main>
      <footer style={{ padding: '24px 40px', borderTop: '1px solid rgba(26,24,21,0.12)', fontSize: 12, color: '#5C5750', textAlign: 'center' }}>
        © {new Date().getFullYear()} Yellowstone Asset Management. Equal Housing Opportunity.
      </footer>
    </div>
  );
}
