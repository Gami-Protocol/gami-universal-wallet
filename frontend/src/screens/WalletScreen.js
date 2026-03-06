import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ArrowUpRight, ArrowDownLeft, Image, Clock, ChevronRight, Hexagon, Diamond, Zap, Triangle, Layers } from 'lucide-react';

const anim = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

const chainIcons = { 'hexagon': Hexagon, 'diamond': Diamond, 'zap': Zap, 'triangle': Triangle, 'layers': Layers };

const txnIcons = { send: ArrowUpRight, receive: ArrowDownLeft, stake: Clock, swap: ArrowUpRight, claim: ArrowDownLeft, redeem: ArrowUpRight };
const txnColors = { send: '#EF4444', receive: '#22C55E', stake: '#F59E0B', swap: '#3B82F6', claim: '#22C55E', redeem: '#A78BFA' };

export default function WalletScreen() {
  const { tokens, nfts, transactions, networks, user } = useApp();
  const [tab, setTab] = useState('tokens');

  return (
    <motion.div className="px-4 pt-5 pb-4 space-y-5" variants={stagger} initial="hidden" animate="show" data-testid="wallet-screen">
      {/* Header */}
      <motion.div variants={anim}>
        <h2 className="text-xl font-black uppercase tracking-tight" style={{ color: 'var(--gami-text)' }}>Wallet</h2>
        <p className="text-[10px] font-bold font-mono truncate mt-1" style={{ color: 'var(--gami-text-muted)' }}>{user?.wallet_address}</p>
      </motion.div>

      {/* Balance */}
      <motion.div variants={anim} className="neo-card p-5" data-testid="wallet-balance">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--gami-text-muted)' }}>Portfolio Value</p>
        <h1 className="text-3xl font-black font-mono mt-1" style={{ color: 'var(--gami-text)' }}>
          ${user?.total_usd_balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </h1>
        {/* Network pills */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {networks.filter(n => n.active).map((n, i) => {
            const NIcon = chainIcons[n.icon] || Hexagon;
            return (
              <div key={i} className="neo-tag" style={{ borderColor: n.color, color: n.color, background: `${n.color}15` }}>
                <NIcon size={10} /> {n.name}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Switcher */}
      <motion.div variants={anim} className="flex gap-0" data-testid="wallet-tabs">
        {['tokens', 'nfts', 'activity'].map(t => (
          <button
            key={t}
            data-testid={`tab-${t}`}
            onClick={() => setTab(t)}
            className="flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider"
            style={{
              background: tab === t ? '#6E3CFB' : 'var(--gami-card)',
              color: tab === t ? '#fff' : 'var(--gami-text-muted)',
              border: '2px solid #6E3CFB',
              cursor: 'pointer',
              marginRight: t !== 'activity' ? -2 : 0,
            }}
          >
            {t === 'nfts' ? 'NFTs' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Content */}
      {tab === 'tokens' && (
        <motion.div className="space-y-2" variants={stagger} initial="hidden" animate="show">
          {tokens.map((t, i) => (
            <motion.div key={i} variants={anim} className="neo-card-muted p-3 flex items-center justify-between" data-testid={`token-${i}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center font-black text-xs" style={{ background: t.icon_color, color: '#fff', border: `2px solid ${t.icon_color}` }}>
                  {t.symbol.substring(0, 2)}
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: 'var(--gami-text)' }}>{t.name}</p>
                  <p className="text-[10px] font-mono" style={{ color: 'var(--gami-text-muted)' }}>{t.chain}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black font-mono" style={{ color: 'var(--gami-text)' }}>{t.balance.toLocaleString()} {t.symbol}</p>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[10px] font-mono" style={{ color: 'var(--gami-text-muted)' }}>${t.usd_value.toLocaleString()}</span>
                  <span className="text-[10px] font-mono font-bold" style={{ color: t.change_24h >= 0 ? '#22C55E' : '#EF4444' }}>
                    {t.change_24h >= 0 ? '+' : ''}{t.change_24h}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {tab === 'nfts' && (
        <motion.div className="grid grid-cols-2 gap-3" variants={stagger} initial="hidden" animate="show">
          {nfts.map((n, i) => (
            <motion.div key={i} variants={anim} className="neo-card" data-testid={`nft-${i}`}>
              <div className="h-28 overflow-hidden">
                <img src={n.image} alt={n.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-2.5">
                <p className="text-[10px] font-bold" style={{ color: 'var(--gami-text-muted)' }}>{n.collection}</p>
                <p className="text-[11px] font-bold truncate" style={{ color: 'var(--gami-text)' }}>{n.name}</p>
                <div className="neo-tag mt-1.5" style={{
                  borderColor: n.rarity === 'Legendary' ? '#F59E0B' : n.rarity === 'Epic' ? '#A78BFA' : n.rarity === 'Rare' ? '#3B82F6' : 'var(--gami-border-muted)',
                  color: n.rarity === 'Legendary' ? '#F59E0B' : n.rarity === 'Epic' ? '#A78BFA' : n.rarity === 'Rare' ? '#3B82F6' : 'var(--gami-text-muted)',
                  background: 'transparent', fontSize: '8px', padding: '1px 6px',
                }}>
                  {n.rarity}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {tab === 'activity' && (
        <motion.div className="space-y-2" variants={stagger} initial="hidden" animate="show">
          {transactions.map((tx, i) => {
            const TxIcon = txnIcons[tx.type] || ArrowUpRight;
            const color = txnColors[tx.type] || '#6E3CFB';
            const date = new Date(tx.date);
            const timeStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return (
              <motion.div key={i} variants={anim} className="neo-card-muted p-3 flex items-center justify-between" data-testid={`txn-${i}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center" style={{ background: `${color}20`, border: `2px solid ${color}` }}>
                    <TxIcon size={14} color={color} />
                  </div>
                  <div>
                    <p className="text-xs font-bold capitalize" style={{ color: 'var(--gami-text)' }}>{tx.type}</p>
                    <p className="text-[10px]" style={{ color: 'var(--gami-text-muted)' }}>{tx.chain} - {timeStr}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold font-mono" style={{ color: tx.amount < 0 ? '#EF4444' : '#22C55E' }}>
                    {tx.amount < 0 ? '' : '+'}{tx.amount} {tx.token}
                  </p>
                  <span className="neo-tag" style={{ borderColor: '#22C55E', color: '#22C55E', background: 'rgba(34,197,94,0.08)', fontSize: '7px', padding: '0px 4px' }}>
                    {tx.status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
