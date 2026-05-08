# Gami Universal Wallet

> Complete wallet solution with blockchain connection and airdrop validation for Gami Protocol

---

## 🎯 Features

### ✅ Core Wallet Functions
- **Wallet Generation**: Create new wallets with private key
- **Multi-format Support**: Connect via private key or mnemonic
- **Balance Management**: Check and send GAMI tokens
- **Transaction History**: Track all wallet transactions
- **Asset Management**: View all wallet assets

### 🎮 XP & Leveling System
- **XP Tracking**: Real-time XP and level monitoring
- **Level-Up Events**: Subscribe to level-up notifications
- **Progress Calculation**: XP to next level tracking
- **Stats Export**: Complete user statistics

### 💰 Airdrop Validation System
- **Eligibility Checking**: Comprehensive airdrop eligibility validation
- **Requirements Tracking**: Track missing requirements
- **Claim Management**: One-click airdrop claiming
- **Event Monitoring**: Watch all airdrop claims in real-time

### 🔗 Blockchain Integration
- **EVM Compatible**: Works with Gami Chain (Cosmos + EVM)
- **Precompile Support**: Direct access to native modules
- **Low Gas Costs**: ~90% gas savings vs standard EVM
- **Real-time Events**: Subscribe to on-chain events

---

## 📦 Installation

```bash
npm install @gami/universal-wallet
```

or

```bash
yarn add @gami/universal-wallet
```

---

## 🚀 Quick Start

### 1. Generate a New Wallet

```typescript
import { GamiUniversalWallet } from '@gami/universal-wallet';

// Generate new wallet
const { privateKey, address } = GamiUniversalWallet.generateWallet();

console.log('Address:', address);
console.log('Private Key:', privateKey);
// ⚠️ Save your private key securely!
```

### 2. Connect with Existing Wallet

```typescript
// Connect with private key
const wallet = GamiUniversalWallet.fromPrivateKey('0x...');

// Or connect with mnemonic
const wallet = GamiUniversalWallet.fromMnemonic('word1 word2 ...');

// Check connection
console.log('Connected:', wallet.isConnected());
console.log('Address:', wallet.getAddress());
```

### 3. Check Balance & XP

```typescript
// Get GAMI balance
const balance = await wallet.getBalance();
console.log('Balance:', balance, 'GAMI');

// Get XP stats
const stats = await wallet.getXPStats();
console.log('Level:', stats.level.toString());
console.log('Total XP:', stats.totalXP.toString());
console.log('XP to Next Level:', stats.xpToNextLevel.toString());
```

### 4. Check Airdrop Eligibility

```typescript
// Get detailed airdrop report
const report = await wallet.getAirdropReport();

console.log('Eligible:', report.eligible);
console.log('Amount:', report.amount, 'GAMI');

if (!report.eligible) {
  console.log('Missing requirements:', report.missing);
  console.log('Next steps:', report.nextSteps);
}
```

### 5. Claim Airdrop

```typescript
try {
  // Claim the airdrop
  const claim = await wallet.claimAirdrop();
  
  console.log('✅ Airdrop claimed!');
  console.log('Amount:', formatEther(claim.amount), 'GAMI');
  console.log('Transaction:', claim.txHash);
  
} catch (error) {
  console.error('Claim failed:', error.message);
}
```

---

## 📚 Complete API Reference

### Wallet Creation

#### `GamiUniversalWallet.generateWallet()`
Generate a new wallet with private key and address.

```typescript
const { privateKey, address } = GamiUniversalWallet.generateWallet();
```

#### `GamiUniversalWallet.fromPrivateKey(privateKey, rpcUrl?)`
Create wallet from private key.

```typescript
const wallet = GamiUniversalWallet.fromPrivateKey('0x...');
```

#### `GamiUniversalWallet.fromMnemonic(mnemonic, rpcUrl?)`
Create wallet from mnemonic phrase.

```typescript
const wallet = GamiUniversalWallet.fromMnemonic('word1 word2 ...');
```

---

### Balance & Assets

