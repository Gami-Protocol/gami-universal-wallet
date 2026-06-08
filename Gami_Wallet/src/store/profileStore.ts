/**
 * Persistent player profile — hydrated from the onboarding flow and shared
 * across the app (Home, Wallet, Profile). Persisted to AsyncStorage so the
 * player's identity + XP survive restarts.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAMI } from '@/screens/Onboarding/arcade/tokens';

/** Avatar palette — mirrors the choices offered during onboarding. */
export const AVATARS = [
  { name: 'NX', bg: GAMI.pink },
  { name: 'PX', bg: GAMI.success },
  { name: 'ZK', bg: GAMI.cyan },
  { name: 'OG', bg: GAMI.warn },
  { name: '0X', bg: GAMI.purpleLight },
  { name: 'GG', bg: '#FFFFFF' },
] as const;

export const XP_PER_LEVEL = 500;

export interface ProfileState {
  handle: string;
  avatarIndex: number;
  xp: number;
  streakDays: number;
  points: number;
  interests: string[];
  hydrated: boolean;

  /** seed the profile from the onboarding selections */
  initFromOnboarding: (p: {
    handle: string;
    avatarIndex: number;
    interests: string[];
    xpEarned: number;
  }) => void;
  addXp: (amount: number) => void;
  addPoints: (amount: number) => void;
  bumpStreak: () => void;
  setHydrated: () => void;
}

/** Derived level helpers (linear 500xp/level). */
export const levelFromXp = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;
export const levelProgress = (xp: number) => (xp % XP_PER_LEVEL) / XP_PER_LEVEL;
export const xpIntoLevel = (xp: number) => xp % XP_PER_LEVEL;

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      handle: 'anon',
      avatarIndex: 0,
      xp: 0,
      streakDays: 1,
      points: 0,
      interests: [],
      hydrated: false,

      initFromOnboarding: ({ handle, avatarIndex, interests, xpEarned }) =>
        set({
          handle: handle?.trim() || 'anon',
          avatarIndex,
          interests,
          xp: xpEarned,
          points: Math.round(xpEarned / 10),
        }),
      addXp: (amount) => set((s) => ({ xp: s.xp + amount })),
      addPoints: (amount) => set((s) => ({ points: s.points + amount })),
      bumpStreak: () => set((s) => ({ streakDays: s.streakDays + 1 })),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'gami-profile',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
      partialize: ({ handle, avatarIndex, xp, streakDays, points, interests }) => ({
        handle,
        avatarIndex,
        xp,
        streakDays,
        points,
        interests,
      }),
    },
  ),
);
