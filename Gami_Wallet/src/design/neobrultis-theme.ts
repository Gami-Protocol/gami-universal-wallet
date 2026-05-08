/**
 * Neobrultis Design System
 * Brutalist efficiency meets neo-tech aesthetics
 */

export const NeobrutlisTheme = {
  colors: {
    // Primary Dark Palette
    background: {
      primary: '#0A0A0A',
      secondary: '#121212',
      tertiary: '#1A1A1A',
      elevated: '#242424',
    },
    
    // High Contrast Text
    text: {
      primary: '#FFFFFF',
      secondary: '#B8B8B8',
      tertiary: '#6B6B6B',
      inverse: '#0A0A0A',
    },
    
    // XP/Points Accent Colors with Glow
    accent: {
      xp: '#00FF94',
      xpGlow: 'rgba(0, 255, 148, 0.4)',
      points: '#00D1FF',
      pointsGlow: 'rgba(0, 209, 255, 0.4)',
      reward: '#FF00E5',
      rewardGlow: 'rgba(255, 0, 229, 0.4)',
    },
    
    // UI States
    states: {
      success: '#00FF94',
      warning: '#FFD600',
      error: '#FF3D3D',
      info: '#00D1FF',
    },
    
    // Holographic Elements
    holographic: {
      primary: 'linear-gradient(135deg, #00FF94 0%, #00D1FF 50%, #FF00E5 100%)',
      secondary: 'linear-gradient(90deg, #00D1FF 0%, #FF00E5 100%)',
      tertiary: 'linear-gradient(180deg, #FF00E5 0%, #00FF94 100%)',
    },
    
    // Borders & Dividers
    border: {
      default: '#2A2A2A',
      strong: '#404040',
      accent: '#00FF94',
    },
    
    // Glitch Effect Colors
    glitch: {
      red: '#FF0000',
      cyan: '#00FFFF',
      magenta: '#FF00FF',
    },
  },
  
  typography: {
    fonts: {
      primary: 'Space Mono',
      secondary: 'Inter',
      monospace: 'Courier New',
    },
    
    sizes: {
      xs: 10,
      sm: 12,
      base: 14,
      lg: 16,
      xl: 20,
      '2xl': 24,
      '3xl': 32,
      '4xl': 40,
      '5xl': 48,
      hero: 64,
    },
    
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
    
    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
      wider: 1,
      widest: 2,
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
    '4xl': 64,
  },
  
  borderRadius: {
    none: 0,
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
    full: 9999,
  },
  
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.8)',
    md: '0 4px 6px rgba(0, 0, 0, 0.8)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.9)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.9)',
    glow: {
      xp: '0 0 20px rgba(0, 255, 148, 0.6)',
      points: '0 0 20px rgba(0, 209, 255, 0.6)',
      reward: '0 0 20px rgba(255, 0, 229, 0.6)',
    },
  },
  
  animations: {
    durations: {
      fast: 150,
      normal: 300,
      slow: 500,
      verySlow: 1000,
    },
    
    easings: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  
  components: {
    card: {
      backgroundColor: '#121212',
      borderColor: '#2A2A2A',
      borderWidth: 1,
      borderRadius: 4,
      padding: 16,
    },
    
    button: {
      primary: {
        backgroundColor: '#00FF94',
        color: '#0A0A0A',
        borderRadius: 2,
        padding: { vertical: 12, horizontal: 24 },
      },
      secondary: {
        backgroundColor: 'transparent',
        color: '#FFFFFF',
        borderColor: '#00FF94',
        borderWidth: 1,
        borderRadius: 2,
        padding: { vertical: 12, horizontal: 24 },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '#00FF94',
        borderRadius: 2,
        padding: { vertical: 12, horizontal: 24 },
      },
    },
    
    input: {
      backgroundColor: '#1A1A1A',
      borderColor: '#2A2A2A',
      borderWidth: 1,
      borderRadius: 2,
      padding: 12,
      color: '#FFFFFF',
      placeholderColor: '#6B6B6B',
    },
  },
  
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
};

export type NeobrutlisThemeType = typeof NeobrutlisTheme;
