# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What This App Is

**Flydee** is a gamified plane-spotting PWA. Users point their phone camera at the sky; the app reads device orientation (compass heading + pitch) and GPS to match the camera vector against live OpenSky Network flight data, then lets users "capture" a matched aircraft as a collectible digital card stored in Firestore.

Three main views (bottom-tab navigation):
- **Viewfinder** — live camera + AR HUD, scans airspace every 10 s, locks target, fires capture. Loaded eagerly (always on first paint).
- **Flight Binder** (Collection) — Firestore card grid, filterable by rarity/callsign. Lazy-loaded.
- **Global Radar** (Map) — custom CSS radar that plots captured sightings relative to user position. Lazy-loaded.

Admin section at `/admin` (password-gated in-app, not Firebase auth-gated): dashboard, audit logs, diagnostics, testing panel. All admin components are lazy-loaded.

---

## Commands

```bash
pnpm install          # Install dependencies
pnpm run dev          # Dev server on port 3000 (host 0.0.0.0)
pnpm run build        # Production build → dist/
pnpm run preview      # Preview production build
pnpm run lint         # TypeScript type-check (tsc --noEmit)
pnpm run clean        # Remove dist/
```

E2E tests use Playwright:
```bash
npx playwright test tests/e2e.spec.ts        # Run all E2E tests
npx playwright test tests/e2e.spec.ts --ui   # Interactive UI mode
```

---

## Environment Variables

Copy Firebase values from `firebase-applet-config.json`. Create `.env.local`:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_FIRESTORE_ID=      # Named Firestore database ID (not "(default)")

GEMINI_API_KEY=                   # Exposed as process.env.GEMINI_API_KEY (not VITE_ prefix)

# Optional — increases OpenSky rate limit from 10 req/min to 100/min
VITE_OPENSKY_USERNAME=
VITE_OPENSKY_PASSWORD=
```

`vite.config.ts` uses `loadEnv(mode, '.')` (not `process.cwd()`) to pick up `.env.local`.

---

## Architecture

### Data Flow: Viewfinder capture

1. `useSensors()` (`src/lib/sensors.ts`) — wraps `navigator.geolocation.watchPosition` and `deviceorientation` events → emits `{ heading, pitch, location }`. iOS requires an explicit user gesture before orientation starts — call `startOrientation()` from a button handler.
2. `fetchNearbyFlights()` (`src/lib/flightApi.ts`) — calls OpenSky `/api/states/all` with a lat/lng bounding box. Client-side rate-limit: minimum 10 s between calls. Returns empty array if called too soon.
3. `findTargetAircraft()` (`src/lib/flightApi.ts`) — computes azimuth + elevation from user GPS to each flight using spherical trigonometry, then checks against device heading/pitch within a 20° tolerance window.
4. On capture: `AircraftCard` written to Firestore `cards` collection with `userId`, shown as a modal.

### Routing

`BrowserRouter` wraps the app in `src/main.tsx`. Two top-level routes in `App.tsx`:
- `/` — `AppContent` (tab-based: Viewfinder / Collection / Map)
- `/admin` — `AdminLayout` or `AdminLogin`, with sub-routes `dashboard`, `logs`, `diagnostics`, `testing`

`isAdmin` state lives in `App.tsx` (not persisted). Refreshing `/admin` resets to the login form.

Production is served under `base: '/flydee/'` (set in `vite.config.ts`) — all asset paths are prefixed.

### Code Splitting

`vite.config.ts` uses `rolldownOptions.output.manualChunks` (Vite 8 / Rolldown — not `rollupOptions`) to split vendors into named chunks: `vendor-firebase`, `vendor-motion`, `vendor-genai`, `vendor-react`. Collection, Map, and all admin components are `React.lazy()` with `<React.Suspense>` wrappers — they are not included in the initial bundle.

### Firebase / Firestore

- **Auth:** Google Sign-In via `signInWithPopup`. Auth state from `onAuthStateChanged` controls whether the login screen or main app renders.
- **Firestore:** Named database (ID from `VITE_FIREBASE_FIRESTORE_ID`). Schema canonical source: `firebase-blueprint.json`. Security rules: `firestore.rules`.
  - `cards/{cardId}` — owner CRUD, all authed users can read
  - `auditLogs/{logId}` — read-only from client; `allow write: if false`

### UI Components & Styling

shadcn/ui components live in **two locations**:
- `components/ui/` — root-level shadcn output directory (per `components.json`)
- `src/components/ui/` — what the app actually imports via the `@` alias

`@` resolves to `./src` (configured in both `vite.config.ts` and `tsconfig.json`). Add shadcn components with:
```bash
pnpm dlx shadcn@latest add <component>
```

Tailwind CSS v4 via `@tailwindcss/vite` plugin — **no `tailwind.config.js`**, config lives in `src/index.css`. Design language: dark/monochrome, `font-mono`, uppercase `tracking-widest` labels, zinc palette. Animations via `motion/react` (Framer Motion).

### Known Stubs in Viewfinder.tsx

Aircraft type, airline, origin, and destination are hardcoded stubs — OpenSky doesn't return this data without a separate aircraft DB lookup. Photo is `picsum.photos` seeded by `icao24`. Rarity is random. All flagged with comments in source.

---

## Admin Section

Route: `/admin` — protected by `isAdmin` state in `App.tsx`, toggled by `AdminLogin`. Sub-routes: `dashboard`, `logs`, `diagnostics`, `testing`. See `docs/ADMIN_GUIDE.md` for full details.

---

## Docs

`docs/`: `ARCHITECTURE.md`, `DEPLOYMENT_GUIDE.md`, `TESTING_GUIDE.md`, `ADMIN_GUIDE.md`, `SRS.md`, `GAP_ANALYSIS.md`.
