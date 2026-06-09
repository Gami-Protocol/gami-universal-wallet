import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, type Href } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Clipboard from 'expo-clipboard';
import {
  GAMI,
  FONTS,
  GlowBlob,
  BrutalBox,
  Title,
  Label,
  BoltIcon,
  ArrowIcon,
  QrIcon,
  SparkIcon,
  CopyIcon,
} from '@/ui';
import { useProfileStore, levelFromXp } from '@/store/profileStore';
import { useWallet, shortAddress } from '@/features/wallet/localWallet';
import { useNfts } from '@/features/gami/useGamiData';
import { useWalletTokens } from '@/features/wallet/useWalletData';
import { useTxStore } from '@/store/txStore';

const QUICK_ACTIONS = [
  { key: 'send', label: 'Send', route: '/send' as Href, icon: (c: string) => <ArrowIcon size={20} color={c} />, color: GAMI.pink },
  { key: 'receive', label: 'Receive', route: '/receive' as Href, icon: (c: string) => <QrIcon size={20} color={c} />, color: GAMI.success },
  { key: 'swap', label: 'Swap', route: '/swap' as Href, icon: (c: string) => <SparkIcon size={20} color={c} />, color: GAMI.cyan },
] as const;

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { xp } = useProfileStore();
  const { address, ready, init } = useWallet();
  const { tokens, totalUsd, isLive } = useWalletTokens();
  const { data: nfts } = useNfts(address ?? undefined);
  const txs = useTxStore((s) => s.txs);

  useEffect(() => {
    if (!ready) init();
  }, [ready, init]);

  const copyAddress = () => {
    if (address) Clipboard.setStringAsync(address).catch(() => {});
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <GlowBlob color={GAMI.purple} size={320} top={-110} right={-80} opacity={0.4} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 28, paddingHorizontal: 20 }}
      >
        <View style={styles.headerRow}>
          <Title>Wallet</Title>
          <Pressable onPress={copyAddress} style={styles.addressChip} hitSlop={8}>
            <Text style={styles.addressText}>{shortAddress(address)}</Text>
            <CopyIcon size={13} color={GAMI.purpleLight} />
          </Pressable>
        </View>

        {/* Balance hero */}
        <Animated.View entering={FadeInDown.duration(360)} style={styles.heroWrap}>
          <View style={[StyleSheet.absoluteFill, styles.heroShadow]} />
          <View style={styles.hero}>
            <Label color="rgba(255,255,255,0.7)">TOTAL BALANCE</Label>
            <Text style={styles.heroBalance}>
              ${totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            <View style={styles.heroPills}>
              <View style={styles.xpPill}>
                <BoltIcon size={13} color={GAMI.success} />
                <Text style={styles.xpPillText}>{xp.toLocaleString()} XP · LVL {levelFromXp(xp)}</Text>
              </View>
              {isLive && (
                <View style={styles.xpPill}>
                  <Text style={[styles.xpPillText, { color: GAMI.cyan }]}>● LIVE ON-CHAIN</Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Quick actions */}
        <View style={styles.actions}>
          {QUICK_ACTIONS.map((a) => (
            <Pressable key={a.key} style={styles.actionPress} onPress={() => router.push(a.route)}>
              <BrutalBox fill offset={4} background={GAMI.bgCard} style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: a.color }]}>{a.icon('#000')}</View>
                <Text style={styles.actionLabel}>{a.label}</Text>
              </BrutalBox>
            </Pressable>
          ))}
        </View>

        {/* Tokens */}
        <Label style={styles.section}>TOKENS</Label>
        <View style={{ gap: 10 }}>
          {tokens.map((t, i) => (
            <Animated.View key={t.symbol} entering={FadeInDown.delay(i * 50).duration(300)}>
              <BrutalBox fill offset={4} background={GAMI.bgCard} style={styles.tokenRow}>
                <View style={[styles.tokenIcon, { backgroundColor: t.color }]}>
                  <Text style={styles.tokenSym}>{t.symbol.slice(0, 1)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tokenName}>{t.name}</Text>
                  <Text style={styles.tokenBal}>{t.balance} {t.symbol}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.tokenUsd}>${t.usd.toLocaleString()}</Text>
                  <Text style={[styles.tokenChange, { color: t.change24h >= 0 ? GAMI.success : GAMI.pink }]}>
                    {t.change24h >= 0 ? '▲' : '▼'} {Math.abs(t.change24h).toFixed(1)}%
                  </Text>
                </View>
              </BrutalBox>
            </Animated.View>
          ))}
        </View>

        {/* NFTs */}
        <Label style={styles.section}>COLLECTIBLES</Label>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingVertical: 2, paddingRight: 8 }}
        >
          {nfts.map((n) => (
            <BrutalBox key={n.id} offset={4} background={GAMI.bgCard} style={styles.nftCard}>
              <View style={[styles.nftArt, { backgroundColor: n.color }]}>
                <SparkIcon size={28} color="#000" />
              </View>
              <Text style={styles.nftName} numberOfLines={1}>{n.name}</Text>
              <Text style={styles.nftCollection} numberOfLines={1}>{n.collection}</Text>
            </BrutalBox>
          ))}
        </ScrollView>

        {/* Activity */}
        <Label style={styles.section}>RECENT ACTIVITY</Label>
        <BrutalBox fill offset={4} background={GAMI.bgCard} style={{ padding: 6 }}>
          {txs.map((tx, i) => (
            <View key={tx.id} style={[styles.txRow, i < txs.length - 1 && styles.txDivider]}>
              <View style={[styles.txIcon, { borderColor: TX_COLOR[tx.kind] }]}>
                <Text style={[styles.txGlyph, { color: TX_COLOR[tx.kind] }]}>{TX_GLYPH[tx.kind]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txSub}>{tx.subtitle}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.txAmount}>{tx.amount}</Text>
                <Text style={styles.txWhen}>{tx.when}</Text>
              </View>
            </View>
          ))}
        </BrutalBox>
      </ScrollView>
    </View>
  );
}

