/**
 * NeoInput Component
 * A modern input field with floating labels, icons, and animations
 */

import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { neoUIColors, spacing, borderRadius, typography } from '@/theme';

interface NeoInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export const NeoInput: React.FC<NeoInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  value,
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderColorAnim = useRef(new Animated.Value(0)).current;
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(borderColorAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(labelAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.timing(borderColorAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    
    if (!value) {
      Animated.timing(labelAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    onBlur?.(e);
  };

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [neoUIColors.border.dark, neoUIColors.primary],
  });

  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [18, -8],
  });

  const labelFontSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [typography.sizes.base, typography.sizes.xs],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View
        style={[
          styles.inputContainer,
          { borderColor },
          error && styles.errorBorder,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        {label && (
          <Animated.Text
            style={[
              styles.label,
              {
                top: labelTop,
                fontSize: labelFontSize,
              },
              (isFocused || value) && styles.labelFocused,
            ]}
          >
            {label}
          </Animated.Text>
        )}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            inputStyle,
          ]}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={neoUIColors.text.subtext}
          {...textInputProps}
        />
        
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </Animated.View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.base,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: borderRadius.md,
    backgroundColor: neoUIColors.background.cardDark,
    borderColor: neoUIColors.border.dark,
    paddingHorizontal: spacing.base,
    minHeight: 56,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: neoUIColors.text.light,
    fontFamily: typography.fonts.regular,
    paddingVertical: spacing.md,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.sm,
  },
  inputWithRightIcon: {
    paddingRight: spacing.sm,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  label: {
    position: 'absolute',
    left: spacing.base,
    backgroundColor: neoUIColors.background.cardDark,
    paddingHorizontal: spacing.xs,
    color: neoUIColors.text.subtext,
    fontFamily: typography.fonts.regular,
  },
  labelFocused: {
    color: neoUIColors.primary,
  },
  errorBorder: {
    borderColor: neoUIColors.status.error,
  },
  errorText: {
    color: neoUIColors.status.error,
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
    marginLeft: spacing.base,
    fontFamily: typography.fonts.regular,
  },
});
