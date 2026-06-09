/**
 * Local non-custodial wallet. Generates (or loads) a real secp256k1 key with
 * viem, stores it in the device secure enclave (expo-secure-store), and exposes
 * the address + a signer to the app. This is the wallet the UI shows and signs
 * with; on-chain broadcast is best-effort and only attempted when an RPC is
 * configured.
 */
import 'react-native-get-random-values';
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { generatePrivateKey, privateKeyToAccount, type PrivateKeyAccount } from 'viem/accounts';

const PK_KEY = 'gami_wallet_private_key';

let account: PrivateKeyAccount | null = null;

export interface WalletState {
  address: `0x${string}` | null;
  ready: boolean;
  error: string | null;
  init: () => Promise<void>;
  importKey: (pk: string) => Promise<void>;
}

export const useWallet = create<WalletState>((set) => ({
  address: null,
  ready: false,
  error: null,

  init: async () => {
    try {
      let pk = await SecureStore.getItemAsync(PK_KEY);
      if (!pk) {
        pk = generatePrivateKey();
        await SecureStore.setItemAsync(PK_KEY, pk);
      }
      account = privateKeyToAccount(pk as `0x${string}`);
      set({ address: account.address, ready: true, error: null });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : 'wallet init failed', ready: true });
    }
  },

  importKey: async (pk) => {
    const key = (pk.startsWith('0x') ? pk : `0x${pk}`) as `0x${string}`;
    account = privateKeyToAccount(key);
    await SecureStore.setItemAsync(PK_KEY, key);
    set({ address: account.address, ready: true, error: null });
  },
}));

/** The active signing account (or null before init). */
export function getAccount() {
  return account;
}

export const shortAddress = (a?: string | null) =>
  a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '—';
