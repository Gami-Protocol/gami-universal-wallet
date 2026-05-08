import { GAMI_API_URL } from '../config';

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type === 'GAMI_EVENT') {
    try {
      await fetch(`${GAMI_API_URL}/api/xp/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg.payload),
      });
      sendResponse({ ok: true });
    } catch (e) {
      sendResponse({ ok: false });
    }
  }
});
