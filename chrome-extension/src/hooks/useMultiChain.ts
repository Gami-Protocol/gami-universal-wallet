/**
 * useMultiChain - Hook for multi-chain wallet functionality
 */

import { useState, useEffect, useCallback } from 'react';

// Types
export interface ChainConfig {
  id: string;
  type: 'evm' | 'solana';
  name: string;
  chainId: number | string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  layerZeroEndpointId?: number;
  iconUrl?: string;
}

export interface WalletAccount {
  address: string;
  chainId: string;
  chainType: 'evm' | 'solana';
  balance?: string;
  isActive: boolean;
}

export interface BridgeTransaction {
  id: string;
  sourceChain: string;
  destChain: string;
  sourceToken: string;
  destToken: string;
  amount: string;
  status: 'pending' | 'confirming' | 'completed' | 'failed';
  sourceTxHash?: string;
  destTxHash?: string;
  createdAt: number;
  updatedAt: number;
}

export interface BridgeFee {
  nativeFee: string;
  zroFee: string;
}

export function useMultiChain() {
  const [supportedChains, setSupportedChains] = useState<ChainConfig[]>([]);
  const [activeChain, setActiveChain] = useState<string>('gami');
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load supported chains
  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'GET_SUPPORTED_CHAINS' }, (response) => {
      if (response?.chains) {
        setSupportedChains(response.chains);
      }
    });
  }, []);

  // Connect to a chain
  const connectChain = useCallback(async (chainId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'CONNECT_CHAIN', payload: { chainId } }, (response) => {
        setLoading(false);
        if (response?.success) {
          if (response.account) {
            setAccounts(prev => {
              const existing = prev.findIndex(a => a.chainId === chainId);
              if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = response.account;
                return updated;
              }
              return [...prev, response.account];
            });
          }
          resolve(true);
        } else {
          setError(response?.error || 'Failed to connect');
          resolve(false);
        }
      });
    });
  }, []);

  // Switch active chain
  const switchChain = useCallback(async (chainId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'SWITCH_CHAIN', payload: { chainId } }, (response) => {
        if (response?.success) {
          setActiveChain(chainId);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }, []);

  // Get balance on a specific chain
  const getBalance = useCallback(async (chainId: string, address: string): Promise<string> => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'GET_CHAIN_BALANCE', payload: { chainId, address } }, (response) => {
        resolve(response?.balance || '0');
      });
    });
  }, []);

  // Add custom chain (EVM only)
  const addCustomChain = useCallback(async (config: ChainConfig): Promise<boolean> => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'ADD_CUSTOM_CHAIN', payload: config }, (response) => {
        if (response?.success) {
          setSupportedChains(prev => [...prev, config]);
          resolve(true);
        } else {
          setError(response?.error || 'Failed to add chain');
          resolve(false);
        }
      });
    });
  }, []);

  // Get chain config
  const getChainConfig = useCallback((chainId: string): ChainConfig | undefined => {
    return supportedChains.find(c => c.id === chainId);
  }, [supportedChains]);

  return {
    supportedChains,
    activeChain,
    accounts,
    loading,
    error,
    connectChain,
    switchChain,
    getBalance,
    addCustomChain,
    getChainConfig,
  };
}

/**
 * useBridge - Hook for LayerZero bridge functionality
 */
export function useBridge() {
  const [pendingBridges, setPendingBridges] = useState<BridgeTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load pending bridges
  useEffect(() => {
    const loadBridges = () => {
      chrome.runtime.sendMessage({ type: 'GET_PENDING_BRIDGES' }, (response) => {
        if (response?.bridges) {
          setPendingBridges(response.bridges);
        }
      });
    };

    loadBridges();

    // Listen for bridge updates
    const listener = (message: any) => {
      if (message.type === 'BRIDGE_STATUS_UPDATED' && message.payload) {
        setPendingBridges(prev => {
          const index = prev.findIndex(b => b.id === message.payload.id);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = message.payload;
            return updated;
          }
          return prev;
        });
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  // Estimate bridge fee
  const estimateFee = useCallback(async (
    sourceChain: string,
    destChain: string,
    amount: string
  ): Promise<BridgeFee | null> => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        type: 'ESTIMATE_BRIDGE_FEE',
        payload: { sourceChain, destChain, amount },
      }, (response) => {
        if (response?.error) {
          setError(response.error);
          resolve(null);
        } else {
          resolve(response);
        }
      });
    });
  }, []);

  // Initiate bridge
  const initiateBridge = useCallback(async (params: {
    sourceChain: string;
    destChain: string;
    token: string;
    amount: string;
    toAddress?: string;
  }): Promise<BridgeTransaction | null> => {
    setLoading(true);
    setError(null);

    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        type: 'INITIATE_BRIDGE',
        payload: params,
      }, (response) => {
        setLoading(false);
        if (response?.success && response.bridge) {
          setPendingBridges(prev => [...prev, response.bridge]);
          resolve(response.bridge);
        } else {
          setError(response?.error || 'Bridge failed');
          resolve(null);
        }
      });
    });
  }, []);

  // Get bridge status
  const getBridgeStatus = useCallback(async (bridgeId: string): Promise<BridgeTransaction | null> => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        type: 'GET_BRIDGE_STATUS',
        payload: { bridgeId },
      }, (response) => {
        resolve(response?.bridge || null);
      });
    });
  }, []);

  return {
    pendingBridges,
    loading,
    error,
    estimateFee,
    initiateBridge,
    getBridgeStatus,
  };
}

/**
 * useGamiSDK - Hook for Gami SDK detection and quest integration
 */
export interface DetectedSite {
  url: string;
  origin: string;
  appId?: string;
  features: string[];
  detectedAt: number;
}

export function useGamiSDK() {
  const [detectedSites, setDetectedSites] = useState<DetectedSite[]>([]);
  const [currentSiteDetected, setCurrentSiteDetected] = useState(false);

  // Load detected sites
  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'GET_DETECTED_SITES' }, (response) => {
      if (response?.sites) {
        setDetectedSites(response.sites);
      }
    });

    // Listen for new detections
    const listener = (message: any) => {
      if (message.type === 'GAMI_SDK_DETECTED') {
        setDetectedSites(prev => {
          const existing = prev.findIndex(s => s.origin === message.payload.origin);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = message.payload;
            return updated;
          }
          return [...prev, message.payload];
        });
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  // Check if current tab has Gami SDK
  const checkCurrentTab = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'CHECK_SDK' }, (response) => {
            const detected = response?.detected || false;
            setCurrentSiteDetected(detected);
            resolve(detected);
          });
        } else {
          resolve(false);
        }
      });
    });
  }, []);

  return {
    detectedSites,
    currentSiteDetected,
    checkCurrentTab,
  };
}
