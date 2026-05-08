import { useState } from 'react';
import { Copy, Check, Settings } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import GamiButton from '@/components/GamiButton';
import XPBadge from '@/components/XPBadge';

const address = '0x1234567890abcdef1234567890abcdef12345678';
const shortAddress = `${address.slice(0, 6)}…${address.slice(-4)}`;
const userData = { level: 12, totalXP: 4250, streak: 7, joinedAt: 'JAN 2024' };
const badges = [
  { id: '1', name: 'Early Adopter', icon: '🚀', earned: true  },
  { id: '2', name: 'Week Warrior',  icon: '⚔️', earned: true  },
  { id: '3', name: 'DeFi Explorer', icon: '🧭', earned: true  },
  { id: '4', name: 'NFT Collector', icon: '🎨', earned: false },
  { id: '5', name: 'Bridge Master', icon: '🌉', earned: false },
  { id: '6', name: 'Staking Pro',   icon: '💎', earned: false },
];
const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const checkins = [true, true, true, true, true, false, false];

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);
  const currentXP = userData.totalXP % 1000;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="font-display" style={{ fontSize: 17, color: '#fff' }}>PROFILE</div>
        <GamiButton variant="glass" size="sm" style={{ padding: '6px 9px' }} onClick={() => {}}>
          <Settings size={13} />
        </GamiButton>
      </div>

      {/* Identity card */}
      <GlassCard variant="purple" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Avatar */}
          <div style={{
            width: 52, height: 52, background: 'linear-gradient(135deg, #6E3CFB 0%, #FF4FA8 100%)',
            border: '2.5px solid #000', boxShadow: '4px 4px 0 0 #000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: '#fff',
            flexShrink: 0,
          }}>
            PX
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="font-display" style={{ fontSize: 15, color: '#fff', marginBottom: 3 }}>Player_0x7f3a</div>
            <button onClick={handleCopy} style={{
              display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}>
              <span className="font-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{shortAddress}</span>
              {copied ? <Check size={10} style={{ color: '#3FE0A0' }} /> : <Copy size={10} style={{ color: 'rgba(255,255,255,0.3)' }} />}
            </button>
            <div style={{ marginTop: 4 }}>
              <span className="gami-pill gami-pill-purple" style={{ fontSize: 9 }}>⚡ LVL {userData.level}</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* XP ring */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
        <XPBadge level={userData.level} currentXP={currentXP} maxXP={1000} size="md" />
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
        {[
          { label: 'STREAK', value: `${userData.streak}D`, color: '#FFB23F' },
          { label: 'BADGES',  value: `${badges.filter(b => b.earned).length}`, color: '#9C6CFF' },
          { label: 'JOINED',  value: userData.joinedAt, color: '#3FE0A0' },
        ].map(s => (
          <GlassCard key={s.label} style={{ padding: '10px 8px', textAlign: 'center' }}>
            <div className="font-display" style={{ fontSize: 18, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div className="font-mono" style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', marginTop: 3, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{s.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Weekly check-ins */}
      <GlassCard style={{ padding: '12px 14px' }}>
        <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', marginBottom: 10 }}>
          ── WEEKLY STREAK ──
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {weekDays.map((day, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 30, height: 30, border: `2px solid ${checkins[i] ? '#3FE0A0' : 'rgba(255,255,255,0.12)'}`,
                background: checkins[i] ? 'rgba(63,224,160,0.15)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: checkins[i] ? '0 0 8px rgba(63,224,160,0.4)' : 'none',
              }}>
                {checkins[i] && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3FE0A0" strokeWidth="3" strokeLinecap="round">
                    <path d="M4 12l5 5L20 6" />
                  </svg>
                )}
              </div>
              <span className="font-mono" style={{ fontSize: 8, color: checkins[i] ? '#3FE0A0' : 'rgba(255,255,255,0.3)' }}>{day}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Badges */}
      <GlassCard style={{ padding: '12px 14px' }}>
        <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', marginBottom: 10 }}>
          ── BADGES ──
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
          {badges.map(b => (
            <div key={b.id} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              opacity: b.earned ? 1 : 0.28,
            }}>
              <div style={{
                width: 36, height: 36, background: b.earned ? 'var(--gami-purple-soft)' : 'rgba(255,255,255,0.04)',
                border: `2px solid ${b.earned ? 'var(--gami-purple)' : 'rgba(255,255,255,0.1)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>
                {b.icon}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Settings / logout */}
      <GamiButton variant="ghost" size="sm" style={{ fontSize: 11, marginTop: 2 }} onClick={() => {}}>
        SETTINGS &amp; SECURITY
      </GamiButton>
    </div>
  );
}
