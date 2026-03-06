import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ProgressBar, XPBadge } from '../components/UIComponents';
import { CheckCircle, Circle, UserCheck, Flame, Gift, Search, Store, Users, Disc, Calendar, Trophy, Target } from 'lucide-react';

const iconMap = {
  'user-check': UserCheck,
  'flame': Flame,
  'gift': Gift,
  'search': Search,
  'store': Store,
  'users': Users,
  'disc': Disc,
  'calendar': Calendar,
  'trophy': Trophy,
  'target': Target,
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function PointsScreen() {
  const { missions, completeMission, user } = useApp();

  const completedCount = missions.filter(m => m.completed).length;
  const totalCount = missions.length;

  return (
    <motion.div
      className="px-5 pt-6 pb-4 space-y-5"
      variants={container}
      initial="hidden"
      animate="show"
      data-testid="points-screen"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--gami-text)' }}>Point</h2>
      </motion.div>

      {/* Missions Progress Card */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-3xl p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(110,60,251,0.25), rgba(76,29,149,0.15))',
          border: '1px solid rgba(110,60,251,0.2)',
        }}
        data-testid="missions-progress-card"
      >
        <div className="absolute top-0 right-0 w-28 h-28 rounded-full" style={{ background: 'radial-gradient(circle, rgba(110,60,251,0.2) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <h3 className="text-lg font-bold" style={{ color: 'var(--gami-text)' }}>Missions</h3>
        <p className="text-xs mt-1" style={{ color: 'var(--gami-text-muted)' }}>Complete tasks & earn more points</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar current={completedCount} max={totalCount} color="#6E3CFB" height={6} />
          </div>
          <span className="text-xs font-bold" style={{ color: '#A78BFA' }}>{completedCount}/{totalCount}</span>
        </div>
      </motion.div>

      {/* Mission List */}
      <motion.div className="space-y-2" variants={container} initial="hidden" animate="show">
        {missions.map((mission, idx) => {
          const IconComp = iconMap[mission.icon] || Target;
          const hasProgress = mission.progress !== undefined && mission.target !== undefined;

          return (
            <motion.div
              key={idx}
              variants={item}
              className="glass-card p-4 flex items-center gap-3"
              data-testid={`mission-${idx}`}
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: mission.completed ? 'rgba(34,197,94,0.15)' : 'rgba(110,60,251,0.1)',
                }}
              >
                {mission.completed ? (
                  <CheckCircle size={18} style={{ color: '#22C55E' }} />
                ) : (
                  <IconComp size={18} style={{ color: '#A78BFA' }} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{
                      color: mission.completed ? 'var(--gami-text-muted)' : 'var(--gami-text)',
                      textDecoration: mission.completed ? 'line-through' : 'none',
                    }}
                  >
                    {mission.title}
                  </p>
                </div>
                {hasProgress && !mission.completed && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1">
                      <ProgressBar current={mission.progress} max={mission.target} color="#A78BFA" height={3} />
                    </div>
                    <span className="text-[10px] font-mono" style={{ color: 'var(--gami-text-muted)' }}>
                      {mission.progress}/{mission.target}
                    </span>
                  </div>
                )}
              </div>

              {/* XP Badge / Complete */}
              <div className="flex-shrink-0">
                {mission.completed ? (
                  <div className="pill" style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', fontSize: '10px' }}>
                    Done
                  </div>
                ) : (
                  <button
                    onClick={() => completeMission(mission.title)}
                    className="pill"
                    style={{
                      background: 'rgba(34,197,94,0.15)',
                      color: '#22C55E',
                      cursor: 'pointer',
                      border: 'none',
                      fontSize: '11px',
                    }}
                    data-testid={`complete-mission-${idx}`}
                  >
                    +{mission.xp_reward} XP
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div variants={item} className="text-center pt-2">
        <span className="text-xs font-semibold" style={{ color: '#A78BFA' }}>See All Missions</span>
      </motion.div>
    </motion.div>
  );
}
