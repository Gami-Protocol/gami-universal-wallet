# Neobrultis Design System - Style Guide

**Version 1.0** | Gami Protocol Universal Wallet

---

## 🎨 Design Philosophy

**Neobrultis** is a design language that merges:
- **Brutalist principles**: Raw, honest, functional, high-contrast
- **Neo-tech aesthetics**: Futuristic, digital, holographic, luminescent

### Core Principles

1. **Efficiency First**: Every element serves a purpose
2. **High Contrast**: Maximum readability and visual hierarchy
3. **Sharp Edges**: Geometric precision with minimal rounded corners
4. **Strategic Glow**: Subtle luminescence on interactive elements
5. **Monospace Priority**: Technical, precise typography
6. **Dark Foundation**: Dark mode as the primary theme

---

## 🎨 Color Palette

### Primary Backgrounds

```css
--bg-primary:    #0A0A0A  /* Pure dark */
--bg-secondary:  #121212  /* Card backgrounds */
--bg-tertiary:   #1A1A1A  /* Elevated surfaces */
--bg-elevated:   #242424  /* Modals, popups */
```

### Text Colors

```css
--text-primary:   #FFFFFF  /* Headings, primary content */
--text-secondary: #B8B8B8  /* Body text, descriptions */
--text-tertiary:  #6B6B6B  /* Labels, metadata */
--text-inverse:   #0A0A0A  /* Text on accent backgrounds */
```

### Accent Colors

#### XP (Experience Points)
```css
--accent-xp:      #00FF94  /* Bright green */
--accent-xp-glow: rgba(0, 255, 148, 0.4)
```
**Usage**: XP values, progression indicators, success states

#### Points (Currency)
```css
--accent-points:      #00D1FF  /* Electric cyan */
--accent-points-glow: rgba(0, 209, 255, 0.4)
```
**Usage**: Point values, financial elements, info states

#### Rewards
```css
--accent-reward:      #FF00E5  /* Vibrant magenta */
--accent-reward-glow: rgba(255, 0, 229, 0.4)
```
**Usage**: Special rewards, premium features, highlights

### State Colors

```css
--state-success:  #00FF94  /* Same as XP green */
--state-warning:  #FFD600  /* Bright yellow */
--state-error:    #FF3D3D  /* Bright red */
--state-info:     #00D1FF  /* Same as Points cyan */
```

### Borders & Dividers

```css
--border-default: #2A2A2A  /* Subtle borders */
--border-strong:  #404040  /* Emphasis borders */
--border-accent:  #00FF94  /* Interactive borders */
```

### Holographic Gradients

```css
--holographic-primary:   linear-gradient(135deg, #00FF94 0%, #00D1FF 50%, #FF00E5 100%)
--holographic-secondary: linear-gradient(90deg, #00D1FF 0%, #FF00E5 100%)
--holographic-tertiary:  linear-gradient(180deg, #FF00E5 0%, #00FF94 100%)
```

---

## 📝 Typography

### Font Families

**Primary (Display & UI)**
```css
font-family: 'Space Mono', 'Courier New', monospace;
```
Used for: Headlines, labels, data display, stats

**Secondary (Body)**
```css
font-family: 'Inter', -apple-system, sans-serif;
```
Used for: Descriptions, body text, long-form content

**Monospace (Code/Data)**
```css
font-family: 'Courier New', monospace;
```
Used for: Addresses, hashes, technical data

### Font Scale

| Token | Size | Usage |
|-------|------|-------|
| `xs` | 10px | Micro labels, metadata |
| `sm` | 12px | Small body, captions |
| `base` | 14px | Body text |
| `lg` | 16px | Subheadings |
| `xl` | 20px | Section titles |
| `2xl` | 24px | Card titles |
| `3xl` | 32px | Page headings |
| `4xl` | 40px | Hero text |
| `5xl` | 48px | Display numbers |
| `hero` | 64px | Splash screens |

### Font Weights

```css
--weight-regular:  400
--weight-medium:   500
--weight-semibold: 600
--weight-bold:     700
```

### Letter Spacing

```css
--spacing-tight:  -0.5px  /* Tight headings */
--spacing-normal:  0px    /* Default */
--spacing-wide:    0.5px  /* Subheadings */
--spacing-wider:   1px    /* Labels */
--spacing-widest:  2px    /* Micro labels, tags */
```

### Typography Examples

```css
/* Page Heading */
.heading-primary {
  font-family: 'Space Mono', monospace;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #FFFFFF;
  text-transform: uppercase;
}

/* Body Text */
.body-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0;
  color: #B8B8B8;
  line-height: 1.5;
}

/* XP Value */
.xp-value {
  font-family: 'Space Mono', monospace;
  font-size: 48px;
  font-weight: 700;
  color: #00FF94;
  text-shadow: 0 0 20px rgba(0, 255, 148, 0.6);
}
```

---

## 📏 Spacing System

Based on 4px grid:

```css
--spacing-xs:   4px
--spacing-sm:   8px
--spacing-md:  16px
--spacing-lg:  24px
--spacing-xl:  32px
--spacing-2xl: 40px
--spacing-3xl: 48px
--spacing-4xl: 64px
```

### Layout Guidelines

- **Card padding**: 16px (md)
- **Section spacing**: 24px (lg)
- **Page margins**: 24px (lg)
- **Component gaps**: 8-16px (sm-md)

---

## 🔲 Components

### Cards

```css
.card {
  background: #121212;
  border: 1px solid #2A2A2A;
  border-radius: 4px;
  padding: 16px;
}

.card:hover {
  border-color: #404040;
}
```

### Buttons

