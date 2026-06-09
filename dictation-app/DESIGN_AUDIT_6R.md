# Dictation App: 6R Design Audit
**Date:** May 31, 2026  
**Status:** REVIEW PHASE (In Progress)  
**Methodology:** 6R (Review → Recommend → Revise → Regenerate → Review → Reuse)

---

## PHASE 1: REVIEW — Current State Analysis

### 1.1 Tech Stack & Architecture
| Component | Current | Notes |
|-----------|---------|-------|
| **Frontend Framework** | React 19.2.6 | Matches AI Lab Catalog |
| **Styling** | Tailwind CSS 4.3.0 | Consistent with ecosystem |
| **Build Tool** | Vite 8.0.14 | Same as other apps |
| **Icons** | Font Awesome 6.4.0 + lucide-react | Dual icon systems = inconsistency |
| **Package Manager** | pnpm 10.30.1 | Correct per CLAUDE.md |
| **State Management** | React Context (AuthContext, ThemeContext) | Imports from AI Lab Catalog |

### 1.2 Design System — Current Inconsistencies

#### **LOGIN INTERFACE (shown in your screenshot)**
```
Visual Pattern: Light brown background with centered modal
- Background: #4e3428 (warm brown/tan)
- Modal: White with shadow
- Title: "Welcome Back" (serif font)
- CTA: "Continue with Google" (blue button)
- Form: Username/email + Password fields
- Color Scheme: Warm earth tones
```

**Issue:** Does not match AI Lab Catalog login or TUC branding standards.

#### **MAIN APP INTERFACE (App.tsx)**
```
Visual Pattern: Dark/Black background with blue accents
- Background: Dark gradient (black/dark blue)
- Header: Gradient icon (blue→purple)
- Recording UI: Waveform visualizer in rose/pink (#f43f5e)
- Text: White on dark background
- Accents: Blue (#3b82f6), Rose (#f43f5e)
- Color Scheme: Modern dark mode
```

**Issue:** Complete departure from login design. No visual continuity.

### 1.3 Components & UI Patterns

#### **Existing Components**
- ✅ LoginPage.tsx (Staff Portal variant)
- ✅ App.tsx (Main dictation interface)
- ✅ ProtectedRoute.tsx (Route guard)
- ✅ AuthContext.tsx (Imported from AI Lab)
- ✅ AuthGate.tsx (Unknown — not found in src/)
- ❌ No reusable component library
- ❌ No design tokens defined
- ❌ No shared button/input components

#### **Styling Approach**
- Inline Tailwind classes (no component abstraction)
- Font Awesome icons hardcoded (`<i className="fa-solid...">`)
- Custom CSS for animations (record-button, live-timer, record-waves)
- No CSS module or design system variables

### 1.4 Typography

| Element | Current | Ideal |
|---------|---------|-------|
| **Display Font** | `font-display` (undefined; likely Inter/Outfit) | Should use TUC standard (Fraunces or Outfit) |
| **Body Font** | Inter (400, 500, 600, 700) | ✅ Correct |
| **Font Weights** | Limited usage | Should establish hierarchy |
| **Line Heights** | Varies (default Tailwind) | Should standardise |

### 1.5 Accessibility (WCAG 2.1 AA)

