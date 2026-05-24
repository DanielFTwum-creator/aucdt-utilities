# Immediate Fixes Required — Session End Summary
**Date:** 2026-05-24  
**Priority:** Critical path issues blocking production deployment

---

## 1. CACHE BUSTING — Users See Old Code Without Hard Refresh ⚠️

### Problem
When Blueprint is redeployed with `max-w-2xl` responsive width fix, users visiting the old URL see cached `index.html` from their browser. They need to do Ctrl+Shift+R (hard refresh) to see the new code.

### Root Cause
- Vite's JS/CSS bundles are **already hashed** and cache-busted (`index-B9m_X_Sx.css` changes per build)
- But `index.html` itself is **not hashed** and caches for a long time
- Browser loads old `index.html` → references old bundle hash → loads old CSS/JS

### Solution: Add Cache-Control Headers
Every app's `.htaccess` should instruct browsers:
- **"Never cache index.html"** — Always check for fresh version
- **"Always cache versioned assets"** — Hash-named files are never updated

**Implementation (add to all 95 apps):**

```apache
# .htaccess in each app's deploy root
<Files "index.html">
    Header set Cache-Control "no-cache, must-revalidate, max-age=0"
    Header set Pragma "no-cache"
</Files>

<FilesMatch "\.(js|css|svg|woff2)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>
```

**Current Status:** 
- Blueprint deploy script creates `.htaccess` but doesn't set Cache-Control headers
- Need to update deploy.ps1 template across all apps

**Action:** Modify deploy script to generate proper cache headers (5 mins per app × 95 apps = defer to batch session).

---

## 2. GLUCOSE — OAuth Redirect URI Mismatch ❌

### Problem
Glucose login redirects to Google OAuth, but gets **Error 400: redirect_uri_mismatch**

```
Request details: redirect_uri=https://ai-tools.techbridge.edu.gh/glucose/auth/google/callback
flowName=GeneralOAuthFlow
```

Google Cloud Console has a different redirect URI registered.

### Root Cause
Glucose's `.env.local` has wrong `VITE_GOOGLE_REDIRECT_URI` or uses fallback that doesn't match registered URI.

### Solution
1. Check what's registered in Google Cloud Console for the OAuth app
2. Update Glucose's `.env.local` with correct URI
3. Redeploy and test OAuth flow

**Action:** 
```bash
cd glucose
# Check current .env.local
cat .env.local | grep REDIRECT

# Should be one of:
# Option A: https://ai-tools.techbridge.edu.gh/glucose/auth/google/callback
# Option B: https://ai-tools.techbridge.edu.gh/glucose/callback
# (depending on what's registered)

# Update to match Google Console registration
# Then redeploy: ./deploy.ps1 -Build
```

**Time estimate:** 15 mins (figuring out correct URI + redeploy)

---

## 3. GLUCOSE — classList Null Reference Error ❌

### Problem
Console error: `Uncaught TypeError: Cannot read properties of null (reading 'classList')`  
Location: `glucose/:132`

This is the same error we fixed in BiochemAI and Glucose earlier, but it's back in the deployed version.

### Root Cause
Either:
1. The fix wasn't actually deployed (old code still live)
2. The fix was lost during a rebuild
3. There's another classList call we didn't catch

### Solution
1. Check Glucose's `index.html` around line 132
2. Verify all `document.body.classList` calls are wrapped in null checks
3. Rebuild and redeploy

**Action:**
```bash
cd glucose
grep -n "classList" index.html
# Should show null-safe patterns like: if (document.body) { ... classList ... }

# If not safe, fix and redeploy
./deploy.ps1 -Build
```

**Time estimate:** 10 mins

---

## 4. TECHNICAL DEBT — 122 Problems in VS Code ⚠️

### Problem
VS Code Problems panel shows 122 issues, mostly:
- **Duplicate Android projects** (Capacitor created multiple `android/` folders)
- **Missing Gradle settings** (Java build config errors)
- **CSS compatibility warnings** (backdrop-filter, meta[theme-color] not supported)

### Impact
- **Blocking:** None (code runs fine despite warnings)
- **Annoying:** Clutters problems panel, hard to spot real errors
- **Future:** Indicates incomplete Capacitor setup for iOS/Android builds

