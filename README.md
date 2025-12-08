# Gami Protocol Universal Wallet & Engagement Tracker

A comprehensive Web3 wallet and engagement tracking system featuring the **Neobrultis** design theme - a fusion of brutalist efficiency and neo-tech aesthetics.

## 🌟 Overview

This project consists of three main components:

1. **Mobile Application** (iOS/Android) - Universal wallet with XP progression and asset management
2. **Chrome Extension** - Real-time engagement tracking with POP notifications
3. **Backend API** - Integration with Gami Protocol blockchain

## 🎨 Neobrultis Design Theme

A unique design language combining:
- **Brutalist principles**: Clean lines, high contrast, raw typography
- **Neo-tech aesthetics**: Dark mode, holographic effects, futuristic glow

### Key Features
- Dark primary palette (#0A0A0A)
- Neon accent colors (XP Green #00FF94, Points Cyan #00D1FF, Rewards Magenta #FF00E5)
- Monospace typography (Space Mono, Courier New)
- Sharp corners with strategic glow effects
- Dynamic XP Progression Ring as centerpiece

## 📁 Project Structure

```
gami-universal-wallet/
├── Gami_Wallet/                    # Mobile app (React Native/Expo)
│   ├── src/
│   │   ├── design/                 # Neobrultis design system
│   │   │   └── neobrultis-theme.ts
│   │   ├── components/
│   │   │   └── wallet/
│   │   │       ├── XPProgressionRing.tsx  # ⭐ Signature component
│   │   │       └── AssetCard.tsx
│   │   └── app/
│   │       └── (tabs)/
│   │           └── wallet.tsx      # Main dashboard
│   └── package.json
│
├── chrome-extension/               # Browser extension
│   ├── public/
│   │   ├── manifest.json
│   │   ├── background.js           # Activity tracking & sync
│   │   ├── content.js              # POP notifications
│   │   ├── popup.html/js/css       # Extension popup UI
│   │   └── assets/
│   └── README.md
│
├── backend/                        # API server
│   ├── server.js                   # Express server
│   └── package.json
│
├── IMPLEMENTATION.md               # Detailed implementation guide
└── STYLE_GUIDE.md                 # Complete design system documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- iOS Simulator (for iOS development) or Android Studio (for Android)
- Chrome browser (for extension)

### 1. Backend Setup

```bash
cd backend
npm install
npm start
# Server runs on http://localhost:4000
```

### 2. Mobile App

```bash
cd Gami_Wallet
npm install

# Start Expo dev server
npx expo start

# Run on specific platform
npx expo run:ios        # iOS
npx expo run:android    # Android
npx expo start --web    # Web
```

### 3. Chrome Extension

```bash
cd chrome-extension

# Load in Chrome
1. Open chrome://extensions/
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the "public" folder
```

## ✨ Key Features

### Mobile App

- **XP Progression Ring**: Dynamic circular progress indicator with holographic gradient
- **Non-Custodial Wallet**: ERC-4337 compatible with social login
- **Asset Aggregator**: Multi-chain token and NFT viewing
- **Identity Hub**: Cross-web reputation and achievements
- **Real-Time Sync**: WebSocket connection for instant updates

### Chrome Extension

- **Activity Tracking**: Monitor page visits, clicks, scrolls, form submissions
- **POP Notifications**: Non-intrusive pop-out notifications for XP/points
- **Quick Stats**: Mini dashboard in extension popup
- **Background Sync**: Continuous data synchronization

### Backend API

```
GET  /api/chain/users/:address/stats       # User level and XP
GET  /api/chain/agents/:agentAddress/budget # Agent spending budget
GET  /api/chain/economy/inflation-rate     # XP inflation rate
```

## 📚 Documentation

- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - Comprehensive implementation guide
- **[STYLE_GUIDE.md](./STYLE_GUIDE.md)** - Complete Neobrultis design system
- **[chrome-extension/README.md](./chrome-extension/README.md)** - Extension documentation

## 🎯 Core Components

### XP Progression Ring

The signature component of the Neobrultis design:

```tsx
<XPProgressionRing
  currentXP={3450}
  maxXP={5000}
  level={5}
  size={220}
  strokeWidth={14}
/>
```

Features:
- Animated SVG with gradient stroke
- Pulsing glow effect
- Real-time progress updates
- Responsive sizing

### POP Notifications

Real-time engagement rewards:

```javascript
// Triggered automatically on user activity
{
  xp: 50,
  points: 25,
  message: "Action completed"
}
```

Features:
- Slide-in animation from top-right
- Auto-dismiss after 5 seconds
- Click to view details
- Queue system for multiple notifications

## 🛠️ Tech Stack

### Mobile
- React Native 0.81
- Expo 54
- React Native Reanimated 4
- React Native SVG
- Zustand (state management)
- Expo Router (navigation)

### Extension
- Manifest V3
- Vanilla JavaScript
- Chrome APIs
- Service Workers

### Backend
- Node.js
- Express
- Gami Wallet SDK
- CORS enabled

## 🎨 Design System Usage

```typescript
import { NeobrutlisTheme } from '@/design/neobrultis-theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: NeobrutlisTheme.colors.background.primary,
  },
  title: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes['3xl'],
    color: NeobrutlisTheme.colors.accent.xp,
  },
});
```

## 🔐 Security

- Non-custodial wallet (private keys never leave device)
- ERC-4337 account abstraction
- Local encrypted storage
- HTTPS API communication
- Minimal browser permissions

## 🗺️ Roadmap

### Phase 1: MVP ✅
- Neobrultis design system
- XP Progression Ring
- Mobile wallet dashboard
- Chrome extension with POP notifications
- Activity tracking
- Backend integration

### Phase 2: Enhanced Features
- Social login integration (Google, Apple, Twitter)
- Quest system
- Achievement badges
- Leaderboard
- Profile customization

### Phase 3: Advanced
- Multi-chain support
- NFT marketplace
- DeFi integrations
- DAO governance
- Advanced analytics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the Neobrultis style guide
4. Commit changes (`git commit -m 'feat: add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Brutalist architecture and cyberpunk aesthetics
- React Native & Expo communities
- Chrome Extensions documentation
- Web3 ecosystem

---

**Built with 💚 by the Gami Protocol team**
