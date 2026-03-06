import React from 'react';
import { motion } from 'framer-motion';

export const LoadingScreen = () => {
  return (
    <div className="app-shell noise-bg">
      <div className="app-container flex items-center justify-center min-h-screen">
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 relative">
            <svg viewBox="0 0 80 80" className="w-full h-full">
              <defs>
                <linearGradient id="gami-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6E3CFB" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
              </defs>
              <motion.polygon
                points="40,4 72,22 72,58 40,76 8,58 8,22"
                fill="url(#gami-grad)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
              <text x="40" y="48" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" fontFamily="Outfit">G</text>
            </svg>
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(110,60,251,0.3) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--gami-text)' }}>Gami</span>
            <span className="text-xs font-medium" style={{ color: 'var(--gami-text-muted)' }}>Universal Wallet</span>
          </div>
          <motion.div
            className="w-8 h-1 rounded-full bg-gami-primary"
            animate={{ scaleX: [1, 2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;
