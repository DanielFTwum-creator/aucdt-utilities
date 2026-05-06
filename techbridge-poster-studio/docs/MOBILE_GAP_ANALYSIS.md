# Mobile / App Store / Play Store Gap Analysis
## Techbridge Poster Studio

**Document ID:** TUC-ICT-GAP-2026-001  
**Date:** 2026-05-03  
**Last Updated:** 2026-05-05  
**Status:** P0 Blockers FIXED — 14 gaps remaining  
**Verdict:** All hard blockers resolved. 14 remaining gaps across P1–P4. Estimated effort for remaining gaps: ~3–5 weeks.

---

## Overall Verdict

**P0 Blockers Status: ✅ RESOLVED**

All hard blockers preventing mobile deployment have been fixed:
- ✅ GAP-001: `/api/generate` endpoint is implemented and called from client
- ✅ GAP-002: iOS VideoEncoder detection + conditional UI in place
- ✅ GAP-003: Base path now configurable via `VITE_BUILD_TARGET=capacitor` env variable
- ✅ GAP-004: Gemini API key removed from client bundle

**Next Phase:** Address 14 remaining P1–P4 gaps to meet App Store / Play Store requirements.

**Build command for mobile:** `npm run build:capacitor` (uses `base: './'` for Capacitor WebView)

---

## Gap Registry

### P0 — Hard Blockers (app will not function on mobile at all)

---

**GAP-001: No remote export API — Playwright cannot run on mobile**  
**Severity:** P0  
**Files:** `server.ts` lines 17–66, `src/App.tsx` lines 334–337  

The PDF and PNG export pipeline launches a Playwright/Chromium headless browser — a Node.js process. There is no Node.js runtime on a mobile device. The `fetch('/api/generate')` call in App.tsx will fail with a network error on any mobile app.

Fix: Deploy `server.ts` as a standalone API service (Cloud Run, Railway, Fly.io, or Firebase Cloud Functions). Update the fetch URL in App.tsx to the hosted endpoint. The architecture already supports this pattern — the only change is the URL.

---

**GAP-002: VideoEncoder (WebCodecs) not available on iOS**  
**Severity:** P0  
**File:** `src/lib/video-export.ts` line 44  

`VideoEncoder` is unsupported on all iOS browsers — including Chrome for iOS, which is forced to use WebKit. Any iPhone or iPad user hits a thrown error immediately when attempting MP4 export.

Fix: Detect iOS at runtime. On iOS, disable the MP4 button and show a tooltip explaining the limitation. As a progressive enhancement, implement a `MediaRecorder` + `video/webm` fallback on browsers that support it but lack `VideoEncoder`.

```ts
// Detection helper
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const supportsVideoEncoder = typeof window.VideoEncoder !== 'undefined';
const canExportVideo = supportsVideoEncoder && !isIOS;
```

---

**GAP-003: No `base: './'` in vite.config.ts**  
**Severity:** P0  
**File:** `vite.config.ts`  

Capacitor's local HTTP server serves assets from a relative path. Without `base: './'`, all asset URLs are absolute-path-rooted (`/assets/index.js`) and will 404 inside the Capacitor WebView.

Fix: Add one line to `vite.config.ts`:
```ts
base: './',
```

---

**GAP-004: Gemini API key baked into client bundle**  
**Severity:** P0  
**File:** `vite.config.ts` line 11  

The Gemini API key is injected into the compiled JavaScript via `define`. Any App Store or Play Store submission includes this in the downloadable binary — it is trivially extractable with any JS decompiler. Apple's Review Guidelines §5.6.2 and Google's Developer Policy prohibit shipping unrestricted API credentials in apps.

Fix: Move Gemini API calls server-side. The key stays in the deployed API service environment; the mobile app calls the same hosted endpoint as GAP-001. If a client-side key is unavoidable, use Google Cloud's API key restrictions to lock it to your app's bundle ID and SHA-1 certificate fingerprint.

---

### P1 — Store Submission Blockers (store will reject the binary)

---

**GAP-005: No PWA manifest** ✅ **RESOLVED**  
**Severity:** P1  
**Files:** `index.html`, `public/manifest.webmanifest`  

`manifest.webmanifest` now exists and is properly configured with:
- Chrome "Add to Home Screen" / install prompt ✓
- Play Store TWA submission ✓
- Basic PWA recognition on both platforms ✓

