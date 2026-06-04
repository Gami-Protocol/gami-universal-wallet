import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  ArcadeScreen,
  BrutalButton,
  Title,
  Body,
  CheckIcon,
  GameIcon,
  DefiIcon,
  ArtIcon,
  SparkIcon,
  FlameIcon,
  ShieldIcon,
  AiIcon,
  BoltIcon,
  FaceIcon,
} from '../components';
import { GAMI, FONTS } from '../tokens';
import { useOnboardingStore } from '../onboardingStore';
import type { StepProps } from './types';

const TAGS = [
  { id: 'gaming', label: 'GAMING', bg: GAMI.pink, fg: '#000', Icon: GameIcon },
  { id: 'defi', label: 'DEFI', bg: GAMI.bgCard, fg: '#fff', Icon: DefiIcon },
  { id: 'nfts', label: 'NFTs', bg: GAMI.success, fg: '#000', Icon: ArtIcon },
  { id: 'airdrops', label: 'AIRDROPS', bg: GAMI.bgCard, fg: '#fff', Icon: SparkIcon },
  { id: 'memes', label: 'MEMES', bg: GAMI.bgCard, fg: '#fff', Icon: FlameIcon },
  { id: 'daos', label: 'DAOs', bg: GAMI.bgCard, fg: '#fff', Icon: ShieldIcon },
  { id: 'ai', label: 'AI', bg: GAMI.cyan, fg: '#000', Icon: AiIcon },
  { id: 'trading', label: 'TRADING', bg: GAMI.bgCard, fg: '#fff', Icon: BoltIcon },
  { id: 'community', label: 'COMMUNITY', bg: GAMI.bgCard, fg: '#fff', Icon: FaceIcon },
];

const TARGET = 3;

export function InterestsStep({ index, total, onNext, onBack }: StepProps) {
  const { interests, toggleInterest } = useOnboardingStore();
  const count = interests.length;
  const ready = count >= TARGET;
  const progress = Math.min(count / TARGET, 1);

  return (
    <ArcadeScreen step={index} steps={total} onBack={onBack}>
      <View style={styles.flow}>
        <View>
          <Title>What's your{'\n'}vibe?</Title>
          <Body style={{ marginTop: 10 }}>NOVA tunes quests to your taste. Pick {TARGET}+.</Body>
          <View style={styles.progressRow}>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {Math.min(count, TARGET)}/{TARGET}
            </Text>
          </View>
        </View>

        <View style={styles.tagWrap}>
          {TAGS.map((t, i) => {
            const sel = interests.includes(t.id);
            const Icon = t.Icon;
            return (
              <Pressable key={t.id} onPress={() => toggleInterest(t.id)} style={styles.tagPress}>
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      backgroundColor: sel ? GAMI.purple : GAMI.black,
                      transform: [{ translateX: sel ? 4 : 3 }, { translateY: sel ? 4 : 3 }],
                    },
                  ]}
                />
                <View
                  style={[
                    styles.tag,
                    {
                      backgroundColor: t.bg,
                      borderColor: GAMI.black,
                      transform: [{ rotate: sel ? `${(i % 2 ? 1 : -1) * 2}deg` : '0deg' }],
                    },
                  ]}
                >
                  <Icon size={16} color={t.fg} />
                  <Text style={[styles.tagLabel, { color: t.fg }]}>{t.label}</Text>
                  {sel && <CheckIcon size={14} color={t.fg} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        <BrutalButton
          label="READY TO QUEST"
          variant="accent"
          disabled={!ready}
          onPress={onNext}
        />
      </View>
    </ArcadeScreen>
  );
}

const styles = StyleSheet.create({
  flow: { flex: 1, paddingTop: 16, gap: 18 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  track: { flex: 1, height: 8, backgroundColor: GAMI.bgElev, borderWidth: 2, borderColor: GAMI.black },
  fill: { height: '100%', backgroundColor: GAMI.pink },
  progressText: { fontFamily: FONTS.mono, fontSize: 11, color: GAMI.pink },
  tagWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: 12,
  },
  tagPress: { position: 'relative' },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 2.5,
  },
  tagLabel: { fontFamily: FONTS.display, fontSize: 13, letterSpacing: 0.5 },
});
