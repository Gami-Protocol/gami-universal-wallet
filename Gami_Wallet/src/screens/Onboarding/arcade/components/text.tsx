/**
 * Typography helpers — keep the brutalist display/mono hierarchy consistent
 * across every onboarding step.
 */
import React from 'react';
import { Text, StyleProp, TextStyle, StyleSheet } from 'react-native';
import { GAMI, FONTS } from '../tokens';

type TProps = { children: React.ReactNode; style?: StyleProp<TextStyle>; color?: string };

export const Display = ({ children, style, color = '#fff' }: TProps) => (
  <Text style={[styles.display, { color }, style]}>{children}</Text>
);

export const Title = ({ children, style, color = '#fff' }: TProps) => (
  <Text style={[styles.title, { color }, style]}>{children}</Text>
);

export const Body = ({ children, style, color = GAMI.textDim }: TProps) => (
  <Text style={[styles.body, { color }, style]}>{children}</Text>
);

export const Mono = ({ children, style, color = GAMI.textDim }: TProps) => (
  <Text style={[styles.mono, { color }, style]}>{children}</Text>
);

export const Label = ({ children, style, color = 'rgba(255,255,255,0.55)' }: TProps) => (
  <Text style={[styles.label, { color }, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  display: { fontFamily: FONTS.display, fontSize: 42, lineHeight: 42, letterSpacing: -0.5 },
  title: { fontFamily: FONTS.display, fontSize: 32, lineHeight: 33, letterSpacing: -0.4 },
  body: { fontFamily: FONTS.sans, fontSize: 15, lineHeight: 22 },
  mono: { fontFamily: FONTS.mono, fontSize: 12, letterSpacing: 0.4 },
  label: { fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.6 },
});
