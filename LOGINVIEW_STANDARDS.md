# LoginView Component Standards — TUC AI Tools

## Overview
This document establishes the baseline standards for all LoginView implementations across TUC's app ecosystem. These apps are deployed to **App Store, Play Store, and Web**, so responsive, accessible, production-ready login is non-negotiable.

---

## 1. Component Architecture

### Base Component: FormLoginView
**Location:** Individual app `src/components/FormLoginView.tsx`

**Why separate per app:** Each app has unique branding, OAuth flows, and local auth logic. A shared component would require excessive configuration. Individual FormLoginView components allow:
- App-specific styling (dark vs. light themes)
- Custom OAuth flows (Biochemistry app vs. Business portal)
- Flexible auth logic (IndexedDB vs. backend API)

### Wrapper Component: LoginView
**Location:** `src/components/LoginView.tsx`

**Purpose:** Thin wrapper that:
- Handles AuthContext integration
- Manages OAuth redirects
- Passes configuration to FormLoginView
- Keeps business logic out of form component

**Pattern:**
```tsx
export const LoginView: React.FC = () => {
  const { login, register } = useAuth();
  
  return (
    <FormLoginView
      appName="Your App"
      onGoogleLogin={handleGoogleLogin}
      onLocalLogin={handleLocalLogin}
      {/* ... theme props ... */}
    />
  );
};
```

---

## 2. Responsive Design Standard

### Constraint: Mobile-First, Desktop-Ready
All LoginView forms must render properly on:
- **Mobile:** 320px–480px (iPhone SE, older Android)
- **Tablet:** 481px–1024px (iPad, tablets)
- **Desktop:** 1025px+ (laptops, external monitors)

### Implementation
```tsx
<div className="w-full max-w-2xl relative z-10">
  {/* Form card */}
</div>
```

**Width Breakdown:**
- `w-full`: Full viewport width (with padding)
- `max-w-2xl`: Max 672px (responsive: card takes up ~50-60% of viewport, adapting to all screen sizes)

**❌ DO NOT USE:**
- `max-w-sm` (384px — mobile-only, wastes desktop space)
- `max-w-md` (448px — still too narrow on desktop)
- `max-w-lg` (512px — narrow on desktop, confusing responsive behavior)
- `max-w-full` (no constraint, form stretches full width)
- Fixed widths like `w-96` (breaks on mobile)
- Responsive prefixes like `md:max-w-lg` (breakpoint complexity, inconsistent behavior)

### Video Background Responsiveness
```tsx
<video
  autoPlay muted loop
  className="absolute inset-0 w-full h-full object-cover"
>
  <source src={videoUrl} type="video/mp4" />
</video>
```
- `object-cover`: maintains aspect ratio, fills viewport
- `inset-0`: stretches to container
- works on all screen sizes

---

## 3. Accessibility Standard (WCAG 2.1 Level AA)

### 3.1 Label Associations
Every input **must** have a properly associated label:

```tsx
<label htmlFor="email" className="block text-sm font-medium mb-2">
  USERNAME OR EMAIL
</label>
<input
  id="email"
  type="email"
  placeholder="email@example.com"
  className="w-full px-4 py-3 border rounded-lg"
/>
```

