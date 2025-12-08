import { Address } from 'viem';
import { BlockchainClient, PRECOMPILE_ADDRESSES, AIRDROP_ABI, GAMIXP_ABI } from '../blockchain/client';
import { AirdropEligibility, AirdropClaim } from '../types';

export class AirdropValidator {
  private client: BlockchainClient;

  constructor(client: BlockchainClient) {
    this.client = client;
  }

  /**
   * Check if user is eligible for airdrop
   */
  async checkEligibility(userAddress: Address): Promise<AirdropEligibility> {
    try {
      // Get user's XP and level from GamiXP precompile
      const [level, totalXP] = await Promise.all([
        this.client.readContract({
          address: PRECOMPILE_ADDRESSES.GAMIXP,
          abi: GAMIXP_ABI,
          functionName: 'getLevel',
          args: [userAddress],
        }) as Promise<bigint>,
        this.client.readContract({
          address: PRECOMPILE_ADDRESSES.GAMIXP,
          abi: GAMIXP_ABI,
          functionName: 'getTotalXP',
          args: [userAddress],
        }) as Promise<bigint>,
      ]);

      // Check eligibility from Airdrop precompile
      const eligibilityData = await this.client.readContract({
        address: PRECOMPILE_ADDRESSES.AIRDROP,
        abi: AIRDROP_ABI,
        functionName: 'checkEligibility',
        args: [userAddress],
      }) as [boolean, bigint, string];

      const [eligible, amount, reason] = eligibilityData;

      // Define criteria (these should match the smart contract)
      const criteria = {
        minLevel: 5,
        minXP: 5000,
        minAge: 7, // 7 days
        hasCompletedQuests: true,
      };

      // User's current status
      const userMeets = {
        level: Number(level),
        totalXP: Number(totalXP),
        accountAge: 0, // This would need to be fetched from contract or indexed data
        completedQuests: 0, // This would need to be fetched from contract
      };

      return {
        eligible,
        amount,
        reason: eligible ? undefined : reason,
        criteria,
        userMeets,
      };
    } catch (error) {
      console.error('Error checking airdrop eligibility:', error);
      throw new Error(`Failed to check eligibility: ${(error as Error).message}`);
    }
  }

  /**
   * Check if user has already claimed airdrop
   */
  async hasClaimedAirdrop(userAddress: Address): Promise<boolean> {
    try {
      const claimed = await this.client.readContract({
        address: PRECOMPILE_ADDRESSES.AIRDROP,
        abi: AIRDROP_ABI,
        functionName: 'hasClaimedAirdrop',
        args: [userAddress],
      }) as boolean;

      return claimed;
    } catch (error) {
      console.error('Error checking claim status:', error);
      throw new Error(`Failed to check claim status: ${(error as Error).message}`);
    }
  }

  /**
   * Get airdrop amount for user
   */
  async getAirdropAmount(userAddress: Address): Promise<bigint> {
    try {
      const amount = await this.client.readContract({
        address: PRECOMPILE_ADDRESSES.AIRDROP,
        abi: AIRDROP_ABI,
        functionName: 'getAirdropAmount',
        args: [userAddress],
      }) as bigint;

      return amount;
    } catch (error) {
      console.error('Error getting airdrop amount:', error);
      throw new Error(`Failed to get airdrop amount: ${(error as Error).message}`);
    }
  }

