/**
 * On-chain token registry for the active chain. Contract addresses are sourced
 * from EXPO_PUBLIC_* env vars so they can be set per environment without code
 * changes. Tokens without a configured address (or the native token) are still
 * listed; their balances simply fall back to local/demo values until an address
 * + RPC are available.
 */
import { NATIVE_SYMBOL } from './chainClient';

export interface ChainToken {
  symbol: string;
  decimals: number;
  /** true for the chain's native gas token (read via getBalance) */
  native?: boolean;
  /** ERC-20 contract address; undefined → not read on-chain */
  address?: `0x${string}`;
}

const env = (k: string) => {
  const v = process.env[k];
  return v && /^0x[a-fA-F0-9]{40}$/.test(v) ? (v as `0x${string}`) : undefined;
};

export const CHAIN_TOKENS: ChainToken[] = [
  { symbol: NATIVE_SYMBOL, decimals: 18, native: true },
  { symbol: 'USDC', decimals: 6, address: env('EXPO_PUBLIC_USDC_ADDRESS') },
  { symbol: 'ETH', decimals: 18, address: env('EXPO_PUBLIC_WETH_ADDRESS') },
];
