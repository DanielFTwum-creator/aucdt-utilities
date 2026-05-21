# Login Pages Standardization Audit

## 4 Recent Implementations Compared

### 1. **Blueprint** (Light Theme)
```
Background:     gradient-to-br from-slate-50 to-slate-100
Card:          bg-white, rounded-2xl, shadow-xl, border-blue-200
Title:         text-3xl font-bold text-blue-700
Form:          space-y-4, text-xs labels, uppercase tracking-wider
Inputs:        border border-slate-300, rounded-xl, focus:ring-4 focus:ring-blue-100
Button:        bg-blue-600 text-white, hover:bg-blue-700, rounded-2xl
Google Button: After form divider "Or", w-full, border-2 border-slate-300, flex items-center justify-center gap-3
Colors:        Blue primary (#3b82f6), Slate grays, White
Icons:         UserIcon, Lock, Phone (left-aligned in inputs)
```

### 2. **BiochemAI** (Dark Theme - Glassmorphic)
```
Background:     min-h-screen bg-[#0a0f1e] (dark blue) + molecular watermark SVG
Card:          glassmorphic - rgba(255, 255, 255, 0.05), backdrop-filter blur(12px), border rgba(167, 139, 250, 0.2)
Title:         text-5xl font-black text-[#a78bfa] (purple)
Form:          space-y-4, text-[0.7rem] labels, uppercase tracking-[0.06em]
Inputs:        rgba(255, 255, 255, 0.06) bg, border rgba(255, 255, 255, 0.1), rounded-[10px]
Button:        (need to check full button styling)
Google Button: (need to check positioning)
Colors:        Purple accent (#a78bfa), Dark blue bg, White text
Icons:         UserIcon, Lock (left-aligned in inputs)
Watermark:     Custom SVG molecular pattern (benzene rings, orbital rings)
```

### 3. **WillPro** (Light Theme - Minimal)
```
Background:     min-h-screen flex items-center justify-center bg-gray-50
Card:          bg-white, rounded-2xl, shadow-lg, p-8
Title:         text-2xl font-bold text-gray-900
Form:          space-y-4
Inputs:        border border-gray-300, rounded-lg, focus:ring-2 focus:ring-[#630f12]
Button:        bg-[#630f12] text-white, hover:bg-[#7a1317], py-3.5 px-4, rounded-lg
Google Button: After form divider "Or", w-full, border-2 border-gray-300, flex items-center justify-center gap-3
Colors:        Maroon primary (#630f12), Gray, White, Yellow accent (#ffcb05)
Icons:         Lock (in header), Google SVG
Logo:          "Staff Portal" text with lock icon in #630f12/#ffcb05
```

### 4. **Email-Drafter** (Similar to WillPro)
```
Not yet reviewed - likely follows WillPro pattern
```

---

## Key Differences

| Aspect | Blueprint | BiochemAI | WillPro |
|--------|-----------|-----------|---------|
| **Theme** | Light (gradient bg) | Dark (dark blue bg) | Light (plain gray bg) |
| **Card Style** | White with border | Glassmorphic + blur | White with shadow |
| **Primary Color** | Blue (#3b82f6) | Purple (#a78bfa) | Maroon (#630f12) |
| **Inputs** | border-slate-300, ring-blue-100 | rgba(255,255,255,0.1), ring-purple | border-gray-300, ring-maroon |
| **Button Radius** | rounded-2xl | (TBD) | rounded-lg |
| **Google Button** | OUTSIDE form (my fix) | OUTSIDE form | OUTSIDE form |
| **Decorative BG** | None | Molecular watermark SVG | None |
| **Input Icons** | Always left-aligned | Always left-aligned | N/A in login |
| **Label Size** | text-xs | text-[0.7rem] | text-sm |
| **Spacing** | space-y-4 | space-y-4 | space-y-4 |

---

## Issues Found

1. ✅ **Google Button Position** - FIXED in Blueprint (was inside form, now outside)
2. ❌ **Inconsistent Color Schemes** - Each app uses different primary colors
3. ❌ **Inconsistent Input Styling** - Border widths, focus rings differ
4. ❌ **Typography Inconsistency** - Label sizes: xs vs 0.7rem vs sm
5. ❌ **Card Styling Varies** - White+border vs Glassmorphic vs Shadow
6. ❌ **Rounded Corner Sizes** - rounded-lg vs rounded-2xl vs rounded-[10px]

---

## Recommendation: Unified Standard

### Proposed "TUC OAuth Login" Component

```tsx
// Standard TUC Login Template
interface TUCLoginConfig {
  appName: string;           // "Blueprint", "BiochemAI", etc
  primaryColor: string;      // Brand color (--color-brand)
  logoIcon?: React.ReactNode;
  backgroundVariant?: 'light' | 'dark' | 'glassmorphic'; // default: 'light'
}

// Standard Layout:
<div className="min-h-screen bg-[gradient|solid|dark] flex items-center justify-center p-6">
  <div className="w-full max-w-sm">
    {/* Header */}
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-[primary]">{appName}</h1>
      <p className="text-[secondary] text-sm">{subtitle}</p>
    </div>

    {/* Card */}
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-[primary]/20">
      <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
      <p className="text-center text-[secondary] text-sm mb-6">Sign in to continue</p>

      <form className="space-y-4">
        {/* Email/Username Input */}
        <div>
          <label className="block text-xs font-bold text-[textprimary] mb-2 uppercase tracking-wider">
            Email or Username
          </label>
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input className="w-full border border-gray-300 rounded-xl px-4 py-3.5 pl-12 focus:ring-4 focus:ring-[primary]/20 focus:border-[primary]" />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-xs font-bold text-[textprimary] mb-2 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="password" className="w-full border border-gray-300 rounded-xl px-4 py-3.5 pl-12 focus:ring-4 focus:ring-[primary]/20 focus:border-[primary]" />
          </div>
        </div>

        {/* Sign In Button */}
        <button className="w-full bg-[primary] text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition">
          Sign In
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-gray-500 text-xs uppercase font-semibold">Or</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Google OAuth Button - OUTSIDE FORM */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl font-medium hover:bg-gray-50 flex items-center justify-center gap-3"
      >
        <GoogleSVG />
        Continue with Google
      </button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-[secondary] mt-6">
        Don't have an account? <button className="text-[primary] font-bold hover:underline">Sign up</button>
      </p>
    </div>
  </div>
</div>
```

---

## Standardization Checklist

- [ ] Create `shared/components/StandardLoginView.tsx` 
- [ ] Define CSS variables for all 4 apps' colors
- [ ] Extract to reusable component with `TUCLoginConfig`
- [ ] Apply to: Blueprint, BiochemAI, WillPro, Email-Drafter
- [ ] Document in PATTERNS.md
- [ ] Ensure OAuth button is ALWAYS outside form
- [ ] Ensure consistent typography (text-xs labels, text-2xl titles)
- [ ] Ensure consistent spacing (space-y-4 between inputs)
- [ ] Ensure consistent input styling (rounded-xl, border-gray-300)
- [ ] Ensure all use authorization-code flow (no implicit flow)

---

## Priority Fixes

1. **HIGH**: Standardize input styling across all 4 apps
2. **HIGH**: Ensure OAuth button positioning consistency (outside form)
3. **MEDIUM**: Unify typography sizes
4. **MEDIUM**: Create shared LoginView component
5. **LOW**: Consider glassmorphic option for dark-theme apps

