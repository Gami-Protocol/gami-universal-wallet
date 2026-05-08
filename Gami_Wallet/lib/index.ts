// Main exports
export { GamiUniversalWallet } from './wallet/UniversalWallet';
export { BlockchainClient, GAMI_CHAIN_CONFIG, PRECOMPILE_ADDRESSES } from './blockchain/client';
export { AirdropValidator } from './airdrop/validator';

// Type exports
export type {
  WalletConfig,
  UserStats,
  Asset,
  Transaction,
  AirdropEligibility,
  AirdropClaim,
  GamiChainConfig,
  WalletState,
} from './types';

// Re-export viem utilities for convenience
export { formatEther, parseEther, type Address } from 'viem';
