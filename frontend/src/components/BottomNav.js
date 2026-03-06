import React from 'react';
import { Home, Gift, Target, Disc } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { key: 'home', label: 'Home', Icon: Home },
  { key: 'rewards', label: 'Rewards', Icon: Gift },
  { key: 'points', label: 'Points', Icon: Target },
  { key: 'wheels', label: 'Wheels', Icon: Disc },
];

export const BottomNav = ({ activeTab, setActiveTab }) => {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 glass"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
      data-testid="bottom-nav"
    >
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map(({ key, label, Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              data-testid={`nav-${key}`}
              onClick={() => setActiveTab(key)}
              className="relative flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl group"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={{ color: isActive ? '#6E3CFB' : 'var(--gami-text-muted)' }}
                />
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute -inset-2 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(110,60,251,0.25) 0%, transparent 70%)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
              <span
                className="text-[10px] font-semibold tracking-wide"
                style={{ color: isActive ? '#6E3CFB' : 'var(--gami-text-muted)' }}
              >
                {label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-gami-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
