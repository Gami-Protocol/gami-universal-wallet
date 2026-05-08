/**
 * Neo-UI Design System - Theme Export
 * Gami Protocol Universal Wallet
 */

import { neoUIColors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius } from './spacing';
import { shadows } from './shadows';

export { neoUIColors } from './colors';
export { typography } from './typography';
export { spacing, borderRadius } from './spacing';
export { shadows } from './shadows';

export type { NeoUIColors } from './colors';
export type { Typography } from './typography';
export type { Spacing, BorderRadius } from './spacing';
export type { Shadows } from './shadows';

// Re-export for convenience
export const theme = {
  colors: neoUIColors,
  typography,
  spacing,
  borderRadius,
  shadows,
} as const;
