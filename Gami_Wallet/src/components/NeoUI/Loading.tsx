/**
 * Loading Component
 * Loading states and shimmer effects
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { neoUIColors } from '@/theme';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = neoUIColors.primary,
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }

  return <ActivityIndicator size={size} color={color} />;
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: neoUIColors.background.darker,
  },
});
