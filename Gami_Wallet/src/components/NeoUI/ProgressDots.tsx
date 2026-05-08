/**
 * ProgressDots Component
 * Animated progress indicator for onboarding
 */

import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { neoUIColors, spacing } from '@/theme';

interface ProgressDotsProps {
  total: number;
  active: number;
  style?: any;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({
  total,
  active,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === active;
        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              isActive && styles.activeDot,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: neoUIColors.border.dark,
  },
  activeDot: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: neoUIColors.primary,
  },
});
