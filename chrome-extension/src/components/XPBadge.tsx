interface XPBadgeProps {
  level: number;
  currentXP: number;
  maxXP: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function XPBadge({ level, currentXP, maxXP, size = 'md' }: XPBadgeProps) {
  const dim = { sm: 72, md: 104, lg: 140 }[size];
  const stroke = { sm: 4, md: 5, lg: 6 }[size];
  const r = (dim - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(currentXP / maxXP, 1));

  return (
    <div style={{ width: dim, height: dim, position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={dim} height={dim} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
        <circle cx={dim / 2} cy={dim / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={dim / 2} cy={dim / 2} r={r} fill="none" stroke="#6E3CFB" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ filter: 'drop-shadow(0 0 6px #6E3CFB)', transition: 'stroke-dashoffset 0.6s ease' }}
        />
        {/* tick marks */}
        {Array.from({ length: 20 }).map((_, i) => {
          const a = (i / 20) * Math.PI * 2;
          const x1 = dim / 2 + Math.cos(a) * (r + 4);
          const y1 = dim / 2 + Math.sin(a) * (r + 4);
          const x2 = dim / 2 + Math.cos(a) * (r + 7);
          const y2 = dim / 2 + Math.sin(a) * (r + 7);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />;
        })}
      </svg>
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>LVL</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: dim * 0.28, lineHeight: 1, color: '#fff' }}>{level}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#9C6CFF', marginTop: 2 }}>{currentXP}/{maxXP}</div>
      </div>
    </div>
  );
}
