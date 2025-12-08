export interface WalletConfig {
  rpcUrl: string;
  chainId: string;
  privateKey?: string;
  mnemonic?: string;
}

export interface UserStats {
  level: bigint;
  totalXP: bigint;
  xpToNextLevel: bigint;
}

export interface Asset {
  symbol: string;
  name: string;
  balance: bigint;
  decimals: number;
  contractAddress?: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: bigint;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface AirdropEligibility {
  eligible: boolean;
  amount: bigint;
  reason?: string;
  criteria: {
    minLevel: number;
    minXP: number;
    minAge: number; // days
    hasCompletedQuests: boolean;
  };
  userMeets: {
    level: number;
    totalXP: number;
    accountAge: number;
    completedQuests: number;
  };
}

export interface AirdropClaim {
  user: string;
  amount: bigint;
  claimedAt: number;
  txHash: string;
}

export interface GamiChainConfig {
  rpcUrl: string;
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrl: string;
}

export interface WalletState {
  address: string | null;
  connected: boolean;
  balance: bigint;
  assets: Asset[];
  transactions: Transaction[];
  stats: UserStats | null;
}
