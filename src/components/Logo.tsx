import type { Palette } from '@/lib/data';

/**
 * Rentinalvin.com brand logo — Mondrian mark + wordmark.
 * Rendered as vector SVG so it is transparent (no background box) and stays crisp at any size.
 */
export default function Logo({ p, size = 40 }: { p: Palette; size?: number }) {
  const BLUE = '#2B53C8';
  const RED = '#E8362B';
  const YELLOW = '#F4C20D';
  const BLACK = '#0E0E0E';
  const ORANGE = '#E2A52B';
  const lw = 4; // black grid line weight

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {/* Mondrian mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Rentinalvin.com"
        style={{ flexShrink: 0 }}
      >
        {/* white canvas (the artwork itself) */}
        <rect x="0" y="0" width="100" height="100" fill="#FFFFFF" />

        {/* color blocks */}
        <rect x="0" y="0" width="30" height="28" fill={BLUE} />
        <rect x="34" y="0" width="40" height="28" fill={RED} />
        <rect x="78" y="0" width="22" height="28" fill={BLUE} />
        <rect x="0" y="74" width="30" height="26" fill={YELLOW} />
        <rect x="74" y="50" width="26" height="24" fill={YELLOW} />
        <rect x="74" y="78" width="26" height="22" fill={YELLOW} />

        {/* gray stripes block (top-left under blue) */}
        <g stroke="#BFC3C7" strokeWidth="3">
          <line x1="0" y1="34" x2="26" y2="34" />
          <line x1="0" y1="40" x2="26" y2="40" />
          <line x1="0" y1="46" x2="26" y2="46" />
        </g>

        {/* central black bar with orange dot */}
        <rect x="40" y="50" width="12" height="50" fill={BLACK} />
        <circle cx="34" cy="62" r="2.6" fill={ORANGE} />

        {/* black grid lines */}
        <g stroke={BLACK} strokeWidth={lw}>
          <line x1="32" y1="0" x2="32" y2="100" />
          <line x1="76" y1="0" x2="76" y2="100" />
          <line x1="0" y1="30" x2="100" y2="30" />
          <line x1="0" y1="74" x2="100" y2="74" />
          <line x1="0" y1="50" x2="32" y2="50" />
          <line x1="76" y1="50" x2="100" y2="50" />
          <line x1="0" y1="22" x2="32" y2="22" />
        </g>

        {/* outer frame */}
        <rect x="2" y="2" width="96" height="96" stroke={BLACK} strokeWidth="6" />
      </svg>

      {/* Wordmark */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
        <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', color: p.ink }}>
          Rentinalvin<span style={{ color: RED }}>.com</span>
        </span>
        <span
          style={{
            fontSize: 9.5,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: p.inkSoft,
            fontWeight: 500,
            marginTop: 2,
          }}
        >
          Yellowstone Asset Management
        </span>
      </div>
    </div>
  );
}
