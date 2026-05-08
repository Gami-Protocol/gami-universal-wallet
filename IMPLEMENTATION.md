# Gami Protocol Universal Wallet MVP

A comprehensive Web3 wallet and engagement tracking system with the **Neobrultis** design theme - a fusion of brutalist efficiency and neo-tech aesthetics.

## 🎨 Design Philosophy: Neobrultis

**Neobrultis** combines:
- **Brutalist Efficiency**: Clean lines, raw typography, high contrast, geometric precision
- **Neo-Tech Aesthetics**: Dark mode, holographic effects, subtle glows, futuristic elements

### Visual Identity
- **Color Palette**: Dark primary (#0A0A0A) with neon accents (#00FF94 XP, #00D1FF Points, #FF00E5 Rewards)
- **Typography**: Monospaced fonts (Space Mono, Courier New) with wide letter spacing
- **Components**: Sharp corners, intentional contrast, minimal shadows with strategic glow effects
- **Animations**: Smooth, purposeful transitions with cubic-bezier easing

## 📱 Mobile Application (iOS/Android)

### Core Features

#### 1. **Non-Custodial Wallet**
- ERC-4337 compatible account abstraction
- Social login integration (Google, Apple, Twitter)
- Gasless transactions
- Multi-chain asset management

#### 2. **XP Progression Ring** ⭐
The centerpiece of the Neobrultis design:
- Dynamic SVG-based circular progress indicator
- Holographic gradient (XP green → Points cyan → Reward magenta)
- Pulsing glow effect synchronized with progress
- Real-time animation on XP gain
- Displays current level, XP progress, and percentage to next level

#### 3. **Identity Hub**
- Cross-Web Identity management
- Reputation score and history
- Achievement showcase
- Activity timeline

#### 4. **Asset Aggregator**
- Multi-chain asset viewing
- Token balances and valuations
- NFT gallery
- Transaction history

#### 5. **Real-Time Sync**
- WebSocket connection to Gami Protocol MCP Core
- Sub-second latency for XP/level updates
- Push notifications for rewards
- Background sync when app is inactive

### Tech Stack
- **Framework**: React Native (Expo)
- **Navigation**: Expo Router
- **State Management**: Zustand
- **Animations**: React Native Reanimated 4
- **Graphics**: React Native SVG, Skia
- **Wallet**: Integration with Gami Wallet SDK

### Key Screens

1. **Wallet Dashboard** (`wallet.tsx`)
   - XP Progression Ring (central focus)
   - Quick stats (Total XP, Rank)
   - Asset list with cards
   - Recent activity feed

2. **Profile Screen**
   - User identity and avatar
   - Achievement badges
   - Reputation metrics
   - Social connections

3. **Activity Screen**
   - Detailed engagement history
   - XP breakdown by source
   - Quest completion status

4. **Settings Screen**
   - Wallet management
   - Privacy controls
   - Theme customization
   - Notification preferences

## 🌐 Chrome Extension

### Features

#### 1. **Activity Tracking**
Monitors user interactions:
- Page visits
- Clicks and interactions
- Scroll depth
- Form submissions
- Time on site

#### 2. **POP Notifications** 💥
Non-intrusive, real-time reward notifications:
- Slide in from top-right
- Neobrultis styled (dark background, glow effects)
- Display XP/points earned
- Click to view details or auto-dismiss
- Queue system for multiple POPs

#### 3. **Quick Stats Popup**
Compact extension popup showing:
- Mini XP progression ring
- Current level and XP
- Today's earnings
- Quick access to full wallet

#### 4. **Background Sync**
- Service worker continuously syncs with backend
- 30-second refresh interval
- Efficient data caching
- Minimal battery/CPU impact

### Architecture

```
Extension Components:
├── Background Service Worker (background.js)
│   ├── Activity Tracker
│   ├── Data Sync Manager
│   └── Reward Eligibility Checker
│
├── Content Script (content.js)
│   ├── POP Notification Manager
│   ├── DOM Event Listeners
│   └── Activity Reporter
│
└── Popup UI (popup.html/js/css)
    ├── Mini Dashboard
    ├── Quick Stats
    └── Settings Toggle
```

## 🏗️ Backend Integration

### API Endpoints

The system integrates with Gami wallet backend:

```
GET  /api/chain/users/:address/stats
     → Returns level, totalXP, xpToNextLevel

GET  /api/chain/agents/:agentAddress/budget
     → Check agent spending budget

GET  /api/chain/economy/inflation-rate
     → Get current XP inflation rate
```

### Data Flow

```
User Activity → Extension Tracking → Backend Processing → 
MCP Core Validation → XP/Points Award → POP Notification → 
Mobile App Sync → UI Update
```

## 🎯 Implementation Highlights

### 1. **XP Progression Ring Component**
Located: `Gami_Wallet/src/components/wallet/XPProgressionRing.tsx`

Features:
- Animated SVG circle with gradient stroke
- Dynamic progress calculation
- Pulsing glow effect using Reanimated
- Responsive sizing
- Accessibility support

### 2. **Neobrultis Theme System**
Located: `Gami_Wallet/src/design/neobrultis-theme.ts`

Provides:
- Comprehensive color palette
- Typography scale
- Spacing system
- Component variants
- Animation presets

### 3. **POP Notification System**
Located: `chrome-extension/public/content.js`

Features:
- Non-blocking DOM injection
- CSS-in-JS styling
- Queue management
- Click-to-dismiss
- Auto-removal timer

### 4. **Activity Tracking**
Located: `chrome-extension/public/background.js`

Tracks:
- Navigation events
- User interactions
- Engagement metrics
- Context metadata

## 🚀 Getting Started

### Mobile App

```bash
cd Gami_Wallet

# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android

# Run on Web
npx expo start --web
```

### Backend

```bash
cd backend

# Install dependencies
npm install

# Start server
npm start
# Server runs on http://localhost:4000
```

### Chrome Extension

```bash
cd chrome-extension

# Load extension in Chrome
1. Open chrome://extensions/
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the "public" folder
```

## 📐 Design System Usage

### Colors

```typescript
import { NeobrutlisTheme } from '@/design/neobrultis-theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: NeobrutlisTheme.colors.background.primary,
  },
  text: {
    color: NeobrutlisTheme.colors.text.primary,
  },
  xpValue: {
    color: NeobrutlisTheme.colors.accent.xp,
    textShadowColor: NeobrutlisTheme.colors.accent.xpGlow,
  },
});
```

### Typography

```typescript
const styles = StyleSheet.create({
  title: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes['3xl'],
    fontWeight: NeobrutlisTheme.typography.weights.bold,
    letterSpacing: NeobrutlisTheme.typography.letterSpacing.wider,
  },
});
```

### Components

```typescript
const buttonStyle = {
  ...NeobrutlisTheme.components.button.primary,
  borderRadius: NeobrutlisTheme.borderRadius.sm,
};
```

## 🔐 Security Considerations

- **Non-custodial**: Private keys never leave user device
- **ERC-4337**: Account abstraction for enhanced security
- **Local Storage**: Sensitive data encrypted in device storage
- **HTTPS**: All API communication over secure connections
- **Permission Scopes**: Minimal browser permissions required

## 🎯 Roadmap

### Phase 1: MVP (Current)
- [x] Neobrultis design system
- [x] XP Progression Ring component
- [x] Wallet dashboard screen
- [x] Chrome extension with POP notifications
- [x] Activity tracking system
- [x] Backend integration

### Phase 2: Enhanced Features
- [ ] Social login integration
- [ ] Quest system UI
- [ ] Achievement badges
- [ ] Leaderboard
- [ ] Profile customization

### Phase 3: Advanced
- [ ] Multi-chain support
- [ ] NFT marketplace integration
- [ ] DeFi protocol integrations
- [ ] DAO governance interface
- [ ] Advanced analytics

## 📝 Development Guidelines

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Consistent naming (camelCase for variables, PascalCase for components)
- Comments for complex logic only

### Component Structure
```typescript
// 1. Imports
// 2. Types/Interfaces
// 3. Component definition
// 4. Styles (StyleSheet.create)
```

### Git Workflow
```bash
# Feature branch
git checkout -b feature/component-name

# Commit with conventional commits
git commit -m "feat: add XP progression ring component"

# Push and create PR
git push origin feature/component-name
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Follow design system guidelines
4. Add tests for new features
5. Submit PR with detailed description

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Design inspiration: Brutalist architecture and cyberpunk aesthetics
- React Native community
- Expo team
- Chrome Extensions documentation

---

**Built with 💚 by the Gami Protocol team**
