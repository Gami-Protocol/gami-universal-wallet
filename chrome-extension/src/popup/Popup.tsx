import { useState } from 'react';
import { Home, Wallet, Gift, Target, User } from 'lucide-react';
import HomePage from '@/pages/Home';
import WalletPage from '@/pages/Wallet';
import RewardsPage from '@/pages/Rewards';
import QuestsPage from '@/pages/Quests';
import ProfilePage from '@/pages/Profile';
import BottomNav from '@/components/BottomNav';
import GamiButton from '@/components/GamiButton';

type TabId = 'home' | 'wallet' | 'rewards' | 'quests' | 'profile';

const tabs = [
  { id: 'home'    as const, icon: Home,   label: 'Home'    },
  { id: 'wallet'  as const, icon: Wallet, label: 'Wallet'  },
  { id: 'rewards' as const, icon: Gift,   label: 'Rewards' },
  { id: 'quests'  as const, icon: Target, label: 'Quests'  },
  { id: 'profile' as const, icon: User,   label: 'Profile' },
];

/* ── Onboarding screen ── */
type OnboardStep = 'splash' | 'welcome' | 'auth';

function OnboardingSplash({ onNext }: { onNext: () => void }) {
  return (
    <div onClick={onNext} style={{
      width: '100%', height: '100%', background: '#0E0E12', position: 'relative',
      overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace",
    }}>
      {/* Glow blobs */}
      <div className="glow-blob" style={{ width: 220, height: 220, background: '#6E3CFB', top: '-60px', left: '50%', transform: 'translateX(-50%)', opacity: 0.5 }} />
      <div className="glow-blob" style={{ width: 160, height: 160, background: '#FF4FA8', bottom: '60px', right: '-40px', opacity: 0.35 }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 32px' }}>
        {/* ASCII art logo */}
        <pre style={{ fontSize: 11, color: '#9C6CFF', lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '0.04em', fontWeight: 700 }}>
{`  ▄▀█▀▄  ▄▀█▀▄  █▀▄▀█  █
  █ █ █  █▀▀█▀  █ █ █  █
  ▀ ▀ ▀  ▀   ▀  ▀ ▀ ▀  ▀
  W A L L E T`}
        </pre>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', marginBottom: 30 }}>
          {'>'} v1.0.0 · evm · gamified · non-custodial
        </div>
        <div style={{ fontSize: 11, color: '#3FE0A0', lineHeight: 1.7, textAlign: 'left', display: 'inline-block' }}>
          <div>$ gami init</div>
          <div style={{ color: 'rgba(255,255,255,0.5)' }}>{'>'} loading modules [████████░░] 80%</div>
          <div>{'>'} READY <span className="cursor-blink">▊</span></div>
        </div>
        <div style={{ marginTop: 36, fontSize: 9, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.2em' }}>
          ──── TAP ANYWHERE TO BEGIN ────
        </div>
      </div>
    </div>
  );
}

function OnboardingWelcome({ onNext, onLogin }: { onNext: () => void; onLogin: () => void }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#0E0E12', position: 'relative',
      overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '56px 22px 28px',
    }}>
      <div className="glow-blob" style={{ width: 200, height: 200, background: '#6E3CFB', top: '-50px', right: '-50px', opacity: 0.42 }} />
      <div className="glow-blob" style={{ width: 160, height: 160, background: '#FF4FA8', bottom: '-40px', left: '-40px', opacity: 0.32 }} />

      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* NEW PLAYER sticker */}
        <div>
          <div style={{
            display: 'inline-block', background: '#FF4FA8', color: '#000', padding: '4px 10px',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', fontWeight: 700,
            border: '2px solid #000', boxShadow: '3px 3px 0 0 #000', transform: 'rotate(-3deg)', marginBottom: 16,
          }}>NEW PLAYER</div>

          <h1 className="font-display" style={{ fontSize: 40, lineHeight: 0.95, color: '#fff', margin: 0 }}>
            Your wallet,<br />but make it<br />
            <span style={{ color: '#9C6CFF', textShadow: '4px 4px 0 #4B24B8' }}>FUN.</span>
          </h1>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', marginTop: 16 }}>
            {'> '}stack xp on every action<br />
            {'> '}quests pay real rewards<br />
            {'> '}you keep your keys, always
          </p>
        </div>

        {/* Feature grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '20px 0' }}>
          {[
            { icon: '⚡', label: 'XP ON EVERY ACTION',  color: '#FF4FA8' },
            { icon: '🏆', label: 'QUESTS + REWARDS',     color: '#3FE0A0' },
            { icon: '🛡️', label: 'NON-CUSTODIAL',        color: '#9C6CFF' },
            { icon: '🤖', label: 'AI AGENT INSIDE',      color: '#4FE3FF' },
          ].map((f, i) => (
            <div key={i} style={{
              background: 'var(--gami-bg-card)', border: '2px solid #000', boxShadow: '4px 4px 0 0 #000',
              padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <span style={{ fontSize: 18 }}>{f.icon}</span>
              <span className="font-display" style={{ fontSize: 11, color: '#fff', lineHeight: 1.2 }}>{f.label}</span>
            </div>
          ))}
        </div>

        <div>
          <GamiButton variant="primary" onClick={onNext} style={{ width: '100%' }}>
            LET&apos;S GOOO →
          </GamiButton>
          <div style={{ textAlign: 'center', marginTop: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
            Already a player?{' '}
            <button onClick={onLogin} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9C6CFF', textDecoration: 'underline', fontSize: 11, fontFamily: 'inherit' }}>
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OnboardingAuth({ onComplete }: { onComplete: () => void }) {
  const opts = [
    { label: './oauth --google', sub: '> 1-click · web2 friendly', icon: '🌐', primary: false },
    { label: './oauth --apple',  sub: '> face id · ios native',    icon: '🍎', primary: false },
    { label: './import --seed',  sub: '> i have a wallet · 12 words', icon: '🔑', primary: false },
  ];
  return (
    <div style={{
      width: '100%', height: '100%', background: '#0E0E12',
      display: 'flex', flexDirection: 'column', padding: '56px 22px 28px',
      fontFamily: "'JetBrains Mono', monospace", overflow: 'hidden', position: 'relative',
    }}>
      <div className="glow-blob" style={{ width: 180, height: 180, background: '#6E3CFB', top: '-30px', right: '-30px', opacity: 0.4 }} />

      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
        <div>
          <div style={{ fontSize: 10, color: '#9C6CFF', marginBottom: 8, letterSpacing: '0.1em' }}>$ select auth_method</div>
          <h1 className="font-display" style={{ fontSize: 30, color: '#fff', margin: 0, lineHeight: 1 }}>
            how do you<br />enter the system?
          </h1>
        </div>

        {/* Create wallet — primary */}
        <button onClick={onComplete} style={{
          background: '#6E3CFB', border: '2px solid #9C6CFF', padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', width: '100%',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: -10, right: -10, background: '#3FE0A0', color: '#000',
            padding: '3px 8px', fontSize: 10, fontWeight: 700, border: '2px solid #000', transform: 'rotate(6deg)',
          }}>+50 XP</div>
          <div style={{ width: 32, height: 32, background: '#000', border: '1px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
            ✨
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div className="font-display" style={{ fontSize: 13, color: '#fff', letterSpacing: '0.04em' }}>./create_new_wallet</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{'> '}fresh keys · gamified from day 1</div>
          </div>
          <span style={{ color: '#fff', fontSize: 14 }}>→</span>
        </button>

        {/* Other auth options */}
        {opts.map((o, i) => (
          <button key={i} onClick={onComplete} style={{
            background: '#16161D', border: '1.5px solid rgba(255,255,255,0.15)',
            padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
            cursor: 'pointer', width: '100%',
          }}>
            <div style={{ width: 30, height: 30, background: '#000', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
              {o.icon}
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>{o.label}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>{o.sub}</div>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>→</span>
          </button>
        ))}

        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginTop: 4, letterSpacing: '0.1em' }}>
          {'> '}all methods are non-custodial. you own your keys.
        </div>
      </div>
    </div>
  );
}

/* ── Terminal header bar ── */
function TermHeader({ activeTab }: { activeTab: TabId }) {
  const labels: Record<TabId, string> = {
    home: 'gami://dashboard', wallet: 'gami://wallet',
    rewards: 'gami://rewards', quests: 'gami://quests', profile: 'gami://profile',
  };
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '6px 14px', background: '#16161D', borderBottom: '1px solid rgba(110,60,251,0.5)',
      fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.1em', flexShrink: 0,
    }}>
      <span style={{ color: '#9C6CFF' }}>▸ {labels[activeTab]}</span>
      <div style={{ display: 'flex', gap: 4 }}>
        {['#FF4FA8', '#FFB23F', '#3FE0A0'].map((c, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, border: '1px solid #000' }} />
        ))}
      </div>
    </div>
  );
}

