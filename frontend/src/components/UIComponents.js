import React from 'react';
import { motion } from 'framer-motion';

export const GamiLogo = ({ size = 32 }) => (
  <svg viewBox="0 0 80 80" width={size} height={size}>
    <defs>
      <linearGradient id="g-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6E3CFB" />
        <stop offset="100%" stopColor="#A78BFA" />
      </linearGradient>
    </defs>
    <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="url(#g-grad)" />
    <text x="40" y="48" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" fontFamily="Outfit">G</text>
  </svg>
);

export const XPBadge = ({ xp }) => (
  <div className="pill" style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E' }}>
    +{xp} XP
  </div>
);

export const TokenBadge = ({ amount }) => (
  <div className="pill" style={{ background: 'rgba(110,60,251,0.15)', color: '#A78BFA' }}>
    {amount} GAMI
  </div>
);

export const ProgressBar = ({ current, max, color = '#6E3CFB', height = 6, showLabel = false }) => {
  const pct = Math.min((current / max) * 100, 100);
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs font-mono" style={{ color: 'var(--gami-text-muted)' }}>{current.toLocaleString()}</span>
          <span className="text-xs font-mono" style={{ color: 'var(--gami-text-muted)' }}>{max.toLocaleString()}</span>
        </div>
      )}
      <div className="w-full rounded-full overflow-hidden" style={{ height, background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="progress-fill rounded-full"
          style={{ height: '100%', background: `linear-gradient(90deg, ${color}, ${color}99)` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
};

export const CategoryPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className="pill whitespace-nowrap"
    style={{
      background: active ? 'rgba(110,60,251,0.2)' : 'rgba(255,255,255,0.04)',
      color: active ? '#A78BFA' : 'var(--gami-text-muted)',
      border: `1px solid ${active ? 'rgba(110,60,251,0.3)' : 'rgba(255,255,255,0.06)'}`,
      cursor: 'pointer',
      padding: '6px 14px',
      fontSize: '12px',
    }}
    data-testid={`category-${label.toLowerCase()}`}
  >
    {label}
  </button>
);
