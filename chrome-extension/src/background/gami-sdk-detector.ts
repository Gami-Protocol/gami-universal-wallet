/**
 * Gami SDK Detector - Content Script
 * Detects websites using Gami Protocol SDK for seamless quest/XP integration
 */

// SDK detection patterns
const GAMI_SDK_PATTERNS = {
  // Global variables
  globals: ['window.GamiSDK', 'window.gamiProtocol', 'window.GAMI'],
  // Script sources
  scripts: [
    'gami-sdk',
    'gamiprotocol',
    '@gami/sdk',
    'gami-protocol-sdk',
  ],
  // Meta tags
  metaTags: ['gami-app-id', 'gami-api-key', 'gami-sdk'],
  // Data attributes
  dataAttributes: ['data-gami-app', 'data-gami-quest', 'data-gami-xp'],
};

// Detected SDK info
interface GamiSDKInfo {
  detected: boolean;
  version?: string;
  appId?: string;
  features: string[];
  quests?: QuestInfo[];
}

interface QuestInfo {
  id: string;
  title: string;
  xpReward: number;
  type: string;
  autoTrack?: boolean;
}

// Detection result
let detectionResult: GamiSDKInfo = {
  detected: false,
  features: [],
};

/**
 * Check for Gami SDK presence
 */
function detectGamiSDK(): GamiSDKInfo {
  const result: GamiSDKInfo = {
    detected: false,
    features: [],
    quests: [],
  };

  // Check global variables
  for (const global of GAMI_SDK_PATTERNS.globals) {
    const parts = global.split('.');
    let obj: any = window;
    for (const part of parts.slice(1)) {
      obj = obj?.[part];
    }
    if (obj) {
      result.detected = true;
      result.features.push('global_sdk');
      if (typeof obj.version === 'string') {
        result.version = obj.version;
      }
      if (typeof obj.appId === 'string') {
        result.appId = obj.appId;
      }
      // Check for registered quests
      if (Array.isArray(obj.quests)) {
        result.quests = obj.quests;
        result.features.push('quests');
      }
      break;
    }
  }

  // Check for SDK scripts
  const scripts = document.querySelectorAll('script[src]');
  scripts.forEach((script) => {
    const src = script.getAttribute('src') || '';
    for (const pattern of GAMI_SDK_PATTERNS.scripts) {
      if (src.includes(pattern)) {
        result.detected = true;
        result.features.push('script_loaded');
        break;
      }
    }
  });

  // Check meta tags
  for (const metaName of GAMI_SDK_PATTERNS.metaTags) {
    const meta = document.querySelector(`meta[name="${metaName}"]`);
    if (meta) {
      result.detected = true;
      result.features.push('meta_tag');
      const content = meta.getAttribute('content');
      if (metaName === 'gami-app-id' && content) {
        result.appId = content;
      }
      break;
    }
  }

  // Check data attributes
  for (const attr of GAMI_SDK_PATTERNS.dataAttributes) {
    const elements = document.querySelectorAll(`[${attr}]`);
    if (elements.length > 0) {
      result.detected = true;
      if (attr === 'data-gami-quest') {
        result.features.push('inline_quests');
        // Extract quest data
        elements.forEach((el) => {
          const questData = el.getAttribute(attr);
          if (questData) {
            try {
              const quest = JSON.parse(questData);
              result.quests?.push(quest);
            } catch {
              // Quest ID only
              result.quests?.push({
                id: questData,
                title: 'Unknown Quest',
                xpReward: 0,
                type: 'action',
              });
            }
          }
        });
      }
      if (attr === 'data-gami-xp') {
        result.features.push('xp_tracking');
      }
    }
  }

  return result;
}

/**
 * Watch for dynamic SDK loading
 */
function watchForSDK(): void {
  // Mutation observer for dynamically loaded scripts
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'SCRIPT') {
            const src = (node as HTMLScriptElement).src || '';
            for (const pattern of GAMI_SDK_PATTERNS.scripts) {
              if (src.includes(pattern)) {
                handleSDKDetected();
                break;
              }
            }
          }
        });
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

/**
 * Handle SDK detection
 */
function handleSDKDetected(): void {
  detectionResult = detectGamiSDK();
  
  if (detectionResult.detected) {
    // Notify background script
    chrome.runtime.sendMessage({
      type: 'GAMI_SDK_DETECTED',
      payload: {
        url: window.location.href,
        origin: window.location.origin,
        ...detectionResult,
      },
    });

    // Inject connection bridge
    injectWalletBridge();
  }
}

/**
 * Inject wallet connection bridge for SDK communication
 */
