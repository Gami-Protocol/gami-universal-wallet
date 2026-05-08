import { createPublicClient, createWalletClient, http, type Address, type PublicClient, type WalletClient, parseEther, formatEther } from 'viem';
import { privateKeyToAccount, mnemonicToAccount, generatePrivateKey } from 'viem/accounts';
import { GamiChainConfig } from '../types';

// Gami Chain Configuration
export const GAMI_CHAIN_CONFIG: GamiChainConfig = {
  rpcUrl: 'http://localhost:8545',
  chainId: 'gami-1',
  chainName: 'Gami Protocol',
  nativeCurrency: {
    name: 'Gami Token',
    symbol: 'GAMI',
    decimals: 18,
  },
  blockExplorerUrl: 'http://localhost:4000',
};

// Precompile Addresses
export const PRECOMPILE_ADDRESSES = {
  GAMIXP: '0x0000000000000000000000000000000000000800' as const,
  TREASURY: '0x0000000000000000000000000000000000000801' as const,
  AIRDROP: '0x0000000000000000000000000000000000000802' as const,
};

// ABIs for Precompiles
export const GAMIXP_ABI = [
  {
    type: 'function',
    name: 'addXP',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: 'success', type: 'bool' }]
  },
  {
    type: 'function',
    name: 'getLevel',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: 'level', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getTotalXP',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: 'xp', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'event',
    name: 'LevelUp',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'newLevel', type: 'uint256', indexed: false },
      { name: 'totalXP', type: 'uint256', indexed: false }
    ]
  }
] as const;

export const AIRDROP_ABI = [
  {
    type: 'function',
    name: 'checkEligibility',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'eligible', type: 'bool' },
      { name: 'amount', type: 'uint256' },
      { name: 'reason', type: 'string' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'claimAirdrop',
    inputs: [],
    outputs: [{ name: 'success', type: 'bool' }]
  },
  {
    type: 'function',
    name: 'hasClaimedAirdrop',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: 'claimed', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getAirdropAmount',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: 'amount', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'event',
    name: 'AirdropClaimed',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false }
    ]
  }
] as const;

export class BlockchainClient {
  private publicClient: PublicClient;
  private walletClient: WalletClient | null = null;
  private account: any = null;

  constructor(config: { rpcUrl?: string; privateKey?: string; mnemonic?: string } = {}) {
    const rpcUrl = config.rpcUrl || GAMI_CHAIN_CONFIG.rpcUrl;

    // Create public client for read operations
    this.publicClient = createPublicClient({
      transport: http(rpcUrl),
    });

    // Create wallet client if private key or mnemonic provided
    if (config.privateKey) {
      this.account = privateKeyToAccount(config.privateKey as `0x${string}`);
      this.walletClient = createWalletClient({
        account: this.account,
        transport: http(rpcUrl),
      });
    } else if (config.mnemonic) {
      this.account = mnemonicToAccount(config.mnemonic);
      this.walletClient = createWalletClient({
        account: this.account,
        transport: http(rpcUrl),
      });
    }
  }

  // Generate new wallet
  static generateWallet() {
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    return {
      privateKey,
      address: account.address,
    };
  }

  // Create from private key
  static fromPrivateKey(privateKey: string, rpcUrl?: string) {
    return new BlockchainClient({ privateKey, rpcUrl });
  }

  // Create from mnemonic
  static fromMnemonic(mnemonic: string, rpcUrl?: string) {
    return new BlockchainClient({ mnemonic, rpcUrl });
  }

  // Get public client for read operations
  getPublicClient(): PublicClient {
    return this.publicClient;
  }

  // Get wallet client for write operations
  getWalletClient(): WalletClient | null {
    return this.walletClient;
  }

  // Get account address
  getAddress(): Address | null {
    return this.account?.address || null;
  }

  // Get account balance
  async getBalance(address?: Address): Promise<bigint> {
    const addr = address || this.getAddress();
    if (!addr) throw new Error('No address provided');

    const balance = await this.publicClient.getBalance({
      address: addr,
    });

    return balance;
  }

  // Send transaction
  async sendTransaction(to: Address, value: bigint): Promise<string> {
    if (!this.walletClient || !this.account) {
      throw new Error('Wallet client not initialized. Provide private key or mnemonic.');
    }

    const hash = await this.walletClient.sendTransaction({
      account: this.account,
      to,
      value,
    });

    return hash;
  }

  // Read from contract
  async readContract(params: {
    address: Address;
    abi: any;
    functionName: string;
    args?: any[];
  }) {
    return this.publicClient.readContract(params);
  }

  // Write to contract
  async writeContract(params: {
    address: Address;
    abi: any;
    functionName: string;
    args?: any[];
    value?: bigint;
  }) {
    if (!this.walletClient || !this.account) {
      throw new Error('Wallet client not initialized. Provide private key or mnemonic.');
    }

    const { request } = await this.publicClient.simulateContract({
      account: this.account,
      address: params.address,
      abi: params.abi,
      functionName: params.functionName,
      args: params.args,
      value: params.value,
    });

    const hash = await this.walletClient.writeContract(request);
    return hash;
  }

  // Watch for events
  watchContractEvent(params: {
    address: Address;
    abi: any;
    eventName: string;
    onLogs: (logs: any[]) => void;
  }) {
    return this.publicClient.watchContractEvent({
      address: params.address,
      abi: params.abi,
      eventName: params.eventName,
      onLogs: params.onLogs,
    });
  }

  // Get transaction receipt
  async getTransactionReceipt(hash: string) {
    return this.publicClient.getTransactionReceipt({ hash: hash as `0x${string}` });
  }

  // Get block number
  async getBlockNumber(): Promise<bigint> {
    return this.publicClient.getBlockNumber();
  }
}
