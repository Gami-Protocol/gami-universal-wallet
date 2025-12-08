import { Address, formatEther, parseEther } from 'viem';
import { BlockchainClient, PRECOMPILE_ADDRESSES, GAMIXP_ABI } from '../blockchain/client';
import { AirdropValidator } from '../airdrop/validator';
import { WalletState, UserStats, Asset, Transaction } from '../types';

export class GamiUniversalWallet {
  private client: BlockchainClient;
  private airdropValidator: AirdropValidator;
  private state: WalletState;

  constructor(config?: { privateKey?: string; mnemonic?: string; rpcUrl?: string }) {
    this.client = new BlockchainClient(config);
    this.airdropValidator = new AirdropValidator(this.client);
    this.state = {
      address: this.client.getAddress(),
      connected: !!this.client.getAddress(),
      balance: 0n,
      assets: [],
      transactions: [],
      stats: null,
    };
  }

  // ============================================
  // WALLET CREATION & CONNECTION
  // ============================================

  /**
   * Generate a new wallet
   */
  static generateWallet(): { privateKey: string; address: string } {
    return BlockchainClient.generateWallet();
  }

  /**
   * Create wallet from private key
   */
  static fromPrivateKey(privateKey: string, rpcUrl?: string): GamiUniversalWallet {
    return new GamiUniversalWallet({ privateKey, rpcUrl });
  }

  /**
   * Create wallet from mnemonic
   */
  static fromMnemonic(mnemonic: string, rpcUrl?: string): GamiUniversalWallet {
    return new GamiUniversalWallet({ mnemonic, rpcUrl });
  }

  /**
   * Get wallet address
   */
  getAddress(): Address | null {
    return this.state.address;
  }

  /**
   * Check if wallet is connected
   */
  isConnected(): boolean {
    return this.state.connected;
  }

  // ============================================
  // BALANCE & ASSETS
  // ============================================

  /**
   * Get native token balance
   */
  async getBalance(refresh = false): Promise<string> {
    if (!this.state.address) {
      throw new Error('Wallet not connected');
    }

    if (refresh || this.state.balance === 0n) {
      this.state.balance = await this.client.getBalance(this.state.address);
    }

    return formatEther(this.state.balance);
  }

  /**
   * Get balance in wei
   */
  async getBalanceWei(): Promise<bigint> {
    if (!this.state.address) {
      throw new Error('Wallet not connected');
    }

    this.state.balance = await this.client.getBalance(this.state.address);
    return this.state.balance;
  }

  /**
   * Send native tokens
   */
  async sendTokens(to: Address, amount: string): Promise<string> {
    if (!this.state.address) {
      throw new Error('Wallet not connected');
    }

    const value = parseEther(amount);
    const txHash = await this.client.sendTransaction(to, value);

    // Add to transactions
    this.state.transactions.unshift({
      hash: txHash,
      from: this.state.address,
      to,
      value,
      timestamp: Date.now(),
      status: 'pending',
    });

    return txHash;
  }

  /**
   * Get all assets (for now just native token, can be extended)
   */
  async getAssets(): Promise<Asset[]> {
    const balance = await this.getBalanceWei();
    
    this.state.assets = [
      {
        symbol: 'GAMI',
        name: 'Gami Token',
        balance,
        decimals: 18,
      },
    ];

    return this.state.assets;
  }

  // ============================================
  // XP & LEVELING SYSTEM
  // ============================================

  /**
   * Get user XP stats
   */
  async getXPStats(): Promise<UserStats> {
    if (!this.state.address) {
      throw new Error('Wallet not connected');
    }

    const [level, totalXP] = await Promise.all([
      this.client.readContract({
        address: PRECOMPILE_ADDRESSES.GAMIXP,
        abi: GAMIXP_ABI,
        functionName: 'getLevel',
        args: [this.state.address],
      }) as Promise<bigint>,
      this.client.readContract({
        address: PRECOMPILE_ADDRESSES.GAMIXP,
        abi: GAMIXP_ABI,
        functionName: 'getTotalXP',
        args: [this.state.address],
      }) as Promise<bigint>,
    ]);

    const nextLevelXP = this.calculateXPForLevel(level + 1n);
    const xpToNextLevel = nextLevelXP - totalXP;

    this.state.stats = {
      level,
      totalXP,
      xpToNextLevel,
    };

    return this.state.stats;
  }

