import { BrowserProvider } from 'ethers';
import { GAMI_API_URL } from '../config';
import { getProvider } from '../wallet/walletConnect';

export async function signInWithEthereum(address: string) {
  const provider = getProvider();
  if (!provider) throw new Error('Wallet not connected');

  const nonceRes = await fetch(`${GAMI_API_URL}/api/auth/siwe/nonce`);
  if (!nonceRes.ok) throw new Error('Failed to fetch nonce');
  const nonce = await nonceRes.text();

  const domain = globalThis.location.host || 'chrome-extension';
  const message = `${domain} wants you to sign in with your Ethereum account:\n${address}\n\nSign in to Gami Protocol Extension.\n\nURI: chrome-extension://gami\nVersion: 1\nChain ID: 1\nNonce: ${nonce}`;

  const ethersProvider = new BrowserProvider(provider as any);
  const signer = await ethersProvider.getSigner();
  const signature = await signer.signMessage(message);

  const verifyRes = await fetch(`${GAMI_API_URL}/api/auth/siwe/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, signature }),
  });

  if (!verifyRes.ok) throw new Error('SIWE verification failed');
  const session = await verifyRes.json();

  await chrome.storage.local.set({
    gami_wallet: address,
    gami_session: session,
  });

  return session;
}
