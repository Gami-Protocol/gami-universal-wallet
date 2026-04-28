# Gami Wallet Integration Layer

This folder contains the full production integration layer for Gami Protocol.

## Modules

### apiClient.ts
Handles all backend communication.

### types.ts
Shared types for wallet, quests, rewards, and sync.

### walletService.ts
Handles secure wallet storage and EVM client setup.

### chainConfig.ts
Defines supported EVM chains.

### syncService.ts
Handles Chrome extension → wallet → dashboard sync.

### eventBridge.ts
Listens for Chrome extension events.

### aiService.ts
Handles AI reward decisions.

## Flow

Wallet → API → XP → AI → Rewards → UI

Extension → API → Dashboard → Wallet sync

## Security

- Never trust frontend XP
- Always validate rewards server-side
- Use SecureStore for keys

## Next Steps

- Implement SIWE auth endpoints
- Connect WalletConnect UI
- Add background sync polling
- Integrate with dashboard analytics
