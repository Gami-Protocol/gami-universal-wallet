# Gami Universal Wallet - Quick Start

> Get started in 2 minutes

## 📦 Installation

```bash
cd /Users/marcusmattus/Gami_Protocol/gami-universal-wallet
npm install
npm run build
```

## 🚀 Quick Test

### 1. Generate a New Wallet

```bash
node -e "
const { GamiUniversalWallet } = require('./dist');
const wallet = GamiUniversalWallet.generateWallet();
console.log('Address:', wallet.address);
console.log('Private Key:', wallet.privateKey);
"
```

### 2. Test with Example

Edit `examples/usage.ts` and add your private key:

```typescript
const privateKey = '0xYOUR_PRIVATE_KEY_HERE';
const wallet = GamiUniversalWallet.fromPrivateKey(privateKey);
```

Then run:

```bash
npm run build
node dist/examples/usage.js
```

## 📝 Basic Usage

```typescript
import { GamiUniversalWallet, formatEther } from '@gami/universal-wallet';

// 1. Create wallet
const wallet = GamiUniversalWallet.fromPrivateKey('0x...');

// 2. Check balance
const balance = await wallet.getBalance();
console.log('Balance:', balance, 'GAMI');

// 3. Get XP stats
const stats = await wallet.getXPStats();
console.log('Level:', stats.level);

// 4. Check airdrop
const report = await wallet.getAirdropReport();
if (report.eligible) {
  const claim = await wallet.claimAirdrop();
  console.log('Claimed:', formatEther(claim.amount));
}
```

## 🎯 Key Features

✅ **Wallet Management** - Create, import, manage wallets  
✅ **Balance & Transfers** - Check and send GAMI tokens  
✅ **XP System** - Track level and XP progress  
✅ **Airdrop Validation** - Check eligibility and claim  
✅ **Event Monitoring** - Subscribe to level-ups and claims  

## 📚 Full Documentation

See [WALLET_README.md](./WALLET_README.md) for complete API reference.

## 🔗 Connecting to Gami Chain

Make sure Gami chain is running:

```bash
# In gami-protocol-chain directory
cd chain-core
./gamid start
```

Then use the wallet:

```typescript
const wallet = GamiUniversalWallet.fromPrivateKey(
  '0x...',
  'http://localhost:8545' // Your RPC URL
);
```

## 🆘 Troubleshooting

### "Cannot find module"
```bash
npm run build
```

### "Connection refused"
Make sure Gami chain is running on `localhost:8545`

### "Not eligible for airdrop"
Check requirements:
```typescript
const report = await wallet.getAirdropReport();
console.log('Missing:', report.missing);
console.log('Next steps:', report.nextSteps);
```

## 🎓 Next Steps

1. Read full documentation: `WALLET_README.md`
2. Try all examples: `examples/usage.ts`
3. Integrate into your app
4. Join Discord for support

---

**Ready to build? Start here:**

```bash
npm run build && node dist/examples/usage.js
```