/* ── Root Popup ── */
export default function Popup() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [onboardStep, setOnboardStep] = useState<OnboardStep>('splash');
  const [activeTab, setActiveTab] = useState<TabId>('home');

  const renderPage = () => {
    switch (activeTab) {
      case 'home':    return <HomePage />;
      case 'wallet':  return <WalletPage />;
      case 'rewards': return <RewardsPage />;
      case 'quests':  return <QuestsPage />;
      case 'profile': return <ProfilePage />;
    }
  };

  if (!isOnboarded) {
    if (onboardStep === 'splash')  return <OnboardingSplash onNext={() => setOnboardStep('welcome')} />;
    if (onboardStep === 'welcome') return <OnboardingWelcome onNext={() => setOnboardStep('auth')} onLogin={() => setIsOnboarded(true)} />;
    if (onboardStep === 'auth')    return <OnboardingAuth onComplete={() => setIsOnboarded(true)} />;
  }

  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--gami-bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      {/* Scanlines */}
      <div className="scanlines" />

      {/* Glow blobs */}
      <div className="glow-blob" style={{ width: 160, height: 160, background: '#6E3CFB', top: -50, right: -40, opacity: 0.3, pointerEvents: 'none', zIndex: 0 }} />
      <div className="glow-blob" style={{ width: 120, height: 120, background: '#FF4FA8', bottom: 60, left: -30, opacity: 0.2, pointerEvents: 'none', zIndex: 0 }} />

      {/* Terminal header */}
      <TermHeader activeTab={activeTab} />

      {/* Content */}
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 58, position: 'relative', zIndex: 1 }}>
        <div className="fade-in" key={activeTab} style={{ minHeight: '100%' }}>
          {renderPage()}
        </div>
      </main>

      {/* Bottom nav */}
      <BottomNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
