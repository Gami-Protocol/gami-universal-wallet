/**
 * Local demo content. The screens prefer live data from GamiAPI/React Query but
 * fall back to this so the app is fully explorable without a running backend.
 */
import type { GamiQuest } from './types';

export interface MockToken {
  symbol: string;
  name: string;
  balance: string;
  usd: number;
  change24h: number;
  color: string;
}

export interface MockNft {
  id: string;
  name: string;
  collection: string;
  color: string;
}

export interface MockTx {
  id: string;
  kind: 'send' | 'receive' | 'swap' | 'reward';
  title: string;
  subtitle: string;
  amount: string;
  when: string;
}

export interface LeaderRow {
  rank: number;
  handle: string;
  xp: number;
  avatar: string;
  you?: boolean;
}

export const QUEST_FILTERS = ['daily', 'weekly', 'sponsored'] as const;
export type QuestFilter = (typeof QUEST_FILTERS)[number];

export const mockQuests: GamiQuest[] = [
  {
    id: 'q-daily-login',
    title: 'Daily Check-in',
    description: 'Open Gami and keep your streak alive. Easiest XP you will earn all day.',
    type: 'daily',
    status: 'claimable',
    progress: 1,
    target: 1,
    xpReward: 100,
    pointReward: 10,
  },
  {
    id: 'q-daily-swap',
    title: 'First Swap',
    description: 'Swap any token to complete your first on-chain action of the day.',
    type: 'daily',
    status: 'active',
    progress: 0,
    target: 1,
    xpReward: 500,
    pointReward: 50,
  },
  {
    id: 'q-weekly-streak',
    title: '7-Day Streak',
    description: 'Check in every day this week to bank a huge streak multiplier.',
    type: 'weekly',
    status: 'active',
    progress: 3,
    target: 7,
    xpReward: 1500,
    pointReward: 200,
  },
  {
    id: 'q-weekly-refer',
    title: 'Refer 3 Friends',
    description: 'Invite friends with your referral link. Both of you earn.',
    type: 'weekly',
    status: 'active',
    progress: 1,
    target: 3,
    xpReward: 3000,
    pointReward: 500,
  },
  {
    id: 'q-sponsored-mint',
    title: 'Mint Mondays',
    description: 'Mint the featured partner NFT to unlock a sponsored reward bundle.',
    type: 'sponsored',
    status: 'active',
    progress: 0,
    target: 1,
    xpReward: 2500,
    pointReward: 750,
    partnerId: 'nova-labs',
  },
  {
    id: 'q-sponsored-bridge',
    title: 'Bridge to Base',
    description: 'Bridge any amount to Base and earn sponsored XP from the partner pool.',
    type: 'sponsored',
    status: 'locked',
    progress: 0,
    target: 1,
    xpReward: 2000,
    pointReward: 400,
    partnerId: 'base',
  },
];

export const mockTokens: MockToken[] = [
  { symbol: 'GAMI', name: 'Gami Protocol', balance: '12,450.00', usd: 1245.0, change24h: 8.4, color: '#9C6CFF' },
  { symbol: 'ETH', name: 'Ethereum', balance: '0.842', usd: 2310.5, change24h: 2.1, color: '#4FE3FF' },
  { symbol: 'SOL', name: 'Solana', balance: '14.2', usd: 1980.0, change24h: -3.2, color: '#3FE0A0' },
  { symbol: 'USDC', name: 'USD Coin', balance: '540.00', usd: 540.0, change24h: 0.0, color: '#4FE3FF' },
];

export const mockNfts: MockNft[] = [
  { id: 'nft-1', name: 'Starter Badge', collection: 'Gami Genesis', color: '#FFB23F' },
  { id: 'nft-2', name: 'Nova #042', collection: 'Nova Labs', color: '#FF4FA8' },
  { id: 'nft-3', name: 'Quest Crown', collection: 'Gami Genesis', color: '#3FE0A0' },
];

export const mockTransactions: MockTx[] = [
  { id: 'tx-1', kind: 'reward', title: 'Quest reward', subtitle: 'Daily Check-in', amount: '+100 XP', when: '2m ago' },
  { id: 'tx-2', kind: 'receive', title: 'Received GAMI', subtitle: 'from 0x91a…22c', amount: '+250 GAMI', when: '1h ago' },
  { id: 'tx-3', kind: 'swap', title: 'Swapped', subtitle: 'ETH → USDC', amount: '0.1 ETH', when: '3h ago' },
  { id: 'tx-4', kind: 'send', title: 'Sent SOL', subtitle: 'to 0x7f3…b29c', amount: '-2.0 SOL', when: 'Yesterday' },
];

export const mockLeaderboard: LeaderRow[] = [
  { rank: 1, handle: 'satoshi_jr', xp: 184200, avatar: 'SJ' },
  { rank: 2, handle: 'degenqueen', xp: 152900, avatar: 'DQ' },
  { rank: 3, handle: 'vault_rat', xp: 141050, avatar: 'VR' },
  { rank: 4, handle: 'gm_wagmi', xp: 98700, avatar: 'GW' },
  { rank: 5, handle: 'noxx_', xp: 91200, avatar: 'NX', you: true },
];

export const getMockQuest = (id: string) => mockQuests.find((q) => q.id === id);
