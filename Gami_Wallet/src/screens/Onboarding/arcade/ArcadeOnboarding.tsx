/**
 * ArcadeOnboarding — the orchestrator for the Cyber-Brutalist "Arcade" new
 * player flow. Drives a 9-step journey with animated slide transitions and a
 * hardware-back-aware step controller.
 *
 *   Welcome → Auth → Create wallet → Biometric → Handle/Avatar
 *           → Meet NOVA → Interests → How XP works → Notifications → done
 */
import React, { useCallback, useState } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Animated, { SlideInRight, SlideInLeft } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { GAMI } from './tokens';
import {
  WelcomeStep,
  AuthStep,
  CreateStep,
  BiometricStep,
  UsernameStep,
  NovaStep,
  InterestsStep,
  RewardsStep,
  PermsStep,
  type StepProps,
} from './steps';

const STEPS: React.ComponentType<StepProps>[] = [
  WelcomeStep,
  AuthStep,
  CreateStep,
  BiometricStep,
  UsernameStep,
  NovaStep,
  InterestsStep,
  RewardsStep,
  PermsStep,
];

export interface ArcadeOnboardingProps {
  /** called once the player finishes (or skips through) the whole flow */
  onComplete: () => void;
}

export function ArcadeOnboarding({ onComplete }: ArcadeOnboardingProps) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  const haptic = () =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

  const goNext = useCallback(() => {
    haptic();
    setDir(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }, []);

  const goBack = useCallback(() => {
    haptic();
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  // Android hardware back walks the flow backwards instead of leaving.
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (step > 0) {
          goBack();
          return true;
        }
        return false;
      });
      return () => sub.remove();
    }, [step, goBack]),
  );

  const Current = STEPS[step];
  const entering = (dir === 1 ? SlideInRight : SlideInLeft).duration(280);

  return (
    <View style={styles.root}>
      <Animated.View key={step} entering={entering} style={styles.stepFill}>
        <Current
          index={step}
          total={STEPS.length}
          onNext={goNext}
          onBack={step > 0 ? goBack : undefined}
          onComplete={onComplete}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GAMI.bg },
  stepFill: { flex: 1 },
});
