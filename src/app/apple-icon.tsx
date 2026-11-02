import { ImageResponse } from 'next/og';
import BrandMark from './brand-mark';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', padding: 14, background: '#ffffff' }}>
      <BrandMark size={152} />
    </div>,
    size,
  );
}
