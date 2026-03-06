# Gami Wallet - PRD

## Original Problem Statement
Design a modern mobile-first Gami Wallet UI inspired by the Rewards & Loyalty App UI Kit from UI8, adapting its clean reward dashboard structure into a Web3 gamified wallet experience. Purple gradient palette, dark/light mode, 4-tab bottom navigation.

## Architecture
- **Frontend**: React 18 + Tailwind CSS + Framer Motion (mobile-first, max-width 430px)
- **Backend**: FastAPI (Python) on port 8001
- **Database**: MongoDB (gami_wallet)
- **Design**: Glassmorphism dark theme, purple brand (#6E3CFB, #4C1D95, #A78BFA)

## User Persona
- Web3 crypto users, gamification enthusiasts, loyalty program users
- Both crypto-native and non-crypto casual users

## Core Requirements
- Mobile-first wallet UI with gamified engagement
- XP balance, streak tracking, missions, rewards marketplace, spin wheel
- Dark mode (default) + Light mode toggle
- Mock data in MongoDB with CRUD APIs

## What's Been Implemented (March 6, 2026)
- **Home Screen**: XP card (2,321 pts), progress bar, quick actions (Check-in, Mission, Rewards, Referral), streak calendar, featured rewards
- **Rewards Screen**: Search/filter, category pills (All/Voucher/Digital/NFT/Gadget), list/grid view toggle, Redeem Now buttons, 8 seeded rewards
- **Points/Missions Screen**: Mission progress card (2/10), 10 missions with XP rewards, progress tracking, completion flow
- **Daily Check-In Screen**: 199-day streak counter, monthly calendar with check-in history, milestone targets (125/150/175/200), Check In button
- **Wheels/Spin Screen**: 8-segment spin wheel with physics animation, daily spin limit, result display
- **Bottom Navigation**: 4 tabs (Home, Rewards, Points, Wheels) with animated active states
- **Theme Toggle**: Dark/Light mode with CSS variables
- **Backend APIs**: /api/user, /api/rewards, /api/missions, /api/checkins, /api/spin, /api/transactions, /api/user/checkin, /api/rewards/redeem, /api/missions/complete
- **Testing**: 100% backend, 98% frontend pass rate

## Prioritized Backlog
### P0 (Done)
- All 5 screens implemented and functional
- Full CRUD APIs with MongoDB
- Dark/Light mode support
- Seed data

### P1 (Next)
- Privy.io authentication integration
- Wallet connection (multi-chain)
- Transaction history screen
- Real token/NFT storage display
- Gami chain integration hooks

### P2 (Future)
- Referral system with shareable codes
- Push notifications for streaks
- AI-driven reward recommendations
- Partner brand campaign integration
- Staking rewards display
- Cross-chain identity

## Next Tasks
1. Add privy.io wallet authentication
2. Build transaction history view
3. Add confetti animation on reward unlock/mission complete
4. Implement referral flow with share functionality
5. Add wallet balance display (multi-chain mock)
