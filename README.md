# Gami Protocol Universal Wallet

Gami Universal Wallet is a gamified, multi-chain wallet experience built with:

- **Mobile app:** Expo + React Native (`Gami_Wallet/`)
- **API backend:** FastAPI + MongoDB (`backend/`)
- **Web frontend prototype:** React (`frontend/`)

## Current Wallet Features

### Mobile Wallet (Expo)
- Animated splash screen with onboarding state check
- 3-step onboarding flow with skip/get-started actions
- Email/password sign-up and login forms with validation
- Social auth UI entry points (Google / Apple)
- Tab navigation with 5 core areas:
  - **Home:** level/xp view, points card, active quest claims
  - **Airdrop:** eligibility check + claim flow (Privy simulation)
  - **Wallet:** connected wallets list + private key import simulation
  - **Quests:** quest reward claim interactions
  - **Identity:** profile, badge display, login/logout state
- Neo-UI design system components (buttons, inputs, cards, progress dots, loading)

### Backend Wallet + Gamification APIs
- User/profile, token balances, NFTs, transactions, staking, pools, and network endpoints
- Daily check-in and mission completion XP mechanics
- Reward catalog + redemption flow
- Daily spin wheel with weighted outcomes
- Agent-tooling enhancements for Gami Chain:
  - `GET /api/agent/integration`
  - Agent-enriched rewards via `GET /api/rewards`
  - Agent boost + `2x Bonus` handling in `POST /api/spin`

## Repository Structure

- `Gami_Wallet/` — Expo mobile wallet app
- `backend/` — FastAPI wallet/gamification backend
- `frontend/` — React web frontend prototype
- `backend_test.py` — backend API behavior tests

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB instance

### Mobile app
```bash
cd Gami_Wallet
npm install
npm run start
```

### Backend API
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload
```

## Key API Endpoints

- `GET /api/health`
- `GET /api/user`, `GET /api/profile`
- `GET /api/tokens`, `GET /api/nfts`, `GET /api/networks`
- `GET /api/staking`, `GET /api/pools`
- `GET /api/rewards`, `POST /api/rewards/redeem`
- `GET /api/missions`, `PUT /api/missions/complete`
- `GET /api/checkins`, `PUT /api/user/checkin`
- `GET /api/transactions`
- `POST /api/spin`
- `GET /api/agent/integration`

## Development Notes

- The current mobile app includes production-style UI flows plus simulation mode integrations for Privy.
- Backend seed data is initialized in `backend/server.py` for local development demos.
