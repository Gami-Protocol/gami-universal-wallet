import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { RotateCw, Sparkles, Zap } from 'lucide-react';

const SEGMENTS = [
  { label: '10 XP', color: '#6E3CFB', lightColor: '#EDE9FE' },
  { label: '25 XP', color: '#22C55E', lightColor: '#DCFCE7' },
  { label: '50 XP', color: '#A78BFA', lightColor: '#F3E8FF' },
  { label: '100 XP', color: '#F59E0B', lightColor: '#FEF3C7' },
  { label: '5 Tokens', color: '#4C1D95', lightColor: '#DDD6FE' },
  { label: 'NFT Badge', color: '#EC4899', lightColor: '#FCE7F3' },
  { label: 'Try Again', color: '#374151', lightColor: '#F3F4F6' },
  { label: '2x Bonus', color: '#3B82F6', lightColor: '#DBEAFE' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function WheelsScreen() {
  const { spinWheel, user } = useApp();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [hasSpunToday, setHasSpunToday] = useState(false);

  const handleSpin = useCallback(async () => {
    if (spinning || hasSpunToday) return;
    setSpinning(true);
    setResult(null);

    const data = await spinWheel();

    if (!data.success && data.message?.includes('Already')) {
      setHasSpunToday(true);
      setResult(data.result || 'Already spun');
      setSpinning(false);
      return;
    }

    // Find segment index
    const segIdx = SEGMENTS.findIndex(s => s.label === data.result);
    const segAngle = 360 / SEGMENTS.length;
    const targetAngle = 360 - (segIdx * segAngle + segAngle / 2);
    const totalRotation = rotation + 1440 + targetAngle; // 4 full spins + target

    setRotation(totalRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(data.result);
      if (data.success) setHasSpunToday(true);
    }, 3500);
  }, [spinning, hasSpunToday, spinWheel, rotation]);

  return (
    <motion.div
      className="px-5 pt-6 pb-4 space-y-5"
      variants={container}
      initial="hidden"
      animate="show"
      data-testid="wheels-screen"
    >
      {/* Header */}
      <motion.div variants={item} className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles size={16} style={{ color: '#F59E0B' }} />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--gami-text-muted)' }}>Free Spin Everyday</span>
        </div>
        <h2 className="text-xl font-extrabold" style={{ color: 'var(--gami-text)' }}>
          {hasSpunToday ? 'You Have Already Used' : 'Spin & Win'}
        </h2>
        {hasSpunToday && (
          <p className="text-xl font-extrabold" style={{ color: 'var(--gami-text)' }}>Your Free Spin</p>
        )}
      </motion.div>

      {/* Wheel */}
      <motion.div variants={item} className="flex justify-center py-4">
        <div className="relative wheel-container" data-testid="spin-wheel">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div
              className="w-0 h-0"
              style={{
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: '16px solid #F59E0B',
                filter: 'drop-shadow(0 2px 4px rgba(245,158,11,0.5))',
              }}
            />
          </div>

          {/* Wheel SVG */}
          <div
            style={{
              width: 280,
              height: 280,
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 3.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            }}
          >
            <svg viewBox="0 0 280 280" width="280" height="280">
              <defs>
                <filter id="wheel-shadow">
                  <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="rgba(110,60,251,0.3)" />
                </filter>
              </defs>
              <circle cx="140" cy="140" r="138" fill="none" stroke="rgba(110,60,251,0.3)" strokeWidth="3" filter="url(#wheel-shadow)" />

              {SEGMENTS.map((seg, i) => {
                const angle = (360 / SEGMENTS.length) * i;
                const startAngle = (angle - 90) * (Math.PI / 180);
                const endAngle = (angle - 90 + 360 / SEGMENTS.length) * (Math.PI / 180);
                const midAngle = (angle - 90 + 360 / SEGMENTS.length / 2) * (Math.PI / 180);
                const r = 130;
                const x1 = 140 + r * Math.cos(startAngle);
                const y1 = 140 + r * Math.sin(startAngle);
                const x2 = 140 + r * Math.cos(endAngle);
                const y2 = 140 + r * Math.sin(endAngle);
                const textR = 90;
                const textX = 140 + textR * Math.cos(midAngle);
                const textY = 140 + textR * Math.sin(midAngle);
                const textRotate = angle + 360 / SEGMENTS.length / 2;

                return (
                  <g key={i}>
                    <path
                      d={`M140,140 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
                      fill={seg.color}
                      stroke="rgba(0,0,0,0.2)"
                      strokeWidth="1"
                    />
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#fff"
                      fontSize="10"
                      fontWeight="700"
                      fontFamily="Outfit"
                      transform={`rotate(${textRotate}, ${textX}, ${textY})`}
                    >
                      {seg.label}
                    </text>
                  </g>
                );
              })}

              {/* Center */}
              <circle cx="140" cy="140" r="28" fill="#0F0720" stroke="rgba(110,60,251,0.4)" strokeWidth="2" />
              <text x="140" y="136" textAnchor="middle" fill="#A78BFA" fontSize="8" fontWeight="700" fontFamily="Outfit">Spin</text>
              <text x="140" y="148" textAnchor="middle" fill="#A78BFA" fontSize="8" fontWeight="700" fontFamily="Outfit">Now</text>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Result Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-4 text-center"
          data-testid="spin-result"
        >
          <div className="flex items-center justify-center gap-2">
            <Zap size={16} style={{ color: '#F59E0B' }} />
            <span className="text-sm font-bold" style={{ color: 'var(--gami-text)' }}>
              You won: <span className="gradient-text">{result}</span>
            </span>
          </div>
        </motion.div>
      )}

      {/* Info text */}
      <motion.div variants={item} className="text-center">
        <p className="text-xs" style={{ color: 'var(--gami-text-muted)' }}>
          {hasSpunToday
            ? 'You have one Free Spin a day, there are no more Free Spins today.'
            : 'Spin the wheel once daily for free rewards!'}
        </p>
      </motion.div>

      {/* Spin Button */}
      <motion.div variants={item}>
        <button
          data-testid="spin-btn"
          onClick={handleSpin}
          disabled={spinning || hasSpunToday}
          className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
          style={{
            background: hasSpunToday ? 'rgba(110,60,251,0.15)' : 'linear-gradient(135deg, #6E3CFB, #4C1D95)',
            color: hasSpunToday ? '#A78BFA' : '#fff',
            border: 'none',
            cursor: hasSpunToday ? 'default' : 'pointer',
            opacity: spinning ? 0.6 : 1,
          }}
        >
          <RotateCw size={16} className={spinning ? 'animate-spin' : ''} />
          {spinning ? 'Spinning...' : hasSpunToday ? 'Spin Again Tomorrow' : 'Spin Now'}
        </button>
      </motion.div>
    </motion.div>
  );
}
