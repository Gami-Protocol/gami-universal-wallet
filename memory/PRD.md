# Gami Wallet - PRD

## Original Problem Statement
Design a mobile-first Gami Wallet UI with neobrutalism design pattern (inspired by gamiprotocol.io), combining Web3 wallet infrastructure, DeFi yield/staking, loyalty mechanics, and gamified engagement. Purple gradient palette (#6E3CFB, #4C1D95, #A78BFA). Dark/Light mode. 5-tab navigation.

## Architecture
- **Frontend**: React 18 + Tailwind CSS + Framer Motion (mobile-first, max-width 430px)
- **Backend**: FastAPI (Python) on port 8001
- **Database**: MongoDB (gami_wallet)
- **Design**: Neobrutalism (thick 3px borders, hard 4px offset shadows, bold uppercase typography, Space Mono for numbers)

## User Personas
- Web3 crypto users managing multi-chain assets
- Gamification enthusiasts earning XP/rewards
- DeFi users staking and farming yield
- Non-crypto casual users discovering crypto through gamification

## Core Requirements
- Neobrutalist mobile-first wallet UI
- Multi-chain asset management (Gami, ETH, SOL, Polygon)
- XP/loyalty system with missions and streaks
- DeFi staking and yield farming
- Rewards marketplace with brand vouchers/NFTs
- Daily check-in and spin wheel gamification
- Cross-chain identity and profile management

## What's Been Implemented (March 6, 2026)

### Iteration 1 - MVP (Glassmorphism, 4 tabs)
- Home, Rewards, Points/Missions, Wheels screens
- Basic MongoDB CRUD APIs

### Iteration 2 - Major Redesign (Neobrutalism, 5 tabs) 
- **Complete redesign** from glassmorphism to neobrutalism
- **Home Screen**: Total balance ($12,847.32), XP/Staked/Rewards stats, 6 quick actions (Send, Receive, Swap, Stake, Claim, Check-in), top 3 assets with 24h change, streak calendar, featured rewards
- **Wallet Screen**: Portfolio value, multi-chain network pills, 3-tab switcher (Tokens/NFTs/Activity), 5 token balances with USD values, 4 NFT cards with rarity badges, transaction history with status
- **Rewards Screen**: Search/filter, 5 category pills, list/grid view toggle, 8 redeemable rewards with Redeem buttons
- **Missions Screen**: Quest progress (3/10), Daily Check-in & Spin Wheel shortcuts, 10 missions with XP rewards & progress bars
- **Earn Screen**: Total staked/earned/claimable overview, 2 active staking positions with APY, Claim All button, 5 staking pools with TVL/APY/lock period
- **Profile Screen**: Avatar, wallet address, Level 12, 87 REP score, XP progress, stats grid, 3 connected wallets (Gami/ETH/SOL), referral code
- **Check-In Screen**: 199-day streak, monthly calendar, 4 milestones (125/150/175/200)
- **Spin Wheel Screen**: 8-segment wheel with physics animation, daily limit
- **5-Tab Navigation**: Home, Wallet, Rewards, Missions, Earn
- **Dark/Light Mode**: Full theme support with CSS variables
- **Backend**: 13 API endpoints, 10 MongoDB collections, auto-seeded data
- **Testing**: 100% backend, 100% frontend (37/37 tests passed)

## Prioritized Backlog
### P0 (Done)
- All 8 screens with neobrutalist design
- Full CRUD APIs with MongoDB
- Multi-chain wallet display
- DeFi staking dashboard
- Dark/Light mode

### P1 (Next)
- Privy.io wallet authentication
- Real wallet connection (MetaMask, Phantom)
- Actual token send/receive/swap flows
- Staking interaction (stake/unstake)
- Gami chain integration

### P2 (Future)
- AI-driven reward recommendations
- Partner brand campaign integration
- Push notifications
- DAO governance integration
- Cross-chain bridging UI

## Next Tasks
1. Integrate privy.io for wallet auth
2. Build Send/Receive token flow modals
3. Add real staking interaction
4. Implement swap flow UI
5. Add confetti animation on reward unlock
