import React, { useCallback } from 'react';
import { StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArcadeOnboarding } from './arcade';
import { useOnboardingStore } from './arcade/onboardingStore';
import { useProfileStore } from '@/store/profileStore';

const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';

/**
 * Hosts the Cyber-Brutalist "Arcade" onboarding journey, seeds the persistent
 * player profile from the player's selections, and persists the completion flag
 * before handing off to the main app.
 */
export default function OnboardingScreen() {
  const router = useRouter();

  const complete = useCallback(async () => {
    // Carry the onboarding selections into the persistent profile so Home /
    // Wallet / Profile reflect the player's handle, avatar and earned XP.
    const { handle, avatarIndex, interests, xpEarned } = useOnboardingStore.getState();
    useProfileStore.getState().initFromOnboarding({ handle, avatarIndex, interests, xpEarned });

    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    } catch {
      // non-fatal: worst case the player sees onboarding again next launch
    }
    router.replace('/(tabs)/home');
  }, [router]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0E0E12" />
      <ArcadeOnboarding onComplete={complete} />
    </>
  );
}
