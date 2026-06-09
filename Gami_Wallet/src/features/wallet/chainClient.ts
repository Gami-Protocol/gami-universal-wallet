/**
 * On-chain client (viem). Reads native balances and broadcasts native transfers
 * using the local non-custodial account. All network use is best-effort — when
 * no RPC is reachable the callers fall back to local state, so the app stays
 * fully usable offline.
 */
import {
  createPublicClient,
  createWalletClient,
  http,
  defineChain,
  formatEther,
  parseEther,
} from 'viem';
import { DEFAULT_GAMI_CHAIN } from '@/features/gami/chainConfig';
import { getAccount } from './localWallet';
import type { GamiChain } from '@/features/gami/types';

export function toViemChain(c: GamiChain) {
  return defineChain({
    id: c.chainId,
    name: c.name,
    nativeCurrency: c.nativeCurrency,
    rpcUrls: { default: { http: [c.rpcUrl] } },
    blockExplorers: c.explorerUrl
      ? { default: { name: 'Explorer', url: c.explorerUrl } }
      : undefined,
  });
}

export const activeChain = toViemChain(DEFAULT_GAMI_CHAIN);

export const publicClient = createPublicClient({ chain: activeChain, transport: http() });

/** Native-token balance for an address, as a decimal string. Throws if no RPC. */
export async function fetchNativeBalance(address: `0x${string}`): Promise<string> {
  const wei = await publicClient.getBalance({ address });
  return formatEther(wei);
}

/** Broadcast a native-token transfer. Throws if the wallet isn't ready or no RPC. */
export async function sendNative(to: `0x${string}`, amount: string): Promise<`0x${string}`> {
  const account = getAccount();
  if (!account) throw new Error('Wallet not ready');
  const walletClient = createWalletClient({ account, chain: activeChain, transport: http() });
  return walletClient.sendTransaction({ to, value: parseEther(amount) });
}

export const NATIVE_SYMBOL = DEFAULT_GAMI_CHAIN.nativeCurrency.symbol;
