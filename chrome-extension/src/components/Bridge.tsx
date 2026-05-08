import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, ChevronDown, Loader2, Check, AlertCircle } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import GamiButton from '@/components/GamiButton';
import { useMultiChain, useBridge } from '@/hooks/useMultiChain';

interface BridgeProps {
  onClose?: () => void;
}

export default function Bridge(_props: BridgeProps) {
  const { supportedChains, getChainConfig } = useMultiChain();
  const { pendingBridges, loading, error, estimateFee, initiateBridge } = useBridge();

  const [sourceChain, setSourceChain] = useState<string>('ethereum');
  const [destChain, setDestChain] = useState<string>('gami');
  const [token, setToken] = useState<string>('ETH');
  const [amount, setAmount] = useState<string>('');
  const [fee, setFee] = useState<{ nativeFee: string; zroFee: string } | null>(null);
  const [showSourceSelect, setShowSourceSelect] = useState(false);
  const [showDestSelect, setShowDestSelect] = useState(false);
  const [bridgeSuccess, setBridgeSuccess] = useState(false);

  // Estimate fee when params change
  useEffect(() => {
    if (sourceChain && destChain && amount && parseFloat(amount) > 0) {
      estimateFee(sourceChain, destChain, amount).then(setFee);
    } else {
      setFee(null);
    }
  }, [sourceChain, destChain, amount, estimateFee]);

  const handleSwapChains = () => {
    setSourceChain(destChain);
    setDestChain(sourceChain);
  };

  const handleBridge = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    const result = await initiateBridge({
      sourceChain,
      destChain,
      token,
      amount,
    });

    if (result) {
      setBridgeSuccess(true);
      setAmount('');
      setTimeout(() => setBridgeSuccess(false), 3000);
    }
  };

  const sourceConfig = getChainConfig(sourceChain);
  const destConfig = getChainConfig(destChain);

  // Filter chains by type (can bridge between EVM chains and Solana via LayerZero)
  const bridgeableChains = supportedChains.filter(c => c.layerZeroEndpointId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Bridge</h2>
        <span className="text-xs text-white/40">Powered by LayerZero</span>
      </div>

      {/* From Chain */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/40">From</span>
          <button
            onClick={() => setShowSourceSelect(!showSourceSelect)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span className="text-sm font-medium text-white">{sourceConfig?.name || 'Select'}</span>
            <ChevronDown size={14} className="text-white/40" />
          </button>
        </div>

        {showSourceSelect && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-10 mt-1 p-2 bg-surface-dark rounded-xl border border-white/10 shadow-xl max-h-48 overflow-y-auto"
          >
            {bridgeableChains.map((chain) => (
              <button
                key={chain.id}
                onClick={() => {
                  setSourceChain(chain.id);
                  setShowSourceSelect(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                  sourceChain === chain.id ? 'bg-primary/20 text-primary' : 'text-white hover:bg-white/5'
                }`}
              >
                {chain.name}
              </button>
            ))}
          </motion.div>
        )}

        <div className="flex items-center gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-transparent text-2xl font-mono text-white placeholder:text-white/20 outline-none"
          />
          <select
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="bg-white/5 text-white px-3 py-1.5 rounded-lg text-sm outline-none"
          >
            <option value="ETH">ETH</option>
            <option value="USDC">USDC</option>
            <option value="GAMI">GAMI</option>
          </select>
        </div>
      </GlassCard>

      {/* Swap Button */}
      <div className="flex justify-center -my-2 relative z-10">
        <button
          onClick={handleSwapChains}
          className="p-2 rounded-full bg-primary hover:bg-primary-hover transition-colors"
        >
          <ArrowRightLeft size={20} className="text-white rotate-90" />
        </button>
      </div>

      {/* To Chain */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/40">To</span>
          <button
            onClick={() => setShowDestSelect(!showDestSelect)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span className="text-sm font-medium text-white">{destConfig?.name || 'Select'}</span>
            <ChevronDown size={14} className="text-white/40" />
          </button>
        </div>

        {showDestSelect && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-10 mt-1 p-2 bg-surface-dark rounded-xl border border-white/10 shadow-xl max-h-48 overflow-y-auto"
          >
            {bridgeableChains
              .filter((c) => c.id !== sourceChain)
              .map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => {
                    setDestChain(chain.id);
                    setShowDestSelect(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    destChain === chain.id ? 'bg-primary/20 text-primary' : 'text-white hover:bg-white/5'
                  }`}
                >
                  {chain.name}
                </button>
              ))}
          </motion.div>
        )}

        <div className="text-2xl font-mono text-white/60">
          {amount && fee ? (
            (parseFloat(amount) - parseFloat(fee.nativeFee)).toFixed(6)
          ) : (
            '0.00'
          )}
        </div>
      </GlassCard>

      {/* Fee Info */}
      {fee && (
        <GlassCard className="p-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Estimated Fee</span>
            <span className="text-white">{fee.nativeFee} {sourceConfig?.nativeCurrency.symbol}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-white/40">Estimated Time</span>
            <span className="text-white">~2-5 minutes</span>
          </div>
        </GlassCard>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Success */}
      {bridgeSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-400 text-sm"
        >
          <Check size={16} />
          Bridge initiated! Track status below.
        </motion.div>
      )}

      {/* Bridge Button */}
      <GamiButton
        onClick={handleBridge}
        disabled={!amount || parseFloat(amount) <= 0 || loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Bridging...
          </>
        ) : (
          'Bridge'
        )}
      </GamiButton>

      {/* Pending Bridges */}
      {pendingBridges.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-white/60 mb-2">Pending Bridges</h3>
          <div className="space-y-2">
            {pendingBridges.map((bridge) => (
              <GlassCard key={bridge.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white">
                      {bridge.amount} {bridge.sourceToken}
                    </span>
                    <ArrowRightLeft size={12} className="text-white/40" />
                    <span className="text-xs text-white/40">
                      {getChainConfig(bridge.sourceChain)?.name} → {getChainConfig(bridge.destChain)?.name}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      bridge.status === 'completed'
                        ? 'bg-green-500/20 text-green-400'
                        : bridge.status === 'failed'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {bridge.status}
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