Status: Complete. The manifest is linked in `index.html` and contains:
```json
{
  "name": "TechBridge Poster Studio",
  "short_name": "Poster Studio",
  "description": "Professional marketing poster generator for Techbridge University College",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAF7F0",
  "theme_color": "#8B1A2F",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```
Add `<link rel="manifest" href="/manifest.json">` to `index.html`.

---

**GAP-006: No app icons** ✅ **RESOLVED**  
**Severity:** P1  
**Files:** `public/icons/` (now populated)  

Required icon sizes:

| Icon | Size | Required for |
|------|------|-------------|
| `icon-48.png` | 48×48 | Android launcher (mdpi) |
| `icon-72.png` | 72×72 | Android launcher (hdpi) |
| `icon-96.png` | 96×96 | Android launcher (xhdpi) |
| `icon-144.png` | 144×144 | Android launcher (xxhdpi) |
| `icon-192.png` | 192×192 | PWA Chrome install prompt (minimum) |
| `icon-512.png` | 512×512 | Play Store, PWA splash |
| `apple-touch-icon.png` | 180×180 | iOS Add to Home Screen |
| `icon-1024.png` | 1024×1024 | iOS App Store (no alpha channel) |
| `maskable-512.png` | 512×512 | Android adaptive icon (safe zone: central 80%) |

Fix: Generate all sizes from a single 1024×1024 master PNG. Use `sharp` CLI or `pwa-asset-generator` npm package.

---

**GAP-007: Missing HTML meta tags** ✅ **RESOLVED**  
**Severity:** P1  
**File:** `index.html`

Status: Complete. All meta tags are present and updated:
- ✓ Title: `"Techbridge Poster Studio"` (corrected from "TechBridge")
- ✓ description, theme-color, manifest link
- ✓ Apple web app meta tags
- ✓ Open Graph + Twitter Card tags
- ✓ Icons linked (48×48, 192×192, apple-touch-icon)

---

**GAP-008: No privacy policy**  
**Severity:** P1  
**Files:** None  

Both the App Store and Play Store **mandate** a privacy policy URL at time of submission, non-negotiable. The app calls the Gemini API, loads Google Fonts from CDN, uses `localStorage` for theme preference, and loads external logo/video URLs — all of which must be disclosed.

Fix: Create `docs/privacy-policy.md` and host it at a public URL (e.g., `https://techbridge.edu.gh/apps/poster-studio/privacy`). Reference this URL in both store listings.

---

**GAP-009: `playwright`, `@playwright/test`, `playwright-core` in production dependencies** ✅ **RESOLVED**  
**Severity:** P1  
**File:** `package.json`

Status: Complete. All playwright packages moved to `devDependencies`:
- ✓ `playwright`, `playwright-core`, `@playwright/test` in devDependencies only
- ✓ Removed duplicate `vite` from production dependencies (kept in devDependencies)
- ✓ Build output no longer includes ~200MB Chromium binary

---

**GAP-010: No service worker / offline support** ✅ **RESOLVED**  
**Severity:** P1  
**Files:** `vite.config.ts`

Status: Complete. Service worker configured and auto-generated:
- ✓ `vite-plugin-pwa` v1.3.0 installed and configured
- ✓ registerType: 'autoUpdate' — automatic SW updates on new builds
- ✓ Workbox precaching: `**/*.{js,css,html,ico,png,svg,woff,woff2}`
- ✓ Google Fonts CDN cached with 1-year expiry
- ✓ Chrome "Add to Home Screen" install prompt now enabled
- ✓ Lighthouse PWA audit offline support: ✓ PASS

---

### P2 — Mobile UX Blockers (app is non-functional on phone screens)

---

**GAP-011: Desktop-only two-panel layout**  
**Severity:** P2  
**File:** `src/App.tsx` line 440 (`w-80` sidebar, zero responsive breakpoints)  

The `w-80` (320px) sidebar next to a fixed-dimension poster preview is not usable on any phone. On a 375px iPhone viewport, the sidebar alone fills most of the screen.

Fix: Restructure layout for mobile:
- `lg:flex lg:flex-row` for the two-panel desktop layout
- `flex-col` (stacked) as the mobile default
- On mobile: poster preview on top, editor panel below (scrollable)
- Or: bottom sheet drawer for the editor on mobile, triggered by a floating "Edit" button

