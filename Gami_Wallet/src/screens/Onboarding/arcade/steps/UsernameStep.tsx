import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {
  ArcadeScreen,
  Avatar,
  BrutalButton,
  Title,
  SparkIcon,
  CheckIcon,
  ArrowIcon,
} from '../components';
import { GAMI, FONTS } from '../tokens';
import { useOnboardingStore } from '../onboardingStore';
import type { StepProps } from './types';

const AVATARS = [
  { bg: GAMI.pink, n: 'NX' },
  { bg: GAMI.success, n: 'PX' },
  { bg: GAMI.cyan, n: 'ZK' },
  { bg: GAMI.warn, n: 'OG' },
  { bg: GAMI.purpleLight, n: '0X' },
  { bg: '#fff', n: 'GG' },
];

export function UsernameStep({ index, total, onNext, onBack }: StepProps) {
  const { handle, setHandle, avatarIndex, setAvatarIndex } = useOnboardingStore();
  const caret = useSharedValue(1);

  useEffect(() => {
    caret.value = withRepeat(withTiming(0, { duration: 530 }), -1, true);
  }, []);
  const caretStyle = useAnimatedStyle(() => ({ opacity: caret.value }));

  const selected = AVATARS[avatarIndex] ?? AVATARS[0];
  const clean = handle.trim();
  const available = clean.length >= 3;

  return (
    <ArcadeScreen step={index} steps={total} onBack={onBack}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flow}
      >
        <Title>Pick your{'\n'}character.</Title>

        {/* selected avatar */}
        <View style={styles.selectedRow}>
          <Avatar name={selected.n} size={110} bg={selected.bg} selected />
          <View style={styles.sparkBadge}>
            <SparkIcon size={26} color={GAMI.success} />
          </View>
        </View>

        {/* avatar choices */}
        <View style={styles.avatarGrid}>
          {AVATARS.map((a, i) => (
            <Pressable key={a.n} onPress={() => setAvatarIndex(i)}>
              <Avatar name={a.n} size={46} bg={a.bg} selected={i === avatarIndex} />
            </Pressable>
          ))}
        </View>

        {/* handle input */}
        <View>
          <Text style={styles.label}>HANDLE</Text>
          <View style={styles.inputWrap}>
            <Text style={styles.at}>@</Text>
            <TextInput
              value={handle}
              onChangeText={(t) => setHandle(t.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
              placeholder="noxx_"
              placeholderTextColor="rgba(255,255,255,0.3)"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={20}
              style={styles.input}
            />
            {!handle && <Animated.View style={[styles.caret, caretStyle]} />}
            {available && <CheckIcon size={18} color={GAMI.success} />}
          </View>
          {available && (
            <Text style={styles.hint}>✓ available · saves to {clean}.gami</Text>
          )}
        </View>

        <View style={{ flex: 1 }} />

        <BrutalButton
          label="THAT'S ME"
          variant="accent"
          disabled={!available}
          onPress={onNext}
          icon={<ArrowIcon size={18} color="#fff" />}
        />
      </KeyboardAvoidingView>
    </ArcadeScreen>
  );
}

const styles = StyleSheet.create({
  flow: { flex: 1, paddingTop: 16, gap: 22 },
  selectedRow: { alignItems: 'center', justifyContent: 'center' },
  sparkBadge: { position: 'absolute', top: -6, right: '32%', transform: [{ rotate: '15deg' }] },
  avatarGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  label: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: GAMI.purple,
    backgroundColor: GAMI.bgElev,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },
  at: { fontFamily: FONTS.mono, fontSize: 18, color: 'rgba(255,255,255,0.4)' },
  input: { flex: 1, fontFamily: FONTS.display, fontSize: 18, color: '#fff', padding: 0 },
  caret: { width: 2, height: 18, backgroundColor: GAMI.purpleLight },
  hint: { fontFamily: FONTS.mono, fontSize: 10, color: GAMI.success, marginTop: 6 },
});
