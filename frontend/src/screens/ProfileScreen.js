import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Copy, ExternalLink, Shield, Zap, Star, Link2 } from 'lucide-react';

const anim = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

export default function ProfileScreen({ onBack }) {
  const { user } = useApp();
  if (!user) return null;

  const shortAddr = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  return (
    <motion.div className="px-4 pt-5 pb-4 space-y-5" variants={stagger} initial="hidden" animate="show" data-testid="profile-screen">
      <motion.div variants={anim} className="flex items-center gap-3">
        <button data-testid="back-btn" onClick={onBack} className="w-8 h-8 flex items-center justify-center" style={{ background: 'var(--gami-card)', border: '2px solid var(--gami-border)', boxShadow: '2px 2px 0px var(--gami-deep)', cursor: 'pointer' }}>
          <ChevronLeft size={16} style={{ color: 'var(--gami-text)' }} />
        </button>
        <h2 className="text-lg font-black uppercase" style={{ color: 'var(--gami-text)' }}>Profile & Identity</h2>
      </motion.div>

      {/* Avatar & Name */}
      <motion.div variants={anim} className="neo-card p-5 flex items-center gap-4" data-testid="profile-card">
        <div className="w-16 h-16 flex-shrink-0" style={{ border: '3px solid #6E3CFB', boxShadow: '4px 4px 0px #4C1D95' }}>
          <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black" style={{ color: 'var(--gami-text)' }}>{user.username}</h3>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--gami-text-muted)' }}>{shortAddr(user.wallet_address)}</span>
            <Copy size={10} style={{ color: 'var(--gami-text-muted)', cursor: 'pointer' }} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="neo-tag" style={{ borderColor: '#6E3CFB', color: '#6E3CFB', background: 'rgba(110,60,251,0.1)', fontSize: '9px' }}>
              <Zap size={8} /> LVL {user.level}
            </span>
            <span className="neo-tag" style={{ borderColor: '#22C55E', color: '#22C55E', background: 'rgba(34,197,94,0.1)', fontSize: '9px' }}>
              <Star size={8} /> {user.reputation_score} REP
            </span>
          </div>
        </div>
      </motion.div>

      {/* XP Progress */}
      <motion.div variants={anim} className="neo-card-muted p-4" data-testid="xp-progress">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--gami-text-muted)' }}>XP Progress</span>
          <span className="text-xs font-black font-mono gradient-text">{user.xp.toLocaleString()} / {user.xp_to_next.toLocaleString()}</span>
        </div>
        <div className="neo-progress">
          <div className="neo-progress-fill" style={{ width: `${(user.xp / user.xp_to_next) * 100}%`, background: '#6E3CFB' }} />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={anim} className="grid grid-cols-3 gap-2" data-testid="profile-stats">
        <div className="neo-card-muted p-3 text-center">
          <p className="text-[8px] font-bold uppercase" style={{ color: 'var(--gami-text-muted)' }}>Streak</p>
          <p className="text-lg font-black font-mono" style={{ color: '#F59E0B' }}>{user.streak_days}</p>
        </div>
        <div className="neo-card-muted p-3 text-center">
          <p className="text-[8px] font-bold uppercase" style={{ color: 'var(--gami-text-muted)' }}>Spins</p>
          <p className="text-lg font-black font-mono" style={{ color: '#A78BFA' }}>{user.total_spins}</p>
        </div>
        <div className="neo-card-muted p-3 text-center">
          <p className="text-[8px] font-bold uppercase" style={{ color: 'var(--gami-text-muted)' }}>Staked</p>
          <p className="text-lg font-black font-mono" style={{ color: '#22C55E' }}>${user.staking_total_usd?.toLocaleString()}</p>
        </div>
      </motion.div>

      {/* Connected Wallets */}
      <motion.div variants={anim} data-testid="connected-wallets">
        <h3 className="text-sm font-black uppercase tracking-wide mb-2" style={{ color: 'var(--gami-text)' }}>
          <Link2 size={14} className="inline mr-1" style={{ verticalAlign: 'middle' }} />
          Connected Wallets
        </h3>
        <div className="space-y-2">
          {user.connected_wallets?.map((w, i) => (
            <div key={i} className="neo-card-muted p-3 flex items-center justify-between" data-testid={`wallet-${i}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center font-black text-[10px]" style={{ background: '#6E3CFB', color: '#fff', border: '2px solid #4C1D95' }}>
                  {w.chain.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: 'var(--gami-text)' }}>{w.chain}</p>
                  <p className="text-[10px] font-mono" style={{ color: 'var(--gami-text-muted)' }}>{shortAddr(w.address)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {w.primary && (
                  <span className="neo-tag" style={{ borderColor: '#6E3CFB', color: '#6E3CFB', background: 'rgba(110,60,251,0.08)', fontSize: '8px', padding: '1px 5px' }}>Primary</span>
                )}
                <ExternalLink size={12} style={{ color: 'var(--gami-text-muted)', cursor: 'pointer' }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Referral */}
      <motion.div variants={anim} className="neo-card p-4" data-testid="referral-section">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--gami-text-muted)' }}>Referral Code</p>
            <p className="text-lg font-black font-mono mt-1" style={{ color: 'var(--gami-text)' }}>{user.referral_code}</p>
          </div>
          <button className="neo-btn text-[9px] px-3 py-2">
            <Copy size={12} className="inline mr-1" /> Copy
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
