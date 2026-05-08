/**
 * NeoCard Component
 * A modern card component with optional glassmorphism effect
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { neoUIColors, spacing, borderRadius, shadows } from '@/theme';

interface NeoCardProps {
  children: React.ReactNode;
  variant?: 'solid' | 'glass' | 'gradient';
  gradientColors?: string[];
  style?: ViewStyle;
  onPress?: () => void;
}

export const NeoCard: React.FC<NeoCardProps> = ({
  children,
  variant = 'solid',
  gradientColors,
  style,
}) => {
  if (variant === 'gradient' && gradientColors) {
    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, styles.gradientCard, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  if (variant === 'glass') {
    return (
      <View style={[styles.card, styles.glassCard, style]}>
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.card, styles.solidCard, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    ...shadows.md,
  },
  solidCard: {
    backgroundColor: neoUIColors.background.cardDark,
    borderWidth: 1,
    borderColor: neoUIColors.border.dark,
  },
  glassCard: {
    backgroundColor: 'rgba(26, 26, 36, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    // Note: backdropFilter is not supported in React Native
    // Glass effect is achieved through transparent background
  },
  gradientCard: {
    borderWidth: 0,
  },
});
