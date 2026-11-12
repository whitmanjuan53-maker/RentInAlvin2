import { ImageResponse } from 'next/og';
import BrandMark from './brand-mark';

export const alt = 'RentInAlvin.com, apartments and townhomes in Alvin, Texas';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '82px 88px',
        background: '#FBF7F0',
        color: '#1A1815',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <BrandMark size={150} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 66, fontWeight: 800, letterSpacing: '-2px' }}>
              <span>RentInAlvin</span><span style={{ color: '#E8362B' }}>.com</span>
            </div>
            <div style={{ fontSize: 20, letterSpacing: '5px', textTransform: 'uppercase', color: '#5C5750', marginTop: 8 }}>
              Yellowstone Asset Management
            </div>
          </div>
        </div>
        <div style={{ width: '100%', height: 2, background: '#D9D2C8', margin: '56px 0 44px' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 58, lineHeight: 1.08, letterSpacing: '-1.5px' }}>
            Apartments &amp; Townhomes
          </div>
          <div style={{ fontSize: 58, lineHeight: 1.08, color: '#1F3A2E', marginTop: 6 }}>
            for Rent in Alvin, Texas
          </div>
          <div style={{ fontSize: 24, color: '#5C5750', marginTop: 28 }}>
            Local management · Honest pricing · Six Alvin communities
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
