/**
 * Gami Protocol - Content Script
 * Injects POP notifications and tracks user interactions
 */

// Neobrultis Theme (subset for extension)
const THEME = {
  colors: {
    background: '#0A0A0A',
    backgroundSecondary: '#121212',
    textPrimary: '#FFFFFF',
    textSecondary: '#B8B8B8',
    accentXP: '#00FF94',
    accentPoints: '#00D1FF',
    border: '#2A2A2A',
  },
  shadows: {
    glow: '0 0 20px rgba(0, 255, 148, 0.6)',
  },
};

// POP Notification Manager
class POPNotificationManager {
  constructor() {
    this.activePopups = [];
    this.popQueue = [];
    this.maxConcurrentPops = 3;
    this.injectStyles();
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .gami-pop-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        pointer-events: none;
      }

      .gami-pop {
        background: ${THEME.colors.backgroundSecondary};
        border: 1px solid ${THEME.colors.border};
        border-radius: 4px;
        padding: 16px 20px;
        min-width: 280px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.9), ${THEME.shadows.glow};
        pointer-events: all;
        cursor: pointer;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: 'Courier New', monospace;
      }

      .gami-pop.visible {
        transform: translateX(0);
        opacity: 1;
      }

      .gami-pop:hover {
        border-color: ${THEME.colors.accentXP};
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.9), ${THEME.shadows.glow};
      }

      .gami-pop-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      .gami-pop-title {
        color: ${THEME.colors.accentXP};
        font-size: 10px;
        font-weight: bold;
        letter-spacing: 2px;
        text-transform: uppercase;
      }

      .gami-pop-close {
        color: ${THEME.colors.textSecondary};
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .gami-pop-close:hover {
        color: ${THEME.colors.textPrimary};
      }

      .gami-pop-content {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .gami-pop-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #00FF94 0%, #00D1FF 100%);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        color: ${THEME.colors.background};
      }

      .gami-pop-details {
        flex: 1;
      }

      .gami-pop-message {
        color: ${THEME.colors.textPrimary};
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .gami-pop-reward {
        color: ${THEME.colors.textSecondary};
        font-size: 12px;
      }

      .gami-pop-reward-value {
        color: ${THEME.colors.accentXP};
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);
  }

  show(reward) {
    if (this.activePopups.length >= this.maxConcurrentPops) {
      this.popQueue.push(reward);
      return;
    }

    this.createPOP(reward);
  }

  createPOP(reward) {
    // Create container if it doesn't exist
    let container = document.querySelector('.gami-pop-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'gami-pop-container';
      document.body.appendChild(container);
    }

    // Create POP element
    const pop = document.createElement('div');
    pop.className = 'gami-pop';
    pop.innerHTML = `
      <div class="gami-pop-header">
        <div class="gami-pop-title">GAMI PROTOCOL</div>
        <button class="gami-pop-close">×</button>
      </div>
      <div class="gami-pop-content">
        <div class="gami-pop-icon">+${reward.xp}</div>
        <div class="gami-pop-details">
          <div class="gami-pop-message">${reward.message}</div>
          <div class="gami-pop-reward">
            <span class="gami-pop-reward-value">+${reward.xp} XP</span>
            ${reward.points ? ` · <span class="gami-pop-reward-value">+${reward.points} POINTS</span>` : ''}
          </div>
        </div>
      </div>
    `;

    container.appendChild(pop);
    this.activePopups.push(pop);

    // Animate in
    requestAnimationFrame(() => {
      pop.classList.add('visible');
    });

    // Handle close button
    const closeBtn = pop.querySelector('.gami-pop-close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.removePOP(pop);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
      this.removePOP(pop);
    }, 5000);

    // Click to view details
    pop.addEventListener('click', () => {
      console.log('[Gami] POP clicked:', reward);
      // TODO: Open wallet or details view
      this.removePOP(pop);
    });
  }

  removePOP(pop) {
    pop.classList.remove('visible');
    
    setTimeout(() => {
      pop.remove();
      const index = this.activePopups.indexOf(pop);
      if (index > -1) {
        this.activePopups.splice(index, 1);
      }

      // Show next in queue
      if (this.popQueue.length > 0) {
        const next = this.popQueue.shift();
        this.show(next);
      }
    }, 300);
  }
}

// Activity Tracker
class ActivityTracker {
  constructor() {
    this.trackedEvents = new Set();
    this.setupListeners();
  }

  setupListeners() {
    // Track clicks
    document.addEventListener('click', (e) => {
      this.trackActivity({
        type: 'click',
        url: window.location.href,
        metadata: {
          target: e.target.tagName,
          x: e.clientX,
          y: e.clientY,
        },
      });
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    document.addEventListener('scroll', () => {
      const scrollDepth = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollDepth > maxScrollDepth && scrollDepth > 25) {
        maxScrollDepth = scrollDepth;
        this.trackActivity({
          type: 'scroll',
          url: window.location.href,
          metadata: {
            depth: Math.floor(scrollDepth),
          },
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      this.trackActivity({
        type: 'form_submit',
        url: window.location.href,
        metadata: {
          formId: e.target.id,
          formName: e.target.name,
        },
      });
    });
  }

  trackActivity(activity) {
    // Debounce similar events
    const key = `${activity.type}_${activity.url}`;
    if (this.trackedEvents.has(key)) return;

    this.trackedEvents.add(key);
    setTimeout(() => this.trackedEvents.delete(key), 5000);

    // Send to background
    chrome.runtime.sendMessage({
      type: 'TRACK_ACTIVITY',
      payload: activity,
    });
  }
}

// Initialize
const popManager = new POPNotificationManager();
const activityTracker = new ActivityTracker();

// Listen for messages from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SHOW_POP') {
    popManager.show(message.payload);
    sendResponse({ success: true });
  }
});

console.log('[Gami] Content script initialized on:', window.location.href);
