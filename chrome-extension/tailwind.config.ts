import type { Config } from 'tailwindcss';

/**
 * Gami Protocol Design System - Tailwind Configuration
 * "Cyber-Brutalist Tech" aesthetic
 */
const config: Config = {
  content: ['./popup.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Gami brand colors
        gami: {
          purple: '#6E3CFB',
          dark: '#4B24B8',
          accent: '#9C6CFF',
          bg: '#0E0E12',
        },
        background: {
          DEFAULT: '#0E0E12',
          paper: '#0F0720',
          glass: 'rgba(15, 7, 32, 0.7)',
        },
        primary: {
          DEFAULT: '#6E3CFB',
          hover: '#5B2AD8',
          active: '#4B24B8',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#9C6CFF',
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
      },
      fontFamily: {
        display: ['Space Grotesk', 'Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        // Cyber-Brutalist signature shadows
        brutal: '8px 8px 0px 0px #000000',
        'brutal-purple': '8px 8px 0px 0px #6E3CFB',
        glow: '0 0 20px rgba(110, 60, 251, 0.4)',
        'glow-hover': '0 0 40px rgba(110, 60, 251, 0.7)',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotateY(0deg)' },
          '50%': { transform: 'translateY(-20px) rotateY(180deg)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5', filter: 'blur(40px)' },
          '50%': { opacity: '0.8', filter: 'blur(60px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
