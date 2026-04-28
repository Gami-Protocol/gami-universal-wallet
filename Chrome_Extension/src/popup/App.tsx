import React, { useEffect, useState } from 'react';
import { GAMI_API_URL } from '../config';

export default function App() {
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState('Disconnected');

  useEffect(() => {
    chrome.storage.local.get(['gami_enabled'], (res) => {
      setEnabled(!!res.gami_enabled);
    });
  }, []);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    chrome.storage.local.set({ gami_enabled: next });
  }

  function connectWallet() {
    setStatus('Connecting...');
    // WalletConnect bridge would open here (deep link / modal)
    setTimeout(() => setStatus('Connected'), 1000);
  }

  return (
    <div style={{ padding: 16, width: 320, fontFamily: 'sans-serif' }}>
      <h2>Gami</h2>

      <button onClick={toggle}>
        {enabled ? 'Disable Tracking' : 'Enable Tracking'}
      </button>

      <hr />

      <button onClick={connectWallet}>Connect Wallet</button>
      <p>Status: {status}</p>

      <hr />

      <button onClick={() => window.open(GAMI_API_URL + '/dashboard')}>
        Open Dashboard
      </button>
    </div>
  );
}