### Root Cause
Capacitor was added to multiple apps (biochemai, luxthumb-agent, etc.) but:
1. Multiple apps created `android/` folders in same parent → duplicates
2. Gradle wasn't configured properly
3. CSS features used in code aren't supported by target browsers

### Solution: Multi-phase cleanup

**Phase 1 (This session): Stop creating more duplicates**
- Don't run `npx cap add android` on any more apps
- Document which apps actually need mobile builds (likely just 5–10)

**Phase 2 (Next session): Consolidate mobile setup**
- Move Capacitor to monorepo root
- Single `android/` and `ios/` folder shared by all apps that need mobile
- Configure Gradle once, reference from all apps

**Phase 3: Remove CSS warnings**
- Use CSS fallbacks (e.g., `@supports (backdrop-filter)`)
- Or accept warnings as "known limitations on older browsers"

**Time estimate:** 
- Phase 1: Skip (just don't add more)
- Phase 2: 3–4 hours (monorepo refactor)
- Phase 3: 1–2 hours (CSS fixes)

**Immediate action:** Skip Capacitor setup for remaining 85 apps. Focus on core LoginView standardisation first.

---

## 5. LOGINVIEW RESPONSIVE WIDTH — NOW FIXED ✅

### Status: Complete
- ✅ Blueprint updated to `max-w-2xl` (672px) and deployed
- ✅ TUC AI Lab updated and deployed
- ✅ Cypress screenshot captured at 19:50 UTC confirms wide form

### Next: Apply to All 95 Apps
Standard for all LoginView implementations:
```tsx
<div className="w-full max-w-2xl relative z-10">
  {/* Form card */}
</div>
```

**Migration path:**
1. Use Blueprint's FormLoginView as reference template
2. Copy pattern to each app's LoginView wrapper
3. Test on desktop (1280px), tablet (768px), mobile (375px)
4. Deploy and validate via Cypress

**Time estimate:** 30 mins per app in a batch (10 apps = 5 hours with parallel deploys)

---

## Session Summary — What's Done vs. What's Left

### ✅ Completed This Session
- LoginView standardisation documentation (LOGINVIEW_STANDARDS.md — 2000 lines)
- FormLoginView component pattern (responsive, accessible, branded)
- Cypress E2E test suite (60+ apps, automated screenshots)
- Blueprint responsive width fix (max-w-2xl, deployed)
- Dictation app vite.config.ts (fixed CSS bundling)
- BiochemAI/Glucose classList fixes (in source code)
- TUC AI Lab catalog enhancements (glucose featured, nav links removed)
- Session lessons codified (SESSION_LESSONS_LEARNED.md)
- Blueprint revision checklist (BLUEPRINT_REVISION_CHECKLIST.md)

### ⚠️ Critical Issues Left
1. **Cache busting** — .htaccess headers not set (all apps affected)
2. **Glucose OAuth** — Redirect URI mismatch (Glucose only)
3. **Glucose classList** — Error still in deployed version (Glucose only)

### 🔧 Tech Debt
- 122 warnings from Capacitor Android duplicates (non-blocking, can defer)
- CSS compatibility warnings (non-blocking, can defer)

### 📋 Next Session Priorities
1. Fix Glucose OAuth URI + redeploy
2. Add Cache-Control headers to all .htaccess files
3. Apply FormLoginView pattern to 20 more apps
4. Resolve remaining 6 Cypress test failures

---

## Quick Fix Checklist

Run these immediately after this session ends:

```bash
# 1. Fix Glucose OAuth
cd glucose
# Check .env.local, update redirect URI
# ./deploy.ps1 -Build

# 2. Fix Glucose classList (if still present)
grep -n "classList" index.html
# Add null checks if needed
# pnpm build && ./deploy.ps1 -Build

# 3. Verify Blueprint width live
# Visit https://ai-tools.techbridge.edu.gh/blueprint/ in browser
# Inspect DevTools → form should be ~600–650px wide, not 380–400px

# 4. Run Cypress for confirmation
# npx cypress run --spec "cypress/e2e/screenshot-all-apps.cy.js"
# Check 1-blueprint.png and 35-ai-lab.png for proper desktop width
```

---

**End of session:** 2026-05-24 19:50 UTC  
**Next session focus:** Cache busting + Glucose fixes + scale FormLoginView to 20 more apps  
**Est. time to full production compliance:** 2–3 more sessions (15–20 hours)
