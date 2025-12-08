import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NeobrutlisTheme } from '../../design/neobrultis-theme';

export interface StatCardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  accentColor?: 'xp' | 'points' | 'reward';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  trendValue,
  accentColor = 'xp',
}) => {
  const getAccentColor = () => {
    switch (accentColor) {
      case 'xp':
        return NeobrutlisTheme.colors.accent.xp;
      case 'points':
        return NeobrutlisTheme.colors.accent.points;
      case 'reward':
        return NeobrutlisTheme.colors.accent.reward;
      default:
        return NeobrutlisTheme.colors.accent.xp;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return NeobrutlisTheme.colors.states.success;
      case 'down':
        return NeobrutlisTheme.colors.states.error;
      default:
        return NeobrutlisTheme.colors.text.secondary;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: getAccentColor() }]}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Text>
      {trend && trendValue && (
        <View style={styles.trendContainer}>
          <Text style={[styles.trendValue, { color: getTrendColor() }]}>
            {trend === 'up' && '↑ '}
            {trend === 'down' && '↓ '}
            {trendValue}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NeobrutlisTheme.components.card.backgroundColor,
    borderWidth: NeobrutlisTheme.components.card.borderWidth,
    borderColor: NeobrutlisTheme.components.card.borderColor,
    borderRadius: NeobrutlisTheme.components.card.borderRadius,
    padding: NeobrutlisTheme.spacing.lg,
    gap: NeobrutlisTheme.spacing.sm,
  },
  label: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes.xs,
    color: NeobrutlisTheme.colors.text.tertiary,
    letterSpacing: NeobrutlisTheme.typography.letterSpacing.widest,
    textTransform: 'uppercase',
  },
  value: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes['2xl'],
    fontWeight: NeobrutlisTheme.typography.weights.bold,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendValue: {
    fontFamily: NeobrutlisTheme.typography.fonts.secondary,
    fontSize: NeobrutlisTheme.typography.sizes.sm,
    fontWeight: NeobrutlisTheme.typography.weights.semibold,
  },
});
