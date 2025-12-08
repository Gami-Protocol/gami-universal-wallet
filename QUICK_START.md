# Gami Protocol - Quick Start Guide

Get up and running with the Gami Universal Wallet in 5 minutes.

## Prerequisites

Ensure you have:
- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager
- ✅ Git
- ✅ Chrome browser (for extension)
- ✅ iOS Simulator or Android Studio (for mobile testing)

## 🚀 1. Clone & Setup (2 minutes)

```bash
# Clone the repository
cd /your/projects/directory

# The project should already be at:
cd gami-universal-wallet

# Verify structure
ls -la
# Should see: Gami_Wallet/, chrome-extension/, backend/, README.md
```

## 📱 2. Mobile App Setup (1 minute)

```bash
# Navigate to mobile app
cd Gami_Wallet

# Install dependencies
npm install

# Start Expo development server
npx expo start

# Choose your platform:
# - Press 'i' for iOS Simulator
# - Press 'a' for Android Emulator  
# - Press 'w' for Web Browser
# - Scan QR with Expo Go app (mobile device)
```

**Expected Result:**
- App launches with dark Neobrultis theme
- See XP Progression Ring on wallet screen
- Mock data displays (Level 5, 3450/5000 XP)

## 🔧 3. Backend Setup (30 seconds)

Open a new terminal:

```bash
cd gami-universal-wallet/backend

# Install dependencies (if not done)
npm install

# Start server
npm start

# Should see:
# "Gami wallet backend listening on http://localhost:4000"
```

**Test Backend:**
```bash
# In another terminal
curl http://localhost:4000/health

# Expected response:
# {"status":"ok","rpcUrl":"http://localhost:8545"}
```

## 🌐 4. Chrome Extension Setup (1 minute)

1. **Open Chrome Extensions:**
   ```
   chrome://extensions/
   ```

2. **Enable Developer Mode:**
   - Toggle switch in top-right corner

3. **Load Extension:**
   - Click "Load unpacked"
   - Navigate to: `gami-universal-wallet/chrome-extension/public/`
   - Click "Select"

4. **Verify Installation:**
   - Gami Protocol icon appears in toolbar
   - Click icon → popup opens with mini dashboard

**Test Extension:**
- Navigate to any website
- Open Console (F12) → look for `[Gami]` logs
- Click around page → should see activity tracking
- Wait for POP notification to appear

## ✅ 5. Verify Everything Works

### Mobile App Checklist
- [ ] App launches without errors
- [ ] XP Progression Ring is visible and animated
- [ ] Can scroll through wallet screen
- [ ] Assets list displays
- [ ] Recent activity shows mock data
- [ ] Pull-to-refresh works

### Extension Checklist
- [ ] Extension icon visible in Chrome
- [ ] Popup opens showing mini XP ring
- [ ] Console shows `[Gami] Content script initialized`
- [ ] Console shows `[Gami] Background service worker initialized`
- [ ] Activity tracking logs appear on interaction
- [ ] POP notification appears after activity

### Backend Checklist
- [ ] Server running on port 4000
- [ ] Health endpoint responds
- [ ] No errors in terminal

## 🎨 Explore the Design System

### View Components

**Mobile (React Native):**
```typescript
// In Gami_Wallet/src/components/

import { XPProgressionRing } from './wallet/XPProgressionRing';
import { AssetCard } from './wallet/AssetCard';
import { Button } from './ui/Button';
import { StatCard } from './ui/StatCard';
```

**Design System:**
```typescript
// In Gami_Wallet/src/design/neobrultis-theme.ts

import { NeobrutlisTheme } from './design/neobrultis-theme';

// Use colors
NeobrutlisTheme.colors.accent.xp         // #00FF94
NeobrutlisTheme.colors.accent.points     // #00D1FF
NeobrutlisTheme.colors.background.primary // #0A0A0A

// Use typography
NeobrutlisTheme.typography.sizes['3xl']  // 32
NeobrutlisTheme.typography.fonts.primary // 'Space Mono'
```

## 🔧 Common Commands

### Mobile Development

