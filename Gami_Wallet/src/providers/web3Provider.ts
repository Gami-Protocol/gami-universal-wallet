import 'react-native-get-random-values';
import '@walletconnect/react-native-compat';

import { createConfig, WagmiConfig } from 'wagmi';
import { mainnet, base, polygon } from 'wagmi/chains';
import { http } from 'viem';
import React from 'react';

export const wagmiConfig = createConfig({
  chains: [mainnet, base, polygon],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
  },
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
