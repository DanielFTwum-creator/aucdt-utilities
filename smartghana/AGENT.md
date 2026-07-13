# smartghana - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for smartghana.

### FILE: .dockerignore
```text
node_modules
dist
.git
.env
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store

```

### FILE: (environment files omitted)

> Environment files are never committed. See the repo's own `.env.example`
> for variable names; real values live only in the server's untracked
> `.env.local` / `.env.production`. This block was removed by the fleet
> secret-scrub (blueprint minus secrets).

### FILE: .gitignore
```text
node_modules/
build/
dist/
coverage/
.DS_Store
*.log
.env*
!.env.example

```

### FILE: capacitor.config.ts
```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techbridge.smartghana',
  appName: 'SmartGhana',
  webDir: 'dist'
};

export default config;

```

### FILE: CLAUDE.md
```md
# CLAUDE.md — SmartGhana

> Inherits standards from parent `aucdt-utilities/CLAUDE.md`. See there for task delegation, operating principles, and TUC institutional standards.

AI Studio app for Ghana — Powered by Google Gemini API.

---

## Quick Start

**Prerequisites:** Node.js 18+, pnpm 8.15.0+

```bash
# Install dependencies
pnpm install

# Set up environment
# Copy .env.example to .env.local and add your GEMINI_API_KEY
# Get API key from: https://aistudio.google.com/apikey

# Run dev server (localhost:3000)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

**Note:** This project uses pnpm exclusively. Do not use npm or yarn.

---

## Project Overview

### Purpose
SmartGhana is an AI Studio application that demonstrates integration with the Google Gemini API for conversational AI capabilities in a Ghana-focused context.

### Stack
- **Frontend:** React 19 + TypeScript 5.9 + Vite 6.4
- **Styling:** Tailwind CSS v4 + @tailwindcss/vite plugin
- **AI:** Google Gemini API v1.29.0
- **Build:** Vite with React and Tailwind plugins
- **Testing:** Playwright E2E tests

### Environment Configuration

**`.env.local` (required for local development):**
```
GEMINI_API_KEY=<REDACTED>
APP_URL="http://localhost:3000"
```

Get your free Gemini API key at: https://aistudio.google.com/apikey

The API key is injected at build time via `vite.config.ts`:
```typescript
define: {
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
}
```

---

## Build & Deployment

### Production Build
```bash
pnpm build
```

**Output:** `dist/` folder
- `index.html` — 0.41 kB (gzip: 0.28 kB)
- `assets/index-*.css` — 42.56 kB (gzip: 7.60 kB)
- `assets/index-*.js` — 767.48 kB (gzip: 230.88 kB)

### Bundle Optimization Notes
Current bundle size warning: single JS chunk > 500 kB. For future optimization, consider:
- Dynamic imports via `import()` for route-based code splitting
- `build.rollupOptions.output.manualChunks` for library extraction
- Adjusting `build.chunkSizeWarningLimit` in vite.config.ts

### Deployment Targets
- **AI Studio:** Auto-deployed on git push to main branch
- **Custom server:** Copy `dist/` to web root (SPA requires catch-all routing)

**SPA Routing Note:** If deploying to custom server, configure web server to redirect 404s to `index.html`:
```nginx
# nginx example
try_files $uri $uri/ /index.html;
```

---

## Development

### Dev Server
- **Command:** `pnpm dev`
- **URL:** http://localhost:3000
- **Hot reload:** Enabled (unless `DISABLE_HMR=true`)
- **Port:** 3000 (customizable via `--port=XXXX`)

### TypeScript Checking
```bash
pnpm lint
```
Runs `tsc --noEmit` for type safety without emitting output.

### E2E Tests
```bash
pnpm test:e2e
```
Runs Playwright test suite (see `playwright.config.ts`).

---

## API Integration

### Google Gemini API
- **Package:** `@google/genai` v1.29.0
- **Configuration:** API key loaded from `.env.local` at build time
- **Usage:** React components access `process.env.GEMINI_API_KEY` directly
- **Rate Limits:** Free tier has usage limits; monitor via Google AI Studio dashboard

### Vite Proxy (if needed)
Server proxies `/api` to `http://localhost:8080` (config in vite.config.ts).

---

## Standards & Conventions

### Code Style
Inherits from parent project:
- **Language:** UK British English in all comments and docs
- **Framework:** React 19 + TypeScript 5.9
- **Styling:** Tailwind CSS v4 (see parent for theme conventions)
- **No placeholders:** Production-ready code only

### Frontend Patterns (TUC Standard)
Apply these to `index.html` and components:
- Meta tags: charset, viewport, SEO (description, keywords, author), OG, Twitter Card
- Font preconnect: `fonts.googleapis.com`, `fonts.gstatic.com` before styles
- Analytics: Google Analytics (ID `G-FKXTELQ71R` for TUC properties)
- Theme: `:root`, `[data-theme='dark']`, `[data-theme='light']`, `[data-theme='high-contrast']`
- Typography: Inter (body), Crimson Text or Playfair (headings)
- Animations: `fadeIn`, `slideIn` keyframes preferred

### Documentation Standards
See parent `CLAUDE.md` section 6 for full standards:
- IEEE 830 / 29148 SRS format for specifications
- Document names: `TUC-ICT-SRS-YYYY-NNN`
- Diagrams: SVG format, embedded in docs
- Organization: All docs in `/docs` directory

---

## PWA & Mobile Support

### Current Status (Phase 1 Complete)
SmartGhana is now a fully functional Progressive Web App:
- ✅ Service worker (`dist/sw.js`) provides offline caching via Workbox
- ✅ Manifest (`public/manifest.json`) enables "Add to Home Screen" on iOS/Android
- ✅ Icons (SVG-based, 192×192 and 512×512 px) use Techbridge branding
- ✅ Auto-update enabled — users get new versions automatically when you redeploy
- ✅ Precaches 10 static assets (795 KiB) on first visit
- ✅ Caches Google Fonts for 1 year (offline-ready after first load)

### Testing PWA Locally
```bash
pnpm build && pnpm preview
# In DevTools (F12):
#   → Application → Service Workers (should show "active")
#   → Application → Manifest (shows app metadata)
#   → Network → Offline (toggle)
#   → Refresh page — should load from cache
```

### Roadmap for App Store / Play Store

**Phase 2 (In Progress):** Capacitor setup for native Android/iOS packages
- Install `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`
- Create `capacitor.config.ts`
- Build native `.aab` for Play Store

**Phase 3 (Planned):** Resolve critical blockers before store submission
- **Blocker #1:** Gemini API key embedded in JS bundle → Move to Express backend proxy
- **Blocker #2:** External assets (logos, video) from techbridge.edu.gh → Download locally
- **Blocker #3:** `window.print()` won't work in Capacitor → Replace with `@capacitor/share`

**Full gap analysis:** See `GAP-ANALYSIS-MOBILE.md` for 20-step roadmap, costs, and detailed requirements.

---

## Known Issues & Limitations

1. **Large JS bundle:** Single 767 KB chunk may be slow on 3G connections. Consider route-based code splitting in future iterations.
2. **API key exposure (Phase 3 blocker):** Embedded in browser bundle via `define` in `vite.config.ts`. Both App Store and Play Store reject apps with exposed credentials. Must move to backend proxy before submission.
3. **External asset dependencies (Phase 3 blocker):** Logos and video from `techbridge.edu.gh` break in restricted networks. Play Store / App Store test for this — must download locally before submission.
4. **Print mechanism (Phase 3 blocker):** `window.print()` fails silently in Capacitor WebView. Must replace with `@capacitor/share` for native experience.

---

## File Structure

```
smartghana/
├── src/
│   ├── App.tsx           — Root component
│   ├── main.tsx          — Entry point
│   └── index.css         — Global styles + Tailwind directives
├── public/               — Static assets
├── dist/                 — Production build output (generated)
├── vite.config.ts        — Vite configuration
├── tailwind.config.js    — Tailwind theme config
├── playwright.config.ts  — E2E test configuration
├── .env.example          — Environment template
├── .env.local            — Local secrets (git-ignored)
├── package.json          — Dependencies & scripts
└── CLAUDE.md             — This file
```

---

## Next Steps

- [x] Add PWA support (service worker, manifest) — **Phase 1 Complete**
- [ ] Set up Capacitor for Android/iOS native builds — **Phase 2 In Progress**
- [ ] Resolve API key security blocker (backend proxy) — **Phase 3 Planned**
- [ ] Download assets locally (logos, video) — **Phase 3 Planned**
- [ ] Replace `window.print()` with Capacitor share — **Phase 3 Planned**
- [ ] Optimize bundle size (code splitting)
- [ ] Add comprehensive error handling for API failures
- [ ] Set up CI/CD pipeline for automated testing

---

*Last updated: 2026-05-07 (Phase 1 PWA complete, Phase 2 in progress)*  
*See `GAP-ANALYSIS-MOBILE.md` for complete 20-step mobile app roadmap*

```

### FILE: docs/summary.md
```md
# Techbridge × SmartBridge Alliance: Comprehensive Summary
**Version:** 1.0 (Methodology Compliance: 6R V1.0)
**Date:** May 6, 2026
**Subject:** Strategic Partnership for the One Million Coders Programme

---

## 1. Executive Overview
The Techbridge × SmartBridge Alliance is a strategic partnership designed to bridge the gap between global AI innovation and Ghana's industrial vocational landscape. By combining SmartBridge's AI-native learning architecture with Techbridge's institutional authority and local infrastructure, the partnership aims to transform Ghana into a continental tech hub.

## 2. The 6R Partnership Model
Our collaboration is governed by the 6R Framework, mapping global innovation into actionable deployment steps for Ghana:

*   **Review (Demand Mapping):** Auditing 1,000+ local SMEs to map required AI-native competencies.
*   **Reduce (Module Pruning):** Stripping legacy theory in favor of AI-augmented open-source frameworks.
*   **Refine (Vertical Specialization):** Integrating CAD/CAM Digital Twins for Jewellery and Fashion sectors.
*   **Reuse (Node Activation):** Converting physical campus clusters into high-bandwidth GPU rendering nodes.
*   **Regenerate (IP Genesis):** Transforming students from consumers to "Sovereign Architects" of local tools.
*   **Reinforce (Policy Synchronization):** Embedding Ministry dashboards for automated certification alignment.

## 3. The One Million Coders Programme
The alliance serves as the technical and operational backbone for the **One Million Coders Programme** in Ghana.

### Delivery Framework:
*   **Joint Curriculum Engineering:** Co-developing AI-native modules that merge global algorithmic engines with localized industrial design frameworks.
*   **Hybrid Logistics:** Utilizing Techbridge campuses as "Sovereign Access Nodes" for high-performance processing and labs.
*   **Data Sovereignty:** 100% Ghanaian-hosted data tier ensuring strict adherence to the Data Protection Act and PII custody.
*   **National Policy Synchronization:** Linking programme KPIs directly to Ministry targets for sectoral export and SME growth.

## 4. Specialized Programme Tracks
The partnership delivers four core creative and technical degree tracks:
1.  **Product Design & Entrepreneurship:** CAD/CAM integration for physical product manufacturing.
2.  **Fashion Design Technology:** Digital supply chain and smart textile engineering.
3.  **Jewellery Design Technology:** 3D rendering and generative design for high-value exports.
4.  **Digital Media & Communications Design:** AI-driven storytelling and brand architecture.

## 5. Economic Impact Projection
The partnership is built on a "Sovereignty Dividend" model, visualized through real-time workforce and GVA simulators:
*   **GVA Growth:** Scalable contribution from $0.8B (2024) to a maximum optimized $7.0B by 2030.
*   **Workforce Absorption:** Targeted absorption of 1,000,000 coders by 2030, partitioned into 600k Technical and 400k Creative Technology roles.
*   **Sectoral Contribution:**
    *   **Digital Services:** 35%
    *   **Vocational Export:** 25%
    *   **Local SME Integration:** 20%
    *   **Import Substitution:** 20%
*   **IP Ownership:** Projected 150+ new local intellectual property registrations in technical vocational tools.

---
**Status:** Phase 1 Live
**Verification:** Ministry of Trade and Industrial Relations Alignment Confirmed.

```

### FILE: GAP-ANALYSIS-MOBILE.md
```md
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

```

### FILE: index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/icon-192x192.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0f2545" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="mobile-web-app-capable" content="yes" />
    <title>SmartGhana: A Techbridge/SmartBridge Alliance</title>
    <meta name="description" content="Ghana's Sovereign One Million Coders Framework — Interactive proposal for the Techbridge-SmartBridge alliance partnership." />
    <link rel="manifest" href="/manifest.json" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://techbridge.edu.gh/smartghana" />
    <meta property="og:title" content="SmartGhana — Techbridge × SmartBridge Alliance" />
    <meta property="og:description" content="Ghana's Sovereign One Million Coders Framework — Interactive proposal for the Techbridge-SmartBridge alliance partnership." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO_1.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="SmartGhana — Techbridge × SmartBridge Alliance" />
    <meta name="twitter:description" content="Ghana's Sovereign One Million Coders Framework — Interactive proposal for the Techbridge-SmartBridge alliance partnership." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>


```

### FILE: INTRO-EMAIL-GOVERNMENT.md
```md
# INTRODUCTORY EMAIL TO GOVERNMENT & SMARTBRIDGE

---

## EMAIL SUBJECT: Strategic Partnership Proposal — Ghana's One Million Coders Programme (Techbridge University College)

---

Dear **[Minister/Director Name]**,

I write from Techbridge University College to introduce a strategic partnership opportunity for Ghana's One Million Coders Programme.

**Techbridge** is Ghana's leading technical institution (Oyibi, Greater Accra) with ~200 quality-focused students, four accredited industrial-aligned degree programmes, and proven delivery across Product Design, Fashion Technology, Jewellery Design, and Digital Media. We bring operational readiness, institutional credibility, and deep local policy alignment—plus campus infrastructure ready to scale.

**SmartBridge** brings a global AI-native learning platform (Skill Wallet) proven across 3,000+ institutions and 2+ million learners worldwide.

Together, we propose a **three-entity alliance:**
- SmartBridge India provides the global technology platform
- SmartBridge Ghana manages in-country implementation  
- Techbridge provides campus infrastructure, accredited programmes, and sovereign data stewardship

**The outcome:** World-class digital skills training for Ghana's one million young people, with 100% Ghanaian control, measurable employment outcomes, and 60% economic retention within Ghana's domestic economy.

**Programme can launch within 8 weeks** of partnership ratification, using Techbridge's existing infrastructure and personnel—no build phase required.

I invite you to a technical synchronisation workshop to discuss the strategic vision, deployment roadmap, and governance structures. I have attached:
1. **SmartGhana Interactive Proposal** (digital presentation)
2. **Alliance Brief PDF** (formal 3-page document)
3. **Implementation Roadmap** (5-phase, 32-week deployment)

**Next steps:** Please let me know your availability for a meeting in **May/June 2026** to discuss how Techbridge, SmartBridge, and the Government of Ghana can jointly transform digital workforce readiness.

I look forward to partnering to build Ghana's digital future.

---

**Best regards,**

**Daniel Frempong Twum**  
Head of ICT & Special Adviser to the Founder  
Techbridge University College  

📧 daniel.twum@techbridge.edu.gh  
📱 +233-302788895  
🌐 www.techbridge.edu.gh  
🏢 Oyibi, Greater Accra, Ghana

---

**P.S.** — This proposal aligns directly with:
- Ghana's National Digital Transformation Strategy
- The Ministry of Education's digital literacy targets
- The Ministry of Trade's sectoral export development agenda
- The Youth and Employment Agency's workforce readiness mandate

We are ready to commence immediately upon government approval.

---

## RECIPIENTS (Cc: line)

```
Ministry of Communications and Digitalization
Office of the President / Presidential Special Initiatives
Youth and Employment Agency
Ghana Digital Centre
SmartBridge Education Services (India & Ghana)
```

---

## FOLLOW-UP CHECKLIST

- [ ] Send email with PDF attachments by [DATE]
- [ ] Follow up with phone call to [CONTACT] within 3 business days
- [ ] Provide access link to SmartGhana interactive demo (https://techbridge.edu.gh/smartghana)
- [ ] Schedule technical synchronisation workshop for [PROPOSED DATE]
- [ ] Prepare presentation slides (executive summary version)
- [ ] Brief SmartBridge leadership on outreach
- [ ] Document government responses and feedback

```

