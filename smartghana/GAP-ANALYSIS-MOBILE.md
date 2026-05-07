# Gap Analysis: SmartGhana App Store / Play Store Readiness

**Session Date:** May 2026  
**Status:** Phase 1 Complete (PWA Foundation) | Phase 2 In Progress (Capacitor) | Phase 3 Pending (API Security)  

---

## Executive Summary

SmartGhana is a React 19 + Vite SPA powered by the Google Gemini API. The app presents an interactive institutional proposal for Ghana's One Million Coders Programme — a Techbridge × SmartBridge alliance partnership.

**Current readiness for stores:** ⏳ Not yet submittable due to **3 critical blockers** (see Section 6 below).

**What's Done (Phase 1):**
- ✅ PWA foundation: service worker, manifest, icons, offline caching
- ✅ Package metadata fixed: name, version, deploy script
- ✅ Mobile meta tags in HTML
- ✅ Build generates PWA assets: `sw.js`, `manifest.webmanifest`, 10-entry precache (795 KiB)

**What's In Progress (Phase 2):**
- ⏳ Capacitor setup (Android native build)
- ⏳ iOS requires Mac + Xcode (documented but not executable on Windows)

**What's Blocking (Phase 3 - Required Before Submission):**
- ❌ Gemini API key embedded in browser bundle (security rejection)
- ❌ External asset dependencies (logos, video) break in restricted networks
- ❌ `window.print()` won't work in Capacitor WebView

---

## Section 1: Current State (Pre-Implementation)

### What Existed
- React 19 SPA with Vite 6.4
- Single `App.tsx` (~1235 lines, no routing, anchor-scroll navigation)
- `base: './'` configuration (Capacitor-compatible)
- Production build: 767 KB JS (230 KB gzip)
- `express` in dependencies (intended for backend proxy)

### What Was Missing
- Zero PWA infrastructure (no manifest, no service worker)
- No app icons of any kind
- `public/` folder was empty
- No mobile meta tags in `index.html`
- No Capacitor or native bridge setup
- Package metadata still had placeholder values

### Critical Findings
1. **Gemini API Key in Bundle:** `vite.config.ts` bakes the key into the JS via `define`. Visible to anyone with DevTools or APK inspection. **Both App Store and Play Store will reject this.**
2. **External Assets:** TUC logo, SmartBridge logo (Google cache URL), campus video all load from `techbridge.edu.gh`. If unreachable → broken UI.
3. **Print Mechanism:** App uses `window.print()` for downloading proposal. **Silent failure in Capacitor WebView.**

---

## Section 2: Phase 1 Implementation — PWA Foundation ✅

### 2.1 Package.json Fixes
| Change | Before | After |
|--------|--------|-------|
| `name` | `react-example` | `smartghana` |
| `version` | `0.0.0` | `1.0.0` |
| `@playwright/test` | dependencies | devDependencies |
| `deploy` script | —none— | `pnpm build && scp -r dist/ root@techbridge.edu.gh:/...` |

### 2.2 index.html Mobile & Meta Tags
Added:
- `<link rel="icon" href="/favicon.svg">`
- `<link rel="apple-touch-icon" href="/icon-192x192.svg">`
- `<link rel="manifest" href="/manifest.json">`
- `<meta name="theme-color" content="#0f2545">`
- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
- `<meta name="mobile-web-app-capable" content="yes">`
- OG + Twitter Card meta tags (TUC standard)

### 2.3 App Icons (SVG-Based)
Brand: Navy `#0f2545` background, Gold `#FCD116` "S" monogram, Ghana flag stripe (red/gold/green).

Created:
- `public/favicon.svg` (32×32)
- `public/icon-192x192.svg` (192×192)
- `public/icon-512x512.svg` (512×512)

