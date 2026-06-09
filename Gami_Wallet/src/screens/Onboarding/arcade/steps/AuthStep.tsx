import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  ArcadeScreen,
  BrutalBox,
  Title,
  Body,
  SparkIcon,
  GoogleIcon,
  AppleIcon,
  WalletIcon,
} from '../components';
import { GAMI, FONTS } from '../tokens';
import { useOnboardingStore } from '../onboardingStore';
import { useWallet } from '@/features/wallet/localWallet';
import type { StepProps } from './types';

export function AuthStep({ index, total, onNext, onBack }: StepProps) {
  const setAuthMethod = useOnboardingStore((s) => s.setAuthMethod);

  const choose = (method: Parameters<typeof setAuthMethod>[0]) => {
    setAuthMethod(method);
    // Provision the real non-custodial wallet now so the rest of the app has a
    // live address. (Google/Apple still create a wallet here; full OAuth
    // linking requires provider client IDs configured via EAS env vars.)
    useWallet.getState().init();
    onNext();
  };

  return (
    <ArcadeScreen step={index} steps={total} onBack={onBack} scrollable>
      <View style={styles.center}>
        <View>
          <Title>Choose your{'\n'}start.</Title>
          <Body style={{ marginTop: 10 }}>You can switch later. No pressure.</Body>
        </View>

        {/* Primary — create new wallet */}
        <Pressable onPress={() => choose('create')} style={styles.primaryWrap}>
          <View style={[StyleSheet.absoluteFill, styles.primaryShadow]} />
          <View style={styles.primaryCard}>
            <View style={styles.xpTag}>
              <Text style={styles.xpTagText}>+50 XP</Text>
            </View>
            <View style={styles.primaryHead}>
              <SparkIcon size={20} color="#fff" />
              <Text style={styles.primaryTitle}>CREATE NEW WALLET</Text>
            </View>
            <Text style={styles.primaryBody}>
              Fresh start. We'll handle the boring crypto bits — you focus on stacking XP.
            </Text>
          </View>
        </Pressable>

        {/* Secondary — social */}
        <View style={styles.socialRow}>
          <Pressable style={styles.socialPress} onPress={() => choose('google')}>
            <BrutalBox fill offset={4} style={styles.socialCard}>
              <GoogleIcon size={20} />
              <Text style={styles.socialTitle}>GOOGLE</Text>
              <Text style={styles.socialSub}>1-tap auth</Text>
            </BrutalBox>
          </Pressable>
          <Pressable style={styles.socialPress} onPress={() => choose('apple')}>
            <BrutalBox fill offset={4} style={styles.socialCard}>
              <AppleIcon size={20} color="#fff" />
              <Text style={styles.socialTitle}>APPLE</Text>
              <Text style={styles.socialSub}>Face ID</Text>
            </BrutalBox>
          </Pressable>
        </View>

        {/* Import */}
        <Pressable style={styles.importBtn} onPress={() => choose('import')}>
          <WalletIcon size={16} color={GAMI.purpleLight} />
          <Text style={styles.importText}>I HAVE A WALLET — IMPORT IT</Text>
        </Pressable>
      </View>
    </ArcadeScreen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', gap: 20, paddingTop: 16 },
  primaryWrap: { position: 'relative' },
  primaryShadow: { backgroundColor: GAMI.pink, transform: [{ translateX: 6 }, { translateY: 6 }] },
  primaryCard: {
    backgroundColor: GAMI.purple,
    borderWidth: 2.5,
    borderColor: GAMI.black,
    padding: 18,
  },
  xpTag: {
    position: 'absolute',
    top: -10,
    right: -6,
    backgroundColor: GAMI.success,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderColor: GAMI.black,
    transform: [{ rotate: '8deg' }],
  },
  xpTagText: { fontFamily: FONTS.monoBold, fontSize: 10, color: '#000' },
  primaryHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  primaryTitle: { fontFamily: FONTS.display, fontSize: 20, color: '#fff' },
  primaryBody: { fontFamily: FONTS.sans, fontSize: 13, lineHeight: 18, color: 'rgba(255,255,255,0.88)' },
  socialRow: { flexDirection: 'row', gap: 10 },
  socialPress: { flex: 1 },
  socialCard: { padding: 14, gap: 8 },
  socialTitle: { fontFamily: FONTS.display, fontSize: 13, color: '#fff' },
  socialSub: { fontFamily: FONTS.mono, fontSize: 10, color: 'rgba(255,255,255,0.5)' },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    borderStyle: 'dashed',
  },
  importText: {
    fontFamily: FONTS.display,
    fontSize: 13,
    letterSpacing: 0.6,
    color: GAMI.purpleLight,
  },
});
