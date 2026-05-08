/**
 * Gami Protocol - Background Service Worker
 * Manages activity tracking, data sync, and POP notifications
 */

const GAMI_API_BASE = 'http://localhost:4000/api';
const SYNC_INTERVAL = 30000; // 30 seconds

// Activity tracker
class ActivityTracker {
  constructor() {
    this.activities = [];
    this.isTracking = false;
  }

  startTracking() {
    this.isTracking = true;
    console.log('[Gami] Activity tracking started');
  }

  stopTracking() {
    this.isTracking = false;
    console.log('[Gami] Activity tracking stopped');
  }

  trackEvent(event) {
    if (!this.isTracking) return;

    const activity = {
      id: Date.now(),
      type: event.type,
      url: event.url,
      timestamp: new Date().toISOString(),
      metadata: event.metadata || {},
    };

    this.activities.push(activity);
    this.processActivity(activity);
  }

  async processActivity(activity) {
    // Check if activity triggers XP/points
    const reward = await this.checkRewardEligibility(activity);
    
    if (reward) {
      this.triggerPOPNotification(reward);
    }
  }

  async checkRewardEligibility(activity) {
    // TODO: Check with Gami Protocol MCP Core
    // For now, return mock data for demo
    const rewardTypes = {
      'page_visit': { xp: 10, points: 5, message: 'Page visited' },
      'click': { xp: 5, points: 2, message: 'Interaction detected' },
      'scroll': { xp: 3, points: 1, message: 'Content engaged' },
      'form_submit': { xp: 50, points: 25, message: 'Action completed' },
    };

    return rewardTypes[activity.type] || null;
  }

  async triggerPOPNotification(reward) {
    // Send message to content script to show POP
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'SHOW_POP',
        payload: reward,
      });
    }
  }
}

// Data sync manager
class DataSyncManager {
  constructor() {
    this.syncTimer = null;
    this.userData = null;
  }

  startSync() {
    this.syncTimer = setInterval(() => {
      this.syncUserData();
    }, SYNC_INTERVAL);
    
    // Initial sync
    this.syncUserData();
  }

  stopSync() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  async syncUserData() {
    try {
      const { address } = await chrome.storage.local.get('address');
      
      if (!address) {
        console.log('[Gami] No wallet address found');
        return;
      }

      const response = await fetch(`${GAMI_API_BASE}/chain/users/${address}/stats`);
      const data = await response.json();
      
      this.userData = data;
      
      // Store in local storage
      await chrome.storage.local.set({ userData: data });
      
      // Notify popup if open
      chrome.runtime.sendMessage({
        type: 'USER_DATA_UPDATED',
        payload: data,
      });
      
      console.log('[Gami] User data synced:', data);
    } catch (error) {
      console.error('[Gami] Sync error:', error);
    }
  }

  async getUserData() {
    if (this.userData) {
      return this.userData;
    }

    const { userData } = await chrome.storage.local.get('userData');
    return userData || null;
  }
}

// Initialize services
const activityTracker = new ActivityTracker();
const dataSyncManager = new DataSyncManager();

// Start services
activityTracker.startTracking();
dataSyncManager.startSync();

// Message handlers
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'TRACK_ACTIVITY':
      activityTracker.trackEvent(message.payload);
      sendResponse({ success: true });
      break;

    case 'GET_USER_DATA':
      dataSyncManager.getUserData().then(data => {
        sendResponse({ success: true, data });
      });
      return true; // Will respond asynchronously

    case 'SYNC_NOW':
      dataSyncManager.syncUserData().then(() => {
        sendResponse({ success: true });
      });
      return true;

    default:
      sendResponse({ success: false, error: 'Unknown message type' });
  }
});

// Tab navigation tracking
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    activityTracker.trackEvent({
      type: 'page_visit',
      url: tab.url,
      metadata: {
        title: tab.title,
        favIconUrl: tab.favIconUrl,
      },
    });
  }
});

console.log('[Gami] Background service worker initialized');
