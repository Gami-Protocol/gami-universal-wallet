chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GAMI_EVENT') {
    fetch('https://api.gamiprotocol.xyz/api/xp/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message.payload),
    });
  }
});
