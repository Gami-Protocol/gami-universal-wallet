/**
 * Data hooks that prefer the live GamiAPI (via React Query) and gracefully fall
 * back to local demo content when no backend is reachable. This lets the same
 * screens work both against a running API and fully offline.
 */
import { useQuery } from '@tanstack/react-query';
import { GamiAPI } from './apiClient';
import {
  mockQuests,
  mockTokens,
  mockNfts,
  mockLeaderboard,
  type MockToken,
  type MockNft,
  type LeaderRow,
} from './mockData';
import type { GamiQuest } from './types';

export function useQuestFeed() {
  const query = useQuery({
    queryKey: ['quests'],
    queryFn: GamiAPI.getQuests as () => Promise<GamiQuest[]>,
    retry: 0,
    staleTime: 60_000,
  });

  const live = Array.isArray(query.data) && query.data.length > 0;
  const quests: GamiQuest[] = live ? (query.data as GamiQuest[]) : mockQuests;

  return { quests, isLive: live, isLoading: query.isLoading, refetch: query.refetch };
}

export function useQuest(id?: string) {
  const { quests } = useQuestFeed();
  return quests.find((q) => q.id === id);
}

/** Generic helper: live React Query data, falling back to local content. */
function useFeed<T>(key: unknown[], queryFn: () => Promise<unknown>, fallback: T[], enabled = true) {
  const query = useQuery({ queryKey: key, queryFn: queryFn as () => Promise<T[]>, retry: 0, staleTime: 60_000, enabled });
  const live = Array.isArray(query.data) && query.data.length > 0;
  return { data: live ? (query.data as T[]) : fallback, isLive: live, isLoading: query.isLoading };
}

export function useTokens(address?: string) {
  return useFeed<MockToken>(['tokens', address], () => GamiAPI.getTokens(address!), mockTokens, !!address);
}

export function useNfts(address?: string) {
  return useFeed<MockNft>(['nfts', address], () => GamiAPI.getNfts(address!), mockNfts, !!address);
}

export function useLeaderboard() {
  return useFeed<LeaderRow>(['leaderboard'], GamiAPI.getLeaderboard, mockLeaderboard);
}
