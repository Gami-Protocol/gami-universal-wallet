import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  GAMI,
  FONTS,
  GlowBlob,
  BrutalBox,
  Pill,
  Title,
  Label,
  BoltIcon,
  TrophyIcon,
  ArrowIcon,
  SparkIcon,
} from '@/ui';
import { mockQuests, QUEST_FILTERS, type QuestFilter } from '@/features/gami/mockData';
import type { GamiQuest } from '@/features/gami/types';

const FILTER_COLOR: Record<QuestFilter, string> = {
  daily: GAMI.pink,
  weekly: GAMI.success,
  sponsored: GAMI.warn,
};

export default function QuestsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filter, setFilter] = useState<QuestFilter>('daily');

  const quests = useMemo(() => mockQuests.filter((q) => q.type === filter), [filter]);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <GlowBlob color={GAMI.purple} size={300} top={-100} left={-80} opacity={0.35} />
      </View>

      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20 }}>
        <Title>Quests</Title>
        <Label style={{ marginTop: 6 }}>EARN XP · STACK REWARDS</Label>

        {/* Filter tabs */}
        <View style={styles.filters}>
          {QUEST_FILTERS.map((f) => {
            const active = f === filter;
            return (
              <Pressable key={f} onPress={() => setFilter(f)} style={styles.filterPress}>
                <View
                  style={[
                    styles.filter,
                    active && { backgroundColor: FILTER_COLOR[f], borderColor: GAMI.black },
                  ]}
                >
                  <Text style={[styles.filterText, active && { color: '#000' }]}>{f.toUpperCase()}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={quests}
        keyExtractor={(q) => q.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 28, gap: 14 }}
        ListEmptyComponent={<Text style={styles.empty}>No {filter} quests right now. Check back soon.</Text>}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 60).duration(320)}>
            <QuestCard quest={item} accent={FILTER_COLOR[filter]} onPress={() => router.push({ pathname: '/quest/[id]', params: { id: item.id } })} />
          </Animated.View>
        )}
      />
    </View>
  );
}

function QuestCard({ quest, accent, onPress }: { quest: GamiQuest; accent: string; onPress: () => void }) {
  const pct = quest.target ? Math.round((quest.progress / quest.target) * 100) : 0;
  const locked = quest.status === 'locked';
  const claimable = quest.status === 'claimable';

  return (
    <Pressable onPress={onPress} disabled={locked} style={{ opacity: locked ? 0.55 : 1 }}>
      <BrutalBox fill offset={5} shadowColor={accent} background={GAMI.bgCard} style={styles.card}>
        <View style={styles.cardTop}>
          {quest.partnerId ? (
            <Pill label={`SPONSORED · ${quest.partnerId}`} tone="purple" icon={<SparkIcon size={11} color={GAMI.purpleLight} />} />
          ) : (
            <Pill label={quest.type.toUpperCase()} icon={<TrophyIcon size={11} color={accent} />} />
          )}
          <Text style={styles.progressLabel}>{quest.progress}/{quest.target}</Text>
        </View>

        <Text style={styles.title}>{quest.title}</Text>
        <Text style={styles.desc} numberOfLines={2}>{quest.description}</Text>

        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct}%`, backgroundColor: accent }]} />
        </View>

        <View style={styles.cardBottom}>
          <View style={styles.rewards}>
            <View style={styles.rewardChip}>
              <BoltIcon size={12} color={GAMI.success} />
              <Text style={[styles.rewardText, { color: GAMI.success }]}>+{quest.xpReward.toLocaleString()} XP</Text>
            </View>
            <View style={styles.rewardChip}>
              <SparkIcon size={12} color={GAMI.warn} />
              <Text style={[styles.rewardText, { color: GAMI.warn }]}>+{quest.pointReward} PTS</Text>
            </View>
          </View>
          <View style={[styles.cta, { backgroundColor: locked ? GAMI.bgElev : accent }]}>
            <Text style={[styles.ctaText, { color: locked ? 'rgba(255,255,255,0.5)' : '#000' }]}>
              {locked ? 'LOCKED' : claimable ? 'CLAIM' : 'START'}
            </Text>
            {!locked && <ArrowIcon size={14} color="#000" />}
          </View>
        </View>
      </BrutalBox>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GAMI.bg },
  filters: { flexDirection: 'row', gap: 8, marginTop: 16 },
  filterPress: { flex: 1 },
  filter: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: GAMI.bgElev,
    borderWidth: 2,
    borderColor: GAMI.borderStrong,
  },
  filterText: { fontFamily: FONTS.display, fontSize: 12, letterSpacing: 0.6, color: 'rgba(255,255,255,0.7)' },
  empty: { fontFamily: FONTS.mono, fontSize: 12, color: 'rgba(255,255,255,0.45)', textAlign: 'center', marginTop: 40 },
  card: { padding: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressLabel: { fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  title: { fontFamily: FONTS.display, fontSize: 20, color: '#fff', marginTop: 12 },
  desc: { fontFamily: FONTS.sans, fontSize: 13, lineHeight: 18, color: GAMI.textDim, marginTop: 6 },
  track: { height: 6, backgroundColor: GAMI.black, borderWidth: 1, borderColor: GAMI.black, marginTop: 14 },
  fill: { height: '100%' },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  rewards: { flexDirection: 'row', gap: 8 },
  rewardChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: GAMI.black, paddingVertical: 4, paddingHorizontal: 8 },
  rewardText: { fontFamily: FONTS.monoBold, fontSize: 11 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 14, borderWidth: 2, borderColor: GAMI.black },
  ctaText: { fontFamily: FONTS.display, fontSize: 12, letterSpacing: 0.6 },
});
