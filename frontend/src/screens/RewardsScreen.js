import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Search, Grid3X3, List, ChevronRight } from 'lucide-react';
import { CategoryPill } from '../components/UIComponents';

const categories = ['All', 'Voucher', 'Digital', 'NFT', 'Gadget'];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function RewardsScreen() {
  const { rewards, redeemReward, fetchRewards, user } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [redeeming, setRedeeming] = useState(null);
  const [toast, setToast] = useState(null);

  const handleCategoryChange = (cat) => {
    const c = cat.toLowerCase();
    setCategory(c);
    fetchRewards(c, search);
  };

  const handleSearch = (val) => {
    setSearch(val);
    fetchRewards(category, val);
  };

  const handleRedeem = async (title, cost) => {
    if (user.xp < cost) {
      setToast({ message: 'Not enough XP!', type: 'error' });
      setTimeout(() => setToast(null), 2500);
      return;
    }
    setRedeeming(title);
    const result = await redeemReward(title);
    setRedeeming(null);
    setToast({ message: result.message || 'Redeemed!', type: result.success ? 'success' : 'error' });
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <motion.div
      className="px-5 pt-6 pb-4 space-y-5"
      variants={container}
      initial="hidden"
      animate="show"
      data-testid="rewards-screen"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--gami-text)' }}>Featured Reward</h2>
      </motion.div>

      {/* Search */}
      <motion.div variants={item} className="flex items-center gap-2">
        <div
          className="flex-1 flex items-center gap-2 px-3 h-10 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <Search size={15} style={{ color: 'var(--gami-text-muted)' }} />
          <input
            data-testid="reward-search"
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search rewards..."
            className="bg-transparent border-none outline-none text-sm flex-1"
            style={{ color: 'var(--gami-text)', fontFamily: 'Outfit' }}
          />
        </div>
        <button
          data-testid="view-list-btn"
          onClick={() => setViewMode('list')}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: viewMode === 'list' ? 'rgba(110,60,251,0.15)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <List size={16} style={{ color: viewMode === 'list' ? '#6E3CFB' : 'var(--gami-text-muted)' }} />
        </button>
        <button
          data-testid="view-grid-btn"
          onClick={() => setViewMode('grid')}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: viewMode === 'grid' ? 'rgba(110,60,251,0.15)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <Grid3X3 size={16} style={{ color: viewMode === 'grid' ? '#6E3CFB' : 'var(--gami-text-muted)' }} />
        </button>
      </motion.div>

      {/* Categories */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <CategoryPill
            key={cat}
            label={cat}
            active={category === cat.toLowerCase()}
            onClick={() => handleCategoryChange(cat)}
          />
        ))}
      </motion.div>

      {/* Rewards List */}
      <motion.div
        className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {rewards.map((reward, idx) => (
          <motion.div
            key={idx}
            variants={item}
            className="glass-card overflow-hidden shimmer"
            data-testid={`reward-card-${idx}`}
          >
            {viewMode === 'list' ? (
              <div className="flex">
                <div className="w-28 h-28 flex-shrink-0 overflow-hidden">
                  <img src={reward.image} alt={reward.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--gami-text-muted)' }}>{reward.brand}</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--gami-text)' }}>{reward.title}</p>
                  </div>
                  <div className="flex items-end justify-between mt-2">
                    <div>
                      <span className="text-2xl font-extrabold gradient-text">{reward.cost}</span>
                      <span className="text-[10px] ml-1" style={{ color: 'var(--gami-text-muted)' }}>pts</span>
                    </div>
                    <button
                      data-testid={`redeem-btn-${idx}`}
                      onClick={() => handleRedeem(reward.title, reward.cost)}
                      disabled={redeeming === reward.title}
                      className="px-3 py-1.5 rounded-lg text-[10px] font-bold"
                      style={{
                        background: user?.xp >= reward.cost ? 'linear-gradient(135deg, #6E3CFB, #4C1D95)' : 'rgba(255,255,255,0.06)',
                        color: user?.xp >= reward.cost ? '#fff' : 'var(--gami-text-muted)',
                        border: 'none',
                        cursor: user?.xp >= reward.cost ? 'pointer' : 'not-allowed',
                        opacity: redeeming === reward.title ? 0.6 : 1,
                      }}
                    >
                      {redeeming === reward.title ? '...' : 'Redeem Now'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="h-24 overflow-hidden">
                  <img src={reward.image} alt={reward.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-3">
                  <p className="text-[10px]" style={{ color: 'var(--gami-text-muted)' }}>{reward.brand}</p>
                  <p className="text-xs font-bold truncate" style={{ color: 'var(--gami-text)' }}>{reward.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-extrabold gradient-text">{reward.cost}</span>
                    <button
                      onClick={() => handleRedeem(reward.title, reward.cost)}
                      className="text-[9px] font-bold px-2 py-1 rounded-md"
                      style={{ background: 'rgba(110,60,251,0.2)', color: '#A78BFA', border: 'none', cursor: 'pointer' }}
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl text-sm font-semibold z-50"
          style={{
            background: toast.type === 'success' ? 'rgba(34,197,94,0.9)' : 'rgba(239,68,68,0.9)',
            color: '#fff',
            backdropFilter: 'blur(12px)',
          }}
          data-testid="toast-message"
        >
          {toast.message}
        </motion.div>
      )}
    </motion.div>
  );
}
