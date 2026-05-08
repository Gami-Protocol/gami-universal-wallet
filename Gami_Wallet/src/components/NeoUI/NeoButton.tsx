/**
 * NeoButton Component
 * A modern button component with variants, animations, and icon support
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { neoUIColors, spacing, borderRadius, shadows, typography } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface NeoButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const sizeStyles = {
    sm: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.base,
      fontSize: typography.sizes.sm,
    },
    md: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      fontSize: typography.sizes.base,
    },
    lg: {
      paddingVertical: spacing.base,
      paddingHorizontal: spacing.xl,
      fontSize: typography.sizes.lg,
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: neoUIColors.primary,
      color: neoUIColors.text.light,
    },
    secondary: {
      backgroundColor: neoUIColors.secondary,
      color: neoUIColors.text.dark,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: neoUIColors.primary,
      color: neoUIColors.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: neoUIColors.primary,
    },
    gradient: {
      backgroundColor: 'transparent',
      color: neoUIColors.text.dark,
    },
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? neoUIColors.text.light : neoUIColors.primary}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text
            style={[
              styles.text,
              {
                fontSize: currentSize.fontSize,
                color: currentVariant.color,
                fontFamily: typography.fonts.semiBold,
              },
              icon && iconPosition === 'left' && { marginLeft: spacing.sm },
              icon && iconPosition === 'right' && { marginRight: spacing.sm },
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[fullWidth && styles.fullWidth]}
      >
        <LinearGradient
          colors={neoUIColors.gradient.magentaCyan}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradient,
            {
              paddingVertical: currentSize.paddingVertical,
              paddingHorizontal: currentSize.paddingHorizontal,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.buttonInner,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {buttonContent}
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[fullWidth && styles.fullWidth]}
    >
      <Animated.View
        style={[
          styles.button,
          {
            paddingVertical: currentSize.paddingVertical,
            paddingHorizontal: currentSize.paddingHorizontal,
            transform: [{ scale: scaleAnim }],
          },
          variant !== 'gradient' && {
            backgroundColor: currentVariant.backgroundColor,
          },
          variant === 'outline' && {
            borderWidth: currentVariant.borderWidth,
            borderColor: currentVariant.borderColor,
          },
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          style,
        ]}
      >
        {buttonContent}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});
