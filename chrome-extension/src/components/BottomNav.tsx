import { LucideIcon } from 'lucide-react';

interface Tab<T extends string = string> {
  id: T;
  icon: LucideIcon;
  label: string;
}

interface BottomNavProps<T extends string = string> {
  tabs: Tab<T>[];
  activeTab: T;
  onTabChange: (id: T) => void;
}

export default function BottomNav<T extends string>({ tabs, activeTab, onTabChange }: BottomNavProps<T>) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: 58,
      background: '#0E0E12', borderTop: '2px solid #000',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      zIndex: 50, padding: '0 4px',
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 2, width: 60, height: 46, cursor: 'pointer',
              background: isActive ? 'var(--gami-purple-soft)' : 'transparent',
              border: isActive ? '1.5px solid var(--gami-purple)' : '1.5px solid transparent',
              transition: 'all 0.12s',
            }}
          >
            <Icon
              size={18}
              style={{ color: isActive ? 'var(--gami-purple-light)' : 'rgba(255,255,255,0.38)', transition: 'color 0.12s' }}
            />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: isActive ? 'var(--gami-purple-light)' : 'rgba(255,255,255,0.35)',
              transition: 'color 0.12s',
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
