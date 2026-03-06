import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ChevronLeft, RotateCw, Sparkles, Zap } from 'lucide-react';

const SEGMENTS = [
  { label: '10 XP', color: '#6E3CFB' },
  { label: '25 XP', color: '#22C55E' },
  { label: '50 XP', color: '#A78BFA' },
  { label: '100 XP', color: '#F59E0B' },
  { label: '5 Tokens', color: '#4C1D95' },
  { label: 'NFT Badge', color: '#EC4899' },
  { label: 'Try Again', color: '#374151' },
  { label: '2x Bonus', color: '#3B82F6' },
];

const anim = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export default function WheelsScreen({ onBack }) {
  const { spinWheel } = useApp();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);

  const handleSpin = useCallback(async () => {
    if (spinning || hasSpun) return;
    setSpinning(true);
    setResult(null);
    const data = await spinWheel();
    if (!data.success && data.message?.includes('Already')) {
      setHasSpun(true);
      setResult(data.result || 'Already spun');
      setSpinning(false);
      return;
    }
    const idx = SEGMENTS.findIndex(s => s.label === data.result);
    const segAngle = 360 / SEGMENTS.length;
    const target = 360 - (idx * segAngle + segAngle / 2);
    setRotation(rotation + 1440 + target);
    setTimeout(() => {
      setSpinning(false);
      setResult(data.result);
      if (data.success) setHasSpun(true);
    }, 3500);
  }, [spinning, hasSpun, spinWheel, rotation]);

  return (
    <motion.div className="px-4 pt-5 pb-4 space-y-5" variants={stagger} initial="hidden" animate="show" data-testid="wheels-screen">
      <motion.div variants={anim} className="flex items-center gap-3">
        <button data-testid="back-btn" onClick={onBack} className="w-8 h-8 flex items-center justify-center" style={{ background: 'var(--gami-card)', border: '2px solid var(--gami-border)', boxShadow: '2px 2px 0px var(--gami-deep)', cursor: 'pointer' }}>
          <ChevronLeft size={16} style={{ color: 'var(--gami-text)' }} />
        </button>
        <h2 className="text-lg font-black uppercase" style={{ color: 'var(--gami-text)' }}>Spin & Win</h2>
      </motion.div>

      <motion.div variants={anim} className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles size={14} color="#F59E0B" />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--gami-text-muted)' }}>Free Spin Everyday</span>
        </div>
        {hasSpun && <p className="text-sm font-bold" style={{ color: 'var(--gami-text)' }}>You've used your free spin</p>}
      </motion.div>

      {/* Wheel */}
      <motion.div variants={anim} className="flex justify-center py-2">
        <div className="relative" data-testid="spin-wheel">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10" style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '16px solid #F59E0B' }} />

          <div style={{ width: 260, height: 260, transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 3.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none' }}>
            <svg viewBox="0 0 260 260" width="260" height="260">
              <rect x="2" y="2" width="256" height="256" fill="none" stroke="#6E3CFB" strokeWidth="3" />
              {SEGMENTS.map((seg, i) => {
                const angle = (360 / SEGMENTS.length) * i;
                const startA = (angle - 90) * Math.PI / 180;
                const endA = (angle - 90 + 360 / SEGMENTS.length) * Math.PI / 180;
                const midA = (angle - 90 + 360 / SEGMENTS.length / 2) * Math.PI / 180;
                const r = 120;
                const x1 = 130 + r * Math.cos(startA), y1 = 130 + r * Math.sin(startA);
                const x2 = 130 + r * Math.cos(endA), y2 = 130 + r * Math.sin(endA);
                const tr = 85;
                const tx = 130 + tr * Math.cos(midA), ty = 130 + tr * Math.sin(midA);
                const rot = angle + 360 / SEGMENTS.length / 2;
                return (
                  <g key={i}>
                    <path d={`M130,130 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`} fill={seg.color} stroke="#0B0F19" strokeWidth="2" />
                    <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="9" fontWeight="800" fontFamily="Outfit" transform={`rotate(${rot},${tx},${ty})`}>{seg.label}</text>
                  </g>
                );
              })}
              <rect x="110" y="110" width="40" height="40" fill="#0B0F19" stroke="#6E3CFB" strokeWidth="2" />
              <text x="130" y="127" textAnchor="middle" fill="#A78BFA" fontSize="7" fontWeight="800" fontFamily="Outfit">SPIN</text>
              <text x="130" y="137" textAnchor="middle" fill="#A78BFA" fontSize="7" fontWeight="800" fontFamily="Outfit">NOW</text>
            </svg>
          </div>
        </div>
      </motion.div>

      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="neo-card p-4 text-center" data-testid="spin-result">
          <div className="flex items-center justify-center gap-2">
            <Zap size={14} color="#F59E0B" />
            <span className="text-sm font-black" style={{ color: 'var(--gami-text)' }}>You won: <span className="gradient-text">{result}</span></span>
          </div>
        </motion.div>
      )}

      <motion.div variants={anim} className="text-center">
        <p className="text-[10px]" style={{ color: 'var(--gami-text-muted)' }}>
          {hasSpun ? 'No more free spins today. Come back tomorrow!' : 'Spin the wheel once daily for free rewards!'}
        </p>
      </motion.div>

      <motion.div variants={anim}>
        <button data-testid="spin-btn" onClick={handleSpin} disabled={spinning || hasSpun}
          className={hasSpun ? 'neo-btn-outline w-full py-3.5 text-xs flex items-center justify-center gap-2' : 'neo-btn w-full py-3.5 text-xs flex items-center justify-center gap-2'}
          style={{ opacity: spinning ? 0.6 : 1 }}>
          <RotateCw size={14} className={spinning ? 'animate-spin' : ''} />
          {spinning ? 'SPINNING...' : hasSpun ? 'SPIN AGAIN TOMORROW' : 'SPIN NOW'}
        </button>
      </motion.div>
    </motion.div>
  );
}
