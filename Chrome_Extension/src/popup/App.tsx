import React, { useEffect, useState } from 'react';
import { GAMI_API_URL } from '../config';
import { connectWallet } from '../wallet/walletConnect';

export default function App() {
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState('Disconnected');
  const [address, setAddress] = useState<string | null>(null);

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

  async function handleConnect() {
    setStatus('Connecting...');
    try {
      const addr = await connectWallet();
      setAddress(addr);
      setStatus('Connected');
    } catch {
      setStatus('Error');
    }
  }

  return (
    <div style={{ padding: 16, width: 320, fontFamily: 'sans-serif' }}>
      <h2>Gami</h2>

      <button onClick={toggle}>
        {enabled ? 'Disable Tracking' : 'Enable Tracking'}
      </button>

      <hr />

      <button onClick={handleConnect}>Connect Wallet</button>
      <p>Status: {status}</p>
      {address && <p>{address}</p>}

      <hr />

      <button onClick={() => window.open(GAMI_API_URL + '/dashboard')}>
        Open Dashboard
      </button>
    </div>
  );
}