#### `wallet.getBalance(refresh?): Promise<string>`
Get native GAMI token balance (formatted).

```typescript
const balance = await wallet.getBalance();
console.log(balance); // "123.456"
```

#### `wallet.getBalanceWei(): Promise<bigint>`
Get balance in wei (raw value).

```typescript
const balance = await wallet.getBalanceWei();
console.log(balance); // 123456000000000000000n
```

#### `wallet.getAssets(): Promise<Asset[]>`
Get all wallet assets.

```typescript
const assets = await wallet.getAssets();
assets.forEach(asset => {
  console.log(`${asset.name}: ${formatEther(asset.balance)}`);
});
```

#### `wallet.sendTokens(to, amount): Promise<string>`
Send GAMI tokens to another address.

```typescript
const txHash = await wallet.sendTokens(
  '0x...', // recipient address
  '10.5'   // amount in GAMI
);
console.log('Transaction:', txHash);
```

---

### XP & Leveling

#### `wallet.getXPStats(): Promise<UserStats>`
Get user's XP and level statistics.

```typescript
const stats = await wallet.getXPStats();
console.log('Level:', stats.level);
console.log('Total XP:', stats.totalXP);
console.log('XP to Next Level:', stats.xpToNextLevel);
```

#### `wallet.subscribeToLevelUps(callback)`
Subscribe to level-up events.

```typescript
const unsubscribe = wallet.subscribeToLevelUps((user, newLevel, totalXP) => {
  console.log(`🎉 Level ${newLevel} reached!`);
});

// Unsubscribe when done
unsubscribe();
```

---

### Airdrop Functions

#### `wallet.checkAirdropEligibility(): Promise<AirdropEligibility>`
Check if user is eligible for airdrop.

```typescript
const eligibility = await wallet.checkAirdropEligibility();
console.log('Eligible:', eligibility.eligible);
console.log('Amount:', eligibility.amount);
console.log('Reason:', eligibility.reason);
```

#### `wallet.getAirdropReport()`
Get detailed eligibility report with missing requirements.

```typescript
const report = await wallet.getAirdropReport();

console.log('Eligible:', report.eligible);
console.log('Amount:', report.amount, 'GAMI');
console.log('Missing:', report.missing);
console.log('Next steps:', report.nextSteps);
```

#### `wallet.hasClaimedAirdrop(): Promise<boolean>`
Check if airdrop has already been claimed.

```typescript
const claimed = await wallet.hasClaimedAirdrop();
console.log('Already claimed:', claimed);
```

#### `wallet.claimAirdrop(): Promise<AirdropClaim>`
Claim the airdrop (if eligible).

```typescript
const claim = await wallet.claimAirdrop();
console.log('Claimed:', formatEther(claim.amount), 'GAMI');
console.log('TX Hash:', claim.txHash);
```

#### `wallet.getEstimatedAirdropAmount(): Promise<string>`
Get estimated airdrop amount based on XP and level.

```typescript
const estimated = await wallet.getEstimatedAirdropAmount();
console.log('Estimated:', estimated, 'GAMI');
```

#### `wallet.watchAirdropClaims(callback)`
Subscribe to all airdrop claim events.

```typescript
const unsubscribe = wallet.watchAirdropClaims((claim) => {
  console.log('User claimed:', claim.user);
  console.log('Amount:', formatEther(claim.amount));
});
```

---

### Transactions

#### `wallet.getTransactions(): Transaction[]`
Get transaction history.

```typescript
const transactions = wallet.getTransactions();
transactions.forEach(tx => {
  console.log(`${tx.status}: ${formatEther(tx.value)} GAMI`);
});
```

#### `wallet.getTransactionReceipt(txHash)`
Get transaction receipt.

```typescript
const receipt = await wallet.getTransactionReceipt(txHash);
console.log('Status:', receipt.status);
```

#### `wallet.waitForTransaction(txHash): Promise<void>`
Wait for transaction confirmation.

```typescript
await wallet.waitForTransaction(txHash);
console.log('✅ Transaction confirmed!');
```

