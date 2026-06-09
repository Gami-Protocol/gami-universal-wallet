import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  GAMI,
  FONTS,
  GlowBlob,
  BrutalBox,
  BrutalButton,
  Title,
  Label,
  ChevronLeftIcon,
  ArrowIcon,
} from '@/ui';
import { mockTokens } from '@/features/gami/mockData';
import { useTxStore } from '@/store/txStore';

// rough USD price per unit, derived from the mock balances/holdings
const priceOf = (sym: string) => {
  const t = mockTokens.find((x) => x.symbol === sym);
  if (!t) return 1;
  const units = Number(t.balance.replace(/,/g, '')) || 1;
  return t.usd / units;
};
const balanceOf = (sym: string) => Number((mockTokens.find((t) => t.symbol === sym)?.balance ?? '0').replace(/,/g, ''));

export default function SwapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const addTx = useTxStore((s) => s.addTx);

  const [from, setFrom] = useState('ETH');
  const [to, setTo] = useState('GAMI');
  const [amount, setAmount] = useState('');
  const [done, setDone] = useState(false);

  const amt = Number(amount);
  const estimate = useMemo(() => {
    if (!amt) return 0;
    return (amt * priceOf(from)) / priceOf(to);
  }, [amt, from, to]);

  const valid = amt > 0 && amt <= balanceOf(from) && from !== to && !done;

  const flip = () => {
    setFrom(to);
    setTo(from);
    Haptics.selectionAsync().catch(() => {});
  };

  const swap = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    addTx({ kind: 'swap', title: 'Swapped', subtitle: `${from} → ${to}`, amount: `${amount} ${from}` });
    setDone(true);
    setTimeout(() => router.back(), 1100);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <GlowBlob color={GAMI.cyan} size={300} top={-90} right={-70} opacity={0.28} />
      </View>

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
          <ChevronLeftIcon size={16} color="#fff" />
        </Pressable>
        <Title>Swap</Title>
        <View style={{ width: 32 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.body}>
        {/* From */}
        <Panel
          label="FROM"
          token={from}
          onToken={setFrom}
          right={
            <TextInput
              value={amount}
              onChangeText={(v) => setAmount(v.replace(/[^0-9.]/g, ''))}
              placeholder="0.00"
              placeholderTextColor="rgba(255,255,255,0.3)"
              keyboardType="decimal-pad"
              style={styles.amountInput}
            />
          }
          sub={`Balance: ${balanceOf(from).toLocaleString()}`}
        />

        {/* Flip */}
        <Pressable onPress={flip} style={styles.flipBtn}>
          <View style={styles.flipInner}>
            <ArrowIcon size={18} color="#000" />
          </View>
        </Pressable>

        {/* To */}
        <Panel
          label="TO (ESTIMATED)"
          token={to}
          onToken={setTo}
          right={<Text style={styles.estimate}>{estimate ? estimate.toFixed(estimate < 1 ? 4 : 2) : '0.00'}</Text>}
          sub={amt ? `1 ${from} ≈ ${(priceOf(from) / priceOf(to)).toFixed(4)} ${to}` : 'Enter an amount'}
        />

        <View style={{ flex: 1 }} />

        <BrutalButton
          label={done ? 'SWAPPED ✓' : from === to ? 'SELECT DIFFERENT TOKENS' : 'CONFIRM SWAP'}
          variant={done ? 'success' : 'primary'}
          disabled={!valid}
          onPress={swap}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

function Panel({
  label,
  token,
  onToken,
  right,
  sub,
}: {
  label: string;
  token: string;
  onToken: (s: string) => void;
  right: React.ReactNode;
  sub: string;
}) {
  return (
    <BrutalBox fill offset={4} background={GAMI.bgElev} style={styles.panel}>
      <Label>{label}</Label>
      <View style={styles.panelRow}>
        <View style={styles.tokenSelect}>
          {mockTokens.map((t) => {
            const active = t.symbol === token;
            return (
              <Pressable key={t.symbol} onPress={() => onToken(t.symbol)}>
                <View style={[styles.tk, active && { backgroundColor: t.color, borderColor: GAMI.black }]}>
                  <Text style={[styles.tkText, active && { color: '#000' }]}>{t.symbol}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.panelRight}>{right}</View>
      </View>
      <Text style={styles.panelSub}>{sub}</Text>
    </BrutalBox>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GAMI.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
  back: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: GAMI.borderStrong, backgroundColor: GAMI.bgElev },
  body: { flex: 1, paddingHorizontal: 20, paddingBottom: 20 },
  panel: { padding: 14 },
  panelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, gap: 10 },
  tokenSelect: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, flex: 1 },
  tk: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: GAMI.bgCard, borderWidth: 2, borderColor: GAMI.borderStrong },
  tkText: { fontFamily: FONTS.display, fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  panelRight: { minWidth: 90, alignItems: 'flex-end' },
  amountInput: { fontFamily: FONTS.display, fontSize: 24, color: '#fff', textAlign: 'right', padding: 0, minWidth: 90 },
  estimate: { fontFamily: FONTS.display, fontSize: 24, color: GAMI.success },
  panelSub: { fontFamily: FONTS.mono, fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 10 },
  flipBtn: { alignSelf: 'center', marginVertical: -8, zIndex: 2 },
  flipInner: {
    width: 40,
    height: 40,
    backgroundColor: GAMI.cyan,
    borderWidth: 2.5,
    borderColor: GAMI.black,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '90deg' }],
  },
});
