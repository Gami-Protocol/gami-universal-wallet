import React, { useState } from 'react';
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
  CheckIcon,
} from '@/ui';
import { mockTokens } from '@/features/gami/mockData';
import { useTxStore } from '@/store/txStore';
import { shortAddress } from '@/features/wallet/localWallet';
import { sendNative, NATIVE_SYMBOL } from '@/features/wallet/chainClient';

const isAddress = (a: string) => /^0x[a-fA-F0-9]{40}$/.test(a.trim());
const balanceOf = (sym: string) => Number((mockTokens.find((t) => t.symbol === sym)?.balance ?? '0').replace(/,/g, ''));

export default function SendScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const addTx = useTxStore((s) => s.addTx);

  const [token, setToken] = useState('GAMI');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [done, setDone] = useState(false);

  const amt = Number(amount);
  const bal = balanceOf(token);
  const validTo = isAddress(to);
  const validAmt = amt > 0 && amt <= bal;
  const canSend = validTo && validAmt && !done;

  const send = async () => {
    setDone(true);
    let subtitle = `to ${shortAddress(to)}`;
    // Best-effort on-chain broadcast for the native token; falls back to a local
    // record when no RPC/funds are available.
    if (token === NATIVE_SYMBOL) {
      try {
        const hash = await sendNative(to as `0x${string}`, amount);
        subtitle = `to ${shortAddress(to)} · ${shortAddress(hash)}`;
      } catch {
        /* offline / unfunded — record locally */
      }
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    addTx({ kind: 'send', title: `Sent ${token}`, subtitle, amount: `-${amount} ${token}` });
    setTimeout(() => router.back(), 1100);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <GlowBlob color={GAMI.pink} size={300} top={-90} left={-70} opacity={0.3} />
      </View>

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
          <ChevronLeftIcon size={16} color="#fff" />
        </Pressable>
        <Title>Send</Title>
        <View style={{ width: 32 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.body}>
        {/* Token select */}
        <Label>TOKEN</Label>
        <View style={styles.tokenRow}>
          {mockTokens.map((t) => {
            const active = t.symbol === token;
            return (
              <Pressable key={t.symbol} onPress={() => setToken(t.symbol)} style={styles.tokenChipPress}>
                <View style={[styles.tokenChip, active && { backgroundColor: t.color, borderColor: GAMI.black }]}>
                  <Text style={[styles.tokenChipText, active && { color: '#000' }]}>{t.symbol}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Recipient */}
        <Label style={{ marginTop: 18 }}>RECIPIENT</Label>
        <View style={[styles.inputWrap, to.length > 0 && !validTo && styles.inputError]}>
          <TextInput
            value={to}
            onChangeText={setTo}
            placeholder="0x…"
            placeholderTextColor="rgba(255,255,255,0.3)"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
          {validTo && <CheckIcon size={18} color={GAMI.success} />}
        </View>

        {/* Amount */}
        <View style={styles.amountHead}>
          <Label>AMOUNT</Label>
          <Pressable onPress={() => setAmount(String(bal))}>
            <Text style={styles.balance}>Balance: {bal.toLocaleString()} {token} · MAX</Text>
          </Pressable>
        </View>
        <View style={[styles.inputWrap, amount.length > 0 && !validAmt && styles.inputError]}>
          <TextInput
            value={amount}
            onChangeText={(v) => setAmount(v.replace(/[^0-9.]/g, ''))}
            placeholder="0.00"
            placeholderTextColor="rgba(255,255,255,0.3)"
            keyboardType="decimal-pad"
            style={[styles.input, styles.amountInput]}
          />
          <Text style={styles.amountSym}>{token}</Text>
        </View>

        <View style={{ flex: 1 }} />

        {/* Summary */}
        <BrutalBox fill offset={4} background={GAMI.bgElev} style={styles.summary}>
          <SummaryRow label="Network fee" value="~0.001 GAMI" />
          <SummaryRow label="You send" value={amount ? `${amount} ${token}` : `0 ${token}`} bold last />
        </BrutalBox>

        <BrutalButton
          label={done ? 'SENT ✓' : 'CONFIRM SEND'}
          variant={done ? 'success' : 'primary'}
          disabled={!canSend}
          onPress={send}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

function SummaryRow({ label, value, bold, last }: { label: string; value: string; bold?: boolean; last?: boolean }) {
  return (
    <View style={[styles.sumRow, !last && styles.sumDivider]}>
      <Text style={styles.sumLabel}>{label}</Text>
      <Text style={[styles.sumValue, bold && { fontFamily: FONTS.display, fontSize: 15, color: '#fff' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GAMI.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
  back: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: GAMI.borderStrong, backgroundColor: GAMI.bgElev },
  body: { flex: 1, paddingHorizontal: 20, paddingBottom: 20 },
  tokenRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  tokenChipPress: { flex: 1 },
  tokenChip: { paddingVertical: 10, alignItems: 'center', backgroundColor: GAMI.bgElev, borderWidth: 2, borderColor: GAMI.borderStrong },
  tokenChipText: { fontFamily: FONTS.display, fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2.5,
    borderColor: GAMI.purple,
    backgroundColor: GAMI.bgElev,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 8,
  },
  inputError: { borderColor: GAMI.pink },
  input: { flex: 1, fontFamily: FONTS.mono, fontSize: 14, color: '#fff', padding: 0 },
  amountInput: { fontFamily: FONTS.display, fontSize: 20 },
  amountSym: { fontFamily: FONTS.display, fontSize: 16, color: GAMI.purpleLight },
  amountHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 },
  balance: { fontFamily: FONTS.mono, fontSize: 10, color: GAMI.purpleLight },
  summary: { padding: 14, marginBottom: 12 },
  sumRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  sumDivider: { borderBottomWidth: 1.5, borderBottomColor: GAMI.black },
  sumLabel: { fontFamily: FONTS.sans, fontSize: 13, color: GAMI.textDim },
  sumValue: { fontFamily: FONTS.mono, fontSize: 13, color: 'rgba(255,255,255,0.8)' },
});
