import { SiweMessage } from 'siwe';
import * as SecureStore from 'expo-secure-store';
import { GAMI_API_URL } from './apiClient';
import type { HexAddress } from './types';

const SESSION_TOKEN_KEY = 'gami_session_token';

export type SignMessageFn = (message: string) => Promise<string>;

export async function getSiweNonce(): Promise<string> {
  const response = await fetch(`${GAMI_API_URL}/api/auth/siwe/nonce`);
  if (!response.ok) throw new Error('Failed to fetch SIWE nonce');
  return response.text();
}

export async function verifySiwe(params: {
  address: HexAddress;
  chainId: number;
  domain: string;
  uri: string;
  signMessage: SignMessageFn;
}) {
  const nonce = await getSiweNonce();

  const siweMessage = new SiweMessage({
    domain: params.domain,
    address: params.address,
    statement: 'Sign in to Gami Universal Wallet.',
    uri: params.uri,
    version: '1',
    chainId: params.chainId,
    nonce,
  });

  const message = siweMessage.prepareMessage();
  const signature = await params.signMessage(message);

  const response = await fetch(`${GAMI_API_URL}/api/auth/siwe/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, signature }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`SIWE verification failed: ${text}`);
  }

  const result = await response.json();
  if (result?.token) await SecureStore.setItemAsync(SESSION_TOKEN_KEY, result.token);
  return result;
}

export async function getSessionToken() {
  return SecureStore.getItemAsync(SESSION_TOKEN_KEY);
}

export async function clearSessionToken() {
  await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
}