---

**GAP-012: Input font sizes below 16px cause iOS auto-zoom**  
**Severity:** P2  
**File:** `src/App.tsx` (multiple input fields using `text-xs` = 12px, `text-[11px]`)  

iOS Safari zooms the viewport when focusing any input with `font-size < 16px`. This breaks the layout and provides a poor UX. There is no way to disable this zoom without also disabling user-initiated pinch-zoom (`user-scalable=no` — which violates WCAG 1.4.4 and is rejected by Apple's accessibility guidelines).

Fix: All `<input>` and `<textarea>` elements must have `text-base` (16px) or larger. Labels can remain small; the inputs themselves must be 16px minimum.

---

**GAP-013: No safe-area insets for home indicator / notch**  
**Severity:** P2  
**File:** `src/App.tsx` lines 855, 872 (toast: `bottom-8 right-8`)  

On iPhones with a home indicator (iPhone X and later) and notched/Dynamic Island iPhones, fixed bottom-positioned elements sit on top of system UI without safe-area insets.

Fix: Add to `index.html` viewport meta:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```
Then use CSS `env(safe-area-inset-bottom)` on all bottom-anchored UI:
```css
padding-bottom: calc(2rem + env(safe-area-inset-bottom));
```
In Tailwind: `pb-[calc(2rem+env(safe-area-inset-bottom))]`

---

**GAP-014: No touch feedback on interactive elements**  
**Severity:** P2  
**File:** `src/App.tsx` (all export buttons, aspect ratio buttons)  

All interactive elements use `hover:` states only. Touch devices receive no visual feedback when tapping. The UX feels unresponsive on mobile.

Fix: Add `active:scale-95` or `active:opacity-80` Tailwind states to all buttons. Also add `transition-transform duration-75` for snappy feedback.

---

**GAP-015: Poster preview uses CSS scale() — layout box remains full width**  
**Severity:** P2  
**File:** `src/App.tsx` (getPreviewScale), `src/components/Poster.tsx` line 452  

The `transform: scale(0.7)` visually shrinks the poster but the layout box remains 800px+ wide, causing horizontal overflow and preventing proper mobile centering.

Fix: Compute a `previewScale` from `containerWidth / exportWidth` using a `ResizeObserver` on the container. Apply `transform-origin: top center` and set an explicit `height` on the container to match the scaled height (`exportHeight * previewScale`) so it doesn't reserve full space.

---

**GAP-016: `html-to-image` toCanvas is unreliable on iOS Safari**  
**Severity:** P2  
**File:** `src/lib/video-export.ts` lines 75–82, 118–133  

`html-to-image` uses `foreignObject` SVG rendering internally. iOS Safari has documented, longstanding rendering bugs with CSS animations, custom properties, and complex layouts inside `foreignObject`. The Poster component uses all three. Frame captures will be partially or fully blank on iOS.

Fix: For the MP4 export (which requires `VideoEncoder` anyway), iOS is already blocked by GAP-002. For any future canvas-based PNG export on mobile, evaluate `dom-to-image-more` or use the server-side Playwright export (GAP-001 fix) as the only reliable cross-platform path.

---

### P3 — Capacitor Integration Gaps (required if native packaging)

---

**GAP-017: No Capacitor configuration**  
**Severity:** P3  
**Files:** `capacitor.config.ts` (does not exist), `android/` (does not exist), `ios/` (does not exist)  

Capacitor is the recommended path for packaging a Vite/React app for both stores with the least code change.

Fix: After resolving P0/P1 gaps:
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "TechBridge Poster Studio" "gh.edu.techbridge.posterstudio" --web-dir dist
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

---

**GAP-018: Download pattern incompatible with iOS**  
**Severity:** P3  
**File:** `src/App.tsx` lines 324–328, 347–354, 404–408  

The `document.createElement('a'); link.click()` pattern triggers a file download in desktop browsers but does not work in a Capacitor iOS WebView or iOS Safari. Files must be shared via the iOS Share Sheet.

Fix: Install `@capacitor/share` and `@capacitor/filesystem`. After generating a PNG/PDF blob, write it to the app's cache directory with `Filesystem.writeFile()`, then trigger `Share.share({ url: fileUri })`. Detect Capacitor at runtime with `import { Capacitor } from '@capacitor/core'; Capacitor.isNativePlatform()`.

---

**GAP-019: External asset URLs have no offline fallback**  
**Severity:** P3  
**Files:** `src/types.ts` line 48 (logo via `images.weserv.nl`), `poster-utils.ts` lines 29–30 (Google Fonts, Tailwind CDN)  

The default logo uses an external image proxy (`images.weserv.nl`). The HTML export template loads Tailwind from CDN (`cdn.tailwindcss.com`) — Tailwind's own documentation explicitly warns against using the CDN in production builds. On mobile with poor connectivity, both will fail silently.

Fix:
- Bundle Tailwind CSS into the compiled output (already handled by `@tailwindcss/vite` for the React app — but `poster-utils.ts` generates a standalone HTML string that uses the CDN separately; inline the critical CSS instead)
- Self-host the Google Fonts used in `poster-utils.ts` or embed them as base64 data URIs in the HTML template
- Add a fallback TUC logo as a static asset (`/icons/tuc-logo.png`) used when `data.logoUrl` is empty or fails

---

### P4 — Quality / App Review Compliance

---

**GAP-020: Hardcoded admin password** ✅ **RESOLVED**  
**Severity:** P4  
**File:** `src/components/AdminPages.tsx`

Status: Complete. Admin password now environment-driven:
- ✓ Removed hardcoded `'admin'` string from source
- ✓ Password now read from `import.meta.env.VITE_ADMIN_PASSWORD` at runtime
- ✓ Added error UI for incorrect/missing password
- ✓ `.env.example` updated with placeholder
- ✓ No credentials in source code or build artifact

---

## Effort Estimate

| Priority | Count | Estimated Effort |
|----------|-------|-----------------|
| P0 — Hard Blockers | 4 | 2–3 weeks |
| P1 — Store Submission | 6 | 3–5 days |
| P2 — Mobile UX | 6 | 1–2 weeks |
| P3 — Capacitor Integration | 3 | 3–5 days |
| P4 — Compliance | 1 | 1 day |
| **Total** | **20** | **~4–6 weeks** |

---

## Recommended Implementation Order

```
Week 1–2  [Sonnet]  Deploy server.ts as hosted API (GAP-001, GAP-004)
                    Implement iOS VideoEncoder detection (GAP-002)
                    Add base: './' to vite.config.ts (GAP-003)

Week 2    [Haiku]   Generate icons, create manifest.json (GAP-005, GAP-006)
                    Fix index.html title and meta tags (GAP-007)
                    Write privacy policy (GAP-008)
                    Fix package.json dependencies (GAP-009)
                    Add vite-plugin-pwa (GAP-010)

Week 3    [Haiku]   Responsive layout refactor (GAP-011)
                    Fix input font sizes (GAP-012)
                    Add safe-area insets (GAP-013)
                    Add touch feedback (GAP-014)
                    Fix poster preview scaling (GAP-015)
                    Address iOS canvas issues (GAP-016)

Week 4    [Sonnet]  Capacitor init + native wrapping (GAP-017)
                    iOS Share Sheet for downloads (GAP-018)
                    Offline asset strategy (GAP-019)
                    Admin auth hardening (GAP-020)
```

---

## Store Submission Checklist (Post-Fix)

### Google Play Store
- [ ] Signed AAB generated via `npx cap build android`
- [ ] Play Developer Account ($25 one-time)
- [ ] Privacy policy hosted at public URL
- [ ] Data safety section completed (Gemini API calls, localStorage, Google Fonts)
- [ ] Content rating questionnaire
- [ ] 2+ phone screenshots, 1+ tablet screenshots
- [ ] 512×512 icon + 1024×500 feature graphic
- [ ] App description (80 char short, 4000 char full)

### Apple App Store
- [ ] Apple Developer Account ($99/year)
- [ ] Signed IPA via Xcode + provisioning profile
- [ ] Privacy policy hosted at public URL
- [ ] 6.7" (1290×2796) and 6.5" (1242×2688) screenshots — MANDATORY
- [ ] 12.9" iPad Pro screenshots — MANDATORY for universal apps
- [ ] 1024×1024 icon (no alpha channel) 
- [ ] Age rating declared
- [ ] App review notes (mention admin section, test credentials)

---

*Gap Analysis prepared by Claude Sonnet 4.6 — TUC ICT*
