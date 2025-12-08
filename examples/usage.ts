import { GamiUniversalWallet, formatEther } from '../src';

/**
 * Example 1: Generate a new wallet
 */
async function example1_generateWallet() {
  console.log('\n=== Example 1: Generate New Wallet ===\n');
  
  const { privateKey, address } = GamiUniversalWallet.generateWallet();
  
  console.log('Generated Wallet:');
  console.log('Address:', address);
  console.log('Private Key:', privateKey);
  console.log('\n⚠️  IMPORTANT: Save your private key securely!\n');
}

/**
 * Example 2: Create wallet from private key
 */
async function example2_connectWithPrivateKey() {
  console.log('\n=== Example 2: Connect with Private Key ===\n');
  
  // Replace with your private key
  const privateKey = '0x...';
  const wallet = GamiUniversalWallet.fromPrivateKey(privateKey);
  
  console.log('Connected Address:', wallet.getAddress());
  
  // Get balance
  const balance = await wallet.getBalance();
  console.log('Balance:', balance, 'GAMI');
  
  // Get XP stats
  const stats = await wallet.getXPStats();
  console.log('\nXP Stats:');
  console.log('Level:', stats.level.toString());
  console.log('Total XP:', stats.totalXP.toString());
  console.log('XP to Next Level:', stats.xpToNextLevel.toString());
}

/**
 * Example 3: Check airdrop eligibility
 */
async function example3_checkAirdrop() {
  console.log('\n=== Example 3: Check Airdrop Eligibility ===\n');
  
  const privateKey = '0x...'; // Replace with your key
  const wallet = GamiUniversalWallet.fromPrivateKey(privateKey);
  
  // Get detailed airdrop report
  const report = await wallet.getAirdropReport();
  
  console.log('Eligible:', report.eligible);
  console.log('Amount:', report.amount, 'GAMI');
  
  if (!report.eligible) {
    console.log('\nRequirements not met:');
    report.missing.forEach(m => console.log('  -', m));
    
    console.log('\nNext steps:');
    report.nextSteps.forEach(s => console.log('  -', s));
  }
  
  console.log('\nCriteria:');
  console.log('  Min Level:', report.criteria.minLevel);
  console.log('  Min XP:', report.criteria.minXP);
  console.log('  Min Account Age:', report.criteria.minAge, 'days');
  
  console.log('\nYour Stats:');
  console.log('  Level:', report.userMeets.level);
  console.log('  Total XP:', report.userMeets.totalXP);
  console.log('  Account Age:', report.userMeets.accountAge, 'days');
}

/**
 * Example 4: Claim airdrop
 */
async function example4_claimAirdrop() {
  console.log('\n=== Example 4: Claim Airdrop ===\n');
  
  const privateKey = '0x...'; // Replace with your key
  const wallet = GamiUniversalWallet.fromPrivateKey(privateKey);
  
  try {
    // Check eligibility first
    const report = await wallet.getAirdropReport();
    
    if (!report.eligible) {
      console.log('Not eligible for airdrop');
      return;
    }
    
    console.log('You are eligible for', report.amount, 'GAMI!');
    console.log('Claiming airdrop...');
    
    // Claim the airdrop
    const claim = await wallet.claimAirdrop();
    
    console.log('\n✅ Airdrop claimed successfully!');
    console.log('Amount:', formatEther(claim.amount), 'GAMI');
    console.log('Transaction:', claim.txHash);
    console.log('Claimed at:', new Date(claim.claimedAt).toLocaleString());
    
  } catch (error) {
    console.error('Error claiming airdrop:', (error as Error).message);
  }
}

// Run examples
async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Gami Universal Wallet - Examples    ║');
  console.log('╚════════════════════════════════════════╝');
  
  try {
    // Uncomment the example you want to run
    await example1_generateWallet();
    // await example2_connectWithPrivateKey();
    // await example3_checkAirdrop();
    // await example4_claimAirdrop();
    
    console.log('\n✅ Example completed successfully!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', (error as Error).message);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
