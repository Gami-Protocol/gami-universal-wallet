import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';

const anim = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const milestones = [125, 150, 175, 200];

export default function CheckInScreen({ onBack }) {
  const { user, checkins, doCheckin } = useApp();
  const [month, setMonth] = useState(new Date());
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const dates = new Set(checkins.map(c => c.date));
  const y = month.getFullYear(), m = month.getMonth();
  const label = month.toLocaleString('default', { month: 'long', year: 'numeric' });
  const days = new Date(y, m + 1, 0).getDate();
  const startDow = new Date(y, m, 1).getDay();
  const today = new Date().toISOString().split('T')[0];
  const checked = dates.has(today);

  const handleCheckin = useCallback(async () => {
    setBusy(true);
    const r = await doCheckin();
    setBusy(false);
    setToast({ msg: r.success ? `+${r.xp_earned} XP` : (r.message || 'Already done'), ok: r.success });
    setTimeout(() => setToast(null), 2500);
  }, [doCheckin]);

  return (
    <motion.div className="px-4 pt-5 pb-4 space-y-5" variants={stagger} initial="hidden" animate="show" data-testid="checkin-screen">
      <motion.div variants={anim} className="flex items-center gap-3">
        <button data-testid="back-btn" onClick={onBack} className="w-8 h-8 flex items-center justify-center" style={{ background: 'var(--gami-card)', border: '2px solid var(--gami-border)', boxShadow: '2px 2px 0px var(--gami-deep)', cursor: 'pointer' }}>
          <ChevronLeft size={16} style={{ color: 'var(--gami-text)' }} />
        </button>
        <h2 className="text-lg font-black uppercase" style={{ color: 'var(--gami-text)' }}>Daily Check-In</h2>
      </motion.div>

      <motion.div variants={anim} className="text-center py-3">
        <h1 className="text-5xl font-black font-mono gradient-text" data-testid="streak-count">{user?.streak_days || 0}</h1>
        <p className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: 'var(--gami-text-muted)' }}>Days in a row</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Flame size={12} color="#F59E0B" />
          <span className="text-[10px]" style={{ color: 'var(--gami-text-muted)' }}>Perfect Streak for {Math.floor((user?.streak_days || 0) / 7)} weeks</span>
        </div>
      </motion.div>

      <motion.div variants={anim} className="neo-card p-4" data-testid="streak-calendar">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setMonth(new Date(y, m - 1, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><ChevronLeft size={16} style={{ color: 'var(--gami-text-muted)' }} /></button>
          <span className="text-xs font-black uppercase" style={{ color: 'var(--gami-text)' }}>{label}</span>
          <button onClick={() => setMonth(new Date(y, m + 1, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><ChevronRight size={16} style={{ color: 'var(--gami-text-muted)' }} /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-center text-[9px] font-bold" style={{ color: 'var(--gami-text-muted)' }}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startDow }, (_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: days }, (_, i) => {
            const day = i + 1;
            const ds = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isChecked = dates.has(ds);
            const isToday = ds === today;
            return (
              <div key={day} className="w-full aspect-square flex items-center justify-center text-[10px] font-bold"
                style={{
                  background: isChecked ? '#22C55E' : isToday ? 'rgba(110,60,251,0.15)' : 'transparent',
                  color: isChecked ? '#000' : isToday ? '#6E3CFB' : 'var(--gami-text-muted)',
                  border: isToday && !isChecked ? '2px solid #6E3CFB' : isChecked ? '2px solid #16A34A' : '1px solid var(--gami-border-muted)',
                }}>
                {day}
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={anim} data-testid="milestones">
        <p className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: 'var(--gami-text-muted)' }}>Target Sequence</p>
        <div className="flex gap-2">
          {milestones.map((ms, i) => {
            const reached = (user?.streak_days || 0) >= ms;
            return (
              <div key={i} className="flex-1 py-2 text-center text-xs font-black" data-testid={`milestone-${ms}`}
                style={{
                  background: reached ? '#22C55E' : 'var(--gami-card)',
                  color: reached ? '#000' : 'var(--gami-text-muted)',
                  border: reached ? '2px solid #16A34A' : '2px solid var(--gami-border-muted)',
                  boxShadow: reached ? '3px 3px 0px #16A34A' : 'none',
                }}>
                {ms}
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={anim}>
        <button data-testid="checkin-btn" onClick={handleCheckin} disabled={busy || checked}
          className={checked ? 'neo-btn-outline w-full py-3.5 text-xs' : 'neo-btn-success w-full py-3.5 text-xs'}
          style={{ opacity: busy ? 0.6 : 1, cursor: checked ? 'default' : 'pointer' }}>
          {checked ? 'CHECKED IN TODAY' : busy ? 'CHECKING IN...' : 'CHECK IN'}
        </button>
      </motion.div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-3 text-xs font-bold z-50"
          style={{ background: toast.ok ? '#22C55E' : '#6E3CFB', color: toast.ok ? '#000' : '#fff', border: `3px solid ${toast.ok ? '#16A34A' : '#4C1D95'}`, boxShadow: `3px 3px 0px ${toast.ok ? '#16A34A' : '#4C1D95'}` }}
          data-testid="checkin-toast">{toast.msg}</motion.div>
      )}
    </motion.div>
  );
}
