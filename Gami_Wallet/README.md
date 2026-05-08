# Gami Universal Wallet - Mobile App

A modern, secure cryptocurrency wallet with Neo-UI design system, onboarding flow, and enhanced user experience.

## 🎨 Neo-UI Design System

This project features a comprehensive Neo-UI design system with:

- **Enhanced Splash Screen**: Animated logo with gradient effects
- **Onboarding Flow**: 3-slide carousel with progress indicators
- **Authentication**: Sign up and login screens with form validation
- **Reusable Components**: Modern, animated UI components
- **Theme System**: Consistent colors, typography, and spacing

### Documentation

- 📖 [Neo-UI README](./NEO_UI_README.md) - Component API and usage guide
- 📋 [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Technical details and architecture
- 🎬 [Screen Flow](./SCREEN_FLOW.md) - Visual flow diagrams and layouts

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run start

# Open native targets
npm run ios
npm run android
```

## 📦 App Store Builds (Expo/EAS)

This app is configured for Expo managed builds with native package IDs:

- iOS bundle identifier: `com.gamiprotocol.universalwallet`
- Android application ID: `com.gamiprotocol.universalwallet`

Use EAS to produce store binaries:

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

## 📱 Features

### Splash Screen
- Animated Gami Protocol logo
- Gradient background effects
- Smart routing based on user state
- Minimum 2-second display time

### Onboarding
- 3 informative slides
- Swipeable carousel navigation
- Skip functionality
- Progress dots indicator
- One-time display per install

### Authentication
- Sign up with email/password
- Login with credentials
- Social auth UI (Google, Apple)
- Form validation
- Password visibility toggle
- Terms and Privacy Policy acceptance

## 🔐 Security

- Zero vulnerabilities (CodeQL verified)
- Secure password handling
- Form validation on all inputs
- AsyncStorage for sensitive data

---

**Built with ❤️ by the Gami Protocol team**
