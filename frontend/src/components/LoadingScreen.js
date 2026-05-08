import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="app-shell noise-bg">
      <div className="app-container flex items-center justify-center min-h-screen">
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="neo-card p-6" style={{ boxShadow: '6px 6px 0px #4C1D95' }}>
            <svg viewBox="0 0 60 60" width={60} height={60}>
              <polygon points="30,3 54,16 54,44 30,57 6,44 6,16" fill="#6E3CFB" stroke="#4C1D95" strokeWidth="2" />
              <text x="30" y="36" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="900" fontFamily="Outfit">G</text>
            </svg>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-black tracking-tight" style={{ color: 'var(--gami-text)' }}>GAMI</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--gami-text-muted)' }}>Universal Wallet</span>
          </div>
          <motion.div
            className="w-12 h-1"
            style={{ background: '#6E3CFB', border: '1px solid #4C1D95' }}
            animate={{ scaleX: [0.5, 1.5, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </div>
  );
}