function injectWalletBridge(): void {
  const script = document.createElement('script');
  script.textContent = `
    (function() {
      // Gami Wallet Bridge
      window.__gamiWallet = {
        connected: false,
        address: null,
        
        // Request wallet connection
        connect: function() {
          return new Promise(function(resolve, reject) {
            window.dispatchEvent(new CustomEvent('gami-wallet-connect-request'));
            
            var handler = function(e) {
              window.removeEventListener('gami-wallet-connect-response', handler);
              if (e.detail.success) {
                window.__gamiWallet.connected = true;
                window.__gamiWallet.address = e.detail.address;
                resolve(e.detail);
              } else {
                reject(new Error(e.detail.error || 'Connection failed'));
              }
            };
            
            window.addEventListener('gami-wallet-connect-response', handler);
          });
        },
        
        // Get user XP stats
        getXPStats: function() {
          return new Promise(function(resolve) {
            window.dispatchEvent(new CustomEvent('gami-wallet-xp-request'));
            
            var handler = function(e) {
              window.removeEventListener('gami-wallet-xp-response', handler);
              resolve(e.detail);
            };
            
            window.addEventListener('gami-wallet-xp-response', handler);
          });
        },
        
        // Award XP for quest completion
        awardXP: function(questId, amount) {
          return new Promise(function(resolve, reject) {
            window.dispatchEvent(new CustomEvent('gami-wallet-award-xp', {
              detail: { questId: questId, amount: amount }
            }));
            
            var handler = function(e) {
              window.removeEventListener('gami-wallet-award-xp-response', handler);
              if (e.detail.success) {
                resolve(e.detail);
              } else {
                reject(new Error(e.detail.error || 'XP award failed'));
              }
            };
            
            window.addEventListener('gami-wallet-award-xp-response', handler);
          });
        },
        
        // Track quest progress
        trackQuestProgress: function(questId, step) {
          window.dispatchEvent(new CustomEvent('gami-wallet-quest-progress', {
            detail: { questId: questId, step: step }
          }));
        },
        
        // Complete quest
        completeQuest: function(questId) {
          return new Promise(function(resolve, reject) {
            window.dispatchEvent(new CustomEvent('gami-wallet-complete-quest', {
              detail: { questId: questId }
            }));
            
            var handler = function(e) {
              window.removeEventListener('gami-wallet-complete-quest-response', handler);
              if (e.detail.success) {
                resolve(e.detail);
              } else {
                reject(new Error(e.detail.error || 'Quest completion failed'));
              }
            };
            
            window.addEventListener('gami-wallet-complete-quest-response', handler);
          });
        }
      };
      
      // Announce wallet availability
      window.dispatchEvent(new CustomEvent('gami-wallet-ready'));
      
      // Also set on GamiSDK if present
      if (window.GamiSDK) {
        window.GamiSDK.wallet = window.__gamiWallet;
      }
    })();
  `;
  
  (document.head || document.documentElement).appendChild(script);
  script.remove();
  
  // Listen for events from the injected script
  setupEventListeners();
}

/**
 * Set up event listeners for wallet bridge communication
 */
function setupEventListeners(): void {
  // Wallet connection request
  window.addEventListener('gami-wallet-connect-request', () => {
    chrome.runtime.sendMessage({ type: 'WALLET_CONNECT_REQUEST' }, (response) => {
      window.dispatchEvent(new CustomEvent('gami-wallet-connect-response', {
        detail: response || { success: false, error: 'No response from wallet' },
      }));
    });
  });

  // XP stats request
  window.addEventListener('gami-wallet-xp-request', () => {
    chrome.runtime.sendMessage({ type: 'GET_XP_STATS' }, (response) => {
      window.dispatchEvent(new CustomEvent('gami-wallet-xp-response', {
        detail: response || { level: 0, totalXP: 0, xpToNextLevel: 1000 },
      }));
    });
  });

  // Award XP request
  window.addEventListener('gami-wallet-award-xp', (event: Event) => {
    const customEvent = event as CustomEvent;
    chrome.runtime.sendMessage({
      type: 'AWARD_XP',
      payload: customEvent.detail,
    }, (response) => {
      window.dispatchEvent(new CustomEvent('gami-wallet-award-xp-response', {
        detail: response || { success: false, error: 'Failed to award XP' },
      }));
    });
  });

  // Quest progress
  window.addEventListener('gami-wallet-quest-progress', (event: Event) => {
    const customEvent = event as CustomEvent;
    chrome.runtime.sendMessage({
      type: 'QUEST_PROGRESS',
      payload: customEvent.detail,
    });
  });

  // Quest completion
  window.addEventListener('gami-wallet-complete-quest', (event: Event) => {
    const customEvent = event as CustomEvent;
    chrome.runtime.sendMessage({
      type: 'COMPLETE_QUEST',
      payload: customEvent.detail,
    }, (response) => {
      window.dispatchEvent(new CustomEvent('gami-wallet-complete-quest-response', {
        detail: response || { success: false, error: 'Failed to complete quest' },
      }));
    });
  });
}

/**
 * Listen for messages from background script
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case 'CHECK_SDK':
      const result = detectGamiSDK();
      sendResponse(result);
      break;
      
    case 'WALLET_CONNECTED':
      // Notify the page that wallet is connected
      window.dispatchEvent(new CustomEvent('gami-wallet-connected', {
        detail: message.payload,
      }));
      break;
      
    case 'XP_UPDATED':
      // Notify the page of XP update
      window.dispatchEvent(new CustomEvent('gami-wallet-xp-updated', {
        detail: message.payload,
      }));
      break;
  }
  return true;
});

// =============================================================================
// INITIALIZATION
// =============================================================================

// Run detection on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleSDKDetected);
} else {
  handleSDKDetected();
}

// Also watch for dynamic SDK loading
watchForSDK();

// Periodic re-check (some SPAs load SDK after initial render)
setTimeout(() => {
  if (!detectionResult.detected) {
    handleSDKDetected();
  }
}, 2000);

export {};
