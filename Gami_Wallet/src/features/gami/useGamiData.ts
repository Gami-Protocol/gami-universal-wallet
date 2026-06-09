/**
 * Data hooks that prefer the live GamiAPI (via React Query) and gracefully fall
 * back to local demo content when no backend is reachable. This lets the same
 * screens work both against a running API and fully offline.
 */
import { useQuery } from '@tanstack/react-query';
import { GamiAPI } from './apiClient';
import { mockQuests } from './mockData';
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
