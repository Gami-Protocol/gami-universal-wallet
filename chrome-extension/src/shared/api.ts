const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

async function fetchWithTimeout(url: string, options: FetchOptions = {}): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function apiRequest<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const response = await fetchWithTimeout(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// API Types
export interface UserProfile {
  user_id: string;
  username: string;
  level: number;
  total_xp: number;
  xp_to_next_level: number;
  streak: number;
  badges: string[];
  joined_at: string;
}

export interface Token {
  symbol: string;
  name: string;
  balance: string;
  usd_value: number;
  chain: string;
  logo_url?: string;
  change_24h?: number;
}

export interface NFT {
  id: string;
  name: string;
  collection: string;
  image_url: string;
  chain: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: string;
  image_url?: string;
  available: boolean;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  progress: number;
  target: number;
  completed: boolean;
  type: 'daily' | 'weekly' | 'special';
}

export interface CheckinData {
  streak: number;
  last_checkin: string;
  can_checkin: boolean;
  weekly_progress: boolean[];
}

export interface SpinResult {
  prize: string;
  amount: number;
  type: 'xp' | 'token' | 'nft' | 'badge';
}

export interface StakingInfo {
  staked_amount: string;
  rewards_earned: string;
  apy: number;
  lock_period_days: number;
}

export interface Pool {
  id: string;
  name: string;
  tvl: string;
  apy: number;
  tokens: string[];
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'stake' | 'claim';
  amount: string;
  token: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
  hash?: string;
}

export interface Network {
  id: string;
  name: string;
  chain_id: number;
  rpc_url: string;
  explorer_url: string;
  native_token: string;
}

// API Client
export const api = {
  // Health Check
  health: () => apiRequest<{ status: string }>('/api/health'),
  
  // User & Profile
  getUser: () => apiRequest<UserProfile>('/api/user'),
  getProfile: () => apiRequest<UserProfile>('/api/profile'),
  
  // Tokens & Assets
  getTokens: () => apiRequest<Token[]>('/api/tokens'),
  getNFTs: () => apiRequest<NFT[]>('/api/nfts'),
  getNetworks: () => apiRequest<Network[]>('/api/networks'),
  
  // Gamification
  getRewards: (category?: string) => 
    apiRequest<Reward[]>(`/api/rewards${category ? `?category=${category}` : ''}`),
  redeemReward: (title: string) => 
    apiRequest<{ success: boolean; message: string }>('/api/rewards/redeem', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),
  getMissions: () => apiRequest<Mission[]>('/api/missions'),
  completeMission: (title: string) =>
    apiRequest<{ success: boolean; xp_earned: number }>('/api/missions/complete', {
      method: 'PUT',
      body: JSON.stringify({ title }),
    }),
  
  // Streak & Spin
  getCheckins: () => apiRequest<CheckinData>('/api/checkins'),
  dailyCheckin: () => 
    apiRequest<{ success: boolean; streak: number; xp_earned: number }>('/api/user/checkin', {
      method: 'PUT',
    }),
  spin: () => apiRequest<SpinResult>('/api/spin', { method: 'POST' }),
  
  // Staking & DeFi
  getStaking: () => apiRequest<StakingInfo>('/api/staking'),
  getPools: () => apiRequest<Pool[]>('/api/pools'),
  getTransactions: () => apiRequest<Transaction[]>('/api/transactions'),
  
  // Agent Integration
  getAgentIntegration: () => apiRequest<{ connected: boolean }>('/api/agent/integration'),
};

export default api;
