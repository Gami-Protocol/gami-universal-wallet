import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  GAMI,
  FONTS,
  BrutalBox,
  Avatar,
  Pill,
  Display,
  Label,
  GearIcon,
  FlameIcon,
  TrophyIcon,
  ShieldIcon,
  WalletIcon,
  BellIcon,
  AiIcon,
  FaceIcon,
  ArrowIcon,
} from '@/ui';
import {
  useProfileStore,
  AVATARS,
  levelFromXp,
  levelProgress,
  xpIntoLevel,
  XP_PER_LEVEL,
} from '@/store/profileStore';
import { useLeaderboard } from '@/features/gami/useGamiData';
import { useWallet, shortAddress } from '@/features/wallet/localWallet';

const BADGES = [
  { emoji: '🏆', label: 'STARTER', earned: true, bg: GAMI.warn },
  { emoji: '⚡', label: 'FIRST SWAP', earned: false },
  { emoji: '🔥', label: '7-DAY', earned: false },
  { emoji: '💎', label: 'HOLDER', earned: false },
];

const MENU = [
  { icon: <ShieldIcon size={16} color={GAMI.purpleLight} />, label: 'Security & backup', badge: 'NEW' },
  { icon: <WalletIcon size={16} color={GAMI.success} />, label: 'Connected wallets', badge: '1' },
  { icon: <BellIcon size={16} color={GAMI.pink} />, label: 'Notifications', badge: null },
  { icon: <AiIcon size={16} color={GAMI.cyan} />, label: 'NOVA settings', badge: null },
  { icon: <FaceIcon size={16} color={GAMI.warn} />, label: 'Help & support', badge: null },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { handle, avatarIndex, xp, points, streakDays, interests } = useProfileStore();
  const { address, ready, init } = useWallet();

  useEffect(() => {
    if (!ready) init();
  }, [ready, init]);

  const { data: leaders } = useLeaderboard();
  const level = levelFromXp(xp);
  const avatar = AVATARS[avatarIndex] ?? AVATARS[0];
  const rank = leaders.find((r) => r.you)?.rank ?? 412;
  const earned = BADGES.filter((b) => b.earned).length;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 28 }}
      >
        {/* Header band */}
        <LinearGradient
          colors={[GAMI.purple, GAMI.pink]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.band, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.bandTop}>
            <Display style={{ fontSize: 24 }}>PROFILE</Display>
            <Pressable onPress={() => router.push('/settings')} hitSlop={10} style={styles.gear}>
              <GearIcon size={18} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.idRow}>
            <Avatar name={avatar.name} size={68} bg={avatar.bg} />
            <View style={{ flex: 1 }}>
              <Display style={{ fontSize: 22 }}>@{handle}</Display>
              <Text style={styles.subId}>{handle}.gami · {shortAddress(address)}</Text>
              <View style={styles.idPills}>
                <Pill label={`${streakDays}d streak`} icon={<FlameIcon size={11} color={GAMI.pink} />} style={styles.darkPill} />
                <Pill label="Starter" icon={<TrophyIcon size={11} color={GAMI.warn} />} style={styles.darkPill} />
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Stat cards (overlap the band) */}
        <View style={styles.statsRow}>
          <View style={{ flex: 1.4 }}>
            <BrutalBox fill offset={4} background={GAMI.bgCard} style={styles.statCard}>
              <Label>LVL</Label>
              <Display style={{ fontSize: 26 }}>{level}</Display>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${Math.round(levelProgress(xp) * 100)}%` }]} />
              </View>
              <Text style={styles.statSub}>{xpIntoLevel(xp)} / {XP_PER_LEVEL} XP</Text>
            </BrutalBox>
          </View>
          <View style={{ flex: 1 }}>
            <BrutalBox fill offset={4} background={GAMI.bgCard} style={styles.statCard}>
              <Label>POINTS</Label>
              <Display style={{ fontSize: 22, color: GAMI.success }}>{points.toLocaleString()}</Display>
              <Text style={styles.statSub}>universal</Text>
            </BrutalBox>
          </View>
          <View style={{ flex: 1 }}>
            <BrutalBox fill offset={4} background={GAMI.bgCard} style={styles.statCard}>
              <Label>RANK</Label>
              <Display style={{ fontSize: 22, color: GAMI.warn }}>#{rank}</Display>
              <Text style={styles.statSub}>of 18.2k</Text>
            </BrutalBox>
          </View>
        </View>

        <View style={styles.body}>
          {/* Badges */}
          <View style={styles.sectionHeader}>
            <Label>BADGES · {earned}/24</Label>
            <Text style={styles.sectionAction}>VIEW ALL ▸</Text>
          </View>
          <View style={styles.badgeGrid}>
            {BADGES.map((b) => (
              <View key={b.label} style={styles.badgeCell}>
                <BrutalBox
                  fill
                  offset={b.earned ? 3 : 0}
                  borderWidth={2}
                  background={b.earned ? (b.bg as string) : GAMI.bgCard}
                  style={[styles.badge, !b.earned && { opacity: 0.5 }]}
                >
                  <Text style={styles.badgeEmoji}>{b.emoji}</Text>
                  <Text style={[styles.badgeLabel, { color: b.earned ? '#000' : '#fff' }]}>{b.label}</Text>
                </BrutalBox>
              </View>
            ))}
          </View>

          {/* Interests */}
          {interests.length > 0 && (
            <>
              <Label style={{ marginTop: 22, marginBottom: 10 }}>YOUR VIBE</Label>
              <View style={styles.tagWrap}>
                {interests.map((t) => (
                  <Pill key={t} label={t.toUpperCase()} tone="purple" />
                ))}
              </View>
            </>
          )}

          {/* Account menu */}
          <Label style={{ marginTop: 22, marginBottom: 10 }}>ACCOUNT</Label>
          <BrutalBox fill offset={4} background={GAMI.bgCard}>
            {MENU.map((m, i) => (
              <Pressable
                key={m.label}
                onPress={() => router.push('/settings')}
                style={[styles.menuRow, i < MENU.length - 1 && styles.menuDivider]}
              >
                <View style={styles.menuIcon}>{m.icon}</View>
                <Text style={styles.menuLabel}>{m.label}</Text>
                {m.badge ? (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{m.badge}</Text>
                  </View>
                ) : null}
                <ArrowIcon size={14} color="rgba(255,255,255,0.5)" />
              </Pressable>
            ))}
          </BrutalBox>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GAMI.bg },
  band: { paddingHorizontal: 20, paddingBottom: 56, borderBottomWidth: 3, borderBottomColor: GAMI.black },
  bandTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  gear: { width: 36, height: 36, backgroundColor: GAMI.black, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: GAMI.black },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  subId: { fontFamily: FONTS.mono, fontSize: 10, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  idPills: { flexDirection: 'row', gap: 6, marginTop: 8 },
  darkPill: { backgroundColor: GAMI.black, borderColor: GAMI.black },
  statsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginTop: -36 },
  statCard: { padding: 12, alignItems: 'flex-start' },
  statSub: { fontFamily: FONTS.mono, fontSize: 9, color: GAMI.purpleLight, marginTop: 6 },
  track: { height: 4, backgroundColor: GAMI.black, marginTop: 6, alignSelf: 'stretch' },
  fill: { height: '100%', backgroundColor: GAMI.purpleLight },
  body: { paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, marginBottom: 10 },
  sectionAction: { fontFamily: FONTS.mono, fontSize: 10, color: GAMI.purpleLight },
  badgeGrid: { flexDirection: 'row', gap: 8 },
  badgeCell: { flex: 1 },
  badge: { alignItems: 'center', gap: 4, paddingVertical: 10, paddingHorizontal: 4 },
  badgeEmoji: { fontSize: 22 },
  badgeLabel: { fontFamily: FONTS.mono, fontSize: 8, letterSpacing: 0.6 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  menuDivider: { borderBottomWidth: 1.5, borderBottomColor: GAMI.black },
  menuIcon: { width: 28, height: 28, backgroundColor: GAMI.black, borderWidth: 1.5, borderColor: GAMI.purple, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontFamily: FONTS.sansSemi, fontSize: 13, color: '#fff' },
  menuBadge: { backgroundColor: GAMI.success, borderWidth: 1.5, borderColor: GAMI.black, paddingVertical: 2, paddingHorizontal: 6 },
  menuBadgeText: { fontFamily: FONTS.monoBold, fontSize: 9, color: '#000' },
});