```bash
cd Gami_Wallet

# Start dev server
npx expo start

# Start with specific platform
npx expo start --ios
npx expo start --android
npx expo start --web

# Clear cache
npx expo start -c

# Install new package
npm install package-name
```

### Extension Development

```bash
cd chrome-extension

# After making changes:
# 1. Go to chrome://extensions/
# 2. Click refresh icon on Gami extension card

# View logs:
# - Background: Extensions page → "Service worker" → "inspect"
# - Content: Right-click page → Inspect → Console
# - Popup: Right-click extension icon → "Inspect popup"
```

### Backend Development

```bash
cd backend

# Start server
npm start

# Test endpoints
curl http://localhost:4000/health
curl http://localhost:4000/api/chain/users/0x123.../stats
```

## 📚 Next Steps

### Learn the Architecture
1. Read `IMPLEMENTATION.md` for detailed technical overview
2. Review `STYLE_GUIDE.md` for design system usage
3. Check `PROJECT_SUMMARY.md` for complete feature list

### Make Your First Change

**Example: Change XP accent color**

1. Open `Gami_Wallet/src/design/neobrultis-theme.ts`
2. Find `accent.xp: '#00FF94'`
3. Change to `accent.xp: '#00FFD4'` (different green)
4. Save file
5. Reload app → XP color updates everywhere!

### Add a New Screen

```bash
cd Gami_Wallet/src/app/(tabs)

# Create new file: profile.tsx
# Copy structure from wallet.tsx
# Import NeobrutlisTheme
# Use design system components
```

### Customize Extension

1. Open `chrome-extension/public/content.js`
2. Find `maxConcurrentPops = 3`
3. Change to `maxConcurrentPops = 5`
4. Reload extension in Chrome
5. Now shows up to 5 POPs simultaneously!

## 🐛 Troubleshooting

### Mobile App Won't Start

```bash
# Clear cache and reinstall
cd Gami_Wallet
rm -rf node_modules
npm install
npx expo start -c
```

### Extension Not Working

1. Check Chrome console for errors
2. Verify manifest.json is valid
3. Reload extension: chrome://extensions/ → click refresh
4. Check all files in `public/` folder present

### Backend Connection Issues

```bash
# Check if port 4000 is available
lsof -ti:4000

# Kill process if needed
kill -9 $(lsof -ti:4000)

# Restart backend
cd backend
npm start
```

### Missing Dependencies

```bash
# Mobile
cd Gami_Wallet
npm install

# Extension
cd chrome-extension
npm install  # (minimal, mostly for reference)

# Backend
cd backend
npm install
```

## 🎯 Test Data

### Mock User Address
```
0x1234567890123456789012345678901234567890
```

### Mock XP Values
```javascript
{
  level: 5,
  currentXP: 3450,
  maxXP: 5000,
  totalXP: 18450
}
```

### Mock Assets
```javascript
[
  { symbol: 'ETH', name: 'Ethereum', balance: '2.45', value: '4,850.00' },
  { symbol: 'GAMI', name: 'Gami Token', balance: '1,500', value: '750.00' },
  { symbol: 'USDC', name: 'USD Coin', balance: '1,200', value: '1,200.00' }
]
```

## 📞 Getting Help

1. **Check Documentation:**
   - `README.md` - Project overview
   - `IMPLEMENTATION.md` - Technical details
   - `STYLE_GUIDE.md` - Design system
   - `chrome-extension/README.md` - Extension specifics

2. **Common Issues:**
   - Port conflicts → Change port in backend
   - Metro bundler issues → Clear cache with `-c` flag
   - Extension not loading → Check manifest.json syntax

3. **Development Tools:**
   - React Native Debugger
   - Chrome DevTools
   - Expo Dev Tools

## 🎉 Success!

You should now have:
- ✅ Mobile app running with Neobrultis UI
- ✅ XP Progression Ring displaying
- ✅ Chrome extension tracking activity
- ✅ Backend API responding
- ✅ POPs appearing on interactions

**Ready to build the future of Web3 engagement! 💚**

---

**Time to Complete:** ~5 minutes  
**Difficulty:** Easy  
**Support:** Check documentation files for help  

Happy coding! 🚀
