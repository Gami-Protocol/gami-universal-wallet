# Screen Flow Documentation

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        APPLICATION STARTUP                       │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   SPLASH SCREEN        │
                    │   (2+ seconds)         │
                    │                        │
                    │  • Animated Gami logo  │
                    │  • Fade-in effect      │
                    │  • Scale animation     │
                    │  • Gradient background │
                    │  • Loading indicator   │
                    └────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
           [First Launch]            [Return User]
                    │                         │
                    ▼                         ▼
         ┌──────────────────┐    ┌──────────────────┐
         │  ONBOARDING      │    │  CHECK AUTH      │
         │  (3 slides)      │    └──────────────────┘
         │                  │              │
         │  Slide 1:        │     ┌────────┴────────┐
         │  🔐 Safe & Secure│     │                 │
         │                  │ [Authenticated] [Not Authenticated]
         │  Slide 2:        │     │                 │
         │  💸 Transfer     │     ▼                 ▼
         │                  │  ┌──────┐      ┌──────────┐
         │  Slide 3:        │  │ HOME │      │  LOGIN   │
         │  📈 Grow Assets  │  └──────┘      └──────────┘
         │                  │
         │  • Skip button   │
         │  • Progress dots │
         │  • Next/Get      │
         │    Started       │
         └──────────────────┘
                    │
                    │ [Get Started or Skip]
                    │
                    ▼
         ┌──────────────────┐
         │   SIGN UP        │
         │                  │
         │  • Full name     │
         │  • Email         │
         │  • Password      │
         │  • Terms checkbox│
         │  • Social auth   │
         │    - Google      │
         │    - Apple       │
         │                  │
         │  [Link to Login] │
         └──────────────────┘
                    │
                    │ [Sign Up Success]
                    │
                    ▼
              ┌──────────┐
              │   HOME   │
              │ (Tabs)   │
              └──────────┘
```

## Screen Details

### 1. Splash Screen (`src/app/index.jsx`)

**Visual Elements:**
- Background: Dark (#0F0F13)
- Animated gradient glow (purple/cyan)
- Logo: 160x160px with rounded corners
- Title: "Gami" (28px, bold, white)
- Subtitle: "Universal Wallet" (14px, gray)
- Loading spinner (purple)

**Animations:**
- Logo: Fade-in (0 → 1) + Scale (0.8 → 1)
- Duration: 800ms
- Type: Spring animation for scale

**Logic:**
- Minimum 2-second display
- Checks AsyncStorage for onboarding completion
- Routes to `/onboarding` or `/(tabs)/home`

---

### 2. Onboarding Screen (`src/screens/Onboarding/OnboardingScreen.tsx`)

**Layout:**
- Full screen dark background
- Skip button (top-right)
- Swipeable carousel (horizontal)
- Progress dots (bottom, centered)
- Action button (bottom)

**Slide 1: Safe and Secure**
```
    🔐
   Large emoji in circle
   with gradient glow

"Safe and Secure Cryptocurrency wallet"
      (28px, bold, white)

"Secure way of sending and receiving cryptocurrency"
         (16px, regular, gray)

        ● ○ ○  [Progress dots]

      [Next Button]
```

**Slide 2: Transfer Assets**
```
    💸
   Large emoji in circle
   with gradient glow

"Transfer your assets easily"
   (28px, bold, white)

"Crypto asset transfer instantly to your wallet"
         (16px, regular, gray)

        ○ ● ○  [Progress dots]

      [Next Button]
```

**Slide 3: Grow Assets**
```
    📈
   Large emoji in circle
   with gradient glow

"Grow and swap your crypto assets"
     (28px, bold, white)

"Swap between different cryptocurrencies..."
         (16px, regular, gray)

        ○ ○ ●  [Progress dots]

    [Get Started Button]
```

**Interactions:**
- Swipe left/right to navigate
- Skip button on all slides
- Next button on slides 1-2
- Get Started on slide 3
- All actions mark onboarding complete

---

### 3. Sign Up Screen (`src/screens/Auth/SignUpScreen.tsx`)

**Layout:**
```
┌─────────────────────────────────┐
│                                 │
│  Hello!                         │
│  Create your account to get     │
│  started                        │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 👤 Full Name           │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ✉️  Email              │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Password            👁️ │   │
│  └─────────────────────────┘   │
│                                 │
│  ☐ I agree with Terms and      │
│     Privacy Policy              │
│                                 │
│  ┌─────────────────────────┐   │
│  │     Sign up             │   │
│  │   (Gradient button)     │   │
│  └─────────────────────────┘   │
│                                 │
│  ─────────── or ───────────    │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Sign up with Google     │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Sign up with Apple      │   │
│  └─────────────────────────┘   │
│                                 │
│  Already have an account?       │
│  Login                          │
│                                 │
└─────────────────────────────────┘
```

**Validation:**
- Full name: Required, min 2 chars
- Email: Required, valid format
- Password: Required, min 8 chars
- Terms: Must be checked

---

### 4. Login Screen (`src/screens/Auth/LoginScreen.tsx`)

**Layout:**
```
┌─────────────────────────────────┐
│                                 │
│  Welcome back!                  │
│  Login to continue your journey │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ✉️  Email              │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Password            👁️ │   │
│  └─────────────────────────┘   │
│                                 │
│            Forgot password?     │
│                                 │
│  ┌─────────────────────────┐   │
│  │      Login              │   │
│  │   (Gradient button)     │   │
│  └─────────────────────────┘   │
│                                 │
│  ─────────── or ───────────    │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Login with Google       │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Login with Apple        │   │
│  └─────────────────────────┘   │
│                                 │
│  Don't have an account?         │
│  Sign up                        │
│                                 │
└─────────────────────────────────┘
```

**Validation:**
- Email: Required, valid format
- Password: Required

---

## Component Library

### NeoButton Variants

```
┌─────────────────────┐
│     Primary         │  ← Purple background
└─────────────────────┘

