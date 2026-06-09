import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import {
  ArcadeScreen,
  BrutalBox,
  BrutalButton,
  Title,
  Body,
  FaceIcon,
  ShieldIcon,
} from '../components';
import { GAMI, FONTS } from '../tokens';
import { useOnboardingStore } from '../onboardingStore';
import { authenticate } from '@/features/auth/biometrics';
import type { StepProps } from './types';

export function BiometricStep({ index, total, onNext, onBack }: StepProps) {
  const setBiometricEnabled = useOnboardingStore((s) => s.setBiometricEnabled);
  const spin = useSharedValue(0);
  const bob = useSharedValue(0);

  useEffect(() => {
    spin.value = withRepeat(withTiming(360, { duration: 8000, easing: Easing.linear }), -1, false);
    bob.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1250, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1250, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, []);

  const spinStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value}deg` }] }));
  const bobStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bob.value }] }));

  const enable = async () => {
    const ok = await authenticate('Enable Face ID for Gami Wallet');
    setBiometricEnabled(ok);
    onNext();
  };

  return (
    <ArcadeScreen step={index} steps={total} onBack={onBack}>
      <View style={styles.flow}>
        <View>
          <Title>Lock it{'\n'}with your face.</Title>
          <Body style={{ marginTop: 12 }}>
            Your wallet only opens for you. Even we can't peek.
          </Body>
        </View>

        <View style={styles.rings}>
          <View style={styles.ringOuter} />
          <Animated.View style={[styles.ringDashed, spinStyle]} />
          <Animated.View style={bobStyle}>
            <BrutalBox offset={6} borderWidth={3} background={GAMI.purple} style={styles.faceTile}>
              <FaceIcon size={56} color="#fff" />
            </BrutalBox>
          </Animated.View>
        </View>

        <View style={{ gap: 10 }}>
          <View style={styles.banner}>
            <ShieldIcon size={16} color={GAMI.success} />
            <Text style={styles.bannerText}>STORED ON-DEVICE ONLY</Text>
          </View>
          <BrutalButton
            label="ENABLE FACE ID"
            variant="primary"
            onPress={enable}
            icon={<FaceIcon size={18} color="#fff" />}
          />
          <Pressable onPress={onNext} style={styles.skip}>
            <Text style={styles.skipText}>Skip for now</Text>
          </Pressable>
        </View>
      </View>
    </ArcadeScreen>
  );
}

const styles = StyleSheet.create({
  flow: { flex: 1, justifyContent: 'space-between', paddingTop: 16, paddingBottom: 8 },
  rings: { height: 220, alignItems: 'center', justifyContent: 'center' },
  ringOuter: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: GAMI.purple,
  },
  ringDashed: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: GAMI.purpleLight,
    borderStyle: 'dashed',
  },
  faceTile: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: 'rgba(63,224,160,0.1)',
    borderWidth: 1.5,
    borderColor: GAMI.success,
  },
  bannerText: { fontFamily: FONTS.mono, fontSize: 11, color: GAMI.success, letterSpacing: 1 },
  skip: { alignItems: 'center', paddingVertical: 8 },
  skipText: { fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(255,255,255,0.5)' },
});
