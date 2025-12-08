import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { NeobrutlisTheme } from '../../design/neobrultis-theme';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  onPress,
  disabled = false,
  children,
  style,
}) => {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`size_${size}Text`],
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: NeobrutlisTheme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  // Variants
  primary: {
    backgroundColor: NeobrutlisTheme.colors.accent.xp,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: NeobrutlisTheme.colors.accent.xp,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  
  // Sizes
  size_sm: {
    paddingVertical: NeobrutlisTheme.spacing.sm,
    paddingHorizontal: NeobrutlisTheme.spacing.md,
  },
  size_md: {
    paddingVertical: NeobrutlisTheme.spacing.md,
    paddingHorizontal: NeobrutlisTheme.spacing.lg,
  },
  size_lg: {
    paddingVertical: NeobrutlisTheme.spacing.lg,
    paddingHorizontal: NeobrutlisTheme.spacing.xl,
  },
  
  // Text styles
  text: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontWeight: NeobrutlisTheme.typography.weights.bold,
    letterSpacing: NeobrutlisTheme.typography.letterSpacing.wider,
    textTransform: 'uppercase',
  },
  
  primaryText: {
    color: NeobrutlisTheme.colors.text.inverse,
  },
  secondaryText: {
    color: NeobrutlisTheme.colors.text.primary,
  },
  ghostText: {
    color: NeobrutlisTheme.colors.accent.xp,
  },
  
  size_smText: {
    fontSize: NeobrutlisTheme.typography.sizes.xs,
  },
  size_mdText: {
    fontSize: NeobrutlisTheme.typography.sizes.sm,
  },
  size_lgText: {
    fontSize: NeobrutlisTheme.typography.sizes.base,
  },
  
  disabled: {
    opacity: 0.5,
  },
});
