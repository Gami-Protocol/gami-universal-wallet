import { useState, useEffect } from 'react';
import { RefreshCw, Zap, Flame, Copy, Check, Sparkles } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import GamiButton from '@/components/GamiButton';
import XPBadge from '@/components/XPBadge';
import TokenRow from '@/components/TokenRow';
import { useGamiSDK } from '@/hooks/useMultiChain';

const mockUser = { level: 12, totalXP: 4250, xpToNextLevel: 1000, streak: 7 };
const mockTokens = [
  { symbol: 'ETH',  name: 'Ethereum',      balance: '1.245',  usdValue: 3102.50, chain: 'ethereum', change24h: 2.34 },
  { symbol: 'GAMI', name: 'Gami Protocol', balance: '15,420', usdValue: 1542.00, chain: 'gami',     change24h: 8.12 },
  { symbol: 'SOL',  name: 'Solana',        balance: '25.5',   usdValue: 2805.00, chain: 'solana',   change24h: 4.56 },
];

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { currentSiteDetected, checkCurrentTab } = useGamiSDK();
  const totalBalance = mockTokens.reduce((s, t) => s + t.usdValue, 0);
  const currentXP = mockUser.totalXP % 1000;

  useEffect(() => { checkCurrentTab(); }, [checkCurrentTab]);

  const handleSync = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText('0x7f3aAbCd1234567890ABCDEF1234567890b29c');
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* SDK banner */}
      {currentSiteDetected && (
        <div className="fade-in" style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
          background: 'rgba(110,60,251,0.1)', border: '1.5px solid var(--gami-purple)',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--gami-purple-light)',
        }}>
          <Sparkles size={12} />
          ▸ GAMI SDK DETECTED — QUESTS AVAILABLE
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="font-display" style={{ fontSize: 17, color: '#fff', letterSpacing: '-0.01em' }}>GAMI WALLET</div>
          <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 2 }}>
            <span className="font-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>0x7f3a…b29c</span>
            {copied ? <Check size={10} style={{ color: '#3FE0A0' }} /> : <Copy size={10} style={{ color: 'rgba(255,255,255,0.3)' }} />}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '5px 8px',
            background: 'rgba(255,178,63,0.1)', border: '1.5px solid #FFB23F',
          }}>
            <Flame size={11} style={{ color: '#FFB23F' }} />
            <span className="font-mono" style={{ fontSize: 10, color: '#FFB23F', fontWeight: 700 }}>{mockUser.streak}D</span>
          </div>
          <GamiButton variant="glass" size="sm" onClick={handleSync} loading={loading} style={{ padding: '5px 9px' }}>
            {!loading && <RefreshCw size={12} />}
          </GamiButton>
        </div>
      </div>

      {/* Hero card */}
      <GlassCard style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
        <XPBadge level={mockUser.level} currentXP={currentXP} maxXP={1000} size="sm" />
        <div style={{ flex: 1 }}>
          <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 2 }}>
            TOTAL BALANCE
          </div>
          <div className="font-display" style={{ fontSize: 26, color: '#fff', lineHeight: 1 }}>
            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="font-mono" style={{ fontSize: 9, color: '#9C6CFF', marginTop: 4 }}>
            {currentXP}/{mockUser.xpToNextLevel} XP → LVL {mockUser.level + 1}
          </div>
        </div>
      </GlassCard>

      {/* Check-in CTA */}
      <GamiButton variant="primary" onClick={() => {}}>
        <Zap size={13} />
        DAILY CHECK-IN  +50 XP
      </GamiButton>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
        {['SEND', 'RECEIVE', 'SWAP'].map(act => (
          <GamiButton key={act} variant="glass" size="sm" style={{ fontSize: 10, padding: '9px 4px' }}>{act}</GamiButton>
        ))}
      </div>

      {/* Assets */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2px', marginBottom: 6 }}>
          <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>▸ ASSETS</span>
          <span className="font-mono" style={{ fontSize: 9, color: 'var(--gami-purple-light)', cursor: 'pointer' }}>VIEW ALL →</span>
        </div>
        <GlassCard>
          {mockTokens.map(t => <TokenRow key={`${t.chain}-${t.symbol}`} {...t} />)}
        </GlassCard>
      </div>
    </div>
  );
}
