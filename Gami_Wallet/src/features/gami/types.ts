export type HexAddress = `0x${string}`;

export type GamiChain = {
  chainId: number;
  chainIdHex: `0x${string}`;
  name: string;
  rpcUrl: string;
  explorerUrl?: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

export type GamiUserProfile = {
  userId: string;
  walletAddress?: HexAddress;
  displayName?: string;
  avatarUrl?: string;
  totalXp: number;
  level: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  universalPoints: number;
  streakDays: number;
  rank?: number;
};

export type GamiQuestStatus = 'locked' | 'active' | 'completed' | 'claimable' | 'claimed' | 'expired';

export type GamiQuest = {
  id: string;
  partnerId?: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'sponsored' | 'partner' | 'referral' | 'wallet' | 'social' | 'onchain' | 'streak' | 'custom';
  status: GamiQuestStatus;
  progress: number;
  target: number;
  xpReward: number;
  pointReward: number;
  chainId?: number;
  startsAt?: string;
  endsAt?: string;
};

export type GamiReward = {
  id: string;
  title: string;
  description?: string;
  type: 'universal_points' | 'xp_boost' | 'coupon' | 'badge' | 'nft' | 'sponsored_quest_unlock';
  amount?: number;
  status: 'locked' | 'claimable' | 'claimed' | 'expired';
  questId?: string;
  metadata?: Record<string, string | number | boolean>;
};

export type XPEventInput = {
  eventId: string;
  eventType: string;
  userId: string;
  walletAddress?: HexAddress;
  partnerId?: string;
  questId?: string;
  chainId?: number;
  metadata?: Record<string, string | number | boolean>;
};

export type RewardDecisionInput = {
  userId: string;
  walletAddress?: HexAddress;
  level: number;
  questId?: string;
  chainId?: number;
  context: {
    region?: string;
    partnerId?: string;
    source: 'expo-wallet' | 'chrome-extension' | 'web-dashboard';
  };
  stakingTier?: string;
  riskScore?: number;
};

export type RewardDecision = {
  rewardPackageId: string;
  rewards: GamiReward[];
  explain: string[];
  claimable: boolean;
};

export type DashboardSyncEvent = {
  id: string;
  source: 'expo-wallet' | 'chrome-extension';
  type: 'wallet_connected' | 'quest_progress' | 'quest_completed' | 'reward_claimed' | 'chain_switched';
  userId?: string;
  walletAddress?: HexAddress;
  chainId?: number;
  partnerId?: string;
  questId?: string;
  payload?: Record<string, string | number | boolean>;
  createdAt: string;
};
