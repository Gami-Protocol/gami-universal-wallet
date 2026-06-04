/**
 * ArcadeScreen — shared shell for every onboarding step.
 * Dark canvas, ambient glow blobs, safe-area aware padding and an optional
 * step header (back button + progress blocks).
 */
import React from 'react';
import { View, Pressable, StyleSheet, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GAMI } from '../tokens';
import { GlowBlob } from './GlowBlob';
import { StepDots } from './primitives';
import { ChevronLeftIcon } from './icons';

export interface ArcadeScreenProps {
  children: React.ReactNode;
  step?: number;
  steps?: number;
  onBack?: () => void;
  scrollable?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

export function ArcadeScreen({
  children,
  step,
  steps,
  onBack,
  scrollable = false,
  contentStyle,
}: ArcadeScreenProps) {
  const insets = useSafeAreaInsets();
  const showHeader = typeof step === 'number' && typeof steps === 'number';

  const inner = (
    <View
      style={[
        styles.inner,
        {
          paddingTop: showHeader ? 12 : insets.top + 12,
          paddingBottom: insets.bottom + 20,
        },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <View style={styles.root}>
      {/* ambient backdrop */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <GlowBlob color={GAMI.purple} size={300} top={-90} right={-90} opacity={0.4} />
        <GlowBlob color={GAMI.pink} size={240} bottom={-70} left={-70} opacity={0.3} />
      </View>

      {showHeader && (
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          {onBack ? (
            <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
              <ChevronLeftIcon size={16} color="#fff" />
            </Pressable>
          ) : (
            <View style={styles.spacer} />
          )}
          <StepDots count={steps!} current={step!} />
          <View style={styles.spacer} />
        </View>
      )}

      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {inner}
        </ScrollView>
      ) : (
        <View style={styles.flexBody}>{inner}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GAMI.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: GAMI.borderStrong,
    backgroundColor: GAMI.bgElev,
  },
  spacer: { width: 32, height: 32 },
  flexBody: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  inner: { flex: 1, paddingHorizontal: 22 },
});