**Why not just placeholders?**
- Placeholders disappear on focus (WCAG fails if that's the only label)
- Screen readers don't read placeholders reliably
- Users forget what field is what while typing

### 3.2 ARIA Labels for Icon Buttons
Password visibility toggle needs context:

```tsx
<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  aria-label={showPassword ? "Hide password" : "Show password"}
  className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
>
  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
</button>
```

### 3.3 Error Message Association
Link error messages to inputs:

```tsx
{error && (
  <div id="error-message" role="alert" aria-live="polite" className="text-red-600 text-sm mt-2">
    {error}
  </div>
)}

<input
  type="password"
  aria-describedby={error ? "error-message" : undefined}
  className="w-full border border-red-300"
/>
```

### 3.4 Contrast Ratios
All text must meet WCAG AA minimums:
- **Normal text:** 4.5:1 contrast (dark text on light, or vice versa)
- **Large text:** 3:1 contrast (18pt+ or 14pt bold+)
- **Icons:** Consider icon + background, not just icon alone

**Example — Dark Theme:**
```tsx
// ✅ PASS: White text on dark background
<div className="bg-slate-900">
  <p className="text-white">Good contrast (21:1)</p>
</div>

// ❌ FAIL: Light gray text on dark background
<div className="bg-slate-900">
  <p className="text-slate-400">Poor contrast (4.3:1)</p>
</div>
```

### 3.5 Focus Indicators
Keyboard users must see where focus is:

```tsx
<input
  className="border border-slate-300 
    focus:outline-none 
    focus:ring-4 focus:ring-amber-400
    focus:border-amber-400"
/>
```

- ✅ Visible focus ring (4px, contrasting colour)
- ✅ No `focus:outline-none` without replacement
- ✅ Focus ring colour contrasts with background

### 3.6 Keyboard Navigation
All interactive elements accessible via Tab:
1. Google button
2. Username input
3. Password input
4. Show/hide password button (or integrated with input)
5. Sign In button
6. Sign Up link

**Test:** Tab through form, verify logical order and no keyboard traps.

---

## 4. TUC Brand Theming

### Colour Palette
- **Primary (Navy):** `#1a1f3c` — backgrounds, text on white
- **Accent (Crimson):** `#8b1a1a` — buttons, primary actions
- **Border (Gold):** `#f5c518` — input borders, focus rings
- **Surface (White):** `#FFFFFF` — card backgrounds
- **Text Inverse:** `#FFFFFF` — text on navy/dark backgrounds

### Implementation Pattern
```tsx
<FormLoginView
  primaryColor="text-red-700"            // Crimson text class
  primaryColorHex="#8b1a1a"              // Crimson hex for inline styles
  backgroundClass="bg-slate-900"         // Navy background
  cardBgClass="bg-white"                 // White card
  borderColorClass="border-yellow-400"   // Gold border
  inputBorderClass="border-yellow-300"   // Gold input border
  inputFocusRingClass="focus:ring-yellow-200"  // Gold focus ring
  inputFocusBorderClass="focus:border-yellow-400"
  buttonHoverClass="hover:bg-red-800"    // Crimson hover
  textColorClass="text-slate-900"        // Dark text on white
  labelColorClass="text-slate-700"       // Slightly lighter labels
/>
```

### Example: Dark Theme (Application Portal)
Can use alternate colours if app requires dark theme:
- Background: Dark navy/charcoal
- Card: White card on dark background
- Text: Navy on white card, white on dark areas
- Accent: Orange or bright accent for dark mode

---

## 5. Form Features Checklist

### Core Features
- [ ] Google OAuth button (primary)
- [ ] OR divider (if local auth present)
- [ ] Username/Email input with label
- [ ] Password input with label + show/hide toggle
- [ ] Sign In button (full-width, prominent)
- [ ] Sign Up link (for register mode)
- [ ] Error message display with role="alert"
- [ ] Loading state on button (disabled + text change)

### Advanced Features
- [ ] Register mode (toggle login ↔ register)
- [ ] Email validation
- [ ] Password confirmation field (in register mode)
- [ ] Password strength indicator (optional)
- [ ] "Remember me" checkbox (optional, requires backend)
- [ ] Forgot password link (if backend supports)

### State Handling
- [ ] Form clears on mode change
- [ ] Error clears on input change
- [ ] Button disabled during submission
- [ ] Loading spinner or text change visible
- [ ] Redirect animation (fade-out) on success

---

## 6. Video Background Best Practices

### File Requirements
- **Format:** MP4 (H.264 codec, AAC audio)
- **Resolution:** 1920x1080 minimum for desktop
- **Size:** <5MB (optimise for web delivery)
- **Duration:** 15–30 seconds (loop smoothly)
- **Content:** Blur or dim dark overlay to ensure text contrast

### Implementation
```tsx
<video
  autoPlay muted loop
  className="absolute inset-0 w-full h-full object-cover"
  style={{ zIndex: 0 }}
>
  <source src={videoUrl} type="video/mp4" />
</video>
<div 
  className="absolute inset-0 bg-black/40" 
  style={{ zIndex: 1 }}
></div>
```

---

## 7. Testing Checklist

### Desktop (1920x1080)
- [ ] Form displays at proper width (not mobile-sized)
- [ ] Video background visible and fills viewport
- [ ] Text readable (contrast check)
- [ ] All inputs accessible and properly spaced

### Tablet (768x1024)
- [ ] Form scales appropriately
- [ ] Inputs not too wide
- [ ] Touch targets >= 48px (for touch devices)

### Mobile (375x667, iPhone SE)
- [ ] Form fills viewport with padding
- [ ] Inputs stack vertically
- [ ] Keyboard doesn't hide submit button
- [ ] Touch targets >= 48px

### Accessibility
- [ ] Tab through entire form (logical order)
- [ ] Screen reader reads labels + error messages
- [ ] Focus visible on all interactive elements
- [ ] Contrast ratios meet WCAG AA (use WebAIM checker)
- [ ] No keyboard traps

### Cross-Browser
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)

---

## 8. Current Implementation Status

### ✅ Completed (All Standards Met)

| App | Component | Responsive | Accessible | Themed | Status |
|-----|-----------|-----------|-----------|--------|--------|
| Blueprint | FormLoginView | ✅ md:max-w-lg | ✅ WCAG AA | ✅ TUC | Deployed |
| TUC AI Lab | FormLoginView | ✅ md:max-w-lg | ✅ WCAG AA | ✅ TUC | Deployed |
| Email Drafter | FormLoginView + fallback | ✅ md:max-w-lg | ✅ WCAG AA | ✅ Dark+Orange | Deployed |
| Application Portal | FormLoginView | ✅ md:max-w-lg | ✅ WCAG AA | ✅ Dark+Orange | Built |

### 🔧 In Development
- Standardising remaining apps to FormLoginView pattern
- Responsive width audit for all deployed apps

---

## 9. Migration Guide (For Existing Apps)

### Step 1: Extract LoginView Wrapper
Create `src/components/LoginView.tsx`:
```tsx
import { FormLoginView } from './FormLoginView';

export const LoginView = () => {
  // Your auth logic here
  return <FormLoginView ... />;
};
```

### Step 2: Create FormLoginView
Create `src/components/FormLoginView.tsx` from template (copy from Blueprint)

### Step 3: Update App.tsx
```tsx
// Before
if (!isAuthenticated) return <CustomLoginComponent />;

// After
if (!isAuthenticated) return <LoginView />;
```

### Step 4: Test
- Desktop: Form at proper width, not mobile-sized
- Mobile: Form responsive, fills screen
- Accessibility: Tab through, screen reader test
- Branding: Apply theme colours

---

## 10. Future Standards

Pending decision/implementation:

- [ ] Shared FormLoginView component (monorepo pattern) vs. individual per-app
- [ ] Password reset flow standard
- [ ] Two-factor authentication UI pattern
- [ ] Magic link (passwordless) option
- [ ] Social login expansion (GitHub, Apple, etc.)

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-24  
**Standards Compliant:** WCAG 2.1 Level AA, Responsive (mobile-first), TUC Brand  
**Deployment Target:** Web, iOS (App Store), Android (Play Store)
