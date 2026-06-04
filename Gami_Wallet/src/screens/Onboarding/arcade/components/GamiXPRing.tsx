/**
 * Arcade XP Ring — animated circular progress with tick marks, glow and a
 * level read-out in the centre. Reanimated drives the sweep on mount.
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Line, G } from 'react-native-svg';
import { GAMI, FONTS } from '../tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface GamiXPRingProps {
  size?: number;
  /** 0..1 progress toward next level */
  value?: number;
  level?: number;
  xp?: number;
  max?: number;
  color?: string;
}

export function GamiXPRing({
  size = 140,
  value = 0.4,
  level = 1,
  xp = 320,
  max = 1000,
  color = GAMI.purple,
}: GamiXPRingProps) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(value, {
      duration: 1100,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [value]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: c * (1 - progress.value),
  }));

  const ticks = Array.from({ length: 24 }).map((_, i) => {
    const a = (i / 24) * Math.PI * 2;
    return {
      x1: size / 2 + Math.cos(a) * (r + 4),
      y1: size / 2 + Math.sin(a) * (r + 4),
      x2: size / 2 + Math.cos(a) * (r + 7),
      y2: size / 2 + Math.sin(a) * (r + 7),
    };
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg
        width={size}
        height={size}
        style={StyleSheet.absoluteFill}
      >
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={6}
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeDasharray={c}
            strokeLinecap="round"
            animatedProps={animatedProps}
          />
        </G>
        {ticks.map((t, i) => (
          <Line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={1.5}
          />
        ))}
      </Svg>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.lvlLabel}>LVL</Text>
        <Text style={[styles.lvlNum, { fontSize: size * 0.28 }]}>{level}</Text>
        <Text style={styles.xp}>
          {xp}/{max} XP
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lvlLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.6,
    color: 'rgba(255,255,255,0.5)',
  },
  lvlNum: {
    fontFamily: FONTS.display,
    lineHeight: undefined,
    color: '#fff',
  },
  xp: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: GAMI.purpleLight,
    marginTop: 4,
  },
});
