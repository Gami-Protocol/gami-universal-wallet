import { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import GamiButton from '@/components/GamiButton';

const categories = ['ALL', 'DIGITAL', 'PHYSICAL', 'EXCLUSIVE'];
const mockRewards = [
  { id: '1', title: 'Discord Nitro',   description: '1 month subscription',  cost: 500,  category: 'DIGITAL',   available: true,  icon: '🎮' },
  { id: '2', title: 'NFT Airdrop',     description: 'Exclusive Gami NFT',    cost: 1000, category: 'EXCLUSIVE', available: true,  icon: '🏆' },
  { id: '3', title: 'Gami Hoodie',     description: 'Limited edition merch', cost: 2500, category: 'PHYSICAL',  available: true,  icon: '👕' },
  { id: '4', title: 'VIP Access Pass', description: 'Early feature access',  cost: 750,  category: 'EXCLUSIVE', available: true,  icon: '⚡' },
  { id: '5', title: 'Gift Card $10',   description: 'Amazon gift card',      cost: 1200, category: 'DIGITAL',   available: false, icon: '🎁' },
];

export default function RewardsPage() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const userPoints = 1250;
  const filtered = activeCategory === 'ALL' ? mockRewards : mockRewards.filter(r => r.category === activeCategory);

  return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="font-display" style={{ fontSize: 17, color: '#fff' }}>REWARDS</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
          background: 'var(--gami-purple-soft)', border: '1.5px solid var(--gami-purple)',
        }}>
          <span style={{ fontSize: 13 }}>⚡</span>
          <span className="font-mono" style={{ fontSize: 11, color: 'var(--gami-purple-light)', fontWeight: 700 }}>{userPoints.toLocaleString()} PTS</span>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 5, overflowX: 'auto', paddingBottom: 2 }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="font-mono"
            style={{
              padding: '5px 10px', fontSize: 9, letterSpacing: '0.12em', cursor: 'pointer',
              whiteSpace: 'nowrap', background: activeCategory === cat ? '#6E3CFB' : 'var(--gami-bg-card)',
              color: activeCategory === cat ? '#fff' : 'rgba(255,255,255,0.45)',
              border: `2px solid ${activeCategory === cat ? '#000' : 'rgba(255,255,255,0.1)'}`,
              boxShadow: activeCategory === cat ? '3px 3px 0 0 #000' : 'none',
              transition: 'all 0.1s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rewards list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(reward => {
          const canAfford = userPoints >= reward.cost;
          return (
            <GlassCard
              key={reward.id}
              style={{ padding: '12px 14px', opacity: reward.available ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: 12 }}
            >
              {/* Icon */}
              <div style={{
                width: 40, height: 40, background: 'var(--gami-purple-soft)',
                border: '2px solid var(--gami-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>
                {reward.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="font-display" style={{ fontSize: 13, color: '#fff', marginBottom: 1 }}>{reward.title}</div>
                <div className="font-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{'> '}{reward.description}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 11 }}>⚡</span>
                    <span className="font-mono" style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>{reward.cost.toLocaleString()}</span>
                  </div>
                  <GamiButton
                    variant={canAfford && reward.available ? 'success' : 'glass'}
                    size="sm"
                    style={{ fontSize: 10, padding: '5px 12px' }}
                    disabled={!canAfford || !reward.available}
                    onClick={() => {}}
                  >
                    {!reward.available ? 'SOLD OUT' : canAfford ? 'REDEEM' : 'NEED MORE'}
                  </GamiButton>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
