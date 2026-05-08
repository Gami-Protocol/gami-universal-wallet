/**
 * Gami Protocol - Extension Popup
 */

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await loadUserData();
  setupEventListeners();
});

async function loadUserData() {
  try {
    // Get user data from storage
    const { address, userData } = await chrome.storage.local.get(['address', 'userData']);
    
    if (!address) {
      document.getElementById('userAddress').textContent = 'Not Connected';
      return;
    }

    // Update address
    document.getElementById('userAddress').textContent = 
      `${address.slice(0, 6)}...${address.slice(-4)}`;

    if (userData) {
      updateUI(userData);
    } else {
      // Request fresh data
      chrome.runtime.sendMessage({ type: 'SYNC_NOW' }, (response) => {
        if (response.success) {
          console.log('[Gami Popup] Data synced');
        }
      });
    }
  } catch (error) {
    console.error('[Gami Popup] Error loading data:', error);
  }
}

function updateUI(userData) {
  // Update level and XP
  const level = parseInt(userData.level) || 0;
  const totalXP = parseInt(userData.totalXP) || 0;
  const currentXP = totalXP % 1000; // Simplified XP calculation
  const maxXP = 1000;

  document.getElementById('levelNumber').textContent = level;
  document.getElementById('currentXP').textContent = currentXP.toLocaleString();
  document.getElementById('maxXP').textContent = maxXP.toLocaleString();
  document.getElementById('totalXP').textContent = totalXP.toLocaleString();

  // Update progress ring
  const progressPercentage = (currentXP / maxXP) * 100;
  const progressCircle = document.getElementById('progressCircle');
  const circumference = 377;
  const offset = circumference * (1 - progressPercentage / 100);
  progressCircle.style.strokeDashoffset = offset;

  // Update today's XP (mock for now)
  document.getElementById('todayXP').textContent = '150';
}

function setupEventListeners() {
  // Open full wallet button
  document.getElementById('openWalletBtn').addEventListener('click', () => {
    // TODO: Open mobile app or web wallet
    window.open('http://localhost:8081', '_blank');
  });

  // Sync button
  document.getElementById('syncBtn').addEventListener('click', async () => {
    const btn = document.getElementById('syncBtn');
    btn.textContent = 'Syncing...';
    btn.disabled = true;

    chrome.runtime.sendMessage({ type: 'SYNC_NOW' }, async (response) => {
      if (response.success) {
        await loadUserData();
        btn.textContent = 'Synced!';
        setTimeout(() => {
          btn.textContent = 'Sync Now';
          btn.disabled = false;
        }, 1000);
      }
    });
  });

  // Tracking toggle
  const trackingToggle = document.getElementById('trackingToggle');
  chrome.storage.local.get(['trackingEnabled'], (result) => {
    trackingToggle.checked = result.trackingEnabled !== false;
  });

  trackingToggle.addEventListener('change', (e) => {
    chrome.storage.local.set({ trackingEnabled: e.target.checked });
  });
}

// Listen for data updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'USER_DATA_UPDATED') {
    updateUI(message.payload);
  }
});
