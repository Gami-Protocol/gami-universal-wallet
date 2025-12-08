# Gami Protocol Chrome Extension

A lightweight Chrome extension for the Gami Protocol Universal Wallet that enables real-time engagement tracking and POP (Point of Presence) notifications.

## Features

### 🎯 Activity Tracking
- Automatic tracking of user interactions across integrated websites
- Page visits, clicks, scrolls, and form submissions
- Privacy-focused: only tracks activity on consented websites

### 💥 POP Notifications
- Non-intrusive, pop-out notifications for XP/points acquisition
- Neobrultis design theme with holographic effects
- Real-time feedback on user activities
- Auto-dismiss after 5 seconds

### 🔄 Real-Time Sync
- Seamless synchronization with Gami Protocol MCP Core
- 30-second automatic data refresh
- Manual sync option available

### 📊 Quick Stats View
- Compact popup with XP progression ring
- Level and total XP display
- Today's XP earned
- Quick access to full wallet

## Installation

### Development Mode

1. **Clone the repository**
   ```bash
   cd chrome-extension
   ```

2. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `public` folder

3. **Configure Backend**
   - Ensure Gami wallet backend is running on `http://localhost:4000`
   - Update `GAMI_API_BASE` in `background.js` if using different URL

## Usage

### For Users

1. **Connect Wallet**
   - Click the Gami extension icon
   - Connect your wallet address (first time setup)

2. **Track Activity**
   - Browse integrated websites normally
   - Receive POP notifications when earning XP/points
   - Click notifications to view details

3. **View Stats**
   - Click extension icon to see current level and XP
   - Click "Open Full Wallet" to access complete dashboard
   - Use "Sync Now" to refresh data immediately

### For Developers

#### Message API

The extension uses Chrome's messaging API for communication:

**Background → Content Script**
```javascript
chrome.tabs.sendMessage(tabId, {
  type: 'SHOW_POP',
  payload: {
    xp: 50,
    points: 25,
    message: 'Action completed'
  }
});
```

**Content Script → Background**
```javascript
chrome.runtime.sendMessage({
  type: 'TRACK_ACTIVITY',
  payload: {
    type: 'click',
    url: window.location.href,
    metadata: { ... }
  }
});
```

#### Activity Types

- `page_visit`: New page loaded
- `click`: User clicked element
- `scroll`: Scroll depth milestone reached
- `form_submit`: Form submitted

## Architecture

```
chrome-extension/
├── public/
│   ├── manifest.json          # Extension configuration
│   ├── background.js          # Service worker (activity tracking, sync)
│   ├── content.js             # Content script (POP manager, DOM tracking)
│   ├── content.css            # Content script styles
│   ├── popup.html             # Extension popup UI
│   ├── popup.js               # Popup logic
│   ├── popup.css              # Popup styles (Neobrultis theme)
│   └── assets/                # Icons and images
└── package.json
```

## Neobrultis Design Theme

The extension follows the Neobrultis design system:

- **Dark Mode**: Primary background `#0A0A0A`
- **High Contrast**: Sharp text on dark backgrounds
- **Accent Colors**:
  - XP: `#00FF94` (Green)
  - Points: `#00D1FF` (Cyan)
  - Rewards: `#FF00E5` (Magenta)
- **Typography**: Monospaced `Courier New`
- **Effects**: Glow shadows, subtle animations

## Configuration

### Backend URL
Update `GAMI_API_BASE` in `background.js`:
```javascript
const GAMI_API_BASE = 'https://your-api-url.com/api';
```

### Sync Interval
Adjust sync frequency in `background.js`:
```javascript
const SYNC_INTERVAL = 30000; // 30 seconds
```

### Max Concurrent POPs
Control simultaneous notifications in `content.js`:
```javascript
this.maxConcurrentPops = 3;
```

## Privacy & Security

- Activity tracking can be disabled in extension settings
- No data is collected without user consent
- All communication with backend is over HTTPS (production)
- User wallet data stored locally in Chrome storage

## Browser Compatibility

- Chrome 88+
- Manifest V3 compliant
- Uses modern ES6+ features

## Development

### Testing
1. Make changes to files in `public/`
2. Go to `chrome://extensions/`
3. Click refresh icon on Gami Protocol extension card
4. Test changes immediately

### Debugging
- **Background Service Worker**: Chrome DevTools → Extensions → Service worker "inspect"
- **Content Script**: Right-click page → Inspect → Console (check for `[Gami]` logs)
- **Popup**: Right-click extension icon → Inspect popup

## Roadmap

- [ ] Support for custom website integrations
- [ ] Achievement notifications
- [ ] Leaderboard quick view
- [ ] Social sharing from POPs
- [ ] Multi-chain support
- [ ] Mobile deep linking

## License

MIT License - see LICENSE file for details
