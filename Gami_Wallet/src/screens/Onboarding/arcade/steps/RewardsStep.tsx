import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  ArcadeScreen,
  BrutalBox,
  BrutalButton,
  GamiXPRing,
  Title,
  Label,
  ArrowIcon,
} from '../components';
import { GAMI, FONTS } from '../tokens';
import type { StepProps } from './types';

const EARN = [
  { label: 'Daily login', value: '+100', color: GAMI.purpleLight },
  { label: 'Complete quest', value: '+500', color: GAMI.pink },
  { label: 'Streak bonus', value: '×1.5', color: GAMI.warn },
  { label: 'Refer a friend', value: '+1K', color: GAMI.success },
  { label: 'On-chain action', value: '+250', color: GAMI.cyan },
];

export function RewardsStep({ index, total, onNext, onBack }: StepProps) {
  return (
    <ArcadeScreen step={index} steps={total} onBack={onBack} scrollable>
      <View style={styles.flow}>
        <Title>
          How XP <Text style={{ color: GAMI.success }}>works</Text>.
        </Title>

        {/* ring + multiplier */}
        <BrutalBox fill offset={5} shadowColor={GAMI.purple} background={GAMI.bgElev} style={styles.ringCard}>
          <GamiXPRing size={110} value={0.0} level={0} xp={0} max={500} />
          <View style={{ flex: 1 }}>
            <Text style={styles.lvl}>LVL 0 → 1</Text>
            <Text style={styles.toGo}>500 XP TO GO</Text>
            <View style={styles.multTag}>
              <Text style={styles.multText}>🔥 1.0× MULTIPLIER</Text>
            </View>
          </View>
        </BrutalBox>

        {/* ways to earn */}
        <View>
          <Label>WAYS TO EARN</Label>
          <View style={{ gap: 6, marginTop: 8 }}>
            {EARN.map((r) => (
              <BrutalBox key={r.label} fill offset={3} borderWidth={1.5} background={GAMI.bgCard} style={styles.earnRow}>
                <Text style={styles.earnLabel}>{r.label}</Text>
                <Text style={[styles.earnValue, { color: r.color }]}>{r.value}</Text>
              </BrutalBox>
            ))}
          </View>
        </View>

        <BrutalButton label="GOT IT" variant="primary" onPress={onNext} icon={<ArrowIcon size={18} color="#fff" />} />
      </View>
    </ArcadeScreen>
  );
}

const styles = StyleSheet.create({
  flow: { flex: 1, paddingTop: 16, gap: 18 },
  ringCard: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16 },
  lvl: { fontFamily: FONTS.display, fontSize: 22, color: '#fff' },
  toGo: { fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(255,255,255,0.5)', marginVertical: 4 },
  multTag: {
    alignSelf: 'flex-start',
    backgroundColor: GAMI.warn,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderWidth: 1.5,
    borderColor: GAMI.black,
  },
  multText: { fontFamily: FONTS.monoBold, fontSize: 10, color: '#000' },
  earnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  earnLabel: { fontFamily: FONTS.sansSemi, fontSize: 14, color: '#fff' },
  earnValue: { fontFamily: FONTS.monoBold, fontSize: 13 },
});