### FILE: INTRO-LETTER-GOVERNMENT.md
```md
# INTRODUCTORY LETTER TO GOVERNMENT OF GHANA & SMARTBRIDGE

---

**TECHBRIDGE UNIVERSITY COLLEGE**  
Oyibi, Greater Accra, Ghana  
Tel: +233-302788895  
Email: daniel.twum@techbridge.edu.gh  
Web: www.techbridge.edu.gh

---

**Date:** 7 May 2026

---

## TO THE HONOURABLE MINISTRIES & SMARTBRIDGE EDUCATION SERVICES

**RE: Strategic Partnership Proposal — Ghana's One Million Coders Programme**

---

### DEAR SIRS AND MADAM,

Techbridge University College writes to formally introduce ourselves as a strategic partner for Ghana's One Million Coders Programme, in collaboration with SmartBridge Education Services.

#### **WHO WE ARE**

Techbridge University College is Ghana's leading technical institution, headquartered in Oyibi, Greater Accra. We specialise in industry-aligned digital and engineering disciplines through accredited degree programmes and hands-on, project-based learning methodologies. Our four specialised programmes — Product Design and Entrepreneurship, Fashion Design Technology, Jewellery Design Technology, and Digital Media & Communications Design — address Ghana's highest-value industrial sectors and export opportunities.

As a quality-focused institution, we maintain an excellence-driven enrolment of approximately 200 students, with demonstrable track records in:
- **Industrial Partnership:** Direct collaboration with Ghanaian SMEs and enterprises on live projects
- **Curriculum Innovation:** Bridging academic theory with real-world technology applications and industry standards
- **Data Sovereignty:** Full compliance with Ghana's Data Protection Act and national digital policy
- **Institutional Credibility:** Accredited programmes, proven delivery, and strong employer partnerships

#### **THE OPPORTUNITY**

The Government of Ghana's One Million Coders Programme represents a transformative national initiative to equip young Ghanaians with critical digital skills for the 21st-century economy. This vision aligns perfectly with Techbridge's mission: to cultivate a generation of sovereign industrial architects capable of building, owning, and exporting technology rooted in Ghanaian context.

#### **WHY TECHBRIDGE?**

We bring three irreplaceable assets to this programme:

1. **Operational Readiness** — Techbridge's existing campus infrastructure, trained personnel, and active student cohort eliminate the need for a lengthy build phase. The programme can commence within eight weeks of partnership ratification.

2. **Local Institutional Credibility** — We are not a foreign vendor. We are a Ghanaian institution with deep understanding of local policy, regulatory landscape, employer ecosystems, and student demographics. Government engagement, institutional partnerships, and curriculum alignment flow through trusted local channels.

3. **Industrial Alignment** — Our specialised programmes (CAD/CAM for Jewellery, Digital Textile for Fashion, AI-native Product Design) directly address Ghana's sectoral export strategies, ensuring graduate employability and economic impact.

#### **THE SMARTBRIDGE PARTNERSHIP**

We propose integrating SmartBridge Education Services' proven Skill Wallet platform — a global experiential learning ecosystem with 2+ million learners across 3,000+ institutions — with Techbridge's institutional infrastructure and regional reach.

This is not a capacity-building exercise. It is a **structural transformation** of Ghana's technical workforce:
- **SmartBridge India** provides the global AI-native learning platform, algorithmic curriculum engine, and international quality standards
- **SmartBridge Ghana** manages in-country deployment and government liaison
- **Techbridge** anchors the partnership with physical facilities, accredited programmes, and sovereign data stewardship

The result: world-class technology delivered with absolute Ghanaian control.

#### **OUR COMMITMENT**

As Head of Institution, I commit Techbridge to:

✓ **100% alignment** with Ghana's digital and sectoral policy frameworks  
✓ **Full transparency** in programme delivery, student outcomes, and government reporting  
✓ **Data sovereignty** — all student PII, learning records, and assessment data remain in Ghana under Techbridge stewardship  
✓ **Economic retention** — 60% of technical service fees circulate within Ghana's domestic economy through local hiring and infrastructure investment  
✓ **Measurable impact** — real-time government dashboards tracking enrolment, competency growth, regional distribution, and employer outcomes

#### **NEXT STEPS**

We invite the Ministry of Communications and Digitalization, Presidential Special Initiatives, Youth and Employment Agency, Ghana Digital Centre, and SmartBridge leadership to a technical synchronisation workshop to:

- Finalise the Sovereign Access Node deployment plan
- Initiate the SME Demand Mapping audit
- Align curriculum with Ministry vocational standards
- Establish governance and oversight structures

We have prepared a comprehensive Alliance Brief detailing the strategic vision, delivery framework, economic impact projections, and implementation roadmap. This document is ready for your review and discussion.

#### **CLOSING**

Ghana's digital transformation is not a capacity-building exercise—it is a structural statement about our nation's sovereignty and economic future. By partnering with Techbridge and SmartBridge, the Government of Ghana can demonstrate that the One Million Coders Programme builds Ghana, for Ghanaians, with absolute control over our digital future.

We stand ready to commence Phase One immediately upon agreement.

---

**Yours in service to Ghana's digital future,**

---

**Daniel Frempong Twum**  
Head of ICT & Special Adviser to the Founder  
Techbridge University College

**Tel:** +233-302788895  
**Email:** daniel.twum@techbridge.edu.gh  
**Mobile:** [Your contact]

---

**Cc:**  
Ministry of Communications and Digitalization  
Presidential Special Initiatives  
Youth and Employment Agency  
Ghana Digital Centre  
SmartBridge Education Services (India & Ghana)

---

## SUPPORTING DOCUMENTS

This letter should be accompanied by:

1. **SmartGhana Interactive Proposal** — Digital presentation at `https://techbridge.edu.gh/smartghana`
2. **Alliance Brief PDF** — Formal 3-page proposal document (downloadable from SmartGhana app)
3. **Curriculum Alignment Matrix** — How Techbridge + SmartBridge programmes map to Ghana's digital policy
4. **Financial Projections** — 5-year economic impact model showing GVA growth, import substitution, local job creation
5. **Techbridge Credentials** — Institution accreditation, programme certifications, employer partnerships, student outcomes

---

*This introductory letter should be sent via formal government channels (President's office / Ministry of Communications) with a courtesy copy to SmartBridge leadership, followed by a call to schedule the technical synchronisation workshop.*

```

### FILE: metadata.json
```json
{
  "name": "Techbridge × SmartBridge Alliance — Sovereign 1M Coders Framework",
  "description": "Institutional landing page and strategic dashboard for the Techbridge-SmartBridge partnership, detailing the 6R Framework and deployment strategy for Ghana's One Million Coders Programme.",
  "requestFramePermissions": [],
  "majorCapabilities": []
}

```

### FILE: package.json
```json
{
  "name": "smartghana",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit",
    "test:e2e": "playwright test",
    "deploy": "pnpm build && scp -r dist/ root@techbridge.edu.gh:/var/www/vhosts/techbridge.edu.gh/httpdocs/smartghana/",
    "export-pdf": "node scripts/export-pdf.js",
    "generate-intro-pdfs": "node scripts/generate-intro-pdfs.js"
  },
  "dependencies": {
    "@capacitor/android": "^8.3.1",
    "@capacitor/cli": "^8.3.1",
    "@capacitor/core": "^8.3.1",
    "@google/genai": "^1.29.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "recharts": "^3.8.1",
    "vite": "^6.2.3"
  },
  "devDependencies": {
    "@playwright/test": "^1.59.1",
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.3",
    "vite-plugin-pwa": "^1.3.0"
  }
}

```

### FILE: playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 120 * 1000,
  },
});

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/5f648a42-e402-451d-a3f7-3af91f2ba14c

## Run Locally

**Prerequisites:**  Node.js and pnpm 8.15.0+

1. Install dependencies:
   `pnpm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `pnpm dev`

**Available Commands:**
- `pnpm dev` — Start dev server (port 3000)
- `pnpm build` — Build for production
- `pnpm preview` — Preview production build
- `pnpm lint` — TypeScript type checking
- `pnpm test:e2e` — Run Playwright E2E tests
- `pnpm clean` — Remove dist/ directory

**Note:** This project uses pnpm exclusively. Do not use npm or yarn.

```

### FILE: scripts/export-pdf.js
```javascript
/**
 * SmartGhana — Alliance Brief PDF Export
 *
 * Captures the Alliance Brief document as a print-quality A4 PDF
 * using Playwright Chromium.
 *
 * Usage:
 *   pnpm run export-pdf
 *
 * Output:
 *   exports/Techbridge-SmartBridge-Alliance-Brief.pdf
 */

import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const EXPORTS = resolve(ROOT, 'exports');
const PORT = 4174;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function testPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/`, (res) => {
      resolve(res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(500, () => req.destroy());
  });
}

function startPreviewServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'pnpm',
      ['exec', 'vite', 'preview', '--port', String(PORT)],
      { cwd: ROOT, shell: process.platform === 'win32', stdio: 'inherit' }
    );

    proc.on('error', reject);

    let attempts = 0;
    const checkReady = async () => {
      attempts++;
      if (attempts > 30) {
        reject(new Error('Preview server failed to start after 30 attempts'));
        return;
      }
      const ready = await testPort(PORT) || await testPort(4173);
      if (ready) {
        resolve(proc);
      } else {
        setTimeout(checkReady, 200);
      }
    };

    setTimeout(checkReady, 500);
  });
}

async function detectPort() {
  if (await testPort(PORT)) return PORT;
  if (await testPort(4173)) return 4173;
  throw new Error('Preview server not responding on ports 4174 or 4173');
}

async function main() {
  mkdirSync(EXPORTS, { recursive: true });

  console.log('\n⚙  Building production bundle...');
  const { execSync } = await import('child_process');
  execSync('pnpm exec vite build', { cwd: ROOT, stdio: 'inherit' });

  console.log('\n🚀 Starting preview server...');
  const server = await startPreviewServer();
  await sleep(2000);

  const actualPort = await detectPort();
  const briefUrl = `http://localhost:${actualPort}/?brief=1`;

  const browser = await chromium.launch();

  try {
    const context = await browser.newContext({
      viewport: { width: 794, height: 1123 }, // A4 at 96dpi
    });
    const page = await context.newPage();

    console.log(`\n📄 Capturing Alliance Brief from ${briefUrl}...`);
    await page.goto(briefUrl, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for all resources and allow fonts/images to settle
    await page.waitForLoadState('networkidle');
    await sleep(2000);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      displayHeaderFooter: false,
    });

    // Generate timestamp (ISO format: YYYY-MM-DD-HHmmss)
    const now = new Date();
    const timestamp = now.toISOString().split('T')[0] + '-' +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');

    const outPath = resolve(EXPORTS, `Techbridge-SmartBridge-Alliance-Brief-${timestamp}.pdf`);
    writeFileSync(outPath, pdfBuffer);
    console.log(`  ✅ Saved → exports/Techbridge-SmartBridge-Alliance-Brief-${timestamp}.pdf`);

  } finally {
    await browser.close();
    server.kill();
  }

  console.log('\n✅ Export complete.\n');
}

main().catch(err => {
  console.error('\n❌ Export failed:', err.message);
  process.exit(1);
});

```

### FILE: scripts/generate-intro-pdfs.js
```javascript
/**
 * Generate PDF versions of introductory documents
 *
 * Usage:
 *   node scripts/generate-intro-pdfs.js
 *
 * Output:
 *   public/documents/Techbridge-Intro-Letter.pdf
 *   public/documents/Techbridge-Intro-Email.pdf
 */

