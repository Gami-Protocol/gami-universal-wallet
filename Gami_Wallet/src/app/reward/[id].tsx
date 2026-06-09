import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import {
  GAMI,
  FONTS,
  GlowBlob,
  BrutalButton,
  Nova,
  Display,
  Body,
  Label,
  TrophyIcon,
  BoltIcon,
  SparkIcon,
} from '@/ui';
import { useQuest } from '@/features/gami/useGamiData';
import { useProfileStore } from '@/store/profileStore';

export default function RewardRevealScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const quest = useQuest(String(id));
  const xpReward = quest?.xpReward ?? 250;
  const pointReward = quest?.pointReward ?? 25;

  const [xpCount, setXpCount] = useState(0);
  const awarded = useRef(false);

  // reveal + burst animations
  const flip = useSharedValue(90);
  const cardOpacity = useSharedValue(0);
  const burst = useSharedValue(0);
  const ringScale = useSharedValue(0.6);

  useEffect(() => {
    if (awarded.current) return;
    awarded.current = true;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    // credit the reward to the persisted profile
    useProfileStore.getState().addXp(xpReward);
    useProfileStore.getState().addPoints(pointReward);

    // card flip in
    cardOpacity.value = withTiming(1, { duration: 220 });
    flip.value = withTiming(0, { duration: 520, easing: Easing.out(Easing.back(1.4)) });
    // glow burst
    burst.value = withSequence(
      withTiming(1, { duration: 520, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 240 }),
    );
    ringScale.value = withRepeat(
      withSequence(withTiming(0.9, { duration: 1100 }), withTiming(0.6, { duration: 1100 })),
      -1,
      true,
    );

    // count XP up
    const start = Date.now();
    const dur = 900;
    const timer = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / dur);
      setXpCount(Math.round(t * xpReward));
      if (t >= 1) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [xpReward, pointReward]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ perspective: 800 }, { rotateY: `${flip.value}deg` }],
  }));
  const burstStyle = useAnimatedStyle(() => ({
    opacity: burst.value * 0.8,
    transform: [{ scale: 0.4 + burst.value * 1.8 }],
  }));
  const ringStyle = useAnimatedStyle(() => ({ opacity: ringScale.value }));

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <GlowBlob color={GAMI.purple} size={360} top={-60} left={-40} opacity={0.45} />
        <GlowBlob color={GAMI.pink} size={300} bottom={-40} right={-60} opacity={0.3} />
      </View>

      {/* confetti */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {CONFETTI.map((c, i) => (
          <View key={i} style={[styles.confetti, { top: c.top, left: c.left, backgroundColor: c.color, transform: [{ rotate: `${c.rot}deg` }] }]} />
        ))}
      </View>

      <View style={[styles.body, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
        <Label color={GAMI.purpleLight}>▸ QUEST COMPLETE</Label>

        {/* burst behind card */}
        <View style={styles.cardArea}>
          <Animated.View style={[styles.burst, burstStyle]} pointerEvents="none" />
          <Animated.View style={[styles.ring, ringStyle]} pointerEvents="none" />
          <Animated.View style={[styles.cardWrap, cardStyle]}>
            <View style={[StyleSheet.absoluteFill, styles.cardShadow]} />
            <View style={styles.card}>
              <View style={styles.trophyTile}>
                <TrophyIcon size={48} color="#000" />
              </View>
              <Display style={{ textAlign: 'center', marginTop: 14 }}>{quest?.title ?? 'Reward'}</Display>
              <Text style={styles.cardSub}>STARTER REWARD UNLOCKED</Text>
            </View>
          </Animated.View>
        </View>

        {/* XP counter */}
        <View style={styles.counterRow}>
          <View style={styles.counterChip}>
            <BoltIcon size={18} color={GAMI.success} />
            <Text style={[styles.counterText, { color: GAMI.success }]}>+{xpCount.toLocaleString()} XP</Text>
          </View>
          <View style={styles.counterChip}>
            <SparkIcon size={18} color={GAMI.warn} />
            <Text style={[styles.counterText, { color: GAMI.warn }]}>+{pointReward} PTS</Text>
          </View>
        </View>

        {/* NOVA explanation */}
        <View style={styles.aiRow}>
          <Nova size={44} mood="cheer" />
          <View style={{ flex: 1 }}>
            <Body color="#fff" style={styles.aiText}>
              Nice. That's <Text style={{ color: GAMI.success, fontFamily: FONTS.monoBold }}>+{xpReward.toLocaleString()} XP</Text> toward your next level — I'll line up your next best quest.
            </Body>
          </View>
        </View>

        <BrutalButton label="CONTINUE" variant="success" onPress={() => router.replace('/(tabs)/home')} icon={<SparkIcon size={18} color="#000" />} />
      </View>
    </View>
  );
}

const CONFETTI = Array.from({ length: 18 }).map((_, i) => ({
  top: `${(i * 53) % 90}%`,
  left: `${(i * 37) % 100}%`,
  rot: i * 27,
  color: ['#FF4FA8', '#3FE0A0', '#4FE3FF', '#FFB23F', '#9C6CFF'][i % 5],
}));

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GAMI.bg },
  body: { flex: 1, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center', gap: 22 },
  confetti: { position: 'absolute', width: 7, height: 7, opacity: 0.7 },
  cardArea: { alignItems: 'center', justifyContent: 'center', height: 280 },
  burst: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: GAMI.purpleLight },
  ring: { position: 'absolute', width: 250, height: 250, borderRadius: 125, borderWidth: 3, borderColor: GAMI.purple },
  cardWrap: { width: 230, position: 'relative' },
  cardShadow: { backgroundColor: GAMI.black, transform: [{ translateX: 7 }, { translateY: 7 }] },
  card: { backgroundColor: GAMI.bgCard, borderWidth: 3, borderColor: GAMI.black, padding: 22, alignItems: 'center' },
  trophyTile: {
    width: 96,
    height: 96,
    backgroundColor: GAMI.warn,
    borderWidth: 2.5,
    borderColor: GAMI.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSub: { fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.4, color: GAMI.purpleLight, marginTop: 8 },
  counterRow: { flexDirection: 'row', gap: 12 },
  counterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: GAMI.black,
    borderWidth: 2,
    borderColor: GAMI.borderStrong,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  counterText: { fontFamily: FONTS.display, fontSize: 18 },
  aiRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 4 },
  aiText: { fontSize: 14, lineHeight: 20 },
});
