export interface UserData {
  level: number;
  totalXP: number;
  xpToNextLevel: number;
  streak: number;
}

export interface WalletConnection {
  address: string;
  chain: string;
  connected_at: string;
}

export type TabId = 'home' | 'wallet' | 'rewards' | 'quests' | 'profile';

export interface Tab {
  id: TabId;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

// Multi-chain types
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

export interface MultiChainAccount {
  address: string;
  chainId: string;
  chainType: ChainType;
  balance?: string;
  isActive: boolean;
}

// Bridge types
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

// Gami SDK detection
export interface GamiSDKDetection {
  detected: boolean;
  version?: string;
  appId?: string;
  features: string[];
  quests?: {
    id: string;
    title: string;
    xpReward: number;
    type: string;
  }[];
}
