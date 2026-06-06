import 'react-native-get-random-values';
import '@walletconnect/react-native-compat';

import { createConfig, WagmiConfig } from 'wagmi';
import { mainnet, base, polygon } from 'wagmi/chains';
import { http } from 'viem';
import React from 'react';
import { DEFAULT_GAMI_CHAIN } from '@/features/gami/chainConfig';

const gamiChain = {
  id: DEFAULT_GAMI_CHAIN.chainId,
  name: DEFAULT_GAMI_CHAIN.name,
  nativeCurrency: DEFAULT_GAMI_CHAIN.nativeCurrency,
  rpcUrls: {
    default: { http: [DEFAULT_GAMI_CHAIN.rpcUrl] },
    public: { http: [DEFAULT_GAMI_CHAIN.rpcUrl] },
  },
  blockExplorers: DEFAULT_GAMI_CHAIN.explorerUrl
    ? {
        default: {
          name: `${DEFAULT_GAMI_CHAIN.name} Explorer`,
          url: DEFAULT_GAMI_CHAIN.explorerUrl,
        },
      }
    : undefined,
};

export const wagmiConfig = createConfig({
  chains: [gamiChain, mainnet, base, polygon],
  transports: {
    [gamiChain.id]: http(gamiChain.rpcUrls.default.http[0]),
    [mainnet.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
  },
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return React.createElement(WagmiConfig, { config: wagmiConfig }, children);
}
