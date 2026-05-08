// Gami Protocol Extension - Background Service Worker

import {
  blockchainProvider,
  type BridgeTransaction,
  type ChainConfig,
} from './blockchain-provider';

const API_BASE = 'http://localhost:8000';

// Alarm names
const DAILY_CHECKIN_ALARM = 'daily-checkin-reminder';
const SYNC_ALARM = 'sync-data';
const BRIDGE_MONITOR_ALARM = 'bridge-monitor';

// Track detected Gami SDK sites
interface DetectedSite {
  url: string;
  origin: string;
  appId?: string;
  features: string[];
  detectedAt: number;
}

const detectedSites: Map<string, DetectedSite> = new Map();

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('[Gami Extension] Installed');
  
  // Set up alarms
  chrome.alarms.create(DAILY_CHECKIN_ALARM, {
    delayInMinutes: 60,
    periodInMinutes: 60 * 24, // Daily
  });
  
  chrome.alarms.create(SYNC_ALARM, {
    delayInMinutes: 5,
    periodInMinutes: 15, // Every 15 minutes
  });

  chrome.alarms.create(BRIDGE_MONITOR_ALARM, {
    delayInMinutes: 1,
    periodInMinutes: 1, // Check bridge status every minute
  });

  // Initialize multi-chain connections
  initializeBlockchainConnections();
});

// Handle alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === DAILY_CHECKIN_ALARM) {
    checkDailyReminder();
  } else if (alarm.name === SYNC_ALARM) {
    syncUserData();
  } else if (alarm.name === BRIDGE_MONITOR_ALARM) {
    monitorPendingBridges();
  }
});

// Initialize blockchain connections
async function initializeBlockchainConnections(): Promise<void> {
  try {
    // Connect to Gami chain by default
    await blockchainProvider.connectChain('gami');
    console.log('[Gami Extension] Connected to Gami chain');

    // Load saved chain connections
    const { connectedChains } = await chrome.storage.local.get('connectedChains');
    if (connectedChains && Array.isArray(connectedChains)) {
      for (const chainId of connectedChains) {
        try {
          await blockchainProvider.connectChain(chainId);
          console.log(`[Gami Extension] Connected to ${chainId}`);
        } catch (err) {
          console.warn(`[Gami Extension] Failed to connect to ${chainId}:`, err);
        }
      }
    }
  } catch (error) {
    console.error('[Gami Extension] Blockchain init error:', error);
  }
}

// Monitor pending bridge transactions
async function monitorPendingBridges(): Promise<void> {
  const pendingBridges = blockchainProvider.getPendingBridges();
  
  for (const bridge of pendingBridges) {
    try {
      // Check bridge status via LayerZero or chain-specific methods
      const status = await checkBridgeStatus(bridge);
      
      if (status !== bridge.status) {
        blockchainProvider.updateBridgeStatus(bridge.id, status);
        
        // Notify popup of bridge update
        chrome.runtime.sendMessage({
          type: 'BRIDGE_STATUS_UPDATED',
          payload: blockchainProvider.getBridgeStatus(bridge.id),
        }).catch(() => {});

        // Show notification on completion
        if (status === 'completed') {
          chrome.notifications.create(`bridge-${bridge.id}`, {
            type: 'basic',
            iconUrl: 'icons/icon-128.png',
            title: 'Bridge Complete',
            message: `Successfully bridged ${bridge.amount} ${bridge.sourceToken} from ${bridge.sourceChain} to ${bridge.destChain}`,
          });
        }
      }
    } catch (err) {
      console.error(`[Gami Extension] Bridge monitor error:`, err);
    }
  }
}

// Check individual bridge status
async function checkBridgeStatus(bridge: BridgeTransaction): Promise<BridgeTransaction['status']> {
  // In production, query LayerZero message status or chain explorers
  // For now, simulate status progression
  const elapsed = Date.now() - bridge.createdAt;
  
  if (elapsed > 120000) return 'completed';
  if (elapsed > 30000) return 'confirming';
  return 'pending';
}

// Check if user needs daily check-in reminder
async function checkDailyReminder(): Promise<void> {
  const { address, userData } = await chrome.storage.local.get(['address', 'userData']);
  
  if (!address) return;
  
  // Check if user has checked in today
  const lastCheckin = userData?.lastCheckin;
  const today = new Date().toDateString();
  
  if (lastCheckin !== today) {
    chrome.notifications.create('daily-checkin', {
      type: 'basic',
      iconUrl: 'icons/icon-128.png',
      title: 'Gami Wallet',
      message: "Don't forget your daily check-in! Keep your streak going 🔥",
      priority: 1,
    });
  }
}

