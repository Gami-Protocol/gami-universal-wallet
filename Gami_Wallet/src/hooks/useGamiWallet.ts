import { useState, useEffect, useCallback } from 'react';
import { GamiUniversalWallet } from '../../lib/wallet/UniversalWallet';
import { Address } from 'viem';
import * as SecureStore from 'expo-secure-store';

interface WalletStats {
  level: number;
  totalXP: number;
  xpToNextLevel: number;
}

interface WalletAsset {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
}

export function useGamiWallet() {
  const [wallet, setWallet] = useState<GamiUniversalWallet | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [assets, setAssets] = useState<WalletAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load wallet from storage on mount
  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      const privateKey = await SecureStore.getItemAsync('wallet_private_key');
      if (privateKey) {
        const w = GamiUniversalWallet.fromPrivateKey(privateKey);
        setWallet(w);
        setAddress(w.getAddress());
        await refreshWalletData(w);
      }
    } catch (err) {
      console.error('Failed to load wallet:', err);
    }
  };

  const createWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { privateKey } = GamiUniversalWallet.generateWallet();
      await SecureStore.setItemAsync('wallet_private_key', privateKey);
      
      const w = GamiUniversalWallet.fromPrivateKey(privateKey);
      setWallet(w);
      setAddress(w.getAddress());
      await refreshWalletData(w);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const importWallet = async (privateKey: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const w = GamiUniversalWallet.fromPrivateKey(privateKey);
      await SecureStore.setItemAsync('wallet_private_key', privateKey);
      
      setWallet(w);
      setAddress(w.getAddress());
      await refreshWalletData(w);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshWalletData = async (w?: GamiUniversalWallet) => {
    const activeWallet = w || wallet;
    if (!activeWallet) return;

    try {
      setLoading(true);
      
      const [bal, xpStats, assetList] = await Promise.all([
        activeWallet.getBalance(true),
        activeWallet.getXPStats(),
        activeWallet.getAssets(),
      ]);

      setBalance(bal);
      setStats({
        level: Number(xpStats.level),
        totalXP: Number(xpStats.totalXP),
        xpToNextLevel: Number(xpStats.xpToNextLevel),
      });
      setAssets(assetList.map(a => ({
        symbol: a.symbol,
        name: a.name,
        balance: (Number(a.balance) / 1e18).toFixed(4),
        decimals: a.decimals,
      })));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendTokens = async (to: Address, amount: string) => {
    if (!wallet) throw new Error('Wallet not connected');
    
    try {
      setLoading(true);
      setError(null);
      const txHash = await wallet.sendTokens(to, amount);
      await refreshWalletData();
      return txHash;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkAirdropEligibility = async () => {
    if (!wallet) throw new Error('Wallet not connected');
    return wallet.checkAirdropEligibility();
  };

  const claimAirdrop = async () => {
    if (!wallet) throw new Error('Wallet not connected');
    
    try {
      setLoading(true);
      setError(null);
      const result = await wallet.claimAirdrop();
      await refreshWalletData();
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    await SecureStore.deleteItemAsync('wallet_private_key');
    setWallet(null);
    setAddress(null);
    setBalance('0');
    setStats(null);
    setAssets([]);
  };

  return {
    wallet,
    address,
    balance,
    stats,
    assets,
    loading,
    error,
    createWallet,
    importWallet,
    refreshWalletData: () => refreshWalletData(),
    sendTokens,
    checkAirdropEligibility,
    claimAirdrop,
    disconnect,
  };
}
