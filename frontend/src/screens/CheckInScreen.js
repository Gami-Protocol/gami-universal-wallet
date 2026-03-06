import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Flame, Award, Zap } from 'lucide-react';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const milestones = [125, 150, 175, 200];

export default function CheckInScreen({ onBack }) {
  const { user, checkins, doCheckin } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkingIn, setCheckingIn] = useState(false);
  const [toast, setToast] = useState(null);

  const checkinDates = new Set(checkins.map(c => c.date));

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDow = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday start

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const handleCheckin = useCallback(async () => {
    setCheckingIn(true);
    const result = await doCheckin();
    setCheckingIn(false);
    if (result.success) {
      setToast({ message: `Checked in! +${result.xp_earned} XP`, type: 'success' });
    } else {
      setToast({ message: result.message || 'Already checked in today', type: 'info' });
    }
    setTimeout(() => setToast(null), 2500);
  }, [doCheckin]);

  const today = new Date().toISOString().split('T')[0];
  const todayChecked = checkinDates.has(today);

  return (
    <motion.div
      className="px-5 pt-6 pb-4 space-y-5"
      variants={container}
      initial="hidden"
      animate="show"
      data-testid="checkin-screen"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center gap-3">
        <button
          data-testid="back-btn"
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
        >
          <ChevronLeft size={18} style={{ color: 'var(--gami-text)' }} />
        </button>
        <h2 className="text-lg font-bold" style={{ color: 'var(--gami-text)' }}>Daily Check-In</h2>
      </motion.div>

      {/* Streak Counter */}
      <motion.div variants={item} className="text-center py-4">
        <h1 className="text-6xl font-extrabold tracking-tighter gradient-text" data-testid="streak-count">
          {user?.streak_days || 0}
        </h1>
        <p className="text-xs mt-1" style={{ color: 'var(--gami-text-muted)' }}>Days in a row</p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <Flame size={14} style={{ color: '#F59E0B' }} />
          <p className="text-xs" style={{ color: 'var(--gami-text-muted)' }}>
            You managed to maintain the Perfect Streak for {Math.floor((user?.streak_days || 0) / 7)} weeks.
          </p>
        </div>
      </motion.div>

      {/* Calendar */}
      <motion.div variants={item} className="glass-card p-4" data-testid="streak-calendar">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <ChevronLeft size={18} style={{ color: 'var(--gami-text-muted)' }} />
          </button>
          <span className="text-sm font-bold" style={{ color: 'var(--gami-text)' }}>{monthName}</span>
          <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <ChevronRight size={18} style={{ color: 'var(--gami-text-muted)' }} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-center text-[10px] font-semibold" style={{ color: 'var(--gami-text-muted)' }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset (Sunday start) */}
          {Array.from({ length: firstDay.getDay() }, (_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isChecked = checkinDates.has(dateStr);
            const isToday = dateStr === today;

            return (
              <div
                key={day}
                className="w-full aspect-square flex items-center justify-center rounded-lg text-xs font-bold"
                style={{
                  background: isChecked ? 'linear-gradient(135deg, #22C55E, #16A34A)' : isToday ? 'rgba(110,60,251,0.15)' : 'transparent',
                  color: isChecked ? '#fff' : isToday ? '#A78BFA' : 'var(--gami-text-muted)',
                  border: isToday && !isChecked ? '1px solid rgba(110,60,251,0.3)' : 'none',
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Target Milestones */}
      <motion.div variants={item} data-testid="milestones">
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--gami-text-muted)' }}>Target Sequence</p>
        <div className="flex gap-2">
          {milestones.map((ms, i) => {
            const reached = (user?.streak_days || 0) >= ms;
            return (
              <div
                key={i}
                className="flex-1 py-2 rounded-xl text-center text-xs font-bold"
                style={{
                  background: reached ? 'linear-gradient(135deg, #22C55E, #16A34A)' : 'rgba(255,255,255,0.04)',
                  color: reached ? '#fff' : 'var(--gami-text-muted)',
                  border: reached ? 'none' : '1px solid rgba(255,255,255,0.06)',
                }}
                data-testid={`milestone-${ms}`}
              >
                {ms}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Check-In Button */}
      <motion.div variants={item}>
        <button
          data-testid="checkin-btn"
          onClick={handleCheckin}
          disabled={checkingIn || todayChecked}
          className="w-full py-4 rounded-2xl text-sm font-bold"
          style={{
            background: todayChecked ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg, #22C55E, #16A34A)',
            color: todayChecked ? '#22C55E' : '#fff',
            border: 'none',
            cursor: todayChecked ? 'default' : 'pointer',
            opacity: checkingIn ? 0.6 : 1,
          }}
        >
          {todayChecked ? 'Checked In Today' : checkingIn ? 'Checking in...' : 'Check In'}
        </button>
      </motion.div>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl text-sm font-semibold z-50"
          style={{
            background: toast.type === 'success' ? 'rgba(34,197,94,0.9)' : 'rgba(110,60,251,0.9)',
            color: '#fff',
            backdropFilter: 'blur(12px)',
          }}
          data-testid="checkin-toast"
        >
          {toast.message}
        </motion.div>
      )}
    </motion.div>
  );
}