  /**
   * Calculate XP required for a specific level
   */
  private calculateXPForLevel(level: bigint): bigint {
    if (level <= 1n) return 0n;
    return 1000n * (2n ** (level - 1n) - 1n);
  }

  /**
   * Add XP to user (admin function)
   */
  async addXP(amount: bigint): Promise<string> {
    if (!this.state.address) {
      throw new Error('Wallet not connected');
    }

    const txHash = await this.client.writeContract({
      address: PRECOMPILE_ADDRESSES.GAMIXP,
      abi: GAMIXP_ABI,
      functionName: 'addXP',
      args: [this.state.address, amount],
    });

    return txHash;
  }

  /**
   * Subscribe to level up events
   */
  subscribeToLevelUps(callback: (user: Address, newLevel: bigint, totalXP: bigint) => void) {
    return this.client.watchContractEvent({
      address: PRECOMPILE_ADDRESSES.GAMIXP,
      abi: GAMIXP_ABI,
      eventName: 'LevelUp',
      onLogs: (logs) => {
        logs.forEach((log: any) => {
          const { user, newLevel, totalXP } = log.args;
          callback(user, newLevel, totalXP);
        });
      },
    });
  }

  // ============================================
  // AIRDROP FUNCTIONALITY
  // ============================================

  /**
   * Check airdrop eligibility
   */
  async checkAirdropEligibility() {
    if (!this.state.address) {
      throw new Error('Wallet not connected');
    }

    return this.airdropValidator.checkEligibility(this.state.address);
  }

  /**
   * Get detailed airdrop eligibility report
   */
  async getAirdropReport() {
    if (!this.state.address) {
      throw new Error('Wallet not connected');
    }

    return this.airdropValidator.getEligibilityReport(this.state.address);
  }

  /**
   * Check if airdrop has been claimed
   */
  async hasClaimedAirdrop(): Promise<boolean> {
    if (!this.state.address) {
      throw new Error('Wallet not connected');
    }

    return this.airdropValidator.hasClaimedAirdrop(this.state.address);
  }

  /**
   * Claim airdrop
   */
  async claimAirdrop() {
    if (!this.state.address) {
      throw new Error('Wallet not connected');
    }

    return this.airdropValidator.claimAirdrop();
  }

  /**
   * Get estimated airdrop amount
   */
  async getEstimatedAirdropAmount(): Promise<string> {
    const stats = await this.getXPStats();
    const amount = this.airdropValidator.estimateAirdropAmount(
      Number(stats.level),
      Number(stats.totalXP)
    );
    return formatEther(amount);
  }

  /**
   * Subscribe to airdrop claim events
   */
  watchAirdropClaims(callback: (claim: any) => void) {
    return this.airdropValidator.watchAirdropClaims(callback);
  }

  // ============================================
  // TRANSACTIONS
  // ============================================

  /**
   * Get transaction history
   */
  getTransactions(): Transaction[] {
    return this.state.transactions;
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(txHash: string) {
    return this.client.getTransactionReceipt(txHash);
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(txHash: string): Promise<void> {
    const receipt = await this.client.getTransactionReceipt(txHash);
    
    // Update transaction status in state
    const tx = this.state.transactions.find(t => t.hash === txHash);
    if (tx) {
      tx.status = receipt.status === 'success' ? 'confirmed' : 'failed';
    }
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Get current block number
   */
  async getBlockNumber(): Promise<bigint> {
    return this.client.getBlockNumber();
  }

  /**
   * Get wallet state
   */
  getState(): WalletState {
    return { ...this.state };
  }

  /**
   * Refresh all wallet data
   */
  async refresh(): Promise<void> {
    if (!this.state.address) return;

    await Promise.all([
      this.getBalance(true),
      this.getXPStats(),
      this.getAssets(),
    ]);
  }

  /**
   * Export wallet info (excluding private key)
   */
  exportInfo() {
    return {
      address: this.state.address,
      balance: formatEther(this.state.balance),
      stats: this.state.stats ? {
        level: Number(this.state.stats.level),
        totalXP: Number(this.state.stats.totalXP),
        xpToNextLevel: Number(this.state.stats.xpToNextLevel),
      } : null,
      assets: this.state.assets.map(a => ({
        ...a,
        balance: formatEther(a.balance),
      })),
      transactions: this.state.transactions.map(tx => ({
        ...tx,
        value: formatEther(tx.value),
      })),
    };
  }
}
