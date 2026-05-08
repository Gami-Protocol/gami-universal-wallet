import * as SecureStore from 'expo-secure-store';
import { createWalletClient, custom } from 'viem';
import { mainnet } from 'viem/chains';

const WALLET_KEY = 'gami_wallet_private_key';

export async function savePrivateKey(pk: string) {
  await SecureStore.setItemAsync(WALLET_KEY, pk);
}

export async function getPrivateKey() {
  return SecureStore.getItemAsync(WALLET_KEY);
}

export async function clearWallet() {
  await SecureStore.deleteItemAsync(WALLET_KEY);
}

export function createInjectedClient() {
  if (!(global as any).ethereum) {
    throw new Error('No injected wallet found');
  }

  return createWalletClient({
    chain: mainnet,
    transport: custom((global as any).ethereum),
  });
}

// WalletConnect placeholder (to integrate with @walletconnect/react-native-dapp or wagmi RN)
export async function connectWalletConnect() {
  // TODO: integrate WalletConnect v2 provider
  throw new Error('WalletConnect not yet implemented');
}
