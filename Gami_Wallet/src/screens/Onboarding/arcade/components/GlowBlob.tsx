/**
 * GlowBlob — soft floating brand light used as a screen backdrop.
 * RN has no cross-platform blur filter, so the blur is faked with stacked
 * translucent circles + a slow pulse for the same ambient feel.
 */
import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { GAMI } from '../tokens';

export interface GlowBlobProps {
  color?: string;
  size?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  opacity?: number;
}

export function GlowBlob({
  color = GAMI.purple,
  size = 200,
  top,
  left,
  right,
  bottom,
  opacity = 0.45,
}: GlowBlobProps) {
  const pulse = useSharedValue(0.7);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.7, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: pulse.value }));

  // stacked translucent rings approximate a gaussian blur
  const layers = [
    { scale: 1, a: opacity * 0.5 },
    { scale: 0.75, a: opacity * 0.7 },
    { scale: 0.5, a: opacity },
  ];

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top,
          left,
          right,
          bottom,
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      {layers.map((l, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            width: size * l.scale,
            height: size * l.scale,
            borderRadius: size,
            backgroundColor: color,
            opacity: l.a,
          }}
        />
      ))}
    </Animated.View>
  );
}
