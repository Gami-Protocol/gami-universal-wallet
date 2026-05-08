/**
 * Blockchain Provider - Multi-chain wallet connection
 * Supports EVM chains and Solana with LayerZero bridge integration
 */

// =============================================================================
// CHAIN CONFIGURATIONS
// =============================================================================

export type ChainType = 'evm' | 'solana';

export interface ChainConfig {
  id: string;
  type: ChainType;
  name: string;
  chainId: number | string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  layerZeroEndpointId?: number;
  iconUrl?: string;
}

// LayerZero Endpoint IDs for cross-chain messaging
export const LAYER_ZERO_ENDPOINTS = {
  ethereum: 101,
  polygon: 109,
  arbitrum: 110,
  optimism: 111,
  avalanche: 106,
  bsc: 102,
  solana: 168,
  gami: 999, // Custom endpoint for Gami chain
} as const;

// Supported chain configurations
export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  // Gami Protocol Chain
  gami: {
    id: 'gami',
    type: 'evm',
    name: 'Gami Protocol',
    chainId: 31337, // Local dev, will change for mainnet
    rpcUrl: 'http://localhost:8545',
    explorerUrl: 'http://localhost:4000',
    nativeCurrency: { name: 'Gami Token', symbol: 'GAMI', decimals: 18 },
    layerZeroEndpointId: LAYER_ZERO_ENDPOINTS.gami,
  },
  // EVM Chains
  ethereum: {
    id: 'ethereum',
    type: 'evm',
    name: 'Ethereum',
    chainId: 1,
    rpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    layerZeroEndpointId: LAYER_ZERO_ENDPOINTS.ethereum,
  },
  polygon: {
    id: 'polygon',
    type: 'evm',
    name: 'Polygon',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    layerZeroEndpointId: LAYER_ZERO_ENDPOINTS.polygon,
  },
  arbitrum: {
    id: 'arbitrum',
    type: 'evm',
    name: 'Arbitrum One',
    chainId: 42161,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    layerZeroEndpointId: LAYER_ZERO_ENDPOINTS.arbitrum,
  },
  optimism: {
    id: 'optimism',
    type: 'evm',
    name: 'Optimism',
    chainId: 10,
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    layerZeroEndpointId: LAYER_ZERO_ENDPOINTS.optimism,
  },
  avalanche: {
    id: 'avalanche',
    type: 'evm',
    name: 'Avalanche C-Chain',
    chainId: 43114,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
    layerZeroEndpointId: LAYER_ZERO_ENDPOINTS.avalanche,
  },
  bsc: {
    id: 'bsc',
    type: 'evm',
    name: 'BNB Smart Chain',
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    layerZeroEndpointId: LAYER_ZERO_ENDPOINTS.bsc,
  },
  // Solana
  solana: {
    id: 'solana',
    type: 'solana',
    name: 'Solana',
    chainId: 'mainnet-beta',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://solscan.io',
    nativeCurrency: { name: 'SOL', symbol: 'SOL', decimals: 9 },
    layerZeroEndpointId: LAYER_ZERO_ENDPOINTS.solana,
  },
};

// =============================================================================
// WALLET STATE
// =============================================================================

export interface WalletAccount {
  address: string;
  chainId: string;
  chainType: ChainType;
  balance?: string;
  isActive: boolean;
}

export interface MultiChainWalletState {
  accounts: WalletAccount[];
  activeChainId: string;
  isConnected: boolean;
  pendingBridges: BridgeTransaction[];
}

// =============================================================================
// BRIDGE TYPES
// =============================================================================

export interface BridgeTransaction {
  id: string;
  sourceChain: string;
  destChain: string;
  sourceToken: string;
  destToken: string;
  amount: string;
  status: 'pending' | 'confirming' | 'completed' | 'failed';
  sourceTxHash?: string;
  destTxHash?: string;
  layerZeroNonce?: number;
  createdAt: number;
  updatedAt: number;
}

// =============================================================================
// BLOCKCHAIN PROVIDER CLASS
// =============================================================================

export class BlockchainProvider {
  private state: MultiChainWalletState;
  private evmProviders: Map<string, any> = new Map();

  constructor() {
    this.state = {
      accounts: [],
      activeChainId: 'gami',
      isConnected: false,
      pendingBridges: [],
    };
  }

  // Get supported chains
  getSupportedChains(): ChainConfig[] {
    return Object.values(SUPPORTED_CHAINS);
  }

  // Get chain config by ID
  getChainConfig(chainId: string): ChainConfig | undefined {
    return SUPPORTED_CHAINS[chainId];
  }

  // Add a new chain (custom EVM chains)
  addCustomChain(config: ChainConfig): void {
    SUPPORTED_CHAINS[config.id] = config;
  }

  // Get current state
  getState(): MultiChainWalletState {
    return { ...this.state };
  }

