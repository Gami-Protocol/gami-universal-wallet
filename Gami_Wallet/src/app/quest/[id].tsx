import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  GAMI,
  FONTS,
  GlowBlob,
  BrutalBox,
  BrutalButton,
  Pill,
  Nova,
  Display,
  Body,
  Label,
  ChevronLeftIcon,
  BoltIcon,
  SparkIcon,
  CheckIcon,
  TrophyIcon,
} from '@/ui';
import { useQuest } from '@/features/gami/useGamiData';

export default function QuestDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const quest = useQuest(String(id));

  if (!quest) {
    return (
      <View style={[styles.root, styles.center]}>
        <Body>Quest not found.</Body>
      </View>
    );
  }

  const requirements = buildRequirements(quest.type, quest.target);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <GlowBlob color={GAMI.purple} size={300} top={-90} right={-70} opacity={0.4} />
      </View>

      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <ChevronLeftIcon size={16} color="#fff" />
        </Pressable>
        <Pill label={quest.type.toUpperCase()} tone="purple" icon={<TrophyIcon size={11} color={GAMI.purpleLight} />} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 28, gap: 18 }}
      >
        <Display style={{ marginTop: 8 }}>{quest.title}</Display>
        <Body>{quest.description}</Body>

        {/* Reward preview */}
        <View style={styles.rewardRow}>
          <View style={styles.rewardCell}>
            <BrutalBox fill offset={4} background={GAMI.bgElev} style={styles.rewardCard}>
              <BoltIcon size={20} color={GAMI.success} />
              <Text style={[styles.rewardValue, { color: GAMI.success }]}>+{quest.xpReward.toLocaleString()}</Text>
              <Label>XP GAIN</Label>
            </BrutalBox>
          </View>
          <View style={styles.rewardCell}>
            <BrutalBox fill offset={4} background={GAMI.bgElev} style={styles.rewardCard}>
              <SparkIcon size={20} color={GAMI.warn} />
              <Text style={[styles.rewardValue, { color: GAMI.warn }]}>+{quest.pointReward}</Text>
              <Label>POINTS</Label>
            </BrutalBox>
          </View>
        </View>

        {/* Requirements */}
        <View>
          <Label>COMPLETION REQUIREMENTS</Label>
          <View style={{ gap: 8, marginTop: 10 }}>
            {requirements.map((r, i) => {
              const done = i < quest.progress;
              return (
                <BrutalBox key={i} fill offset={3} borderWidth={1.5} background={GAMI.bgCard} style={styles.reqRow}>
                  <View style={[styles.reqDot, { backgroundColor: done ? GAMI.success : 'transparent', borderColor: done ? GAMI.success : GAMI.borderStrong }]}>
                    {done && <CheckIcon size={12} color="#000" />}
                  </View>
                  <Text style={[styles.reqText, done && styles.reqTextDone]}>{r}</Text>
                </BrutalBox>
              );
            })}
          </View>
        </View>

        {/* NOVA AI recommendation */}
        <View style={styles.aiWrap}>
          <View style={[StyleSheet.absoluteFill, styles.aiShadow]} />
          <View style={styles.ai}>
            <View style={styles.aiHead}>
              <Nova size={48} mood="think" />
              <View>
                <Label color={GAMI.purpleLight}>▸ NOVA — AI CO-PILOT</Label>
                <Text style={styles.aiTitle}>Recommended move</Text>
              </View>
            </View>
            <Text style={styles.aiBody}>{recommendation(quest.type, quest.xpReward)}</Text>
          </View>
        </View>

        <BrutalButton
          label={quest.status === 'claimable' ? 'CLAIM REWARD' : 'COMPLETE QUEST'}
          variant={quest.status === 'claimable' ? 'success' : 'primary'}
          onPress={() => router.push({ pathname: '/reward/[id]', params: { id: quest.id } })}
          icon={<SparkIcon size={18} color={quest.status === 'claimable' ? '#000' : '#fff'} />}
        />
      </ScrollView>
    </View>
  );
}

function buildRequirements(type: string, target: number): string[] {
  if (target > 1) return Array.from({ length: target }, (_, i) => `Step ${i + 1} of ${target}`);
  switch (type) {
    case 'daily':
      return ['Open the app today', 'Tap to claim your reward'];
    case 'sponsored':
      return ['Connect an eligible wallet', 'Complete the partner action'];
    default:
      return ['Complete the on-chain action'];
  }
}

function recommendation(type: string, xp: number): string {
  if (type === 'sponsored') return `High-value sponsored quest — ${xp.toLocaleString()} XP is ~3× a daily. Do this before it expires; partner pools drain fast.`;
  if (type === 'weekly') return `You're on pace. Knock this out early in the week so a missed day doesn't break your multiplier.`;
  return `Quick win. Pair it with your daily check-in to stack a streak bonus on top of the ${xp.toLocaleString()} XP.`;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GAMI.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: GAMI.borderStrong, backgroundColor: GAMI.bgElev },
  rewardRow: { flexDirection: 'row', gap: 12 },
  rewardCell: { flex: 1 },
  rewardCard: { padding: 16, gap: 6, alignItems: 'flex-start' },
  rewardValue: { fontFamily: FONTS.display, fontSize: 26 },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  reqDot: { width: 22, height: 22, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  reqText: { flex: 1, fontFamily: FONTS.sansSemi, fontSize: 14, color: '#fff' },
  reqTextDone: { color: 'rgba(255,255,255,0.4)', textDecorationLine: 'line-through' },
  aiWrap: { position: 'relative' },
  aiShadow: { backgroundColor: GAMI.purple, transform: [{ translateX: 5 }, { translateY: 5 }] },
  ai: { backgroundColor: GAMI.bgElev, borderWidth: 2.5, borderColor: GAMI.black, padding: 16 },
  aiHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  aiTitle: { fontFamily: FONTS.display, fontSize: 18, color: '#fff', marginTop: 2 },
  aiBody: { fontFamily: FONTS.sans, fontSize: 14, lineHeight: 20, color: GAMI.textDim },
});
