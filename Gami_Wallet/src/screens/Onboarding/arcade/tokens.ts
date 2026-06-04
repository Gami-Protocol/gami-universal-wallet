/**
 * Gami Protocol — Cyber-Brutalist design tokens (Arcade onboarding flow)
 * Ported from the uploaded `gami-tokens.css` design system so the native
 * onboarding matches the Figma source 1:1.
 */

export const GAMI = {
  // surfaces
  bg: '#0E0E12',
  bgElev: '#16161D',
  bgCard: '#1C1C26',

  // brand purples
  purple: '#6E3CFB',
  purpleDeep: '#4B24B8',
  purpleLight: '#9C6CFF',
  purpleSoft: 'rgba(110, 60, 251, 0.16)',

  // text
  text: '#FFFFFF',
  textDim: 'rgba(255, 255, 255, 0.62)',
  textMuted: 'rgba(255, 255, 255, 0.38)',

  // borders
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.18)',

  // accents
  success: '#3FE0A0',
  warn: '#FFB23F',
  pink: '#FF4FA8',
  cyan: '#4FE3FF',

  black: '#000000',
} as const;

export const FONTS = {
  display: 'SpaceGrotesk_700Bold',
  displayMed: 'SpaceGrotesk_500Medium',
  sans: 'Inter_400Regular',
  sansSemi: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
  mono: 'JetBrainsMono_400Regular',
  monoBold: 'JetBrainsMono_700Bold',
} as const;

export type GamiColor = (typeof GAMI)[keyof typeof GAMI];