| Audit Point | Status | Issue |
|-------------|--------|-------|
| **Keyboard Navigation** | ⚠️ Partial | Recording buttons may lack focus states |
| **Color Contrast** | ❌ Fails | Blue (#3b82f6) on dark background needs check |
| **ARIA Labels** | ✅ Present | Input fields have `aria-label` |
| **Focus Indicators** | ❌ Missing | No visible focus ring on buttons |
| **Screen Reader** | ⚠️ Unknown | Canvas waveform not accessible |
| **Dark Mode** | ✅ Yes | Built-in, but no light mode option |

### 1.6 Comparison: Dictation vs AI Lab Catalog

| Aspect | Dictation App | AI Lab Catalog | Match? |
|--------|---------------|----------------|--------|
| **Login Design** | Light brown modal | (Unknown — need to audit) | ❓ |
| **Color Palette** | Dark blue/rose | (Unknown) | ❌ |
| **Typography** | Inter + Outfit | (Unknown) | ✅ Likely |
| **Icon System** | Font Awesome + lucide | (Unknown) | ❌ Dual systems |
| **Component Library** | None | (Unknown) | ❌ |
| **Spacing System** | Ad-hoc Tailwind | (Unknown) | ❌ |

---

## PHASE 2: RECOMMEND — Proposed Improvements

### 2.1 Design System Alignment

**Goal:** Create unified design system shared across Dictation & AI Lab Catalog.

#### **Recommended Palette**
```
Primary:      #1f3864 (TUC Navy) — from Glucose app
Secondary:    #d4a373 (TUC Tan) — from Glucose app
Success:      #10b981 (Emerald)
Warning:      #f59e0b (Amber)
Error:        #ef4444 (Red)

Dark Theme BG: #0f172a (slate-900)
Light Theme BG: #ffffff

Accents:      
  - Blue:     #3b82f6
  - Rose:     #f43f5e (current, keep for recording)
```

#### **Typography System**
```
Display:      Fraunces (700) — headings
Body:         Inter (400, 500, 600) — copy
Mono:         Source Code Pro — code/transcripts
```

#### **Icon System**
**Consolidate:** Replace Font Awesome with lucide-react only
- Reason: Reduces bundle (FA: ~50KB → lucide: ~2KB)
- Consistency: Use same icons across all TUC apps

### 2.2 Component Library (New)

**Create:** `src/components/shared/` with reusable components

```
Button.tsx           (primary, secondary, ghost variants)
Input.tsx            (text, password, search)
Card.tsx             (with shadow, border, padding presets)
Modal.tsx            (login modal template)
Header.tsx           (app header with logo, user menu)
Badge.tsx            (status, tags)
Alert.tsx            (error, success, info)
```

### 2.3 Login Interface Redesign

**Current:** Light brown modal (inconsistent)
**Proposed:** Match AI Lab Catalog + TUC branding

```
Option A: Dark Mode (like main app)
- Navy background (#1f3864)
- White text
- TUC logo + branding
- OAuth + credentials form

Option B: Light Mode (modern, clean)
- White background
- Navy text
- TUC logo centered
- OAuth first, credentials secondary
- High contrast inputs

Recommend: Option B (light mode) — better accessibility,
professional appearance, matches institutional standards
```

### 2.4 Accessibility Improvements

| Issue | Fix | Priority |
|-------|-----|----------|
| Missing focus indicators | Add `focus:ring-2 focus:ring-blue-500` | 🔴 High |
| Canvas waveform not accessible | Add ARIA descriptions, alternative text | 🟡 Medium |
| Color contrast failures | Verify WCAG AA on all text/backgrounds | 🔴 High |
| Dark mode only | Add light mode toggle | 🟡 Medium |
| No keyboard shortcuts help | Add help modal (like Glucose) | 🟢 Low |

### 2.5 Code Organization Improvements

```
src/
├── components/
│   ├── shared/              ← NEW: Design system components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── LoginPage.tsx    ← REFACTOR: use shared Button, Input
│   │   └── App.tsx          ← REFACTOR: use shared Header, Card
│   └── features/
│       └── Recording/       ← NEW: Modularize recording logic
├── hooks/
│   ├── useRecording.ts      ← NEW: Extract recording logic
│   └── useTranscription.ts  ← NEW: Extract API logic
├── styles/
│   ├── design-tokens.css    ← NEW: CSS variables for palette
│   ├── theme.css            ← NEW: Light/dark mode
│   └── animations.css       ← NEW: Reusable animations
└── db.ts                    ← Refactor to use TypeScript properly
```

---

## PHASE 3: REVISE — Implementation Plan

### 3.1 Scope (High-Level)

| Item | Effort | Impact | Depends On |
|------|--------|--------|-----------|
| Create design tokens (CSS vars) | 2h | 🟡 Medium | Phase 1 |
| Build shared component library | 8h | 🔴 High | Design tokens |
| Refactor LoginPage | 2h | 🟡 Medium | Shared components |
| Refactor App.tsx header + recording UI | 3h | 🟡 Medium | Shared components |
| Add light mode support | 3h | 🟡 Medium | Design tokens |
| Accessibility audit + fixes | 2h | 🔴 High | All components |
| E2E testing | 2h | 🟡 Medium | Refactoring |
| Documentation | 1h | 🟢 Low | All phases |

**Total Estimated Time:** 23 hours (3 days @ 8h/day)

### 3.2 Implementation Roadmap

**Week 1 (Days 1-2):**
- [ ] Create design tokens (CSS variables)
- [ ] Build Button, Input, Card components
- [ ] Set up theme provider + light/dark toggle

**Week 1 (Day 3):**
- [ ] Refactor LoginPage to use shared components
- [ ] Add accessibility fixes (focus rings, labels)
- [ ] Test login flow

**Week 2 (Days 1-2):**
- [ ] Extract recording logic into `useRecording` hook
- [ ] Refactor App.tsx header to use shared Header component
- [ ] Implement light mode in main app

**Week 2 (Day 3):**
- [ ] E2E testing
- [ ] Documentation + design guide
- [ ] QA & accessibility audit

---

## PHASE 4: REGENERATE — Code Templates (Ready to Use)

### 4.1 Design Tokens (`src/styles/design-tokens.css`)

```css
:root {
  /* Colors */
  --color-primary: #1f3864;
  --color-primary-light: #2e75b6;
  --color-secondary: #d4a373;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-accent-rose: #f43f5e;
  
  /* Neutral */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-slate-50: #f8fafc;
  --color-slate-900: #0f172a;
  
  /* Typography */
  --font-display: 'Fraunces', serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'Source Code Pro', monospace;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Light Mode */
[data-theme="light"] {
  --bg-primary: var(--color-white);
  --bg-secondary: var(--color-slate-50);
  --text-primary: var(--color-slate-900);
  --text-secondary: #64748b;
}

/* Dark Mode */
[data-theme="dark"] {
  --bg-primary: var(--color-slate-900);
  --bg-secondary: #1e293b;
  --text-primary: var(--color-white);
  --text-secondary: #cbd5e1;
}
```

### 4.2 Button Component Template

```tsx
// src/components/shared/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`
        rounded-lg font-medium transition-colors
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    />
  );
}
```

### 4.3 Login Page Refactor Preview

```tsx
// src/pages/LoginPage.tsx (refactored)
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
import { Card } from '../components/shared/Card';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold">Welcome</h1>
          <p className="text-slate-500 mt-1">Sign in to continue</p>
        </div>
        
        <form className="space-y-4">
          <Button variant="secondary" className="w-full">
            Continue with Google
          </Button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or</span>
            </div>
          </div>
          
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          
          <Button variant="primary" className="w-full">
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}
```

---

## PHASE 5: REVIEW — Verification Checklist

- [ ] All components render correctly (light + dark modes)
- [ ] Keyboard navigation works on all interactive elements
- [ ] WCAG AA color contrast meets standards
- [ ] Focus indicators visible on all buttons/inputs
- [ ] Responsive on mobile, tablet, desktop
- [ ] Icons consistent (lucide-react only)
- [ ] No broken imports or missing components
- [ ] All tests passing (unit + E2E)
- [ ] Bundle size optimized (remove Font Awesome)

---

## PHASE 6: REUSE — Design System Documentation

### 6.1 Design Guide (`DESIGN_GUIDE.md`)

**To be created with:**
- Color palette usage rules
- Typography hierarchy
- Component API documentation
- Accessibility guidelines
- Code examples for each component

### 6.2 Integration with AI Lab Catalog

- Extract shared components to monorepo `packages/ui-system/`
- Export as reusable npm package
- Both Dictation + AI Lab Catalog import from shared package

---

## Summary: Next Steps

1. ✅ **Review complete** (this document)
2. 📋 **Recommend** — Design tokens + component templates provided above
3. ⏳ **Pending:** User approval to proceed with Revise/Regenerate phases

**Decision Point:** Do you want to proceed with full refactoring, or start with a minimal scope (e.g., just login page redesign)?

---

**Owner:** Daniel Frempong Twum  
**Status:** Awaiting feedback  
**Estimated Total Time:** 23 hours

---

## 6R Enhancement Pass — 9 June 2026 (dark-only studio)

A focused 6R pass run against the *current* build (the studio dark UI shipped since the
May-31 audit), triggered by a bug report: **the header theme toggle left the screen
unreadable**.

**Review.** Two stacked theme systems. Studio surfaces (`--surface-rgb`, `--studio-black`,
`--text-primary`, body bg) are hardcoded dark-only in `index.css` + `dictation-tokens.css`
with **no light override**. The 7 shared components (`Tabs`, `Alert`, `Input`, `Modal`,
`Badge`, `Button`, `Card`) use Tailwind class-based `dark:` variants keyed off the `.dark`
body class that `ThemeContext` removed on toggle. "Light" therefore flipped component text
to dark-on-dark over the still-dark panel → unreadable. A real light theme was never built.

**Decision — dark-only.** The broadcast-studio identity (gold/maroon glow, glassmorphic
dark panels, grid overlay, REC mode) has no light surfaces by design. Rather than author a
full light token set, the theme is **pinned to dark** and the toggle removed. Do not
re-introduce a theme switcher without first authoring light values for every studio surface.

**Changes.**

- `src/contexts/ThemeContext.tsx` — pinned to dark; always sets `data-theme="dark"` +
  `.dark` on body. Dropped `toggleTheme`/`setTheme`/localStorage/system-pref. With `.dark`
  permanent, the components' `dark:` variants stay active and correct (no rewrites).
- `src/components/shared/Header.tsx` — removed the Sun/Moon toggle button + dead imports.
- `index.css` — added a global `.app-container :focus-visible` ring (WCAG 2.4.7; the studio
  icon buttons previously had hover-only styling) and lifted `--text-muted` `#65738E → #8A97AE`
  so small mono labels clear AA (4.5:1) on dark panels.
- `App.tsx` — de-duplicated the title (`stripLeadingHeading` strips the polished note's
  leading `<h1>`, which repeated the title field) and removed the redundant in-panel
  `OPERATOR:` line (already shown in the header).

**Already-satisfied Rs.** Icon system is lucide-only (Font Awesome fully removed).
Typography hierarchy already consistent: Fraunces display / Inter body / JetBrains Mono labels.

**Verified.** `pnpm build` clean; dev server HTTP 200; built CSS contains the focus ring +
`#8A97AE`; toggle strings absent from the bundle.
