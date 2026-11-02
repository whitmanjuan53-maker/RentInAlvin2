export default function BrandMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#FFFFFF" />
      <rect x="0" y="0" width="30" height="28" fill="#2B53C8" />
      <rect x="34" y="0" width="40" height="28" fill="#E8362B" />
      <rect x="78" y="0" width="22" height="28" fill="#2B53C8" />
      <rect x="0" y="74" width="30" height="26" fill="#F4C20D" />
      <rect x="74" y="50" width="26" height="24" fill="#F4C20D" />
      <rect x="74" y="78" width="26" height="22" fill="#F4C20D" />
      <g stroke="#BFC3C7" strokeWidth="3">
        <line x1="0" y1="34" x2="26" y2="34" />
        <line x1="0" y1="40" x2="26" y2="40" />
        <line x1="0" y1="46" x2="26" y2="46" />
      </g>
      <rect x="40" y="50" width="12" height="50" fill="#0E0E0E" />
      <circle cx="34" cy="62" r="2.6" fill="#E2A52B" />
      <g stroke="#0E0E0E" strokeWidth="4">
        <line x1="32" y1="0" x2="32" y2="100" />
        <line x1="76" y1="0" x2="76" y2="100" />
        <line x1="0" y1="30" x2="100" y2="30" />
        <line x1="0" y1="74" x2="100" y2="74" />
        <line x1="0" y1="50" x2="32" y2="50" />
        <line x1="76" y1="50" x2="100" y2="50" />
        <line x1="0" y1="22" x2="32" y2="22" />
      </g>
      <rect x="3" y="3" width="94" height="94" fill="none" stroke="#0E0E0E" strokeWidth="6" />
    </svg>
  );
}
