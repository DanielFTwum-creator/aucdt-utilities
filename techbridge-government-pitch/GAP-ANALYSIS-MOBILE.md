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
