import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  ArcadeScreen,
  BrutalBox,
  BrutalButton,
  Nova,
  Title,
  Label,
  TrophyIcon,
  BoltIcon,
  SparkIcon,
} from '../components';
import { GAMI, FONTS } from '../tokens';
import { useOnboardingStore } from '../onboardingStore';
import type { StepProps } from './types';

const CAPS = [
  { icon: <TrophyIcon size={14} color={GAMI.pink} />, label: 'QUESTS' },
  { icon: <BoltIcon size={14} color={GAMI.success} />, label: 'TIMING' },
  { icon: <SparkIcon size={14} color={GAMI.cyan} />, label: 'ALPHA' },
];

export function NovaStep({ index, total, onNext, onBack }: StepProps) {
  const setNovaEnabled = useOnboardingStore((s) => s.setNovaEnabled);

  const decide = (enabled: boolean) => {
    setNovaEnabled(enabled);
    onNext();
  };

  return (
    <ArcadeScreen step={index} steps={total} onBack={onBack}>
      <View style={styles.flow}>
        <View>
          <Label color={GAMI.purpleLight}>▸ AI AGENT — ONLINE</Label>
          <Title style={{ marginTop: 6 }}>
            meet <Text style={{ color: GAMI.purpleLight }}>NOVA</Text>.
          </Title>
        </View>

        <View style={styles.novaWrap}>
          <Nova size={150} mood="cheer" />
        </View>

        {/* speech bubble */}
        <View style={styles.bubbleWrap}>
          <View style={[StyleSheet.absoluteFill, styles.bubbleShadow]} />
          <View style={styles.bubble}>
            <View style={styles.tail} />
            <Text style={styles.bubbleTitle}>"yo. i'm your wallet's brain."</Text>
            <Text style={styles.bubbleBody}>
              I find quests you'll actually like, time your moves, and call out alpha.{' '}
              <Text style={styles.highlight}>opt-in only.</Text>
            </Text>
          </View>
        </View>

        {/* capabilities */}
        <View style={styles.caps}>
          {CAPS.map((c) => (
            <View key={c.label} style={styles.capCol}>
              <BrutalBox fill offset={2} borderWidth={1.5} background={GAMI.bgElev} style={styles.cap}>
                {c.icon}
                <Text style={styles.capLabel}>{c.label}</Text>
              </BrutalBox>
            </View>
          ))}
        </View>

        <View style={styles.btnRow}>
          <View style={{ flex: 1 }}>
            <BrutalButton label="NOT YET" variant="ghost" size="md" onPress={() => decide(false)} />
          </View>
          <View style={{ flex: 2 }}>
            <BrutalButton
              label="LET NOVA HELP"
              variant="primary"
              size="md"
              onPress={() => decide(true)}
              icon={<SparkIcon size={16} color="#fff" />}
            />
          </View>
        </View>
      </View>
    </ArcadeScreen>
  );
}

const styles = StyleSheet.create({
  flow: { flex: 1, justifyContent: 'space-between', paddingTop: 16, paddingBottom: 8 },
  novaWrap: { alignItems: 'center' },
  bubbleWrap: { position: 'relative' },
  bubbleShadow: { backgroundColor: GAMI.purple, transform: [{ translateX: 5 }, { translateY: 5 }] },
  bubble: { backgroundColor: '#fff', borderWidth: 2.5, borderColor: GAMI.black, padding: 16 },
  tail: {
    position: 'absolute',
    top: -12,
    left: 50,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
  },
  bubbleTitle: { fontFamily: FONTS.display, fontSize: 16, color: '#000', marginBottom: 6 },
  bubbleBody: { fontFamily: FONTS.sans, fontSize: 13, lineHeight: 19, color: '#444' },
  highlight: { backgroundColor: GAMI.warn, color: '#000' },
  caps: { flexDirection: 'row', gap: 6 },
  capCol: { flex: 1 },
  cap: { alignItems: 'center', gap: 4, paddingVertical: 8 },
  capLabel: { fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1, color: '#fff' },
  btnRow: { flexDirection: 'row', gap: 8 },
});
