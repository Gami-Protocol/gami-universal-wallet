/**
 * Local transaction history. Seeded with demo activity; Send/Swap append real
 * entries here so the Wallet screen reflects what the user just did. Persisted
 * to AsyncStorage.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockTransactions, type MockTx } from '@/features/gami/mockData';

export interface TxState {
  txs: MockTx[];
  addTx: (tx: Omit<MockTx, 'id' | 'when'>) => void;
}

export const useTxStore = create<TxState>()(
  persist(
    (set) => ({
      txs: mockTransactions,
      addTx: (tx) =>
        set((s) => ({
          txs: [{ ...tx, id: `tx-${Date.now()}`, when: 'Just now' }, ...s.txs],
        })),
    }),
    {
      name: 'gami-txs',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
