/**
 * GAMI Protocol Token Configuration for Wallet
 * Direct link to: /Users/marcusmattus/Gami_Protocol/gami-protocol-ico-website (1)/contracts/tokenConfig.ts
 */

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  address?: string;
  icon?: string;
  type: "ERC20" | "SOULBOUND" | "NATIVE";
  description: string;
}

export const GAMI_TOKENS: TokenInfo[] = [
  {
    name: "Gami Protocol",
    symbol: "GAMI",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000000", // Update after deployment
    type: "ERC20",
    description: "LIQUID UTILITY - Protocol currency",
    icon: "💎",
  },
  {
    name: "Gami XP",
    symbol: "XP",
    decimals: 0,
    address: "0x0000000000000000000000000000000000000800", // Precompile address
    type: "SOULBOUND",
    description: "SOULBOUND PROOF-OF-ENGAGEMENT",
    icon: "⚡",
  },
];

export const TOKEN_CONFIG = {
  // Network Configuration
  network: {
    name: "Gami Protocol Chain",
    chainId: 0, // Update with actual chain ID
    rpcUrl: "", // Update with RPC URL
    explorerUrl: "", // Update with explorer URL
  },

  // Links to other repositories
  links: {
    icoWebsite: "/Users/marcusmattus/Gami_Protocol/gami-protocol-ico-website (1)",
    blockchain: "/Users/marcusmattus/Gami_Protocol/gami-protocol-chain",
    contracts: "/Users/marcusmattus/Gami_Protocol/gami-protocol-chain/contracts/src/interfaces",
  },

  // Token Features
  features: {
    GAMI: [
      "Transferable ERC20 token",
      "Tradeable on exchanges",
      "Protocol governance",
      "Staking rewards",
    ],
    XP: [
      "Non-transferable soulbound token",
      "Earned through protocol engagement",
      "Reputation and level system",
      "Unlocks protocol benefits",
    ],
  },

  // Contract ABIs (to be populated after deployment)
  abis: {
    gami: [], // Import from deployed contract
    xpPrecompile: [], // Import from chain
  },
};

export default TOKEN_CONFIG;
