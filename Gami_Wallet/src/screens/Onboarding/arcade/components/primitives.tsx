/**
 * Brutalist atoms — hard offset shadows, chunky borders, sticker pills.
 * Cross-platform hard shadow is emulated with an offset solid layer (RN can't
 * render zero-blur offset shadows consistently on Android).
 */
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { GAMI, FONTS } from '../tokens';

/* ────────────────────────────────────────────────────────────
 * BrutalBox — content with a crisp offset shadow behind it
 * ──────────────────────────────────────────────────────────── */
export interface BrutalBoxProps {
  children?: React.ReactNode;
  offset?: number;
  shadowColor?: string;
  borderColor?: string;
  borderWidth?: number;
  background?: string;
  /** stretch the box (and its shadow) to fill the parent's cross axis */
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function BrutalBox({
  children,
  offset = 4,
  shadowColor = GAMI.black,
  borderColor = GAMI.black,
  borderWidth = 2,
  background = GAMI.bgCard,
  fill,
  style,
}: BrutalBoxProps) {
  return (
    <View style={[styles.brutalWrap, fill && styles.fill]}>
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: shadowColor,
            transform: [{ translateX: offset }, { translateY: offset }],
          },
        ]}
      />
      <View style={[fill && styles.fill, { borderColor, borderWidth, backgroundColor: background }, style]}>
        {children}
      </View>
    </View>
  );
}

/* ────────────────────────────────────────────────────────────
 * BrutalButton
 * ──────────────────────────────────────────────────────────── */
type BrutalVariant = 'primary' | 'accent' | 'success' | 'ghost' | 'light';
type BrutalSize = 'lg' | 'md' | 'sm';

const VARIANTS: Record<BrutalVariant, { bg: string; fg: string; shadow: string; border: string }> = {
  primary: { bg: GAMI.purple, fg: '#fff', shadow: GAMI.black, border: GAMI.black },
  accent: { bg: GAMI.pink, fg: '#fff', shadow: GAMI.black, border: GAMI.black },
  success: { bg: GAMI.success, fg: '#000', shadow: GAMI.black, border: GAMI.black },
  ghost: { bg: 'transparent', fg: '#fff', shadow: GAMI.purple, border: GAMI.purple },
  light: { bg: '#fff', fg: '#000', shadow: GAMI.purple, border: GAMI.black },
};

const SIZES: Record<BrutalSize, { padV: number; padH: number; fs: number }> = {
  lg: { padV: 18, padH: 22, fs: 16 },
  md: { padV: 14, padH: 18, fs: 14 },
  sm: { padV: 10, padH: 14, fs: 12 },
};

export interface BrutalButtonProps {
  label: string;
  onPress?: () => void;
  variant?: BrutalVariant;
  size?: BrutalSize;
  icon?: React.ReactNode;
  offset?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function BrutalButton({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon,
  offset = 6,
  disabled,
  style,
  textStyle,
}: BrutalButtonProps) {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.brutalWrap,
        { alignSelf: 'stretch', opacity: disabled ? 0.5 : 1 },
        pressed && { transform: [{ translateX: offset / 2 }, { translateY: offset / 2 }] },
        style,
      ]}
    >
      {({ pressed }) => (
        <>
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: v.shadow,
                transform: [
                  { translateX: pressed ? offset / 2 : offset },
                  { translateY: pressed ? offset / 2 : offset },
                ],
              },
            ]}
          />
          <View
            style={[
              styles.btnInner,
              {
                backgroundColor: v.bg,
                borderColor: v.border,
                paddingVertical: s.padV,
                paddingHorizontal: s.padH,
              },
            ]}
          >
            {icon}
            <Text
              style={[
                styles.btnText,
                { color: v.fg, fontSize: s.fs },
                textStyle,
              ]}
            >
              {label}
            </Text>
          </View>
        </>
      )}
    </Pressable>
  );
}

/* ────────────────────────────────────────────────────────────
 * StepDots — brutal progress blocks
 * ──────────────────────────────────────────────────────────── */
export function StepDots({
  count,
  current,
  color = GAMI.purple,
}: {
  count: number;
  current: number;
  color?: string;
}) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === current ? 24 : 10,
            height: 6,
            backgroundColor: i <= current ? color : 'rgba(255,255,255,0.18)',
            borderWidth: 1.5,
            borderColor: GAMI.black,
          }}
        />
      ))}
    </View>
  );
}

/* ────────────────────────────────────────────────────────────
 * Pill — mono tag chip
 * ──────────────────────────────────────────────────────────── */
export function Pill({
  label,
  icon,
  tone = 'default',
  style,
}: {
  label: string;
  icon?: React.ReactNode;
  tone?: 'default' | 'purple';
  style?: StyleProp<ViewStyle>;
}) {
  const isPurple = tone === 'purple';
  return (
    <View
      style={[
        styles.pill,
        {
          borderColor: isPurple ? GAMI.purple : GAMI.borderStrong,
          backgroundColor: isPurple ? GAMI.purpleSoft : 'rgba(255,255,255,0.04)',
        },
        style,
      ]}
    >
      {icon}
      <Text style={[styles.pillText, { color: isPurple ? GAMI.purpleLight : GAMI.text }]}>
        {label}
      </Text>
    </View>
  );
}

/* ────────────────────────────────────────────────────────────
 * Avatar — brutal monogram tile
 * ──────────────────────────────────────────────────────────── */
export function Avatar({
  name = 'PX',
  size = 56,
  bg = GAMI.pink,
  selected = false,
}: {
  name?: string;
  size?: number;
  bg?: string;
  selected?: boolean;
}) {
  return (
    <BrutalBox
      offset={Math.max(2, size * 0.06)}
      borderWidth={selected ? 3 : 2.5}
      borderColor={selected ? GAMI.purple : GAMI.black}
      shadowColor={selected ? GAMI.pink : GAMI.black}
      background={bg}
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.display,
          fontSize: size * 0.42,
          color: '#000',
        }}
      >
        {name.slice(0, 2).toUpperCase()}
      </Text>
    </BrutalBox>
  );
}

const styles = StyleSheet.create({
  brutalWrap: { position: 'relative', alignSelf: 'flex-start' },
  fill: { alignSelf: 'stretch', width: '100%' },
  btnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 2.5,
  },
  btnText: {
    fontFamily: FONTS.display,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  dotsRow: { flexDirection: 'row', gap: 4 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  pillText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
