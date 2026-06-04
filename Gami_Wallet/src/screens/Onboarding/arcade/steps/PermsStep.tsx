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
  BellIcon,
  FlameIcon,
  TrophyIcon,
} from '../components';
import { GAMI, FONTS } from '../tokens';
import { useOnboardingStore } from '../onboardingStore';
import type { StepProps } from './types';

const NOTIFS = [
  { icon: <FlameIcon size={14} color={GAMI.pink} />, title: '🔥 7-day streak!', sub: '+200 XP awarded' },
  { icon: <TrophyIcon size={14} color={GAMI.warn} />, title: 'New quest available', sub: 'NOVA recommends: Mint Mondays' },
];

export function PermsStep({ index, total, onBack, onComplete }: StepProps) {
  const setNotificationsEnabled = useOnboardingStore((s) => s.setNotificationsEnabled);
  const addXp = useOnboardingStore((s) => s.addXp);
  const bob = useSharedValue(0);

  useEffect(() => {
    bob.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 700, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 700, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, []);
  const bobStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bob.value }] }));

  const finish = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    addXp(250); // starter pack reward
    onComplete();
  };

  return (
    <ArcadeScreen step={index} steps={total} onBack={onBack}>
      <View style={styles.flow}>
        <View>
          <Title>Stay in{'\n'}the loop.</Title>
          <Body style={{ marginTop: 10 }}>
            We ping you for streaks + rewards. Nothing else. Promise.
          </Body>
        </View>

        {/* big bell */}
        <View style={styles.bellWrap}>
          <BrutalBox offset={7} borderWidth={3} background={GAMI.warn} style={styles.bell}>
            <BellIcon size={64} color="#000" />
          </BrutalBox>
          <Animated.View style={[styles.badge, bobStyle]}>
            <Text style={styles.badgeText}>3</Text>
          </Animated.View>
        </View>

        {/* notif previews */}
        <View style={{ gap: 6 }}>
          {NOTIFS.map((n) => (
            <BrutalBox key={n.title} fill offset={3} borderWidth={1.5} background={GAMI.bgCard} style={styles.notif}>
              <View style={styles.notifIcon}>{n.icon}</View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>{n.title}</Text>
                <Text style={styles.notifSub}>{n.sub}</Text>
              </View>
            </BrutalBox>
          ))}
        </View>

        <View style={{ gap: 8 }}>
          <BrutalButton
            label="TURN ON NOTIFICATIONS"
            variant="primary"
            onPress={() => finish(true)}
            icon={<BellIcon size={16} color="#fff" />}
          />
          <Pressable onPress={() => finish(false)} style={styles.skip}>
            <Text style={styles.skipText}>Maybe later</Text>
          </Pressable>
        </View>
      </View>
    </ArcadeScreen>
  );
}

const styles = StyleSheet.create({
  flow: { flex: 1, justifyContent: 'space-between', paddingTop: 16, paddingBottom: 8 },
  bellWrap: { alignItems: 'center', justifyContent: 'center' },
  bell: {
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-5deg' }],
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: '30%',
    width: 36,
    height: 36,
    backgroundColor: GAMI.pink,
    borderWidth: 3,
    borderColor: GAMI.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: FONTS.display, fontSize: 14, color: '#fff' },
  notif: { flexDirection: 'row', gap: 10, padding: 10, alignItems: 'center' },
  notifIcon: {
    width: 32,
    height: 32,
    backgroundColor: GAMI.black,
    borderWidth: 1.5,
    borderColor: GAMI.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifTitle: { fontFamily: FONTS.display, fontSize: 13, color: '#fff' },
  notifSub: { fontFamily: FONTS.mono, fontSize: 10, color: 'rgba(255,255,255,0.5)' },
  skip: { alignItems: 'center', paddingVertical: 6 },
  skipText: { fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(255,255,255,0.5)' },
});
