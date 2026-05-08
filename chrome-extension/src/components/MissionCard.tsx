interface MissionCardProps {
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  target: number;
  completed: boolean;
  type: 'daily' | 'weekly' | 'special';
  onClick?: () => void;
}

const typeConfig = {
  daily:   { label: 'DAILY',   color: '#FFB23F', borderColor: '#FFB23F' },
  weekly:  { label: 'WEEKLY',  color: '#6E3CFB', borderColor: '#6E3CFB' },
  special: { label: 'SPECIAL', color: '#FF4FA8', borderColor: '#FF4FA8' },
};

export default function MissionCard({ title, description, xpReward, progress, target, completed, type, onClick }: MissionCardProps) {
  const pct = Math.min((progress / target) * 100, 100);
  const cfg = typeConfig[type];

  return (
    <button
      onClick={onClick}
      disabled={completed}
      style={{
        width: '100%', textAlign: 'left', cursor: completed ? 'default' : 'pointer',
        background: completed ? 'rgba(63,224,160,0.07)' : 'var(--gami-bg-card)',
        border: `2px solid ${completed ? '#3FE0A0' : '#000'}`,
        boxShadow: completed ? '4px 4px 0 0 #3FE0A0' : '4px 4px 0 0 #000',
        padding: '12px 14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Type badge */}
          <span style={{
            display: 'inline-block', padding: '2px 8px', marginBottom: 6,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.15em',
            background: `${cfg.color}18`, border: `1.5px solid ${cfg.color}`, color: cfg.color,
          }}>
            ▸ {cfg.label}
          </span>

          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: completed ? 'rgba(255,255,255,0.45)' : '#fff', marginBottom: 3 }}>
            {title}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.45)', marginBottom: 10, lineHeight: 1.4 }}>
            {'> '}{description}
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${pct}%`, background: completed ? '#3FE0A0' : '#6E3CFB',
              transition: 'width 0.5s ease',
              boxShadow: completed ? '0 0 6px #3FE0A0' : '0 0 6px #6E3CFB',
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.38)' }}>{progress}/{target}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#9C6CFF', fontWeight: 700 }}>+{xpReward} XP</span>
          </div>
        </div>

        {completed && (
          <div style={{
            width: 28, height: 28, background: '#3FE0A0', border: '2px solid #000',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round">
              <path d="M4 12l5 5L20 6" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}
