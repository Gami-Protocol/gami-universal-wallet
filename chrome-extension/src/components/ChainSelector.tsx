import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, ChevronDown, X, Globe } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import GamiButton from '@/components/GamiButton';
import { useMultiChain, type ChainConfig } from '@/hooks/useMultiChain';

interface ChainSelectorProps {
  onSelect?: (chainId: string) => void;
  selectedChain?: string;
}

export default function ChainSelector({ onSelect, selectedChain }: ChainSelectorProps) {
  const { supportedChains, activeChain, switchChain, addCustomChain, loading, error } = useMultiChain();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showAddChain, setShowAddChain] = useState(false);
  const [customChain, setCustomChain] = useState<Partial<ChainConfig>>({
    type: 'evm',
    nativeCurrency: { name: '', symbol: '', decimals: 18 },
  });

  const handleChainSelect = async (chainId: string) => {
    const success = await switchChain(chainId);
    if (success) {
      onSelect?.(chainId);
      setIsOpen(false);
    }
  };

  const handleAddCustomChain = async () => {
    if (!customChain.id || !customChain.name || !customChain.rpcUrl) {
      return;
    }

    const config: ChainConfig = {
      id: customChain.id,
      type: customChain.type || 'evm',
      name: customChain.name,
      chainId: customChain.chainId || 0,
      rpcUrl: customChain.rpcUrl,
      explorerUrl: customChain.explorerUrl || '',
      nativeCurrency: customChain.nativeCurrency || { name: '', symbol: '', decimals: 18 },
      layerZeroEndpointId: customChain.layerZeroEndpointId,
    };

    const success = await addCustomChain(config);
    if (success) {
      setShowAddChain(false);
      setCustomChain({
        type: 'evm',
        nativeCurrency: { name: '', symbol: '', decimals: 18 },
      });
    }
  };

  const activeChainConfig = supportedChains.find(c => c.id === (selectedChain || activeChain));

  // Group chains by type
  const evmChains = supportedChains.filter(c => c.type === 'evm');
  const solanaChains = supportedChains.filter(c => c.type === 'solana');

  return (
    <div className="relative">
      {/* Chain Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Globe size={14} className="text-white" />
        </div>
        <span className="text-sm font-medium text-white">{activeChainConfig?.name || 'Select Chain'}</span>
        <ChevronDown size={14} className={`text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-64 bg-surface-dark rounded-xl border border-white/10 shadow-xl z-50 overflow-hidden"
          >
            <div className="max-h-80 overflow-y-auto">
              {/* EVM Chains */}
              <div className="p-2">
                <div className="text-xs text-white/40 px-2 py-1 font-medium">EVM Chains</div>
                {evmChains.map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => handleChainSelect(chain.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      (selectedChain || activeChain) === chain.id
                        ? 'bg-primary/20 text-primary'
                        : 'text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-[10px]">{chain.nativeCurrency.symbol.slice(0, 2)}</span>
                      </div>
                      <span className="text-sm">{chain.name}</span>
                    </div>
                    {(selectedChain || activeChain) === chain.id && <Check size={14} />}
                  </button>
                ))}
              </div>

              {/* Solana */}
              {solanaChains.length > 0 && (
                <div className="p-2 border-t border-white/5">
                  <div className="text-xs text-white/40 px-2 py-1 font-medium">Solana</div>
                  {solanaChains.map((chain) => (
                    <button
                      key={chain.id}
                      onClick={() => handleChainSelect(chain.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        (selectedChain || activeChain) === chain.id
                          ? 'bg-primary/20 text-primary'
                          : 'text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-green-400 flex items-center justify-center">
                          <span className="text-[10px] text-white">SOL</span>
                        </div>
                        <span className="text-sm">{chain.name}</span>
                      </div>
                      {(selectedChain || activeChain) === chain.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}

              {/* Add Custom Chain */}
              <div className="p-2 border-t border-white/5">
                <button
                  onClick={() => setShowAddChain(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Plus size={14} />
                  <span className="text-sm">Add Custom Chain</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Custom Chain Modal */}
      <AnimatePresence>
        {showAddChain && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddChain(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm"
            >
              <GlassCard className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Add Custom Chain</h3>
                  <button
                    onClick={() => setShowAddChain(false)}
                    className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X size={18} className="text-white/60" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Network Name *</label>
                    <input
                      type="text"
                      value={customChain.name || ''}
                      onChange={(e) => setCustomChain({ ...customChain, name: e.target.value, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="My Custom Chain"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/40 mb-1 block">RPC URL *</label>
                    <input
                      type="text"
                      value={customChain.rpcUrl || ''}
                      onChange={(e) => setCustomChain({ ...customChain, rpcUrl: e.target.value })}
                      placeholder="https://rpc.example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-white/40 mb-1 block">Chain ID</label>
                      <input
                        type="number"
                        value={customChain.chainId || ''}
                        onChange={(e) => setCustomChain({ ...customChain, chainId: parseInt(e.target.value) || 0 })}
                        placeholder="1"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 mb-1 block">Currency Symbol</label>
                      <input
                        type="text"
                        value={customChain.nativeCurrency?.symbol || ''}
                        onChange={(e) => setCustomChain({
                          ...customChain,
                          nativeCurrency: { ...customChain.nativeCurrency!, symbol: e.target.value, name: e.target.value },
                        })}
                        placeholder="ETH"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Block Explorer URL</label>
                    <input
                      type="text"
                      value={customChain.explorerUrl || ''}
                      onChange={(e) => setCustomChain({ ...customChain, explorerUrl: e.target.value })}
                      placeholder="https://explorer.example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary"
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-red-400">{error}</p>
                  )}

                  <GamiButton
                    onClick={handleAddCustomChain}
                    disabled={!customChain.name || !customChain.rpcUrl || loading}
                    className="w-full mt-2"
                  >
                    {loading ? 'Adding...' : 'Add Chain'}
                  </GamiButton>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
