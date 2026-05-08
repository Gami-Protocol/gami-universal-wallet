import MissionCard from '@/components/MissionCard';

const mockMissions = [
  { id: '1', title: 'Daily Check-in',   description: 'Check in to earn bonus XP',        xpReward: 50,  progress: 1, target: 1, completed: true,  type: 'daily'   as const },
  { id: '2', title: 'Make a Swap',      description: 'Complete any token swap',           xpReward: 100, progress: 0, target: 1, completed: false, type: 'daily'   as const },
  { id: '3', title: 'Send Transaction', description: 'Send tokens to another wallet',     xpReward: 75,  progress: 0, target: 1, completed: false, type: 'daily'   as const },
  { id: '4', title: 'Weekly Streak',    description: 'Check in 7 days in a row',          xpReward: 500, progress: 5, target: 7, completed: false, type: 'weekly'  as const },
  { id: '5', title: 'Bridge Master',    description: 'Bridge tokens to 3 chains',         xpReward: 300, progress: 1, target: 3, completed: false, type: 'weekly'  as const },
  { id: '6', title: 'Early Adopter',    description: 'Use wallet within first month',     xpReward: 1000,progress: 1, target: 1, completed: true,  type: 'special' as const },
];

export default function QuestsPage() {
  const daily   = mockMissions.filter(m => m.type === 'daily');
  const weekly  = mockMissions.filter(m => m.type === 'weekly');
  const special = mockMissions.filter(m => m.type === 'special');
  const completed = mockMissions.filter(m => m.completed).length;
  const xpAvail = mockMissions.filter(m => !m.completed).reduce((s, m) => s + m.xpReward, 0);

  const Section = ({ label, color, missions }: { label: string; color: string; missions: typeof mockMissions }) => (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: '0 2px',
      }}>
        <div style={{ width: 6, height: 6, background: color, border: '1.5px solid #000' }} />
        <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {missions.map(m => <MissionCard key={m.id} {...m} />)}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Header */}
      <div>
        <div className="font-display" style={{ fontSize: 17, color: '#fff' }}>QUESTS</div>
        <div className="font-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', marginTop: 3, lineHeight: 1.5 }}>
          {'> '}{completed}/{mockMissions.length} completed<br />
          {'> '}{xpAvail.toLocaleString()} XP available
        </div>
      </div>

      {/* XP summary bar */}
      <div style={{ background: 'var(--gami-bg-card)', border: '2px solid #000', boxShadow: '4px 4px 0 0 #000', padding: '10px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span className="font-mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>SESSION PROGRESS</span>
          <span className="font-mono" style={{ fontSize: 9, color: '#9C6CFF' }}>{completed}/{mockMissions.length}</span>
        </div>
        <div style={{ height: 5, background: 'rgba(255,255,255,0.08)' }}>
          <div style={{
            height: '100%', width: `${(completed / mockMissions.length) * 100}%`,
            background: '#6E3CFB', boxShadow: '0 0 8px #6E3CFB', transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      <Section label="── DAILY ──"   color="#FFB23F" missions={daily}   />
      <Section label="── WEEKLY ──"  color="#6E3CFB" missions={weekly}  />
      <Section label="── SPECIAL ──" color="#FF4FA8" missions={special} />
    </div>
  );
}