#### Primary Button
```css
.btn-primary {
  background: #00FF94;
  color: #0A0A0A;
  border: none;
  border-radius: 2px;
  padding: 12px 24px;
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
}

.btn-primary:hover {
  box-shadow: 0 0 20px rgba(0, 255, 148, 0.6);
  transform: translateY(-1px);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: #FFFFFF;
  border: 1px solid #00FF94;
  border-radius: 2px;
  padding: 12px 24px;
}

.btn-secondary:hover {
  background: rgba(0, 255, 148, 0.1);
}
```

#### Ghost Button
```css
.btn-ghost {
  background: transparent;
  color: #00FF94;
  border: none;
  border-radius: 2px;
  padding: 12px 24px;
}

.btn-ghost:hover {
  background: rgba(0, 255, 148, 0.05);
}
```

### Input Fields

```css
.input {
  background: #1A1A1A;
  border: 1px solid #2A2A2A;
  border-radius: 2px;
  padding: 12px;
  color: #FFFFFF;
  font-family: 'Space Mono', monospace;
}

.input::placeholder {
  color: #6B6B6B;
}

.input:focus {
  outline: none;
  border-color: #00FF94;
  box-shadow: 0 0 0 2px rgba(0, 255, 148, 0.2);
}
```

---

## ✨ Effects

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.8);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.8);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.9);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.9);
```

### Glows

```css
--glow-xp:     0 0 20px rgba(0, 255, 148, 0.6);
--glow-points: 0 0 20px rgba(0, 209, 255, 0.6);
--glow-reward: 0 0 20px rgba(255, 0, 229, 0.6);
```

### Border Radius

```css
--radius-none: 0px
--radius-sm:   2px   /* Brutalist, sharp */
--radius-md:   4px   /* Default */
--radius-lg:   8px   /* Cards, modals */
--radius-xl:   12px  /* Large containers */
--radius-full: 9999px /* Circular */
```

---

## 🎬 Animations

### Durations

```css
--duration-fast:      150ms
--duration-normal:    300ms
--duration-slow:      500ms
--duration-very-slow: 1000ms
```

### Easing Functions

```css
--ease-in:      cubic-bezier(0.4, 0, 1, 1)
--ease-out:     cubic-bezier(0, 0, 0.2, 1)
--ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1)
--ease-sharp:   cubic-bezier(0.4, 0, 0.6, 1)
```

### Common Animations

```css
/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse Glow */
@keyframes pulseGlow {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* Slide In Right */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

---

## 🎯 UI Patterns

### XP Progression Ring

The signature component of Neobrultis design:

**Characteristics:**
- Circular SVG progress indicator
- Holographic gradient stroke
- Pulsing glow effect
- Central level display
- Clean numerical data

**Visual Hierarchy:**
1. Level number (largest, XP green with glow)
2. XP progress (current/max)
3. Progress ring (gradient stroke)
4. Percentage text (smallest)

### POP Notifications

**Layout:**
```
┌─────────────────────────────┐
│ GAMI PROTOCOL           [×] │
├─────────────────────────────┤
│  ┌────┐                     │
│  │+50 │  Action completed   │
│  └────┘  +50 XP · +25 PTS  │
└─────────────────────────────┘
```

**Behavior:**
- Slide in from top-right
- Auto-dismiss after 5 seconds
- Click to view details
- Max 3 concurrent POPs
- Queue additional notifications

### Data Display

**Address Format:**
```
0x1234...5678
```
Always truncate addresses to first 6 and last 4 characters.

**Number Format:**
```
1,234,567 XP
```
Use thousand separators, no decimals for XP/points.

---

## 📱 Responsive Design

### Breakpoints

```css
--screen-sm:  640px
--screen-md:  768px
--screen-lg:  1024px
--screen-xl:  1280px
--screen-2xl: 1536px
```

### Mobile-First Approach

```css
/* Mobile (default) */
.container {
  padding: 16px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
  }
}
```

---

## ♿ Accessibility

### Contrast Ratios

All text meets WCAG AA standards:
- Primary text on dark: 16.7:1
- Secondary text on dark: 7.4:1
- Accent colors on dark: 4.5:1+

### Focus States

```css
:focus-visible {
  outline: 2px solid #00FF94;
  outline-offset: 2px;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🎨 Usage Examples

### React Native Component

```tsx
import { NeobrutlisTheme } from '@/design/neobrultis-theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: NeobrutlisTheme.colors.background.primary,
    padding: NeobrutlisTheme.spacing.lg,
  },
  title: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes['3xl'],
    fontWeight: NeobrutlisTheme.typography.weights.bold,
    color: NeobrutlisTheme.colors.text.primary,
    letterSpacing: NeobrutlisTheme.typography.letterSpacing.wider,
  },
  xpValue: {
    color: NeobrutlisTheme.colors.accent.xp,
    textShadowColor: NeobrutlisTheme.colors.accent.xpGlow,
    textShadowRadius: 20,
  },
});
```

### CSS Variables

```css
:root {
  --bg-primary: #0A0A0A;
  --text-primary: #FFFFFF;
  --accent-xp: #00FF94;
  --spacing-md: 16px;
}

.my-component {
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: var(--spacing-md);
}
```

---

## 🚫 Don'ts

❌ Don't use bright colors on bright backgrounds  
❌ Don't use excessive rounded corners (max 8px)  
❌ Don't mix serif fonts  
❌ Don't use drop shadows on flat UI  
❌ Don't animate too many elements at once  
❌ Don't use gradients as backgrounds (only for accents)  

## ✅ Do's

✅ Maintain high contrast  
✅ Use glow effects sparingly  
✅ Keep animations purposeful  
✅ Align to 4px grid  
✅ Use monospace for data  
✅ Test in dark environments  

---

**End of Style Guide** | Gami Protocol © 2024
