# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Techbridge Poster Studio** is a hybrid React + Express application for creating and exporting professional marketing posters in 5 aspect ratios (Cinema, Story, Portrait, Square, Landscape) with PNG, PDF, and MP4 export capabilities. The app targets both web deployment (at `/poster/` subpath) and mobile via Capacitor.

---

## Essential Commands

```bash
npm run dev              # Start Vite dev server + Express backend (http://localhost:3000)
npm run build            # Build production bundle to dist/ (uses /poster/ subpath)
npm run build:capacitor  # Build for mobile (relative paths, no subpath)
npm run start            # Start Express in production mode
npm run test             # Run full Playwright E2E test suite
npm run test:mp4         # Test MP4 export specifically
npm run test:headed      # Run tests with visible browser (debugging)
npm run test:ui          # Interactive test UI mode
npm run lint             # TypeScript type check (tsc --noEmit, no ESLint)
npm run generate:icons   # Generate PWA icons at all required sizes
npm run preview          # Preview production build locally
```

**Test Notes:**
- Tests run sequentially (not parallel) to prevent out-of-memory during MP4 encoding
- 2-minute timeout per test (MP4 rendering is memory-intensive)
- Must run on `http://localhost:3000` (hardcoded in `playwright.config.ts`)

---

## Architecture

### Frontend Stack
- **React 19.2.5** + TypeScript 5.8 with Vite 6.2.3
- **Tailwind CSS 4.1** via `@tailwindcss/vite` (no PostCSS)
- **Motion 12.23** for animations
- **Lucide React 0.546** for icons
- **React Router DOM 7.14** for `/admin/` navigation
- **vite-plugin-pwa** for manifest, service worker, offline support

### Backend Stack
- **Express.js 4.21** for server routing + SPA fallback
- **Playwright 1.59** (Chromium) for server-side PDF/PNG rendering
- **Sharp 0.33** for icon generation

### Build Targets

**Web (SPA to `/poster/` subpath):**
- Base path: `/poster/`
- Route fallback: `GET *` → `index.html`
- Deployment: Any HTTP server (Express static, Firebase, Netlify, Vercel)

**Mobile (Capacitor with relative paths):**
- Base path: `./` (relative)
- Start URL: `./` (relative)
- Built with `VITE_BUILD_TARGET=capacitor` env var
- Requires backend API service (Cloud Run, Lambda) for PDF/PNG export

---

## Video Export Architecture

The codebase uses a **runtime-detected dual-path system** for video export:

### Path 1: WebCodecs (Chromium-only, preferred)
Located in `src/lib/video-export.ts` (`exportToMp4`)

**Detection:** `typeof window.VideoEncoder !== 'undefined'` && !iOS

**Implementation:**
- Renders 150 frames (5 seconds @ 30fps) from HTML element via `html-to-image`
- Uses `VideoEncoder` API + `mp4-muxer` for AVC/H.264 encoding
- **Critical: Frame lifecycle must be managed** (`frame.close()`) to prevent memory leaks
- Encoder flush every 5 frames prevents buffer buildup
- Keyframe every 2 seconds (60 frames @ 30fps)
- **Partial recovery:** If frame N fails, auto-saves partial video with N-1 frames
- Bitrate: 2.5 Mbps; dimensions padded to even numbers (codec requirement)
- Pre-loading: 2-second DOM settle, canvas pre-warm, logo pre-fetch (5s timeout)

### Path 2: MediaRecorder (fallback for non-Chromium)
Located in `src/lib/video-export.ts` (`exportViaMediaRecorder`)

**Detection:** Canvas has `captureStream()` && `MediaRecorder` available && supported MIME type

**Implementation:**
- 5-second recording @ 15fps (75 frames) via offscreen canvas
- Detects supported MIME type in priority order: h264 webm → vp9 webm → webm → mp4
- Returns `{ blob, extension }` (extension is 'webm' or 'mp4')
- No partial recovery (MediaRecorder either completes or fails entirely)

### Fallback: iOS / Unsupported Browsers
**Detection:** iOS user agent || no VideoEncoder && no captureStream

**Behavior:** Video export disabled; UI shows "not supported" message with AlertTriangle icon

### Non-Obvious Constraints
- **iOS completely blocked:** Hardware limitations prevent MediaRecorder from producing playable video
- **Dimension parity:** Codec requires even width/height; app pads odd dimensions
- **Memory-intensive:** 150+ canvas renders + 150+ VideoFrames; sequential test execution prevents OOM
- **Frame timestamp precision:** Calculated in microseconds (`(i * 1000000) / fps`)

### UI Integration
`src/App.tsx`:
- `getVideoExportMethod()` detects available path
- `canExportVideo()` gates button visibility (returns false only on iOS or unsupported browsers)
- `handleVideoExport()` routes to `exportToMp4()` or `exportViaMediaRecorder()` based on detection
- Download filename reflects format: `.mp4` (WebCodecs) or `.webm`/`.mp4` (MediaRecorder)

---

## Environment Variables

### `.env.example`
```
GEMINI_API_KEY=<secret>          # Google Gemini API (optional)
APP_URL=<cloud-run-url>           # For API redirects
VITE_ADMIN_PASSWORD=<secure>      # Admin panel unlock (optional)
VITE_BUILD_TARGET=capacitor       # Set for mobile builds
```

### Build-time
- `VITE_BUILD_TARGET=capacitor` → Build with `base: './'` (relative paths)
- Default → Build with `base: '/poster/'` (subpath)

### Runtime (Node.js)
- `NODE_ENV=production` → Express serves pre-built `dist/`
- `PORT` → Server port (default: 3000)
- `DISABLE_HMR=true` → AI Studio mode (disables HMR to prevent flickering)

