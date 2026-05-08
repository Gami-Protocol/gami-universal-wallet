/**
 * Neo-UI Design System - Color Palette
 * Gami Protocol Universal Wallet
 */

export const neoUIColors = {
  primary: '#6C63FF', // Indigo/Purple
  secondary: '#4ECDC4', // Mint/Teal
  accent: '#FF6B9D', // Pink
  
  background: {
    light: '#F8F9FF',
    dark: '#1A1D2E',
    darker: '#0F0F13',
    card: 'rgba(255, 255, 255, 0.9)',
    cardDark: '#1A1A24',
  },
  
  text: {
    primary: '#2C3E50',
    secondary: '#7F8C9B',
    light: '#FFFFFF',
    dark: '#000000',
    subtext: '#9CA3AF',
  },
  
  gradient: {
    purple: ['#6C63FF', '#4834DF'],
    mint: ['#4ECDC4', '#44A08D'],
    sunset: ['#FF6B9D', '#FFC371'],
    magentaCyan: ['#B026FF', '#00F0FF'],
  },
  
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#2A2A35',
  },
  
  status: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
  
  // Brand colors (Gami specific)
  brand: {
    magenta: '#B026FF',
    cyan: '#00F0FF',
  },
} as const;

export type NeoUIColors = typeof neoUIColors;
