# Neo-UI Design System

A modern, animated design system for the Gami Universal Wallet mobile application.

## Overview

The Neo-UI Design System provides a comprehensive set of reusable components, theme tokens, and animations that follow modern design principles with a focus on cryptocurrency and Web3 aesthetics.

## Design Principles

- **Modern & Minimal**: Clean interfaces with purposeful animations
- **Accessible**: WCAG AA compliant with proper touch targets
- **Performant**: 60fps animations using React Native Animated API
- **Consistent**: Unified color palette, typography, and spacing
- **Responsive**: Adapts to different screen sizes

## Theme System

### Colors

Located in `src/theme/colors.ts`

```typescript
const neoUIColors = {
  primary: '#6C63FF',      // Indigo/Purple
  secondary: '#4ECDC4',    // Mint/Teal
  accent: '#FF6B9D',       // Pink
  brand: {
    magenta: '#B026FF',
    cyan: '#00F0FF',
  }
}
```

### Typography

Located in `src/theme/typography.ts`

- **Font Family**: Inter (Regular, SemiBold, Bold)
- **Sizes**: xs (12px) to 5xl (36px)
- **Line Heights**: Optimized for readability

### Spacing

Located in `src/theme/spacing.ts`

- Consistent 4px base unit
- Predefined scales: xs, sm, md, base, lg, xl, 2xl, 3xl, 4xl, 5xl
- Border radius values for consistent rounding

### Shadows

Located in `src/theme/shadows.ts`

- Multiple elevation levels (sm, md, lg, xl)
- Neo-UI glow effect for accent elements

## Components

### NeoButton

A versatile button component with multiple variants and animations.

```tsx
import { NeoButton } from '@/components/NeoUI';

<NeoButton
  title="Sign Up"
  onPress={handleSignUp}
  variant="gradient"  // primary, secondary, outline, ghost, gradient
  size="lg"          // sm, md, lg
  fullWidth
/>
```

**Features:**
- 5 variants: primary, secondary, outline, ghost, gradient
- 3 sizes: small, medium, large
- Press animations (scale down to 0.95)
- Loading state with spinner
- Icon support (left/right)
- Full width option

### NeoInput

Modern input field with floating labels and icon support.

```tsx
import { NeoInput } from '@/components/NeoUI';

<NeoInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
  leftIcon={<Mail size={20} />}
  rightIcon={<Eye size={20} />}
  onRightIconPress={toggleVisibility}
/>
```

**Features:**
- Floating label animation
- Left/right icon support
- Error state with messages
- Focus animations (border color change)
- Secure text entry support
- Auto-capitalize options

### NeoCard

Card component with glassmorphism effect.

```tsx
import { NeoCard } from '@/components/NeoUI';

<NeoCard variant="glass">  // solid, glass, gradient
  <Text>Card content</Text>
</NeoCard>
```

**Features:**
- 3 variants: solid, glass, gradient
- Custom gradient colors
- Soft shadows
- Rounded corners

### ProgressDots

Animated progress indicator for onboarding.

```tsx
import { ProgressDots } from '@/components/NeoUI';

<ProgressDots total={3} active={0} />
```

### Loading

Loading states component.

```tsx
import { Loading } from '@/components/NeoUI';

<Loading size="large" fullScreen />
```

## Screens

### Splash Screen

Enhanced splash screen with animations:
- Animated logo with fade-in and scale effects
- Gradient background
- Loading indicator
- Minimum 2-second display
- Automatic routing to onboarding or home

### Onboarding Flow

Three-slide onboarding experience:

1. **Safe and Secure** - Security features
2. **Transfer Assets** - Easy transfers
3. **Grow Assets** - Swap and growth features

**Features:**
- Swipeable slides
- Progress dots indicator
- Skip functionality
- Get Started CTA
- AsyncStorage for completion tracking

### Authentication

#### Sign Up Screen
- Full name, email, password inputs
- Terms and Privacy Policy checkbox
- Social auth buttons (Google, Apple)
- Form validation
- Link to login

#### Login Screen
- Email and password inputs
- Forgot password link
- Social auth options
- Form validation
- Link to sign up

## Navigation Flow

```
Splash Screen
├── First Launch → Onboarding → Sign Up → Home
└── Return User → Home (if authenticated)
```

## Animations

All animations use React Native Animated API for optimal performance:

- **Splash**: Fade + Scale (800ms)
- **Button Press**: Scale down to 0.95
- **Input Focus**: Border color transition (200ms)
- **Screen Transitions**: Slide with fade

## Usage

### Importing Theme

```tsx
import { neoUIColors, typography, spacing, borderRadius, shadows } from '@/theme';
```

### Importing Components

```tsx
import { NeoButton, NeoInput, NeoCard, ProgressDots, Loading } from '@/components/NeoUI';
```

### Importing Screens

```tsx
import OnboardingScreen from '@/screens/Onboarding/OnboardingScreen';
import SignUpScreen from '@/screens/Auth/SignUpScreen';
import LoginScreen from '@/screens/Auth/LoginScreen';
```

## Best Practices

1. **Always use theme tokens** instead of hardcoded values
2. **Test animations** on real devices to ensure 60fps
3. **Validate forms** before submission
4. **Handle loading states** for all async operations
5. **Provide error feedback** with clear messages
6. **Use semantic HTML** for accessibility
7. **Test on multiple screen sizes**

## Accessibility

- Minimum touch target size: 44x44 points
- Color contrast ratio: WCAG AA compliant
- Screen reader support with proper labels
- Reduced motion support for animations

## File Structure

```
src/
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── shadows.ts
│   └── index.ts
├── components/
│   └── NeoUI/
│       ├── NeoButton.tsx
│       ├── NeoInput.tsx
│       ├── NeoCard.tsx
│       ├── ProgressDots.tsx
│       ├── Loading.tsx
│       └── index.ts
├── screens/
│   ├── Onboarding/
│   │   ├── OnboardingScreen.tsx
│   │   ├── OnboardingSlide.tsx
│   │   └── onboardingData.ts
│   └── Auth/
│       ├── SignUpScreen.tsx
│       └── LoginScreen.tsx
└── app/
    ├── index.jsx (Splash)
    ├── onboarding/
    │   └── index.tsx
    └── auth/
        ├── signup.tsx
        └── login.tsx
```

## Future Enhancements

- [ ] Add Lottie animations for complex illustrations
- [ ] Implement dark/light mode toggle
- [ ] Add haptic feedback
- [ ] Create skeleton loading screens
- [ ] Add more component variants
- [ ] Implement design tokens system
- [ ] Add Storybook for component documentation

## Support

For issues or questions, please refer to the main project documentation or contact the development team.
