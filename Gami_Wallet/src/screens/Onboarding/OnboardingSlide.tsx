import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { OnboardingSlideData } from './onboardingData';

const { width } = Dimensions.get('window');
const BG = '#0E0E12';
const CARD = '#1C1C26';
const ELEV = '#16161D';

interface OnboardingSlideProps {
  data: OnboardingSlideData;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ data }) => {
  return (
    <View style={[styles.container, { width }]}>
      {/* Glow blob */}
      <View style={[styles.glowBlob, { backgroundColor: data.accentColor }]} />

      {/* Step indicator */}
      <View style={styles.stepRow}>
        <Text style={[styles.stepNum, { color: data.accentColor }]}>{data.step}</Text>
        <Text style={styles.stepSep}> — </Text>
        <Text style={styles.stepTotal}>05</Text>
        {data.tag && (
          <View style={[styles.tagBadge, { backgroundColor: data.accentColor }]}>
            <Text style={styles.tagText}>{data.tag}</Text>
          </View>
        )}
      </View>

      {/* Icon card */}
      <View style={styles.iconWrapper}>
        <View style={[styles.iconCardShadow, { backgroundColor: data.accentColor }]} />
        <View style={[styles.iconCard, { backgroundColor: CARD, borderColor: data.accentColor }]}>
          {/* XP badge */}
          {data.xpReward && (
            <View style={[styles.xpBadge, { backgroundColor: '#3FE0A0' }]}>
              <Text style={styles.xpBadgeText}>+{data.xpReward} XP</Text>
            </View>
          )}
          <Text style={styles.iconEmoji}>{data.icon}</Text>
          {/* Corner brackets */}
          {(['TL', 'TR', 'BL', 'BR'] as const).map(corner => (
            <View key={corner} style={[styles.bracket, styles[`bracket${corner}` as keyof typeof styles] as object, { borderColor: data.accentColor }]} />
          ))}
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleBlock}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={[styles.titleAccent, { color: data.accentColor }]}>{data.titleAccent}</Text>
      </View>

      {/* Terminal lines */}
      <View style={[styles.termBox, { borderColor: data.accentColor }]}>
        <View style={[styles.termLabel, { backgroundColor: BG }]}>
          <Text style={[styles.termLabelText, { color: data.accentColor }]}>STDOUT</Text>
        </View>
        {data.lines.map((line, i) => (
          <Text key={i} style={styles.termLine}>{line}</Text>
        ))}
        <Text style={[styles.termCursor, { color: data.accentColor }]}>{'> '}READY ▊</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  glowBlob: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    top: -80,
    right: -80,
    opacity: 0.35,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    gap: 4,
  },
  stepNum: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 12,
    letterSpacing: 2,
  },
  stepSep: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
  },
  stepTotal: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    flex: 1,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: '#000',
  },
  tagText: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 9,
    letterSpacing: 1.5,
    color: '#000',
  },
  iconWrapper: {
    alignSelf: 'center',
    marginBottom: 28,
    position: 'relative',
  },
  iconCardShadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 160,
    height: 160,
    zIndex: 0,
  },
  iconCard: {
    width: 160,
    height: 160,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    position: 'relative',
  },
  iconEmoji: {
    fontSize: 64,
  },
  xpBadge: {
    position: 'absolute',
    top: -12,
    right: -16,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: '#000',
    transform: [{ rotate: '8deg' }],
    zIndex: 2,
  },
  xpBadgeText: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 10,
    color: '#000',
    letterSpacing: 1,
  },
  bracket: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderWidth: 2.5,
  },
  bracketTL: { top: -1, left: -1, borderRightWidth: 0, borderBottomWidth: 0 },
  bracketTR: { top: -1, right: -1, borderLeftWidth: 0, borderBottomWidth: 0 },
  bracketBL: { bottom: -1, left: -1, borderRightWidth: 0, borderTopWidth: 0 },
  bracketBR: { bottom: -1, right: -1, borderLeftWidth: 0, borderTopWidth: 0 },
  titleBlock: {
    marginBottom: 20,
  },
  title: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 36,
    lineHeight: 40,
    color: '#fff',
    letterSpacing: -0.5,
  },
  titleAccent: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  termBox: {
    borderWidth: 1.5,
    padding: 14,
    position: 'relative',
    backgroundColor: ELEV,
  },
  termLabel: {
    position: 'absolute',
    top: -8,
    left: 12,
    paddingHorizontal: 6,
  },
  termLabelText: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  termLine: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 20,
  },
  termCursor: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 12,
    marginTop: 8,
  },
});