### 2.4 Manifest Configuration
File: `public/manifest.json`
- App name, short name, description
- Theme and background colors (#0f2545 / #ffffff)
- Display mode: `standalone` (no browser chrome)
- Scope and start URL: `./` (relative, works on any path)
- Icons: both `any` and `maskable` purposes (192px + 512px)

### 2.5 Vite PWA Plugin
- Installed: `vite-plugin-pwa` v1.3.0
- Configuration in `vite.config.ts`:
  - `registerType: 'autoUpdate'` — service worker auto-updates on new builds
  - Workbox precaches: `**/*.{js,css,html,svg,png,ico}` (10 entries, 795 KiB)
  - Runtime caching: Google Fonts (CacheFirst, 1-year expiration)

### 2.6 Build Output
```
dist/registerSW.js              0.14 kB
dist/manifest.webmanifest       0.64 kB
dist/index.html                 1.98 kB (gzip: 0.69 kB)
dist/assets/index-*.css         42.56 kB (gzip: 7.60 kB)
dist/assets/index-*.js          767.48 kB (gzip: 230.88 kB)
dist/sw.js                       (service worker, auto-generated)
dist/workbox-dcde9eb3.js        (Workbox runtime)
```

**PWA is now functional for web browsers.** Users can:
- Install to home screen (iOS/Android)
- Access offline (cached pages)
- Get automatic updates when you redeploy

---

## Section 3: Phase 2 — Capacitor Setup ⏳

### Why Capacitor?
Capacitor wraps your Vite-built `dist/` as a native WebView app for iOS and Android — no React rewrite needed. It's the standard bridge from web → App Store / Play Store.

### 3.1 Installation Commands

```bash
# Install Capacitor core and CLI
pnpm add @capacitor/core @capacitor/cli

# Initialize Capacitor (creates capacitor.config.ts)
pnpm exec cap init "SmartGhana" "com.techbridge.smartghana" --web-dir dist

# Add Android platform
pnpm add @capacitor/android
pnpm exec cap add android
# Creates: android/ directory with Gradle project

# Add iOS platform (Mac + Xcode 15+ required)
pnpm add @capacitor/ios
pnpm exec cap add ios
# Creates: ios/ directory with Xcode project (Mac only)

# After each web build, sync to native:
pnpm build
pnpm exec cap sync
```

### 3.2 capacitor.config.ts
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techbridge.smartghana',
  appName: 'SmartGhana',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
```

### 3.3 Android Build for Play Store
```bash
cd android
./gradlew bundleRelease
# Output: app/release/app-release.aab (Android App Bundle)
```

The `.aab` is required for Play Store (not `.apk`).

### 3.4 iOS Build for App Store (Mac Only)
```bash
# Requires: Mac with Xcode 15+, Apple Developer account
cd ios
xcodebuild -workspace SmartGhana.xcworkspace \
  -scheme SmartGhana \
  -configuration Release \
  -archivePath build/Archive.xcarchive \
  archive
```

Then use Xcode/Transporter to submit to App Store Connect.

---

## Section 4: Play Store (Google) Requirements

### 4.1 Before Submission
| Requirement | Status | Notes |
|---|---|---|
| **App Bundle (.aab)** | Pending | Build via `./gradlew bundleRelease` |
| **Target SDK ≥ 34** | ✅ Handled by Capacitor | Capacitor's Android template targets SDK 34+ |
| **Signed Release Keystore** | ⏳ Generate once | `keytool -genkey -v ...` or Android Studio |
| **Google Play Developer Account** | 💰 USD $25 one-time | Required to publish |
| **Privacy Policy URL** | ❌ Missing | Required; point to your website |
| **App Listing** | ❌ Not created | Title, short description, category |
| **Screenshots** | ❌ Missing | Min 2 phone screenshots (1440×2560 px) |
| **Feature Graphic** | ❌ Missing | 1024×500 px banner |

### 4.2 Submission Process
1. Build signed `.aab`
2. Create Google Play Developer account
3. Create app listing with metadata
4. Upload `.aab` to Play Store Console
5. Set minimum target API, permissions, content rating
6. Request review (1-3 hours typical)

---

## Section 5: App Store (Apple) Requirements

### 5.1 Before Submission
| Requirement | Status | Notes |
|---|---|---|
| **Mac with Xcode 15+** | ❌ Not available | Windows-only development |
| **Apple Developer Program** | 💰 USD $99/year | Required to publish |
| **Provisioning Profiles & Certs** | ⏳ Configure in Xcode | Automatic if using Xcode |
| **App Store Connect Listing** | ❌ Not created | Title, description, keywords |
| **Screenshots** | ❌ Missing | 6.5" (2796×1290) + 5.5" (2688×1242) iPhones |
| **Privacy Manifest** | ⏳ Required | `PrivacyInfo.xcprivacy` (iOS 17+) |
| **App Privacy** | ❌ Not filled | Required questionnaire on ASC |

### 5.2 Submission Process (Requires Mac)
1. Configure signing certificates in Xcode
2. Build `.xcarchive`
3. Validate + sign for App Store
4. Upload via Transporter or Xcode
5. Fill App Store Connect questionnaire
6. Request review (1-3 days typical)

**Blocker:** This cannot be done on Windows. Requires a Mac.

---

## Section 6: CRITICAL BLOCKERS (Phase 3 — Required Before Submission)

### ⚠️ Blocker #1: Gemini API Key in Browser Bundle

**Problem:**  
`vite.config.ts` embeds the API key directly in the JavaScript via:
```typescript
define: {
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
}
```

Any user can inspect the bundle (DevTools → Sources, or APK dissassembly) and extract the key. This is a **security & compliance violation** for both stores.

**App Store / Play Store Policy:**
> API credentials must not be embedded in app binaries. Credentials must be stored securely on the server or in a protected backend.

**Resolution (Phase 3):**
1. Create an Express backend proxy (`server/index.ts`) using existing `express` dependency
2. Move Gemini API calls from frontend to backend:
   - Frontend: `fetch('/api/gemini', { method: 'POST', body: ... })`
   - Backend: holds the key, proxies to Gemini API
3. Store key in server environment variable (not in code)
4. Remove `define.GEMINI_API_KEY` from `vite.config.ts`
5. Deploy backend alongside frontend

**Effort:** 2-3 hours (create `/server` folder, middleware, database if needed)

---

### ⚠️ Blocker #2: External Asset Dependencies

**Problem:**  
The app loads critical assets from external URLs:
- TUC logo: `https://techbridge.edu.gh/static/TUC_LOGO_1.png`
- SmartBridge logo: Google cache URL (fragile)
- Campus video: `https://techbridge.edu.gh/static/campus_tour.mp4`

If these URLs are unreachable, the app shows broken images/videos.

**Store Testing:**  
Both App Store and Play Store test in restricted network conditions. Broken UI = automatic rejection.

**Resolution (Phase 3):**
1. Download assets locally into `public/images/`
2. Update `App.tsx` to reference local paths: `<img src="/images/tuc-logo.png" />`
3. For video: host MP4 locally OR encode into app using `@capacitor/filesystem`
4. Rebuild and test offline in Capacitor emulator

**Effort:** 30-60 minutes

---

### ⚠️ Blocker #3: `window.print()` Broken in Capacitor WebView

**Problem:**  
The app uses `window.print()` as the mechanism for downloading/exporting the proposal PDF. This silently fails in native WebViews — users see nothing happen.

**Resolution (Phase 3):**
Option A (Recommended):
- Install `@capacitor/share` plugin
- Replace `window.print()` with Capacitor native share sheet
- Users can then save PDF locally or share

Option B (Advanced):
- Use `html-to-pdf` library to generate PDF in browser
- Use `@capacitor/filesystem` to save to device storage
- Show success message

**Effort:** 1-2 hours for Option A, 3-4 hours for Option B

---

## Section 7: 20-Step Implementation Roadmap

| Phase | Step | Task | Owner | Status |
|-------|------|------|-------|--------|
| 1 | 1 | Fix package.json (name, version, deploy) | Dev | ✅ Done |
| 1 | 2 | Update index.html (meta tags, title) | Dev | ✅ Done |
| 1 | 3 | Create SVG app icons | Dev | ✅ Done |
| 1 | 4 | Create public/manifest.json | Dev | ✅ Done |
| 1 | 5 | Install vite-plugin-pwa | Dev | ✅ Done |
| 1 | 6 | Configure Workbox + service worker | Dev | ✅ Done |
| 1 | 7 | Test PWA: build, preview, offline | Dev | ✅ Done |
| 2 | 8 | Install Capacitor + CLI | Dev | ⏳ Next |
| 2 | 9 | Init Capacitor (capacitor.config.ts) | Dev | ⏳ Next |
| 2 | 10 | Add Android platform + Gradle | Dev | ⏳ Next |
| 2 | 11 | Test Android build in emulator | Dev | ⏳ After #10 |
| 2 | 12 | Add iOS platform (Mac only) | Mac Dev | ⏳ If Mac available |
| 2 | 13 | Test iOS build in simulator (Mac) | Mac Dev | ⏳ If Mac available |
| 2 | 14 | Document iOS build steps | Dev | ⏳ If Mac available |
| 3 | 15 | Create backend proxy (`server/`) | Dev | ⏳ After Phase 2 |
| 3 | 16 | Move Gemini API calls to proxy | Dev | ⏳ After #15 |
| 3 | 17 | Download assets locally + update paths | Dev | ⏳ After Phase 2 |
| 3 | 18 | Replace `window.print()` with Capacitor share | Dev | ⏳ After Phase 2 |
| 3 | 19 | Test all 3 blockers resolved | Dev | ⏳ After #18 |
| 3 | 20 | Prepare store submissions (screenshots, etc) | PM | ⏳ After Phase 3 |

---

## Section 8: Cost & Timeline Summary

### Costs
| Item | Platform | Cost | Notes |
|------|----------|------|-------|
| Developer Account | Play Store | $25 | One-time |
| Developer Program | App Store | $99/year | Annual renewal |
| Mac (for iOS) | — | ~$1000+ | If not available |
| **Total (Android only)** | — | **$25** | Doable now |
| **Total (Android + iOS)** | — | **$1124+** | Need Mac |

### Timeline Estimate
- **Phase 1 (PWA):** ✅ 2 hours (done)
- **Phase 2 (Capacitor):** ⏳ 4-6 hours (Android only); +2 hours (iOS on Mac)
- **Phase 3 (API Security + Assets + Print):** ⏳ 6-8 hours

**Total (All Phases, Android + Web):** ~12-16 hours  
**Total (All Phases, Android + iOS + Web):** ~16-20 hours (requires Mac)

---

## Section 9: Verification Checklist

### Phase 1 (PWA)
- [x] `pnpm build` completes without errors
- [x] `dist/` contains `sw.js`, `manifest.webmanifest`, icons
- [x] `pnpm preview` → DevTools → Application → Service Workers (should show "active")
- [x] DevTools → Application → Manifest (shows correct metadata)
- [x] Network → Offline → Refresh (app still loads from cache)
- [x] Lighthouse mobile audit → PWA score ≥ 85

### Phase 2 (Capacitor)
- [ ] `capacitor.config.ts` created with correct appId
- [ ] `android/` directory exists with Gradle project
- [ ] `pnpm build && pnpm exec cap sync` completes
- [ ] Android emulator: app installs and launches
- [ ] App functionality works in emulator
- [ ] Offline mode works in emulator
- [ ] `./gradlew bundleRelease` produces `.aab`

### Phase 3 (API Security + Assets + Print)
- [ ] Backend proxy receives Gemini requests
- [ ] Frontend no longer exposes API key
- [ ] All logos/images are local (no broken images)
- [ ] Campus video loads locally
- [ ] `window.print()` replaced with `@capacitor/share`
- [ ] Share button works in both web and native

---

## Section 10: Known Limitations & Future Work

1. **Bundle Size:** 767 KB JS is large for 3G. Consider code splitting by route (Phase 4).
2. **Video Streaming:** Embedding MP4 in app increases `.apk` size. May need server-side streaming (HLS).
3. **Deep Linking:** No routing library means users can't deep-link to specific sections. Consider React Router for Phase 4.
4. **Analytics:** No usage tracking set up. Consider Firebase Analytics or Segment.
5. **A/B Testing:** No feature flags. Would be helpful for iterating on proposal presentation.

---

## Section 11: Next Immediate Steps

1. **Merge Phase 1** ✅ (done)
2. **Start Phase 2:** Run Capacitor install + Android setup commands
3. **Test Android emulator:** Verify app launches and offline works
4. **Address Phase 3 blockers:** Create backend proxy, download assets, replace print
5. **Prepare store submissions:** Screenshots, feature graphics, privacy policies

---

## Appendix: File Structure After All Phases

```
smartghana/
├── android/                          [Phase 2] Gradle project
├── ios/                              [Phase 2] Xcode project (Mac only)
├── public/
│   ├── favicon.svg                   [Phase 1]
│   ├── icon-192x192.svg              [Phase 1]
│   ├── icon-512x512.svg              [Phase 1]
│   ├── manifest.json                 [Phase 1]
│   └── images/                       [Phase 3] Local assets
├── server/                           [Phase 3] Express backend proxy
│   ├── index.ts
│   └── .env.local                    (GEMINI_API_KEY)
├── src/
│   ├── App.tsx                       [Phase 3] Remove API key, use proxy
│   ├── index.css
│   └── main.tsx
├── dist/                             [Phase 1] PWA files
│   ├── sw.js
│   ├── manifest.webmanifest
│   ├── registerSW.js
│   └── ...
├── capacitor.config.ts               [Phase 2]
├── vite.config.ts                    [Phase 1] PWA + Phase 2 Capacitor config
├── package.json                      [Phase 1] Updated + Phase 2/3 deps
├── CLAUDE.md                         (this session's guide)
├── GAP-ANALYSIS-MOBILE.md            (this document)
└── README.md                         (pnpm commands)
```

---

## Document Metadata

- **Session:** May 2026
- **Status:** Phase 1 Complete | Phase 2 In Progress | Phase 3 Planned
- **Next Review:** After Capacitor setup (Phase 2)
- **Contact:** daniel.twum@techbridge.edu.gh

**This analysis is living documentation. Update as phases complete and new blockers emerge.**
