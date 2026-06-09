import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAMI, FONTS, BrutalBox, Title, Label, ChevronLeftIcon, ArrowIcon } from '@/ui';
import { useProfileStore } from '@/store/profileStore';
import { useWallet, shortAddress } from '@/features/wallet/localWallet';
import { useSettingsStore, type BoolSetting, type NovaPersonality } from '@/store/settingsStore';

const NOVA_CYCLE: NovaPersonality[] = ['Hype', 'Chill', 'Pro'];
const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';

function Toggle({ on, onPress }: { on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.toggle, { backgroundColor: on ? GAMI.success : GAMI.bgCard }]}>
      <View style={[styles.knob, { left: on ? 18 : 2 }]} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { handle } = useProfileStore();
  const { address } = useWallet();
  const s = useSettingsStore();

  const cycleNova = () => {
    const next = NOVA_CYCLE[(NOVA_CYCLE.indexOf(s.novaPersonality) + 1) % NOVA_CYCLE.length];
    s.set('novaPersonality', next);
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY);
    } catch {
      // non-fatal
    }
    router.replace('/onboarding');
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
          <ChevronLeftIcon size={16} color="#000" />
        </Pressable>
        <Title>Settings</Title>
        <Text style={styles.version}>v1.0.0</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 28, gap: 22 }}
      >
        {/* Account */}
        <Section title="▸ ACCOUNT" color={GAMI.purpleLight}>
          <Row label="Display name" value={`@${handle}`} action="EDIT" />
          <Row label="Email" value={`${handle}@gami.xyz`} action="EDIT" />
          <Row label="Wallet address" value={shortAddress(address)} action="COPY" last />
        </Section>

        {/* Security */}
        <Section title="▸ SECURITY" color={GAMI.pink}>
          <ToggleRow label="Face ID lock" on={s.faceId} onToggle={() => s.toggle('faceId')} />
          <Row label="Auto-lock" value={s.autoLock} />
          <Row label="Backup phrase" value="Not backed up" warn />
          <ToggleRow label="Hide balances" on={s.hideBalances} onToggle={() => s.toggle('hideBalances')} last />
        </Section>

        {/* Game */}
        <Section title="▸ GAME" color={GAMI.success}>
          <ToggleRow label="Sound effects" on={s.sound} onToggle={() => s.toggle('sound')} />
          <ToggleRow label="Haptics" on={s.haptics} onToggle={() => s.toggle('haptics')} />
          <Pressable onPress={cycleNova}>
            <Row label="NOVA personality" value={s.novaPersonality} action="TAP" />
          </Pressable>
          <ToggleRow label="Notifications" on={s.notifications} onToggle={() => s.toggle('notifications')} last />
        </Section>

        {/* Sign out */}
        <Pressable onPress={signOut} style={styles.signOut}>
          <Text style={styles.signOutText}>SIGN OUT</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <View>
      <Label color={color} style={{ marginBottom: 8 }}>{title}</Label>
      <BrutalBox fill offset={4} background={GAMI.bgCard}>{children}</BrutalBox>
    </View>
  );
}

function Row({
  label,
  value,
  action,
  warn,
  last,
}: {
  label: string;
  value?: string;
  action?: string;
  warn?: boolean;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, !last && styles.rowDivider]}>
      <Text style={styles.rowLabel}>{label}</Text>
      {value ? <Text style={[styles.rowValue, warn && { color: GAMI.pink }]}>{value}</Text> : null}
      {action ? <Text style={styles.rowAction}>{action}</Text> : !value ? <ArrowIcon size={14} color="rgba(255,255,255,0.5)" /> : null}
    </View>
  );
}

function ToggleRow({ label, on, onToggle, last }: { label: string; on: boolean; onToggle: () => void; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowDivider]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Toggle on={on} onPress={onToggle} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GAMI.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: GAMI.bgElev,
    borderBottomWidth: 2.5,
    borderBottomColor: GAMI.black,
  },
  back: { width: 32, height: 32, backgroundColor: GAMI.pink, borderWidth: 2, borderColor: GAMI.black, alignItems: 'center', justifyContent: 'center' },
  version: { flex: 1, textAlign: 'right', fontFamily: FONTS.mono, fontSize: 10, color: 'rgba(255,255,255,0.4)' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 14 },
  rowDivider: { borderBottomWidth: 1.5, borderBottomColor: GAMI.black },
  rowLabel: { flex: 1, fontFamily: FONTS.sansSemi, fontSize: 13, color: '#fff' },
  rowValue: { fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(255,255,255,0.65)' },
  rowAction: { fontFamily: FONTS.mono, fontSize: 9, color: GAMI.purpleLight, letterSpacing: 0.8 },
  toggle: { width: 38, height: 22, borderWidth: 2, borderColor: GAMI.black, position: 'relative' },
  knob: { position: 'absolute', top: 1, width: 14, height: 14, backgroundColor: GAMI.black },
  signOut: {
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: GAMI.bg,
    borderWidth: 2.5,
    borderColor: GAMI.pink,
  },
  signOutText: { fontFamily: FONTS.display, fontSize: 14, letterSpacing: 1, color: GAMI.pink },
});
