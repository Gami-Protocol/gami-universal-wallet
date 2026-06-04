/**
 * Onboarding store — captures the choices a new player makes while moving
 * through the Arcade flow (avatar, handle, interests, security & notification
 * preferences) plus the XP earned. Persisted on completion so the rest of the
 * app can read the freshly-minted profile.
 */
import { create } from 'zustand';

export type AuthMethod = 'create' | 'google' | 'apple' | 'import';

export interface OnboardingState {
  authMethod: AuthMethod | null;
  avatarIndex: number;
  handle: string;
  interests: string[];
  novaEnabled: boolean;
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  xpEarned: number;

  setAuthMethod: (m: AuthMethod) => void;
  setAvatarIndex: (i: number) => void;
  setHandle: (h: string) => void;
  toggleInterest: (id: string) => void;
  setNovaEnabled: (v: boolean) => void;
  setBiometricEnabled: (v: boolean) => void;
  setNotificationsEnabled: (v: boolean) => void;
  addXp: (amount: number) => void;
  reset: () => void;
}

const INITIAL = {
  authMethod: null as AuthMethod | null,
  avatarIndex: 0,
  handle: '',
  interests: [] as string[],
  novaEnabled: true,
  biometricEnabled: false,
  notificationsEnabled: false,
  xpEarned: 0,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...INITIAL,

  setAuthMethod: (authMethod) => set({ authMethod }),
  setAvatarIndex: (avatarIndex) => set({ avatarIndex }),
  setHandle: (handle) => set({ handle }),
  toggleInterest: (id) =>
    set((s) => ({
      interests: s.interests.includes(id)
        ? s.interests.filter((x) => x !== id)
        : [...s.interests, id],
    })),
  setNovaEnabled: (novaEnabled) => set({ novaEnabled }),
  setBiometricEnabled: (biometricEnabled) => set({ biometricEnabled }),
  setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
  addXp: (amount) => set((s) => ({ xpEarned: s.xpEarned + amount })),
  reset: () => set({ ...INITIAL }),
}));
