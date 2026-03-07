# Gami Protocol Universal Wallet

Includes backend and multiple Expo/React Native apps.

## Subfolders to migrate
- `backend/`
- `Gami_Wallet/`
- `gami-wallet-app/`

## Getting Started
- Code currently lives under `Gami_Universal_Wallet/` in the monorepo.

## Agent-to-Agent + Gami Chain Gamification
- `backend/server.py` now exposes `GET /api/agent/integration` so the wallet can detect active agent-to-agent tooling on Gami Chain.
- `GET /api/agent/tooling` is available as a compatibility alias for agent-tooling clients.
- Agent integration responses include the canonical webapp repository (`https://github.com/Gami-Protocol/gami-webapp`) and an endpoint manifest used by rewards/agent flows.
- Rewards (`GET /api/rewards`) now include agent quality metadata (`agent_quality_score`, `gamification_tier`, `supports_agent_to_agent`).
- Spin results (`POST /api/spin`) now support an agent boost segment and a functional `2x Bonus` result with enriched response metadata.
