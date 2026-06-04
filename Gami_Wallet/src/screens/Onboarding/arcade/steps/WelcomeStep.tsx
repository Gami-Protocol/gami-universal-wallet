import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ArcadeScreen, BrutalBox, BrutalButton, Display, Body } from '../components';
import { BoltIcon, TrophyIcon, ShieldIcon, AiIcon, ArrowIcon } from '../components';
import { GAMI, FONTS } from '../tokens';
import type { StepProps } from './types';

const CARD_W = (Dimensions.get('window').width - 44 - 12) / 2;

const FEATURES = [
  { icon: <BoltIcon size={20} color={GAMI.pink} />, label: 'XP ON EVERY ACTION' },
  { icon: <TrophyIcon size={20} color={GAMI.success} />, label: 'QUESTS + REWARDS' },
  { icon: <ShieldIcon size={20} color={GAMI.purpleLight} />, label: 'NON-CUSTODIAL' },
  { icon: <AiIcon size={20} color={GAMI.cyan} />, label: 'AI AGENT INSIDE' },
];

export function WelcomeStep({ index, total, onNext, onBack }: StepProps) {
  return (
    <ArcadeScreen step={index} steps={total} onBack={onBack} scrollable>
      <View style={styles.top}>
        <View style={styles.sticker}>
          <Text style={styles.stickerText}>NEW PLAYER</Text>
        </View>
        <Display style={{ marginTop: 16 }}>
          Your wallet,{'\n'}but make it{'\n'}
          <Text style={styles.fun}>FUN.</Text>
        </Display>
        <Body style={{ marginTop: 18 }}>
          Stack XP. Smash quests. Earn real rewards across every chain you touch. Let's gooo.
        </Body>
      </View>

      <View style={styles.grid}>
        {FEATURES.map((f) => (
          <BrutalBox key={f.label} offset={4} style={styles.featureCard}>
            {f.icon}
            <Text style={styles.featureLabel}>{f.label}</Text>
          </BrutalBox>
        ))}
      </View>

      <View style={{ marginTop: 22 }}>
        <BrutalButton
          label="LET'S GOOO"
          variant="primary"
          onPress={onNext}
          icon={<ArrowIcon size={18} color="#fff" />}
        />
        <Text style={styles.login}>
          Already a player? <Text style={styles.loginLink}>Log in</Text>
        </Text>
      </View>
    </ArcadeScreen>
  );
}

const styles = StyleSheet.create({
  top: { marginTop: 12 },
  sticker: {
    alignSelf: 'flex-start',
    backgroundColor: GAMI.pink,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: GAMI.black,
    transform: [{ rotate: '-3deg' }],
  },
  stickerText: { fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.5, color: '#000' },
  fun: { color: GAMI.purpleLight },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 26,
  },
  featureCard: {
    width: CARD_W,
    padding: 12,
    gap: 8,
    minHeight: 84,
  },
  featureLabel: {
    fontFamily: FONTS.display,
    fontSize: 12,
    lineHeight: 15,
    color: '#fff',
  },
  login: {
    textAlign: 'center',
    marginTop: 14,
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  loginLink: { color: GAMI.purpleLight, textDecorationLine: 'underline' },
});
