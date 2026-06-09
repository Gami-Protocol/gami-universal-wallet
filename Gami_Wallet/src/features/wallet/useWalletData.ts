/**
 * On-chain wallet data via React Query. Reads the native-token balance for the
 * active wallet; resolves to null (rather than throwing) when no RPC is
 * reachable so the UI can fall back to local/demo values.
 */
import { useQuery } from '@tanstack/react-query';
import { useWallet } from './localWallet';
import { fetchNativeBalance, NATIVE_SYMBOL } from './chainClient';

export function useNativeBalance() {
  const { address } = useWallet();
  const query = useQuery({
    queryKey: ['nativeBalance', address],
    enabled: !!address,
    retry: 0,
    staleTime: 30_000,
    queryFn: async () => {
      try {
        return await fetchNativeBalance(address as `0x${string}`);
      } catch {
        return null; // no RPC / offline — caller falls back
      }
    },
  });

  return { balance: query.data ?? null, symbol: NATIVE_SYMBOL, isLoading: query.isLoading };
}
