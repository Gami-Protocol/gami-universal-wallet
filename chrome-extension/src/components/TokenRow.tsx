interface TokenRowProps {
  symbol: string;
  name: string;
  balance: string;
  usdValue: number;
  chain: string;
  logoUrl?: string;
  change24h?: number;
  onClick?: () => void;
}

const chainColors: Record<string, string> = {
  ethereum: '#627EEA', polygon: '#8247E5', arbitrum: '#28A0F0',
  optimism: '#FF0420', base: '#0052FF', solana: '#14F195',
  gami: '#6E3CFB', avalanche: '#E84142', bsc: '#F0B90B',
};

export default function TokenRow({ symbol, name, balance, usdValue, chain, logoUrl, change24h = 0, onClick }: TokenRowProps) {
  const isPositive = change24h >= 0;
  const chainColor = chainColors[chain.toLowerCase()] || '#6E3CFB';

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', background: 'transparent', border: 'none', cursor: 'pointer',
        borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'left',
      }}
    >
      {/* Chain bar */}
      <div style={{ width: 3, height: 36, background: chainColor, flexShrink: 0 }} />

      {/* Token icon */}
      <div style={{
        width: 36, height: 36, background: '#16161D', border: '2px solid #000',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden',
      }}>
        {logoUrl
          ? <img src={logoUrl} alt={symbol} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 12, color: chainColor }}>{symbol.slice(0, 2)}</span>
        }
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: '#fff' }}>{symbol}</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.38)' }}>{name}</span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>{balance}</div>
      </div>

      {/* Value */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 13, color: '#fff' }}>
          ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: isPositive ? '#3FE0A0' : '#FF4FA8', marginTop: 1 }}>
          {isPositive ? '+' : ''}{change24h.toFixed(2)}%
        </div>
      </div>
    </button>
  );
}
