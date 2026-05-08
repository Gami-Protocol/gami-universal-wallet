import React from 'react';
import { Home, Wallet, Gift, Target, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { key: 'home', label: 'Home', Icon: Home },
  { key: 'wallet', label: 'Wallet', Icon: Wallet },
  { key: 'rewards', label: 'Rewards', Icon: Gift },
  { key: 'missions', label: 'Missions', Icon: Target },
  { key: 'earn', label: 'Earn', Icon: TrendingUp },
];

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50"
      style={{
        background: 'var(--gami-surface)',
        borderTop: '3px solid var(--gami-border)',
        paddingBottom: 'env(safe-area-inset-bottom, 4px)',
      }}
      data-testid="bottom-nav"
    >
      <div className="flex justify-around items-center h-16">
        {tabs.map(({ key, label, Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              data-testid={`nav-${key}`}
              onClick={() => setActiveTab(key)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-8 h-[3px]"
                  style={{ background: '#6E3CFB' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{ color: isActive ? '#6E3CFB' : 'var(--gami-text-muted)' }}
              />
              <span
                className="text-[9px] font-bold uppercase tracking-wider"
                style={{ color: isActive ? '#6E3CFB' : 'var(--gami-text-muted)' }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
