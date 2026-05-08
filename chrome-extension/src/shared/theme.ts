// Design tokens exported as JS constants
// Matches shared/design-tokens.json

export const colors = {
  background: {
    DEFAULT: '#030014',
    paper: '#0F0720',
    glass: 'rgba(15, 7, 32, 0.7)',
  },
  primary: {
    DEFAULT: '#6E3CFB',
    hover: '#5B2AD8',
    active: '#4C1D95',
    foreground: '#FFFFFF',
  },
  secondary: {
    DEFAULT: '#A78BFA',
    hover: '#8B5CF6',
    foreground: '#0F0720',
  },
  accent: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  surface: {
    DEFAULT: '#1E1B2E',
    border: '#2D2B42',
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.6)',
    muted: 'rgba(255, 255, 255, 0.3)',
  },
} as const;

export const shadows = {
  glow: {
    primary: '0 0 30px -5px rgba(110, 60, 251, 0.5)',
    primaryHover: '0 0 40px -5px rgba(110, 60, 251, 0.7)',
  },
  brutal: {
    black: '8px 8px 0px 0px #000000',
    purple: '8px 8px 0px 0px #6E3CFB',
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
} as const;

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
} as const;