  /**
   * Claim airdrop for connected user
   */
  async claimAirdrop(): Promise<AirdropClaim> {
    try {
      const userAddress = this.client.getAddress();
      if (!userAddress) {
        throw new Error('No wallet connected. Cannot claim airdrop.');
      }

      // Check eligibility first
      const eligibility = await this.checkEligibility(userAddress);
      if (!eligibility.eligible) {
        throw new Error(`Not eligible for airdrop: ${eligibility.reason}`);
      }

      // Check if already claimed
      const alreadyClaimed = await this.hasClaimedAirdrop(userAddress);
      if (alreadyClaimed) {
        throw new Error('Airdrop already claimed');
      }

      // Claim the airdrop
      const txHash = await this.client.writeContract({
        address: PRECOMPILE_ADDRESSES.AIRDROP,
        abi: AIRDROP_ABI,
        functionName: 'claimAirdrop',
      });

      // Wait for transaction confirmation
      const receipt = await this.client.getTransactionReceipt(txHash);
      
      if (receipt.status !== 'success') {
        throw new Error('Airdrop claim transaction failed');
      }

      return {
        user: userAddress,
        amount: eligibility.amount,
        claimedAt: Date.now(),
        txHash,
      };
    } catch (error) {
      console.error('Error claiming airdrop:', error);
      throw new Error(`Failed to claim airdrop: ${(error as Error).message}`);
    }
  }

  /**
   * Subscribe to airdrop claim events
   */
  watchAirdropClaims(callback: (claim: AirdropClaim) => void) {
    return this.client.watchContractEvent({
      address: PRECOMPILE_ADDRESSES.AIRDROP,
      abi: AIRDROP_ABI,
      eventName: 'AirdropClaimed',
      onLogs: (logs) => {
        logs.forEach((log: any) => {
          const { user, amount, timestamp } = log.args;
          callback({
            user,
            amount,
            claimedAt: Number(timestamp) * 1000, // Convert to milliseconds
            txHash: log.transactionHash,
          });
        });
      },
    });
  }

  /**
   * Calculate estimated airdrop amount based on XP and level
   * This is a client-side estimation - actual amount comes from contract
   */
  estimateAirdropAmount(level: number, totalXP: number): bigint {
    // Base airdrop amount
    let amount = 1000n * 10n ** 18n; // 1000 GAMI base

    // Bonus for level (100 GAMI per level)
    amount += BigInt(level) * 100n * 10n ** 18n;

    // Bonus for XP (1 GAMI per 100 XP)
    amount += (BigInt(totalXP) / 100n) * 10n ** 18n;

    return amount;
  }

  /**
   * Get detailed eligibility report
   */
  async getEligibilityReport(userAddress: Address): Promise<{
    eligible: boolean;
    amount: string;
    criteria: any;
    userMeets: any;
    missing: string[];
    nextSteps: string[];
  }> {
    const eligibility = await this.checkEligibility(userAddress);
    const alreadyClaimed = await this.hasClaimedAirdrop(userAddress);

    const missing: string[] = [];
    const nextSteps: string[] = [];

    if (alreadyClaimed) {
      return {
        eligible: false,
        amount: '0',
        criteria: eligibility.criteria,
        userMeets: eligibility.userMeets,
        missing: ['Already claimed airdrop'],
        nextSteps: ['Airdrop has already been claimed'],
      };
    }

    if (eligibility.userMeets.level < eligibility.criteria.minLevel) {
      missing.push(`Need level ${eligibility.criteria.minLevel} (current: ${eligibility.userMeets.level})`);
      nextSteps.push('Complete more quests to gain XP and level up');
    }

    if (eligibility.userMeets.totalXP < eligibility.criteria.minXP) {
      missing.push(`Need ${eligibility.criteria.minXP} XP (current: ${eligibility.userMeets.totalXP})`);
      nextSteps.push('Engage with integrated websites to earn more XP');
    }

    if (eligibility.userMeets.accountAge < eligibility.criteria.minAge) {
      missing.push(`Account must be ${eligibility.criteria.minAge} days old (current: ${eligibility.userMeets.accountAge} days)`);
      nextSteps.push('Wait for your account to mature');
    }

    if (!eligibility.eligible && missing.length === 0) {
      missing.push('Unknown eligibility issue');
      nextSteps.push('Contact support for assistance');
    }

    return {
      eligible: eligibility.eligible,
      amount: (Number(eligibility.amount) / 1e18).toFixed(2),
      criteria: eligibility.criteria,
      userMeets: eligibility.userMeets,
      missing,
      nextSteps,
    };
  }
}
