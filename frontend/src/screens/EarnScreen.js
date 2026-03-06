import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { TrendingUp, Lock, Droplets, Clock, ChevronRight, Zap } from 'lucide-react';

const anim = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

export default function EarnScreen() {
  const { pools, staking, user } = useApp();

  const totalEarned = staking.reduce((s, p) => s + (p.earned || 0), 0);
  const totalStaked = staking.reduce((s, p) => s + (p.usd_value || 0), 0);

  return (
    <motion.div className="px-4 pt-5 pb-4 space-y-5" variants={stagger} initial="hidden" animate="show" data-testid="earn-screen">
      <motion.div variants={anim}>
        <h2 className="text-xl font-black uppercase tracking-tight" style={{ color: 'var(--gami-text)' }}>Earn</h2>
        <p className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: 'var(--gami-text-muted)' }}>Stake, Farm, & Earn Rewards</p>
      </motion.div>

      {/* Overview */}
      <motion.div variants={anim} className="neo-card p-5" data-testid="earn-overview">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--gami-text-muted)' }}>Total Staked</p>
            <p className="text-lg font-black font-mono mt-1" style={{ color: 'var(--gami-text)' }}>${totalStaked.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--gami-text-muted)' }}>Earned</p>
            <p className="text-lg font-black font-mono mt-1" style={{ color: '#22C55E' }}>{totalEarned.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--gami-text-muted)' }}>Claimable</p>
            <p className="text-lg font-black font-mono mt-1" style={{ color: '#F59E0B' }}>{user?.claimable_rewards || 0}</p>
          </div>
        </div>
        <button className="neo-btn-success w-full mt-4 text-[11px] py-2.5" data-testid="claim-all-btn">
          Claim All Rewards
        </button>
      </motion.div>

      {/* Active Positions */}
      {staking.length > 0 && (
        <motion.div variants={anim}>
          <h3 className="text-sm font-black uppercase tracking-wide mb-2" style={{ color: 'var(--gami-text)' }}>Your Positions</h3>
          <div className="space-y-2">
            {staking.map((s, i) => (
              <div key={i} className="neo-card-muted p-3" data-testid={`position-${i}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 flex items-center justify-center font-black text-[10px]" style={{ background: '#6E3CFB', color: '#fff', border: '2px solid #4C1D95' }}>
                      {s.token.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold" style={{ color: 'var(--gami-text)' }}>{s.pool}</p>
                      <p className="text-[10px] font-mono" style={{ color: 'var(--gami-text-muted)' }}>{s.amount.toLocaleString()} {s.token}</p>
                    </div>
                  </div>
                  <div className="neo-tag" style={{ borderColor: '#22C55E', color: '#22C55E', background: 'rgba(34,197,94,0.08)', fontSize: '9px' }}>
                    {s.apy}% APY
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-[8px] font-bold uppercase" style={{ color: 'var(--gami-text-muted)' }}>Value</p>
                      <p className="text-xs font-bold font-mono" style={{ color: 'var(--gami-text)' }}>${s.usd_value.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold uppercase" style={{ color: 'var(--gami-text-muted)' }}>Earned</p>
                      <p className="text-xs font-bold font-mono" style={{ color: '#22C55E' }}>+{s.earned} {s.token}</p>
                    </div>
                  </div>
                  <button className="neo-btn text-[8px] px-2 py-1" data-testid={`unstake-${i}`}>Manage</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Available Pools */}
      <motion.div variants={anim}>
        <h3 className="text-sm font-black uppercase tracking-wide mb-2" style={{ color: 'var(--gami-text)' }}>Staking Pools</h3>
        <div className="space-y-2">
          {pools.map((p, i) => (
            <div key={i} className="neo-card-muted p-3 flex items-center justify-between" data-testid={`pool-${i}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center font-black text-xs" style={{ background: p.icon_color, color: '#fff', border: `2px solid ${p.icon_color}` }}>
                  {p.token.substring(0, 2)}
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: 'var(--gami-text)' }}>{p.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] font-mono" style={{ color: 'var(--gami-text-muted)' }}>TVL: ${(p.tvl / 1000000).toFixed(1)}M</span>
                    <span className="text-[9px] font-mono" style={{ color: 'var(--gami-text-muted)' }}>Min: {p.min_stake}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black font-mono" style={{ color: '#22C55E' }}>{p.apy}%</p>
                <p className="text-[8px] font-bold uppercase" style={{ color: 'var(--gami-text-muted)' }}>{p.lock_period}</p>
                {p.status === 'coming_soon' && (
                  <span className="neo-tag mt-1" style={{ borderColor: '#F59E0B', color: '#F59E0B', background: 'rgba(245,158,11,0.08)', fontSize: '7px', padding: '0px 4px' }}>Soon</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