┌─────────────────────┐
│    Secondary        │  ← Mint/Teal background
└─────────────────────┘

┌─────────────────────┐
│     Outline         │  ← Transparent with border
└─────────────────────┘

┌─────────────────────┐
│      Ghost          │  ← Transparent no border
└─────────────────────┘

┌─────────────────────┐
│ ▓▓▓ Gradient ▓▓▓    │  ← Magenta to Cyan gradient
└─────────────────────┘
```

### NeoInput States

**Default:**
```
┌─────────────────────────┐
│ Label                   │
│ [Input text here]       │
└─────────────────────────┘
```

**Focused:**
```
┌═════════════════════════┐  ← Purple border
│ Label (purple, small)   │
│ [Input text here]       │
└═════════════════════════┘
```

**With Error:**
```
┌─────────────────────────┐
│ Label                   │
│ [Invalid input]         │  ← Red border
└─────────────────────────┘
  ⚠️ Error message here
```

**With Icon:**
```
┌─────────────────────────┐
│ 📧 [email@example.com]  │
└─────────────────────────┘

┌─────────────────────────┐
│ [password]           👁️ │  ← Clickable eye icon
└─────────────────────────┘
```

---

## Color System

### Primary Colors
```
Primary:   ███ #6C63FF (Indigo)
Secondary: ███ #4ECDC4 (Mint)
Accent:    ███ #FF6B9D (Pink)
```

### Brand Colors (Gami)
```
Magenta: ███ #B026FF
Cyan:    ███ #00F0FF
```

### Background
```
Darker:  ███ #0F0F13 (Main background)
Dark:    ███ #1A1D2E
Card:    ███ #1A1A24 (Component background)
```

### Text
```
Light:    ███ #FFFFFF (Primary text)
Subtext:  ███ #9CA3AF (Secondary text)
Primary:  ███ #2C3E50 (Light mode)
```

### Gradients
```
Magenta→Cyan: ▓▓▓▓▓ #B026FF → #00F0FF
Purple:       ▓▓▓▓▓ #6C63FF → #4834DF
Mint:         ▓▓▓▓▓ #4ECDC4 → #44A08D
```

---

## Animation Specs

### Button Press
```
Normal:  [  Button  ]  ← scale: 1.0
          ↓ (press)
Pressed: [ Button ]   ← scale: 0.95
          ↓ (release)
Normal:  [  Button  ]  ← scale: 1.0
```
- Type: Spring animation
- Friction: 3
- Tension: 40

### Input Focus
```
Blur:    ┌─────────┐  ← Gray border
              ↓
Focus:   ┌═════════┐  ← Purple border
```
- Duration: 200ms
- Interpolation: Linear

### Splash Logo
```
Start:     (·)         ← opacity: 0, scale: 0.8
              ↓
End:       (◉)         ← opacity: 1, scale: 1.0
```
- Duration: 800ms
- Type: Parallel (fade + scale)

### Progress Dots
```
Inactive:  ●          ← width: 8px
Active:    ●●●        ← width: 24px
```
- Smooth width transition
- Color change to primary

---

## File Organization

```
src/
├── theme/              → Design tokens
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── shadows.ts
│
├── components/
│   └── NeoUI/         → Reusable components
│       ├── NeoButton.tsx
│       ├── NeoInput.tsx
│       ├── NeoCard.tsx
│       ├── ProgressDots.tsx
│       └── Loading.tsx
│
├── screens/           → Screen components
│   ├── Onboarding/
│   │   ├── OnboardingScreen.tsx
│   │   ├── OnboardingSlide.tsx
│   │   └── onboardingData.ts
│   └── Auth/
│       ├── SignUpScreen.tsx
│       └── LoginScreen.tsx
│
├── utils/            → Utilities
│   └── validation/
│       └── index.ts
│
└── app/              → Routes
    ├── index.jsx     → Splash
    ├── onboarding/
    │   └── index.tsx
    └── auth/
        ├── signup.tsx
        └── login.tsx
```

---

## Usage Examples

### Import Theme
```typescript
import { neoUIColors, typography, spacing } from '@/theme';
```

### Use Components
```tsx
import { NeoButton, NeoInput } from '@/components/NeoUI';

<NeoButton
  title="Sign Up"
  variant="gradient"
  size="lg"
  onPress={handleSignUp}
/>

<NeoInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  leftIcon={<Mail size={20} />}
/>
```

### Validation
```typescript
import { isValidEmail, validatePassword } from '@/utils/validation';

if (!isValidEmail(email)) {
  setError('Please enter a valid email');
}
```

---

This completes the Neo-UI Design System visual documentation.
