import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
  WalletIcon,
  SparkIcon,
  CheckIcon,
  ArrowIcon,
} from '../components';
import { GAMI, FONTS } from '../tokens';
import type { StepProps } from './types';

const STAGES = ['KEYS GENERATED', 'VAULT ENCRYPTED', 'ON-CHAIN HANDSHAKE'];

export function CreateStep({ index, total, onNext }: StepProps) {
  const [done, setDone] = useState(0);
  const bob = useSharedValue(0);
  const spin = useSharedValue(0);

  useEffect(() => {
    bob.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
    spin.value = withRepeat(withTiming(360, { duration: 4000, easing: Easing.linear }), -1, false);

    // simulate wallet provisioning
    const timers = STAGES.map((_, i) =>
      setTimeout(() => setDone(i + 1), 600 + i * 750),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const ready = done >= STAGES.length;

  const bobStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bob.value }] }));
  const spinStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value}deg` }] }));

  return (
    <ArcadeScreen step={index} steps={total}>
      <View style={styles.center}>
        {/* animated wallet tile */}
        <View>
          <BrutalBox offset={8} borderWidth={3} background={GAMI.purple} style={styles.tile}>
            <Animated.View style={bobStyle}>
              <WalletIcon size={80} color="#fff" />
            </Animated.View>
            <Animated.View style={[StyleSheet.absoluteFill, styles.sparkLayer, spinStyle]}>
              <View style={[styles.sparkPos, { top: 8, left: 8 }]}>
                <SparkIcon size={14} color={GAMI.pink} />
              </View>
              <View style={[styles.sparkPos, { top: 8, right: 8 }]}>
                <SparkIcon size={10} color={GAMI.success} />
              </View>
              <View style={[styles.sparkPos, { bottom: 8, left: 14 }]}>
                <SparkIcon size={12} color={GAMI.cyan} />
              </View>
              <View style={[styles.sparkPos, { bottom: 12, right: 10 }]}>
                <SparkIcon size={14} color={GAMI.purpleLight} />
              </View>
            </Animated.View>
          </BrutalBox>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Title style={{ textAlign: 'center' }}>Forging your{'\n'}wallet…</Title>
          <Body style={{ marginTop: 12, textAlign: 'center' }}>
            Generating keys. Locking 'em up tight. We'll set up backup later — promise.
          </Body>
        </View>

        {/* status pills */}
        <View style={styles.pills}>
          {STAGES.map((label, i) => {
            const isDone = i < done;
            return (
              <BrutalBox key={label} fill offset={3} borderWidth={1.5} background={GAMI.bgElev} style={styles.pill}>
                <Text style={[styles.pillLabel, { color: isDone ? GAMI.success : 'rgba(255,255,255,0.5)' }]}>
                  {label}
                </Text>
                {isDone ? (
                  <CheckIcon size={14} color={GAMI.success} />
                ) : (
                  <View style={styles.spinner} />
                )}
              </BrutalBox>
            );
          })}
        </View>

        <BrutalButton
          label={ready ? 'ENTER THE ARCADE' : 'FORGING…'}
          variant={ready ? 'success' : 'primary'}
          disabled={!ready}
          onPress={onNext}
          icon={ready ? <ArrowIcon size={18} color="#000" /> : undefined}
        />
      </View>
    </ArcadeScreen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 24 },
  tile: { width: 160, height: 160, alignItems: 'center', justifyContent: 'center' },
  sparkLayer: { alignItems: 'center', justifyContent: 'center' },
  sparkPos: { position: 'absolute' },
  pills: { width: '100%', gap: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  pillLabel: { fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 1 },
  spinner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: GAMI.purpleLight,
    borderRightColor: 'transparent',
  },
});
