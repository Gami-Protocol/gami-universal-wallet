import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GamiAPI } from './apiClient';

export function useProfile(address?: string) {
  return useQuery({
    queryKey: ['profile', address],
    queryFn: () => GamiAPI.getProfile(address!),
    enabled: !!address,
  });
}

export function useQuests() {
  return useQuery({
    queryKey: ['quests'],
    queryFn: GamiAPI.getQuests,
  });
}

export function useCompleteQuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => GamiAPI.completeQuest(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['quests'] }),
  });
}

export function useClaimQuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => GamiAPI.claimQuest(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['quests'] }),
  });
}

export function useRewards() {
  return useQuery({
    queryKey: ['rewards'],
    queryFn: GamiAPI.getRewards,
  });
}

export function useRewardDecision() {
  return useMutation({
    mutationFn: GamiAPI.rewardDecision,
  });
}
