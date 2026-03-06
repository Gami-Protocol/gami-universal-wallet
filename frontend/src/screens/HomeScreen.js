import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Bell, Send, ArrowDownLeft, Repeat, Lock, Gift, CalendarCheck, Flame, Zap, ChevronRight, User } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const anim = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

const quickActions = [
  { key: 'send', label: 'Send', Icon: Send, color: '#6E3CFB' },
  { key: 'receive', label: 'Receive', Icon: ArrowDownLeft, color: '#22C55E' },
  { key: 'swap', label: 'Swap', Icon: Repeat, color: '#3B82F6' },
  { key: 'stake', label: 'Stake', Icon: Lock, color: '#F59E0B' },
  { key: 'claim', label: 'Claim', Icon: Gift, color: '#A78BFA' },
  { key: 'checkin', label: 'Check-in', Icon: CalendarCheck, color: '#22C55E' },
];

export default function HomeScreen({ onOpenOverlay }) {
  const { user, rewards, checkins, staking, tokens } = useApp();
  if (!user) return null;

  const featured = rewards.filter(r => r.featured).slice(0, 3);
  const today = new Date();
  const checkinSet = new Set(checkins.map(c => c.date));
  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const dow = today.getDay();
  const monOff = dow === 0 ? -6 : 1 - dow;
  const weekDates = Array.from({ length: 7 }, (_, i) => { const d = new Date(today); d.setDate(today.getDate() + monOff + i); return d; });

  const totalStaked = staking.reduce((s, p) => s + (p.usd_value || 0), 0);
  const topTokens = tokens.slice(0, 3);

  return (
    <motion.div className="px-4 pt-5 pb-4 space-y-5" variants={stagger} initial="hidden" animate="show" data-testid="home-screen">
      {/* Header */}
      <motion.div variants={anim} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => onOpenOverlay('profile')} data-testid="avatar-btn" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <div className="w-10 h-10 overflow-hidden" style={{ border: '3px solid #6E3CFB', boxShadow: '3px 3px 0px #4C1D95' }}>
              <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" data-testid="user-avatar" />
            </div>
          </button>
          <svg viewBox="0 0 60 60" width={28} height={28}>
            <polygon points="30,3 54,16 54,44 30,57 6,44 6,16" fill="#6E3CFB" stroke="#4C1D95" strokeWidth="2" />
            <text x="30" y="36" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="900" fontFamily="Outfit">G</text>
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button data-testid="notification-btn" className="relative w-8 h-8 flex items-center justify-center" style={{ background: 'var(--gami-card)', border: '2px solid var(--gami-border)', boxShadow: '2px 2px 0px var(--gami-deep)', cursor: 'pointer' }}>
            <Bell size={14} style={{ color: 'var(--gami-text-muted)' }} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500" style={{ border: '2px solid var(--gami-bg)' }} />
          </button>
        </div>
      </motion.div>

      {/* Balance Card */}
      <motion.div variants={anim} className="neo-card p-5" data-testid="balance-card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--gami-text-muted)' }}>Total Balance</p>
            <h1 className="text-3xl font-black tracking-tight mt-1 font-mono" style={{ color: 'var(--gami-text)' }}>
              ${user.total_usd_balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h1>
          </div>
          <div className="neo-tag" style={{ borderColor: '#22C55E', color: '#22C55E', background: 'rgba(34,197,94,0.1)' }}>
            <Zap size={10} /> LVL {user.level}
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--gami-text-muted)' }}>XP</p>
            <p className="text-lg font-black font-mono gradient-text">{user.xp.toLocaleString()}</p>
          </div>
          <div style={{ width: 2, background: 'var(--gami-border-muted)' }} />
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--gami-text-muted)' }}>Staked</p>
            <p className="text-lg font-black font-mono" style={{ color: '#F59E0B' }}>${totalStaked.toLocaleString()}</p>
          </div>
          <div style={{ width: 2, background: 'var(--gami-border-muted)' }} />
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--gami-text-muted)' }}>Rewards</p>
            <p className="text-lg font-black font-mono" style={{ color: '#22C55E' }}>{user.claimable_rewards}</p>
          </div>
        </div>
        {/* XP Progress */}
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--gami-text-muted)' }}>XP Progress</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--gami-text-muted)' }}>{user.xp}/{user.xp_to_next}</span>
          </div>
          <div className="neo-progress">
            <div className="neo-progress-fill" style={{ width: `${(user.xp / user.xp_to_next) * 100}%`, background: '#6E3CFB' }} />
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={anim} className="grid grid-cols-6 gap-2" data-testid="quick-actions">
        {quickActions.map(({ key, label, Icon, color }) => (
          <button
            key={key}
            data-testid={`action-${key}`}
            onClick={() => key === 'checkin' ? onOpenOverlay('checkin') : null}
            className="flex flex-col items-center gap-1 py-3"
            style={{ background: 'var(--gami-card)', border: '2px solid var(--gami-border-muted)', cursor: 'pointer' }}
          >
            <Icon size={16} color={color} />
            <span className="text-[8px] font-bold uppercase" style={{ color: 'var(--gami-text-muted)' }}>{label}</span>
          </button>
        ))}
      </motion.div>

      {/* Top Assets */}
      <motion.div variants={anim}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-black uppercase tracking-wide" style={{ color: 'var(--gami-text)' }}>Assets</h3>
          <span className="text-[10px] font-bold uppercase" style={{ color: '#6E3CFB', cursor: 'pointer' }}>View All</span>
        </div>
        <div className="space-y-2">
          {topTokens.map((t, i) => (
            <div key={i} className="neo-card-muted p-3 flex items-center justify-between" data-testid={`asset-${i}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center font-black text-xs" style={{ background: t.icon_color, color: '#fff', border: `2px solid ${t.icon_color}` }}>
                  {t.symbol.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: 'var(--gami-text)' }}>{t.symbol}</p>
                  <p className="text-[10px]" style={{ color: 'var(--gami-text-muted)' }}>{t.chain}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold font-mono" style={{ color: 'var(--gami-text)' }}>{t.balance.toLocaleString()}</p>
                <p className="text-[10px] font-mono" style={{ color: t.change_24h >= 0 ? '#22C55E' : '#EF4444' }}>
                  {t.change_24h >= 0 ? '+' : ''}{t.change_24h}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Streak */}
      <motion.div variants={anim} className="neo-card-muted p-4" data-testid="streak-section">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame size={14} color="#F59E0B" />
            <span className="text-xs font-black uppercase" style={{ color: 'var(--gami-text)' }}>Streak</span>
            <span className="neo-tag" style={{ borderColor: '#F59E0B', color: '#F59E0B', background: 'rgba(245,158,11,0.1)', padding: '1px 6px', fontSize: '9px' }}>
              {user.streak_days}d
            </span>
          </div>
          <button onClick={() => onOpenOverlay('checkin')} className="text-[10px] font-bold uppercase" style={{ color: '#6E3CFB', background: 'none', border: 'none', cursor: 'pointer' }} data-testid="view-calendar-btn">
            Calendar
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {weekDates.map((date, i) => {
            const ds = date.toISOString().split('T')[0];
            const checked = checkinSet.has(ds);
            const isToday = ds === today.toISOString().split('T')[0];
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold" style={{ color: 'var(--gami-text-muted)' }}>{dayNames[i]}</span>
                <div
                  className="w-8 h-8 flex items-center justify-center text-[11px] font-bold"
                  style={{
                    background: checked ? '#22C55E' : isToday ? 'rgba(110,60,251,0.15)' : 'var(--gami-surface)',
                    color: checked ? '#000' : isToday ? '#6E3CFB' : 'var(--gami-text-muted)',
                    border: isToday && !checked ? '2px solid #6E3CFB' : checked ? '2px solid #16A34A' : '2px solid var(--gami-border-muted)',
                  }}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Featured Rewards */}
      <motion.div variants={anim} data-testid="featured-rewards">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-black uppercase tracking-wide" style={{ color: 'var(--gami-text)' }}>Featured Rewards</h3>
          <span className="text-[10px] font-bold uppercase" style={{ color: '#6E3CFB' }}>See All</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {featured.map((r, i) => (
            <div key={i} className="neo-card min-w-[150px] flex-shrink-0" data-testid={`featured-reward-${i}`}>
              <div className="h-20 overflow-hidden">
                <img src={r.image} alt={r.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-3">
                <p className="text-[9px] font-bold uppercase" style={{ color: 'var(--gami-text-muted)' }}>{r.brand}</p>
                <p className="text-[11px] font-bold truncate mt-0.5" style={{ color: 'var(--gami-text)' }}>{r.title}</p>
                <p className="text-base font-black font-mono gradient-text mt-1">{r.cost}<span className="text-[9px] font-bold" style={{ color: 'var(--gami-text-muted)' }}> pts</span></p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
