import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Bell, ChevronRight, CalendarCheck, Target, Gift, Users, Flame, Zap } from 'lucide-react';
import { GamiLogo, ProgressBar } from '../components/UIComponents';
import ThemeToggle from '../components/ThemeToggle';

const quickActions = [
  { key: 'checkin', label: 'Check-in', Icon: CalendarCheck, color: '#22C55E' },
  { key: 'missions', label: 'Mission', Icon: Target, color: '#6E3CFB' },
  { key: 'rewards', label: 'Rewards', Icon: Gift, color: '#F59E0B' },
  { key: 'referral', label: 'Referral', Icon: Users, color: '#A78BFA' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function HomeScreen({ onCheckIn }) {
  const { user, rewards, checkins } = useApp();
  if (!user) return null;

  const featuredRewards = rewards.filter(r => r.featured).slice(0, 3);
  const today = new Date();
  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const checkinDates = new Set(checkins.map(c => c.date));

  // Get current week dates
  const currentDay = today.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    return d;
  });

  return (
    <motion.div
      className="px-5 pt-6 pb-4 space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
      data-testid="home-screen"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden" style={{ border: '2px solid rgba(110,60,251,0.4)' }}>
            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" data-testid="user-avatar" />
          </div>
          <GamiLogo size={28} />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            data-testid="notification-btn"
            className="w-9 h-9 rounded-xl flex items-center justify-center relative"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Bell size={16} style={{ color: 'var(--gami-text-muted)' }} />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2" style={{ borderColor: 'var(--gami-bg)' }} />
          </button>
        </div>
      </motion.div>

      {/* XP Card */}
      <motion.div
        variants={item}
        className="glass-card p-5 relative overflow-hidden"
        data-testid="xp-card"
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full" style={{ background: 'radial-gradient(circle, rgba(110,60,251,0.15) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--gami-text-muted)' }}>Your Points</p>
            <h1 className="text-4xl font-extrabold tracking-tight mt-1" style={{ color: 'var(--gami-text)' }}>
              {user.xp.toLocaleString()}
            </h1>
          </div>
          <button
            data-testid="claim-reward-btn"
            className="px-4 py-2 rounded-xl text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #6E3CFB, #4C1D95)', color: '#fff' }}
          >
            Claim Reward
          </button>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--gami-text-muted)' }}>Point reward</span>
          <span className="ml-auto text-[10px] font-mono" style={{ color: 'var(--gami-text-muted)' }}>{user.xp_to_next.toLocaleString()}</span>
        </div>
        <ProgressBar current={user.xp} max={user.xp_to_next} color="#6E3CFB" height={5} />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item} className="flex gap-3">
        {quickActions.map(({ key, label, Icon, color }) => (
          <button
            key={key}
            data-testid={`action-${key}`}
            onClick={key === 'checkin' ? onCheckIn : undefined}
            className="flex-1 glass-card py-3 px-2 flex flex-col items-center gap-1.5 group"
            style={{ cursor: 'pointer' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${color}15` }}
            >
              <Icon size={16} style={{ color }} />
            </div>
            <span className="text-[10px] font-semibold" style={{ color: 'var(--gami-text-muted)' }}>{label}</span>
          </button>
        ))}
      </motion.div>

      {/* Streak */}
      <motion.div variants={item} className="glass-card p-4" data-testid="streak-section">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame size={16} style={{ color: '#F59E0B' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--gami-text)' }}>Your Streak</span>
          </div>
          <button
            onClick={onCheckIn}
            className="text-[10px] font-semibold"
            style={{ color: '#A78BFA', cursor: 'pointer', background: 'none', border: 'none' }}
            data-testid="view-calendar-btn"
          >
            View Calendar
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, i) => {
            const dateStr = date.toISOString().split('T')[0];
            const isChecked = checkinDates.has(dateStr);
            const isToday = dateStr === today.toISOString().split('T')[0];
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-semibold" style={{ color: 'var(--gami-text-muted)' }}>{dayNames[i]}</span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{
                    background: isChecked ? 'linear-gradient(135deg, #22C55E, #16A34A)' : isToday ? 'rgba(110,60,251,0.15)' : 'rgba(255,255,255,0.04)',
                    color: isChecked ? '#fff' : isToday ? '#A78BFA' : 'var(--gami-text-muted)',
                    border: isToday && !isChecked ? '1px solid rgba(110,60,251,0.3)' : 'none',
                  }}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Zap size={12} style={{ color: '#F59E0B' }} />
          <span className="text-xs font-semibold" style={{ color: 'var(--gami-text)' }}>{user.streak_days} days</span>
          <span className="text-[10px]" style={{ color: 'var(--gami-text-muted)' }}>streak</span>
        </div>
      </motion.div>

      {/* Featured Rewards */}
      <motion.div variants={item} data-testid="featured-rewards">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold" style={{ color: 'var(--gami-text)' }}>Featured Reward</span>
          <span className="text-[10px] font-semibold" style={{ color: '#A78BFA' }}>See All</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {featuredRewards.map((reward, idx) => (
            <div
              key={idx}
              className="glass-card min-w-[160px] overflow-hidden flex-shrink-0 shimmer"
              data-testid={`featured-reward-${idx}`}
            >
              <div className="h-24 overflow-hidden">
                <img src={reward.image} alt={reward.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-3">
                <p className="text-[10px] font-medium truncate" style={{ color: 'var(--gami-text-muted)' }}>{reward.brand}</p>
                <p className="text-xs font-semibold truncate mt-0.5" style={{ color: 'var(--gami-text)' }}>{reward.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-extrabold gradient-text">{reward.cost}</span>
                  <span className="text-[10px]" style={{ color: 'var(--gami-text-muted)' }}>pts</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