import { chromium } from '@playwright/test';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DOCS_DIR = resolve(ROOT, 'public', 'documents');

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function generateLetterHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Techbridge Introductory Letter</title>
  <style>
    * { margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: white;
    }
    .page {
      width: 210mm;
      height: 297mm;
      padding: 25mm;
      margin: 0 auto;
      box-sizing: border-box;
      background: white;
    }
    .header {
      margin-bottom: 30px;
      border-bottom: 2px solid #8C1A2E;
      padding-bottom: 15px;
    }
    .institution {
      font-size: 18px;
      font-weight: bold;
      color: #0f2545;
      margin-bottom: 5px;
    }
    .location {
      font-size: 12px;
      color: #666;
      margin-bottom: 2px;
    }
    .date {
      text-align: right;
      font-size: 12px;
      color: #666;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .recipient {
      margin-bottom: 20px;
      font-size: 12px;
    }
    .salutation {
      margin-bottom: 20px;
      font-weight: bold;
    }
    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #0f2545;
      margin-top: 15px;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    p {
      font-size: 12px;
      margin-bottom: 12px;
      text-align: justify;
      line-height: 1.7;
    }
    ul {
      margin-left: 20px;
      margin-bottom: 12px;
      font-size: 12px;
    }
    li {
      margin-bottom: 6px;
      line-height: 1.6;
    }
    .highlight {
      font-weight: bold;
      color: #0f2545;
    }
    .closing {
      margin-top: 30px;
      font-size: 12px;
    }
    .signature {
      margin-top: 40px;
      font-size: 12px;
    }
    .contact {
      margin-top: 15px;
      font-size: 11px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="institution">TECHBRIDGE UNIVERSITY COLLEGE</div>
      <div class="location">Oyibi, Greater Accra, Ghana</div>
      <div class="location">Tel: +233-302788895 | Email: daniel.twum@techbridge.edu.gh</div>
      <div class="location">Web: www.techbridge.edu.gh</div>
    </div>

    <div class="date">Date: 7 May 2026</div>

    <div class="recipient">
      <strong>TO THE HONOURABLE MINISTRIES & SMARTBRIDGE EDUCATION SERVICES</strong>
    </div>

    <p><strong>RE: Strategic Partnership Proposal — Ghana's One Million Coders Programme</strong></p>

    <div class="salutation">DEAR SIRS AND MADAM,</div>

    <p>Techbridge University College writes to formally introduce ourselves as a strategic partner for Ghana's One Million Coders Programme, in collaboration with SmartBridge Education Services.</p>

    <div class="section-title">WHO WE ARE</div>
    <p>Techbridge University College is Ghana's leading technical institution, headquartered in Oyibi, Greater Accra. We specialise in industry-aligned digital and engineering disciplines through accredited degree programmes and hands-on, project-based learning methodologies. Our four specialised programmes — Product Design and Entrepreneurship, Fashion Design Technology, Jewellery Design Technology, and Digital Media & Communications Design — address Ghana's highest-value industrial sectors and export opportunities.</p>

    <p>As a quality-focused institution, we maintain an excellence-driven enrolment of approximately 200 students, with demonstrable track records in:</p>
    <ul>
      <li><span class="highlight">Industrial Partnership:</span> Direct collaboration with Ghanaian SMEs and enterprises on live projects</li>
      <li><span class="highlight">Curriculum Innovation:</span> Bridging academic theory with real-world technology applications and industry standards</li>
      <li><span class="highlight">Data Sovereignty:</span> Full compliance with Ghana's Data Protection Act and national digital policy</li>
      <li><span class="highlight">Institutional Credibility:</span> Accredited programmes, proven delivery, and strong employer partnerships</li>
    </ul>

    <div class="section-title">THE OPPORTUNITY</div>
    <p>The Government of Ghana's One Million Coders Programme represents a transformative national initiative to equip young Ghanaians with critical digital skills for the 21st-century economy. This vision aligns perfectly with Techbridge's mission: to cultivate a generation of sovereign industrial architects capable of building, owning, and exporting technology rooted in Ghanaian context.</p>

    <div class="section-title">WHY TECHBRIDGE?</div>
    <p>We bring three irreplaceable assets to this programme:</p>
    <ul>
      <li><span class="highlight">Operational Readiness</span> — Techbridge's existing campus infrastructure, trained personnel, and active student cohort eliminate the need for a lengthy build phase. The programme can commence within eight weeks of partnership ratification.</li>
      <li><span class="highlight">Local Institutional Credibility</span> — We are not a foreign vendor. We are a Ghanaian institution with deep understanding of local policy, regulatory landscape, employer ecosystems, and student demographics.</li>
      <li><span class="highlight">Industrial Alignment</span> — Our specialised programmes directly address Ghana's sectoral export strategies, ensuring graduate employability and economic impact.</li>
    </ul>

    <div class="section-title">THE SMARTBRIDGE PARTNERSHIP</div>
    <p>We propose integrating SmartBridge Education Services' proven Skill Wallet platform — a global experiential learning ecosystem with 2+ million learners across 3,000+ institutions — with Techbridge's institutional infrastructure and regional reach.</p>

    <p>This is not a capacity-building exercise. It is a <span class="highlight">structural transformation</span> of Ghana's technical workforce:</p>
    <ul>
      <li><span class="highlight">SmartBridge India</span> provides the global AI-native learning platform, algorithmic curriculum engine, and international quality standards</li>
      <li><span class="highlight">SmartBridge Ghana</span> manages in-country deployment and government liaison</li>
      <li><span class="highlight">Techbridge</span> anchors the partnership with physical facilities, accredited programmes, and sovereign data stewardship</li>
    </ul>

    <p>The result: world-class technology delivered with absolute Ghanaian control.</p>

    <div class="section-title">OUR COMMITMENT</div>
    <p>As Head of Institution, I commit Techbridge to:</p>
    <ul>
      <li>✓ 100% alignment with Ghana's digital and sectoral policy frameworks</li>
      <li>✓ Full transparency in programme delivery, student outcomes, and government reporting</li>
      <li>✓ Data sovereignty — all student PII and assessment data remain in Ghana under Techbridge stewardship</li>
      <li>✓ Economic retention — 60% of technical service fees circulate within Ghana's domestic economy</li>
      <li>✓ Measurable impact — real-time government dashboards tracking enrolment, competency growth, and outcomes</li>
    </ul>

    <div class="section-title">NEXT STEPS</div>
    <p>We invite the relevant ministries and SmartBridge leadership to a technical synchronisation workshop to finalise the Sovereign Access Node deployment plan, initiate the SME Demand Mapping audit, align curriculum with Ministry vocational standards, and establish governance structures.</p>

    <p>We have prepared a comprehensive Alliance Brief detailing the strategic vision, delivery framework, economic impact projections, and implementation roadmap. This document is ready for your review and discussion.</p>

    <div class="section-title">CLOSING</div>
    <p>Ghana's digital transformation is not a capacity-building exercise—it is a structural statement about our nation's sovereignty and economic future. By partnering with Techbridge and SmartBridge, the Government of Ghana can demonstrate that the One Million Coders Programme builds Ghana, for Ghanaians, with absolute control over our digital future.</p>

    <p>We stand ready to commence Phase One immediately upon agreement.</p>

    <div class="closing">
      <p><strong>Yours in service to Ghana's digital future,</strong></p>

      <div class="signature">
        <p><strong>Daniel Frempong Twum</strong></p>
        <p>Head of ICT & Special Adviser to the Founder</p>
        <p>Techbridge University College</p>

        <div class="contact">
          <p>Tel: +233-302788895</p>
          <p>Email: daniel.twum@techbridge.edu.gh</p>
          <p>Mobile: [Your contact]</p>
        </div>
      </div>

      <p style="margin-top: 20px; font-size: 11px; color: #999;">
        Cc: Ministry of Communications and Digitalization | Presidential Special Initiatives | Youth and Employment Agency | Ghana Digital Centre | SmartBridge Education Services (India & Ghana)
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateEmailHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Techbridge Introductory Email</title>
  <style>
    * { margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: white;
    }
    .page {
      width: 210mm;
      height: 297mm;
      padding: 25mm;
      margin: 0 auto;
      box-sizing: border-box;
      background: white;
    }
    .header {
      margin-bottom: 20px;
      border-bottom: 2px solid #8C1A2E;
      padding-bottom: 15px;
    }
    .institution {
      font-size: 16px;
      font-weight: bold;
      color: #0f2545;
    }
    .subject-line {
      margin: 20px 0;
      padding: 12px;
      background: #f5f5f5;
      border-left: 4px solid #8C1A2E;
    }
    .subject-label {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
    }
    .subject-text {
      font-size: 13px;
      font-weight: bold;
      color: #0f2545;
      margin-top: 4px;
    }
    .greeting {
      margin-bottom: 15px;
      font-size: 12px;
    }
    p {
      font-size: 12px;
      margin-bottom: 12px;
      text-align: justify;
      line-height: 1.7;
    }
    .highlight {
      font-weight: bold;
      color: #0f2545;
    }
    ul {
      margin-left: 20px;
      margin-bottom: 12px;
      font-size: 12px;
    }
    li {
      margin-bottom: 6px;
    }
    .signature-block {
      margin-top: 25px;
      border-top: 1px solid #ddd;
      padding-top: 15px;
      font-size: 11px;
    }
    .signature-line {
      margin-bottom: 4px;
    }
    .checklist {
      margin: 15px 0;
      padding: 12px;
      background: #f9f9f9;
      border: 1px solid #e0e0e0;
    }
    .checklist-title {
      font-weight: bold;
      margin-bottom: 8px;
      font-size: 12px;
    }
    .checklist-item {
      font-size: 11px;
      margin-bottom: 4px;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="institution">TECHBRIDGE UNIVERSITY COLLEGE</div>
      <p style="font-size: 11px; color: #666; margin-top: 4px;">Oyibi, Greater Accra, Ghana | daniel.twum@techbridge.edu.gh | +233-302788895</p>
    </div>

    <div class="subject-line">
      <div class="subject-label">Email Subject:</div>
      <div class="subject-text">Strategic Partnership Proposal — Ghana's One Million Coders Programme (Techbridge University College)</div>
    </div>

    <div class="greeting">
      <strong>Dear [Minister/Director Name],</strong>
    </div>

    <p>I write from Techbridge University College to introduce a strategic partnership opportunity for Ghana's One Million Coders Programme.</p>

    <p><span class="highlight">Techbridge</span> is Ghana's leading technical institution (Oyibi, Greater Accra) with ~200 quality-focused students, four accredited industrial-aligned degree programmes, and proven delivery across Product Design, Fashion Technology, Jewellery Design, and Digital Media. We bring operational readiness, institutional credibility, and deep local policy alignment—plus campus infrastructure ready to scale.</p>

    <p><span class="highlight">SmartBridge</span> brings a global AI-native learning platform (Skill Wallet) proven across 3,000+ institutions and 2+ million learners worldwide.</p>

    <p>Together, we propose a <span class="highlight">three-entity alliance:</span></p>
    <ul>
      <li>SmartBridge India provides the global technology platform</li>
      <li>SmartBridge Ghana manages in-country implementation</li>
      <li>Techbridge provides campus infrastructure, accredited programmes, and sovereign data stewardship</li>
    </ul>

    <p><span class="highlight">The outcome:</span> World-class digital skills training for Ghana's one million young people, with 100% Ghanaian control, measurable employment outcomes, and 60% economic retention within Ghana's domestic economy.</p>

    <p><span class="highlight">Programme can launch within 8 weeks</span> of partnership ratification, using Techbridge's existing infrastructure and personnel—no build phase required.</p>

    <p>I invite you to a technical synchronisation workshop to discuss the strategic vision, deployment roadmap, and governance structures. I have attached:</p>
    <ul>
      <li>SmartGhana Interactive Proposal (digital presentation)</li>
      <li>Alliance Brief PDF (formal 3-page document)</li>
      <li>Implementation Roadmap (5-phase, 32-week deployment)</li>
    </ul>

    <p><strong>Next steps:</strong> Please let me know your availability for a meeting in <strong>May/June 2026</strong> to discuss how Techbridge, SmartBridge, and the Government of Ghana can jointly transform digital workforce readiness.</p>

    <p>I look forward to partnering to build Ghana's digital future.</p>

    <div class="signature-block">
      <div class="signature-line"><strong>Best regards,</strong></div>
      <div class="signature-line" style="margin-top: 12px;">Daniel Frempong Twum</div>
      <div class="signature-line">Head of ICT & Special Adviser to the Founder</div>
      <div class="signature-line">Techbridge University College</div>
      <div style="margin-top: 8px; border-top: 1px solid #ddd; padding-top: 8px;">
        <div class="signature-line">📧 daniel.twum@techbridge.edu.gh</div>
        <div class="signature-line">📱 +233-302788895</div>
        <div class="signature-line">🌐 www.techbridge.edu.gh</div>
        <div class="signature-line">🏢 Oyibi, Greater Accra, Ghana</div>
      </div>
    </div>

    <p style="margin-top: 20px; font-size: 11px; color: #999;">
      <strong>P.S.</strong> — This proposal aligns directly with Ghana's National Digital Transformation Strategy, the Ministry of Education's digital literacy targets, the Ministry of Trade's sectoral export development agenda, and the Youth and Employment Agency's workforce readiness mandate. We are ready to commence immediately upon government approval.
    </p>
  </div>
</body>
</html>
  `;
}

async function generatePDF(htmlContent, filename) {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      viewport: { width: 794, height: 1123 }, // A4 at 96dpi
    });
    const page = await context.newPage();

    await page.setContent(htmlContent, { waitUntil: 'networkidle' });
    await sleep(1000);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      displayHeaderFooter: false,
    });

    const outPath = resolve(DOCS_DIR, filename);
    writeFileSync(outPath, pdfBuffer);
    console.log(`  ✅ Generated → public/documents/${filename}`);

  } finally {
    await browser.close();
  }
}

async function main() {
  mkdirSync(DOCS_DIR, { recursive: true });

  console.log('\n📄 Generating PDF versions of introductory documents...\n');

  await generatePDF(generateLetterHTML(), 'Techbridge-Intro-Letter.pdf');
  await generatePDF(generateEmailHTML(), 'Techbridge-Intro-Email.pdf');

  console.log('\n✅ PDF generation complete.\n');
}

main().catch(err => {
  console.error('\n❌ PDF generation failed:', err.message);
  process.exit(1);
});

```

### FILE: src/AdminGuide.tsx
```typescript
import React, { useState } from 'react';
import { X, Lock, Shield, Settings, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const ADMIN_PASSWORD = [REDACTED_CREDENTIAL]

export default function AdminGuide({ isOpen, onClose }: AdminGuideProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password =[REDACTED_CREDENTIAL]
      setIsAuthenticated(true);
      setError('');
      setPassword('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  if (!isOpen) return null;

  const adminSections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Content Management',
      content: [
        'All proposal content is stored in App.tsx as mock data.',
        'To update figures, timelines, or metrics, edit the data constants in src/App.tsx.',
        'Changes take effect immediately upon rebuild and redeployment.',
        'Keep the structure consistent to avoid breaking charts and tables.'
      ]
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'Configuration & Deployment',
      content: [
        'Deploy changes via pnpm deploy command, which builds and SCP\'s dist/ to techbridge.edu.gh.',
        'Ensure SSH access to root@techbridge.edu.gh is configured.',
        'The app auto-updates via service worker when new code is deployed.',
        'Monitor PWA caching by checking DevTools → Application → Service Workers.'
      ]
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: 'Known Limitations & Phase 3 Blockers',
      content: [
        'API Key Security: Gemini API key is embedded in the JS bundle. Before Play Store/App Store submission, move to backend proxy.',
        'External Assets: TUC logo and SmartBridge logo load from techbridge.edu.gh. Download locally for offline reliability.',
        'Print Mechanism: window.print() fails in Capacitor WebView. Replace with @capacitor/share for native apps.',
        'Bundle Size: Main JS chunk is 247 KB (gzip). Consider further code splitting if adding new major features.'
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Security & Maintenance',
      content: [
        'Change ADMIN_PASSWORD in AdminGuide.tsx to a strong, unique password. Move to environment variables in production.',
        'Regular backups: Ensure techbridge.edu.gh server backups include /smartghana/ directory.',
        'Dependency updates: Run pnpm update quarterly to patch security vulnerabilities.',
        'Monitor error logs: Set up server-side logging to catch runtime issues.'
      ]
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: 'Testing & QA',
      content: [
        'Local testing: pnpm dev runs the dev server on localhost:3000.',
        'Build testing: pnpm build followed by pnpm preview tests production bundle.',
        'PWA testing: DevTools → Application → Service Workers, toggle offline mode.',
        'PDF export: pnpm run export-pdf generates Alliance Brief PDF.',
        'E2E tests: pnpm test:e2e runs Playwright test suite (currently stale, needs updating).'
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Git Workflow & Versioning',
      content: [
        'All work is on branch claude/pdf-showcase-prototype-yuiXV.',
        'Push to main only after comprehensive testing and sign-off.',
        'Version bumps: Update package.json version field following semver (major.minor.patch).',
        'Tag releases: git tag -a v1.0.0 -m "Release message" for production deployments.'
      ]
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full my-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-900 to-red-700 text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Admin Guide</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close admin guide"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <Lock className="w-6 h-6 text-amber-600 flex-shrink-0" />
                  <p className="text-amber-900 text-sm">
                    This section is password-protected for administrators only.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Password
                    </label>
                    <input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2545] focus:border-transparent"
                      autoComplete="current-password"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-[#0f2545] text-white rounded-lg hover:bg-[#1a3a5c] transition-colors font-medium"
                  >
                    Access Admin Guide
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto"
              >
                {/* Admin introduction */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-700 font-medium">
                      Authentication successful. You now have access to admin documentation.
                    </p>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    This guide is for TUC staff responsible for maintaining and updating SmartGhana.
                    Review each section carefully before making changes to the production app.
                  </p>
                </section>

                {/* Admin sections */}
                {adminSections.map((section, idx) => (
                  <motion.section
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-700">
                        {section.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#0f2545] mb-2">
                          {section.title}
                        </h3>
                        <ul className="space-y-2">
                          {section.content.map((item, i) => (
                            <li key={i} className="text-gray-600 leading-relaxed flex gap-2 text-sm">
                              <span className="text-red-600 mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.section>
                ))}

                {/* Footer */}
                <section className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    <strong>Last updated:</strong> May 2026 | <strong>Version:</strong> 1.0.0
                  </p>
                </section>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          {isAuthenticated && (
            <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPassword('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Log Out
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#0f2545] text-white rounded-lg hover:bg-[#1a3a5c] transition-colors font-medium"
              >
                Close
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

```

### FILE: src/AllianceBrief.tsx
```typescript
import { useEffect } from 'react';

const TECHBRIDGE_LOGO = 'https://techbridge.edu.gh/static/TUC_LOGO_1.png';

const today = new Date();
const BRIEF_DATE = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

function ConfidentialFooter() {
  return (
    <div className="brief-footer">
      <div className="brief-footer-inner">
        <span>Confidential</span>
        <span className="brief-footer-dot">✦</span>
        <span>Techbridge University College × SmartBridge (India & Ghana)</span>
        <span className="brief-footer-dot">✦</span>
        <span>TUC-ICT-PROP-2026-002</span>
      </div>
    </div>
  );
}

function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="brief-section-header">
      <span className="brief-section-number">{number}.</span>
      <span className="brief-section-title">{title}</span>
    </div>
  );
}

function BulletItem({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="brief-bullet">
      <span className="brief-bullet-mark">■</span>
      <p className="brief-bullet-text">
        {label && <strong>{label}:</strong>}{' '}{children}
      </p>
    </div>
  );
}

export default function AllianceBrief() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('print') === '1') {
      setTimeout(() => window.print(), 800);
    }
  }, []);

  return (
    <div className="brief-document" id="alliance-brief">

      {/* ── PAGE 1 ─────────────────────────────────── */}
      <div className="brief-page">

        {/* Letterhead */}
        <header className="brief-letterhead">
          <div className="brief-letterhead-left">
            <img
              src={TECHBRIDGE_LOGO}
              alt="Techbridge University College"
              className="brief-logo"
              referrerPolicy="no-referrer"
            />
            <div className="brief-institution">
              <div className="brief-institution-name">Techbridge University College</div>
              <div className="brief-institution-sub">Oyibi, Greater Accra, Ghana</div>
              <div className="brief-institution-sub">daniel.twum@techbridge.edu.gh</div>
            </div>
          </div>
          <div className="brief-letterhead-right">
            <div className="brief-document-type">PROPOSAL BRIEF</div>
          </div>
        </header>

        <div className="brief-rule-gold" />

        {/* Header Block */}
        <table className="brief-header-block">
          <tbody>
            <tr>
              <td className="brief-header-label">To:</td>
              <td className="brief-header-value">The Executive Boards, SmartBridge India & SmartBridge Ghana</td>
            </tr>
            <tr>
              <td className="brief-header-label">From:</td>
              <td className="brief-header-value">Techbridge University College, ICT Division</td>
            </tr>
            <tr>
              <td className="brief-header-label">Date:</td>
              <td className="brief-header-value">{BRIEF_DATE}</td>
            </tr>
            <tr>
              <td className="brief-header-label">Reference:</td>
              <td className="brief-header-value">TUC-ICT-PROP-2026-002</td>
            </tr>
            <tr>
              <td className="brief-header-label">Subject:</td>
              <td className="brief-header-value brief-header-subject">
                Sovereign Deployment Framework for Ghana's One Million Coders Programme
              </td>
            </tr>
          </tbody>
        </table>

        <div className="brief-rule-light" />

        {/* Section 1 */}
        <section className="brief-section">
          <SectionHeader number={1} title="STRATEGIC VISION" />
          <p className="brief-body">
            Techbridge University College proposes a structured alliance with SmartBridge — delivered
            through SmartBridge Educational Services Ltd. (Ghana), under the strategic direction of
            SmartBridge Education Services Pvt. Ltd. (India) — to serve as the unified technical
            and operational partner for the One Million Coders Programme in Ghana. This proposal sets
            out the framework, delivery model, and projected outcomes of a three-entity collaboration
            designed to transform the initiative from a generic skills-delivery exercise into a
            nationally-aligned programme of industrial and digital capacity building.
          </p>
          <p className="brief-body">
            SmartBridge India provides the Skill Wallet platform — a proven experiential learning
            ecosystem that has trained 2 million+ learners across 3,000+ institutions globally over
            more than a decade. SmartBridge Ghana, headquartered in Accra, manages in-country
            deployment and government liaison. Techbridge University College provides the institutional
            anchor: established local infrastructure, validated delivery experience, active operational
            capacity of ~200 enrolled students (quality-focused model), and proven alignment with national digital policy.
          </p>
          <p className="brief-body">
            This alliance moves beyond the standard SaaS procurement model. By combining SmartBridge's
            Skill Wallet platform and global experiential learning methodology with Techbridge's
            institutional infrastructure and regional reach, the partnership creates a delivery model
            that is simultaneously world-class in technical capability and sovereign in its operation.
          </p>
        </section>

        {/* Section 2 */}
        <section className="brief-section">
          <SectionHeader number={2} title="THE 6R DELIVERY FRAMEWORK" />
          <p className="brief-body">
            We propose the 6R Strategic Delivery Framework as the operational structure for the
            alliance. Each stage represents a distinct phase of programme development, with clear
            ownership and measurable outcomes:
          </p>
          <div className="brief-bullets">
            <BulletItem label="Review — Demand Mapping">
              A structured audit of over 1,000 local SMEs and government agencies to identify
              the precise AI-native and vocational competencies required across Ghana's
              growth sectors, ensuring the programme responds to genuine market demand.
            </BulletItem>
            <BulletItem label="Reduce — Curriculum Pruning">
              Removal of legacy theoretical content and proprietary software dependencies
              from existing curricula, replaced with AI-augmented, open-source pathways
              that reduce the barrier to technical mastery by an estimated 45 per cent.
            </BulletItem>
            <BulletItem label="Refine — Vertical Specialisation">
              Integration of Techbridge's CAD/CAM and Digital Twin capabilities into
              specialised coding tracks aligned with the Jewellery, Fashion, and Product
              Design sectors — Ghana's highest-value industrial export categories.
            </BulletItem>
            <BulletItem label="Reuse — Node Activation">
              Deployment of Techbridge's Oyibi campus as the primary Sovereign Access Node,
              providing high-bandwidth infrastructure and GPU rendering capacity for the
              One Million Coders Programme in Greater Accra and surrounding regions.
            </BulletItem>
            <BulletItem label="Regenerate — IP Genesis">
              Establishment of joint Sovereign Tooling Laboratories in which students
              design and build the enterprise software and industrial tools used within
              their own sectors — creating a domestic IP ownership tier.
            </BulletItem>
            <BulletItem label="Reinforce — Policy Alignment">
              Integration of real-time Ministry monitoring dashboards to enable automated
              certification alignment with Ghana's national vocational standards framework,
              providing government with direct programme oversight.
            </BulletItem>
          </div>
        </section>

        <ConfidentialFooter />
      </div>

      {/* ── PAGE 2 ─────────────────────────────────── */}
      <div className="brief-page">

        {/* Section 3 */}
        <section className="brief-section">
          <SectionHeader number={3} title="PROGRAMME DELIVERY AND OPERATIONAL SYNERGY" />
          <p className="brief-body">
            The alliance will operate under a Sovereign Execution Model structured across three
            complementary entities. SmartBridge India provides the Skill Wallet platform, global
            curriculum engine, and AI-native tutoring systems (Kibo bots for knowledge support).
            SmartBridge Ghana manages in-country implementation, government liaison, and regulatory
            alignment. Techbridge provides physical campus infrastructure, accredited degree programmes,
            and sovereign data stewardship under Ghana Data Protection Act compliance. This tripartite
            structure is aligned around four core operational principles:
          </p>
          <div className="brief-bullets">
            <BulletItem label="Joint Curriculum Engineering">
              SmartBridge's global algorithmic learning engine will be merged with
              Techbridge's industrial design frameworks, producing a curriculum that
              is technically rigorous and contextually relevant to Ghana's economic
              priorities. Content development will be jointly owned and locally hosted.
            </BulletItem>
            <BulletItem label="Physical Infrastructure Utilisation">
              Techbridge's campuses will serve as hands-on industrial laboratories,
              providing equipment-based learning that complements the digital delivery
              platform. This is particularly critical for the Jewellery Design, Fashion
              Technology, and Product Engineering tracks, where physical tools and
              materials cannot be replicated digitally.
            </BulletItem>
            <BulletItem label="Data Sovereignty and Compliance">
              All student records, learning pathways, and assessment data for the
              programme's one million participants will be stored and managed within
              Ghanaian jurisdiction, in full compliance with the Ghana Data Protection
              Act. Techbridge will serve as the designated Local Data Steward under
              the alliance agreement.
            </BulletItem>
            <BulletItem label="National Policy Synchronisation">
              Every programme KPI will be aligned with the Ministry of Trade's strategy
              for sectoral export development and the Ministry of Education's digital
              literacy targets, ensuring government accountability and a clear pathway
              to programme sustainability beyond the initial funding period.
            </BulletItem>
          </div>
        </section>

        {/* Section 4 */}
        <section className="brief-section">
          <SectionHeader number={4} title="THE FOUR SPECIALIST DEGREE PROGRAMMES" />
          <p className="brief-body">
            Techbridge contributes four active, accredited degree programmes to the alliance,
            each engineered for Ghana's emerging digital sectors. These programmes are currently
            operational at the Oyibi campus and provide the industrial backbone for the
            specialised coding tracks:
          </p>
          <div className="brief-bullets">
            <BulletItem label="Product Design and Entrepreneurship">
              Integrating UI/UX design methodology with AI-native product development
              workflows and Ghanaian market commercialisation strategies. Graduates are
              equipped to launch and scale digital products within the domestic SME sector.
            </BulletItem>
            <BulletItem label="Fashion Design Technology">
              Combining digital textile engineering, 3D garment visualisation, and smart
              supply chain technology into a creative technologist's curriculum. West
              Africa's fashion sector is projected to generate 120,000 new artisanal
              roles by 2030; this programme prepares graduates to lead that transition.
            </BulletItem>
            <BulletItem label="Jewellery Design Technology">
              Applying high-precision CAD/CAM modelling and generative design tools to
              Ghana's gold and artisan sector. The programme creates a structured pathway
              from traditional craft to export-grade industrial production, supporting
              an estimated $450 million export potential.
            </BulletItem>
            <BulletItem label="Digital Media and Communications Design">
              Equipping graduates with AI-driven storytelling, generative video production,
              and brand architecture skills for the West African media and advertising
              market. The programme draws on Techbridge's existing partnerships with
              Ghanaian broadcasters and digital agencies.
            </BulletItem>
          </div>
          <p className="brief-body brief-body-note">
            Each programme is structured as a four-year degree with built-in industry placements
            and live project briefs drawn from Ghanaian enterprises. All four are eligible
            for direct alignment with the One Million Coders Programme certification framework.
          </p>
        </section>

        <ConfidentialFooter />
      </div>

      {/* ── PAGE 3 ─────────────────────────────────── */}
      <div className="brief-page">

        {/* Section 5 */}
        <section className="brief-section">
          <SectionHeader number={5} title="ECONOMIC IMPACT AND PROJECTIONS" />
          <p className="brief-body">
            The alliance model creates measurable economic value at three levels — national,
            sectoral, and operational — each of which is supported by independently modelled
            projections:
          </p>

          <div className="brief-metric-grid">
            <div className="brief-metric-card">
              <div className="brief-metric-label">National Digital GVA</div>
              <div className="brief-metric-value">$0.8B → $7.0B</div>
              <div className="brief-metric-desc">
                Projected growth in Ghana's digital Gross Value Added from 2024 to 2030,
                positioning Ghana as the continental benchmark for technical-vocational
                sovereignty.
              </div>
            </div>
            <div className="brief-metric-card">
              <div className="brief-metric-label">Import Substitution</div>
              <div className="brief-metric-value">42% reduction</div>
              <div className="brief-metric-desc">
                Projected reduction in foreign software procurement dependency over five
                years, generating an estimated saving of $800 million for the Ghanaian
                economy.
              </div>
            </div>
            <div className="brief-metric-card">
              <div className="brief-metric-label">Local Economic Retention</div>
              <div className="brief-metric-value">60% of fees</div>
              <div className="brief-metric-desc">
                Proportion of programme service fees retained within Ghana's domestic
                economy through local hiring, infrastructure investment, and tax
                contributions — versus near-total capital flight under direct
                international procurement.
              </div>
            </div>
            <div className="brief-metric-card">
              <div className="brief-metric-label">Alliance Cost Efficiency</div>
              <div className="brief-metric-value">GHS 455M vs GHS 840M</div>
              <div className="brief-metric-desc">
                Estimated 45 per cent cost reduction against equivalent direct
                international procurement, whilst maintaining full technical capability
                and programme scope.
              </div>
            </div>
          </div>

          <p className="brief-body">
            The full Economic Impact Model, including year-by-year GVA trajectory, sectoral
            contribution breakdown, and workforce absorption projections, is available in
            the accompanying digital presentation at the reference above.
          </p>
        </section>

        {/* Section 6 */}
        <section className="brief-section">
          <SectionHeader number={6} title="CONCLUSION AND CALL TO ACTION" />
          <p className="brief-body">
            Techbridge University College is prepared to begin deployment immediately. Our
            existing infrastructure, trained personnel, and active student cohort provide
            a platform that requires no build phase — only integration with the SmartBridge
            delivery engine. The full programme can be operational within eight weeks of
            alliance ratification.
          </p>
          <p className="brief-body">
            We propose an immediate technical synchronisation workshop to finalise the
            Sovereign Access Node deployment plan and initiate the SME Demand Mapping audit.
            Following workshop agreement, joint curriculum engineering can commence within
            the first fortnight.
          </p>
          <p className="brief-body">
            This is not a capacity-building exercise in the conventional sense. It is a
            structural transformation of Ghana's technical workforce — with sovereignty,
            accountability, and long-term export capability built into the architecture
            from the outset. The distinction between a domestic alliance and a direct
            international procurement is the distinction between a programme that builds
            Ghana and one that merely operates within it.
          </p>
          <p className="brief-body">
            We invite the SmartBridge Executive Board to ratify this alliance and authorise
            commencement of Phase One.
          </p>
        </section>

        <div className="brief-rule-light brief-rule-wide" />

        {/* Authorisation Block */}
        <div className="brief-auth">
          <p className="brief-auth-label">Authorised by:</p>
          <p className="brief-auth-name">Daniel Frempong Twum</p>
          <p className="brief-auth-title">Head of ICT &amp; Special Adviser to the Founder</p>
          <p className="brief-auth-title">Techbridge University College, Oyibi, Greater Accra, Ghana</p>
          <p className="brief-auth-coordination">
            In co-ordination with the Ministry of Trade and Industry, Ghana
          </p>
        </div>

        <ConfidentialFooter />
      </div>

    </div>
  );
}

```

### FILE: src/App.tsx
```typescript
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import AllianceBrief from './AllianceBrief';
import UserGuide from './UserGuide';
import AdminGuide from './AdminGuide';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area, LineChart, Line, Legend
} from 'recharts';
import {
  ShieldCheck,
  Zap,
  Users,
  Globe,
  TrendingUp,
  Handshake,
  ArrowRight,
  Scale,
  Database,
  Building,
  Download,
  CheckCircle2,
  Lock,
  Cpu,
  Search,
  MinusCircle,
  Sparkles,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';

// --- Data Types ---

interface SynergyPoint {
  dimension: string;
  smartbridge: string;
  techbridge: string;
  outcome: string;
  icon: React.ReactNode;
}

// --- Mock Data (Pivot: Strategic Alliance) ---

const SYNERGY_DATA: SynergyPoint[] = [
  {
    dimension: "Operational Delivery",
    smartbridge: "Skill Wallet Platform (100K+ concurrent learners)",
    techbridge: "Quality-Focused Delivery & Institutional Infrastructure",
    outcome: "Immediate 8-Week Launch",
    icon: <Zap className="w-5 h-5" />
  },
  {
    dimension: "User Experience",
    smartbridge: "Experiential Learning Ecosystem (2M+ learners globally)",
    techbridge: "Ghanaian Context & Support",
    outcome: "High Retention & Relevance",
    icon: <Users className="w-5 h-5" />
  },
  {
    dimension: "Data & Hosting",
    smartbridge: "Multi-institution Cloud Platform (3,000+ institutions)",
    techbridge: "Local Sovereignty & GDPR",
    outcome: "Compliant & Low Latency",
    icon: <Database className="w-5 h-5" />
  }
];

const ALLIANCE_VALUES = [
  { name: 'Global Tech Reach', value: 85, fill: '#8C1A2E' },
  { name: 'Local Operational Depth', value: 95, fill: '#C49A22' },
  { name: 'Government Compliance', value: 100, fill: '#1A0A06' },
];

const COLLABORATIVE_FLOW = [
  { month: 'Start', efficiency: 40 },
  { month: 'Month 2', efficiency: 65 },
  { month: 'Month 4', efficiency: 85 },
  { month: 'Launch', efficiency: 100 },
];

const COST_BREAKDOWN_DATA = [
  { component: "Platform Licenses", international: 450, alliance: 320, note: "Alliance volume discount" },
  { component: "Content Localization", international: 180, alliance: 65, note: "Techbridge local assets" },
  { component: "Technical Support", international: 120, alliance: 45, note: "On-ground local team" },
  { component: "Contingency/Risk", international: 90, alliance: 25, note: "Local operational knowledge" },
];

const CURRICULUM_GAP_DATA = [
  { factor: "Curriculum Focus", standard: "Generic Tech Generalist", alliance: "AI-Native Creative Specialist", note: "Matches Ghana Gov industrial policy" },
  { factor: "Market Alignment", standard: "Global SaaS Patterns", alliance: "West African Sectors (Fintech, Media, Arts)", note: "Immediate local employability" },
  { factor: "Instructional Language", standard: "Standard Academic English", alliance: "Multi-modal & Local Context Support", note: "Higher accessibility & retention" },
  { factor: "Project Focus", standard: "US/EU Case Studies", alliance: "Ghanaian Enterprise & SME Prototyping", note: "Direct domestic impact" },
];

const PROGRAMMES = [
  { 
    title: "Product Design & Entrepreneurship", 
    desc: "Merging UI/UX with business logic and AI-native product development workflows.",
    icon: <Database className="w-5 h-5 text-gold" />,
    color: "#8C1A2E"
  },
  { 
    title: "Fashion Design Technology", 
    desc: "Digital textile engineering, 3D garment visualization, and supply chain tech.",
    icon: <Users className="w-5 h-5 text-gold" />,
    color: "#C49A22"
  },
  { 
    title: "Jewellery Design Technology", 
    desc: "High-precision CAD modelling for the gold and artisan sector in West Africa.",
    icon: <Cpu className="w-5 h-5 text-gold" />,
    color: "#1A0A06"
  },
  { 
    title: "Digital Media & Communications Design", 
    desc: "Generative video, storytelling at scale, and AI-driven brand architecture.",
    icon: <Globe className="w-5 h-5 text-gold" />,
    color: "#2A1A1A"
  }
];

const COLLABORATION_STRATEGY = [
  {
    title: "Joint Curriculum Engineering",
    detail: "Co-developing AI-native modules that merge SmartBridge’s global algorithmic engine with Techbridge’s industrial design frameworks for Fashion, Jewellery, and Product Engineering."
  },
  {
    title: "Hybrid Delivery Logistics",
    detail: "Utilizing Techbridge's physical campuses as 'Sovereign Access Nodes,' providing high-speed GPU processing and hands-on industrial labs that complement digital learning."
  },
  {
    title: "Sovereign Data Custody",
    detail: "Implementing a 100% Ghanaian-hosted data tier for the 1M+ students, ensuring strict adherence to the Ghana Data Protection Act and PII sovereignty."
  },
  {
    title: "National Policy Synchronization",
    detail: "Directly linking programme KPIs to Ministry of Education digital literacy targets and the Ministry of Trade’s strategy for sectoral export and SME growth."
  }
];

const ECONOMIC_IMPACT_METRICS = [
  {
    label: "Direct GVA Contribution",
    value: "$2.4B",
    growth: "+14%",
    desc: "Projected Gross Value Added to the digital services sector by 2030 through specialized exports."
  },
  {
    label: "Import Substitution",
    value: "42%",
    growth: "-28%",
    desc: "Reduction in foreign software dependency by building local alternatives for Ghanaian SMEs."
  },
  {
    label: "Sovereign IP Ownership",
    value: "150+",
    growth: "New",
    desc: "Local intellectual property registrations in CAD/CAM and AI-native vocational tools."
  }
];

const SECTORAL_DYNAMICS = [
  { industry: "Jewellery", impact: "High", tech: "3D Rendering / Generative Design", forecast: "$450M Export Potential" },
  { industry: "Fashion", impact: "Massive", tech: "Smart Textiles / Digital Supply Chain", forecast: "120k New Artisanal Jobs" },
  { industry: "Agri-Tech", impact: "Foundation", tech: "IoT / Predictive Analytics", forecast: "30% Yield Optimization" }
];

const GVA_TREND_DATA = [
  { year: '2024', gva: 0.8, projection: 0.8 },
  { year: '2025', gva: 1.2, projection: 1.4 },
  { year: '2026', gva: 1.8, projection: 2.1 },
  { year: '2027', gva: 2.5, projection: 2.9 },
  { year: '2028', gva: 3.4, projection: 3.8 },
  { year: '2029', gva: 4.6, projection: 5.1 },
  { year: '2030', gva: 6.2, projection: 7.0 },
];

const SECTOR_CONTRIBUTION_CHART = [
  { sector: 'Digital Services', value: 35, growth: 12 },
  { sector: 'Vocational Export', value: 25, growth: 18 },
  { sector: 'Local SME', value: 20, growth: 15 },
  { sector: 'Import Sub.', value: 20, growth: 8 },
];

const JOB_CREATION_TRENDS = [
  { year: '2024', creative: 5000, technical: 8000 },
  { year: '2025', creative: 12000, technical: 18000 },
  { year: '2026', creative: 28000, technical: 45000 },
  { year: '2027', creative: 65000, technical: 95000 },
  { year: '2028', creative: 140000, technical: 210000 },
  { year: '2029', creative: 250000, technical: 380000 },
  { year: '2030', creative: 400000, technical: 600000 },
];

const SIX_R_MODEL = [
  { 
    r: "Review", 
    action: "Demand Mapping & Audit", 
    detail: "Auditing 1,000+ local SMEs and government industrial sectors to map required AI-native competencies for the first 100,000 coders.",
    outcome: "Harmonized content with West African market signals.",
    icon: <Search className="w-5 h-5" />
  },
  { 
    r: "Reduce", 
    action: "Module Pruning & Compression", 
    detail: "Aggressive removal of legacy theoretical modules and expensive western proprietary software dependencies in favor of AI-augmented open-source frameworks.",
    outcome: "Lowered entry barrier to tech mastery by 45%.",
    icon: <MinusCircle className="w-5 h-5" />
  },
  { 
    r: "Refine", 
    action: "Vertical Specialization", 
    detail: "Integrating CAD/CAM Digital Twin technology and high-precision tech stacks into the coding curriculum for Jewellery, Fashion, and Multimedia sectors.",
    outcome: "Students capable of export-grade industrial execution.",
    icon: <Sparkles className="w-5 h-5" />
  },
  { 
    r: "Reuse", 
    action: "Node Level Activation", 
    detail: "Converting Techbridge's 8 regional physical clusters into 'Sovereign Access Nodes' and decentralized GPU rendering farms for the programme.",
    outcome: "Decentralized high-bandwidth lab access for developers.",
    icon: <RefreshCw className="w-5 h-5" />
  },
  { 
    r: "Regenerate", 
    action: "Sovereign IP Genesis", 
    detail: "Establishing 'Sovereign Tooling' labs where students build the local enterprise tools and ERPs they use, moving from 'users' to 'architects'.",
    outcome: "New tier of Domestic IP ownership within Ghana.",
    icon: <Zap className="w-5 h-5" />
  },
  { 
    r: "Reinforce", 
    action: "Policy Synchronization", 
    detail: "Embedding Ministry monitoring dashboards into the platform for automated certification alignment with national vocational standards.",
    outcome: "Every 'Coder' becomes a certified industrial asset.",
    icon: <ShieldCheck className="w-5 h-5" />
  }
];

// --- Components ---

const SMARTBRIDGE_LOGO = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpICViUsnSXDavjLeZOoBdv2OUsXlAInOy9w&s";
const TECHBRIDGE_LOGO = "https://techbridge.edu.gh/static/TUC_LOGO_1.png";

const Watermark = () => (
  <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[-1] overflow-hidden select-none">
    <div className="relative w-full h-full flex items-center justify-center">
      <img 
        src={TECHBRIDGE_LOGO} 
        alt=""
        className="w-[100%] max-w-none opacity-[0.02] grayscale brightness-110"
        aria-hidden="true"
        referrerPolicy="no-referrer"
      />
    </div>
  </div>
);

const AllianceEfficiencyTable = () => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-[#E5E1D5]">
          <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-gold text-left">Cost Component</th>
          <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-[#AAA] text-right">International Direct</th>
          <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-crimson text-right">Alliance Model</th>
          <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-espresso text-left pl-6">Efficiency Driver</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#F0EEE5]">
        {COST_BREAKDOWN_DATA.map((row, i) => (
          <tr key={i} className="group hover:bg-white/50 transition-colors">
            <td className="py-4 text-xs font-bold text-espresso">{row.component}</td>
            <td className="py-4 px-4 text-xs font-medium text-[#AAA] text-right">GHS {row.international}M</td>
            <td className="py-4 px-4 text-xs font-bold text-crimson text-right">GHS {row.alliance}M</td>
            <td className="py-4 text-[10px] text-[#777] italic pl-6">{row.note}</td>
          </tr>
        ))}
        <tr className="bg-espresso text-white">
          <td className="py-4 pl-4 text-xs font-bold uppercase tracking-widest">Total Estimated Value</td>
          <td className="py-4 px-4 text-xs font-bold text-right text-white/50">GHS 840M</td>
          <td className="py-4 px-4 text-xs font-black text-right text-gold">GHS 455M</td>
          <td className="py-4 pl-6 text-[10px] font-bold text-gold uppercase tracking-widest">~45% Cost Efficiency</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={`relative ${className} group flex items-center justify-center`}>
    <img 
      src={TECHBRIDGE_LOGO} 
      alt="Techbridge University College Logo"
      className="max-w-full max-h-full object-contain"
      referrerPolicy="no-referrer"
    />
    {/* Hover glow effect */}
    <div className="absolute inset-0 bg-gold/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
  </div>
);

const Navbar = () => (
  <nav className="border-b border-[#E5E1D5] bg-parchment/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-4">
        <Logo className="w-14 h-14" />
        <div className="flex flex-col">
          <h1 className="text-sm font-black tracking-[0.05em] text-espresso uppercase leading-none mb-1">Techbridge</h1>
          <p className="text-[9px] font-bold text-gold tracking-widest uppercase">University College</p>
        </div>
      </div>
      
      <div className="w-px h-10 bg-[#E5E1D5] mx-2 hidden sm:block" />
      
      <div className="hidden sm:flex items-center gap-3">
        <div className="w-7 h-7 flex items-center justify-center opacity-40">
          <img src={SMARTBRIDGE_LOGO} alt="SmartBridge Logo" className="w-full h-full object-contain grayscale" referrerPolicy="no-referrer" />
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] font-black tracking-widest text-[#AAA] uppercase">Strategic Alliance</span>
          <span className="text-[7px] font-bold text-[#CCC] uppercase">SmartBridge</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-8">
      <div className="hidden lg:flex gap-8 text-[9px] font-black uppercase tracking-widest text-[#555]">
        <a href="#synergy" className="hover:text-crimson transition-colors">Synergy</a>
        <a href="#model" className="hover:text-crimson transition-colors">Model</a>
        <a href="#sovereignty" className="hover:text-crimson transition-colors">Compliance</a>
        <a href="#delivery" className="hover:text-crimson transition-colors">Delivery</a>
        <a href="#economic" className="hover:text-crimson transition-colors">Economic Impact</a>
      </div>
      <div className="relative group">
        <button
          type="button"
          className="text-[9px] font-bold uppercase tracking-widest px-4 py-2 border border-crimson text-crimson rounded-sm hover:bg-crimson hover:text-white transition-all flex items-center gap-2"
        >
          <Download className="w-3 h-3" />
          Download
        </button>
        <div className="absolute right-0 mt-0 w-48 bg-white border border-crimson rounded-sm shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
          <button
            type="button"
            onClick={() => window.open('?brief=1&print=1', '_blank')}
            className="w-full text-left px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-crimson hover:bg-crimson hover:text-white transition-colors border-b border-crimson/20"
          >
            Alliance Brief PDF
          </button>
          <button
            type="button"
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/documents/Techbridge-Intro-Letter.pdf';
              link.download = 'Techbridge-Intro-Letter.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="w-full text-left px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-crimson hover:bg-crimson hover:text-white transition-colors border-b border-crimson/20"
          >
            Introductory Letter
          </button>
          <button
            type="button"
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/documents/Techbridge-Intro-Email.pdf';
              link.download = 'Techbridge-Intro-Email.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="w-full text-left px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-crimson hover:bg-crimson hover:text-white transition-colors"
          >
            Introductory Email
          </button>
        </div>
      </div>
    </div>
  </nav>
);

const SectionEyebrow = ({ text }: { text: string }) => (
  <div className="gold-eyebrow">
    <span className="multiplier-dot" />
    {text}
  </div>
);

const SynergyGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {SYNERGY_DATA.map((point, idx) => (
      <motion.div 
        key={idx}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.1 }}
        className="content-card group hover:border-crimson transition-all duration-500"
      >
        <div className="bg-espresso w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-gold">
          {point.icon}
        </div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-espresso mb-6">{point.dimension}</h3>
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-[#AAA] rounded-full mt-1.5 flex-shrink-0" />
            <div>
              <span className="text-[9px] font-bold text-[#AAA] uppercase tracking-tighter">SmartBridge</span>
              <p className="text-xs font-medium text-[#555] mt-0.5">{point.smartbridge}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-crimson rounded-full mt-1.5 flex-shrink-0" />
            <div>
              <span className="text-[9px] font-bold text-crimson uppercase tracking-tighter">Techbridge Local</span>
              <p className="text-xs font-medium text-espresso mt-0.5">{point.techbridge}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[#E5E1D5]">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gold uppercase tracking-widest">
            <CheckCircle2 className="w-3 h-3" />
            Outcome: {point.outcome}
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

export default function App() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('brief') === '1') {
    return <AllianceBrief />;
  }

  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [isAdminGuideOpen, setIsAdminGuideOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Autoplay failed:", error);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-parchment selection:bg-crimson selection:text-white relative">
      <Watermark />
      <Navbar />

      {/* Partnership Strip */}
      <div className="bg-espresso text-white py-2 overflow-hidden whitespace-nowrap border-y border-gold/20">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="flex gap-16 text-[9px] font-bold tracking-[0.2em] uppercase items-center"
        >
          {[...Array(15)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="text-gold">✦</span>
              <span>Unified Delivery Model</span>
              <span className="text-crimson">✦</span>
              <span>SmartBridge India × SmartBridge Ghana × Techbridge</span>
              <span className="text-gold">✦</span>
              <span>Skill Wallet Platform · 2M+ Learners</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* SmartBridge Global Tech Partners */}
      <div className="bg-white/50 border-b border-[#E5E1D5] py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-[9px] font-bold uppercase tracking-widest text-[#777] mb-4">SmartBridge Global Technology Ecosystem Partners</div>
          <div className="flex flex-wrap gap-3">
            {['IBM', 'Google', 'Salesforce', 'ServiceNow', 'AWS', 'MongoDB', 'Zscaler', 'Katalon', 'Tableau', 'Zoho'].map((partner, i) => (
              <span key={i} className="px-3 py-2 bg-white border border-[#E5E1D5] rounded-sm text-[8px] font-bold text-espresso uppercase tracking-wider">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Alliance Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32 items-center">
          <div className="lg:col-span-7">
            <SectionEyebrow text="One Million Coders Programme: Strategic Synthesis" />
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-espresso leading-[1.05] mb-10">
              The Synergy of <span className="heading-italic">Global Tech</span> and <span className="heading-italic">Local Execution.</span>
            </h2>
            <p className="text-lg text-[#555] leading-relaxed max-w-xl mb-12">
              Techbridge partners with SmartBridge — implemented in Ghana through SmartBridge Ghana,
              powered by SmartBridge India's Skill Wallet platform — to deliver a comprehensive, Ghana-first solution.
              We combine world-class learning platforms with locally-verified operations, physical campuses,
              and strict data sovereignty compliance.
            </p>
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => document.getElementById('review-model')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-crimson text-white px-10 py-4 rounded-sm text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-3"
              >
                Review Partnership Model <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-4 py-4 px-6 border border-[#E5E1D5] rounded-sm bg-white/40">
                <ShieldCheck className="w-5 h-5 text-gold" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-espresso">Sovereignty Guaranteed</div>
                  <div className="text-[9px] text-[#777]">100% PII retention in Ghana</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="stats-card bg-[#1A0A06] border-gold p-0 overflow-hidden relative group h-[480px]">
              <video 
                ref={videoRef}
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                autoPlay 
                muted 
                loop 
                playsInline
              >
                <source src="https://techbridge.edu.gh/static/campus_tour.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Opacity Light Overlay */}
              <div className="absolute inset-0 bg-white/5 pointer-events-none" />
              
              <div className="absolute top-8 left-8 z-10">
                <div className="gold-eyebrow mb-2">
                  <span className="multiplier-dot" />
                  Campus Tour
                </div>
                <h4 className="text-2xl font-bold font-serif italic text-white">Efficiency in <span className="text-gold">Motion.</span></h4>
              </div>

              <div className="absolute bottom-8 left-8 right-8 z-10">
                <div className="flex justify-between items-end">
                  <div className="max-w-[200px]">
                    <div className="text-[9px] font-black uppercase tracking-widest text-gold mb-1">Oyibi Tech Hub</div>
                    <p className="text-[10px] text-white/50 leading-tight uppercase font-bold tracking-tighter">
                      ~200 Students. Quality-focused. Industry-aligned. Ready to scale.
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                    <Zap className="w-5 h-5 text-gold" />
                  </div>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-espresso to-transparent pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Synergy Matrix */}
        <section id="synergy" className="mb-32">
          <SectionEyebrow text="Partner Synergy Matrix" />
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <h3 className="text-3xl font-bold text-espresso max-w-xl">
              Unifying Global Innovation with Local Operational Trust.
            </h3>
            <p className="text-[11px] font-bold text-crimson italic">
              "Best-in-class tech meets deep local expertise."
            </p>
          </div>
          <SynergyGrid />
        </section>

        {/* The Creative Curriculum Edge (4 Programmes) */}
        <section id="programmes" className="mb-40 pt-20 border-t border-espresso/5">
          <div className="flex flex-col lg:flex-row justify-between items-start mb-20 gap-12">
            <div className="max-w-2xl">
              <SectionEyebrow text="Pillars of Excellence" />
              <h3 className="text-5xl font-black text-espresso leading-tight tracking-tight mt-6">
                4 Specialized <span className="text-crimson italic font-serif serif-italic">Degrees</span> for the Digital Economy.
              </h3>
            </div>
            <p className="text-sm text-[#777] max-w-xs leading-relaxed lg:text-right pt-2 font-medium">
              Curricula engineered for West African industrial policy, merging high-tech toolsets with localized creative entrepreneurship.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {PROGRAMMES.map((prog, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative flex flex-col md:flex-row gap-8 p-1 w-full"
              >
                <div 
                  className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl flex items-center justify-center shadow-2xl shadow-espresso/5 border border-white/50 transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundColor: `${prog.color}08`, borderLeft: `4px solid ${prog.color}` }}
                >
                  <div className="p-4 bg-white rounded-full shadow-lg">
                    {prog.icon}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-espresso mb-3 flex items-center gap-3">
                    {prog.title}
                    <div className="h-px flex-grow bg-espresso/5 group-hover:bg-crimson/20 transition-colors" />
                  </h4>
                  <p className="text-sm leading-relaxed text-[#555] mb-6">
                    {prog.desc}
                  </p>
                  <div className="flex gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#AAA]">Duration: 4 Years</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-crimson">Degree Awarded</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Gap Analysis */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4">
              <SectionEyebrow text="Strategic Gap Analysis" />
              <h3 className="text-3xl font-bold text-espresso mb-8">The Localization Dividend.</h3>
              <p className="text-sm text-[#555] leading-relaxed mb-8">
                Direct international procurement creates a "Curriculum Gap"—where technical skills fail to translate into local economic context. Our alliance bridge this gap through localized creative tracks.
              </p>
              <div className="p-6 bg-gold/5 rounded-md border border-gold/10">
                <div className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2">Key Metric</div>
                <div className="text-2xl font-serif italic text-espresso">~67% Higher Relevancy</div>
                <p className="text-[10px] text-[#777] mt-2">Measured against graduate career alignment in Ghana's emerging digital sectors.</p>
              </div>
            </div>
            <div className="lg:col-span-8 overflow-hidden rounded-tech-lg border border-[#E5E1D5] bg-white group shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-espresso text-white">
                    <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gold">Gap Factor</th>
                    <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-white/50">Standard Intl. Model</th>
                    <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-white">The Alliance Model</th>
                  </tr>
                </thead>
                <tbody className="text-[11px] divide-y divide-[#E5E1D5]">
                  {CURRICULUM_GAP_DATA.map((row, i) => (
                    <tr key={i} className="hover:bg-parchment/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-espresso border-r border-[#E5E1D5]">{row.factor}</td>
                      <td className="px-6 py-4 text-[#AAA] border-r border-[#E5E1D5]">{row.standard}</td>
                      <td className="px-6 py-4 font-bold text-crimson italic">{row.alliance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Partnership Model: The 6R Framework */}
        <section id="model" className="mb-40 pt-20 border-t border-[#E5E1D5]">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-12">
            <div className="max-w-3xl">
              <SectionEyebrow text="Partnership Model: The 6R Framework" />
              <h3 id="review-model" className="text-4xl md:text-5xl font-black text-espresso leading-tight mt-6">
                Redefining the <span className="text-gold italic font-serif">Process</span> of Technical Delivery.
              </h3>
            </div>
            <p className="text-sm text-[#777] max-w-xs leading-relaxed lg:text-right font-medium">
              A systematic methodology to ensure global innovation respects local institutional trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
            {SIX_R_MODEL.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative group pr-4"
              >
                <div className="absolute -top-6 -left-6 text-[80px] font-black text-espresso/[0.03] select-none pointer-events-none group-hover:text-gold/5 transition-colors duration-700">
                  0{i + 1}
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-parchment rounded-xl border border-[#E5E1D5] flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-sm">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-crimson group-hover:translate-x-2 transition-transform duration-500">{step.r}</h4>
                    <h5 className="text-lg font-bold text-espresso">{step.action}</h5>
                  </div>
                </div>

                <p className="text-sm text-[#666] leading-relaxed mb-6 pl-1 pr-6">
                  {step.detail}
                </p>

                <div className="p-4 bg-white/50 rounded-lg border border-dashed border-[#E5E1D5] group-hover:border-gold/30 transition-colors">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#AAA] mb-1">
                    <CheckCircle2 className="w-3 h-3 text-gold" />
                    Projected Outcome
                  </div>
                  <p className="text-[11px] font-bold text-espresso italic">
                    "{step.outcome}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Review Partnership Model */}
        <section id="review-partnership-model" className="mb-40 pt-20 border-t border-[#E5E1D5]">
          <div className="max-w-4xl mx-auto">
            <SectionEyebrow text="Alliance Strategic Strategy" />
            <h2 className="text-4xl md:text-5xl font-black text-espresso mt-6 mb-12 leading-tight">
              Review Partnership Model
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-crimson mb-8">One Million Coders Deployment Framework</h3>
                <p className="text-sm text-[#555] mb-8 leading-relaxed">
                  The Techbridge–SmartBridge Alliance brings together three complementary entities: SmartBridge India (providing the Skill Wallet platform and global learning engine), SmartBridge Ghana (managing in-country implementation and government liaison), and Techbridge (supplying campus infrastructure and sovereign data stewardship). This tripartite approach to the <span className="font-bold text-espresso underline decoration-gold/50">One Million Coders Programme</span> ensures every 'R' in our strategic framework translates into actionable deployment steps—from precise demand mapping to the mass regeneration of local intellectual property.
                </p>
                <ul className="space-y-6">
                  {COLLABORATION_STRATEGY.map((item, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex gap-4 group"
                    >
                      <div className="mt-1.5 w-2 h-2 bg-gold rounded-full flex-shrink-0 group-hover:scale-150 transition-transform" />
                      <div>
                        <span className="text-sm font-bold text-espresso block mb-1">{item.title}</span>
                        <p className="text-xs text-[#777] leading-relaxed italic">{item.detail}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-10 rounded-2xl border border-[#E5E1D5] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-10 relative z-10">4 Specialized Alliance Programmes</h3>
                <ul className="space-y-6 relative z-10">
                  {PROGRAMMES.map((prog, i) => (
                    <li key={i} className="flex items-center gap-5 group">
                      <div 
                        className="w-10 h-10 rounded uppercase flex items-center justify-center text-white shadow-md transition-transform group-hover:rotate-12"
                        style={{ backgroundColor: prog.color }}
                      >
                        {prog.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-espresso">{prog.title}</span>
                        <span className="text-[8px] font-bold text-gold uppercase tracking-[0.2em] mt-0.5">Enrolment Open</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-12 pt-8 border-t border-[#E5E1D5]">
                  <p className="text-[10px] text-[#888] leading-relaxed">
                    Each track merges SmartBridge's Skill Wallet platform capabilities with Techbridge's industrial design focus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="sovereignty" className="mb-32 py-20 border-y border-[#E5E1D5] grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-12 bg-crimson" />
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-gold">Compliance & Security</h4>
                <h3 className="text-4xl font-bold text-espresso mt-1">Sovereignty is Foundation.</h3>
              </div>
            </div>
            <p className="text-lg text-[#555] leading-relaxed mb-10">
              Techbridge serves as the <span className="font-bold text-espresso">Local Data Steward</span> in the alliance. While SmartBridge (India & Ghana) provides the Skill Wallet platform and delivery infrastructure, all student PII, learning pathways, and assessment data are anchored in Ghanaian jurisdiction.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: <Lock />, title: "GDPR & DPA", desc: "Full alignment with Ghana Data Protection Act." },
                { icon: <Scale />, title: "Legal Orbit", desc: "All contracts under Ghana High Court." },
                { icon: <Database />, title: "Local Nodes", desc: "Data residency in West African AWS zones." },
                { icon: <Cpu />, title: "Gov Metrics", desc: "Direct real-time dashboard for Ministry." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-md border border-[#F0EEE5] bg-white/50">
                  <div className="text-gold mt-1">{item.icon}</div>
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-espresso">{item.title}</h5>
                    <p className="text-[9px] text-[#777] mt-1 leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="content-card relative overflow-hidden h-[500px]">
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <Building className="w-64 h-64" />
             </div>
             <h4 className="text-xs font-bold uppercase tracking-widest text-espresso mb-8">Deployment Readiness Curve</h4>
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={COLLABORATIVE_FLOW} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#8C1A2E" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#8C1A2E" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E1D5" />
                   <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#AAA', fontWeight: 'bold' }} 
                   />
                   <YAxis hide />
                   <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                   />
                   <Area 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#8C1A2E" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorEff)" 
                   />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
             <div className="mt-8 flex justify-between items-center bg-[#FAF9F6] p-6 rounded-md border border-[#E5E1D5]">
               <div>
                 <div className="text-[9px] font-bold uppercase tracking-widest text-[#AAA]">Combined Velocity</div>
                 <div className="text-2xl font-serif italic text-crimson">8 Weeks to Launch</div>
               </div>
               <p className="text-[10px] text-[#777] max-w-[180px] leading-relaxed">
                 Leveraging Techbridge's existing campus infrastructure and proven processes for instant SmartBridge platform rollout.
               </p>
             </div>
          </div>
        </section>

        {/* Economic Multiplier */}
        <section id="economic-multiplier" className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="bg-espresso text-white p-12 rounded-tech-lg relative">
                <div className="multiplier-dot absolute top-8 right-8 w-4 h-4" />
                <h3 className="text-3xl font-serif italic mb-8">The Local Reinvestment Mandate.</h3>
                <p className="text-sm text-white/70 leading-relaxed mb-10">
                  By partnering with a Ghanaian institution, the project ensures that 60% of technical service fees are retained locally for infrastructure growth, creating an economic ripple effect.
                </p>
                <div className="space-y-4">
                  {[
                    "Hiring 45+ Local Technical Staff",
                    "Expansion of Oyibi GPU Cluster",
                    "Regional Hub Infrastructure Fees",
                    "Tax Revenue Retention in Ghana"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gold/80">
                      <CheckCircle2 className="w-4 h-4 text-crimson" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-7 order-1 lg:order-2">
              <SectionEyebrow text="Alliance Economic Impact" />
              <h3 className="text-4xl font-bold text-espresso mb-8 leading-tight">GHS 1.2B Economic Value Retained via Local Integration.</h3>
              <p className="text-[#555] leading-relaxed mb-10 text-lg">
                The SmartBridge × Techbridge alliance eliminates the 'Profit Leakage' often associated with direct international vendor procurement. We ensure that a significant portion of the programme budget circulates within the Ghanaian technical ecosystem.
              </p>
              <div className="grid grid-cols-2 gap-8 border-t border-[#E5E1D5] pt-10">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#AAA] mb-2">Foreign Service Value</div>
                  <div className="text-xl font-bold text-[#555]">GHS 280M</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-crimson mb-2">Local Retention (60%)</div>
                  <div className="text-xl font-bold text-espresso">GHS 420M</div>
                </div>
              </div>
              <button
                onClick={() => document.getElementById('economic')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-12 group flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-espresso hover:text-crimson transition-colors"
              >
                View Full Economic Impact Model <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* Alliance Resource Optimization */}
        <section id="delivery" className="mb-32">
          <SectionEyebrow text="Resource Allocation & Efficiency" />
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <h3 className="text-3xl font-bold text-espresso max-w-xl">
              Efficiency Through Local Integration.
            </h3>
            <p className="text-[11px] font-bold text-[#777] max-w-xs text-right">
              The alliance model significantly reduces overhead by utilizing existing local infrastructure and expertise, compared to high-cost international direct procurement.
            </p>
          </div>
          <div className="content-card">
            <AllianceEfficiencyTable />
          </div>
        </section>

        {/* Conclusion / Final Recommendation */}
        <section className="bg-espresso-deep text-white p-12 md:p-24 rounded-tech-lg text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-crimson via-gold to-crimson" />
          <SectionEyebrow text="Executive Summary: The Partner Model" />
          <h2 className="text-3xl md:text-5xl font-serif italic mb-10 max-w-5xl mx-auto leading-tight">
            Selecting the <span className="text-gold">Techbridge × SmartBridge Alliance</span> ensures Ghana secures world-class technology with absolute sovereign control and local economic impact.
          </h2>
          <div className="flex flex-col items-center gap-12 mt-12 mb-16">
            <button
              onClick={() => window.open('mailto:partnership@techbridge.edu.gh?subject=One Million Coders: Alliance Protocol Activation', '_blank')}
              className="bg-crimson px-12 py-5 rounded-sm text-[12px] font-bold uppercase tracking-widest hover:bg-white hover:text-espresso transition-all flex items-center gap-3 shadow-xl"
            >
              Activate Alliance Protocol <CheckCircle2 className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold font-sans">Secure Academic Portal</span>
              <code className="text-gold font-mono text-sm bg-white/5 px-6 py-3 rounded-lg border border-white/10 shadow-inner">
                admissions.techbridge.edu.gh
              </code>
            </div>
          </div>
          <div className="flex justify-center gap-12 opacity-30 items-center">
            <div className="text-[9px] font-bold uppercase tracking-widest">Techbridge verified ops</div>
            <div className="text-gold text-lg">✦</div>
            <div className="text-[9px] font-bold uppercase tracking-widest">SmartBridge platform tech</div>
            <div className="text-crimson text-lg">✦</div>
            <div className="text-[9px] font-bold uppercase tracking-widest">Ministry Dashboard Ready</div>
          </div>
        </section>
        
        {/* Economic Impact Model */}
        <section id="economic" className="mb-40 pt-20">
          <div className="flex flex-col lg:flex-row justify-between items-start mb-16 gap-12">
            <div className="max-w-3xl">
              <SectionEyebrow text="Alliance Economic Model" />
              <h3 className="text-4xl md:text-6xl font-black text-espresso leading-tight mt-6">
                Quantifying the <span className="text-gold italic font-serif">Dividends</span> of Sovereignty.
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {ECONOMIC_IMPACT_METRICS.map((metric, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl border border-[#E5E1D5] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#AAA]">{metric.label}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${metric.growth.startsWith('+') ? 'bg-green-100 text-green-700' : metric.growth === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-gold/10 text-gold'}`}>
                    {metric.growth}
                  </span>
                </div>
                <div className="text-4xl font-black text-espresso mb-4 group-hover:text-gold transition-colors">{metric.value}</div>
                <p className="text-xs text-[#777] leading-relaxed">{metric.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="content-card p-10 h-[500px] flex flex-col">
              <div className="mb-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-espresso mb-1">Growth Forecast Trend</h4>
                <p className="text-[11px] text-[#777]">Projected GVA Contribution ($ Billions)</p>
              </div>
              <div className="flex-grow w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={GVA_TREND_DATA}>
                    <defs>
                      <linearGradient id="colorGva" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C49A22" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#C49A22" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EEE5" />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#AAA', fontWeight: 'bold' }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#AAA', fontWeight: 'bold' }} 
                      tickFormatter={(value) => `$${value}B`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E5E1D5', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#1A0A06', marginBottom: '4px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="gva" 
                      stroke="#C49A22" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorGva)" 
                      name="Direct Contribution"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="projection" 
                      stroke="#8C1A2E" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fill="transparent"
                      name="Maximum Optimized"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="content-card p-10 h-[500px] flex flex-col">
              <div className="mb-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-espresso mb-1">Sectoral Contribution Breakdown</h4>
                <p className="text-[11px] text-[#777]">Value Distribution by Industry %</p>
              </div>
              <div className="flex-grow w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SECTOR_CONTRIBUTION_CHART} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F0EEE5" />
                    <XAxis 
                      type="number" 
                      hide 
                    />
                    <YAxis 
                      dataKey="sector" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#1A0A06', fontWeight: 'bold' }} 
                      width={100}
                    />
                    <Tooltip 
                      cursor={{ fill: '#FAF7F0' }}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E5E1D5' }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#1A0A06" 
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                      name="Contribution %"
                    >
                      {SECTOR_CONTRIBUTION_CHART.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1A0A06' : '#C49A22'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 pt-6 border-t border-[#F0EEE5] grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-espresso rounded-sm" />
                  <span className="text-[9px] font-bold text-espresso uppercase tracking-widest">Primary Sectors</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gold rounded-sm" />
                  <span className="text-[9px] font-bold text-espresso uppercase tracking-widest">Growth Vectors</span>
                </div>
              </div>
            </div>

            <div className="content-card p-10 h-[500px] flex flex-col lg:col-span-2">
              <div className="mb-10 flex justify-between items-end">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-espresso mb-1">Impact Scaling: Workforce Absorption</h4>
                  <p className="text-[11px] text-[#777]">1M Coders Programme: Employment Trajectory</p>
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-crimson" />
                    <span className="text-[10px] font-bold text-[#AAA] uppercase">Technical</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    <span className="text-[10px] font-bold text-[#AAA] uppercase">Creative</span>
                  </div>
                </div>
              </div>
              <div className="flex-grow w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={JOB_CREATION_TRENDS}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EEE5" />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#AAA', fontWeight: 'bold' }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#AAA', fontWeight: 'bold' }} 
                      tickFormatter={(value) => `${value/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E5E1D5', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#1A0A06', marginBottom: '4px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="technical" 
                      stroke="#8C1A2E" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#8C1A2E', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      name="Technical Roles"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="creative" 
                      stroke="#C49A22" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#C49A22', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      name="Creative Tech Roles"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-espresso text-white rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 pointer-events-none" />
            <div className="p-10 md:p-16">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-12">Sectoral Absorption Dynamics</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">
                      <th className="pb-6 pr-6">Priority Industry</th>
                      <th className="pb-6 pr-6">Impact Tier</th>
                      <th className="pb-6 pr-6">Core Technology Integration</th>
                      <th className="pb-6 text-right">Economic Forecast</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SECTORAL_DYNAMICS.map((row, i) => (
                      <tr key={i} className="border-b border-white/5 group hover:bg-white/5 transition-colors">
                        <td className="py-8 pr-6">
                          <div className="text-lg font-bold text-white group-hover:text-gold transition-colors">{row.industry}</div>
                        </td>
                        <td className="py-8 pr-6">
                          <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest">{row.impact}</div>
                        </td>
                        <td className="py-8 pr-6">
                          <div className="text-xs text-white/60 font-mono italic">{row.tech}</div>
                        </td>
                        <td className="py-8 text-right">
                          <div className="text-sm font-black text-gold">{row.forecast}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between p-8 bg-parchment border border-dashed border-[#E5E1D5] rounded-xl gap-8">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-espresso rounded-lg flex items-center justify-center text-gold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-espresso">Verified Industrial Alignment</p>
                <p className="text-[10px] text-[#777]">Certified by Ministry of Trade and Industrial Relations</p>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 border border-espresso text-espresso text-[10px] font-black uppercase tracking-widest hover:bg-espresso hover:text-white transition-all"
            >
              Download Full Impact Report
            </button>
          </div>
        </section>

        {/* Deliverable Metadata (Methodology Compliance) */}
        <section className="mt-40 pt-20 border-t border-[#E5E1D5] grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#AAA] mb-8">Next-Phase Recommendations</h4>
            <div className="space-y-6">
              {[
                { title: "SME Pipeline Activation", detail: "Linking final-year projects directly to localized SME technical needs in Accra and Kumasi." },
                { title: "GPU Cluster Expansion", detail: "Escalating the Oyibi node to support generative video rendering for the Digital Media track." },
                { title: "Sovereign API Gateway", detail: "Finalizing the real-time Ministry dashboard for 1:1 student progress verification." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-gold font-serif italic text-lg hover:scale-110 transition-transform cursor-default">0{i+1}</div>
                  <div>
                    <h5 className="text-xs font-bold text-espresso">{item.title}</h5>
                    <p className="text-[11px] text-[#777] mt-1">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-8 bg-espresso text-white rounded-lg shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 group-hover:bg-gold/10 transition-colors" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gold mb-6 relative z-10">Design System Spec (6R V1.0)</h4>
            <div className="grid grid-cols-2 gap-6 text-[10px] font-mono relative z-10">
              <div>
                <span className="text-white/40 block mb-2 uppercase tracking-tighter">Primaries</span>
                <div className="flex gap-2 items-center"><div className="w-3 h-3 bg-crimson rounded-full" /> #8C1A2E</div>
                <div className="flex gap-2 items-center mt-2"><div className="w-3 h-3 bg-gold rounded-full" /> #C49A22</div>
              </div>
              <div>
                <span className="text-white/40 block mb-2 uppercase tracking-tighter">Surfaces</span>
                <div className="flex gap-2 items-center"><div className="w-3 h-3 bg-parchment rounded-full border border-white/20" /> #FAF7F0</div>
                <div className="flex gap-2 items-center mt-2"><div className="w-3 h-3 bg-espresso rounded-full border border-white/10" /> #1A0A06</div>
              </div>
              <div className="col-span-2 pt-4 border-t border-white/10">
                <span className="text-white/40 block mb-2 uppercase tracking-tighter">Typography & Motion</span>
                <p className="text-white/80">Inter Sans / Space Grotesk / Playfair Serif</p>
                <p className="text-white/40 mt-1">Transitions: 220ms ease-out · Hover: scale(1.02)</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-parchment border-t border-[#E5E1D5] py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <Logo className="w-10 h-10" />
              <div className="text-espresso font-black font-serif text-lg">×</div>
              <div className="w-8 h-8 flex items-center justify-center">
                <img src={SMARTBRIDGE_LOGO} alt="SmartBridge Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
            </div>
            <p className="text-[11px] text-[#555] leading-relaxed max-w-sm">
              The unified solution for Ghana's digital transformation. Combining international innovation with local institutional trust and sovereign compliance.
            </p>
          </div>
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#2A1A1A] mb-8">Partnership</h5>
            <div className="text-[11px] text-[#555] space-y-4">
              <p>Common Liaison: Accra, Ghana</p>
              <p>Governance: partnership@techbridge.edu.gh</p>
              <p>Reporting: Real-time API Enabled</p>
            </div>
          </div>
          <div className="text-right">
             <div className="text-[10px] font-mono text-[#AAA]">
              Alliance Version 1.0.4<br />
              6R Protocol Implementation<br />
              Ref: Retina Strategic Core
             </div>
          </div>
        </div>
      </footer>

      {/* Guides */}
      <UserGuide isOpen={isUserGuideOpen} onClose={() => setIsUserGuideOpen(false)} />
      <AdminGuide isOpen={isAdminGuideOpen} onClose={() => setIsAdminGuideOpen(false)} />

      {/* Help button floating in bottom right */}
      <div className="fixed bottom-6 right-6 flex gap-3 z-30">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdminGuideOpen(true)}
          className="p-3 bg-red-700 text-white rounded-full shadow-lg hover:bg-red-800 transition-colors"
          title="Admin Guide (Password Required)"
          aria-label="Open admin guide"
        >
          <Lock className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsUserGuideOpen(true)}
          className="p-3 bg-[#0f2545] text-white rounded-full shadow-lg hover:bg-[#1a3a5c] transition-colors"
          title="User Guide"
          aria-label="Open user guide"
        >
          <HelpCircle className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}

```

### FILE: src/index.css
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@300;400;500&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  --font-serif: "Playfair Display", serif;

  --color-parchment: #FAF7F0;
  --color-crimson: #8C1A2E;
  --color-gold: #C49A22;
  --color-espresso: #1A0A06;
  --color-espresso-deep: #0F0402;
  
  --radius-tech-sm: 4px;
  --radius-tech-md: 8px;
  --radius-tech-lg: 16px;
}

@layer base {
  body {
    @apply bg-parchment text-[#2A1A1A] font-sans selection:bg-crimson selection:text-white;
  }
}

.heading-italic {
  @apply font-serif italic text-crimson;
}

.stats-card {
  @apply bg-espresso text-white p-6 rounded-tech-md border-l-4 border-gold;
}

.content-card {
  @apply bg-white/50 backdrop-blur-sm border border-[#E5E1D5] rounded-tech-lg p-8;
}

.cta-button-sweep {
  @apply relative overflow-hidden border border-crimson text-crimson px-8 py-3 rounded-tech-sm font-medium transition-all duration-300 hover:text-white z-0;
}

.cta-button-sweep::before {
  content: "";
  @apply absolute top-0 left-0 w-0 h-full bg-crimson transition-all duration-300 ease-out -z-10;
}

.cta-button-sweep:hover::before {
  @apply w-full;
}

.gold-eyebrow {
  @apply border-l-2 border-gold pl-3 text-gold uppercase tracking-[0.16em] text-[10px] font-bold mb-4 flex items-center;
}

.multiplier-dot {
  @apply w-2 h-2 rounded-full bg-gold inline-block mr-2;
}

.serif-italic {
  @apply font-serif italic;
}

/* ── Alliance Brief Document ─────────────────────────── */

.brief-document {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  color: #1A0A06;
  background: white;
}

.brief-page {
  width: 210mm;
  height: 297mm;
  padding: 18mm 22mm 14mm;
  background: white;
  box-sizing: border-box;
  position: relative;
  page-break-after: always;
  break-after: page;
}

.brief-page:last-child {
  page-break-after: avoid;
  break-after: avoid;
}

/* Letterhead */
.brief-letterhead {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6mm;
}

.brief-letterhead-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brief-logo {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.brief-institution-name {
  font-size: 11pt;
  font-weight: 700;
  color: #1A0A06;
  letter-spacing: 0.02em;
}

.brief-institution-sub {
  font-size: 7.5pt;
  color: #777;
  line-height: 1.6;
}

.brief-document-type {
  font-size: 8pt;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #8C1A2E;
  padding: 4px 10px;
  border: 1.5px solid #8C1A2E;
}

/* Rules */
.brief-rule-gold {
  height: 2px;
  background: linear-gradient(to right, #C49A22, #E8C870, #C49A22);
  margin-bottom: 6mm;
}

.brief-rule-light {
  height: 1px;
  background: #E5E1D5;
  margin: 5mm 0;
}

.brief-rule-wide {
  margin: 6mm 0;
}

/* Header Block */
.brief-header-block {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 6mm;
}

.brief-header-block td {
  padding: 2.5px 0;
  font-size: 8.5pt;
  vertical-align: top;
}

.brief-header-label {
  font-weight: 700;
  color: #1A0A06;
  width: 90px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 7.5pt;
  padding-top: 3px !important;
}

.brief-header-value {
  color: #333;
}

.brief-header-subject {
  font-weight: 600;
  color: #1A0A06;
}

/* Sections */
.brief-section {
  margin-bottom: 6mm;
  break-inside: avoid;
  page-break-inside: avoid;
}

.brief-section-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 3mm;
  padding-bottom: 2mm;
  border-bottom: 1px solid #E5E1D5;
}

.brief-section-number {
  font-size: 9pt;
  font-weight: 800;
  color: #8C1A2E;
  font-variant-numeric: tabular-nums;
}

.brief-section-title {
  font-size: 9pt;
  font-weight: 800;
  color: #1A0A06;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* Body text */
.brief-body {
  font-size: 9pt;
  line-height: 1.65;
  color: #2A1A1A;
  margin-bottom: 2.5mm;
}

.brief-body-note {
  font-style: italic;
  color: #555;
  font-size: 8.5pt;
}

/* Bullets */
.brief-bullets {
  margin: 2mm 0 2mm 2mm;
}

.brief-bullet {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 2.5mm;
}

.brief-bullet-mark {
  font-size: 7pt;
  color: #8C1A2E;
  margin-top: 3px;
  flex-shrink: 0;
}

.brief-bullet-text {
  font-size: 8.5pt;
  line-height: 1.6;
  color: #2A1A1A;
  margin: 0;
}

.brief-bullet-text strong {
  font-weight: 700;
  color: #1A0A06;
}

/* Metric Grid */
.brief-metric-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3mm;
  margin: 3mm 0 4mm;
}

.brief-metric-card {
  padding: 4mm 5mm;
  border: 1px solid #E5E1D5;
  border-left: 3px solid #C49A22;
  background: #FDFCF9;
}

.brief-metric-label {
  font-size: 7pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #888;
  margin-bottom: 1mm;
}

.brief-metric-value {
  font-size: 11pt;
  font-weight: 800;
  color: #1A0A06;
  margin-bottom: 1.5mm;
  font-family: 'Playfair Display', serif;
  font-style: italic;
}

.brief-metric-desc {
  font-size: 7.5pt;
  line-height: 1.55;
  color: #555;
}

/* Authorisation */
.brief-auth {
  margin: 4mm 0 8mm;
}

.brief-auth-label {
  font-size: 8pt;
  color: #777;
  margin-bottom: 2mm;
}

.brief-auth-name {
  font-size: 11pt;
  font-weight: 800;
  color: #1A0A06;
  margin-bottom: 1mm;
}

.brief-auth-title {
  font-size: 8.5pt;
  color: #333;
  line-height: 1.6;
}

.brief-auth-coordination {
  font-size: 8pt;
  color: #777;
  font-style: italic;
  margin-top: 2mm;
}

/* Footer */
.brief-footer {
  margin-top: 4mm;
  padding-top: 4mm;
  border-top: 1px solid #E5E1D5;
}

.brief-footer-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: 7pt;
  color: #AAA;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
}

.brief-footer-dot {
  color: #C49A22;
  font-size: 6pt;
}

/* Screen preview wrapper */
@media screen {
  .brief-document {
    background: #F0EDE6;
    padding: 20px;
    min-height: 100vh;
  }

  .brief-page {
    margin: 0 auto 20px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  }
}

/* Print */
@media print {
  @page {
    size: A4;
    margin: 0;
  }

  body {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .brief-document {
    background: white;
    padding: 0;
  }

  .brief-page {
    width: 210mm;
    min-height: 297mm;
    margin: 0;
    box-shadow: none;
  }
}

```

### FILE: src/main.tsx
```typescript
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

```

### FILE: src/UserGuide.tsx
```typescript
import React from 'react';
import { X, BookOpen, Eye, Share2, Download, MapPin, Zap, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface UserGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserGuide({ isOpen, onClose }: UserGuideProps) {
  if (!isOpen) return null;

  const sections = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Understanding the Proposal',
      content: [
        'SmartGhana presents a strategic alliance between Techbridge University College and SmartBridge — comprising SmartBridge India (the global Skill Wallet platform provider) and SmartBridge Ghana (the in-country implementation arm) — to deliver Ghana\'s One Million Coders Programme.',
        'The interactive proposal showcases how all three entities\' strengths complement each other to create a locally-responsive, globally-scalable, and sovereignly-operated solution.'
      ]
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Navigating the Interface',
      content: [
        'Use the navigation menu to explore different sections: Why Techbridge, Programme Details, Platform Features, Track Record, Impact Metrics, and Implementation Timeline.',
        'Scroll through each section to see detailed information, charts, and comparisons. All sections are accessible via keyboard navigation.'
      ]
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Key Metrics & Visualizations',
      content: [
        'Charts and graphs throughout the proposal show growth projections, regional coverage, and programme impact.',
        'Hover over (or focus on) chart elements to see detailed values. Charts are keyboard-accessible and include alt text for screen readers.'
      ]
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'Downloading the Alliance Brief',
      content: [
        'Click the "Download Alliance Brief" button to export a formal A4 PDF document suitable for government submission.',
        'The PDF is print-optimized and includes all key sections: strategic vision, programme structure, economic impact, and call to action.'
      ]
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: 'Sharing & Installation',
      content: [
        'SmartGhana is a Progressive Web App (PWA). On mobile devices, tap "Share" or "Add to Home Screen" to install it locally.',
        'The app works offline after the first visit, making it accessible even with intermittent internet connectivity.'
      ]
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      title: 'Accessibility Features',
      content: [
        'All text is UK British English for clarity and consistency.',
        'The interface supports keyboard navigation (Tab, Enter, Escape).',
        'Images include descriptive alt text. Charts are accessible to screen readers.',
        'Colour contrast meets WCAG AA standards for readability.'
      ]
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full my-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0f2545] to-[#1a3a5c] text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              <h2 className="text-2xl font-bold">User Guide</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close user guide"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Introduction */}
            <section>
              <p className="text-gray-700 leading-relaxed">
                Welcome to SmartGhana. This guide will help you navigate the interactive proposal
                and understand the strategic alliance between Techbridge and SmartBridge for Ghana's
                One Million Coders Programme.
              </p>
            </section>

            {/* Sections */}
            {sections.map((section, idx) => (
              <motion.section
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#FCD116] rounded-lg flex items-center justify-center text-[#0f2545]">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0f2545] mb-2">
                      {section.title}
                    </h3>
                    <ul className="space-y-2">
                      {section.content.map((item, i) => (
                        <li key={i} className="text-gray-600 leading-relaxed flex gap-2">
                          <span className="text-[#FCD116] mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.section>
            ))}

            {/* Footer */}
            <section className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                <strong>Need help?</strong> Contact daniel.twum@techbridge.edu.gh for technical
                support or questions about the proposal.
              </p>
            </section>
          </div>

          {/* Action Button */}
          <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#0f2545] text-white rounded-lg hover:bg-[#1a3a5c] transition-colors font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

```

### FILE: tests/e2e.spec.ts
```typescript
import { test, expect } from '@playwright/test';

test.describe('Techbridge × SmartBridge Alliance E2E Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    // We point to the local dev server
    await page.goto('/');
  });

  test('should display the correct page title and branding', async ({ page }) => {
    // Check if the main heading exists or some identifying text
    const heroTitle = page.locator('h2', { hasText: 'The Synergy of Global Tech and Local Execution.' });
    await expect(heroTitle).toBeVisible();

    // Check for Techbridge logo in navbar
    const logo = page.locator('img[alt="Techbridge University College Logo"]');
    await expect(logo).toBeVisible();
  });

  test('should have a functional navigation bar with all anchors', async ({ page }) => {
    const navAnchors = ['Synergy', 'Model', 'Compliance', 'Delivery', 'Economic Impact'];
    
    for (const anchor of navAnchors) {
      const link = page.locator(`nav a:has-text("${anchor}")`);
      await expect(link).toBeVisible();
    }
  });

  test('should scroll to the "Review Partnership Model" section when CTA is clicked', async ({ page }) => {
    const ctaButton = page.locator('button:has-text("Review Partnership Model")');
    await ctaButton.click();
    
    // Check if the section with ID review-model is in viewport (or at least exists and is scrolled to)
    const reviewSection = page.locator('#review-model');
    await expect(reviewSection).toBeInViewport();
  });

  test('should display the Synergy Matrix with all dimensions', async ({ page }) => {
    const synergySection = page.locator('#synergy');
    await expect(synergySection).toBeVisible();

    const dimensions = ['Operational Delivery', 'User Experience', 'Data & Hosting'];
    for (const dim of dimensions) {
      await expect(page.locator(`h3:has-text("${dim}")`)).toBeVisible();
    }
  });

  test('should display the 4 specialized degree programmes', async ({ page }) => {
    const programmesSection = page.locator('#programmes');
    await expect(programmesSection).toBeVisible();

    const degreeTitles = [
      'Product Design & Entrepreneurship',
      'Fashion Design Technology',
      'Jewellery Design Technology',
      'Digital Media & Communications Design'
    ];

    for (const title of degreeTitles) {
      await expect(page.locator(`h4:has-text("${title}")`)).toBeVisible();
    }
  });

  test('should display data visualization components (Charts)', async ({ page }) => {
    // Recharts uses SVG elements
    const charts = page.locator('.recharts-responsive-container');
    const count = await charts.count();
    // We expect multiple charts (GVA, Sectoral, Workforce, Readiness)
    expect(count).toBeGreaterThanOrEqual(3);
    
    // Check for at least one SVG being present within a chart container
    const firstChartSvg = charts.first().locator('svg');
    await expect(firstChartSvg).toBeVisible();
  });

  test('should display the 6R Framework steps', async ({ page }) => {
    const modelSection = page.locator('#model');
    await expect(modelSection).toBeVisible();

    const rs = ['Review', 'Reduce', 'Refine', 'Reuse', 'Regenerate', 'Reinforce'];
    for (const r of rs) {
      await expect(page.locator(`h4:has-text("${r}")`)).toBeVisible();
    }
  });

  test('should display the Economic Impact metrics', async ({ page }) => {
    const economicSection = page.locator('#economic');
    await expect(economicSection).toBeVisible();

    await expect(page.locator('text=$2.4B')).toBeVisible();
    await expect(page.locator('text=42%')).toBeVisible();
    await expect(page.locator('text=150+')).toBeVisible();
  });

  test('should be responsive and show/hide elements correctly', async ({ page, isMobile }) => {
    if (isMobile) {
      // In mobile view, the navigation links should be hidden (as per current App.tsx hidden lg:flex)
      const navLinks = page.locator('nav .hidden.lg\\:flex');
      await expect(navLinks).toBeHidden();
    } else {
      // In desktop view, they should be visible
      const navLinks = page.locator('nav .hidden.lg\\:flex');
      await expect(navLinks).toBeVisible();
    }
  });

  test('should have a functional "Alliance Brief" download button', async ({ page }) => {
    const downloadButton = page.locator('button:has-text("Alliance Brief")');
    await expect(downloadButton).toBeEnabled();
  });

  test('should display the compliance section with security icons', async ({ page }) => {
    const sovereigntySection = page.locator('#sovereignty');
    await expect(sovereigntySection).toBeVisible();
    
    await expect(page.locator('text=GDPR & DPA')).toBeVisible();
    await expect(page.locator('text=Data residency in West African AWS zones')).toBeVisible();
  });

});

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}

```

### FILE: vite.config.ts
```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'SmartGhana — Techbridge Alliance',
          short_name: 'SmartGhana',
          description: 'Ghana\'s Sovereign One Million Coders Framework — Interactive proposal',
          theme_color: '#0f2545',
          background_color: '#ffffff',
          display: 'standalone',
          scope: './',
          start_url: './',
          icons: [
            {
              src: '/icon-192x192.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
              purpose: 'any'
            },
            {
              src: '/icon-512x512.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any'
            },
            {
              src: '/icon-192x192.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
              purpose: 'maskable'
            },
            {
              src: '/icon-512x512.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                }
              }
            }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            recharts: ['recharts'],
            motion: ['motion/react'],
            lucide: ['lucide-react'],
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
  };
});

```

