import Constants from 'expo-constants';
import { XPEventInput, RewardDecisionInput, DashboardSyncEvent } from './types';

export const GAMI_API_URL = process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${GAMI_API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json();
}

export const GamiAPI = {
  baseUrl: GAMI_API_URL,
  getMe: () => request('/api/me'),
  getProfile: (address: string) => request(`/api/wallet/${address}`),
  getQuests: () => request('/api/quests'),
  completeQuest: (questId: string) => request(`/api/quests/${questId}/complete`, { method: 'POST' }),
  claimQuest: (questId: string) => request(`/api/quests/${questId}/claim`, { method: 'POST' }),
  getRewards: () => request('/api/rewards'),
  getAgentIntegration: () => request('/api/agent/integration'),
  getAgentTooling: () => request('/api/agent/tooling'),
  submitXPEvent: (input: XPEventInput) => request('/api/xp/events', { method: 'POST', body: JSON.stringify(input) }),
  rewardDecision: (input: RewardDecisionInput) => request('/api/agent/reward-decision', { method: 'POST', body: JSON.stringify(input) }),
  syncEvent: (input: DashboardSyncEvent) => request('/api/sync/events', { method: 'POST', body: JSON.stringify(input) }),
  getSyncEvents: (userId: string) => request(`/api/sync/events?userId=${encodeURIComponent(userId)}`),
};
