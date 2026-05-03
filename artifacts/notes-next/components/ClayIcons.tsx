"use client";

type P = { size?: number };

function Base({ size, g1, g2, dark, id, children }: {
  size: number; g1: string; g2: string; dark: string; id: string; children: React.ReactNode;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`cg-${id}`} x1="4" y1="2" x2="24" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor={g1} /><stop offset="1" stopColor={g2} />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="24" height="24" rx="7.5"
        fill={`url(#cg-${id})`}
        style={{ filter: `drop-shadow(0px 3px 6px ${dark}88)` }} />
      {/* Bottom depth strip */}
      <rect x="2" y="20" width="24" height="6" rx="0" fill={dark} fillOpacity="0.18" />
      <rect x="2" y="23.5" width="24" height="2.5" rx="0" fill="black" fillOpacity="0.07" />
      {/* Top gloss */}
      <ellipse cx="14" cy="8.5" rx="9.5" ry="5" fill="white" fillOpacity="0.28" />
      {children}
    </svg>
  );
}

/* ── Notes ─────────────────────────────── */
export function ClayNotes({ size = 28 }: P) {
  return (
    <Base size={size} g1="#c4b5fd" g2="#6d28d9" dark="#4c1d95" id="notes">
      <path d="M9 7h7l4 4v10H9V7z" fill="none" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M16 7v4h4" fill="none" stroke="white" strokeWidth="1.3" strokeLinejoin="round" />
      <line x1="11" y1="14" x2="17" y2="14" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.9" />
      <line x1="11" y1="17" x2="17" y2="17" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="11" y1="20" x2="14" y2="20" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.5" />
    </Base>
  );
}

/* ── Pin ────────────────────────────────── */
export function ClayPin({ size = 28 }: P) {
  return (
    <Base size={size} g1="#fca5a5" g2="#dc2626" dark="#991b1b" id="pin">
      <circle cx="14" cy="10" r="4" fill="none" stroke="white" strokeWidth="1.4" />
      <line x1="14" y1="14" x2="14" y2="21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11.5" y1="21" x2="16.5" y2="21" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14" cy="10" r="1.5" fill="white" fillOpacity="0.85" />
    </Base>
  );
}

/* ── Starred ────────────────────────────── */
export function ClayStar({ size = 28 }: P) {
  return (
    <Base size={size} g1="#fde68a" g2="#d97706" dark="#92400e" id="star">
      <polygon
        points="14,5.5 16.1,11.2 22.2,11.4 17.5,15.2 19.2,21.2 14,17.8 8.8,21.2 10.5,15.2 5.8,11.4 11.9,11.2"
        fill="white" fillOpacity="0.88" />
    </Base>
  );
}

/* ── Archived ───────────────────────────── */
export function ClayArchive({ size = 28 }: P) {
  return (
    <Base size={size} g1="#93c5fd" g2="#1d4ed8" dark="#1e3a8a" id="archive">
      <rect x="6" y="12" width="16" height="10" rx="2" fill="none" stroke="white" strokeWidth="1.4" />
      <rect x="6" y="8" width="16" height="4" rx="1.5" fill="none" stroke="white" strokeWidth="1.4" />
      <line x1="11" y1="10" x2="17" y2="10" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="14" y1="15" x2="14" y2="19" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      <polyline points="12,17.5 14,19.5 16,17.5" fill="none" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}

/* ── Trash ──────────────────────────────── */
export function ClayTrash({ size = 28 }: P) {
  return (
    <Base size={size} g1="#fda4af" g2="#e11d48" dark="#9f1239" id="trash">
      <rect x="8" y="10" width="12" height="12" rx="2" fill="none" stroke="white" strokeWidth="1.4" />
      <line x1="6.5" y1="10" x2="21.5" y2="10" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11 10V8.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V10" fill="none" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="11.5" y1="13" x2="11.5" y2="19" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.85" />
      <line x1="14" y1="13" x2="14" y2="19" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.85" />
      <line x1="16.5" y1="13" x2="16.5" y2="19" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.85" />
    </Base>
  );
}

/* ── Hash / Tag ─────────────────────────── */
export function ClayHash({ size = 28 }: P) {
  return (
    <Base size={size} g1="#6ee7b7" g2="#059669" dark="#064e3b" id="hash">
      <line x1="11" y1="7" x2="9" y2="21" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="17" y1="7" x2="15" y2="21" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="7.5" y1="12" x2="20.5" y2="12" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="7" y1="17" x2="20" y2="17" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </Base>
  );
}

/* ── Settings / Gear ────────────────────── */
export function ClaySettings({ size = 28 }: P) {
  return (
    <Base size={size} g1="#e2e8f0" g2="#64748b" dark="#334155" id="settings">
      <path
        d="M14 9a5 5 0 1 0 0 10A5 5 0 0 0 14 9z"
        fill="none" stroke="white" strokeWidth="1.4" />
      <circle cx="14" cy="14" r="2" fill="white" fillOpacity="0.9" />
      {[0,60,120,180,240,300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 14 + 5.5 * Math.cos(rad);
        const y1 = 14 + 5.5 * Math.sin(rad);
        const x2 = 14 + 7.5 * Math.cos(rad);
        const y2 = 14 + 7.5 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="2.2" strokeLinecap="round" />;
      })}
    </Base>
  );
}

