/**
 * On-chain wallet data via React Query. Reads native + ERC-20 balances for the
 * active wallet and refreshes them on an interval (real-time-ish). Resolves to
 * local/demo values rather than throwing when no RPC/contract is reachable, so
 * the UI always renders.
 */
import { useQuery } from '@tanstack/react-query';
import { useWallet } from './localWallet';
import { fetchNativeBalance, fetchErc20Balance, NATIVE_SYMBOL } from './chainClient';
import { CHAIN_TOKENS } from './tokenList';
import { mockTokens, type MockToken } from '@/features/gami/mockData';

const REFRESH_MS = 15_000;

/** Mock-derived unit price (USD per token) used to estimate USD value of a real balance. */
const unitPrice = (t: MockToken) => {
  const units = Number(t.balance.replace(/,/g, '')) || 0;
  return units > 0 ? t.usd / units : t.usd;
};

export function useNativeBalance() {
  const { address } = useWallet();
  const query = useQuery({
    queryKey: ['nativeBalance', address],
    enabled: !!address,
    retry: 0,
    refetchInterval: REFRESH_MS,
    staleTime: REFRESH_MS,
    queryFn: async () => {
      try {
        return await fetchNativeBalance(address as `0x${string}`);
      } catch {
        return null;
      }
    },
  });
  return { balance: query.data ?? null, symbol: NATIVE_SYMBOL, isLoading: query.isLoading };
}

/**
 * Real-time token list: on-chain balances (native + ERC-20) merged over the
 * demo token metadata. Symbols without an on-chain source keep their mock value.
 */
export function useWalletTokens() {
  const { address } = useWallet();

  const query = useQuery({
    queryKey: ['walletTokens', address],
    enabled: !!address,
    retry: 0,
    refetchInterval: REFRESH_MS,
    staleTime: REFRESH_MS - 1,
    queryFn: async () => {
      const entries = await Promise.all(
        CHAIN_TOKENS.map(async (t) => {
          try {
            if (t.native) return [t.symbol, await fetchNativeBalance(address as `0x${string}`)] as const;
            if (t.address) return [t.symbol, await fetchErc20Balance(address as `0x${string}`, t.address, t.decimals)] as const;
          } catch {
            /* unreachable RPC / contract — fall back */
          }
          return null;
        }),
      );
      return Object.fromEntries(entries.filter(Boolean) as [string, string][]);
    },
  });

  const live = query.data ?? {};

  const tokens: MockToken[] = mockTokens.map((mt) => {
    const onchain = live[mt.symbol];
    if (onchain == null) return mt;
    const bal = Number(onchain);
    return {
      ...mt,
      balance: bal.toLocaleString(undefined, { maximumFractionDigits: 4 }),
      usd: unitPrice(mt) * bal,
    };
  });

  return {
    tokens,
    totalUsd: tokens.reduce((sum, t) => sum + t.usd, 0),
    isLive: Object.keys(live).length > 0,
    isLoading: query.isLoading,
  };
}
