import { GamiAPI } from './apiClient';
import type { RewardDecisionInput, RewardDecision } from './types';

export async function getRewardDecision(input: RewardDecisionInput): Promise<RewardDecision> {
  return GamiAPI.rewardDecision(input);
}

export function shouldTriggerReward(levelBefore: number, levelAfter: number) {
  return levelAfter > levelBefore;
}