---

### Utility Functions

#### `wallet.getAddress(): Address | null`
Get wallet address.

```typescript
const address = wallet.getAddress();
```

#### `wallet.isConnected(): boolean`
Check if wallet is connected.

```typescript
if (wallet.isConnected()) {
  // Do something
}
```

#### `wallet.getBlockNumber(): Promise<bigint>`
Get current block number.

```typescript
const block = await wallet.getBlockNumber();
console.log('Current block:', block);
```

#### `wallet.refresh(): Promise<void>`
Refresh all wallet data (balance, XP, assets).

```typescript
await wallet.refresh();
```

#### `wallet.getState(): WalletState`
Get complete wallet state.

```typescript
const state = wallet.getState();
console.log(state);
```

#### `wallet.exportInfo()`
Export wallet info (without private key).

```typescript
const info = wallet.exportInfo();
console.log(JSON.stringify(info, null, 2));
```

---

## 🎯 Airdrop Eligibility Criteria

The airdrop system validates users based on multiple criteria:

### Default Criteria
- **Minimum Level**: 5
- **Minimum XP**: 5,000
- **Account Age**: 7 days
- **Quests Completed**: At least 1

### Airdrop Amount Calculation
```
Base Amount: 1,000 GAMI
+ Level Bonus: 100 GAMI per level
+ XP Bonus: 1 GAMI per 100 XP
```

**Example:**
- Level 10, 15,000 XP
- Base: 1,000 GAMI
- Level Bonus: 10 × 100 = 1,000 GAMI
- XP Bonus: 15,000 ÷ 100 = 150 GAMI
- **Total: 2,150 GAMI**

---

## 🔧 Advanced Usage

### Custom RPC URL

```typescript
const wallet = GamiUniversalWallet.fromPrivateKey(
  '0x...',
  'http://your-rpc-url:8545'
);
```

### Error Handling

```typescript
try {
  const claim = await wallet.claimAirdrop();
  console.log('Success!');
} catch (error) {
  if (error.message.includes('Not eligible')) {
    console.log('Check eligibility requirements');
  } else if (error.message.includes('Already claimed')) {
    console.log('Airdrop already claimed');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Event Monitoring

```typescript
// Monitor level-ups
const unsubLevel = wallet.subscribeToLevelUps((user, level, xp) => {
  console.log(`${user} reached level ${level}`);
});

// Monitor airdrop claims
const unsubAirdrop = wallet.watchAirdropClaims((claim) => {
  console.log(`${claim.user} claimed ${formatEther(claim.amount)} GAMI`);
});

// Cleanup
setTimeout(() => {
  unsubLevel();
  unsubAirdrop();
}, 60000);
```

---

## 📖 Examples

See the [`examples/`](./examples) directory for complete working examples:

- `usage.ts` - Basic wallet operations
- More examples coming soon...

Run examples:
```bash
npm run build
node dist/examples/usage.js
```

---

## 🧪 Testing

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test
```

---

## 🔗 Blockchain Configuration

### Default Gami Chain Config
```typescript
{
  rpcUrl: 'http://localhost:8545',
  chainId: 'gami-1',
  chainName: 'Gami Protocol',
  nativeCurrency: {
    name: 'Gami Token',
    symbol: 'GAMI',
    decimals: 18
  }
}
```

### Precompile Addresses
```typescript
{
  GAMIXP: '0x0000000000000000000000000000000000000800',
  TREASURY: '0x0000000000000000000000000000000000000801',
  AIRDROP: '0x0000000000000000000000000000000000000802'
}
```

---

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/gami-protocol/gami-universal-wallet.git
cd gami-universal-wallet

# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Lint
npm run lint
```

---

## 📄 License

MIT

---

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines.

---

## 📞 Support

- Discord: https://discord.gg/gami
- Twitter: https://twitter.com/gamiprotocol
- GitHub Issues: https://github.com/gami-protocol/gami-universal-wallet/issues

---

**Built with ❤️ by Gami Protocol Team**
