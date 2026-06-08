import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  GAMI,
  FONTS,
  GlowBlob,
  GamiXPRing,
  BrutalBox,
  Pill,
  Avatar,
  Display,
  Label,
  FlameIcon,
  BoltIcon,
  SwordIcon,
  ArrowIcon,
  SparkIcon,
} from '@/ui';
import {
  useProfileStore,
  AVATARS,
  levelFromXp,
  levelProgress,
  xpIntoLevel,
  XP_PER_LEVEL,
} from '@/store/profileStore';
import { mockQuests, mockLeaderboard } from '@/features/gami/mockData';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { handle, avatarIndex, xp, streakDays, points } = useProfileStore();

  const level = levelFromXp(xp);
  const avatar = AVATARS[avatarIndex] ?? AVATARS[0];
  const activeQuests = mockQuests.filter((q) => q.status !== 'locked').slice(0, 3);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <GlowBlob color={GAMI.purple} size={320} top={-110} right={-90} opacity={0.4} />
        <GlowBlob color={GAMI.pink} size={240} bottom={40} left={-80} opacity={0.22} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 28, paddingHorizontal: 20 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Avatar name={avatar.name} size={44} bg={avatar.bg} />
            <View>
              <Label>GM,</Label>
              <Text style={styles.handle}>@{handle}</Text>
            </View>
          </View>
          <Pill label={`${streakDays} day`} tone="purple" icon={<FlameIcon size={12} color={GAMI.pink} />} />
        </View>

        {/* XP ring */}
        <Animated.View entering={FadeInDown.duration(360)} style={styles.ringWrap}>
          <GamiXPRing
            size={184}
            value={levelProgress(xp)}
            level={level}
            xp={xpIntoLevel(xp)}
            max={XP_PER_LEVEL}
          />
        </Animated.View>

        {/* Stat strip */}
        <View style={styles.stats}>
          {[
            { label: 'TOTAL XP', value: xp.toLocaleString(), color: GAMI.purpleLight },
            { label: 'POINTS', value: points.toLocaleString(), color: GAMI.success },
            { label: 'LEVEL', value: String(level), color: GAMI.warn },
          ].map((s) => (
            <View key={s.label} style={styles.statCell}>
              <BrutalBox fill offset={4} background={GAMI.bgElev} style={styles.statCard}>
                <Text style={styles.statLabel}>{s.label}</Text>
                <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              </BrutalBox>
            </View>
          ))}
        </View>

        {/* Airdrop hero */}
        <Animated.View entering={FadeInDown.delay(80).duration(360)}>
          <View style={styles.heroWrap}>
            <View style={[StyleSheet.absoluteFill, styles.heroShadow]} />
            <View style={styles.hero}>
              <View style={{ flex: 1 }}>
                <Label color="rgba(0,0,0,0.6)">THE GAMI DROP IS COMING</Label>
                <Display style={styles.heroTitle} color="#0B0B0F">Check your{'\n'}eligibility.</Display>
              </View>
              <SparkIcon size={40} color="#0B0B0F" />
            </View>
          </View>
        </Animated.View>

        {/* Active quests */}
        <SectionHeader title="ACTIVE QUESTS" actionLabel="ALL ▸" onAction={() => router.push('/quests')} />
        <View style={{ gap: 10 }}>
          {activeQuests.map((q, i) => {
            const pct = q.target ? q.progress / q.target : 0;
            return (
              <Animated.View key={q.id} entering={FadeInDown.delay(120 + i * 60).duration(320)}>
                <Pressable onPress={() => router.push({ pathname: '/quest/[id]', params: { id: q.id } })}>
                  <BrutalBox fill offset={4} background={GAMI.bgCard} style={styles.questCard}>
                    <View style={styles.questIcon}>
                      <SwordIcon size={22} color="#000" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.questTitle}>{q.title}</Text>
                      <Text style={styles.questMeta}>+{q.xpReward.toLocaleString()} XP · {q.type.toUpperCase()}</Text>
                      <View style={styles.track}>
                        <View style={[styles.fill, { width: `${Math.round(pct * 100)}%` }]} />
                      </View>
                    </View>
                    <ArrowIcon size={16} color="#fff" />
                  </BrutalBox>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Mini leaderboard */}
        <SectionHeader title="LEADERBOARD" actionLabel="GLOBAL ▸" />
        <BrutalBox fill offset={4} background={GAMI.bgCard} style={{ padding: 6 }}>
          {mockLeaderboard.map((r) => (
            <View
              key={r.rank}
              style={[
                styles.leaderRow,
                r.you && { backgroundColor: GAMI.purpleSoft, borderColor: GAMI.purple, borderWidth: 1.5 },
              ]}
            >
              <Text style={[styles.rank, r.rank <= 3 && { color: GAMI.warn }]}>#{r.rank}</Text>
              <Avatar name={r.avatar} size={28} bg={r.you ? GAMI.purpleLight : GAMI.bgElev} />
              <Text style={[styles.leaderHandle, r.you && { color: GAMI.purpleLight }]} numberOfLines={1}>
                @{r.handle}
              </Text>
              <View style={styles.leaderXp}>
                <BoltIcon size={12} color={GAMI.success} />
                <Text style={styles.leaderXpText}>{(r.xp / 1000).toFixed(1)}k</Text>
              </View>
            </View>
          ))}
        </BrutalBox>
      </ScrollView>
    </View>
  );
}

function SectionHeader({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Label>{title}</Label>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GAMI.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  handle: { fontFamily: FONTS.display, fontSize: 16, color: '#fff' },
  ringWrap: { alignItems: 'center', marginTop: 18 },
  stats: { flexDirection: 'row', gap: 10, marginTop: 18 },
  statCell: { flex: 1 },
  statCard: { padding: 12, alignItems: 'flex-start' },
  statLabel: { fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1.2, color: 'rgba(255,255,255,0.5)' },
  statValue: { fontFamily: FONTS.display, fontSize: 20, marginTop: 4 },
  heroWrap: { position: 'relative', marginTop: 20 },
  heroShadow: { backgroundColor: GAMI.black, transform: [{ translateX: 6 }, { translateY: 6 }] },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: GAMI.purpleLight,
    borderWidth: 2.5,
    borderColor: GAMI.black,
    padding: 18,
  },
  heroTitle: { fontSize: 26, lineHeight: 27, marginTop: 4 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 26,
    marginBottom: 12,
  },
  sectionAction: { fontFamily: FONTS.mono, fontSize: 10, color: GAMI.purpleLight, letterSpacing: 0.5 },
  questCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  questIcon: {
    width: 46,
    height: 46,
    backgroundColor: GAMI.success,
    borderWidth: 2,
    borderColor: GAMI.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questTitle: { fontFamily: FONTS.display, fontSize: 15, color: '#fff' },
  questMeta: { fontFamily: FONTS.mono, fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2, marginBottom: 6 },
  track: { height: 5, backgroundColor: GAMI.black, borderWidth: 1, borderColor: GAMI.black },
  fill: { height: '100%', backgroundColor: GAMI.success },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  rank: { fontFamily: FONTS.monoBold, fontSize: 12, color: 'rgba(255,255,255,0.55)', width: 30 },
  leaderHandle: { flex: 1, fontFamily: FONTS.sansSemi, fontSize: 14, color: '#fff' },
  leaderXp: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  leaderXpText: { fontFamily: FONTS.monoBold, fontSize: 12, color: GAMI.success },
});
