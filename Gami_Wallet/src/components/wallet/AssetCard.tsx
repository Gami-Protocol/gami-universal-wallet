import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NeobrutlisTheme } from '../../design/neobrultis-theme';

export interface AssetCardProps {
  symbol: string;
  name: string;
  balance: string;
  value?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  symbol,
  name,
  balance,
  value,
  icon,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <View style={styles.infoContainer}>
          <Text style={styles.symbol}>{symbol}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
      
      <View style={styles.rightContent}>
        <Text style={styles.balance}>{balance}</Text>
        {value && <Text style={styles.value}>${value}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: NeobrutlisTheme.components.card.backgroundColor,
    borderColor: NeobrutlisTheme.components.card.borderColor,
    borderWidth: NeobrutlisTheme.components.card.borderWidth,
    borderRadius: NeobrutlisTheme.components.card.borderRadius,
    padding: NeobrutlisTheme.components.card.padding,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: NeobrutlisTheme.spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: NeobrutlisTheme.borderRadius.md,
    backgroundColor: NeobrutlisTheme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    gap: NeobrutlisTheme.spacing.xs,
  },
  symbol: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes.lg,
    fontWeight: NeobrutlisTheme.typography.weights.bold,
    color: NeobrutlisTheme.colors.text.primary,
    letterSpacing: NeobrutlisTheme.typography.letterSpacing.wide,
  },
  name: {
    fontFamily: NeobrutlisTheme.typography.fonts.secondary,
    fontSize: NeobrutlisTheme.typography.sizes.sm,
    color: NeobrutlisTheme.colors.text.secondary,
  },
  rightContent: {
    alignItems: 'flex-end',
    gap: NeobrutlisTheme.spacing.xs,
  },
  balance: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes.lg,
    fontWeight: NeobrutlisTheme.typography.weights.bold,
    color: NeobrutlisTheme.colors.text.primary,
  },
  value: {
    fontFamily: NeobrutlisTheme.typography.fonts.secondary,
    fontSize: NeobrutlisTheme.typography.sizes.sm,
    color: NeobrutlisTheme.colors.text.secondary,
  },
});
