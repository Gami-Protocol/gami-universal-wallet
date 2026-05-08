import { useState } from 'react';
import { Plus, Copy, Check } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import GamiButton from '@/components/GamiButton';
import TokenRow from '@/components/TokenRow';

const mockTokens = [
  { symbol: 'ETH',  name: 'Ethereum',      balance: '1.245',  usdValue: 3102.50, chain: 'ethereum', change24h: 2.34 },
  { symbol: 'GAMI', name: 'Gami Protocol', balance: '15,420', usdValue: 1542.00, chain: 'gami',     change24h: 8.12 },
  { symbol: 'MATIC',name: 'Polygon',       balance: '1,250',  usdValue: 987.50,  chain: 'polygon',  change24h: -1.23 },
  { symbol: 'SOL',  name: 'Solana',        balance: '25.5',   usdValue: 2805.00, chain: 'solana',   change24h: 4.56 },
  { symbol: 'USDC', name: 'USD Coin',      balance: '500.00', usdValue: 500.00,  chain: 'ethereum', change24h: 0.01 },
  { symbol: 'ARB',  name: 'Arbitrum',      balance: '320',    usdValue: 384.00,  chain: 'arbitrum', change24h: 5.67 },
];
const mockNFTs = [
  { id: '1', name: 'Gami Genesis #142', collection: 'Gami Genesis' },
  { id: '2', name: 'Level Badge #7',    collection: 'Gami Badges'   },
];

type WalletTab = 'tokens' | 'nfts' | 'bridge';
const TABS: { id: WalletTab; label: string }[] = [
  { id: 'tokens', label: 'TOKENS' },
  { id: 'nfts',   label: 'NFTS'   },
  { id: 'bridge', label: 'BRIDGE' },
];

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<WalletTab>('tokens');
  const [copied, setCopied] = useState(false);

  const totalBalance = mockTokens.reduce((s, t) => s + t.usdValue, 0);

  const handleCopy = () => {
    navigator.clipboard.writeText('0x1234567890abcdef1234567890abcdef12345678');
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="font-display" style={{ fontSize: 17, color: '#fff' }}>WALLET</div>
        <button onClick={handleCopy} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.12)',
          padding: '5px 10px', cursor: 'pointer',
        }}>
          <span className="font-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>0x1234…5678</span>
          {copied ? <Check size={11} style={{ color: '#3FE0A0' }} /> : <Copy size={11} style={{ color: 'rgba(255,255,255,0.35)' }} />}
        </button>
      </div>

      {/* Balance card */}
      <GlassCard style={{ padding: '16px', textAlign: 'center' }}>
        <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 4 }}>
          ── TOTAL BALANCE ──
        </div>
        <div className="font-display" style={{ fontSize: 32, color: '#fff', lineHeight: 1 }}>
          ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
          {['SEND', 'RECEIVE', 'SWAP'].map(a => (
            <GamiButton key={a} variant="glass" size="sm" style={{ fontSize: 10, flex: 1, padding: '7px 4px', maxWidth: 90 }}>{a}</GamiButton>
          ))}
        </div>
      </GlassCard>

      {/* Tabs */}
      <div style={{ display: 'flex', border: '2px solid #000', boxShadow: '4px 4px 0 0 #000', overflow: 'hidden' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, padding: '9px 4px', cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', fontWeight: 700,
              background: activeTab === tab.id ? 'var(--gami-purple)' : 'var(--gami-bg-card)',
              color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.4)',
              border: 'none', borderRight: tab.id !== 'bridge' ? '1px solid #000' : 'none',
              transition: 'all 0.1s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'tokens' && (
        <div>
          <GlassCard>
            {mockTokens.map(t => <TokenRow key={`${t.chain}-${t.symbol}`} {...t} />)}
          </GlassCard>
          <GamiButton variant="ghost" size="sm" style={{ marginTop: 8, fontSize: 11 }} onClick={() => {}}>
            <Plus size={13} />  ADD TOKEN
          </GamiButton>
        </div>
      )}

      {activeTab === 'nfts' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {mockNFTs.map(nft => (
            <GlassCard key={nft.id} style={{ padding: 10 }}>
              <div style={{
                aspectRatio: '1', background: 'linear-gradient(135deg, var(--gami-purple-soft) 0%, rgba(255,79,168,0.12) 100%)',
                border: '2px solid #000', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 28 }}>🎮</span>
              </div>
              <div className="font-display" style={{ fontSize: 11, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nft.name}</div>
              <div className="font-mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.38)', marginTop: 2 }}>{nft.collection}</div>
            </GlassCard>
          ))}
          <GlassCard style={{ padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '1', cursor: 'pointer', border: '2px dashed rgba(255,255,255,0.15)', boxShadow: 'none' }}>
            <Plus size={22} style={{ color: 'rgba(255,255,255,0.25)' }} />
          </GlassCard>
        </div>
      )}

      {activeTab === 'bridge' && (
        <div className="term-box">
          <div className="term-box-label">BRIDGE // BETA</div>
          <div className="font-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            <div>{'>'} select source chain</div>
            <div>{'>'} select destination chain</div>
            <div>{'>'} enter amount</div>
            <div style={{ color: '#9C6CFF', marginTop: 10 }}>$ bridge --cross-chain<span className="cursor-blink">▊</span></div>
          </div>
          <GamiButton variant="primary" style={{ marginTop: 14 }} onClick={() => {}}>INIT BRIDGE</GamiButton>
        </div>
      )}
    </div>
  );
}
