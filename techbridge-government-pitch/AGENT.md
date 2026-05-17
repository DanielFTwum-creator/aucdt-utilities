# techbridge-government-pitch - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for techbridge-government-pitch.

### FILE: CLAUDE.md
```md
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---
## Task Delegation

When spawning subagents, use the cheapest model that can handle the task:
- Haiku: bulk mechanical tasks - file ops, formatting, renaming, 
  simple transformations. No judgment required.
- Sonnet: scoped research, code exploration, summarization, 
  synthesis across sources.
- Opus: only when real planning or tradeoffs are involved - 
  architecture, ambiguous requirements, high-stakes decisions.

### Spawn rules:
- Haiku subagents cannot spawn further subagents. 
  If they need to, the task was wrong-sized - return to parent.
- Max spawn depth: 2 (parent → subagent → one more tier, no deeper)
- If a subagent realizes it needs a smarter model, 
  it returns to the parent instead of escalating on its own.
  
## Quick Commands

**Package manager:** pnpm 8.15.0 (required)

| Task | Command |
|---|---|
| **Development server** | `pnpm dev` (localhost:3000) |
| **Build for production** | `pnpm build` (TypeScript check + Vite) |
| **Type checking only** | `pnpm lint` (tsc --noEmit) |
| **Run tests** | `pnpm test` |
| **Tests with watch mode** | `pnpm test:watch` |
| **Coverage report** | `pnpm test:coverage` |
| **Export to PDF** | `pnpm run export-pdf` (builds site, then Playwright + pdf-lib → `exports/`) |
| **Deploy to server** | `pnpm run deploy` (builds + SCP to `/smart/` on techbridge.edu.gh) |

**Note:** This project uses pnpm exclusively. Do not use npm or yarn.

**Deployment:** The `deploy` script copies the production build to the server at `/var/www/vhosts/techbridge.edu.gh/httpdocs/smart/`. Requires SSH access to `root@techbridge.edu.gh` and assumes the `/smart/` directory exists.

---

## Architecture Overview

### Purpose
This is a government proposal website for Ghana's **One Million Coders Programme**. It pitches Techbridge Education Services Ghana as the delivery partner against a named competitor (SmartBridge, India-based). The site is also packaged as a formal PDF document for government submission.

### Stack
- **Frontend:** React 19 + TypeScript 5.9 + Vite 7
- **Routing:** React Router v7 (flat routes, no lazy loading, `basename="/smart"`)
- **Styling:** Tailwind CSS v4 + PostCSS
- **Deployment path:** `/smart/` (configurable via `vite.config.ts` `base` and `App.tsx` `basename`)
- **Animation:** Framer Motion (every page uses `fadeUp` / `fadeIn` variants with `whileInView`)
- **Charts:** Recharts (ImpactPage only)
- **Icons:** lucide-react
- **Build:** Vite with SPA fallback (`try_files $uri $uri/ /index.html` in nginx.conf)
- **Deployment:** Docker (multi-stage: Node build → nginx serve)
- **Testing:** Vitest + @testing-library/react

### Routes (9 total, all flat)
```
/                          → HomePage
/why-techbridge            → WhyTechbridgePage
/programme                 → ProgrammePage
/platform                  → PlatformPage
/track-record              → TrackRecordPage
/impact                    → ImpactPage
/implementation            → ImplementationPage
/contact                   → ContactPage
/executive-summary         → ExecutiveSummaryPage (PDF export friendly)
```

### Layout Structure
- **App.tsx** — Root: `<BrowserRouter>` wrapping `<Navbar>` + `<Routes>` + `<Footer>`
- **Navbar.tsx** — Navigation + mobile hamburger menu
- **Footer.tsx** — Shared footer on all pages

### Styling & Theming

**Tailwind v4 dual theme definition:**
- `tailwind.config.js` — extends `theme.colors` with custom palettes
- `src/index.css` — `@theme` block (Tailwind v4 syntax) *[canonical]*

**Color systems:**
- `techbridge-*` — Brand colors: navy, blue, gold, green, light
- `ghana-*` — Flag stripe: red, gold, green (decorative motif on every page)
- `academic-*` — Legacy from prior ThesisAI project (unused)

**Typography:**
- Headings: `font-serif` (Crimson Text 400/600/700)
- Body: `font-sans` (Inter 300–700)

### Animation Pattern
Every page follows the same motion pattern:
```tsx
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

<motion.div
  variants={variants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
```
Uses `whileInView` (not `animate`) so elements animate as they scroll into view.

### PDF Export (Dual Mechanism)

**Browser print (built-in):**
- `ExecutiveSummaryPage` has a print button (`window.print()`)
- `src/index.css` has `@media print` rules: hide nav/footer, add `page-break-after: always` to `.exec-page` divs
- User prints directly from browser

**Playwright automation (`scripts/export-pdf.js`):**
- Run: `pnpm run export-pdf`
- Builds site → starts Vite preview on port 4174 → uses Playwright Chromium to capture each of 9 routes as A4 PDF
- Merges PDFs using `pdf-lib`
- Outputs two files to `exports/`:
  - `Techbridge-One-Million-Coders-Proposal.pdf` (all 9 routes)
  - `Techbridge-Executive-Summary.pdf` (only `/executive-summary`)

### Pages at a Glance
- **HomePage** — Hero with Ghana flag stripe, animated stats (8 weeks, 15K students, 50+ institutions), comparison vs foreign vendors
- **WhyTechbridgePage** — Competitive analysis: 8-row comparison table vs SmartBridge + 4 pillar cards (Accountability, Availability, Ghana Knowledge, Economic Impact)
- **ProgrammePage** — Programme structure: 4 tech tracks (AI/ML, Cloud, Data Science, SoftDev), 3-step learning model, 5-phase lifecycle, regional coverage, year-by-year targets (50K → 1M)
- **PlatformPage** — Three live Techbridge platforms (main LMS, AI hub, adaptive AI), metrics, Skill Wallet mockup, infrastructure features
- **TrackRecordPage** — 5-year history (2020–2025): stat cards, timeline, partnerships, 7-programme breadth, testimonials
- **ImpactPage** — Data dashboard: KPIs, line chart (growth), bar chart (regional), pie chart (tracks), radar chart (Techbridge vs benchmark), ROI visualization
- **ImplementationPage** — 8-week deployment roadmap, phase cards, vs competitor timeline, governance grid, sustainability phases, org chart, risk/mitigation cards
- **ContactPage** — Contact form (`useState`-managed, no API call), three contact cards, process flow, emergency contact
- **ExecutiveSummaryPage** — 8-page A4 PDF-ready document with `page-break-after: always` per page, print/CSS-only rendering
- **LandingPage.tsx** — *Unmounted* (legacy from prior iteration, not in router)

### State Management
**No global state library.** Only local `useState` in three places:
- **ContactPage:** form fields + `submitted` boolean
- **PlatformPage:** `useCountUp` counter animation via `useRef` + `useEffect` + `useInView`
- **Navbar:** `menuOpen` for mobile hamburger menu

### API Integration
**No API calls in production code.** `axios` is in `package.json` but unused. The contact form is client-side only (`setSubmitted(true)` on submit).

The Vite dev server proxies `/api` to `http://localhost:8080` (no backend implemented in this repo).

---

## Bundle & Performance

**Code splitting:** Routes are lazy-loaded using React's `lazy()` and `Suspense`. Each page is a separate chunk, downloaded only when visited. Initial load downloads the main bundle (381 kB gzip) + CSS; subsequent page navigation streams only the needed chunk.

**Bundle breakdown (gzip):**
- Main: 122 kB
- ImpactPage (Recharts): 123.81 kB
- Other pages: 3-8 kB each

This is optimized for slower internet connections — users see the home page quickly, then stream additional pages on demand.

## PWA & Mobile Support

**Progressive Web App:** The app is configured as a PWA with:
- **Service worker** — Generated by `vite-plugin-pwa` using Workbox. Provides offline caching and background sync.
- **Web App Manifest** — Defines app metadata (name, icons, theme colors) for install prompts on iOS/Android home screens.
- **Icons** — SVG icons (192×192 and 512×512 px) stored in `public/` folder; auto-copied to `dist/`.
- **Mobile meta tags** — iOS standalone mode, theme colors, status bar styling configured in `index.html`.

**Files:**
- `public/manifest.json` — App metadata
- `public/favicon.svg`, `icon-192x192.svg`, `icon-512x512.svg` — App icons
- `dist/sw.js` — Service worker (generated at build time)
- `dist/manifest.webmanifest` — Alternative manifest format (auto-generated by Vite PWA plugin)

**Testing PWA:**
```bash
pnpm build && pnpm preview
# In DevTools:
#   - Application → Service Workers (should show active)
#   - Application → Manifest (should show app metadata)
#   - Try offline mode (DevTools → Network → Offline) — site should still load cached pages
```

**App Store packaging:** To publish to Google Play and Apple App Store, you'll need Capacitor. See `GAP-ANALYSIS-MOBILE.md` for the complete roadmap and cost/timeline breakdown.

## Known Issues

1. **Dual theme token definition:** Both `tailwind.config.js` and `src/index.css` define custom colors. For Tailwind v4, the `@theme` block in CSS is canonical; the JS config may be redundant. Clarify which is authoritative to avoid maintenance confusion.

---

## Testing

- **Framework:** Vitest + @testing-library/react
- **Setup:** `src/test/setup.ts` imports `@testing-library/jest-dom` and runs `cleanup()` after each test
- **Environment:** jsdom with `globals: true`
- **Coverage:** Reports to `text`, `json`, `html` (excludes `node_modules/`, `src/test/`, config files)
- **Current state:** Tests are stale and non-functional against the current app

---

## Docker & Deployment

**Dockerfile:**
- Multi-stage: `node:18-alpine` → build stage (pnpm install + vite build) → `nginx:alpine` serve stage
- Copies `dist/` to nginx html root, uses custom `nginx.conf`
- Exposes port 80

**nginx.conf:**
- SPA catch-all: `try_files $uri $uri/ /index.html`
- API proxy: `/api` → `http://backend:8080` with websocket upgrade headers
- Ready for Kubernetes or standalone reverse proxy

---

## Development Notes

- **Hot reload:** Vite HMR is enabled on dev server; changes to React components and CSS are reflected instantly
- **TypeScript strict mode:** Enabled; `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` are enforced
- **CSS:** All styling is Tailwind utility classes; no CSS-in-JS or separate stylesheets per component
- **Icons:** Lucide React icons; check [lucide.dev](https://lucide.dev) for available icon names
- **Animations:** Framer Motion variants are locally scoped per page; consider extracting to `src/constants/animations.ts` if duplication grows

---

*Last updated: 2026-05-06*

```

### FILE: Dockerfile
```text
FROM node:24-alpine AS build
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source
COPY . .

# Build
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

```

### FILE: GAP-ANALYSIS-MOBILE.md
```md
# Gap Analysis: App Store & Play Store Packaging

**Status:** This project is a React + Vite web SPA with **zero** mobile app packaging infrastructure. Publishing to app stores requires significant setup work.

**Recommended approach:** Use **Capacitor** (Ionic's open-source framework) to wrap the web app as a native iOS/Android app. This requires no React rewrite — Capacitor packages the existing `dist/` folder as-is.

---

## 1. Missing Assets

| Asset | Required For | Current Status | Action |
|---|---|---|---|
| App icons (1024×1024 PNG) | Both stores | **MISSING** | Create master icon; Capacitor auto-generates all sizes |
| Splash screens (2732×2732 px) | Both stores | **MISSING** | Design for onboarding screen |
| Real favicon (`favicon.ico` + `favicon.png`) | Browser/PWA | **BROKEN** (points to `/vite.svg`) | Create and place in `public/` folder |
| `public/` folder | Vite static assets | **MISSING** | Create; will hold icons, manifest, robots.txt |

---

## 2. Missing PWA Infrastructure

PWA is a prerequisite for app store submission (especially on Google Play via "Trusted Web Activity"). The project currently has zero PWA support.

| Item | Status | Action | Notes |
|---|---|---|---|
| `public/manifest.json` | **MISSING** | Create manifest with app metadata | Define `name`, `short_name`, `icons`, `theme_color`, `display: standalone` |
| Service worker (offline support) | **MISSING** | Install `vite-plugin-pwa` and configure Workbox | Enables caching, offline fallback |
| `<link rel="manifest">` in HTML | **MISSING** | Auto-injected once plugin is installed | Vite plugin modifies `index.html` at build time |
| `<meta name="theme-color">` | **MISSING** | Add to `index.html` | Use `#0f2545` (techbridge-navy) |
| `<link rel="apple-touch-icon">` | **MISSING** | Add once icons exist | Points to `public/apple-touch-icon.png` |
| `<meta name="apple-mobile-web-app-capable">` | **MISSING** | Add to `index.html` | Enables iOS home screen installation |
| `<meta name="apple-mobile-web-app-status-bar-style">` | **MISSING** | Add to `index.html` | iOS status bar styling (recommend `black-translucent`) |

---

## 3. Missing Capacitor (Native Bridge) Setup

Capacitor is the bridge between the web app and native iOS/Android APIs. Without it, the app cannot access device hardware, notifications, or be distributed via stores.

### Installation Steps

```bash
# 1. Install Capacitor core and CLI
pnpm add @capacitor/core @capacitor/cli

# 2. Initialize Capacitor project
pnpm exec cap init
# When prompted:
#   - App name: Techbridge (or "Techbridge Government Pitch")
#   - App ID: com.techbridge.governmentpitch (or similar)
#   - Web dir: dist
#   - API: Yes (to enable native plugins later)

# 3. Build the web app
pnpm build

# 4. Add Android platform
pnpm add @capacitor/android
pnpm exec cap add android
# Creates android/ directory with Gradle project

# 5. Add iOS platform (Mac only)
pnpm add @capacitor/ios
pnpm exec cap add ios
# Creates ios/ directory with Xcode project

# 6. Sync web build into native projects
pnpm exec cap sync
```

### What This Creates
- `capacitor.config.ts` — Central config file for both platforms
- `android/` — Android Gradle project with WebView container
- `ios/` — iOS Xcode project with WebView container
- `.gitignore` entries for native build artifacts

---

## 4. Google Play Store (Android) Requirements

| Requirement | Status | Notes |
|---|---|---|
| **Platform** | Ready (Capacitor handles) | Target SDK ≥ 34 (Android 14) auto-configured |
| **Build artifact** | Ready (Capacitor handles) | `.aab` (app bundle) generated via `./gradlew bundleRelease` |
| **Signing** | **TODO** | Generate release keystore (one-time) |
| **Developer account** | **TODO** | USD $25 one-time, supports multiple apps |
| **App listing** | **TODO** | Title, description, short description (80 chars max) |
| **Screenshots** | **TODO** | Minimum 2 phone screenshots (5.5" or 6.7" aspect ratio) |
| **Feature graphic** | **TODO** | 1024×500 px banner image for store listing |
| **Privacy policy** | **TODO** | URL required (e.g., `https://techbridge.edu.gh/privacy`) |
| **Permissions** | **TODO** | Declare required permissions in `AndroidManifest.xml` |
| **Minimum API level** | Ready | Capacitor sets to 23+ (Android 6.0+) |

### Build & Sign for Play Store
```bash
cd android
./gradlew bundleRelease
# Output: app/release/app-release.aab
# Then upload to Play Console with release keystore
```

---

## 5. Apple App Store (iOS) Requirements

| Requirement | Status | Notes |
|---|---|---|
| **Platform** | Ready (Capacitor handles) | iOS 13.0+ supported |
| **Build system** | Ready (Xcode) | Use Xcode 15+ or command line with `xcodebuild` |
| **Signing** | **TODO** | Provisioning profiles & certificates (requires Apple Developer account) |
| **Developer account** | **TODO** | USD $99/year |
| **App Store Connect listing** | **TODO** | Title, subtitle, keywords, description |
| **Screenshots** | **TODO** | 6.5" iPhone (Pro Max) and 5.5" iPhone SE versions required |
| **Privacy manifest** | **TODO** | `PrivacyInfo.xcprivacy` required since iOS 17 (declare SDKs used) |
| **Build artifact** | Ready (Capacitor handles) | `.ipa` (app package) ready for App Store submission |

### Build & Archive for App Store
```bash
cd ios
xcodebuild -workspace TechbridgeGovernmentPitch.xcworkspace \
  -scheme TechbridgeGovernmentPitch -configuration Release \
  -archivePath build/TechbridgeGovernmentPitch.xcarchive archive
```
Then use Xcode Organizer or Transporter to submit to App Store Connect.

---

## 6. Implementation Order & Timeline

### Phase 1: PWA & Web Foundation (1–2 days)
```
[1] Create public/ folder structure
[2] Design and export app icons (1024×1024 PNG)
[3] Create manifest.json with app metadata
[4] Install vite-plugin-pwa, configure Workbox
[5] Update index.html with missing meta tags
[6] Test PWA: `pnpm build && pnpm preview` → check DevTools for manifest, service worker
```

### Phase 2: Capacitor Setup (1 day)
```
[7] Install Capacitor CLI and core
[8] Init Capacitor (creates config file)
[9] Add Android platform (requires Android SDK)
[10] Add iOS platform (Mac only, requires Xcode)
[11] Test on Android emulator or iOS simulator
```

### Phase 3: Store Submission (3–5 days)
```
[12] Generate signed Android release bundle
[13] Create Google Play Developer account (USD $25)
[14] Create Play Store listing with screenshots & description
[15] Submit Android `.aab` for review (typically 2–4 hours)
[16] (iOS only) Generate Xcode archive
[17] Create Apple App Store Connect account (USD $99/year)
[18] Create App Store listing with screenshots
[19] Create PrivacyInfo.xcprivacy manifest
[20] Submit to App Store for review (typically 1–2 days)
```

---

## 7. Critical Dependencies to Install

```json
{
  "devDependencies": {
    "@capacitor/cli": "^latest",
    "@capacitor/core": "^latest",
    "@capacitor/android": "^latest",
    "@capacitor/ios": "^latest",
    "vite-plugin-pwa": "^latest"
  }
}
```

---

## 8. Key Files to Create/Modify

| File | Action | Purpose |
|---|---|---|
| `public/` | Create directory | House icons, manifest, favicon, robots.txt |
| `public/manifest.json` | Create | PWA manifest defining app metadata |
| `public/favicon.ico` | Create | Real favicon (replace `/vite.svg` reference) |
| `vite.config.ts` | Modify | Add `VitePWA` plugin config |
| `index.html` | Modify | Add missing mobile meta tags |
| `capacitor.config.ts` | Create (auto) | Generated by `pnpm exec cap init` |
| `android/` | Create (auto) | Generated by `pnpm exec cap add android` |
| `ios/` | Create (auto) | Generated by `pnpm exec cap add ios` |

---

## 9. High-Level Architecture After Setup

```
techbridge-government-pitch/
├── src/                          # React source (unchanged)
├── dist/                         # Built web app
├── public/                       # Static assets (NEW)
│   ├── manifest.json
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── icons/                    # All generated sizes
├── android/                      # Android Gradle project (NEW)
│   ├── app/src/main/...
│   └── build.gradle
├── ios/                          # iOS Xcode project (NEW)
│   ├── App.xcodeproj/
│   └── Podfile
├── capacitor.config.ts           # Capacitor config (NEW)
└── vite.config.ts                # Updated with PWA plugin
```

---

## 10. Cost Summary

| Item | Cost | Frequency |
|---|---|---|
| Google Play Developer account | USD $25 | One-time |
| Apple Developer Program | USD $99 | Annual |
| Design services (app icon, splash screen) | Variable | One-time |
| **Total minimum** | **USD $124** | Annual |

---

## 11. Next Steps

1. **Confirm scope:** Are you targeting both Android and iOS, or just one?
2. **Design assets:** Who will design app icons and splash screens?
3. **Timeline:** When do you need the app live in stores?
4. **Backend:** Will the app need new API endpoints, or use existing `techbridge.edu.gh` endpoints?

---

*Last updated: 2026-05-06*  
*Techbridge Government Pitch — Mobile Packaging Assessment*

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
    <title>Techbridge — Ghana's One Million Coders Partner</title>
    <meta name="description" content="Techbridge Education Services Ghana — the local, ready-now partner for Ghana's National Digital Skills Development Initiative." />
    <link rel="manifest" href="/manifest.json" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```

### FILE: LICENSE
```text
MIT License

Copyright (c) 2025 DanielFTwum-creator

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

```

### FILE: package.json
```json
{
  "name": "techbridge-government-pitch",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@8.15.0",
  "scripts": {
    "dev": "vite",
    "start": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "tsc --noEmit",
    "install-clean": "pnpm install && pnpm start",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "export-pdf": "pnpm run build && node scripts/export-pdf.js",
    "generate-intro-pdfs": "node scripts/generate-intro-pdfs.js",
    "deploy": "pnpm build && scp -r dist/ root@techbridge.edu.gh:/var/www/vhosts/techbridge.edu.gh/httpdocs/smart/"
  },
  "dependencies": {
    "axios": "^1.13.2",
    "framer-motion": "^12.23.24",
    "lucide-react": "^0.554.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.9.6",
    "recharts": "^3.5.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.2.4",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^19.2.6",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "@vitest/coverage-v8": "^4.0.13",
    "autoprefixer": "^10.4.22",
    "jsdom": "^27.2.0",
    "pdf-lib": "^1.17.1",
    "playwright": "^1.59.1",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.17",
    "typescript": "^5.9.3",
    "vite": "^7.2.4",
    "vite-plugin-pwa": "^1.3.0",
    "vitest": "^4.0.13"
  }
}

```

### FILE: postcss.config.js
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}

```

### FILE: PWA-IMPLEMENTATION-SUMMARY.md
```md
# PWA Implementation Summary

## ✅ Completed

This session has completed **Phase 1** of the App Store packaging roadmap (PWA & Web Foundation).

### 1. Public Folder & Assets
- ✅ Created `public/` directory
- ✅ Created SVG app icons:
  - `public/icon-192x192.svg` (192×192 px)
  - `public/icon-512x512.svg` (512×512 px)
  - `public/favicon.svg` (favicon)
- ✅ Icons use Techbridge brand colors:
  - Navy background (#0f2545)
  - Gold accent (#FCD116)
  - Ghana flag stripe motif

### 2. PWA Configuration
- ✅ Created `public/manifest.json` with complete app metadata:
  - App name, short name, description
  - Icon definitions (both `any` and `maskable` purposes)
  - Theme colors (navy #0f2545, background white)
  - Start URL, scope, display mode (`standalone`)
  - Shortcuts for Platform and Contact pages
- ✅ Installed `vite-plugin-pwa` (v1.3.0)
- ✅ Configured Workbox service worker with:
  - Auto-update mode (users get updates automatically)
  - Google Fonts caching (1-year cache with max 10 entries)
  - Gstatic fonts caching (1-year cache)
  - 32 entries precached at build time

### 3. HTML Meta Tags
- ✅ Updated `index.html` with missing mobile tags:
  - `<meta name="theme-color">` (#0f2545)
  - `<meta name="apple-mobile-web-app-capable">`
  - `<meta name="apple-mobile-web-app-status-bar-style">` (black-translucent)
  - `<meta name="mobile-web-app-capable">`
  - `<link rel="manifest">` (manifest.json)
  - `<link rel="apple-touch-icon">` (for iOS home screen)
- ✅ Fixed favicon reference (was broken `/vite.svg` → now `/favicon.svg`)

### 4. Build Configuration
- ✅ Updated `vite.config.ts`:
  - Added VitePWA plugin import
  - Configured PWA manifest, workbox, and caching strategies
  - Service worker will auto-update when new builds are deployed

### 5. Build Artifacts
- ✅ Build successful with PWA files:
  - `dist/sw.js` — Service worker (3 KB)
  - `dist/workbox-dcde9eb3.js` — Workbox runtime (21 KB)
  - `dist/manifest.json` — App manifest (2 KB)
  - `dist/manifest.webmanifest` — Alternative manifest format
  - `dist/favicon.svg`, `icon-*.svg` — App icons
  - `dist/registerSW.js` — Service worker registration
  - 32 entries precached (1008.58 KiB total)

### 6. Documentation
- ✅ Created `GAP-ANALYSIS-MOBILE.md` — Complete roadmap for App Store/Play Store
- ✅ Updated `CLAUDE.md` with PWA & mobile support section
- ✅ Created this summary document

---

## 📋 What's Working Now

### Web (All Browsers)
- ✅ Full PWA support (install to home screen on iOS/Android)
- ✅ Offline caching via service worker
- ✅ Auto-updates when you redeploy
- ✅ Works on slow internet (code splitting + Workbox caching)
- ✅ Manifest allows "Add to Home Screen" prompts

### Testable Features (localhost:3000 or production)
```bash
# Test locally:
pnpm build && pnpm preview

# In DevTools (F12):
#   → Application → Service Workers (should show "active")
#   → Application → Manifest (shows app metadata)
#   → Go offline (DevTools → Network → Offline)
#   → Refresh page — should still load cached pages
```

---

## 📦 Next Steps (Phase 2: Capacitor)

To publish to **Google Play Store** and **Apple App Store**, you'll need:

### Prerequisites
1. Mac with Xcode 15+ (for iOS)
2. Android SDK (for Android)
3. Google Play Developer account (USD $25)
4. Apple Developer account (USD $99/year)

### Steps
```bash
# 1. Install Capacitor
pnpm add @capacitor/core @capacitor/cli

# 2. Initialize Capacitor
pnpm exec cap init
# Answer prompts:
#   - App name: Techbridge (or longer name)
#   - App ID: com.techbridge.governmentpitch
#   - Web directory: dist

# 3. Add Android platform
pnpm add @capacitor/android
pnpm exec cap add android
# Creates: android/ directory with Gradle project

# 4. Add iOS platform (Mac only)
pnpm add @capacitor/ios
pnpm exec cap add ios
# Creates: ios/ directory with Xcode project

# 5. Sync and build
pnpm build
pnpm exec cap sync

# 6. Build for stores
# Android:
cd android && ./gradlew bundleRelease

# iOS:
cd ios
xcodebuild -workspace TechbridgeGovernmentPitch.xcworkspace \
  -scheme TechbridgeGovernmentPitch -configuration Release \
  -archivePath build/Archive.xcarchive archive
```

See `GAP-ANALYSIS-MOBILE.md` for the full **20-step roadmap** and cost breakdown.

---

## 📊 Current State

| Component | Status | Ready for |
|---|---|---|
| Web PWA | ✅ Complete | Offline use, home screen install |
| Service Worker | ✅ Complete | Caching, auto-updates |
| App Icons | ✅ Complete | All platforms |
| Manifest | ✅ Complete | Browser install prompts |
| Code Splitting | ✅ Complete | Fast loads on slow internet |
| Google Play | ⏳ Phase 2 | Capacitor setup required |
| Apple App Store | ⏳ Phase 2 | Capacitor + Mac + Xcode required |

---

## 🚀 Deploy & Test

To deploy the PWA to your server:
```bash
pnpm deploy
# Builds + SCPs to techbridge.edu.gh:/smart/
```

Then test at: **https://techbridge.edu.gh/smart/**
- Open in mobile browser
- Look for "Add to Home Screen" option
- Works offline after first visit

---

*Last updated: 2026-05-06*  
*PWA Implementation Complete — Ready for Phase 2 (Capacitor)*

```

### FILE: scripts/export-pdf.js
```javascript
/**
 * Techbridge Government Pitch — PDF Export Script
 * Captures all 8 website pages + Executive Summary to PDF using Playwright.
 *
 * Usage:
 *   pnpm run export-pdf
 *
 * Output:
 *   exports/Techbridge-One-Million-Coders-Proposal.pdf   (full site)
 *   exports/Techbridge-Executive-Summary.pdf              (exec summary)
 */

import { chromium } from 'playwright'
import { PDFDocument } from 'pdf-lib'
import { spawn } from 'child_process'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import http from 'http'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const EXPORTS = resolve(ROOT, 'exports')
const PORT = 4174

const SITE_ROUTES = [
  { path: '/', label: 'Home' },
  { path: '/why-techbridge', label: 'Why Techbridge' },
  { path: '/programme', label: 'The Programme' },
  { path: '/platform', label: 'Our Platform' },
  { path: '/track-record', label: 'Track Record' },
  { path: '/impact', label: 'Impact' },
  { path: '/implementation', label: 'Implementation' },
  { path: '/contact', label: 'Contact' },
]

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function testPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/`, (res) => {
      resolve(res.statusCode < 500)
    })
    req.on('error', () => resolve(false))
    req.setTimeout(500, () => req.destroy())
  })
}

function startPreviewServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'node',
      ['node_modules/.bin/vite', 'preview', '--port', String(PORT)],
      { cwd: ROOT, shell: process.platform === 'win32', stdio: 'inherit' }
    )

    proc.on('error', reject)

    // Poll for port to be ready (with fallback to alternate ports)
    let attempts = 0
    const checkReady = async () => {
      attempts++
      if (attempts > 30) {
        reject(new Error(`Preview server failed to start after 30 attempts`))
        return
      }

      // Try the requested port first, then check 4173 (default Vite preview port)
      const portReady = await testPort(PORT) || await testPort(4173)
      if (portReady) {
        resolve(proc)
      } else {
        setTimeout(checkReady, 200)
      }
    }

    setTimeout(checkReady, 500)
  })
}

async function capturePage(page, url, label) {
  console.log(`  → ${label}`)
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
  await sleep(1200)
  return page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
  })
}

async function mergeAndSave(buffers, filename) {
  const merged = await PDFDocument.create()
  for (const buf of buffers) {
    const doc = await PDFDocument.load(buf)
    const pages = await merged.copyPages(doc, doc.getPageIndices())
    pages.forEach(p => merged.addPage(p))
  }
  const bytes = await merged.save()
  const outPath = resolve(EXPORTS, filename)
  writeFileSync(outPath, bytes)
  console.log(`  ✅ Saved → exports/${filename}`)
}

async function main() {
  mkdirSync(EXPORTS, { recursive: true })

  if (!existsSync(resolve(ROOT, 'dist'))) {
    console.log('⚙  No dist found — building first...')
    const { execSync } = await import('child_process')
    execSync('node node_modules/.bin/vite build', { cwd: ROOT, stdio: 'inherit' })
  }

  console.log('\n🚀 Starting preview server...')
  const server = await startPreviewServer()

  // Extra wait to ensure server is fully ready
  await sleep(2000)

  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })

  try {
    const page = await context.newPage()

    // Detect actual port (try PORT first, then 4173 default)
    let actualPort = PORT
    if (!(await testPort(PORT))) {
      if (await testPort(4173)) {
        actualPort = 4173
      } else {
        throw new Error('Preview server not responding on ports 4174 or 4173')
      }
    }

    // ── Full Site Export ──────────────────────────────────────────
    console.log(`\n📄 Exporting full site PDF (port ${actualPort})...`)
    const siteBuffers = []
    for (const route of SITE_ROUTES) {
      const pdf = await capturePage(page, `http://localhost:${actualPort}${route.path}`, route.label)
      siteBuffers.push(pdf)
    }
    await mergeAndSave(siteBuffers, 'Techbridge-One-Million-Coders-Proposal.pdf')

    // ── Executive Summary ─────────────────────────────────────────
    console.log('\n📋 Exporting Executive Summary...')
    const execBuf = await capturePage(page, `http://localhost:${actualPort}/executive-summary`, 'Executive Summary')
    await mergeAndSave([execBuf], 'Techbridge-Executive-Summary.pdf')

  } finally {
    await browser.close()
    server.kill()
  }

  console.log('\n✅ All PDFs exported to ./exports/')
}

main().catch(err => {
  console.error('Export failed:', err.message)
  process.exit(1)
})

```

### FILE: scripts/generate-intro-pdfs.js
```javascript
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

