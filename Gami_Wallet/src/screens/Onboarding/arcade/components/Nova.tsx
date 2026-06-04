/**
 * NOVA — the Gami AI mascot. A geometric brutalist orb with an expressive face,
 * a gentle float (bob), a pulsing glow halo and an occasional blink.
 * Ported from `gami-primitives.jsx` to react-native-svg + Reanimated.
 */
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Line, Path, G } from 'react-native-svg';
import { GAMI } from '../tokens';

export type NovaMood = 'idle' | 'wink' | 'cheer' | 'think' | 'sleep';

export interface NovaProps {
  size?: number;
  mood?: NovaMood;
  float?: boolean;
  glow?: boolean;
}

export function Nova({ size = 80, mood = 'idle', float = true, glow = true }: NovaProps) {
  const bob = useSharedValue(0);
  const halo = useSharedValue(0.55);
  const blink = useSharedValue(1);

  useEffect(() => {
    if (float) {
      bob.value = withRepeat(
        withSequence(
          withTiming(-6, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        false,
      );
    }
    if (glow) {
      halo.value = withRepeat(
        withSequence(
          withTiming(0.9, { duration: 1200 }),
          withTiming(0.55, { duration: 1200 }),
        ),
        -1,
        true,
      );
    }
    if (mood !== 'sleep') {
      blink.value = withRepeat(
        withSequence(
          withDelay(2600, withTiming(0.05, { duration: 70 })),
          withTiming(1, { duration: 90 }),
        ),
        -1,
        false,
      );
    }
  }, [float, glow, mood]);

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value }],
  }));
  const haloStyle = useAnimatedStyle(() => ({ opacity: halo.value }));
  const eyeStyle = useAnimatedStyle(() => ({ transform: [{ scaleY: blink.value }] }));

  const eyeY = mood === 'sleep' ? 50 : 45;
  const isWink = mood === 'wink';

  const mouth = {
    idle: <Path d="M40 60 Q50 66 60 60" stroke="#000" strokeWidth={3.5} strokeLinecap="round" fill="none" />,
    cheer: <Path d="M38 56 Q50 72 62 56 Q50 64 38 56 Z" fill="#000" />,
    think: <Path d="M42 62 L58 62" stroke="#000" strokeWidth={3.5} strokeLinecap="round" />,
    wink: <Path d="M40 60 Q50 70 60 60" stroke="#000" strokeWidth={3.5} strokeLinecap="round" fill="none" />,
    sleep: <Path d="M42 60 Q50 56 58 60" stroke="#000" strokeWidth={3} strokeLinecap="round" fill="none" />,
  }[mood];

  return (
    <Animated.View style={[{ width: size, height: size }, bodyStyle]}>
      {glow && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.halo,
            { borderRadius: size, backgroundColor: GAMI.purpleLight },
            haloStyle,
          ]}
        />
      )}
      <Svg viewBox="0 0 100 100" width={size} height={size}>
        {/* ground shadow */}
        <Ellipse cx={50} cy={92} rx={30} ry={3} fill="rgba(0,0,0,0.4)" />
        {/* body */}
        <Circle cx={50} cy={50} r={38} fill={GAMI.purpleLight} stroke="#000" strokeWidth={4} />
        {/* highlight */}
        <Ellipse cx={38} cy={36} rx={14} ry={9} fill="#fff" opacity={0.35} />
        {/* antenna */}
        <Line x1={50} y1={12} x2={50} y2={4} stroke="#000" strokeWidth={3} strokeLinecap="round" />
        <Circle cx={50} cy={3} r={3.5} fill={GAMI.pink} stroke="#000" strokeWidth={2} />
        {/* cheeks */}
        <Ellipse cx={30} cy={58} rx={4} ry={2.5} fill={GAMI.pink} opacity={0.55} />
        <Ellipse cx={70} cy={58} rx={4} ry={2.5} fill={GAMI.pink} opacity={0.55} />
        {/* mouth */}
        {mouth}
      </Svg>
      {/* eyes overlaid so they can blink independently */}
      <Animated.View style={[StyleSheet.absoluteFill, eyeStyle]} pointerEvents="none">
        <Svg viewBox="0 0 100 100" width={size} height={size}>
          <Circle cx={38} cy={eyeY} r={5} fill="#000" />
          {isWink ? (
            <Path d="M58 45 L68 45" stroke="#000" strokeWidth={3.5} strokeLinecap="round" />
          ) : (
            <Circle cx={62} cy={eyeY} r={5} fill="#000" />
          )}
          {!isWink && mood !== 'sleep' && (
            <G>
              <Circle cx={40} cy={eyeY - 1.5} r={1.5} fill="#fff" />
              <Circle cx={64} cy={eyeY - 1.5} r={1.5} fill="#fff" />
            </G>
          )}
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  halo: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
  },
});
