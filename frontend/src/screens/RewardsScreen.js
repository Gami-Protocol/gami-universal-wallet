import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Search, Grid3X3, List } from 'lucide-react';

const categories = ['All', 'Voucher', 'Digital', 'NFT', 'Gadget'];
const anim = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };

export default function RewardsScreen() {
  const { rewards, redeemReward, fetchRewards, user } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [redeeming, setRedeeming] = useState(null);
  const [toast, setToast] = useState(null);

  const handleCat = (c) => { const v = c.toLowerCase(); setCategory(v); fetchRewards(v, search); };
  const handleSearch = (v) => { setSearch(v); fetchRewards(category, v); };
  const handleRedeem = async (title, cost) => {
    if (user.xp < cost) { setToast({ msg: 'Not enough XP!', ok: false }); setTimeout(() => setToast(null), 2500); return; }
    setRedeeming(title);
    const r = await redeemReward(title);
    setRedeeming(null);
    setToast({ msg: r.message || 'Done!', ok: r.success });
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <motion.div className="px-4 pt-5 pb-4 space-y-4" variants={stagger} initial="hidden" animate="show" data-testid="rewards-screen">
      <motion.div variants={anim}>
        <h2 className="text-xl font-black uppercase tracking-tight" style={{ color: 'var(--gami-text)' }}>Rewards</h2>
      </motion.div>

      {/* Search */}
      <motion.div variants={anim} className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 h-10" style={{ background: 'var(--gami-card)', border: '2px solid var(--gami-border-muted)' }}>
          <Search size={14} style={{ color: 'var(--gami-text-muted)' }} />
          <input
            data-testid="reward-search"
            type="text" value={search} onChange={e => handleSearch(e.target.value)}
            placeholder="Search rewards..."
            className="bg-transparent border-none outline-none text-xs flex-1 font-bold"
            style={{ color: 'var(--gami-text)', fontFamily: 'Outfit' }}
          />
        </div>
        <button data-testid="view-list-btn" onClick={() => setViewMode('list')} className="w-10 h-10 flex items-center justify-center" style={{ background: viewMode === 'list' ? '#6E3CFB' : 'var(--gami-card)', border: '2px solid #6E3CFB', cursor: 'pointer' }}>
          <List size={14} style={{ color: viewMode === 'list' ? '#fff' : 'var(--gami-text-muted)' }} />
        </button>
        <button data-testid="view-grid-btn" onClick={() => setViewMode('grid')} className="w-10 h-10 flex items-center justify-center" style={{ background: viewMode === 'grid' ? '#6E3CFB' : 'var(--gami-card)', border: '2px solid #6E3CFB', cursor: 'pointer' }}>
          <Grid3X3 size={14} style={{ color: viewMode === 'grid' ? '#fff' : 'var(--gami-text-muted)' }} />
        </button>
      </motion.div>

      {/* Categories */}
      <motion.div variants={anim} className="flex gap-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {categories.map(c => (
          <button
            key={c}
            data-testid={`category-${c.toLowerCase()}`}
            onClick={() => handleCat(c)}
            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
            style={{
              background: category === c.toLowerCase() ? '#6E3CFB' : 'transparent',
              color: category === c.toLowerCase() ? '#fff' : 'var(--gami-text-muted)',
              border: '2px solid #6E3CFB',
              cursor: 'pointer',
              marginRight: -2,
            }}
          >
            {c}
          </button>
        ))}
      </motion.div>

      {/* Reward Cards */}
      <motion.div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'} variants={stagger} initial="hidden" animate="show">
        {rewards.map((r, i) => (
          <motion.div key={i} variants={anim} className="neo-card" data-testid={`reward-card-${i}`}>
            {viewMode === 'list' ? (
              <div className="flex">
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
                  <img src={r.image} alt={r.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--gami-text-muted)' }}>{r.brand}</p>
                    <p className="text-xs font-bold" style={{ color: 'var(--gami-text)' }}>{r.title}</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-black font-mono gradient-text">{r.cost}<span className="text-[9px]" style={{ color: 'var(--gami-text-muted)' }}> pts</span></span>
                    <button
                      data-testid={`redeem-btn-${i}`}
                      onClick={() => handleRedeem(r.title, r.cost)}
                      disabled={redeeming === r.title}
                      className="neo-btn text-[9px] px-3 py-1.5"
                      style={{ opacity: redeeming === r.title ? 0.6 : 1, background: user?.xp >= r.cost ? '#6E3CFB' : 'var(--gami-card)', color: user?.xp >= r.cost ? '#fff' : 'var(--gami-text-muted)' }}
                    >
                      {redeeming === r.title ? '...' : 'Redeem'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="h-24 overflow-hidden"><img src={r.image} alt={r.title} className="w-full h-full object-cover" loading="lazy" /></div>
                <div className="p-2.5">
                  <p className="text-[9px] font-bold uppercase" style={{ color: 'var(--gami-text-muted)' }}>{r.brand}</p>
                  <p className="text-[11px] font-bold truncate" style={{ color: 'var(--gami-text)' }}>{r.title}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-sm font-black font-mono gradient-text">{r.cost}</span>
                    <button onClick={() => handleRedeem(r.title, r.cost)} className="text-[8px] font-bold uppercase px-2 py-1" style={{ background: '#6E3CFB', color: '#fff', border: '2px solid #4C1D95', cursor: 'pointer' }}>Redeem</button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-3 text-xs font-bold z-50"
          style={{ background: toast.ok ? '#22C55E' : '#EF4444', color: toast.ok ? '#000' : '#fff', border: `3px solid ${toast.ok ? '#16A34A' : '#DC2626'}`, boxShadow: `3px 3px 0px ${toast.ok ? '#16A34A' : '#DC2626'}` }}
          data-testid="toast-message">{toast.msg}</motion.div>
      )}
    </motion.div>
  );
}