// Sync user data from backend
async function syncUserData(): Promise<{ success: boolean }> {
  try {
    const { address } = await chrome.storage.local.get('address');
    
    if (!address) {
      return { success: false };
    }

    const response = await fetch(`${API_BASE}/api/chain/users/${address}/stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    const userData = {
      level: parseInt(data.level) || 0,
      totalXP: parseInt(data.totalXP) || 0,
      xpToNextLevel: parseInt(data.xpToNextLevel) || 1000,
      lastSync: new Date().toISOString(),
    };

    await chrome.storage.local.set({ userData });
    
    // Notify popup of update
    chrome.runtime.sendMessage({
      type: 'USER_DATA_UPDATED',
      payload: userData,
    }).catch(() => {
      // Popup might not be open, that's fine
    });

    // Update badge
    updateBadge(userData.level);

    return { success: true };
  } catch (error) {
    console.error('[Gami Extension] Sync error:', error);
    return { success: false };
  }
}

// Update extension badge
function updateBadge(level: number): void {
  chrome.action.setBadgeText({ text: `L${level}` });
  chrome.action.setBadgeBackgroundColor({ color: '#6E3CFB' });
}

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SYNC_NOW') {
    syncUserData().then(sendResponse);
    return true; // Keep channel open for async response
  }
  
  if (message.type === 'GET_USER_DATA') {
    chrome.storage.local.get(['userData']).then((result) => {
      sendResponse(result.userData || null);
    });
    return true;
  }

  // ==========================================================================
  // GAMI SDK DETECTION HANDLERS
  // ==========================================================================

  if (message.type === 'GAMI_SDK_DETECTED') {
    const { url, origin, appId, features } = message.payload;
    detectedSites.set(origin, {
      url,
      origin,
      appId,
      features,
      detectedAt: Date.now(),
    });
    
    console.log(`[Gami Extension] Gami SDK detected at ${origin}`, features);
    
    // Update badge to show SDK detection
    if (sender.tab?.id) {
      chrome.action.setBadgeText({ text: '✓', tabId: sender.tab.id });
      chrome.action.setBadgeBackgroundColor({ color: '#10B981', tabId: sender.tab.id });
    }
    
    sendResponse({ acknowledged: true });
    return true;
  }

  if (message.type === 'WALLET_CONNECT_REQUEST') {
    handleWalletConnectRequest().then(sendResponse);
    return true;
  }

  if (message.type === 'GET_XP_STATS') {
    getXPStats().then(sendResponse);
    return true;
  }

  if (message.type === 'AWARD_XP') {
    awardXP(message.payload).then(sendResponse);
    return true;
  }

  if (message.type === 'QUEST_PROGRESS') {
    trackQuestProgress(message.payload);
    sendResponse({ success: true });
    return true;
  }

  if (message.type === 'COMPLETE_QUEST') {
    completeQuest(message.payload).then(sendResponse);
    return true;
  }

  // ==========================================================================
  // MULTI-CHAIN HANDLERS
  // ==========================================================================

  if (message.type === 'GET_SUPPORTED_CHAINS') {
    sendResponse({ chains: blockchainProvider.getSupportedChains() });
    return true;
  }

  if (message.type === 'CONNECT_CHAIN') {
    handleConnectChain(message.payload.chainId).then(sendResponse);
    return true;
  }

  if (message.type === 'SWITCH_CHAIN') {
    const success = blockchainProvider.switchChain(message.payload.chainId);
    sendResponse({ success });
    return true;
  }

  if (message.type === 'GET_CHAIN_BALANCE') {
    blockchainProvider.getBalance(
      message.payload.chainId,
      message.payload.address
    ).then((balance) => sendResponse({ balance }));
    return true;
  }

  if (message.type === 'ADD_CUSTOM_CHAIN') {
    try {
      blockchainProvider.addCustomChain(message.payload as ChainConfig);
      saveConnectedChains();
      sendResponse({ success: true });
    } catch (err) {
      sendResponse({ success: false, error: String(err) });
    }
    return true;
  }

  // ==========================================================================
  // BRIDGE HANDLERS
  // ==========================================================================

  if (message.type === 'ESTIMATE_BRIDGE_FEE') {
    blockchainProvider.estimateBridgeFee(
      message.payload.sourceChain,
      message.payload.destChain,
      message.payload.amount
    ).then(sendResponse).catch((err) => sendResponse({ error: String(err) }));
    return true;
  }

  if (message.type === 'INITIATE_BRIDGE') {
    handleInitiateBridge(message.payload).then(sendResponse);
    return true;
  }

  if (message.type === 'GET_PENDING_BRIDGES') {
    sendResponse({ bridges: blockchainProvider.getPendingBridges() });
    return true;
  }

  if (message.type === 'GET_BRIDGE_STATUS') {
    sendResponse({ bridge: blockchainProvider.getBridgeStatus(message.payload.bridgeId) });
    return true;
  }

  if (message.type === 'GET_DETECTED_SITES') {
    sendResponse({ sites: Array.from(detectedSites.values()) });
    return true;
  }
});

// ==========================================================================
// WALLET & XP HANDLERS
// ==========================================================================

async function handleWalletConnectRequest(): Promise<{ success: boolean; address?: string; error?: string }> {
  try {
    const { address } = await chrome.storage.local.get('address');
    if (address) {
      return { success: true, address };
    }
    return { success: false, error: 'Wallet not connected' };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

async function getXPStats(): Promise<{ level: number; totalXP: number; xpToNextLevel: number }> {
  const { userData } = await chrome.storage.local.get('userData');
  return {
    level: userData?.level || 0,
    totalXP: userData?.totalXP || 0,
    xpToNextLevel: userData?.xpToNextLevel || 1000,
  };
}

async function awardXP(payload: { questId: string; amount: number }): Promise<{ success: boolean; newTotalXP?: number; error?: string }> {
  try {
    const { address } = await chrome.storage.local.get('address');
    if (!address) {
      return { success: false, error: 'Wallet not connected' };
    }

    const response = await fetch(`${API_BASE}/api/quests/${payload.questId}/award-xp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, amount: payload.amount }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    // Update local storage
    const { userData } = await chrome.storage.local.get('userData');
    const newUserData = {
      ...userData,
      totalXP: data.newTotalXP,
      level: data.newLevel || userData?.level,
    };
    await chrome.storage.local.set({ userData: newUserData });

    return { success: true, newTotalXP: data.newTotalXP };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

function trackQuestProgress(payload: { questId: string; step: number }): void {
  // Store quest progress locally and sync when possible
  chrome.storage.local.get('questProgress').then(({ questProgress = {} }) => {
    questProgress[payload.questId] = {
      step: payload.step,
      updatedAt: Date.now(),
    };
    chrome.storage.local.set({ questProgress });
  });
}

async function completeQuest(payload: { questId: string }): Promise<{ success: boolean; xpAwarded?: number; error?: string }> {
  try {
    const { address } = await chrome.storage.local.get('address');
    if (!address) {
      return { success: false, error: 'Wallet not connected' };
    }

    const response = await fetch(`${API_BASE}/api/quests/${payload.questId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    // Sync user data after quest completion
    await syncUserData();

    return { success: true, xpAwarded: data.xpAwarded };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ==========================================================================
// CHAIN CONNECTION HANDLERS
// ==========================================================================

async function handleConnectChain(chainId: string): Promise<{ success: boolean; account?: any; error?: string }> {
  try {
    const account = await blockchainProvider.connectChain(chainId);
    await saveConnectedChains();
    return { success: true, account };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

async function saveConnectedChains(): Promise<void> {
  const state = blockchainProvider.getState();
  const chainIds = state.accounts.map(a => a.chainId);
  await chrome.storage.local.set({ connectedChains: chainIds });
}

async function handleInitiateBridge(payload: {
  sourceChain: string;
  destChain: string;
  token: string;
  amount: string;
  toAddress?: string;
}): Promise<{ success: boolean; bridge?: BridgeTransaction; error?: string }> {
  try {
    const { address } = await chrome.storage.local.get('address');
    if (!address) {
      return { success: false, error: 'Wallet not connected' };
    }

    const bridge = await blockchainProvider.initiateBridge(
      payload.sourceChain,
      payload.destChain,
      payload.token,
      payload.amount,
      address,
      payload.toAddress || address
    );

    return { success: true, bridge };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.address) {
    if (changes.address.newValue) {
      // New address connected, sync immediately
      syncUserData();
    } else {
      // Address removed, clear badge
      chrome.action.setBadgeText({ text: '' });
    }
  }
});

export {};
