import React, { useCallback } from 'react';
import { StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArcadeOnboarding } from './arcade';

const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';

/**
 * Hosts the Cyber-Brutalist "Arcade" onboarding journey and persists the
 * completion flag before handing the player off to the main app.
 */
export default function OnboardingScreen() {
  const router = useRouter();

  const complete = useCallback(async () => {
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
