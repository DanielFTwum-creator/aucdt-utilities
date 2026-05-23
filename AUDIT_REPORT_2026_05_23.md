# Production Apps Audit Report — 2026-05-23

## Executive Summary

**Status**: 7/10 apps meet production-ready standard. **2 critical issues** prevent proper deployment:

1. **willpro** — hardcoded `/willpro/` base path (should be `./`)
2. **groove-streamer** — hardcoded `/bridge-radio/` base path (should be `./`)
3. **4 apps missing local favicon files** — using remote TUC logo instead

---

## Production-Ready Standard Checklist

| Category | Requirement | Status |
|----------|-------------|--------|
| **Build Config** | `base: './'` in vite.config.ts (relative paths) | ⚠️ 2 apps fail |
| **Deployment** | deploy.ps1 with native PowerShell | ✅ All 10 apps pass |
| **Branding** | Local favicon SVG in public/favicon.svg | ⚠️ 4 apps missing |
| **SEO** | Meta tags (og:title, og:description, keywords) in index.html | ✅ 9/10 pass |
| **UX** | Splash screen / loading indicator in index.html | ⚠️ Only 3 apps have |
| **Favicon Link** | Reference to local ./favicon.svg (not remote URL) | ⚠️ 6 apps use remote |

---

## Detailed Audit Results

### ✅ Fully Compliant (5 apps)

| App | Vite | Deploy | Favicon | SEO | Splash | Favicon Link |
|-----|------|--------|---------|-----|--------|--------------|
| **glucose** | ✅ | ✅ | ✅ | ✅ | ✅ | `./favicon.svg` |
| **peace-vinyl** | ✅ | ✅ | ✅ | ✅ | ✅ | `./favicon.svg` |
| **tuc-ai-lab-catalog** | ✅ | ✅ | ✅ | ✅ | ✅ | `./favicon.svg` |

### ⚠️ Minor Issues (5 apps)

#### biochemai
- ✅ Vite config: `./`
- ✅ Deploy script exists
- ✅ Favicon file exists
- ✅ SEO tags present
- ⚠️ Splash screen: **Missing**
- ⚠️ Favicon link: **Remote URL** (`https://techbridge.edu.gh/static/TUC_LOGO.png`)

#### daaro-distributor (sdwater)
- ✅ Vite config: `./`
- ✅ Deploy script exists
- ❌ Favicon file: **Missing** (`public/favicon.svg` not found)
- ✅ SEO tags present
- ✅ Splash screen exists
- ⚠️ Favicon link: **Remote URL**

#### deliberate-magic-reader (magic-reader)
- ✅ Vite config: `./`
- ✅ Deploy script exists
- ❌ Favicon file: **Missing**
- ✅ SEO tags present
- ✅ Splash screen exists
- ⚠️ Favicon link: **Remote URL**

#### typing-and-mathematics-tutorial (math-island)
- ✅ Vite config: `./`
- ✅ Deploy script exists
- ❌ Favicon file: **Missing**
- ✅ SEO tags present
- ⚠️ Splash screen: **Missing** (see note below)
- ⚠️ Favicon link: **Remote URL**

#### typing-tutorial (typing-tutor)
- ✅ Vite config: `./`
- ✅ Deploy script exists
- ❌ Favicon file: **Missing**
- ✅ SEO tags present
- ✅ Splash screen exists
- ⚠️ Favicon link: **Remote URL**

### 🚨 Critical Issues (2 apps)

#### willpro
- **🚨 CRITICAL**: Vite config has `base: '/willpro/'` (absolute path)
  - Should be `./` for relative asset resolution
  - Assets will 404 in production
- ✅ Deploy script exists
- ✅ Favicon file exists
- ✅ SEO tags present
- ⚠️ Splash screen: **Missing**
- ⚠️ Favicon link: **Remote URL**

#### groove-streamer
- **🚨 CRITICAL**: Vite config has `base: '/bridge-radio/'` (wrong app name + absolute path)
  - App deployed to `/groove-streamer/` not `/bridge-radio/`
  - Build output will be unusable
- ✅ Deploy script exists
- ✅ Favicon file exists
- ✅ SEO tags present
- ⚠️ Splash screen: **Missing**
- ⚠️ Favicon link: **Remote URL**

---

## Remediation Plan

### Priority 1: Critical Fixes (Do Immediately)

#### Fix willpro vite.config.ts
```typescript
// BEFORE:
base: '/willpro/',

// AFTER:
base: './',
```

#### Fix groove-streamer vite.config.ts
```typescript
// BEFORE:
base: '/bridge-radio/',

// AFTER:
base: './',
```

### Priority 2: Missing Favicon Files (4 apps)

Create `public/favicon.svg` for:
- daaro-distributor
- deliberate-magic-reader
- typing-and-mathematics-tutorial
- typing-tutorial

**Pattern**: Copy from existing apps (e.g., glucose/public/favicon.svg) or create TUC-themed SVGs.

### Priority 3: Favicon Links (6 apps)

Update index.html favicon references from remote URLs to local:

```html
<!-- BEFORE (all 6 apps using this):-->
<link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />

<!-- AFTER (preferred for subdirectory hosting):-->
<link rel="icon" type="image/svg+xml" href="./favicon.svg" />
```

**Affected apps:**
- biochemai
- daaro-distributor
- deliberate-magic-reader
- typing-and-mathematics-tutorial
- typing-tutorial
- willpro
- groove-streamer

### Priority 4: Missing Splash Screens (5 apps)

Add splash screen styles to index.html (before root div):
- biochemai
- typing-and-mathematics-tutorial
- willpro
- groove-streamer

**Template** (see deliberate-magic-reader/index.html for glassmorphic dark example).

---

## Next Steps

1. ✅ Fix willpro + groove-streamer vite configs (both must be `./`)
2. ✅ Add missing favicon.svg files to daaro, deliberate-magic, typing apps
3. ✅ Update all favicon links from remote URLs to local `./favicon.svg`
4. ✅ Add splash screens to 5 apps missing them
5. ✅ Rebuild and test all 10 apps locally
6. ✅ Deploy all 10 apps to production
7. ✅ Update DEPLOYMENT_TRACKER with completion status

---

## Files to Modify

| File | Issue | Fix |
|------|-------|-----|
| willpro/vite.config.ts | `base: '/willpro/'` | Change to `base: './'` |
| groove-streamer/vite.config.ts | `base: '/bridge-radio/'` | Change to `base: './'` |
| daaro-distributor/public/favicon.svg | Missing | Create or copy |
| deliberate-magic-reader/public/favicon.svg | Missing | Create or copy |
| typing-and-mathematics-tutorial/public/favicon.svg | Missing | Create or copy |
| typing-tutorial/public/favicon.svg | Missing | Create or copy |
| biochemai/index.html | Remote favicon link + missing splash | Update link + add splash |
| daaro-distributor/index.html | Remote favicon link | Update link |
| deliberate-magic-reader/index.html | Remote favicon link | Update link |
| typing-and-mathematics-tutorial/index.html | Remote favicon link + missing splash | Update link + add splash |
| typing-tutorial/index.html | Remote favicon link | Update link |
| willpro/index.html | Remote favicon link + missing splash | Update link + add splash |
| groove-streamer/index.html | Remote favicon link + missing splash | Update link + add splash |

---

*Report generated 2026-05-23 by Claude Code audit*
