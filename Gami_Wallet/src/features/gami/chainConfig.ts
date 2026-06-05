import type { GamiChain } from './types';

export const GAMI_CHAIN_ID = Number(process.env.EXPO_PUBLIC_GAMI_CHAIN_ID || 7777777);
export const GAMI_RPC_URL = process.env.EXPO_PUBLIC_GAMI_RPC_URL || 'https://rpc.gamiprotocol.xyz';
export const GAMI_CHAIN_REPOSITORY =
  process.env.EXPO_PUBLIC_GAMI_CHAIN_REPOSITORY || 'https://github.com/Gami-Protocol/gami-protocol-chain';
export const GAMI_WORMHOLE_BRIDGE_URL =
  process.env.EXPO_PUBLIC_GAMI_WORMHOLE_BRIDGE_URL || 'https://portalbridge.com';
export const GAMI_AGENTIC_TOOLING_ENDPOINT =
  process.env.EXPO_PUBLIC_GAMI_AGENTIC_TOOLING_ENDPOINT || '/api/agent/tooling';

export const GAMI_CHAINS: Record<string, GamiChain> = {
  gamiL2: {
    chainId: GAMI_CHAIN_ID,
    chainIdHex: `0x${GAMI_CHAIN_ID.toString(16)}`,
    name: 'Gami L2',
    rpcUrl: GAMI_RPC_URL,
    explorerUrl: 'https://explorer.gamiprotocol.xyz',
    nativeCurrency: {
      name: 'GAMI',
      symbol: 'GAMI',
      decimals: 18,
    },
  },
  base: {
    chainId: 8453,
    chainIdHex: '0x2105',
    name: 'Base',
    rpcUrl: process.env.EXPO_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  polygon: {
    chainId: 137,
    chainIdHex: '0x89',
    name: 'Polygon',
    rpcUrl: process.env.EXPO_PUBLIC_POLYGON_RPC_URL || 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'POL',
      symbol: 'POL',
      decimals: 18,
    },
  },
};

export const DEFAULT_GAMI_CHAIN = GAMI_CHAINS.gamiL2;