---

## Key Files & Architecture

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main editor UI, export routing, state (posterData, isVideoExporting) |
| `src/components/Poster.tsx` | 5-aspect-ratio poster canvas, responsive mobile/desktop layout |
| `src/lib/video-export.ts` | **Dual-path video export:** WebCodecs + MediaRecorder fallback |
| `src/lib/poster-utils.ts` | HTML template for server-side rendering |
| `src/types.ts` | TypeScript interfaces (PosterData, AspectRatio enum) |
| `src/constants.ts` | Poster dimensions, colors, sizing per ratio |
| `server.ts` | Express routes (`/api/generate` for PDF/PNG), Playwright rendering |
| `vite.config.ts` | Vite build config, PWA plugin, dual-base-path logic, code splitting |
| `playwright.config.ts` | E2E test config (sequential, 2min timeout per test) |
| `tests/mp4-export.spec.ts` | MP4 export E2E tests (all ratios, error recovery) |
| `tests/video-export.unit.spec.ts` | WebCodecs unit tests (frame lifecycle, dimensions, timestamps) |
| `public/manifest.webmanifest` | PWA manifest (app name, icons, start_url) |
| `public/icons/` | Generated PWA icons (48–512px, maskable variants) |

---

## Testing Strategy

### E2E Tests (Playwright)
- **Framework:** `@playwright/test` with Chromium only
- **Location:** `tests/*.spec.ts`
- **Configuration:** Sequential execution (not parallel) to prevent OOM
- **Timeout:** 2 minutes per test
- **Report:** HTML reporter in `playwright-report/`
- **Trace/Screenshot:** Captured on first retry or failure

### Unit Tests (WebCodecs APIs)
- **Location:** `tests/video-export.unit.spec.ts`
- **Coverage:** VideoEncoder creation, VideoFrame lifecycle, MP4 muxer, dimension parity, timestamp precision, error handling, iOS detection

### MP4 Export Integration
- **Trigger:** `npm run test:mp4`
- **Scope:** Full end-to-end MP4 generation with all 5 aspect ratios

### Note
- No Jest/Vitest: React components are tested via E2E only
- Tests require `npm run dev` running (or set `reuseExistingServer: true` in `playwright.config.ts`)

---

## Deployment Notes

### Web (Static + Express)
```bash
npm run build
npm run start  # Serves dist/ on port 3000
```
- Ready for Docker deployment, Cloud Run, or standalone Node.js
- Fallback route: `GET *` → `index.html` (SPA routing)

### Mobile (Capacitor)
```bash
npm run build:capacitor
npx cap add ios && npx cap add android
npx cap build ios && npx cap build android
```
- Requires **separate backend API** for PDF/PNG export (Cloud Run, Lambda, etc.)
- iOS & Android require signed certificates (not included)
- App icon (1024×1024 PNG, no alpha) for App Store

### PWA Features
- Service worker auto-registers (via `vite-plugin-pwa`)
- Manifest linked in `index.html`
- Icons precached for offline install prompts
- Google Fonts cached with 365-day expiration

---

## Known Gaps & Constraints

**Mobile Store Readiness** (documented in `docs/MOBILE_GAP_ANALYSIS.md`):
- P0: Remote API deployment, iOS detection, relative paths config — **all resolved**
- P1: Manifest, icons, privacy policy, service worker — **all resolved**
- P2: Responsive layout (in progress), input sizing (fixed), safe areas (fixed)
- P3: Capacitor native config, iOS share sheet, offline assets
- P4: Admin password security (env-driven, not hardcoded)

**Browser Support:**
- MP4 export: Chrome, Edge, Opera (Chromium only)
- WebM fallback: Firefox, Safari (desktop)
- Video export: Disabled on iOS
- PNG/PDF export: Server-side only (requires Node.js backend)

**Memory Constraints:**
- MP4 rendering is memory-intensive (150 frames + VideoFrames)
- Tests run sequentially to prevent OOM
- Large logos (>2MB) may cause encoding to fail

---

## Development Tips

1. **Video Export Debugging:**
   - Use `canExportVideo()` to check if MP4 is available
   - Use `getVideoExportMethod()` to inspect which path is selected
   - Console logs in `exportToMp4()` and `exportViaMediaRecorder()` show frame/encoding progress
   - Partial videos auto-save on failure (check Downloads for `PARTIAL-*.mp4`)

2. **Vite HMR & Playwright:**
   - Hot module replacement works for React changes
   - Avoid `DISABLE_HMR=true` during normal development (AI Studio only)

3. **Admin Panel:**
   - Path: `/admin/diagnostics`
   - Password: Set via `VITE_ADMIN_PASSWORD` env var
   - Shows system diagnostics, Playwright status, browser capabilities

4. **Asset Loading:**
   - Logos pre-loaded with 5s timeout (continues on CORS failure)
   - External images must have CORS headers
   - Service worker caches Google Fonts (365 days)

5. **Code Splitting:**
   - Manual chunks for large deps (motion, html-to-image, mp4-muxer)
   - Verify bundle size with `npm run build` output (main ~250KB, total ~600KB gzipped)

---

## Gotchas

- **Frame memory leaks:** VideoFrame MUST be closed after encode; failure causes ENOMEM crashes
- **iOS blocking:** Intentional; MediaRecorder cannot produce playable video on iOS
- **Sequential tests:** Parallel test execution will cause out-of-memory during MP4 encoding
- **Subpath routing:** Web build uses `/poster/`; mobile build uses `./`
- **Server rendering:** PDF/PNG export requires Node.js backend (cannot be done client-side)
- **Admin password:** Hardcoded in source as fallback; should always use `VITE_ADMIN_PASSWORD` env var in production