const TX_COLOR: Record<string, string> = {
  send: GAMI.pink,
  receive: GAMI.success,
  swap: GAMI.cyan,
  reward: GAMI.warn,
};
const TX_GLYPH: Record<string, string> = { send: '↑', receive: '↓', swap: '⇄', reward: '★' };

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GAMI.bg },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addressChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: GAMI.bgElev,
    borderWidth: 1.5,
    borderColor: GAMI.borderStrong,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  addressText: { fontFamily: FONTS.mono, fontSize: 11, color: GAMI.purpleLight },
  heroWrap: { position: 'relative', marginTop: 18 },
  heroShadow: { backgroundColor: GAMI.black, transform: [{ translateX: 6 }, { translateY: 6 }] },
  hero: { backgroundColor: GAMI.purple, borderWidth: 2.5, borderColor: GAMI.black, padding: 20 },
  heroBalance: { fontFamily: FONTS.display, fontSize: 40, color: '#fff', marginTop: 6 },
  heroPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: GAMI.black,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  xpPillText: { fontFamily: FONTS.monoBold, fontSize: 11, color: GAMI.success },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  actionPress: { flex: 1 },
  actionCard: { alignItems: 'center', gap: 8, paddingVertical: 14 },
  actionIcon: { width: 40, height: 40, borderWidth: 2, borderColor: GAMI.black, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontFamily: FONTS.display, fontSize: 13, color: '#fff' },
  section: { marginTop: 26, marginBottom: 12 },
  tokenRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  tokenIcon: { width: 40, height: 40, borderWidth: 2, borderColor: GAMI.black, alignItems: 'center', justifyContent: 'center' },
  tokenSym: { fontFamily: FONTS.display, fontSize: 18, color: '#000' },
  tokenName: { fontFamily: FONTS.sansSemi, fontSize: 14, color: '#fff' },
  tokenBal: { fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  tokenUsd: { fontFamily: FONTS.display, fontSize: 15, color: '#fff' },
  tokenChange: { fontFamily: FONTS.mono, fontSize: 11, marginTop: 2 },
  nftCard: { width: 130, padding: 10 },
  nftArt: { width: 110, height: 110, borderWidth: 2, borderColor: GAMI.black, alignItems: 'center', justifyContent: 'center' },
  nftName: { fontFamily: FONTS.display, fontSize: 13, color: '#fff', marginTop: 8 },
  nftCollection: { fontFamily: FONTS.mono, fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 2 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10 },
  txDivider: { borderBottomWidth: 1.5, borderBottomColor: GAMI.black },
  txIcon: { width: 34, height: 34, backgroundColor: GAMI.black, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  txGlyph: { fontFamily: FONTS.monoBold, fontSize: 16 },
  txTitle: { fontFamily: FONTS.sansSemi, fontSize: 14, color: '#fff' },
  txSub: { fontFamily: FONTS.mono, fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 2 },
  txAmount: { fontFamily: FONTS.monoBold, fontSize: 13, color: '#fff' },
  txWhen: { fontFamily: FONTS.mono, fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
});
