# Onboarding — "Arcade" flow

Cyber-Brutalist, mascot-led new-player journey for Gami Wallet, ported from the
Figma `gami-flow-arcade` source. Built with `react-native-svg` + Reanimated v3
and the shared Gami design tokens.

## Flow

`OnboardingScreen` (route host) → `ArcadeOnboarding` (orchestrator) drives a
9-step journey with animated slide transitions and Android hardware-back support:

| # | Step | File |
|---|------|------|
| 1 | Welcome / value props | `arcade/steps/WelcomeStep.tsx` |
| 2 | Auth choice (create / Google / Apple / import) | `AuthStep.tsx` |
| 3 | Wallet provisioning ("forging") | `CreateStep.tsx` |
| 4 | Biometric lock | `BiometricStep.tsx` |
| 5 | Handle + avatar | `UsernameStep.tsx` |
| 6 | Meet NOVA (AI agent opt-in) | `NovaStep.tsx` |
| 7 | Interests (multi-select) | `InterestsStep.tsx` |
| 8 | How XP works | `RewardsStep.tsx` |
| 9 | Notifications → finish | `PermsStep.tsx` |

On completion the `@onboarding_completed` flag is persisted and the player is
routed to `/(tabs)/home`.

## Building blocks

- **`arcade/tokens.ts`** — Gami color + font tokens (matches `gami-tokens.css`).
- **`arcade/onboardingStore.ts`** — Zustand store capturing the player's choices
  (auth method, avatar, handle, interests, NOVA/biometric/notification toggles,
  XP earned).
- **`arcade/components/`** — reusable brutalist primitives:
  - `Nova` — animated AI mascot (SVG, bob + glow + blink)
  - `GamiXPRing` — animated circular XP/level ring
  - `BrutalBox` / `BrutalButton` — hard offset-shadow surfaces & buttons
  - `StepDots`, `Pill`, `Avatar`, `GlowBlob`, `ArcadeScreen` shell
  - `icons.tsx` — lucide-style SVG icon set
  - `text.tsx` — display/mono typography helpers

## Extending

Add a step by creating a `*Step.tsx` that takes `StepProps`
(`{ index, total, onNext, onBack?, onComplete }`), export it from
`steps/index.ts`, and insert it into the `STEPS` array in `ArcadeOnboarding.tsx`.
The progress header and transitions adjust automatically.
