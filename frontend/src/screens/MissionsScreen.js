import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { CheckCircle, UserCheck, Flame, Gift, Search, Store, Users, Disc, Calendar, Trophy, Target, Lock, Repeat } from 'lucide-react';

const iconMap = { 'user-check': UserCheck, 'flame': Flame, 'gift': Gift, 'search': Search, 'store': Store, 'users': Users, 'disc': Disc, 'calendar': Calendar, 'trophy': Trophy, 'target': Target, 'lock': Lock, 'repeat': Repeat };
const anim = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };

export default function MissionsScreen({ onOpenOverlay }) {
  const { missions, completeMission } = useApp();
  const done = missions.filter(m => m.completed).length;

  return (
    <motion.div className="px-4 pt-5 pb-4 space-y-4" variants={stagger} initial="hidden" animate="show" data-testid="missions-screen">
      <motion.div variants={anim}>
        <h2 className="text-xl font-black uppercase tracking-tight" style={{ color: 'var(--gami-text)' }}>Missions</h2>
      </motion.div>

      {/* Progress Header */}
      <motion.div variants={anim} className="neo-card p-4" data-testid="missions-progress-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-black uppercase" style={{ color: 'var(--gami-text)' }}>Quest Progress</h3>
          <span className="text-xs font-black font-mono" style={{ color: '#A78BFA' }}>{done}/{missions.length}</span>
        </div>
        <p className="text-[10px] font-bold" style={{ color: 'var(--gami-text-muted)' }}>Complete tasks & earn XP, tokens, and NFTs</p>
        <div className="neo-progress mt-3">
          <div className="neo-progress-fill" style={{ width: `${(done / missions.length) * 100}%`, background: '#6E3CFB' }} />
        </div>

        {/* Quick links */}
        <div className="flex gap-2 mt-3">
          <button onClick={() => onOpenOverlay('checkin')} className="neo-btn text-[9px] px-3 py-1.5" data-testid="goto-checkin">Daily Check-in</button>
          <button onClick={() => onOpenOverlay('wheels')} className="neo-btn-outline text-[9px] px-3 py-1.5" data-testid="goto-wheels">Spin Wheel</button>
        </div>
      </motion.div>

      {/* Mission List */}
      <motion.div className="space-y-2" variants={stagger} initial="hidden" animate="show">
        {missions.map((m, i) => {
          const Icon = iconMap[m.icon] || Target;
          const hasProg = m.progress !== undefined && m.target !== undefined;
          return (
            <motion.div key={i} variants={anim} className="neo-card-muted p-3 flex items-center gap-3" data-testid={`mission-${i}`}>
              <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: m.completed ? 'rgba(34,197,94,0.15)' : 'rgba(110,60,251,0.1)', border: `2px solid ${m.completed ? '#22C55E' : '#6E3CFB'}` }}>
                {m.completed ? <CheckCircle size={16} color="#22C55E" /> : <Icon size={16} color="#A78BFA" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold" style={{ color: m.completed ? 'var(--gami-text-muted)' : 'var(--gami-text)', textDecoration: m.completed ? 'line-through' : 'none' }}>{m.title}</p>
                {hasProg && !m.completed && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 neo-progress" style={{ height: 4 }}>
                      <div className="neo-progress-fill" style={{ width: `${(m.progress / m.target) * 100}%`, background: '#A78BFA' }} />
                    </div>
                    <span className="text-[9px] font-mono font-bold" style={{ color: 'var(--gami-text-muted)' }}>{m.progress}/{m.target}</span>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                {m.completed ? (
                  <span className="neo-tag" style={{ borderColor: '#22C55E', color: '#22C55E', background: 'rgba(34,197,94,0.08)', fontSize: '9px' }}>Done</span>
                ) : (
                  <button onClick={() => completeMission(m.title)} className="neo-tag" style={{ borderColor: '#22C55E', color: '#22C55E', background: 'rgba(34,197,94,0.1)', cursor: 'pointer', fontSize: '10px' }} data-testid={`complete-mission-${i}`}>
                    +{m.xp_reward} XP
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