  // Connect to a chain
  async connectChain(chainId: string, privateKey?: string): Promise<WalletAccount | null> {
    const config = SUPPORTED_CHAINS[chainId];
    if (!config) {
      throw new Error(`Unsupported chain: ${chainId}`);
    }

    try {
      if (config.type === 'evm') {
        return await this.connectEVMChain(config, privateKey);
      } else if (config.type === 'solana') {
        return await this.connectSolanaChain(config, privateKey);
      }
    } catch (error) {
      console.error(`[BlockchainProvider] Failed to connect to ${chainId}:`, error);
      throw error;
    }

    return null;
  }

  // Connect to EVM chain
  private async connectEVMChain(config: ChainConfig, _privateKey?: string): Promise<WalletAccount> {
    // Simplified connection - in production use viem or ethers
    const account: WalletAccount = {
      address: '', // Will be populated from wallet
      chainId: config.id,
      chainType: 'evm',
      isActive: true,
    };

    // Store provider reference
    this.evmProviders.set(config.id, { rpcUrl: config.rpcUrl, chainId: config.chainId });

    // Add to accounts if not already present
    const existing = this.state.accounts.find(a => a.chainId === config.id);
    if (!existing) {
      this.state.accounts.push(account);
    }

    this.state.isConnected = true;
    return account;
  }

  // Connect to Solana chain
  private async connectSolanaChain(config: ChainConfig, _privateKey?: string): Promise<WalletAccount> {
    const account: WalletAccount = {
      address: '', // Will be populated from Phantom/Solflare wallet
      chainId: config.id,
      chainType: 'solana',
      isActive: true,
    };

    const existing = this.state.accounts.find(a => a.chainId === config.id);
    if (!existing) {
      this.state.accounts.push(account);
    }

    this.state.isConnected = true;
    return account;
  }

  // Switch active chain
  switchChain(chainId: string): boolean {
    if (!SUPPORTED_CHAINS[chainId]) {
      return false;
    }
    this.state.activeChainId = chainId;
    return true;
  }

  // Get balance for an address on a specific chain
  async getBalance(chainId: string, address: string): Promise<string> {
    const config = SUPPORTED_CHAINS[chainId];
    if (!config) {
      throw new Error(`Unsupported chain: ${chainId}`);
    }

    try {
      const response = await fetch(config.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: config.type === 'evm' ? 'eth_getBalance' : 'getBalance',
          params: config.type === 'evm' ? [address, 'latest'] : [address],
          id: 1,
        }),
      });

      const data = await response.json();
      return data.result || '0';
    } catch (error) {
      console.error(`[BlockchainProvider] Failed to get balance:`, error);
      return '0';
    }
  }

  // =============================================================================
  // LAYERZERO BRIDGE
  // =============================================================================

  // Estimate bridge fee using LayerZero
  async estimateBridgeFee(
    sourceChain: string,
    destChain: string,
    _amount: string
  ): Promise<{ nativeFee: string; zroFee: string }> {
    const sourceConfig = SUPPORTED_CHAINS[sourceChain];
    const destConfig = SUPPORTED_CHAINS[destChain];

    if (!sourceConfig?.layerZeroEndpointId || !destConfig?.layerZeroEndpointId) {
      throw new Error('LayerZero not supported for these chains');
    }

    // In production, call LayerZero estimateFees contract method
    // Simplified estimation for now
    return {
      nativeFee: '0.001', // Estimated gas in native token
      zroFee: '0',
    };
  }

  // Initiate bridge transaction via LayerZero
  async initiateBridge(
    sourceChain: string,
    destChain: string,
    token: string,
    amount: string,
    _fromAddress: string,
    _toAddress: string
  ): Promise<BridgeTransaction> {
    const sourceConfig = SUPPORTED_CHAINS[sourceChain];
    const destConfig = SUPPORTED_CHAINS[destChain];

    if (!sourceConfig || !destConfig) {
      throw new Error('Invalid chain configuration');
    }

    const bridgeTx: BridgeTransaction = {
      id: `bridge_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      sourceChain,
      destChain,
      sourceToken: token,
      destToken: token, // Assuming same token symbol on dest chain
      amount,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.state.pendingBridges.push(bridgeTx);
    return bridgeTx;
  }

  // Get bridge status
  getBridgeStatus(bridgeId: string): BridgeTransaction | undefined {
    return this.state.pendingBridges.find(b => b.id === bridgeId);
  }

  // Get all pending bridges
  getPendingBridges(): BridgeTransaction[] {
    return this.state.pendingBridges.filter(b => b.status === 'pending' || b.status === 'confirming');
  }

  // Update bridge status (called by message listeners)
  updateBridgeStatus(bridgeId: string, status: BridgeTransaction['status'], txHash?: string): void {
    const bridge = this.state.pendingBridges.find(b => b.id === bridgeId);
    if (bridge) {
      bridge.status = status;
      bridge.updatedAt = Date.now();
      if (txHash) {
        if (status === 'confirming') {
          bridge.sourceTxHash = txHash;
        } else if (status === 'completed') {
          bridge.destTxHash = txHash;
        }
      }
    }
  }
}

// Export singleton instance
export const blockchainProvider = new BlockchainProvider();
