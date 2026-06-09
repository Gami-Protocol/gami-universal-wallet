/**
 * Persistent app settings — security, game and notification preferences shown
 * on the Settings screen. Persisted to AsyncStorage via zustand.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type NovaPersonality = 'Hype' | 'Chill' | 'Pro';

export interface SettingsState {
  faceId: boolean;
  sound: boolean;
  haptics: boolean;
  hideBalances: boolean;
  notifications: boolean;
  novaPersonality: NovaPersonality;
  autoLock: string;
  hydrated: boolean;

  toggle: (key: BoolSetting) => void;
  set: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  setHydrated: () => void;
}

export type BoolSetting = 'faceId' | 'sound' | 'haptics' | 'hideBalances' | 'notifications';

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      faceId: false,
      sound: true,
      haptics: true,
      hideBalances: false,
      notifications: false,
      novaPersonality: 'Hype',
      autoLock: '1 minute',
      hydrated: false,

      toggle: (key) => set((s) => ({ [key]: !s[key] }) as Partial<SettingsState>),
      set: (key, value) => set({ [key]: value } as Partial<SettingsState>),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'gami-settings',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
      partialize: ({ faceId, sound, haptics, hideBalances, notifications, novaPersonality, autoLock }) => ({
        faceId,
        sound,
        haptics,
        hideBalances,
        notifications,
        novaPersonality,
        autoLock,
      }),
    },
  ),
);