async function generateLetterHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Techbridge Introductory Letter</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: white;
    }

    .document {
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      padding: 25mm;
      background: white;
      position: relative;
    }

    .header {
      border-bottom: 3px solid #FCD116;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }

    .institution {
      font-weight: 600;
      font-size: 14px;
      color: #0f2545;
    }

    .institution-details {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
    }

    .date-section {
      margin-top: 24px;
      margin-bottom: 24px;
      font-size: 13px;
    }

    .recipient {
      margin-bottom: 24px;
      font-size: 13px;
    }

    .recipient-label {
      font-weight: 600;
      color: #0f2545;
    }

    h1 {
      font-size: 16px;
      font-weight: 700;
      color: #0f2545;
      margin: 24px 0 12px 0;
      line-height: 1.4;
    }

    h2 {
      font-size: 14px;
      font-weight: 600;
      color: #0f2545;
      margin: 18px 0 10px 0;
    }

    p {
      font-size: 12px;
      line-height: 1.7;
      margin-bottom: 12px;
      text-align: justify;
    }

    .section {
      margin-bottom: 16px;
    }

    ul {
      margin-left: 20px;
      margin-bottom: 12px;
    }

    li {
      font-size: 12px;
      line-height: 1.6;
      margin-bottom: 6px;
    }

    .checkmark {
      margin-right: 8px;
      color: #059669;
      font-weight: bold;
    }

    .signature-section {
      margin-top: 32px;
      font-size: 12px;
    }

    .signature-name {
      font-weight: 600;
      color: #0f2545;
      margin-top: 12px;
    }

    .signature-title {
      color: #6b7280;
      font-size: 11px;
      margin-top: 4px;
    }

    .cc-section {
      margin-top: 24px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
      font-size: 11px;
      color: #6b7280;
    }

    strong {
      color: #0f2545;
      font-weight: 600;
    }

    @media print {
      body { margin: 0; padding: 0; }
      .document { margin: 0; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="document">
    <div class="header">
      <div class="institution">TECHBRIDGE UNIVERSITY COLLEGE</div>
      <div class="institution-details">
        Oyibi, Greater Accra, Ghana<br>
        Tel: +233-302788895<br>
        Email: daniel.twum@techbridge.edu.gh<br>
        Web: www.techbridge.edu.gh
      </div>
    </div>

    <div class="date-section">
      <strong>Date:</strong> 7 May 2026
    </div>

    <div class="recipient">
      <div class="recipient-label">TO THE HONOURABLE MINISTRIES & SMARTBRIDGE EDUCATION SERVICES</div>
      <div style="margin-top: 8px;">
        <strong>RE:</strong> Strategic Partnership Proposal — Ghana's One Million Coders Programme
      </div>
    </div>

    <p style="margin-bottom: 16px;"><strong>DEAR SIRS AND MADAM,</strong></p>

    <div class="section">
      <p>Techbridge University College writes to formally introduce ourselves as a strategic partner for Ghana's One Million Coders Programme, in collaboration with SmartBridge Education Services.</p>
    </div>

    <div class="section">
      <h2>WHO WE ARE</h2>
      <p>Techbridge University College is Ghana's leading technical institution, headquartered in Oyibi, Greater Accra. We specialise in industry-aligned digital and engineering disciplines through accredited degree programmes and hands-on, project-based learning methodologies. Our four specialised programmes — Product Design and Entrepreneurship, Fashion Design Technology, Jewellery Design Technology, and Digital Media & Communications Design — address Ghana's highest-value industrial sectors and export opportunities.</p>

      <p>As a quality-focused institution, we maintain an excellence-driven enrolment of approximately 200 students, with demonstrable track records in:</p>
      <ul>
        <li><strong>Industrial Partnership:</strong> Direct collaboration with Ghanaian SMEs and enterprises on live projects</li>
        <li><strong>Curriculum Innovation:</strong> Bridging academic theory with real-world technology applications and industry standards</li>
        <li><strong>Data Sovereignty:</strong> Full compliance with Ghana's Data Protection Act and national digital policy</li>
        <li><strong>Institutional Credibility:</strong> Accredited programmes, proven delivery, and strong employer partnerships</li>
      </ul>
    </div>

    <div class="section">
      <h2>THE OPPORTUNITY</h2>
      <p>The Government of Ghana's One Million Coders Programme represents a transformative national initiative to equip young Ghanaians with critical digital skills for the 21st-century economy. This vision aligns perfectly with Techbridge's mission: to cultivate a generation of sovereign industrial architects capable of building, owning, and exporting technology rooted in Ghanaian context.</p>
    </div>

    <div class="section">
      <h2>WHY TECHBRIDGE?</h2>
      <p>We bring three irreplaceable assets to this programme:</p>
      <ul>
        <li><strong>Operational Readiness</strong> — Techbridge's existing campus infrastructure, trained personnel, and active student cohort eliminate the need for a lengthy build phase. The programme can commence within eight weeks of partnership ratification.</li>
        <li><strong>Local Institutional Credibility</strong> — We are not a foreign vendor. We are a Ghanaian institution with deep understanding of local policy, regulatory landscape, employer ecosystems, and student demographics. Government engagement, institutional partnerships, and curriculum alignment flow through trusted local channels.</li>
        <li><strong>Industrial Alignment</strong> — Our specialised programmes (CAD/CAM for Jewellery, Digital Textile for Fashion, AI-native Product Design) directly address Ghana's sectoral export strategies, ensuring graduate employability and economic impact.</li>
      </ul>
    </div>

    <div class="section">
      <h2>THE SMARTBRIDGE PARTNERSHIP</h2>
      <p>We propose integrating SmartBridge Education Services' proven Skill Wallet platform — a global experiential learning ecosystem with 2+ million learners across 3,000+ institutions — with Techbridge's institutional infrastructure and regional reach.</p>

      <p>This is not a capacity-building exercise. It is a <strong>structural transformation</strong> of Ghana's technical workforce:</p>
      <ul>
        <li><strong>SmartBridge India</strong> provides the global AI-native learning platform, algorithmic curriculum engine, and international quality standards</li>
        <li><strong>SmartBridge Ghana</strong> manages in-country deployment and government liaison</li>
        <li><strong>Techbridge</strong> anchors the partnership with physical facilities, accredited programmes, and sovereign data stewardship</li>
      </ul>

      <p>The result: world-class technology delivered with absolute Ghanaian control.</p>
    </div>

    <div class="section">
      <h2>OUR COMMITMENT</h2>
      <p>As Head of Institution, I commit Techbridge to:</p>
      <ul>
        <li><span class="checkmark">✓</span> <strong>100% alignment</strong> with Ghana's digital and sectoral policy frameworks</li>
        <li><span class="checkmark">✓</span> <strong>Full transparency</strong> in programme delivery, student outcomes, and government reporting</li>
        <li><span class="checkmark">✓</span> <strong>Data sovereignty</strong> — all student PII, learning records, and assessment data remain in Ghana under Techbridge stewardship</li>
        <li><span class="checkmark">✓</span> <strong>Economic retention</strong> — 60% of technical service fees circulate within Ghana's domestic economy through local hiring and infrastructure investment</li>
        <li><span class="checkmark">✓</span> <strong>Measurable impact</strong> — real-time government dashboards tracking enrolment, competency growth, regional distribution, and employer outcomes</li>
      </ul>
    </div>

    <div class="section">
      <h2>NEXT STEPS</h2>
      <p>We invite the Ministry of Communications and Digitalization, Presidential Special Initiatives, Youth and Employment Agency, Ghana Digital Centre, and SmartBridge leadership to a technical synchronisation workshop to:</p>
      <ul>
        <li>Finalise the Sovereign Access Node deployment plan</li>
        <li>Initiate the SME Demand Mapping audit</li>
        <li>Align curriculum with Ministry vocational standards</li>
        <li>Establish governance and oversight structures</li>
      </ul>

      <p>We have prepared a comprehensive Alliance Brief detailing the strategic vision, delivery framework, economic impact projections, and implementation roadmap. This document is ready for your review and discussion.</p>
    </div>

    <div class="section">
      <h2>CLOSING</h2>
      <p>Ghana's digital transformation is not a capacity-building exercise—it is a structural statement about our nation's sovereignty and economic future. By partnering with Techbridge and SmartBridge, the Government of Ghana can demonstrate that the One Million Coders Programme builds Ghana, for Ghanaians, with absolute control over our digital future.</p>

      <p>We stand ready to commence Phase One immediately upon agreement.</p>
    </div>

    <div class="signature-section">
      <p>Yours in service to Ghana's digital future,</p>
      <div class="signature-name">Daniel Frempong Twum</div>
      <div class="signature-title">Head of ICT & Special Adviser to the Founder</div>
      <div class="signature-title">Techbridge University College</div>
      <div style="margin-top: 8px; font-size: 11px; color: #6b7280;">
        Tel: +233-302788895<br>
        Email: daniel.twum@techbridge.edu.gh
      </div>
    </div>

    <div class="cc-section">
      <strong>Cc:</strong><br>
      Ministry of Communications and Digitalization<br>
      Presidential Special Initiatives<br>
      Youth and Employment Agency<br>
      Ghana Digital Centre<br>
      SmartBridge Education Services (India & Ghana)
    </div>
  </div>
</body>
</html>`;
}

async function generateEmailHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Techbridge Introductory Email</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: white;
    }

    .document {
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      padding: 25mm;
      background: white;
      position: relative;
    }

    .email-header {
      border-bottom: 2px solid #FCD116;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }

    .email-subject {
      font-weight: 600;
      font-size: 14px;
      color: #0f2545;
      margin-bottom: 4px;
    }

    .email-meta {
      font-size: 12px;
      color: #6b7280;
    }

    .email-body {
      font-size: 12px;
      line-height: 1.7;
    }

    .email-body p {
      margin-bottom: 12px;
    }

    strong {
      color: #0f2545;
      font-weight: 600;
    }

    h3 {
      font-size: 13px;
      font-weight: 600;
      color: #0f2545;
      margin: 16px 0 8px 0;
    }

    ul {
      margin-left: 20px;
      margin-bottom: 12px;
    }

    li {
      font-size: 12px;
      line-height: 1.6;
      margin-bottom: 6px;
    }

    .signature {
      margin-top: 20px;
      border-top: 1px solid #e5e7eb;
      padding-top: 16px;
      font-size: 11px;
    }

    .signature-name {
      font-weight: 600;
      color: #0f2545;
      margin-top: 8px;
    }

    .signature-contact {
      color: #6b7280;
      margin-top: 4px;
    }

    .ps-section {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
      font-size: 11px;
      color: #6b7280;
    }

    .ps-section strong {
      color: #0f2545;
    }

    @media print {
      body { margin: 0; padding: 0; }
      .document { margin: 0; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="document">
    <div class="email-header">
      <div class="email-subject">Subject: Strategic Partnership Proposal — Ghana's One Million Coders Programme (Techbridge University College)</div>
      <div class="email-meta">To: [Minister/Director Name]</div>
    </div>

    <div class="email-body">
      <p>Dear <strong>[Minister/Director Name]</strong>,</p>

      <p>I write from Techbridge University College to introduce a strategic partnership opportunity for Ghana's One Million Coders Programme.</p>

      <p><strong>Techbridge</strong> is Ghana's leading technical institution (Oyibi, Greater Accra) with ~200 quality-focused students, four accredited industrial-aligned degree programmes, and proven delivery across Product Design, Fashion Technology, Jewellery Design, and Digital Media. We bring operational readiness, institutional credibility, and deep local policy alignment—plus campus infrastructure ready to scale.</p>

      <p><strong>SmartBridge</strong> brings a global AI-native learning platform (Skill Wallet) proven across 3,000+ institutions and 2+ million learners worldwide.</p>

      <p>Together, we propose a <strong>three-entity alliance:</strong></p>
      <ul>
        <li>SmartBridge India provides the global technology platform</li>
        <li>SmartBridge Ghana manages in-country implementation</li>
        <li>Techbridge provides campus infrastructure, accredited programmes, and sovereign data stewardship</li>
      </ul>

      <p><strong>The outcome:</strong> World-class digital skills training for Ghana's one million young people, with 100% Ghanaian control, measurable employment outcomes, and 60% economic retention within Ghana's domestic economy.</p>

      <p><strong>Programme can launch within 8 weeks</strong> of partnership ratification, using Techbridge's existing infrastructure and personnel—no build phase required.</p>

      <p>I invite you to a technical synchronisation workshop to discuss the strategic vision, deployment roadmap, and governance structures. I have attached:</p>
      <ol style="margin-left: 20px;">
        <li><strong>SmartGhana Interactive Proposal</strong> (digital presentation)</li>
        <li><strong>Alliance Brief PDF</strong> (formal 3-page document)</li>
        <li><strong>Implementation Roadmap</strong> (5-phase, 32-week deployment)</li>
      </ol>

      <p><strong>Next steps:</strong> Please let me know your availability for a meeting in <strong>May/June 2026</strong> to discuss how Techbridge, SmartBridge, and the Government of Ghana can jointly transform digital workforce readiness.</p>

      <p>I look forward to partnering to build Ghana's digital future.</p>

      <div class="signature">
        <p>Best regards,</p>
        <div class="signature-name">Daniel Frempong Twum</div>
        <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Head of ICT & Special Adviser to the Founder</div>
        <div style="font-size: 11px; color: #6b7280;">Techbridge University College</div>
        <div class="signature-contact">
          📧 daniel.twum@techbridge.edu.gh<br>
          📱 +233-302788895<br>
          🌐 www.techbridge.edu.gh<br>
          🏢 Oyibi, Greater Accra, Ghana
        </div>
      </div>

      <div class="ps-section">
        <p><strong>P.S.</strong> — This proposal aligns directly with:</p>
        <ul>
          <li>Ghana's National Digital Transformation Strategy</li>
          <li>The Ministry of Education's digital literacy targets</li>
          <li>The Ministry of Trade's sectoral export development agenda</li>
          <li>The Youth and Employment Agency's workforce readiness mandate</li>
        </ul>
        <p>We are ready to commence immediately upon government approval.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  try {
    // Create documents directory
    const docsDir = join(process.cwd(), 'public', 'documents');
    mkdirSync(docsDir, { recursive: true });
    console.log('✓ Documents directory ensured at', docsDir);

    // Launch Playwright
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Set viewport to A4
    await page.setViewportSize({ width: 794, height: 1123 });

    // Generate Introductory Letter PDF
    console.log('Generating Introductory Letter PDF...');
    const letterHTML = await generateLetterHTML();
    await page.setContent(letterHTML, { waitUntil: 'networkidle' });
    await page.pdf({
      path: join(docsDir, 'Techbridge-Intro-Letter.pdf'),
      format: 'A4',
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    console.log('✓ Introductory Letter PDF generated');

    // Generate Introductory Email PDF
    console.log('Generating Introductory Email PDF...');
    const emailHTML = await generateEmailHTML();
    await page.setContent(emailHTML, { waitUntil: 'networkidle' });
    await page.pdf({
      path: join(docsDir, 'Techbridge-Intro-Email.pdf'),
      format: 'A4',
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    console.log('✓ Introductory Email PDF generated');

    // Cleanup
    await browser.close();

    console.log('\n✅ PDF generation complete!');
    console.log(`Documents saved to: ${docsDir}`);
    console.log('  - Techbridge-Intro-Letter.pdf');
    console.log('  - Techbridge-Intro-Email.pdf');
  } catch (error) {
    console.error('❌ Error generating PDFs:', error);
    process.exit(1);
  }
}

main();

```

### FILE: src/App.tsx
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'

const WhyTechbridgePage = lazy(() => import('./pages/WhyTechbridgePage'))
const ProgrammePage = lazy(() => import('./pages/ProgrammePage'))
const PlatformPage = lazy(() => import('./pages/PlatformPage'))
const TrackRecordPage = lazy(() => import('./pages/TrackRecordPage'))
const ImpactPage = lazy(() => import('./pages/ImpactPage'))
const ImplementationPage = lazy(() => import('./pages/ImplementationPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const ExecutiveSummaryPage = lazy(() => import('./pages/ExecutiveSummaryPage'))

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-techbridge-blue"></div>
    </div>
  )
}

export default function App() {
  // Only use basename on production server, not in local dev
  const basename = window.location.pathname.startsWith('/smart') ? '/smart' : '/'

  return (
    <BrowserRouter basename={basename}>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/why-techbridge" element={<WhyTechbridgePage />} />
              <Route path="/programme" element={<ProgrammePage />} />
              <Route path="/platform" element={<PlatformPage />} />
              <Route path="/track-record" element={<TrackRecordPage />} />
              <Route path="/impact" element={<ImpactPage />} />
              <Route path="/implementation" element={<ImplementationPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/executive-summary" element={<ExecutiveSummaryPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

```

### FILE: src/components/Footer.tsx
```typescript
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Globe } from 'lucide-react'

const platformLinks = [
  { label: 'Why Techbridge', path: '/why-techbridge' },
  { label: 'The Programme', path: '/programme' },
  { label: 'Our Platform', path: '/platform' },
  { label: 'Track Record', path: '/track-record' },
  { label: 'Impact Dashboard', path: '/impact' },
  { label: 'Implementation Plan', path: '/implementation' },
]

const govLinks = [
  { label: 'Government Partnership', path: '/contact' },
  { label: 'Ministry Enquiries', path: '/contact' },
  { label: 'Platform Demonstration', path: '/contact' },
  { label: 'Programme Design', path: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-techbridge-navy">
      {/* Ghana flag stripe */}
      <div className="flex h-1">
        <div className="flex-1 bg-ghana-red" />
        <div className="flex-1 bg-ghana-gold" />
        <div className="flex-1 bg-ghana-green" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            {/* TUC Logo */}
            <div className="mb-4">
              <img
                src="https://techbridge.edu.gh/static/TUC_LOGO_1.png"
                alt="Techbridge University College Logo"
                className="h-12 mb-3"
              />
            </div>
            <div className="mb-3">
              <div className="text-xl font-serif font-bold text-white">Techbridge</div>
              <div className="text-[10px] text-ghana-gold/80 tracking-[0.2em] uppercase font-sans">
                Education Services Ghana
              </div>
            </div>
            <p className="text-white/55 text-sm leading-relaxed mb-5">
              Ghana's local-first digital skills partner. Five years serving Ghana's education sector.
              Ready to deliver the One Million Coders Programme in 8 weeks.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="px-2.5 py-1 bg-ghana-green/20 border border-ghana-green/40 rounded text-ghana-green text-xs font-semibold">
                Ghanaian-Owned
              </span>
              <span className="px-2.5 py-1 bg-techbridge-gold/20 border border-techbridge-gold/40 rounded text-techbridge-gold text-xs font-semibold">
                5+ Years in Ghana
              </span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Platform</h4>
            <ul className="space-y-2">
              {platformLinks.map(item => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-white/55 hover:text-techbridge-gold text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Government */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">For Government</h4>
            <ul className="space-y-2">
              {govLinks.map(item => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-white/55 hover:text-techbridge-gold text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 p-3 bg-ghana-green/10 border border-ghana-green/30 rounded-lg">
              <div className="text-ghana-green text-xs font-bold mb-1">One Million Coders Programme</div>
              <div className="text-white/50 text-xs">Operational in 8 weeks from agreement.</div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/55 text-sm">
                <MapPin className="w-4 h-4 text-ghana-gold mt-0.5 shrink-0" />
                Techbridge Education Services Ghana, Accra, Ghana
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-ghana-gold shrink-0" />
                <a href="mailto:government@techbridge.edu.gh" className="text-white/55 hover:text-techbridge-gold transition-colors">
                  government@techbridge.edu.gh
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-ghana-gold shrink-0" />
                <span className="text-white/55">+233 (0) 30 278 8895</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-ghana-gold shrink-0" />
                <a href="https://techbridge.edu.gh" target="_blank" rel="noopener noreferrer" className="text-white/55 hover:text-techbridge-gold transition-colors">
                  techbridge.edu.gh
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/35 text-xs">
            © 2026 Techbridge Education Services Ghana. All rights reserved.
          </p>
          <p className="text-white/35 text-xs">
            Submitted to: Ministry of Communications & Digitalization · Presidential Special Initiatives · Youth & Employment Agency · Ghana Digital Centre
          </p>
        </div>
      </div>
    </footer>
  )
}

```

### FILE: src/components/Navbar.tsx
```typescript
import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Download, ChevronDown } from 'lucide-react'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Why Techbridge', path: '/why-techbridge' },
  { label: 'The Programme', path: '/programme' },
  { label: 'Our Platform', path: '/platform' },
  { label: 'Track Record', path: '/track-record' },
  { label: 'Impact', path: '/impact' },
  { label: 'Implementation', path: '/implementation' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [downloadOpen, setDownloadOpen] = useState(false)
  const downloadRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
        setDownloadOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const downloadDocuments = [
    {
      label: 'Alliance Brief PDF',
      fileName: 'Techbridge-SmartBridge-Alliance-Brief.pdf',
      description: 'Formal 3-page proposal document'
    },
    {
      label: 'Introductory Letter',
      fileName: 'Techbridge-Intro-Letter.pdf',
      description: 'Formal government introduction'
    },
    {
      label: 'Introductory Email',
      fileName: 'Techbridge-Intro-Email.pdf',
      description: 'Executive summary version'
    }
  ]

  const handleDownload = (fileName: string) => {
    const link = document.createElement('a')
    // Use relative path that works in both dev and production
    const basePath = window.location.pathname.startsWith('/smart') ? '/smart' : ''
    link.href = `${basePath}/documents/${fileName}`
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setDownloadOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-techbridge-navy/97 backdrop-blur-md shadow-lg">
      {/* Ghana flag stripe */}
      <div className="flex h-0.5">
        <div className="flex-1 bg-ghana-red" />
        <div className="flex-1 bg-ghana-gold" />
        <div className="flex-1 bg-ghana-green" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex flex-col leading-none">
            <span className="text-xl font-serif font-bold text-white tracking-tight group-hover:text-techbridge-gold transition-colors">
              Techbridge
            </span>
            <span className="text-[9px] text-ghana-gold/80 tracking-[0.2em] uppercase font-sans">
              Education Services Ghana
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                pathname === link.path
                  ? 'bg-techbridge-gold text-techbridge-navy font-semibold'
                  : 'text-white/75 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Download Dropdown */}
          <div ref={downloadRef} className="relative ml-2">
            <button
              type="button"
              onClick={() => setDownloadOpen(!downloadOpen)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-medium text-white/75 hover:text-white hover:bg-white/10 transition-all"
            >
              <Download className="w-4 h-4" />
              Documents
              <ChevronDown className={`w-4 h-4 transition-transform ${downloadOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {downloadOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-1 w-56 bg-techbridge-navy border border-white/20 rounded-lg shadow-xl overflow-hidden z-50"
                >
                  {downloadDocuments.map(doc => (
                    <button
                      key={doc.fileName}
                      type="button"
                      onClick={() => handleDownload(doc.fileName)}
                      className="w-full px-4 py-3 text-left hover:bg-white/10 border-b border-white/10 last:border-b-0 transition-colors"
                    >
                      <p className="text-white font-medium text-sm">{doc.label}</p>
                      <p className="text-slate-400 text-xs mt-1">{doc.description}</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/contact"
            className="ml-3 bg-ghana-green hover:bg-ghana-green/80 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all shadow-md"
          >
            Contact Government Team
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-techbridge-navy border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    pathname === link.path
                      ? 'bg-techbridge-gold text-techbridge-navy font-semibold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Download Menu */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setDownloadOpen(!downloadOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Documents
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${downloadOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {downloadOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {downloadDocuments.map(doc => (
                        <button
                          key={doc.fileName}
                          type="button"
                          onClick={() => handleDownload(doc.fileName)}
                          className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-t border-white/10 first:border-t-0"
                        >
                          <p className="text-white font-medium text-sm">{doc.label}</p>
                          <p className="text-slate-400 text-xs mt-1">{doc.description}</p>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 bg-ghana-green text-white px-4 py-3 rounded-lg font-semibold text-sm text-center"
              >
                Contact Government Team
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

```

### FILE: src/index.css
```css
@import "tailwindcss";

@theme {
  /* Ghana flag colours */
  --color-ghana-red: #CE1126;
  --color-ghana-gold: #FCD116;
  --color-ghana-green: #006B3F;
  --color-ghana-black: #000000;

  /* Techbridge brand colours */
  --color-techbridge-navy: #0f2545;
  --color-techbridge-blue: #1a4b8c;
  --color-techbridge-gold: #FCD116;
  --color-techbridge-green: #006B3F;
  --color-techbridge-light: #f0f4fa;

  /* Academic legacy colours */
  --color-academic-navy: #1e3a5f;
  --color-academic-blue: #2563eb;
  --color-academic-amber: #f59e0b;
  --color-academic-gold: #fbbf24;
  --color-academic-slate: #475569;

  /* Fonts */
  --font-family-serif: 'Crimson Text', Georgia, serif;
  --font-family-sans: Inter, system-ui, sans-serif;
}

/* ── Print styles ───────────────────────────────────────────── */
@media print {
  /* Hide site chrome on ALL pages when printing */
  nav,
  footer,
  .no-print {
    display: none !important;
  }

  body {
    margin: 0;
    padding: 0;
    background: white !important;
  }

  /* Executive Summary page layout */
  .exec-page {
    page-break-after: always;
    break-after: page;
    box-shadow: none !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }

  .exec-page:last-child {
    page-break-after: avoid;
    break-after: avoid;
  }

  .exec-doc {
    padding: 0 !important;
    background: white !important;
  }
}


```

### FILE: src/main.tsx
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

### FILE: src/pages/ContactPage.tsx
```typescript
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail, Phone, MapPin, Clock, Users, Monitor,
  CheckCircle, ArrowRight, AlertCircle, Building2,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
}

const contactCards = [
  {
    icon: Users,
    title: 'Government Relations',
    description: 'Direct line for Ministry officials and government representatives.',
    detail: 'Email: government@techbridge.edu.gh',
    note: 'Response within 4 business hours',
    color: 'from-techbridge-blue to-techbridge-navy',
  },
  {
    icon: Monitor,
    title: 'Technical Demonstration',
    description: 'Request a live walkthrough of the One Million Coders platform.',
    detail: 'Email: demo@techbridge.edu.gh',
    note: 'Available Mon–Fri 8am–6pm GMT',
    color: 'from-techbridge-green to-emerald-700',
  },
  {
    icon: MapPin,
    title: 'Headquarters',
    description: 'Techbridge Education Services Ghana',
    detail: 'Accra, Ghana',
    note: 'techbridge.edu.gh',
    color: 'from-ghana-red to-red-700',
  },
]

const reasons = [
  {
    title: 'Fast Response',
    body: 'Government enquiries are prioritised. We respond within 4 business hours.',
    icon: Clock,
  },
  {
    title: 'Direct Access',
    body: "You'll speak directly with Techbridge's leadership — no intermediaries, no overseas handoffs.",
    icon: Users,
  },
  {
    title: 'Flexible Engagement',
    body: 'We can present at your offices, schedule a platform demo, or arrange a site visit to our Accra operations.',
    icon: MapPin,
  },
]

const steps = [
  { step: '01', label: 'Submit enquiry' },
  { step: '02', label: 'Receive confirmation within 4 hours' },
  { step: '03', label: 'Schedule briefing call or in-person meeting' },
  { step: '04', label: 'Receive formal proposal and platform demonstration' },
]

const ministries = [
  'Ministry of Communications and Digitalization',
  'Presidential Special Initiatives',
  'Youth and Employment Agency',
  'Ghana Digital Centre',
]

interface FormState {
  fullName: string
  organisation: string
  role: string
  email: string
  phone: string
  enquiryType: string
  message: string
}

const initialForm: FormState = {
  fullName: '',
  organisation: '',
  role: '',
  email: '',
  phone: '',
  enquiryType: '',
  message: '',
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-techbridge-light font-sans">

      <section className="relative bg-techbridge-navy overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-2 flex">
            <div className="flex-1 bg-ghana-red" />
            <div className="flex-1 bg-ghana-gold" />
            <div className="flex-1 bg-ghana-green" />
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <span className="inline-block text-techbridge-gold font-sans text-sm font-semibold tracking-widest uppercase mb-4">
              One Million Coders Programme
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="font-serif text-5xl md:text-6xl text-white leading-tight mb-6"
          >
            Begin the Partnership.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-blue-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Techbridge is ready to discuss implementation with the Ghana Government.
            Contact us to schedule a briefing.
          </motion.p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-center mb-14"
        >
          <h2 className="font-serif text-4xl text-techbridge-navy mb-3">Contact Information</h2>
          <p className="text-techbridge-blue max-w-xl mx-auto">
            Reach the right team directly. All government enquiries are handled with priority.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <div className={`bg-gradient-to-br ${card.color} p-6 flex items-center gap-4`}>
                <div className="bg-white/20 rounded-xl p-3">
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-serif text-xl text-white">{card.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-3 leading-relaxed">{card.description}</p>
                <p className="font-semibold text-techbridge-navy text-sm mb-2">{card.detail}</p>
                <p className="text-xs text-techbridge-blue font-medium uppercase tracking-wide">
                  {card.note}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl text-techbridge-navy mb-3">Government Enquiry Form</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Complete the form below and a member of our government relations team will respond promptly.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-ghana-green/10 border border-ghana-green/30 rounded-2xl p-10 text-center"
            >
              <div className="flex justify-center mb-5">
                <div className="bg-ghana-green rounded-full p-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="font-serif text-2xl text-techbridge-navy mb-4">Enquiry Submitted</h3>
              <p className="text-gray-700 leading-relaxed max-w-md mx-auto">
                Thank you. A member of Techbridge's government relations team will contact you within
                4 business hours.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-techbridge-navy mb-2" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Hon. Kwame Asante"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-techbridge-blue/40 focus:border-techbridge-blue transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-techbridge-navy mb-2" htmlFor="organisation">
                    Organisation / Ministry
                  </label>
                  <input
                    id="organisation"
                    name="organisation"
                    type="text"
                    required
                    value={form.organisation}
                    onChange={handleChange}
                    placeholder="Ministry of Communications"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-techbridge-blue/40 focus:border-techbridge-blue transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-techbridge-navy mb-2" htmlFor="role">
                    Role / Position
                  </label>
                  <input
                    id="role"
                    name="role"
                    type="text"
                    required
                    value={form.role}
                    onChange={handleChange}
                    placeholder="Deputy Minister"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-techbridge-blue/40 focus:border-techbridge-blue transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-techbridge-navy mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="official@ministry.gov.gh"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-techbridge-blue/40 focus:border-techbridge-blue transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-techbridge-navy mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+233 XX XXX XXXX"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-techbridge-blue/40 focus:border-techbridge-blue transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-techbridge-navy mb-2" htmlFor="enquiryType">
                    Nature of Enquiry
                  </label>
                  <select
                    id="enquiryType"
                    name="enquiryType"
                    required
                    value={form.enquiryType}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-techbridge-blue/40 focus:border-techbridge-blue transition bg-white"
                  >
                    <option value="" disabled>Select enquiry type</option>
                    <option value="partnership">Partnership Discussion</option>
                    <option value="demo">Platform Demonstration Request</option>
                    <option value="programme">Programme Design Enquiry</option>
                    <option value="technical">Technical Assessment</option>
                    <option value="media">Media / Press</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-techbridge-navy mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Please describe your enquiry or the nature of your interest in the One Million Coders Programme..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-techbridge-blue/40 focus:border-techbridge-blue transition resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-techbridge-blue hover:bg-techbridge-navy text-white font-semibold py-4 px-8 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-base"
                >
                  Send Enquiry
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-center mb-14"
        >
          <h2 className="font-serif text-4xl text-techbridge-navy mb-3">Why Contact Us</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Three reasons government partners choose to engage with Techbridge directly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <div className="bg-techbridge-blue/10 rounded-xl p-3 w-fit mb-5">
                <reason.icon className="w-6 h-6 text-techbridge-blue" />
              </div>
              <h3 className="font-serif text-xl text-techbridge-navy mb-3">{reason.title}</h3>
              <p className="text-gray-600 leading-relaxed">{reason.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-techbridge-navy py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <h2 className="font-serif text-4xl text-white mb-3">Next Steps After Contact</h2>
            <p className="text-blue-200 max-w-lg mx-auto">
              A clear, simple process from first enquiry to formal partnership proposal.
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-white/10" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {steps.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="text-center"
                >
                  <div className="bg-techbridge-gold text-techbridge-navy font-bold text-lg w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 font-sans relative z-10">
                    {item.step}
                  </div>
                  <p className="text-white text-sm leading-relaxed">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="bg-ghana-red/5 border-2 border-ghana-red/20 rounded-2xl p-10"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-ghana-red rounded-xl p-3 flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-serif text-3xl text-techbridge-navy mb-1">Emergency / Direct Contact</h2>
              <p className="text-gray-600">
                For urgent government matters, contact our Director directly:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div className="flex items-center gap-3 bg-white rounded-xl p-5 shadow-sm">
              <div className="bg-techbridge-blue/10 rounded-lg p-2">
                <Phone className="w-5 h-5 text-techbridge-blue" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Direct Line</p>
                <p className="text-techbridge-navy font-semibold">+233 XX XXX XXXX</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-xl p-5 shadow-sm">
              <div className="bg-techbridge-blue/10 rounded-lg p-2">
                <Mail className="w-5 h-5 text-techbridge-blue" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Director Email</p>
                <p className="text-techbridge-navy font-semibold">director@techbridge.edu.gh</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl text-techbridge-navy mb-3">Proposal Submitted To</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Techbridge has already engaged the relevant government bodies.
              This proposal has been formally presented to:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {ministries.map((ministry, i) => (
              <motion.div
                key={ministry}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="flex items-center gap-4 bg-techbridge-light rounded-xl p-5"
              >
                <div className="bg-ghana-green rounded-full p-2 flex-shrink-0">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <p className="font-semibold text-techbridge-navy text-sm leading-snug">{ministry}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

```

### FILE: src/pages/ExecutiveSummaryPage.tsx
```typescript
import { useEffect } from 'react'
import { CheckCircle, Printer } from 'lucide-react'

/* ─── helpers ─────────────────────────────────────────────────── */
function GhanaStripe() {
  return (
    <div className="flex h-2">
      <div className="flex-1 bg-ghana-red" />
      <div className="flex-1 bg-ghana-gold" />
      <div className="flex-1 bg-ghana-green" />
    </div>
  )
}

function PageFooter({ page, total }: { page: number; total: number }) {
  return (
    <div className="mt-auto pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
      <span>Techbridge Education Services Ghana — Confidential</span>
      <span>One Million Coders Programme Proposal</span>
      <span>Page {page} of {total}</span>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="w-8 h-0.5 bg-ghana-gold" />
      <span className="text-xs font-bold uppercase tracking-widest text-ghana-gold">{children}</span>
    </div>
  )
}

const TOTAL = 8

/* ─── component ──────────────────────────────────────────────── */
export default function ExecutiveSummaryPage() {
  useEffect(() => {
    document.title = 'Techbridge — Executive Summary'
    return () => { document.title = 'Techbridge — Ghana\'s One Million Coders Partner' }
  }, [])

  return (
    <div className="exec-doc font-sans bg-gray-100 min-h-screen py-8 print:bg-white print:p-0 print:py-0">

      {/* ── Print Button (hidden in print) ──────────────────────── */}
      <div className="fixed top-24 right-6 z-50 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-techbridge-navy text-white px-5 py-3 rounded-xl shadow-xl font-semibold text-sm hover:bg-techbridge-blue transition-colors"
        >
          <Printer size={16} /> Download PDF
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PAGE 1 — COVER
      ═══════════════════════════════════════════════════════════ */}
      <div className="exec-page bg-techbridge-navy mx-auto mb-8 print:mb-0 relative overflow-hidden"
        style={{ width: '210mm', minHeight: '297mm', display: 'flex', flexDirection: 'column' }}>

        <GhanaStripe />

        {/* watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, #FCD116 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, #006B3F 0%, transparent 50%)' }} />

        <div className="relative flex flex-col flex-1 p-14">
          {/* Logo block */}
          <div className="mb-16">
            <div className="font-serif text-4xl font-bold text-white tracking-tight mb-1">Techbridge</div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ghana-gold/80">Education Services Ghana</div>
          </div>

          {/* Main title */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="w-16 h-1 bg-ghana-gold mb-8" />
            <p className="text-ghana-gold/80 text-sm font-semibold uppercase tracking-widest mb-4">
              Official Proposal
            </p>
            <h1 className="font-serif text-5xl font-bold text-white leading-tight mb-6">
              One Million Coders<br />
              <span className="text-techbridge-gold">Programme</span>
            </h1>
            <h2 className="text-xl text-blue-200 font-light leading-relaxed max-w-md">
              National Digital Skills Development Initiative —<br />
              Proposal for Programme Delivery Partnership
            </h2>
          </div>

          {/* Submission block */}
          <div className="border-t border-white/20 pt-8 grid grid-cols-2 gap-8">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Submitted to</p>
              <p className="text-white/90 text-sm leading-relaxed">
                Ministry of Communications &amp; Digitalization<br />
                Presidential Special Initiatives Office<br />
                Youth &amp; Employment Agency, Ghana<br />
                Ghana Digital Centre
              </p>
            </div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Submitted by</p>
              <p className="text-white/90 text-sm leading-relaxed">
                Techbridge Education Services Ghana<br />
                Techbridge University College<br />
                Oyibi, Greater Accra, Ghana<br />
                <span className="text-ghana-gold">government@techbridge.edu.gh</span>
              </p>
            </div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Date</p>
              <p className="text-white/90 text-sm">May 2026</p>
            </div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Reference</p>
              <p className="text-white/90 text-sm">TUC-ICT-PROP-2026-001</p>
            </div>
          </div>
        </div>

        {/* Bottom stripe */}
        <GhanaStripe />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PAGE 2 — EXECUTIVE SUMMARY
      ═══════════════════════════════════════════════════════════ */}
      <div className="exec-page bg-white mx-auto mb-8 print:mb-0 p-14 flex flex-col"
        style={{ width: '210mm', minHeight: '297mm' }}>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-ghana-gold" />
          <h2 className="font-serif text-3xl font-bold text-techbridge-navy">Executive Summary</h2>
        </div>

        <SectionLabel>Section 1</SectionLabel>

        <p className="text-gray-700 leading-relaxed mb-5 text-sm">
          Techbridge Education Services Ghana is the only Ghanaian-led, currently operational
          technology education platform with the institutional partnerships, infrastructure, and
          curriculum required to deliver the Government of Ghana's One Million Coders Programme
          at national scale. We are ready to onboard the first cohort within <strong>8 weeks</strong> of
          contract signing.
        </p>
        <p className="text-gray-700 leading-relaxed mb-5 text-sm">
          This proposal presents Techbridge's comprehensive plan to implement the One Million
          Coders Programme across Ghana's 50+ partner institutions — delivering experiential,
          project-based learning in Artificial Intelligence, Cloud Computing, Data Science, and
          Software Development — leading to verifiable Skill Wallet credentials and direct
          placement into Ghana's growing technology sector.
        </p>
        <p className="text-gray-700 leading-relaxed mb-10 text-sm">
          Unlike competing proposals from international vendors, Techbridge operates inside
          Ghana today. Our data remains in Ghana, our staff are Ghanaian, our profits recirculate
          into the Ghanaian economy, and our leadership is directly accountable to Ghanaian
          institutions — not a foreign board of directors.
        </p>

        {/* Key Numbers */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { n: '5+', l: 'Years Operating in Ghana', s: 'Founded 2019' },
            { n: '50+', l: 'Partner Institutions', s: 'Across all regions' },
            { n: '15,000+', l: 'Active Learners', s: 'On platform today' },
            { n: '8 Wks', l: 'To Full Deployment', s: 'From contract signing' },
          ].map(item => (
            <div key={item.l} className="rounded-xl bg-techbridge-light border border-techbridge-blue/10 p-4 text-center">
              <div className="font-serif text-3xl font-bold text-techbridge-navy mb-1">{item.n}</div>
              <div className="text-xs font-semibold text-techbridge-blue mb-0.5 leading-tight">{item.l}</div>
              <div className="text-xs text-gray-400">{item.s}</div>
            </div>
          ))}
        </div>

        {/* Three-point summary */}
        <div className="space-y-3 mb-10">
          {[
            ['Operational Platform', 'techbridge.edu.gh is live, serving 15,000+ students, with 98.5% uptime since 2020. No setup phase required.'],
            ['Ghanaian-Led & Accountable', 'Founded and managed in Ghana. Data sovereignty maintained. Profits reinvested locally. Leadership answerable to Ghanaian law.'],
            ['8-Week Deployment Timeline', 'International vendors require 6–12 months to configure, localise, and staff. Techbridge can scale the first 50,000 learners in 8 weeks.'],
          ].map(([title, body]) => (
            <div key={title} className="flex gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50">
              <CheckCircle size={18} className="text-ghana-green shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-techbridge-navy text-sm">{title} — </span>
                <span className="text-gray-600 text-sm">{body}</span>
              </div>
            </div>
          ))}
        </div>

        <PageFooter page={2} total={TOTAL} />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PAGE 3 — NATIONAL CONTEXT + ABOUT TECHBRIDGE
      ═══════════════════════════════════════════════════════════ */}
      <div className="exec-page bg-white mx-auto mb-8 print:mb-0 p-14 flex flex-col"
        style={{ width: '210mm', minHeight: '297mm' }}>

        <SectionLabel>Sections 2 &amp; 3</SectionLabel>

        <h2 className="font-serif text-2xl font-bold text-techbridge-navy mb-6">
          Background, National Context &amp; About Techbridge
        </h2>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-techbridge-navy mb-3 text-sm uppercase tracking-wide border-b border-ghana-gold pb-2">National Context</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Ghana faces a structural digital skills gap at a pivotal moment. With a youth
              population exceeding 15 million and 46% of young people classified as
              underemployed, the One Million Coders Programme represents the Government's
              highest-impact economic intervention.
            </p>
            <div className="space-y-2">
              {[
                ['15M+', 'Youth population (ages 15–35)'],
                ['46%', 'Youth underemployment rate'],
                ['$4.2B', 'Ghana 2030 digital economy target'],
                ['$800M+', 'Annual foreign tech services spend'],
              ].map(([n, l]) => (
                <div key={l} className="flex gap-2 items-baseline">
                  <span className="font-bold text-techbridge-blue text-base w-16 shrink-0">{n}</span>
                  <span className="text-gray-500 text-xs">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-techbridge-navy mb-3 text-sm uppercase tracking-wide border-b border-ghana-gold pb-2">About Techbridge</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Techbridge Education Services Ghana is a Ghanaian-founded technology education
              company established in 2019. We operate Techbridge University College (TUC) in
              Oyibi, Greater Accra, and a national network of partner institutions.
            </p>
            <div className="space-y-2">
              {[
                'Founded 2019 — Ghanaian-owned and operated',
                'Physical campus at Oyibi, Greater Accra',
                'Accredited by the National Accreditation Board',
                'Technology Education & Workforce Development mandate',
                'Active MoUs with 50+ tertiary institutions nationally',
              ].map(item => (
                <div key={item} className="flex gap-2 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-ghana-green mt-1.5 shrink-0" />
                  <span className="text-gray-600 text-xs leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* National Opportunity */}
        <div className="bg-techbridge-navy rounded-xl p-6 mb-4">
          <h3 className="font-serif text-lg font-bold text-white mb-4">
            The National Opportunity (Section 7)
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              ['Employment Creation', 'Every 100 coders trained creates ~40 indirect jobs in the Ghanaian economy through supply chain and demand effects.'],
              ['Export Revenue', "Ghana's tech services export market could reach $1.2B annually by 2030 with a trained domestic workforce pipeline."],
              ['Import Substitution', 'Ghana currently spends $800M+ on foreign tech services annually. Domestic skills retain this spend inside Ghana.'],
            ].map(([t, b]) => (
              <div key={t} className="border-l-2 border-ghana-gold pl-3">
                <div className="text-ghana-gold font-semibold text-xs mb-1">{t}</div>
                <div className="text-blue-200 text-xs leading-relaxed">{b}</div>
              </div>
            ))}
          </div>
        </div>

        <PageFooter page={3} total={TOTAL} />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PAGE 4 — CREDENTIALS, TRACK RECORD & PARTNERSHIPS
      ═══════════════════════════════════════════════════════════ */}
      <div className="exec-page bg-white mx-auto mb-8 print:mb-0 p-14 flex flex-col"
        style={{ width: '210mm', minHeight: '297mm' }}>

        <SectionLabel>Sections 4 &amp; 5</SectionLabel>

        <h2 className="font-serif text-2xl font-bold text-techbridge-navy mb-6">
          Credentials, Track Record &amp; Technology Partnerships
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { n: '5+', l: 'Years operational', s: 'Since 2019' },
            { n: '15,000+', l: 'Students trained', s: 'Active platform users' },
            { n: '50+', l: 'Partner institutions', s: 'Universities, TVETs, polytechnics' },
            { n: '2,400+', l: 'Internships facilitated', s: 'Industry placements' },
            { n: '98.5%', l: 'Platform uptime', s: 'Since 2020 launch' },
            { n: '8 Regions', l: 'National coverage', s: 'All major regions' },
          ].map(item => (
            <div key={item.l} className="rounded-lg bg-techbridge-light border border-gray-200 p-4">
              <div className="font-serif text-2xl font-bold text-techbridge-navy mb-1">{item.n}</div>
              <div className="text-xs font-semibold text-techbridge-blue leading-tight mb-0.5">{item.l}</div>
              <div className="text-xs text-gray-400">{item.s}</div>
            </div>
          ))}
        </div>

        {/* Tech Partnerships */}
        <div className="mb-8">
          <h3 className="font-semibold text-techbridge-navy mb-3 text-sm uppercase tracking-wide">Global Technology Ecosystem Partnerships</h3>
          <div className="flex flex-wrap gap-2">
            {['Google Cloud', 'GitHub / Microsoft', 'Amazon Web Services', 'MongoDB', 'HubSpot Academy', 'IBM SkillsBuild', 'Cisco NetAcad'].map(p => (
              <span key={p} className="px-3 py-1.5 rounded-full bg-techbridge-navy text-white text-xs font-semibold">{p}</span>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-3 leading-relaxed">
            Students learn and are assessed directly on industry-standard platforms, earning
            globally recognised certifications alongside Techbridge Skill Wallet credentials.
          </p>
        </div>

        {/* Timeline milestones */}
        <div>
          <h3 className="font-semibold text-techbridge-navy mb-4 text-sm uppercase tracking-wide">Key Milestones 2019–2026</h3>
          <div className="relative pl-6 border-l-2 border-techbridge-gold/30 space-y-4">
            {[
              ['2019', 'Techbridge founded in Accra; TUC campus opened; first technology curriculum launched'],
              ['2020', 'techbridge.edu.gh launched; first 1,000 learners enrolled; platform uptime at 98.5%+'],
              ['2022', '10,000 learners milestone; first cohort of 500 internship placements across Ghana'],
              ['2023', 'Google Cloud Campus Partner status awarded; AWS EdStart programme accepted'],
              ['2024', '50+ institutional MoUs signed; ai.techbridge.edu.gh AI platform launched'],
              ['2026', '15,000+ active learners; ready for national One Million Coders scale-up'],
            ].map(([year, event]) => (
              <div key={year} className="flex gap-3 items-start">
                <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-techbridge-gold mt-0.5" style={{ position: 'relative', left: '-1.5rem', flexShrink: 0 }}/>
                <span className="font-bold text-techbridge-blue text-xs w-10 shrink-0">{year}</span>
                <span className="text-gray-600 text-xs leading-relaxed">{event}</span>
              </div>
            ))}
          </div>
        </div>

        <PageFooter page={4} total={TOTAL} />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PAGE 5 — WHY TECHBRIDGE (vs SmartBridge comparison)
      ═══════════════════════════════════════════════════════════ */}
      <div className="exec-page bg-white mx-auto mb-8 print:mb-0 p-14 flex flex-col"
        style={{ width: '210mm', minHeight: '297mm' }}>

        <SectionLabel>Competitive Position</SectionLabel>

        <h2 className="font-serif text-2xl font-bold text-techbridge-navy mb-2">
          Why Techbridge Over Foreign Vendors
        </h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          The Government of Ghana has received proposals from international vendors including
          SmartBridge Education Services Ltd (India). The table below compares the critical
          programme delivery factors.
        </p>

        <div className="rounded-xl overflow-hidden border border-gray-200 mb-8 text-xs">
          <table className="w-full">
            <thead>
              <tr className="bg-techbridge-navy text-white">
                <th className="py-3 px-4 text-left font-semibold">Criteria</th>
                <th className="py-3 px-4 text-center font-semibold text-ghana-gold">Techbridge Ghana</th>
                <th className="py-3 px-4 text-center font-semibold text-red-300">SmartBridge India</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Headquarters', '🇬🇭 Accra, Ghana', '🇮🇳 Hyderabad, India'],
                ['Currently operational in Ghana', '✓ Active today', '✗ Not established'],
                ['Ghanaian learners on platform', '15,000+ verified', 'None — new market'],
                ['Deployment timeline', '8 weeks', '6–12 months (estimate)'],
                ['Time to first learner cohort', '8 weeks', '6+ months'],
                ['Data sovereignty', '✓ Ghana-hosted', '✗ Data leaves Ghana'],
                ['Local accountability', '✓ Ghanaian law', '✗ Indian corporate law'],
                ['Profits reinvested in Ghana', '✓ 100%', '✗ Repatriated to India'],
                ['Established institutional MoUs', '50+ signed', '0 in Ghana'],
                ['Ghana-specific content', '✓ Built in', '✗ Requires localisation'],
                ['Government reporting ready', '✓ Framework in place', '✗ To be configured'],
              ].map(([criteria, us, them], i) => (
                <tr key={criteria} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-2.5 px-4 font-medium text-techbridge-navy">{criteria}</td>
                  <td className="py-2.5 px-4 text-center text-ghana-green font-semibold">{us}</td>
                  <td className="py-2.5 px-4 text-center text-gray-400">{them}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-ghana-green/10 border border-ghana-green/30 rounded-xl p-5">
          <p className="text-techbridge-navy text-sm font-semibold mb-1">
            The Sovereignty Argument
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Every GHS spent on a foreign vendor for this programme leaves Ghana. Data about
            Ghanaian citizens sits on foreign servers under foreign law. A local partner is not
            merely preferable — it is a matter of national data sovereignty and economic
            self-determination.
          </p>
        </div>

        <PageFooter page={5} total={TOTAL} />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PAGE 6 — PROGRAMME ARCHITECTURE & PLATFORM
      ═══════════════════════════════════════════════════════════ */}
      <div className="exec-page bg-white mx-auto mb-8 print:mb-0 p-14 flex flex-col"
        style={{ width: '210mm', minHeight: '297mm' }}>

        <SectionLabel>Sections 6, 8–13</SectionLabel>

        <h2 className="font-serif text-2xl font-bold text-techbridge-navy mb-6">
          Programme Architecture, Platform &amp; Skill Wallet
        </h2>

        {/* 4 Tracks */}
        <div className="mb-8">
          <h3 className="font-semibold text-techbridge-navy mb-3 text-sm uppercase tracking-wide">The 4 Core Technology Tracks</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { track: 'Artificial Intelligence & ML', tools: 'Python · TensorFlow · Hugging Face', colour: 'border-techbridge-blue' },
              { track: 'Cloud Computing', tools: 'Google Cloud · AWS · Azure', colour: 'border-ghana-green' },
              { track: 'Data Science & Analytics', tools: 'SQL · Power BI · Tableau · Python', colour: 'border-ghana-red' },
              { track: 'Software Development & DevOps', tools: 'GitHub · Docker · Kubernetes · CI/CD', colour: 'border-techbridge-gold' },
            ].map(item => (
              <div key={item.track} className={`rounded-lg border-l-4 ${item.colour} bg-techbridge-light p-3`}>
                <div className="font-semibold text-techbridge-navy text-xs mb-1">{item.track}</div>
                <div className="text-gray-400 text-xs">{item.tools}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Lifecycle */}
        <div className="mb-8">
          <h3 className="font-semibold text-techbridge-navy mb-3 text-sm uppercase tracking-wide">Experiential Learning Project Lifecycle (Section 13)</h3>
          <div className="flex items-start gap-0 overflow-hidden rounded-lg border border-gray-200">
            {[
              { n: '01', t: 'Enrolment', c: 'bg-techbridge-gold text-techbridge-navy' },
              { n: '02', t: 'Foundations', c: 'bg-techbridge-blue text-white' },
              { n: '03', t: 'Industry Sprint', c: 'bg-ghana-green text-white' },
              { n: '04', t: 'Assessment', c: 'bg-academic-amber text-white' },
              { n: '05', t: 'Placement', c: 'bg-ghana-red text-white' },
            ].map((phase, i) => (
              <div key={phase.n} className={`flex-1 ${phase.c} py-3 px-2 text-center ${i > 0 ? 'border-l border-white/30' : ''}`}>
                <div className="font-bold text-xs mb-0.5">{phase.n}</div>
                <div className="text-xs font-medium leading-tight">{phase.t}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              ['12–16 weeks', 'Per cohort duration'],
              ['4 intakes/year', 'National cadence'],
              ['Blended delivery', 'Online + on-campus labs'],
            ].map(([v, l]) => (
              <div key={l} className="text-center border border-gray-100 rounded-lg p-3">
                <div className="font-bold text-techbridge-navy text-sm">{v}</div>
                <div className="text-gray-400 text-xs">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform + Skill Wallet */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <h3 className="font-semibold text-techbridge-navy mb-2 text-xs uppercase tracking-wide">Platform Architecture (Section 9–10, 14)</h3>
            <div className="space-y-2">
              {[
                ['techbridge.edu.gh', 'Main LMS — 15,000+ learners, 200+ courses'],
                ['ai-tools.techbridge.edu.gh', 'AI Tools Hub — 30+ productivity tools'],
                ['ai.techbridge.edu.gh', 'Adaptive AI Learning Platform'],
              ].map(([d, l]) => (
                <div key={d} className="p-2 rounded bg-techbridge-light border border-techbridge-blue/10">
                  <div className="font-mono text-xs font-bold text-techbridge-blue">{d}</div>
                  <div className="text-xs text-gray-500">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-techbridge-navy mb-2 text-xs uppercase tracking-wide">Skill Wallet (Section 9)</h3>
            <div className="border border-techbridge-gold/40 rounded-lg overflow-hidden">
              <div className="bg-techbridge-navy px-4 py-3">
                <div className="text-ghana-gold text-xs font-bold uppercase tracking-widest mb-1">Techbridge Skill Wallet</div>
                <div className="text-white text-sm font-semibold">Ama Korantema</div>
                <div className="text-white/50 text-xs">AI Track · Cohort 2025</div>
              </div>
              <div className="bg-white px-4 py-3 space-y-1.5">
                {['Blockchain-verified credentials', 'NQF-aligned certification', 'Employer-facing skills profile', 'AI internship matching'].map(f => (
                  <div key={f} className="flex gap-2 items-center">
                    <CheckCircle size={12} className="text-ghana-green shrink-0" />
                    <span className="text-xs text-gray-600">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <PageFooter page={6} total={TOTAL} />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PAGE 7 — IMPLEMENTATION ROADMAP
      ═══════════════════════════════════════════════════════════ */}
      <div className="exec-page bg-white mx-auto mb-8 print:mb-0 p-14 flex flex-col"
        style={{ width: '210mm', minHeight: '297mm' }}>

        <SectionLabel>Section 16</SectionLabel>

        <h2 className="font-serif text-2xl font-bold text-techbridge-navy mb-6">
          Implementation Roadmap — 8 Weeks to First Cohort
        </h2>

        <div className="space-y-3 mb-8">
          {[
            { weeks: 'Week 1–2', phase: 'Contract & Governance', tasks: ['Partnership agreement signed', 'National Programme Director appointed', 'Steering committee established with MoCD, GYEEDA, Ghana Digital Centre'] },
            { weeks: 'Week 3–4', phase: 'Platform Configuration', tasks: ['Government branding applied to platform', 'Cohort intake 1 registration portal opened', 'LMS configured for 50,000-learner capacity'] },
            { weeks: 'Week 5–6', phase: 'Educator Onboarding', tasks: ['Facilitators trained at 30 institutions', 'Track-specific mentors confirmed from industry partners', 'Assessment framework submitted to accreditation board'] },
            { weeks: 'Week 7–8', phase: 'Launch & Enrolment', tasks: ['National launch event with government stakeholders', 'First 50,000 learners enrolled and active', 'Reporting dashboard live for Ministry access'] },
          ].map((row, i) => (
            <div key={row.weeks} className="flex gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50">
              <div className="shrink-0 w-20 text-center">
                <div className="inline-block bg-techbridge-navy text-white text-xs font-bold px-3 py-1 rounded-full">{row.weeks}</div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-techbridge-navy text-sm mb-1.5">Phase {i + 1}: {row.phase}</div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {row.tasks.map(t => (
                    <div key={t} className="flex gap-1.5 items-start">
                      <CheckCircle size={11} className="text-ghana-green shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-xs">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scale timeline */}
        <div>
          <h3 className="font-semibold text-techbridge-navy mb-3 text-sm uppercase tracking-wide">Scale-Up to One Million Coders</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { year: 'Year 1', n: '50,000', sub: '30 institutions' },
              { year: 'Year 2', n: '150,000', sub: '50 institutions' },
              { year: 'Year 3', n: '300,000', sub: 'All accredited' },
              { year: 'Year 5', n: '1,000,000', sub: 'National milestone' },
            ].map((item, i) => (
              <div key={item.year} className={`rounded-xl p-4 text-center border-2 ${
                i === 3 ? 'border-ghana-gold bg-ghana-gold/10' : 'border-techbridge-blue/30 bg-techbridge-light'
              }`}>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{item.year}</div>
                <div className="font-serif text-2xl font-bold text-techbridge-navy">{item.n}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <PageFooter page={7} total={TOTAL} />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PAGE 8 — GOVERNANCE, SUSTAINABILITY & NEXT STEPS
      ═══════════════════════════════════════════════════════════ */}
      <div className="exec-page bg-white mx-auto mb-8 print:mb-0 p-14 flex flex-col"
        style={{ width: '210mm', minHeight: '297mm' }}>

        <SectionLabel>Sections 17–20</SectionLabel>

        <h2 className="font-serif text-2xl font-bold text-techbridge-navy mb-6">
          Governance, Sustainability &amp; Next Steps
        </h2>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-techbridge-navy mb-3 text-xs uppercase tracking-wide border-b border-ghana-gold pb-2">Governance Framework (Section 17)</h3>
            <div className="space-y-2">
              {[
                ['National Programme Director', 'Techbridge senior appointment'],
                ['Government Liaison Officer', 'Joint Techbridge / MoCD appointment'],
                ['Regional Coordinators ×8', 'One per region, local hires'],
                ['Institutional Liaison Network', 'Representative at each partner university'],
                ['Independent Assessment Board', 'External assessors, NQF-aligned'],
                ['Ministerial Steering Committee', 'Quarterly oversight with MoCD'],
              ].map(([role, note]) => (
                <div key={role} className="flex gap-2 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-techbridge-gold mt-1.5 shrink-0" />
                  <div>
                    <span className="text-techbridge-navy text-xs font-semibold">{role}</span>
                    <span className="text-gray-400 text-xs"> — {note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-techbridge-navy mb-3 text-xs uppercase tracking-wide border-b border-ghana-gold pb-2">Sustainability (Section 18)</h3>
            <div className="space-y-3">
              {[
                { phase: 'Years 1–2', model: 'Government grant-funded; co-funded by employer partners via certification licensing fees' },
                { phase: 'Years 3–4', model: 'Self-sustaining through Skill Wallet credential revenue and corporate recruitment partnerships' },
                { phase: 'Year 5+', model: 'Fully commercially viable; government retains dashboard access and KPI reporting at zero additional cost' },
              ].map(item => (
                <div key={item.phase} className="border-l-2 border-techbridge-blue/30 pl-3">
                  <div className="font-semibold text-techbridge-blue text-xs mb-0.5">{item.phase}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{item.model}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-techbridge-navy rounded-xl p-6 mb-6">
          <h3 className="font-serif text-lg font-bold text-white mb-4">Next Steps — Three Asks from Government (Section 20)</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { n: '01', ask: 'Schedule Ministerial Briefing', detail: 'A 60-minute formal presentation for the Ministry of Communications & Digitalization and Presidential Special Initiatives' },
              { n: '02', ask: 'Issue Letter of Intent', detail: 'A non-binding Letter of Intent to partner allows Techbridge to begin institutional pre-enrolment with 30 universities' },
              { n: '03', ask: 'Commence Contract Negotiation', detail: 'Formal partnership agreement with defined KPIs, reporting structure, and 8-week deployment commencement date' },
            ].map(item => (
              <div key={item.n} className="border border-white/20 rounded-lg p-4">
                <div className="w-7 h-7 rounded-full bg-ghana-gold flex items-center justify-center text-techbridge-navy font-bold text-xs mb-2">{item.n}</div>
                <div className="text-ghana-gold font-semibold text-xs mb-1">{item.ask}</div>
                <div className="text-blue-200 text-xs leading-relaxed">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="border border-gray-200 rounded-xl p-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-semibold text-techbridge-navy mb-1">Government Partnerships Team</div>
            <div className="text-gray-500 text-xs leading-relaxed">
              Techbridge Education Services Ghana<br />
              Techbridge University College, Oyibi, Greater Accra
            </div>
          </div>
          <div className="text-xs text-gray-500 leading-relaxed">
            <div><strong className="text-techbridge-navy">Email:</strong> government@techbridge.edu.gh</div>
            <div><strong className="text-techbridge-navy">Platform:</strong> techbridge.edu.gh</div>
            <div><strong className="text-techbridge-navy">Reference:</strong> TUC-ICT-PROP-2026-001</div>
          </div>
        </div>

        <PageFooter page={8} total={TOTAL} />
      </div>

    </div>
  )
}

```

### FILE: src/pages/HomePage.tsx
```typescript
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Users, Building2, Clock, TrendingUp } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
};

const floatCard = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="font-sans">
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-techbridge-navy">
        <div className="absolute top-0 left-0 right-0 flex h-2 z-10">
          <div className="flex-1 bg-ghana-red" />
          <div className="flex-1 bg-ghana-gold" />
          <div className="flex-1 bg-ghana-green" />
        </div>

        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(ellipse at 70% 40%, #1a4b8c 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, #006B3F 0%, transparent 50%)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="max-w-4xl"
          >
            <motion.p
              variants={fadeUp}
              className="text-techbridge-gold font-semibold uppercase tracking-widest text-sm mb-6"
            >
              Techbridge Education Services Ghana
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="font-serif text-5xl lg:text-7xl font-bold text-white leading-tight mb-8"
            >
              Ghana's Digital Skills Partner —{' '}
              <span className="text-techbridge-gold">Ready Now.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-xl lg:text-2xl text-slate-300 leading-relaxed mb-4 max-w-3xl"
            >
              The One Million Coders Programme deserves a partner already operating at scale in Ghana.
              Techbridge is Ghanaian-led, locally accountable, and ready to deploy within 8 weeks.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-base text-slate-400 mb-12 max-w-2xl"
            >
              Submitted to the Ministry of Communications &amp; Digitalization, Presidential Special
              Initiatives, Youth &amp; Employment Agency, and Ghana Digital Centre.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-20">
              <Link
                to="/platform"
                className="inline-flex items-center gap-2 bg-techbridge-gold text-techbridge-navy font-bold px-8 py-4 rounded-lg hover:bg-yellow-300 transition-colors duration-200 text-base"
              >
                See the Platform
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white hover:text-techbridge-navy transition-colors duration-200 text-base"
              >
                Government Partnership
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl"
          >
            {[
              { label: '8 Weeks to Deploy', icon: Clock, accent: 'text-techbridge-gold' },
              { label: '15,000+ Students Trained', icon: Users, accent: 'text-ghana-green' },
              { label: '50+ Institutions', icon: Building2, accent: 'text-techbridge-blue' },
            ].map(({ label, icon: Icon, accent }) => (
              <motion.div
                key={label}
                variants={floatCard}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 flex items-center gap-4"
              >
                <Icon className={`w-8 h-8 flex-shrink-0 ${accent}`} />
                <span className="text-white font-semibold text-sm lg:text-base">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-techbridge-green py-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white font-semibold text-base lg:text-lg text-center sm:text-left">
            The One Million Coders Programme selection window is open.{' '}
            <span className="text-techbridge-gold">Techbridge is operational today.</span>
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-techbridge-gold text-techbridge-navy font-bold px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
          >
            Engage Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-techbridge-navy mb-4">
              Why Techbridge Over Foreign Vendors
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              International vendors bring global scale but no local accountability. Techbridge brings
              both — built for Ghana, by Ghanaians.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Local Accountability',
                body: 'Ghanaian-founded and operated. Profits stay in Ghana. Our leadership team is answerable to Ghanaian institutions, ministries, and the communities we serve — not a foreign board.',
                icon: Building2,
                border: 'border-ghana-green',
                iconColor: 'text-ghana-green',
              },
              {
                title: 'Platform Ready Now',
                body: 'techbridge.edu.gh already serves 8,000+ concurrent users. Infrastructure, content, and support teams are operational today — no setup delay, no pilot phase required.',
                icon: TrendingUp,
                border: 'border-techbridge-blue',
                iconColor: 'text-techbridge-blue',
              },
              {
                title: '8-Week Deployment',
                body: 'International vendors typically require 6+ months to configure, localise, and staff. Techbridge can onboard the first cohort of One Million Coders within 8 weeks of contract signing.',
                icon: Clock,
                border: 'border-ghana-gold',
                iconColor: 'text-academic-amber',
              },
            ].map(({ title, body, icon: Icon, border, iconColor }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className={`bg-techbridge-light rounded-2xl p-8 border-t-4 ${border}`}
              >
                <Icon className={`w-10 h-10 mb-5 ${iconColor}`} />
                <h3 className="font-serif text-2xl font-bold text-techbridge-navy mb-3">{title}</h3>
                <p className="text-slate-600 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-techbridge-navy py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-4">
              Credentials at a Glance
            </h2>
            <p className="text-slate-400 text-lg">
              Proven impact across Ghana's education and employment ecosystem.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { stat: '5+', label: 'Years in Ghana', sub: 'Established 2019' },
              { stat: '50+', label: 'Partner Institutions', sub: 'Universities, polytechnics, TVETs' },
              { stat: '15,000+', label: 'Students Trained', sub: 'Active platform users' },
              { stat: '2,400+', label: 'Internships Facilitated', sub: 'Industry placements' },
            ].map(({ stat, label, sub }) => (
              <motion.div
                key={label}
                variants={floatCard}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-white/10 border border-white/20 rounded-2xl p-8 text-center"
              >
                <p className="font-serif text-5xl font-bold text-techbridge-gold mb-2">{stat}</p>
                <p className="text-white font-semibold text-lg mb-1">{label}</p>
                <p className="text-slate-400 text-sm">{sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-techbridge-navy mb-4">
              Visit Our Campus
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              See the facilities and infrastructure that power Techbridge's learning ecosystem.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-2xl bg-black"
          >
            <video
              src="https://techbridge.edu.gh/static/campus_tour.mp4"
              controls
              className="w-full h-auto"
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%230f2545' width='1920' height='1080'/%3E%3C/svg%3E"
            />
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-techbridge-navy mb-4">
              Programme Alignment
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Techbridge's mandate maps directly to the priorities of Ghana's national digital
              transformation agenda.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                programme: 'One Million Coders Programme',
                points: [
                  'Scalable curriculum for 1M+ learners',
                  'Regional delivery centres across Ghana',
                  'Industry-validated credentials',
                  'Employer linkage and placement pipeline',
                ],
              },
              {
                programme: 'Ghana Digital Transformation Agenda',
                points: [
                  'Local digital infrastructure investment',
                  'Ghanaian talent pipeline for tech sector',
                  'Data residency and sovereignty compliant',
                  'Integration with Ghana.gov digital systems',
                ],
              },
              {
                programme: 'Ministry of Communications & Digitalization',
                points: [
                  'Alignment with National ICT Policy 2025',
                  'Support for Digital Skills for All initiative',
                  'Rural and peri-urban access programmes',
                  'Reporting and compliance frameworks ready',
                ],
              },
            ].map(({ programme, points }) => (
              <motion.div
                key={programme}
                variants={fadeUp}
                className="bg-techbridge-light rounded-2xl p-8"
              >
                <h3 className="font-serif text-xl font-bold text-techbridge-navy mb-6 leading-snug">
                  {programme}
                </h3>
                <ul className="space-y-3">
                  {points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-ghana-green flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-techbridge-green py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto leading-tight">
              Techbridge is ready to deliver in 8 weeks.
            </h2>
            <p className="text-green-200 text-xl mb-12 max-w-2xl mx-auto">
              Let's build Ghana's digital workforce together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/why-techbridge"
                className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white hover:text-techbridge-green transition-colors duration-200 text-base"
              >
                Why Techbridge
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-techbridge-gold text-techbridge-navy font-bold px-8 py-4 rounded-lg hover:bg-yellow-300 transition-colors duration-200 text-base"
              >
                Start Partnership Conversation
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

```

### FILE: src/pages/ImpactPage.tsx
```typescript
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, Building2, Briefcase, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
}

const studentGrowthData = [
  { year: '2020', students: 420 },
  { year: '2021', students: 1850 },
  { year: '2022', students: 4200 },
  { year: '2023', students: 8900 },
  { year: '2024', students: 12400 },
  { year: '2025', students: 15247 },
]

const regionData = [
  { region: 'Greater Accra', students: 4800 },
  { region: 'Ashanti', students: 3200 },
  { region: 'Western', students: 1900 },
  { region: 'Eastern', students: 1600 },
  { region: 'Northern', students: 1200 },
  { region: 'Central', students: 1100 },
  { region: 'Volta', students: 900 },
  { region: 'Other', students: 547 },
]

const programmeData = [
  { name: 'Software Dev', value: 4800 },
  { name: 'AI & ML', value: 3600 },
  { name: 'Cloud Computing', value: 3200 },
  { name: 'Data Science', value: 2400 },
  { name: 'Digital Marketing', value: 1247 },
]

const programmeColors = ['#006B3F', '#1a4b8c', '#FCD116', '#CE1126', '#f59e0b']

const salaryData = [
  { range: 'Same salary', pct: 16 },
  { range: '1-1.5x growth', pct: 17 },
  { range: '1.5-2x growth', pct: 31 },
  { range: '2-3x growth', pct: 25 },
  { range: '3x+ growth', pct: 11 },
]

const radarData = [
  { metric: 'Uptime', techbridge: 98.5, benchmark: 95 },
  { metric: 'Student Satisfaction', techbridge: 91, benchmark: 82 },
  { metric: 'Course Completion', techbridge: 78, benchmark: 65 },
  { metric: 'Employment Rate', techbridge: 84, benchmark: 71 },
  { metric: 'Employer Satisfaction', techbridge: 89, benchmark: 75 },
  { metric: 'Time to Deploy', techbridge: 95, benchmark: 40 },
]

const projectionData = [
  { year: 'Year 1', enrolled: 50000, graduated: 35000, employed: 29400 },
  { year: 'Year 2', enrolled: 150000, graduated: 112500, employed: 94500 },
  { year: 'Year 3', enrolled: 300000, graduated: 234000, employed: 196560 },
  { year: 'Year 5', enrolled: 1000000, graduated: 800000, employed: 672000 },
]

const kpis = [
  {
    label: 'Students Trained',
    value: '15,247',
    icon: Users,
    color: 'bg-techbridge-green',
  },
  {
    label: 'Institutions Served',
    value: '53',
    icon: Building2,
    color: 'bg-techbridge-blue',
  },
  {
    label: 'Internships Placed',
    value: '2,418',
    icon: Briefcase,
    color: 'bg-ghana-red',
  },
  {
    label: 'Employment Rate',
    value: '84%',
    icon: TrendingUp,
    color: 'bg-academic-navy',
  },
]

function SectionCard({ title, children, index }: { title: string; children: React.ReactNode; index: number }) {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md p-6 md:p-8"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      custom={index}
    >
      <h2 className="font-serif text-2xl md:text-3xl text-techbridge-navy mb-6">{title}</h2>
      {children}
    </motion.div>
  )
}

export default function ImpactPage() {
  return (
    <div className="min-h-screen bg-techbridge-light font-sans">
      <section className="relative bg-techbridge-navy overflow-hidden">
        <div className="absolute inset-x-0 top-0 flex h-2">
          <div className="flex-1 bg-ghana-red" />
          <div className="flex-1 bg-ghana-gold" />
          <div className="flex-1 bg-ghana-green" />
        </div>
        <div className="max-w-6xl mx-auto px-6 py-28 pt-10 text-center">
          <motion.h1
            className="font-serif text-5xl md:text-6xl text-white mb-4 pt-8"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Impact Dashboard
          </motion.h1>
          <motion.p
            className="text-techbridge-light text-lg md:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Measurable outcomes from 5 years of delivering digital skills across Ghana.
          </motion.p>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex h-2">
          <div className="flex-1 bg-ghana-green" />
          <div className="flex-1 bg-ghana-gold" />
          <div className="flex-1 bg-ghana-red" />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
            >
              <div className={`${kpi.color} text-white rounded-xl p-3 shrink-0`}>
                <kpi.icon size={28} />
              </div>
              <div>
                <p className="text-3xl font-bold text-techbridge-navy">{kpi.value}</p>
                <p className="text-sm text-gray-500 mt-1">{kpi.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <SectionCard title="Student Enrolment Growth 2020–2025" index={0}>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={studentGrowthData} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }} />
              <YAxis tick={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }} tickFormatter={(v) => v.toLocaleString()} />
              <Tooltip formatter={(v) => (typeof v === 'number' ? v.toLocaleString() : '')} />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#006B3F"
                strokeWidth={3}
                dot={{ r: 5, fill: '#006B3F' }}
                activeDot={{ r: 7 }}
                name="Students"
              />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Students by Region" index={1}>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={regionData} margin={{ top: 8, right: 24, left: 0, bottom: 48 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="region"
                tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }} tickFormatter={(v) => v.toLocaleString()} />
              <Tooltip formatter={(v) => (typeof v === 'number' ? v.toLocaleString() : '')} />
              <Bar dataKey="students" fill="#1a4b8c" radius={[4, 4, 0, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <SectionCard title="Enrolment by Programme Track" index={2}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={programmeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={true}
                >
                  {programmeData.map((_, i) => (
                    <Cell key={i} fill={programmeColors[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => (typeof v === 'number' ? v.toLocaleString() : '')} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              {programmeData.map((entry, i) => (
                <span key={entry.name} className="flex items-center gap-1.5 text-sm text-gray-600">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: programmeColors[i] }} />
                  {entry.name}
                </span>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Salary Growth for Techbridge Graduates (18 months post-completion)" index={3}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salaryData} layout="vertical" margin={{ top: 8, right: 32, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }} unit="%" domain={[0, 40]} />
                <YAxis dataKey="range" type="category" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }} width={120} />
                <Tooltip formatter={(v) => (typeof v === 'number' ? `${v}%` : '')} />
                <Bar dataKey="pct" fill="#006B3F" radius={[0, 4, 4, 0]} name="Graduates %" />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>

        <SectionCard title="Techbridge vs Industry Benchmark" index={4}>
          <p className="text-sm text-gray-500 mb-4">
            Scores are normalised to 100. For Time to Deploy, Techbridge achieves deployment in 8 weeks vs the industry average of 6 months — reflected as a higher score.
          </p>
          <ResponsiveContainer width="100%" height={360}>
            <RadarChart data={radarData} margin={{ top: 16, right: 32, left: 32, bottom: 16 }}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }} />
              <Radar name="Techbridge" dataKey="techbridge" stroke="#006B3F" fill="#006B3F" fillOpacity={0.25} />
              <Radar name="Industry Benchmark" dataKey="benchmark" stroke="#CE1126" fill="#CE1126" fillOpacity={0.15} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </SectionCard>

        <motion.div
          className="bg-white rounded-2xl shadow-md p-8 md:p-10"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          custom={5}
        >
          <h2 className="font-serif text-2xl md:text-3xl text-techbridge-navy mb-4">ROI for Government</h2>
          <div className="border-l-4 border-ghana-gold pl-6 mb-8">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Every <span className="font-bold text-techbridge-navy">GHS 1</span> invested in Techbridge's programme returns{' '}
              <span className="font-bold text-techbridge-green text-2xl">GHS 4.20</span> in economic value through employment outcomes, reduced skills gap, and local tech sector growth.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Average Salary Uplift', value: 'GHS 2,800/mo', sub: 'vs GHS 1,100 pre-programme' },
              { label: 'Jobs Created', value: '12,806', sub: 'Direct tech employment' },
              { label: 'Est. Tax Revenue Generated', value: 'GHS 47.2M', sub: 'Cumulative 2020–2025' },
            ].map((stat) => (
              <div key={stat.label} className="bg-techbridge-light rounded-xl p-5 text-center">
                <p className="text-2xl font-bold text-techbridge-navy">{stat.value}</p>
                <p className="text-sm font-medium text-gray-700 mt-1">{stat.label}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <SectionCard title="Projected Programme Impact — One Million Coders" index={6}>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={projectionData} margin={{ top: 8, right: 24, left: 16, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }} />
              <YAxis tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }} tickFormatter={(v) => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)} />
              <Tooltip formatter={(v) => (typeof v === 'number' ? v.toLocaleString() : '')} />
              <Legend />
              <Bar dataKey="enrolled" name="Enrolled" stackId="a" fill="#1a4b8c" radius={[0, 0, 0, 0]} />
              <Bar dataKey="graduated" name="Graduated" stackId="b" fill="#006B3F" />
              <Bar dataKey="employed" name="Employed" stackId="c" fill="#FCD116" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-3">
            Projections based on current completion (70%) and employment rates (84%). Bars are independent for comparison — not stacked segments.
          </p>
        </SectionCard>

        <motion.div
          className="rounded-2xl overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={7}
        >
          <div className="flex h-2">
            <div className="flex-1 bg-ghana-red" />
            <div className="flex-1 bg-ghana-gold" />
            <div className="flex-1 bg-ghana-green" />
          </div>
          <div className="bg-techbridge-navy px-8 py-14 text-center">
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
              These numbers represent real Ghanaians whose lives were changed.
            </h2>
            <p className="text-techbridge-gold text-xl md:text-2xl font-serif mb-10">
              Imagine One Million.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-ghana-gold text-techbridge-navy font-bold text-lg px-10 py-4 rounded-full hover:bg-yellow-300 transition-colors duration-200"
            >
              Partner With Us
            </Link>
          </div>
          <div className="flex h-2">
            <div className="flex-1 bg-ghana-green" />
            <div className="flex-1 bg-ghana-gold" />
            <div className="flex-1 bg-ghana-red" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

```

### FILE: src/pages/ImplementationPage.tsx
```typescript
import { motion, type Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart2,
  Users,
  Shield,
  TrendingUp,
  Zap,
  Monitor,
  FileText,
  PhoneCall,
  DollarSign,
  UserCheck,
  MapPin,
  Briefcase,
  Headphones,
  Server,
  Activity,
  Star,
} from 'lucide-react'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: 'easeOut' as const },
  }),
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' as const },
  }),
}

const phases = [
  {
    weeks: 'Weeks 1–2',
    label: 'Assessment & Alignment',
    color: 'bg-techbridge-blue',
    border: 'border-techbridge-blue',
    text: 'text-techbridge-blue',
    items: [
      'Government kickoff meeting',
      'Institutional onboarding audit (identify first 30 universities)',
      'Programme customisation workshop',
      'Platform configuration for Ghana national branding',
    ],
  },
  {
    weeks: 'Weeks 3–4',
    label: 'Onboarding & Training',
    color: 'bg-ghana-green',
    border: 'border-ghana-green',
    text: 'text-ghana-green',
    items: [
      'University administrator training (2 days per institution)',
      'Lecturer/educator orientation on platform tools',
      'Student registration portal activation',
      'First cohort enrollment begins',
    ],
  },
  {
    weeks: 'Weeks 5–6',
    label: 'Launch & Activation',
    color: 'bg-ghana-gold',
    border: 'border-ghana-gold',
    text: 'text-yellow-600',
    items: [
      'First courses go live across all enrolled institutions',
      'Real-time monitoring dashboard activated for government oversight',
      'Industry partner integration (internship pipeline opens)',
      'First student cohorts begin programme tracks',
    ],
  },
  {
    weeks: 'Weeks 7–8',
    label: 'Monitor & Scale',
    color: 'bg-ghana-red',
    border: 'border-ghana-red',
    text: 'text-ghana-red',
    items: [
      'Full programme running at initial institutions',
      'Performance data flowing to government dashboard',
      'Expansion plan for additional institutions confirmed',
      'First progress report to Ministry',
    ],
  },
]

const techbridgeTimeline = [
  { label: 'Week 1', detail: 'Kickoff & Assessment' },
  { label: 'Week 2', detail: 'Institutional Audit' },
  { label: 'Week 3', detail: 'Admin Training Begins' },
  { label: 'Week 4', detail: 'Enrollment Opens' },
  { label: 'Week 5', detail: 'Courses Go Live' },
  { label: 'Week 6', detail: 'Dashboard Active' },
  { label: 'Week 7', detail: 'Full Programme Running' },
  { label: 'Week 8', detail: 'Operational' },
]

const smartbridgeTimeline = [
  { label: 'Month 1–2', detail: 'Needs Ghana-specific setup' },
  { label: 'Month 3–4', detail: 'Platform build phase' },
  { label: 'Month 5–6', detail: 'Internal testing' },
  { label: 'Month 7+', detail: 'Maybe operational?' },
]

const governanceItems = [
  {
    icon: Monitor,
    title: 'Real-Time Dashboard Access',
    body: 'Ministry officials receive live access to programme dashboards showing enrollment numbers, course completions, and learner progress at any time.',
  },
  {
    icon: FileText,
    title: 'Monthly Impact Reports',
    body: 'Structured monthly reports covering students enrolled, course completion rates, and verified employment outcomes delivered directly to the Ministry.',
  },
  {
    icon: Users,
    title: 'Quarterly In-Person Reviews',
    body: 'Senior Techbridge leadership meets with government counterparts every quarter to review performance, address concerns, and plan the next phase.',
  },
  {
    icon: PhoneCall,
    title: 'Direct Ghana-Based Management',
    body: 'A dedicated government relations manager based in Accra provides a single point of contact for all enquiries and escalations.',
  },
  {
    icon: DollarSign,
    title: 'Transparent Financial Reporting',
    body: 'Full financial disclosure on all programme spending, with all expenditure denominated and processed in Ghana cedis within the Ghanaian banking system.',
  },
  {
    icon: Zap,
    title: '24-Hour Escalation SLA',
    body: 'Any issue escalated by the Ministry receives a formal response and resolution plan within 24 hours, with direct access to executive leadership.',
  },
]

const sustainabilityPhases = [
  {
    phase: 'Phase 1',
    years: 'Year 1–2',
    title: 'National Platform Deployment',
    students: '200,000 students',
    color: 'bg-techbridge-blue',
    border: 'border-techbridge-blue',
    details: [
      'Full platform deployed at 30+ universities',
      'Core curriculum tracks live and running',
      'Government oversight systems operational',
      '200,000 students enrolled across Ghana',
    ],
  },
  {
    phase: 'Phase 2',
    years: 'Year 3–4',
    title: 'Full Ecosystem Maturity',
    students: '600,000 students',
    color: 'bg-ghana-green',
    border: 'border-ghana-green',
    details: [
      'Employer integration fully operational',
      'Internship-to-employment pipeline active',
      'Expanded to all 16 regions of Ghana',
      '600,000 students enrolled and progressing',
    ],
  },
  {
    phase: 'Phase 3',
    years: 'Year 5+',
    title: 'One Million Coders Milestone',
    students: '1,000,000+ students',
    color: 'bg-ghana-red',
    border: 'border-ghana-red',
    details: [
      'One Million Coders target achieved',
      'Ghana recognised as West Africa\'s digital hub',
      'Regional export of the programme model',
      'Self-sustaining alumni network operational',
    ],
  },
]

const managementRoles = [
  {
    icon: UserCheck,
    role: 'National Programme Director',
    detail: 'Ghana-based executive with full accountability for programme delivery and government relationship management.',
  },
  {
    icon: MapPin,
    role: 'Regional Coordinators',
    detail: 'One coordinator per region, locally hired, responsible for university engagement and on-the-ground support.',
  },
  {
    icon: Briefcase,
    role: 'University Liaison Officers',
    detail: 'Dedicated officers embedded within partner universities to manage day-to-day operations and student support.',
  },
  {
    icon: Headphones,
    role: 'Technical Support Team',
    detail: 'Accra HQ-based team providing platform support, troubleshooting, and infrastructure management around the clock.',
  },
  {
    icon: PhoneCall,
    role: 'Government Relations Manager',
    detail: 'Single point of contact for all Ministry communications, reporting, and escalation protocols.',
  },
  {
    icon: Users,
    role: 'Industry Partnership Manager',
    detail: 'Manages relationships with employers, coordinates internship pipelines, and validates curriculum alignment with industry needs.',
  },
]

const riskCards = [
  {
    icon: Server,
    title: 'Platform Downtime Risk',
    risk: 'Service disruptions affecting student access and programme continuity.',
    mitigation: '98.5% uptime record across all platform operations. Redundant infrastructure with automatic failover ensures continuity even during peak enrollment periods.',
    color: 'border-techbridge-blue',
    iconBg: 'bg-techbridge-blue/10',
    iconColor: 'text-techbridge-blue',
  },
  {
    icon: Activity,
    title: 'Student Dropout Risk',
    risk: 'Learners disengaging before completing programme tracks.',
    mitigation: 'Early-warning analytics system identifies at-risk students within 72 hours of disengagement. Dedicated intervention coordinators follow up with personalised support.',
    color: 'border-ghana-green',
    iconBg: 'bg-ghana-green/10',
    iconColor: 'text-ghana-green',
  },
  {
    icon: Star,
    title: 'Quality Risk',
    risk: 'Curriculum or delivery falling below required standards.',
    mitigation: 'Continuous assessment at every module, peer review processes embedded in course design, and quarterly industry validation panels ensure standards remain high.',
    color: 'border-ghana-gold',
    iconBg: 'bg-ghana-gold/10',
    iconColor: 'text-yellow-600',
  },
  {
    icon: TrendingUp,
    title: 'Scale Risk',
    risk: 'Platform or operational capacity unable to meet programme growth.',
    mitigation: 'Already proven at 8,000+ concurrent users with zero degradation. Infrastructure is horizontally scalable to handle full One Million Coders load.',
    color: 'border-ghana-red',
    iconBg: 'bg-ghana-red/10',
    iconColor: 'text-ghana-red',
  },
]

export default function ImplementationPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      <section className="relative bg-techbridge-navy overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-2 flex">
            <div className="flex-1 bg-ghana-red" />
            <div className="flex-1 bg-ghana-gold" />
            <div className="flex-1 bg-ghana-green" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-techbridge-navy via-techbridge-blue/30 to-techbridge-navy opacity-90" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-techbridge-gold font-semibold tracking-widest uppercase text-sm mb-4"
          >
            One Million Coders Programme — Implementation Plan
          </motion.p>
          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="font-serif text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
          >
            From Agreement to Action — in 8 Weeks.
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="text-lg md:text-xl text-techbridge-light/80 max-w-2xl mx-auto leading-relaxed"
          >
            While others spend months planning, Techbridge is already operational. Here's exactly how we deliver.
          </motion.p>
          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="mt-10 inline-flex items-center gap-3 bg-techbridge-gold/10 border border-techbridge-gold/40 rounded-full px-6 py-3"
          >
            <Clock className="w-5 h-5 text-techbridge-gold" />
            <span className="text-techbridge-gold font-semibold text-sm tracking-wide">8 weeks vs 6+ months — the difference that matters</span>
          </motion.div>
        </div>
      </section>

      <section className="bg-techbridge-light py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-4xl font-bold text-techbridge-navy text-center mb-4"
          >
            The 8-Week Deployment Roadmap
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-academic-slate mb-16 max-w-xl mx-auto"
          >
            Four structured phases, each building on the last, from government agreement to full programme operation.
          </motion.p>

          <div className="hidden md:flex items-stretch gap-0 relative mb-6">
            <div className="absolute top-8 left-0 right-0 h-1 bg-slate-200 z-0" />
            {phases.map((phase, i) => (
              <motion.div
                key={phase.weeks}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={scaleIn}
                className="flex-1 relative z-10 px-3"
              >
                <div className={`w-6 h-6 rounded-full ${phase.color} mx-auto mb-4 ring-4 ring-white shadow-md`} />
                <div className={`bg-white rounded-2xl border-t-4 ${phase.border} shadow-lg p-6 h-full`}>
                  <p className={`text-xs font-bold uppercase tracking-widest ${phase.text} mb-1`}>{phase.weeks}</p>
                  <h3 className="font-serif text-lg font-bold text-techbridge-navy mb-4 leading-snug">{phase.label}</h3>
                  <ul className="space-y-3">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-ghana-green flex-shrink-0 mt-0.5" />
                        <span className="text-academic-slate text-sm leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="md:hidden flex flex-col gap-6">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.weeks}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className={`bg-white rounded-2xl border-l-4 ${phase.border} shadow-lg p-6`}
              >
                <p className={`text-xs font-bold uppercase tracking-widest ${phase.text} mb-1`}>{phase.weeks}</p>
                <h3 className="font-serif text-xl font-bold text-techbridge-navy mb-4">{phase.label}</h3>
                <ul className="space-y-3">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-ghana-green flex-shrink-0 mt-0.5" />
                      <span className="text-academic-slate text-sm leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-4xl font-bold text-techbridge-navy text-center mb-4"
          >
            The Competitor Timeline
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-academic-slate mb-14 max-w-2xl mx-auto"
          >
            By the time a foreign vendor is operational, Techbridge has already trained thousands of students.
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="rounded-2xl border-2 border-ghana-green/40 bg-ghana-green/5 p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-ghana-green/15 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-ghana-green" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-ghana-green">Techbridge</h3>
                  <p className="text-xs text-academic-slate">Ghana — Operational in 8 weeks</p>
                </div>
              </div>
              <div className="space-y-3">
                {techbridgeTimeline.map((step, i) => (
                  <div key={step.label} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${i === techbridgeTimeline.length - 1 ? 'bg-ghana-green ring-2 ring-ghana-green ring-offset-2' : 'bg-techbridge-blue'}`}>
                      {i + 1}
                    </div>
                    <div className={`flex-1 rounded-lg px-4 py-2.5 ${i === techbridgeTimeline.length - 1 ? 'bg-ghana-green text-white font-bold' : 'bg-white border border-slate-200'}`}>
                      <span className={`font-semibold text-sm ${i === techbridgeTimeline.length - 1 ? 'text-white' : 'text-techbridge-navy'}`}>{step.label}</span>
                      <span className={`mx-2 text-xs ${i === techbridgeTimeline.length - 1 ? 'text-white/80' : 'text-academic-slate'}`}>—</span>
                      <span className={`text-sm ${i === techbridgeTimeline.length - 1 ? 'text-white' : 'text-academic-slate'}`}>{step.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={3}
              className="rounded-2xl border-2 border-ghana-red/30 bg-white p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-ghana-red/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-ghana-red" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-ghana-red">SmartBridge / Foreign Vendor</h3>
                  <p className="text-xs text-academic-slate">India / Overseas — No Ghana infrastructure</p>
                </div>
              </div>
              <div className="space-y-3">
                {smartbridgeTimeline.map((step, i) => (
                  <div key={step.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className={`flex-1 rounded-lg px-4 py-2.5 border ${i === smartbridgeTimeline.length - 1 ? 'border-ghana-red/40 bg-ghana-red/5' : 'border-slate-200 bg-slate-50'}`}>
                      <span className={`font-semibold text-sm ${i === smartbridgeTimeline.length - 1 ? 'text-ghana-red' : 'text-slate-600'}`}>{step.label}</span>
                      <span className="mx-2 text-xs text-slate-400">—</span>
                      <span className={`text-sm ${i === smartbridgeTimeline.length - 1 ? 'text-ghana-red font-medium' : 'text-slate-500'}`}>{step.detail}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl bg-ghana-red/8 border border-ghana-red/20 px-5 py-4">
                <p className="text-sm text-ghana-red font-semibold leading-snug">
                  At Month 7, a foreign vendor is still uncertain. Techbridge has already trained thousands of Ghanaian students.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-techbridge-light py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-4xl font-bold text-techbridge-navy text-center mb-4"
          >
            Governance & Oversight
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-academic-slate mb-14 max-w-xl mx-auto"
          >
            What the Government gets from day one — complete visibility and direct accountability.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {governanceItems.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-techbridge-blue/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-techbridge-blue" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-techbridge-navy mb-2">{item.title}</h3>
                  <p className="text-academic-slate text-sm leading-relaxed">{item.body}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-4xl font-bold text-techbridge-navy text-center mb-4"
          >
            Sustainability & Long-Term Vision
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-academic-slate mb-14 max-w-xl mx-auto"
          >
            Three phases from national deployment to Ghana becoming West Africa's digital hub.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sustainabilityPhases.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={scaleIn}
                className={`rounded-2xl border-2 ${phase.border} bg-white shadow-lg overflow-hidden`}
              >
                <div className={`${phase.color} px-6 py-5`}>
                  <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">{phase.years}</p>
                  <h3 className="font-serif text-xl font-bold text-white leading-snug">{phase.phase}: {phase.title}</h3>
                </div>
                <div className="px-6 py-6">
                  <div className="mb-5">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-academic-slate" />
                      <span className="font-bold text-techbridge-navy text-sm">{phase.students}</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {phase.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-ghana-green flex-shrink-0 mt-0.5" />
                        <span className="text-academic-slate text-sm leading-snug">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-techbridge-light py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-4xl font-bold text-techbridge-navy text-center mb-4"
          >
            Programme Management Structure
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-academic-slate mb-14 max-w-xl mx-auto"
          >
            Every role in this programme is Ghana-based. Every decision is made locally.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {managementRoles.map((role, i) => {
              const Icon = role.icon
              return (
                <motion.div
                  key={role.role}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex gap-4 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-ghana-green/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-ghana-green" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-techbridge-navy mb-1">{role.role}</h3>
                    <p className="text-academic-slate text-sm leading-relaxed">{role.detail}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-4xl font-bold text-techbridge-navy text-center mb-4"
          >
            Risk Mitigation
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-academic-slate mb-14 max-w-xl mx-auto"
          >
            Every identified risk has a proven response. No contingency is theoretical.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {riskCards.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className={`rounded-2xl border-2 ${card.color} bg-white p-7 hover:shadow-lg transition-shadow duration-300`}
                >
                  <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center mb-5`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-techbridge-navy mb-3">{card.title}</h3>
                  <div className="mb-4 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-academic-slate mb-1">Identified Risk</p>
                    <p className="text-academic-slate text-sm leading-snug">{card.risk}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-ghana-green mb-1">Our Response</p>
                    <p className="text-techbridge-navy text-sm leading-relaxed font-medium">{card.mitigation}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative bg-techbridge-navy py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-2 flex">
            <div className="flex-1 bg-ghana-red" />
            <div className="flex-1 bg-ghana-gold" />
            <div className="flex-1 bg-ghana-green" />
          </div>
        </div>
        <div className="relative max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <div className="inline-flex items-center gap-2 bg-techbridge-gold/15 border border-techbridge-gold/30 rounded-full px-5 py-2 mb-8">
              <Shield className="w-4 h-4 text-techbridge-gold" />
              <span className="text-techbridge-gold font-semibold text-sm tracking-wide">The Ask</span>
            </div>
          </motion.div>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
          >
            Techbridge asks for the opportunity to deliver Ghana's digital future.
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="text-techbridge-light/80 text-xl mb-12 leading-relaxed"
          >
            We are ready today.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-techbridge-gold text-techbridge-navy font-bold text-base px-9 py-4 rounded-full hover:bg-ghana-gold transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Begin Partnership Discussions
            </Link>
            <Link
              to="/track-record"
              className="inline-flex items-center gap-3 bg-transparent border-2 border-white/30 text-white font-semibold text-base px-9 py-4 rounded-full hover:bg-white/10 hover:border-white/60 transition-all duration-200"
            >
              See Our Track Record
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

```

### FILE: src/pages/LandingPage.tsx
```typescript
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  GraduationCap, Brain, CheckCircle, TrendingUp, Users, Building2,
  ArrowRight, Star, Shield, Globe, Clock, Award, BookOpen, Zap,
} from 'lucide-react'

const stats = [
  { value: '30+', label: 'Ghanaian Universities', icon: Building2 },
  { value: '50,000+', label: 'Theses Assessable/Year', icon: BookOpen },
  { value: '85%', label: 'Review Time Saved', icon: Clock },
  { value: '99.2%', label: 'Assessment Accuracy', icon: Award },
]

const pillars = [
  {
    icon: Brain,
    color: 'from-academic-blue to-blue-400',
    title: 'AI-Powered Intelligence',
    desc: 'Advanced natural language processing evaluates thesis quality, argumentation, methodology, and academic rigour at scale.',
  },
  {
    icon: Shield,
    color: 'from-ghana-green to-emerald-400',
    title: 'Data Sovereignty',
    desc: 'All data stored securely within Ghana\'s infrastructure. Full GDPR and Ghana Data Protection Act compliance guaranteed.',
  },
  {
    icon: Globe,
    color: 'from-ghana-red to-orange-400',
    title: 'National Scalability',
    desc: 'Built to serve all public and private tertiary institutions across Ghana simultaneously without performance degradation.',
  },
  {
    icon: TrendingUp,
    color: 'from-academic-amber to-yellow-400',
    title: 'Policy Intelligence',
    desc: 'Aligned with GES, NABTEX, and NAB standards. Produces structured data for national academic policy decisions.',
  },
]

const testimonials = [
  {
    quote: 'ThesisAI represents exactly the kind of home-grown digital solution Ghana needs to modernise its higher education sector.',
    author: 'Prof. Mensah Addo',
    role: 'Vice Chancellor, University of Ghana',
    initials: 'MA',
  },
  {
    quote: "The platform's ability to provide consistent, bias-free assessment is a major step forward for academic equity in our institutions.",
    author: 'Dr. Abena Asante',
    role: 'Director, Ghana Education Service',
    initials: 'AA',
  },
  {
    quote: 'Deploying ThesisAI across our faculty reduced thesis turnaround time from 8 weeks to under 72 hours.',
    author: 'Dr. Kwame Boateng',
    role: 'Dean of Graduate Studies, KNUST',
    initials: 'KB',
  },
]

const alignments = [
  'Ghana Digital Transformation Agenda 2030',
  'National Tertiary Education Commission Standards',
  'Ghana Education Sector Plan 2018–2030',
  'Africa Continental Free Trade Area (AfCFTA) Skills Framework',
  'UNESCO Higher Education Policy Guidelines',
  'National Accreditation Board Compliance Requirements',
]

export default function LandingPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-academic-navy via-[#1a3356] to-academic-blue min-h-screen flex items-center">
        {/* Ghana flag accent bar */}
        <div className="absolute top-0 left-0 right-0 flex h-1">
          <div className="flex-1 bg-ghana-red" />
          <div className="flex-1 bg-ghana-gold" />
          <div className="flex-1 bg-ghana-green" />
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-academic-blue/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-ghana-green/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-ghana-gold/10 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-ghana-gold/15 border border-ghana-gold/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-ghana-gold text-xs font-bold tracking-widest uppercase">Ghana Government Showcase</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6">
              Transforming Ghana's{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ghana-gold to-academic-amber">
                Academic Excellence
              </span>{' '}
              with AI
            </h1>

            <p className="text-xl text-white/75 leading-relaxed mb-8 max-w-xl">
              ThesisAI is Ghana's first nationally-deployable AI thesis assessment platform — designed by AUCDT to
              bring consistency, speed, and rigour to tertiary academic evaluation across all institutions.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 bg-ghana-gold hover:bg-academic-amber text-academic-navy px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-ghana-gold/25"
              >
                <Zap className="w-5 h-5" />
                See Live Demo
              </Link>
              <Link
                to="/partnership"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
              >
                Government Partnership
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mt-8">
              {['GES Aligned', 'NABTEX Compatible', 'GDPR Compliant', 'Made in Ghana'].map(badge => (
                <span key={badge} className="flex items-center gap-1.5 text-xs text-white/60 bg-white/5 border border-white/15 rounded-full px-3 py-1">
                  <CheckCircle className="w-3 h-3 text-ghana-green" />
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-2xl">
              {/* Mock assessment card */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-academic-gold/20 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-academic-gold" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Assessment Complete</div>
                  <div className="text-white/50 text-xs">Thesis: "Digital Agriculture in Ghana"</div>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= 4 ? 'text-ghana-gold fill-ghana-gold' : 'text-white/20'}`} />)}
                </div>
              </div>

              {/* Score bars */}
              {[
                { label: 'Research Methodology', score: 92 },
                { label: 'Literature Review', score: 88 },
                { label: 'Data Analysis', score: 95 },
                { label: 'Academic Writing', score: 85 },
                { label: 'Citation Accuracy', score: 91 },
              ].map((item, i) => (
                <div key={item.label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70">{item.label}</span>
                    <span className="text-academic-gold font-bold">{item.score}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-academic-blue to-ghana-green"
                    />
                  </div>
                </div>
              ))}

              <div className="mt-5 p-4 bg-ghana-green/15 border border-ghana-green/30 rounded-xl">
                <div className="text-ghana-green text-sm font-bold mb-1">Overall Grade: A (91/100)</div>
                <div className="text-white/60 text-xs">Recommended for distinction. Strong methodology and original contribution to field.</div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-ghana-green text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
              >
                AI Verified ✓
              </motion.div>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-academic-amber text-academic-navy text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
              >
                2.4s Analysis
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-academic-navy/5 flex items-center justify-center">
                  <s.icon className="w-6 h-6 text-academic-navy" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-academic-navy">{s.value}</div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="text-ghana-green text-sm font-bold tracking-widest uppercase mb-3">Platform Foundation</div>
            <h2 className="text-4xl font-serif font-bold text-academic-navy mb-4">Built for Ghana's Institutions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Four core pillars that make ThesisAI the right choice for Ghana's national academic infrastructure.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-4`}>
                  <p.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-academic-navy font-bold mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Alignment */}
      <section className="bg-academic-navy py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-ghana-gold text-sm font-bold tracking-widest uppercase mb-3">Government Alignment</div>
              <h2 className="text-4xl font-serif font-bold text-white mb-4">
                Aligned with Ghana's National Frameworks
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                ThesisAI was designed from the ground up to complement and support existing government education
                policies, accreditation bodies, and digital transformation initiatives.
              </p>
              <Link
                to="/partnership"
                className="inline-flex items-center gap-2 bg-ghana-gold hover:bg-academic-amber text-academic-navy px-6 py-3 rounded-xl font-bold transition-all"
              >
                View Partnership Details <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-3"
            >
              {alignments.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                >
                  <CheckCircle className="w-5 h-5 text-ghana-green shrink-0" />
                  <span className="text-white/80 text-sm">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="text-academic-blue text-sm font-bold tracking-widest uppercase mb-3">Trusted by Educators</div>
            <h2 className="text-4xl font-serif font-bold text-academic-navy mb-4">What Ghana's Academics Say</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-ghana-gold fill-ghana-gold" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-academic-navy text-white flex items-center justify-center font-bold text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-academic-navy font-semibold text-sm">{t.author}</div>
                    <div className="text-gray-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-ghana-green to-emerald-700 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Users className="w-12 h-12 text-white/60 mx-auto mb-4" />
            <h2 className="text-4xl font-serif font-bold text-white mb-4">
              Ready to Transform Ghana's Academic Standards?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join us in building a future where every Ghanaian student receives fair, fast, and expert-level
              thesis assessment — powered by AI, backed by data.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/demo"
                className="bg-white text-ghana-green px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                Experience the Demo
              </Link>
              <Link
                to="/partnership"
                className="bg-white/15 border border-white/40 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/25 transition-all"
              >
                Government Enquiry
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

```

### FILE: src/pages/PlatformPage.tsx
```typescript
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Server,
  Brain,
  BookOpen,
  Shield,
  Zap,
  Globe,
  GitBranch,
  BarChart2,
  Smartphone,
  Users,
  Award,
  Briefcase,
  ArrowRight,
  Activity,
  Cloud,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

function useCountUp(target: number, suffix: string, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { ref, display: `${count.toLocaleString()}${suffix}` };
}

const pillars = [
  {
    domain: 'techbridge.edu.gh',
    label: 'Main Learning Management System',
    icon: BookOpen,
    color: 'from-techbridge-navy to-techbridge-blue',
    accent: 'border-techbridge-gold',
    description:
      'The primary hub for student enrolment, course delivery, and academic progress management across all partner institutions.',
    stats: [
      { label: 'Active Learners', value: '15,000+' },
      { label: 'Courses Live', value: '200+' },
    ],
    features: [
      'Course catalogue',
      'Student dashboard',
      'Educator portal',
      'Grade management',
    ],
  },
  {
    domain: 'ai-tools.techbridge.edu.gh',
    label: 'AI Tools Hub',
    icon: Zap,
    color: 'from-techbridge-blue to-academic-blue',
    accent: 'border-ghana-green',
    description:
      'A curated suite of AI applications that enhance student productivity, research quality, and learning outcomes.',
    stats: [
      { label: 'AI Tools Available', value: '30+' },
      { label: 'Weekly Active Users', value: '6,500+' },
    ],
    features: [
      'AI writing assistant',
      'Code helpers',
      'Data analysis tools',
      'Research aids',
    ],
  },
  {
    domain: 'ai.techbridge.edu.gh',
    label: 'AI Learning Platform',
    icon: Brain,
    color: 'from-ghana-green to-techbridge-blue',
    accent: 'border-academic-blue',
    description:
      'Advanced adaptive learning powered by AI — delivering personalised academic journeys at scale for every student.',
    stats: [
      { label: 'Learning Paths', value: '500+' },
      { label: 'Avg. Completion Rate', value: '87%' },
    ],
    features: [
      'Personalised learning paths',
      'AI tutor',
      'Skill gap analysis',
      'Competency mapping',
    ],
  },
];

const infraItems = [
  {
    icon: Cloud,
    title: 'Scalable Cloud Architecture',
    desc: 'AWS + Google Cloud dual-provider redundancy ensuring maximum availability across Ghana.',
  },
  {
    icon: Users,
    title: 'Real-Time Collaboration',
    desc: 'Live document editing, group workspaces, and synchronous peer learning tools built in.',
  },
  {
    icon: GitBranch,
    title: 'GitHub Integration',
    desc: 'Native version control workflows connecting student projects to industry-standard repositories.',
  },
  {
    icon: Server,
    title: 'Dev Environments',
    desc: 'Pre-configured, browser-based coding environments matching industry toolchains.',
  },
  {
    icon: BarChart2,
    title: 'Analytics Dashboard',
    desc: 'Institutional-level reporting on learner progress, engagement, and outcome metrics.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-Responsive',
    desc: "Full feature parity on mobile — critical for Ghana's smartphone-first learner base.",
  },
];

const readyItems = [
  'Zero deployment lead time — live today',
  '15,000+ active Ghanaian learners onboarded',
  'Proven 98.5% uptime since 2020',
  'Ghana-specific content and context built in',
  'Local institutional relationships established',
  'Regulatory compliance already achieved',
  'Bilingual and multilingual support ready',
  'Mobile-first UX optimised for Ghanaian networks',
];

const notReadyItems = [
  'Requires 6+ months of platform build time',
  'Needs Ghana-specific customisation from scratch',
  'No proven Ghanaian user base',
  'Untested at national scale',
  'Local partnership and MoU negotiations pending',
  'Compliance and regulatory approval outstanding',
  'Content localisation effort required',
  'Risk of poor mobile performance on local networks',
];

const skillBadges = ['Python', 'Cloud', 'AI', 'Data'];

const metricCards = [
  { target: 8000, suffix: '+', label: 'Concurrent Users', icon: Users },
  { target: 985, suffix: '/1000', label: 'Uptime Score', icon: Activity },
  { target: 50, suffix: '+', label: 'Partner Institutions', icon: Globe },
  { target: 15000, suffix: '+', label: 'Active Learners', icon: Award },
];

function MetricCard({
  target,
  suffix,
  label,
  icon: Icon,
  index,
}: {
  target: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
  index: number;
}) {
  const { ref, display } = useCountUp(target, suffix);

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="flex flex-col items-center gap-3 rounded-2xl bg-white border border-techbridge-light p-8 shadow-sm"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-techbridge-navy/10">
        <Icon className="w-6 h-6 text-techbridge-navy" />
      </div>
      <span className="text-4xl font-bold text-techbridge-navy font-sans tabular-nums">
        {display}
      </span>
      <span className="text-sm font-medium text-techbridge-blue/80 uppercase tracking-wider text-center">
        {label}
      </span>
    </motion.div>
  );
}

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-techbridge-light font-sans">

      <section className="relative overflow-hidden bg-techbridge-navy">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-1 bg-ghana-red" />
          <div className="absolute top-1 left-0 right-0 h-1 bg-ghana-gold" />
          <div className="absolute top-2 left-0 right-0 h-1 bg-ghana-green" />
        </div>

        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, #FCD116 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1a4b8c 0%, transparent 50%)',
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-36 text-center">
          <motion.div
            variants={fadeIn}
            custom={0}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-techbridge-gold/40 bg-techbridge-gold/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-techbridge-gold animate-pulse" />
            <span className="text-techbridge-gold text-sm font-medium tracking-wide">
              Live Infrastructure — Operational Since 2020
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="visible"
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            The Platform —{' '}
            <span className="text-techbridge-gold">Live, Proven,</span>{' '}
            Ghanaian.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="visible"
            className="text-techbridge-light/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            No deployment needed. Techbridge's digital infrastructure is
            operational today, serving thousands of Ghanaian students across
            three integrated platforms.
          </motion.p>
        </div>
      </section>

      <section className="bg-ghana-green">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {[
              { value: '98.5%', label: 'Uptime' },
              { value: '8,000+', label: 'Concurrent Users' },
              { value: 'Live Since 2020', label: 'Proven Track Record' },
              { value: 'Zero', label: 'Downtime During Peak Periods' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                variants={fadeIn}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <Shield className="w-5 h-5 text-ghana-gold shrink-0" />
                <div>
                  <span className="font-bold text-white text-base md:text-lg">
                    {item.value}
                  </span>
                  <span className="text-white/70 text-sm ml-2">{item.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-techbridge-navy mb-4">
              Three Platforms. One Unified Ecosystem.
            </h2>
            <p className="text-techbridge-blue/70 text-lg max-w-2xl mx-auto">
              Each platform serves a distinct function within Ghana's digital
              education stack — fully integrated and ready to scale nationally.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.domain}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  className={`rounded-2xl border-t-4 ${pillar.accent} bg-white shadow-md overflow-hidden flex flex-col`}
                >
                  <div className={`bg-gradient-to-br ${pillar.color} p-8`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white/60 text-xs font-mono uppercase tracking-wider">
                        Platform {i + 1}
                      </span>
                    </div>
                    <h3 className="text-white font-mono text-lg font-semibold mb-1">
                      {pillar.domain}
                    </h3>
                    <p className="text-white/80 text-sm">{pillar.label}</p>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <p className="text-techbridge-blue/70 text-sm leading-relaxed mb-6">
                      {pillar.description}
                    </p>

                    <div className="flex gap-4 mb-6">
                      {pillar.stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="flex-1 rounded-xl bg-techbridge-light p-3 text-center"
                        >
                          <div className="font-bold text-techbridge-navy text-lg">
                            {stat.value}
                          </div>
                          <div className="text-techbridge-blue/60 text-xs mt-0.5">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <ul className="space-y-2 mt-auto">
                      {pillar.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-ghana-green shrink-0" />
                          <span className="text-sm text-techbridge-navy">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-techbridge-light">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-ghana-green bg-ghana-green/10 px-3 py-1 rounded-full mb-4">
                Skill Wallet
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-techbridge-navy mb-5 leading-tight">
                Digital Credentials That Open Doors
              </h2>
              <p className="text-techbridge-blue/70 text-base leading-relaxed mb-8">
                Every learner on the Techbridge platform earns a portable,
                employer-ready Skill Wallet — a verifiable portfolio of
                competencies, certifications, and real project work.
              </p>

              <ul className="space-y-4">
                {[
                  {
                    icon: Award,
                    text: 'Digital credential issuance with blockchain-backed verification',
                  },
                  {
                    icon: Shield,
                    text: "Industry-recognised certifications aligned to Ghana's NQF",
                  },
                  {
                    icon: Briefcase,
                    text: 'Portfolio building across projects and assessments',
                  },
                  {
                    icon: Users,
                    text: 'Employer-facing profiles with searchable skills index',
                  },
                  {
                    icon: Zap,
                    text: 'AI-powered internship matching algorithm',
                  },
                ].map((item, i) => {
                  const ItemIcon = item.icon;
                  return (
                    <motion.li
                      key={item.text}
                      variants={fadeUp}
                      custom={i + 1}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-techbridge-navy/10 flex items-center justify-center shrink-0 mt-0.5">
                        <ItemIcon className="w-4 h-4 text-techbridge-navy" />
                      </div>
                      <span className="text-techbridge-navy/80 text-sm leading-relaxed">
                        {item.text}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="w-full max-w-sm">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-techbridge-gold/30">
                  <div className="bg-gradient-to-br from-techbridge-navy to-techbridge-blue px-6 pt-6 pb-10">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-techbridge-gold text-xs font-bold uppercase tracking-widest">
                        Techbridge Skill Wallet
                      </span>
                      <Shield className="w-5 h-5 text-techbridge-gold" />
                    </div>
                    <div className="mb-4">
                      <div className="w-12 h-12 rounded-full bg-techbridge-gold/20 border-2 border-techbridge-gold/40 flex items-center justify-center mb-3">
                        <span className="text-techbridge-gold font-bold text-lg">
                          AK
                        </span>
                      </div>
                      <h4 className="text-white font-semibold text-lg">
                        Ama Korantema
                      </h4>
                      <p className="text-white/50 text-xs">
                        BSc. Computer Science · Cohort 2025
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {skillBadges.map((badge) => (
                        <span
                          key={badge}
                          className="px-3 py-1 rounded-full bg-techbridge-gold/20 text-techbridge-gold text-xs font-semibold border border-techbridge-gold/30"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-ghana-green animate-pulse" />
                      <span className="text-white/70 text-xs">
                        Credential Level: Advanced Practitioner
                      </span>
                    </div>
                  </div>

                  <div className="bg-white px-6 py-5 flex items-center justify-between">
                    <div>
                      <p className="text-techbridge-navy font-semibold text-sm">
                        Employer-Ready Profile
                      </p>
                      <p className="text-techbridge-blue/50 text-xs mt-0.5">
                        Scan to view verified credentials
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-lg border-2 border-techbridge-navy/20 bg-techbridge-light flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-0.5">
                        {Array.from({ length: 9 }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-3 h-3 rounded-sm ${
                              [0, 2, 6, 8, 4].includes(idx)
                                ? 'bg-techbridge-navy'
                                : 'bg-techbridge-light'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-techbridge-navy mb-4">
              Enterprise-Grade Technical Infrastructure
            </h2>
            <p className="text-techbridge-blue/70 text-lg max-w-xl mx-auto">
              Built to support national-scale deployment from day one.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {infraItems.map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  className="rounded-2xl border border-techbridge-light bg-techbridge-light/50 p-6 hover:border-techbridge-blue/30 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-techbridge-navy flex items-center justify-center mb-4">
                    <ItemIcon className="w-5 h-5 text-techbridge-gold" />
                  </div>
                  <h3 className="font-semibold text-techbridge-navy mb-2">
                    {item.title}
                  </h3>
                  <p className="text-techbridge-blue/60 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-techbridge-navy">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">
              Ready Now vs. Start From Scratch
            </h2>
            <p className="text-techbridge-light/60 text-lg max-w-xl mx-auto">
              The case for Techbridge is simple: the infrastructure exists,
              the learners are here, and the clock is ticking.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              variants={fadeUp}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl bg-ghana-green/10 border border-ghana-green/30 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-ghana-green flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">
                  Techbridge Platform
                  <span className="ml-2 text-ghana-green text-sm font-normal">
                    Ready Now
                  </span>
                </h3>
              </div>
              <ul className="space-y-3">
                {readyItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-ghana-green shrink-0 mt-0.5" />
                    <span className="text-techbridge-light/80 text-sm">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl bg-ghana-red/10 border border-ghana-red/30 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-ghana-red flex items-center justify-center shrink-0">
                  <XCircle className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">
                  New Platform Deployment
                  <span className="ml-2 text-ghana-red text-sm font-normal">
                    SmartBridge / Others
                  </span>
                </h3>
              </div>
              <ul className="space-y-3">
                {notReadyItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <XCircle className="w-4 h-4 text-ghana-red shrink-0 mt-0.5" />
                    <span className="text-techbridge-light/50 text-sm">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-techbridge-light">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-techbridge-navy mb-4">
              Live Metrics
            </h2>
            <p className="text-techbridge-blue/70 text-lg max-w-xl mx-auto">
              Real numbers from a real platform — not projections.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricCards.map((card, i) => (
              <MetricCard
                key={card.label}
                target={card.target}
                suffix={card.suffix}
                label={card.label}
                icon={card.icon}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-techbridge-navy via-techbridge-blue to-techbridge-navy relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-ghana-red" />
          <div className="absolute bottom-1 left-0 right-0 h-1 bg-ghana-gold" />
          <div className="absolute bottom-2 left-0 right-0 h-1 bg-ghana-green" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-techbridge-gold/20 text-techbridge-gold text-sm font-semibold mb-6 border border-techbridge-gold/30">
              Deployment Timeline: 8 Weeks
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Deploy Nationally{' '}
              <span className="text-techbridge-gold">in 8 Weeks</span>
            </h2>
            <p className="text-techbridge-light/70 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              The platform is live. The learners are enrolled. The
              infrastructure is proven. All that remains is the national
              mandate to scale Ghana's digital future.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/implementation"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-techbridge-gold text-techbridge-navy font-bold text-base hover:bg-ghana-gold transition-colors"
              >
                View Implementation Plan
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

```

### FILE: src/pages/ProgrammePage.tsx
```typescript
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Brain,
  Cloud,
  BarChart2,
  Code2,
  UserCheck,
  BookOpen,
  Briefcase,
  MapPin,
  Target,
  CheckCircle,
  ArrowRight,
  Users,
} from 'lucide-react'

const EASE = 'easeOut' as const

function inView(delay: number = 0) {
  return {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, delay, ease: EASE },
  }
}

function onMount(delay: number = 0) {
  return {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: EASE },
  }
}

const tracks = [
  {
    icon: Brain,
    title: 'Artificial Intelligence & Machine Learning',
    description:
      'Hands-on curriculum covering supervised and unsupervised learning, neural networks, NLP, and responsible AI deployment using Python, TensorFlow, and Hugging Face.',
    accent: 'bg-techbridge-blue',
  },
  {
    icon: Cloud,
    title: 'Cloud Computing',
    description:
      'Practical training on Google Cloud Platform and AWS — compute, storage, serverless, containers, and cloud architecture — leading to vendor certifications.',
    accent: 'bg-techbridge-green',
  },
  {
    icon: BarChart2,
    title: 'Data Science & Analytics',
    description:
      'Industry-relevant data pipelines, statistical analysis, visualisation with Power BI and Tableau, SQL, and Python-based data engineering for real-world datasets.',
    accent: 'bg-ghana-red',
  },
  {
    icon: Code2,
    title: 'Software Development & DevOps',
    description:
      'Full-stack development, version control with GitHub, CI/CD pipelines, containerisation with Docker and Kubernetes, and agile delivery practices.',
    accent: 'bg-academic-navy',
  },
]

const steps = [
  {
    number: '01',
    icon: UserCheck,
    title: 'Enrol',
    description:
      'Students at partner universities register through techbridge.edu.gh, select their technology track, and receive access to the Techbridge learning environment.',
  },
  {
    number: '02',
    icon: BookOpen,
    title: 'Learn & Build',
    description:
      'Project-based learning using real industry tools — GitHub, AWS, MongoDB, and Google Cloud — with structured cohorts, weekly deliverables, and industry mentors.',
  },
  {
    number: '03',
    icon: Briefcase,
    title: 'Get Certified & Employed',
    description:
      'Earn verifiable Skill Wallet credentials upon completion, enter the internship placement pipeline, and get matched to hiring partners across Ghana and globally.',
  },
]

const regions = [
  { name: 'Greater Accra', institutions: 18 },
  { name: 'Ashanti', institutions: 14 },
  { name: 'Western', institutions: 6 },
  { name: 'Eastern', institutions: 5 },
  { name: 'Northern', institutions: 4 },
  { name: 'Volta', institutions: 3 },
  { name: 'Central', institutions: 3 },
  { name: 'Brong-Ahafo', institutions: 3 },
]

const targets = [
  {
    year: 'Year 1',
    students: '50,000',
    universities: '30 universities',
    colour: 'border-techbridge-gold',
    bg: 'bg-techbridge-gold/10',
  },
  {
    year: 'Year 2',
    students: '150,000',
    universities: '50 universities',
    colour: 'border-techbridge-green',
    bg: 'bg-techbridge-green/10',
  },
  {
    year: 'Year 3',
    students: '300,000',
    universities: 'All accredited institutions',
    colour: 'border-techbridge-blue',
    bg: 'bg-techbridge-blue/10',
  },
  {
    year: 'Year 5',
    students: '1,000,000',
    universities: 'National milestone',
    colour: 'border-ghana-red',
    bg: 'bg-ghana-red/10',
  },
]

const partners = [
  { name: 'Google Cloud', bg: 'bg-white', text: 'text-techbridge-navy' },
  { name: 'GitHub', bg: 'bg-gray-900', text: 'text-white' },
  { name: 'Microsoft', bg: 'bg-techbridge-blue', text: 'text-white' },
  { name: 'Amazon Web Services', bg: 'bg-amber-400', text: 'text-gray-900' },
  { name: 'MongoDB', bg: 'bg-green-700', text: 'text-white' },
]

const experientialFeatures = [
  "Real project work on live industry briefs and open-source contributions",
  "Industry mentors from Ghana's leading tech companies and global firms",
  'Collaborative development environments mirroring professional workflows',
  'Portfolio-building assessments that produce tangible, shareable artefacts',
  'Internship placement pipeline with vetted employer partners',
  'Peer cohort system fostering collaboration, accountability, and community',
]

const skillWalletItems = ['Project Portfolio', 'Certification Badge', 'Employer Match Score', 'Internship Placement']

export default function ProgrammePage() {
  return (
    <div className="font-sans bg-white text-techbridge-navy">

      <section className="relative bg-techbridge-navy overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-2 flex">
            <div className="flex-1 bg-ghana-red" />
            <div className="flex-1 bg-ghana-gold" />
            <div className="flex-1 bg-ghana-green" />
          </div>
        </div>
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 40%, #FCD116 0%, transparent 60%)' }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-24">
          <motion.div
            {...onMount(0)}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-techbridge-gold/40 bg-techbridge-gold/10"
          >
            <span className="w-2 h-2 rounded-full bg-techbridge-gold animate-pulse" />
            <span className="text-techbridge-gold text-sm font-medium tracking-wide">
              Government of Ghana Initiative
            </span>
          </motion.div>

          <motion.h1
            {...onMount(0.1)}
            className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight max-w-4xl mb-6"
          >
            The One Million Coders Programme
            <span className="block text-techbridge-gold mt-1">Delivered by Techbridge</span>
          </motion.h1>

          <motion.p
            {...onMount(0.2)}
            className="text-lg md:text-xl text-blue-100 max-w-2xl leading-relaxed mb-10"
          >
            Ghana's national digital skills initiative, implemented through Techbridge's
            local-first experiential learning ecosystem — equipping one million young
            Ghanaians with the coding and technology skills needed to compete in the global economy.
          </motion.p>

          <motion.div
            {...onMount(0.3)}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/platform"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-techbridge-gold text-techbridge-navy font-semibold hover:bg-yellow-300 transition-colors"
            >
              Explore the Platform <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Partner with Us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 2 + 7: National Context & Opportunity */}
      <section className="py-20 bg-techbridge-light">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...inView()} className="max-w-3xl mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-techbridge-navy mb-5">
              Background &amp; National Context
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Ghana faces a structural digital skills deficit at a pivotal moment in its economic
              development. With a youth population of over 15 million and 46% of 15–35 year-olds
              classified as unemployed or underemployed, the inability to access formal technology
              training represents both a crisis and an opportunity.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              The Government of Ghana's One Million Coders Programme is a flagship national
              initiative designed to equip young Ghanaians — particularly at tertiary level — with
              critical coding, cloud, data, and AI skills demanded by the global digital economy.
              Techbridge proposes to implement this programme through a proven, locally-operated
              experiential learning ecosystem already serving 15,000+ active learners.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { stat: '15M+', label: 'Youth Population', sub: 'Ages 15–35 in Ghana' },
              { stat: '46%', label: 'Youth Underemployment', sub: 'Formal sector skills gap' },
              { stat: '3.2%', label: 'GDP Uplift Potential', sub: 'From digital skills investment' },
              { stat: '$4.2B', label: 'Digital Economy Target', sub: 'Ghana 2030 agenda' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                {...inView(i * 0.08)}
                className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm"
              >
                <div className="font-serif text-4xl font-bold text-techbridge-blue mb-1">{item.stat}</div>
                <div className="font-semibold text-techbridge-navy text-sm mb-1">{item.label}</div>
                <div className="text-gray-500 text-xs">{item.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: National Opportunity */}
      <section className="py-16 bg-ghana-green">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...inView()} className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
              The National Opportunity for Ghana's Digital Workforce
            </h2>
            <p className="text-green-100 max-w-2xl mx-auto text-lg">
              Training one million Ghanaians in digital skills is not just a social policy — it
              is the single highest-return economic investment available to Ghana today.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Employment Creation',
                body: 'Every 100 software developers trained creates an estimated 40 additional indirect jobs in the Ghanaian economy through supplier and demand effects.',
                accent: 'border-techbridge-gold',
              },
              {
                title: 'Export Revenue',
                body: 'Ghana\'s technology services export market could reach $1.2B annually by 2030 if a skilled workforce pipeline is established at national scale now.',
                accent: 'border-white',
              },
              {
                title: 'Import Substitution',
                body: 'Ghana currently spends $800M+ annually on foreign technology services. A domestically-skilled workforce recaptures this spend inside the Ghanaian economy.',
                accent: 'border-techbridge-gold',
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                {...inView(i * 0.1)}
                className={`bg-white/10 border-t-4 ${card.accent} rounded-xl p-7 text-white`}
              >
                <h3 className="font-serif text-xl font-bold mb-3">{card.title}</h3>
                <p className="text-green-100 text-sm leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...inView()} className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-techbridge-navy mb-3">
              The 4 Core Technology Tracks
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Every track is designed around industry standards, certification pathways, and
              real-world project outcomes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {tracks.map((track, i) => {
              const Icon = track.icon
              return (
                <motion.div
                  key={track.title}
                  {...inView(i * 0.08)}
                  className="flex gap-5 p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  <div className={`shrink-0 w-12 h-12 rounded-xl ${track.accent} flex items-center justify-center`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-techbridge-navy text-lg mb-2">{track.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{track.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-techbridge-navy">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...inView()} className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
              The Experiential Learning Model
            </h2>
            <p className="text-blue-200 max-w-xl mx-auto">
              A three-step journey from registration to employment — powered by real tools and
              verified outcomes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-techbridge-gold/30" />

            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  {...inView(i * 0.1)}
                  className="relative text-center"
                >
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-techbridge-blue border-2 border-techbridge-gold mb-6">
                    <Icon size={28} className="text-techbridge-gold" />
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-techbridge-gold text-techbridge-navy text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-3">
                    Step {step.number}: {step.title}
                  </h3>
                  <p className="text-blue-200 leading-relaxed text-sm">{step.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section 11 + 13: Scope of Work & Project Lifecycle */}
      <section className="py-20 bg-techbridge-light">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...inView()} className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-techbridge-navy mb-3">
              Scope of Work &amp; Project Lifecycle
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Each learner follows a structured project lifecycle — from onboarding through to
              employer-ready certification. Every stage produces a measurable, verified outcome.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-techbridge-gold via-techbridge-green to-techbridge-blue" />

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  phase: '01',
                  title: 'Enrolment & Track Selection',
                  detail: 'Student registers via techbridge.edu.gh, selects technology track, and completes diagnostic assessment to place into appropriate cohort.',
                  colour: 'bg-techbridge-gold',
                  textAccent: 'text-techbridge-gold',
                },
                {
                  phase: '02',
                  title: 'Foundations Module',
                  detail: 'Core concepts, tools setup, version control (GitHub), and collaborative workflow training. Assessed via hands-on practical tasks.',
                  colour: 'bg-techbridge-blue',
                  textAccent: 'text-techbridge-blue',
                },
                {
                  phase: '03',
                  title: 'Industry Project Sprint',
                  detail: 'Cohort works on a real industry brief — sourced from Techbridge employer partners — under the guidance of a sector mentor.',
                  colour: 'bg-ghana-green',
                  textAccent: 'text-ghana-green',
                },
                {
                  phase: '04',
                  title: 'Assessment & Credential',
                  detail: 'External assessors evaluate project deliverables. Successful learners receive a Techbridge Skill Wallet badge and certification record.',
                  colour: 'bg-academic-amber',
                  textAccent: 'text-academic-amber',
                },
                {
                  phase: '05',
                  title: 'Placement Pipeline',
                  detail: 'Graduates enter the Techbridge employer matching algorithm — connected to internship openings, graduate roles, and freelance opportunities.',
                  colour: 'bg-ghana-red',
                  textAccent: 'text-ghana-red',
                },
              ].map((phase, i) => (
                <motion.div
                  key={phase.phase}
                  {...inView(i * 0.1)}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className={`w-12 h-12 rounded-full ${phase.colour} flex items-center justify-center mb-4 shadow-lg z-10`}>
                    <span className="text-white font-bold text-sm">{phase.phase}</span>
                  </div>
                  <h4 className={`font-semibold ${phase.textAccent} text-sm mb-2 leading-tight`}>{phase.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{phase.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            {...inView(0.2)}
            className="mt-12 bg-white rounded-2xl border border-gray-200 p-7 shadow-sm"
          >
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              {[
                { label: 'Programme Duration', value: '12–16 weeks per cohort' },
                { label: 'Cohort Cadence', value: '4 intakes per year nationally' },
                { label: 'Delivery Mode', value: 'Blended online + on-campus labs' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="font-serif text-xl font-bold text-techbridge-navy mb-1">{item.value}</div>
                  <div className="text-gray-500 text-sm">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...inView()} className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-techbridge-navy mb-3">
              Partner University Coverage
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Techbridge operates across Ghana's university ecosystem — with active partnerships
              at more than 50 accredited tertiary institutions spanning every major region.
            </p>
          </motion.div>

          <motion.div
            {...inView(0.05)}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <MapPin size={20} className="text-techbridge-green" />
              <span className="font-semibold text-techbridge-navy text-lg">
                50+ partner institutions across Ghana's university ecosystem
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {regions.map((region, i) => (
                <motion.div
                  key={region.name}
                  {...inView(i * 0.06)}
                  className="p-4 rounded-xl bg-techbridge-light border border-techbridge-blue/10 text-center"
                >
                  <div className="text-2xl font-bold text-techbridge-blue mb-1">
                    {region.institutions}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{region.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">institutions</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...inView()} className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-techbridge-navy mb-3">
              Programme Targets
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A phased national rollout reaching one million coders by Year 5.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {targets.map((target, i) => (
              <motion.div
                key={target.year}
                {...inView(i * 0.1)}
                className={`rounded-2xl border-2 ${target.colour} ${target.bg} p-7 text-center`}
              >
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">
                  {target.year}
                </div>
                <div className="font-serif text-4xl font-bold text-techbridge-navy mb-2">
                  {target.students}
                </div>
                <div className="text-sm text-gray-600 font-medium">students enrolled</div>
                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                  {target.universities}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...inView(0.1)}
            className="mt-8 flex items-center gap-3 justify-center"
          >
            <Target size={18} className="text-ghana-red" />
            <span className="text-gray-600 text-sm font-medium">
              National target: 1,000,000 digitally skilled Ghanaians by 2030
            </span>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-techbridge-navy">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...inView()} className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
              Technology Partner Ecosystem
            </h2>
            <p className="text-blue-200 max-w-xl mx-auto">
              Techbridge students learn and are assessed on the world's leading platforms,
              earning credentials that are globally recognised by employers.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {partners.map((partner, i) => (
              <motion.div
                key={partner.name}
                {...inView(i * 0.08)}
                className={`${partner.bg} ${partner.text} px-6 py-3 rounded-full font-semibold text-sm shadow-md`}
              >
                {partner.name}
              </motion.div>
            ))}
          </div>

          <motion.p
            {...inView(0.1)}
            className="text-center text-blue-300 text-sm"
          >
            — and more global technology partners joining the ecosystem
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-techbridge-light">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <motion.div {...inView()}>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-techbridge-navy mb-4">
                What Makes This Experiential?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                The Techbridge model is not a lecture series with a certificate at the end.
                Every element of the programme is designed to produce graduates who have
                already done the work — and can prove it.
              </p>

              <ul className="space-y-4">
                {experientialFeatures.map((feature, i) => (
                  <motion.li
                    key={feature}
                    {...inView(i * 0.07)}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle size={20} className="text-techbridge-green shrink-0 mt-0.5" />
                    <span className="text-gray-700 leading-snug">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              {...inView(0.1)}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-techbridge-blue flex items-center justify-center">
                  <Users size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-techbridge-navy">Skill Wallet Credentials</div>
                  <div className="text-sm text-gray-500">Verifiable digital portfolio</div>
                </div>
              </div>

              <div className="space-y-4">
                {skillWalletItems.map((item) => (
                  <div key={item} className="flex items-center gap-3 p-3 rounded-lg bg-techbridge-light">
                    <div className="w-2 h-2 rounded-full bg-techbridge-green" />
                    <span className="text-sm font-medium text-techbridge-navy">{item}</span>
                    <span className="ml-auto text-xs text-techbridge-green font-semibold">Included</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Every graduate receives a Techbridge Skill Wallet — a portable, verified
                  record of their competencies, projects, and certifications accessible by
                  employers globally.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-techbridge-navy relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-1 flex">
            <div className="flex-1 bg-ghana-red" />
            <div className="flex-1 bg-ghana-gold" />
            <div className="flex-1 bg-ghana-green" />
          </div>
        </div>

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div {...inView()}>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Build Ghana's Digital Future?
            </h2>
            <p className="text-blue-200 text-lg mb-10 leading-relaxed">
              Explore the Techbridge platform or get in touch to discuss how your institution
              or organisation can participate in the One Million Coders Programme.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/platform"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-techbridge-gold text-techbridge-navy font-semibold text-lg hover:bg-yellow-300 transition-colors"
              >
                Explore the Platform <ArrowRight size={20} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Partner with Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

```

### FILE: src/pages/TrackRecordPage.tsx
```typescript
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Building2,
  Briefcase,
  Award,
  CheckCircle,
  ArrowRight,
  Globe,
  BookOpen,
  Shield,
  Cpu,
  Cloud,
  BarChart3,
  Megaphone,
  Lightbulb,
  Code2,
  Star,
  ChevronRight,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const stats = [
  {
    value: '5+',
    label: 'Years Operating',
    description: 'In Ghana\'s digital education sector',
    icon: Award,
    color: 'techbridge-gold',
  },
  {
    value: '50+',
    label: 'Institution Partnerships',
    description: 'Educational partners across Ghana',
    icon: Building2,
    color: 'techbridge-green',
  },
  {
    value: '15,000+',
    label: 'Students Trained',
    description: 'Ghanaian students through digital programmes',
    icon: Users,
    color: 'techbridge-blue',
  },
  {
    value: '2,400+',
    label: 'Internships Facilitated',
    description: 'Industry placements from 2020 to 2025',
    icon: Briefcase,
    color: 'ghana-red',
  },
  {
    value: '850+',
    label: 'Graduates Placed',
    description: 'In tech roles across Africa and globally',
    icon: Globe,
    color: 'techbridge-gold',
  },
  {
    value: '67%',
    label: 'Salary Growth Rate',
    description: 'Trainees earning 2–3x within 18 months',
    icon: TrendingUp,
    color: 'techbridge-green',
  },
];

const timelineMilestones = [
  {
    year: '2020',
    title: 'Founded',
    description:
      'Launched techbridge.edu.gh with the first 5 partner institutions. Established core digital learning infrastructure and admitted the inaugural student cohort.',
    highlight: 'Foundation Year',
  },
  {
    year: '2021',
    title: 'Growth',
    description:
      'Expanded partnerships to 15 institutions across Ghana. Launched the AI tools hub, giving students access to industry-grade development environments.',
    highlight: '15 Institutions',
  },
  {
    year: '2022',
    title: 'Scale',
    description:
      '5,000+ students trained across programmes. Executed the first major internship cohort with 400+ industry placements in the private sector.',
    highlight: '5,000+ Students',
  },
  {
    year: '2023',
    title: 'Impact',
    description:
      '10,000+ cumulative students trained. Launched ai.techbridge.edu.gh — a dedicated AI learning platform delivering personalised curriculum pathways.',
    highlight: 'AI Platform Live',
  },
  {
    year: '2024',
    title: 'Recognition',
    description:
      'Reached 50+ partner institutions and achieved 98.5% platform uptime — demonstrating enterprise-grade reliability at national scale.',
    highlight: '98.5% Uptime',
  },
  {
    year: '2025',
    title: 'National Readiness',
    description:
      '15,000+ students trained, 2,400+ internships completed, 850+ graduates placed. Techbridge is ready to deliver the One Million Coders Programme.',
    highlight: 'Ready to Scale',
  },
];

const outcomCards = [
  {
    stat: '850+',
    label: 'Graduates Placed',
    body: 'Techbridge graduates are employed in tech roles across Ghana, across Africa, and globally — in companies ranging from Ghanaian startups to international technology firms.',
    icon: Globe,
    accent: 'techbridge-gold',
  },
  {
    stat: '67%',
    label: 'Salary Transformation',
    body: '67% of programme graduates report earning 2–3x their previous salary within 18 months of completing a Techbridge programme — a measurable, life-changing outcome.',
    icon: TrendingUp,
    accent: 'techbridge-green',
  },
  {
    stat: '2,400+',
    label: 'Internships Delivered',
    body: 'Over 2,400 structured internship placements facilitated between 2020 and 2025, connecting Ghanaian talent with industry partners in fintech, healthtech, and agritech.',
    icon: Briefcase,
    accent: 'techbridge-blue',
  },
];

const techPartners = [
  {
    name: 'Google',
    detail: 'Cloud Infrastructure & Developer Tools',
    icon: Cloud,
  },
  {
    name: 'GitHub / Microsoft',
    detail: 'Version Control & DevOps Workflows',
    icon: Code2,
  },
  {
    name: 'AWS',
    detail: 'Scalable Cloud Infrastructure',
    icon: Cpu,
  },
  {
    name: 'MongoDB',
    detail: 'Modern Database Technologies',
    icon: BarChart3,
  },
  {
    name: 'Ghana Tech Ecosystem',
    detail: 'Local Innovation & Industry Partners',
    icon: Building2,
  },
];

const programmes = [
  { title: 'Artificial Intelligence', description: 'Machine learning, neural networks, and practical AI application in real-world Ghanaian contexts.', icon: Cpu },
  { title: 'Cloud Computing', description: 'Hands-on AWS, Google Cloud, and Azure training with industry-recognised certification pathways.', icon: Cloud },
  { title: 'Data Science', description: 'Statistical analysis, data visualisation, and Python-driven insights for business decision-making.', icon: BarChart3 },
  { title: 'Software Development', description: 'Full-stack engineering from fundamentals to deployment — web, mobile, and API development.', icon: Code2 },
  { title: 'Digital Marketing', description: 'SEO, social media strategy, analytics, and growth frameworks for the African digital economy.', icon: Megaphone },
  { title: 'Cybersecurity Fundamentals', description: 'Threat modelling, ethical hacking basics, and security best practices for modern organisations.', icon: Shield },
  { title: 'Entrepreneurship & Innovation', description: 'Lean startup methodology, business model design, and funding pathways for Ghanaian tech founders.', icon: Lightbulb },
];

const testimonials = [
  {
    quote:
      "We integrated Techbridge's platform across our three campuses and the reliability has been exceptional. 98.5% uptime is not a marketing number — our students have experienced it. This is a partner that understands what educational institutions need.",
    name: 'Prof. Abena Mensah-Barimah',
    title: 'Vice Chancellor, Kumasi Institute of Technology',
    role: 'Academic Leader',
  },
  {
    quote:
      'When I enrolled, I was earning minimum wage in a clerical job. Eighteen months after completing the Software Development track, I am a backend engineer at a fintech company in Accra. Techbridge changed the entire trajectory of my life.',
    name: 'Kwame Asante-Doku',
    title: 'Backend Engineer, Accra Fintech Ltd',
    role: 'Programme Graduate',
  },
  {
    quote:
      'We have hired twelve Techbridge graduates over the past two years and every single one has exceeded expectations. Their practical training — especially the internship component — means they contribute from week one. We will continue to partner with Techbridge.',
    name: 'Ama Kyeremeh',
    title: 'Head of Engineering, Volta Digital Solutions',
    role: 'Corporate Partner',
  },
];

export default function TrackRecordPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      <section className="relative bg-techbridge-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-techbridge-blue via-techbridge-navy to-black" />
        </div>
        <div className="absolute top-0 left-0 right-0 flex h-2">
          <div className="flex-1 bg-ghana-red" />
          <div className="flex-1 bg-ghana-gold" />
          <div className="flex-1 bg-ghana-green" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-28 pt-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-techbridge-gold/20 border border-techbridge-gold/40 text-techbridge-gold text-sm font-semibold px-4 py-2 rounded-full mb-6 tracking-wide uppercase"
          >
            <CheckCircle size={14} />
            Proven Track Record
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl text-white leading-tight mb-6"
          >
            Five Years.{' '}
            <span className="text-techbridge-gold">Proven Results.</span>{' '}
            Ghanaian-Built.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto leading-relaxed"
          >
            While other vendors propose new platforms, Techbridge has already delivered.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/impact"
              className="inline-flex items-center gap-2 bg-techbridge-gold text-techbridge-navy font-bold px-8 py-4 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              View Impact Data
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors"
            >
              Partner with Techbridge
              <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex h-1">
          <div className="flex-1 bg-ghana-red" />
          <div className="flex-1 bg-ghana-gold" />
          <div className="flex-1 bg-ghana-green" />
        </div>
      </section>

      <section className="bg-techbridge-light py-24">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-techbridge-navy mb-4">
                The Numbers That Matter
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Five years of consistent delivery across Ghana's education sector — every figure independently verifiable.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
                    className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm transition-shadow"
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 ${
                      stat.color === 'techbridge-gold' ? 'bg-yellow-50 text-yellow-500' :
                      stat.color === 'techbridge-green' ? 'bg-green-50 text-green-700' :
                      stat.color === 'techbridge-blue' ? 'bg-blue-50 text-blue-700' :
                      'bg-red-50 text-red-600'
                    }`}>
                      <Icon size={22} />
                    </div>
                    <div className="font-serif text-5xl font-bold text-techbridge-navy mb-2">
                      {stat.value}
                    </div>
                    <div className="text-base font-bold text-gray-800 mb-1">{stat.label}</div>
                    <div className="text-sm text-gray-500 leading-relaxed">{stat.description}</div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-techbridge-navy mb-4">
                Techbridge's Journey
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A deliberate progression from foundation to national scale — built in Ghana, for Ghana.
              </p>
            </motion.div>
          </AnimatedSection>
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-techbridge-gold via-techbridge-blue to-techbridge-green" />
            <div className="space-y-12">
              {timelineMilestones.map((milestone, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className={`relative flex items-start gap-6 md:gap-0 ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-techbridge-gold border-4 border-white shadow-md z-10 mt-1.5" />
                    <div className={`pl-16 md:pl-0 md:w-1/2 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                      <div className="inline-flex items-center gap-2 bg-techbridge-navy text-techbridge-gold text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-widest uppercase">
                        {milestone.year}
                      </div>
                      <h3 className="font-serif text-2xl text-techbridge-navy mb-1">{milestone.title}</h3>
                      <div className="text-xs font-bold text-techbridge-blue uppercase tracking-wider mb-2">{milestone.highlight}</div>
                      <p className="text-gray-600 text-sm leading-relaxed">{milestone.description}</p>
                    </div>
                    <div className="hidden md:block md:w-1/2" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-techbridge-navy py-24">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
                Employment Outcomes
              </h2>
              <p className="text-lg text-blue-200 max-w-2xl mx-auto">
                The ultimate measure of a training institution is what happens after graduation. Techbridge's numbers speak for themselves.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {outcomCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur"
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-6 ${
                      card.accent === 'techbridge-gold' ? 'bg-yellow-500/20 text-techbridge-gold' :
                      card.accent === 'techbridge-green' ? 'bg-green-500/20 text-green-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      <Icon size={22} />
                    </div>
                    <div className="font-serif text-5xl font-bold text-techbridge-gold mb-2">{card.stat}</div>
                    <div className="text-white font-bold text-lg mb-3">{card.label}</div>
                    <p className="text-blue-200 text-sm leading-relaxed">{card.body}</p>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-techbridge-light py-24">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-techbridge-navy mb-4">
                Technology Partnerships
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Techbridge programmes are backed by the world's leading technology platforms — giving Ghanaian learners access to globally recognised skills and certifications.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {techPartners.map((partner, i) => {
                const Icon = partner.icon;
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-xl p-6 flex items-start gap-4 border border-gray-100 shadow-sm"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-techbridge-navy flex items-center justify-center">
                      <Icon size={18} className="text-techbridge-gold" />
                    </div>
                    <div>
                      <div className="font-bold text-techbridge-navy text-base mb-1">{partner.name}</div>
                      <div className="text-gray-500 text-sm">{partner.detail}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-techbridge-navy mb-4">
                Programme Breadth
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Techbridge already delivers across seven critical disciplines — the curriculum is battle-tested, not theoretical.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {programmes.map((programme, i) => {
                const Icon = programme.icon;
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    whileHover={{ boxShadow: '0 12px 32px rgba(15,37,69,0.12)', y: -4 }}
                    className="group rounded-xl border border-gray-100 bg-techbridge-light p-6 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-techbridge-navy group-hover:bg-techbridge-blue transition-colors flex items-center justify-center mb-4">
                      <Icon size={18} className="text-techbridge-gold" />
                    </div>
                    <h3 className="font-bold text-techbridge-navy text-base mb-2">{programme.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{programme.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-techbridge-light py-24">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-techbridge-navy mb-4">
                What Partners and Graduates Say
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Outcomes validated by the people who have lived them — institutions, graduates, and employers.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col"
                >
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} size={14} className="fill-techbridge-gold text-techbridge-gold" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 text-sm leading-relaxed flex-1 mb-6 font-serif text-base">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="border-t border-gray-100 pt-5">
                    <div className="font-bold text-techbridge-navy text-sm">{testimonial.name}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{testimonial.title}</div>
                    <div className="inline-flex items-center gap-1 bg-techbridge-navy/10 text-techbridge-navy text-xs font-semibold px-2 py-0.5 rounded-full mt-2">
                      {testimonial.role}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-gradient-to-br from-techbridge-navy via-techbridge-blue to-techbridge-navy py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-techbridge-gold/20 border border-techbridge-gold/40 text-techbridge-gold text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
              <BookOpen size={12} />
              The Credential
            </div>
            <h2 className="font-serif text-4xl md:text-6xl text-white mb-8 leading-tight">
              Techbridge is not a proposal.{' '}
              <span className="text-techbridge-gold">We are a proven Ghanaian institution.</span>
            </h2>
            <p className="text-xl text-blue-200 leading-relaxed max-w-3xl mx-auto mb-4">
              With 5 years of delivering results across Ghana's education sector, Techbridge has already demonstrated what others only promise. The One Million Coders Programme deserves a partner who has already done it.
            </p>
            <div className="flex items-center justify-center gap-3 mt-3 mb-12">
              <div className="h-1 w-12 rounded-full bg-ghana-red" />
              <div className="h-1 w-12 rounded-full bg-ghana-gold" />
              <div className="h-1 w-12 rounded-full bg-ghana-green" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/impact"
                  className="inline-flex items-center gap-2 bg-techbridge-gold text-techbridge-navy font-bold px-10 py-4 rounded-xl text-base hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20"
                >
                  View Impact Data
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-10 py-4 rounded-xl text-base hover:border-white hover:bg-white/10 transition-all"
                >
                  Partner with Techbridge
                  <ChevronRight size={18} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

```

### FILE: src/pages/WhyTechbridgePage.tsx
```typescript
import { motion, type Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle, XCircle, Shield, Zap, Globe, TrendingUp, AlertTriangle } from 'lucide-react'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: 'easeOut' as const },
  }),
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const comparisonRows = [
  {
    criterion: 'Local Ownership',
    techbridge: 'Ghanaian-founded',
    smartbridge: 'India-based',
    others: 'Foreign-based',
  },
  {
    criterion: 'Established Presence',
    techbridge: '5+ years in Ghana',
    smartbridge: 'New to Ghana',
    others: 'Minimal presence',
  },
  {
    criterion: 'Speed to Market',
    techbridge: '8 weeks',
    smartbridge: '6+ months',
    others: '6+ months',
  },
  {
    criterion: 'Platform Ready',
    techbridge: 'techbridge.edu.gh live now',
    smartbridge: 'New deployment required',
    others: 'New build required',
  },
  {
    criterion: 'Accountability',
    techbridge: 'Direct to Ghana Govt',
    smartbridge: 'Indirect via India',
    others: 'Indirect via HQ',
  },
  {
    criterion: 'Cost Structure',
    techbridge: 'Competitive, locally set',
    smartbridge: 'Higher fees',
    others: 'Premium pricing',
  },
  {
    criterion: 'Profit Retention',
    techbridge: 'Reinvested in Ghana',
    smartbridge: 'Repatriated to India',
    others: 'Sent abroad',
  },
  {
    criterion: 'Cultural Fit',
    techbridge: 'Ghanaian-designed programs',
    smartbridge: 'Generic global templates',
    others: 'Adapted foreign curriculum',
  },
]

const pillars = [
  {
    icon: Shield,
    title: 'Accountability & Governance',
    body: 'Decision-making sits in Accra, not Mumbai or London. Techbridge is directly accountable to the Ghana Government, its citizens, and the One Million Coders Programme beneficiaries — with no intermediary overseas board or foreign shareholder structure diluting that responsibility.',
  },
  {
    icon: Zap,
    title: 'Immediate Platform Availability',
    body: 'techbridge.edu.gh is operational today. There is no build phase, no protracted vendor onboarding, and no discovery sprint. The programme can begin enrolling learners within eight weeks of contract award — a timeline no foreign vendor can match.',
  },
  {
    icon: Globe,
    title: 'Deep Ghana Knowledge',
    body: 'More than five years of continuous operation in Ghana has given Techbridge an unmatched understanding of Ghana\'s tertiary institutions, student demographics, connectivity constraints, local languages, and the lived realities of Ghanaian learners.',
  },
  {
    icon: TrendingUp,
    title: 'Economic Impact',
    body: 'Every cedi paid to Techbridge stays in Ghana. Revenues fund Ghanaian salaries, Ghanaian infrastructure, and Ghanaian innovation. Contracting foreign vendors exports capital that should be building Ghana\'s own digital economy.',
  },
]

const foreignRisks = [
  'Deployment risk — 6+ months before a single learner is enrolled',
  'Accountability gap — disputes resolved in foreign jurisdictions',
  'Profit outflow — revenues leave Ghana permanently',
  'Cultural mismatch — generic curricula misaligned with Ghana\'s context',
  'No established Ghana presence — no local support infrastructure',
]

const techbridgeBenefits = [
  '8-week deployment guarantee — programme launches on schedule',
  'Direct local accountability — Ghanaian leadership, Ghanaian answers',
  'Profits stay in Ghana — reinvested into digital infrastructure',
  'Culturally aligned — built by Ghanaians, for Ghanaians',
  'Proven platform — techbridge.edu.gh already serving learners',
]

export default function WhyTechbridgePage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      <section className="relative bg-techbridge-navy overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-2 flex">
            <div className="flex-1 bg-ghana-red" />
            <div className="flex-1 bg-ghana-gold" />
            <div className="flex-1 bg-ghana-green" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-techbridge-navy via-techbridge-blue/30 to-techbridge-navy opacity-80" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-techbridge-gold font-semibold tracking-widest uppercase text-sm mb-4"
          >
            One Million Coders Programme — Ghana
          </motion.p>
          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="font-serif text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
          >
            Why Techbridge?
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="text-lg md:text-xl text-techbridge-light/80 max-w-2xl mx-auto leading-relaxed"
          >
            The case for choosing Ghana's own digital skills partner over foreign vendors.
          </motion.p>
        </div>
      </section>

      <section className="bg-techbridge-light py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-4xl font-bold text-techbridge-navy text-center mb-4"
          >
            The Comparison
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-academic-slate mb-12 max-w-xl mx-auto"
          >
            Measured across eight critical criteria, Techbridge leads in every category.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="overflow-x-auto rounded-2xl shadow-xl border border-slate-200"
          >
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-techbridge-navy text-white">
                  <th className="px-5 py-4 text-left font-semibold tracking-wide w-44">Criterion</th>
                  <th className="px-5 py-4 text-center font-semibold tracking-wide bg-ghana-green text-white">
                    Techbridge
                    <span className="block text-xs font-normal opacity-80">Ghana</span>
                  </th>
                  <th className="px-5 py-4 text-center font-semibold tracking-wide">
                    SmartBridge
                    <span className="block text-xs font-normal opacity-70">India</span>
                  </th>
                  <th className="px-5 py-4 text-center font-semibold tracking-wide">
                    Other International
                    <span className="block text-xs font-normal opacity-70">Vendors</span>
                  </th>
                  <th className="px-5 py-4 text-center font-semibold tracking-wide text-techbridge-gold">Advantage</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.criterion}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                  >
                    <td className="px-5 py-4 font-semibold text-techbridge-navy">{row.criterion}</td>
                    <td className="px-5 py-4 bg-ghana-green/10 border-x border-ghana-green/20">
                      <div className="flex items-start gap-2 justify-center text-center">
                        <CheckCircle className="w-5 h-5 text-ghana-green flex-shrink-0 mt-0.5" />
                        <span className="text-techbridge-navy font-medium">{row.techbridge}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-2 justify-center text-center">
                        <XCircle className="w-5 h-5 text-ghana-red flex-shrink-0 mt-0.5" />
                        <span className="text-academic-slate">{row.smartbridge}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-2 justify-center text-center">
                        <XCircle className="w-5 h-5 text-ghana-red flex-shrink-0 mt-0.5" />
                        <span className="text-academic-slate">{row.others}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-block bg-ghana-green text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                        Techbridge
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-4xl font-bold text-techbridge-navy text-center mb-4"
          >
            The Ghanaian Advantage
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-academic-slate mb-14 max-w-xl mx-auto"
          >
            Four pillars that make Techbridge the only rational choice for the One Million Coders Programme.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <motion.div
                  key={pillar.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-ghana-green/10 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-ghana-green" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-techbridge-navy mb-3">{pillar.title}</h3>
                  <p className="text-academic-slate leading-relaxed">{pillar.body}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="flex h-3">
              <div className="flex-1 bg-ghana-red" />
              <div className="flex-1 bg-ghana-gold" />
              <div className="flex-1 bg-ghana-green" />
            </div>
            <div className="bg-techbridge-navy px-10 py-14 text-center">
              <p className="text-techbridge-gold font-semibold tracking-widest uppercase text-sm mb-6">
                Economic Sovereignty
              </p>
              <blockquote className="font-serif text-3xl md:text-4xl font-bold text-white leading-snug max-w-3xl mx-auto mb-8">
                "With international vendors, resources exit Ghana. With Techbridge, every cedi is reinvested into Ghana's digital future."
              </blockquote>
              <div className="flex justify-center gap-8 text-sm">
                <div className="text-center">
                  <div className="text-ghana-red font-bold text-2xl">Foreign Vendor</div>
                  <div className="text-slate-400 mt-1">Capital exits Ghana permanently</div>
                </div>
                <div className="w-px bg-slate-600" />
                <div className="text-center">
                  <div className="text-ghana-green font-bold text-2xl">Techbridge</div>
                  <div className="text-slate-400 mt-1">Capital reinvested in Ghana</div>
                </div>
              </div>
            </div>
            <div className="flex h-3">
              <div className="flex-1 bg-ghana-green" />
              <div className="flex-1 bg-ghana-gold" />
              <div className="flex-1 bg-ghana-red" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-techbridge-light py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-4xl font-bold text-techbridge-navy text-center mb-4"
          >
            Risk Comparison
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-academic-slate mb-12 max-w-xl mx-auto"
          >
            The decision carries consequences for one million Ghanaians. Choose accordingly.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="rounded-2xl border-2 border-ghana-red/30 bg-white p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-ghana-red/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-ghana-red" />
                </div>
                <h3 className="font-serif text-xl font-bold text-ghana-red">Choosing a Foreign Vendor</h3>
              </div>
              <ul className="space-y-4">
                {foreignRisks.map((risk) => (
                  <li key={risk} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-ghana-red flex-shrink-0 mt-0.5" />
                    <span className="text-academic-slate leading-snug">{risk}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={3}
              className="rounded-2xl border-2 border-ghana-green/40 bg-ghana-green/5 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-ghana-green/15 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-ghana-green" />
                </div>
                <h3 className="font-serif text-xl font-bold text-ghana-green">Choosing Techbridge</h3>
              </div>
              <ul className="space-y-4">
                {techbridgeBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-ghana-green flex-shrink-0 mt-0.5" />
                    <span className="text-techbridge-navy leading-snug font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-techbridge-navy py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-4xl font-bold text-white mb-5"
          >
            Ready to Proceed?
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-techbridge-light/75 text-lg mb-10 leading-relaxed"
          >
            Techbridge is prepared to begin onboarding immediately. Let's formalise the partnership and get Ghana's one million coders learning.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-techbridge-gold text-techbridge-navy font-bold text-lg px-10 py-4 rounded-full hover:bg-ghana-gold transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Begin the Partnership Discussion
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

```

### FILE: src/test/setup.ts
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

```

### FILE: tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Crimson Text', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        academic: {
          navy: '#1e3a5f',
          blue: '#2563eb',
          amber: '#f59e0b',
          gold: '#fbbf24',
          slate: '#475569',
        },
        ghana: {
          red: '#CE1126',
          gold: '#FCD116',
          green: '#006B3F',
          black: '#000000',
        },
        techbridge: {
          navy: '#0f2545',
          blue: '#1a4b8c',
          gold: '#FCD116',
          green: '#006B3F',
          light: '#f0f4fa',
        }
      }
    },
  },
  plugins: [],
}

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

```

### FILE: tsconfig.node.json
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}

```

### FILE: vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Techbridge Government Pitch',
        short_name: 'Techbridge',
        description: 'Ghana\'s One Million Coders Programme — Local, Ready-Now Partnership',
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
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
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
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.config.{js,ts}',
        '**/**.d.ts',
      ],
    },
  },
});

```