/* ── Keyboard / Shortcuts ───────────────── */
export function ClayKeyboard({ size = 28 }: P) {
  return (
    <Base size={size} g1="#c7d2fe" g2="#4338ca" dark="#312e81" id="keyboard">
      <rect x="5" y="9" width="18" height="12" rx="2.5" fill="none" stroke="white" strokeWidth="1.4" />
      {/* top row keys */}
      {[7,10,13,16,19].map((x, i) => (
        <rect key={i} x={x} y={11} width="2" height="2" rx="0.6" fill="white" fillOpacity="0.8" />
      ))}
      {/* mid row */}
      {[7.5,10.5,13.5,16.5].map((x, i) => (
        <rect key={i} x={x} y={14.5} width="2" height="2" rx="0.6" fill="white" fillOpacity="0.8" />
      ))}
      {/* space bar */}
      <rect x="9" y="18" width="10" height="2" rx="0.8" fill="white" fillOpacity="0.8" />
    </Base>
  );
}

/* ── Home ───────────────────────────────── */
export function ClayHome({ size = 28 }: P) {
  return (
    <Base size={size} g1="#ddd6fe" g2="#7c3aed" dark="#5b21b6" id="home">
      <path d="M14 6L6 13h2v8h5v-5h2v5h5v-8h2L14 6z" fill="none" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
      <rect x="12.5" y="18" width="3" height="3" rx="0.5" fill="white" fillOpacity="0.8" />
    </Base>
  );
}

/* ── Sun ────────────────────────────────── */
export function ClaySun({ size = 28 }: P) {
  return (
    <Base size={size} g1="#fef08a" g2="#ca8a04" dark="#92400e" id="sun">
      <circle cx="14" cy="14" r="4" fill="white" fillOpacity="0.88" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 14 + 5.5 * Math.cos(rad);
        const y1 = 14 + 5.5 * Math.sin(rad);
        const x2 = 14 + 7.5 * Math.cos(rad);
        const y2 = 14 + 7.5 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.9" />;
      })}
    </Base>
  );
}

/* ── Moon ───────────────────────────────── */
export function ClayMoon({ size = 28 }: P) {
  return (
    <Base size={size} g1="#bfdbfe" g2="#1e40af" dark="#1e3a8a" id="moon">
      <path d="M18 14.5a7 7 0 1 1-8.5-8.5A6 6 0 0 0 18 14.5z" fill="white" fillOpacity="0.88" />
    </Base>
  );
}

/* ── Book / Brand logo ──────────────────── */
export function ClayBook({ size = 28 }: P) {
  return (
    <Base size={size} g1="#a5b4fc" g2="#4338ca" dark="#312e81" id="book">
      <path d="M8 6h12a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z"
        fill="none" stroke="white" strokeWidth="1.4" />
      <line x1="7" y1="10" x2="21" y2="10" stroke="white" strokeWidth="1.2" strokeOpacity="0.55" />
      {/* Bookmark ribbon */}
      <path d="M17 6v8l-3-2.5L11 14V6" fill="none" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
    </Base>
  );
}

/* ── Plus ───────────────────────────────── */
export function ClayPlus({ size = 22 }: P) {
  return (
    <Base size={size} g1="#a7f3d0" g2="#059669" dark="#064e3b" id="plus">
      <line x1="14" y1="9" x2="14" y2="19" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="9" y1="14" x2="19" y2="14" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </Base>
  );
}

/* ── Brain / AI ─────────────────────────── */
export function ClayBrain({ size = 28 }: P) {
  return (
    <Base size={size} g1="#f5d0fe" g2="#a21caf" dark="#86198f" id="brain">
      <path d="M14 8c-3 0-5 2-5 4.5 0 1.2.5 2.2 1.2 3-.3.5-.2 1.2.5 1.8 0 1.5 1.5 2.7 3.3 2.7s3.3-1.2 3.3-2.7c.7-.6.8-1.3.5-1.8C18.5 14.7 19 13.7 19 12.5c0-2.5-2-4.5-5-4.5z"
        fill="none" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
      <line x1="14" y1="12" x2="14" y2="16" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="11.5" y1="13.5" x2="16.5" y2="13.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />
      <circle cx="11.5" cy="11.5" r="0.8" fill="white" fillOpacity="0.7" />
      <circle cx="16.5" cy="11.5" r="0.8" fill="white" fillOpacity="0.7" />
    </Base>
  );
}

/* ── Sparkles / Magic ───────────────────── */
export function ClaySparkles({ size = 28 }: P) {
  return (
    <Base size={size} g1="#e9d5ff" g2="#9333ea" dark="#6b21a8" id="sparkles">
      <path d="M14 6l1.2 4.8 4.8 1.2-4.8 1.2L14 18l-1.2-4.8L8 12l4.8-1.2L14 6z" fill="white" fillOpacity="0.9" />
      <circle cx="19.5" cy="8.5" r="1.2" fill="white" fillOpacity="0.7" />
      <circle cx="9" cy="18.5" r="1" fill="white" fillOpacity="0.6" />
    </Base>
  );
}

/* ── Collapse (ChevronLeft inside pill) ──── */
export function ClayCollapse({ size = 28 }: P) {
  return (
    <Base size={size} g1="#f1f5f9" g2="#94a3b8" dark="#475569" id="collapse">
      <polyline points="16,9 11,14 16,19" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  );
}
