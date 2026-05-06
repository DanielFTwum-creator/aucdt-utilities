# CREATION.md — Drone Showcase

**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/drone-showcase/`
**Last verified:** 2026-04-26

---

## 1. What This App Is

The Drone Showcase (`drone-showcase` v0.1.0) is a **canvas-based animated showcase SPA** for Techbridge University College (TUC). It choreographs up to 1000 virtual drones to form three sequential shapes on an HTML5 `<canvas>`:

1. The outline of the **African continent** (in Pan-African red / gold / green).
2. The text **"AFRICA"** drawn inside the continent.
3. A cycling **Greek alphabet** letter (alpha → omega, looping).

The display loops every **45 seconds**, advancing to the next Greek letter. Each cycle has six phases: scatter-to-Africa-outline → hold-outline → form-text → hold-text → transition-to-Greek-letter → culmination-burst.

The app is **gated by a session-storage login** (`admin` / `admin`) before the canvas renders. Authenticated users see the showcase; the route hash `/admin` (rendered in the `BrowserRouter` portion of `AppWithAuth`) opens an admin panel containing an Overview compliance grid and an Activity Log table. The app is part of the TUC monorepo gateway and is deployed via the `drone-showcase` service in `docker-compose-all-apps.yml`.

---

## 2. Tech Stack (exact versions)

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.4** (never change) |
| DOM | react-dom | 19.2.4 |
| Build | Vite | 7.3.1 |
| React plugin | @vitejs/plugin-react | ^5.1.4 |
| Language | TypeScript | ^5.7.2 |
| Routing | react-router-dom | ^7.1.0 |
| Styling | Tailwind CSS | ^4.2.1 (via `@tailwindcss/vite`) |
| Icons | lucide-react | ^0.400.0 |
| Polyfills | react-app-polyfill | ^3.0.0 |
| Web vitals | web-vitals | ^2.1.4 |
| Static server | serve | 14.2.5 |
| Unit tests | Vitest + @testing-library/react + jsdom | ^3.0.0 / ^16.3.2 / ^26.1.0 |
| Test DOM matchers | @testing-library/jest-dom | ^6.6.3 |
| User-event | @testing-library/user-event | ^14.6.1 |
| Coverage | @vitest/coverage-v8 | ^3.0.0 |
| Package manager | pnpm | 10.30.1 (declared in `packageManager`) |
| Container | node:24-alpine → nginx:alpine | — |

---

## 3. Directory Structure (verbatim)

```
drone-showcase/
├── index.html
├── index.css
├── package.json                # name: drone-showcase, version: 0.1.0
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── vite.config.ts              # dev port 3000, base './'
├── vitest.config.ts
├── vitest.e2e.config.ts
├── tsconfig.json
├── Dockerfile                  # node:24-alpine multi-stage → serve dist on :4173
├── nginx.conf                  # SPA fallback to /index.html, /health endpoint
├── DEPLOYMENT.md
├── README.md
├── public/
├── docs/
│   ├── ADMIN_GUIDE.md
│   ├── architecture.svg
│   ├── dataflow.svg
│   ├── DEPLOYMENT.md
│   ├── SRS.md
│   └── TESTING.md
└── src/
    ├── index.tsx               # createRoot + AuthGate + AppWithAuth
    ├── index.css
    ├── App.tsx                 # canvas showcase root (~650 LOC)
    ├── App.css
    ├── App.test.js
    ├── AppWithAuth.tsx         # BrowserRouter with /login, /admin, /*
    ├── AuthGate.tsx            # session-storage username/password gate
    ├── reportWebVitals.js
    ├── setupTests.js
    ├── logo.svg
    ├── vite-env.d.ts
    ├── __tests__/
    ├── components/
    │   └── ProtectedRoute.tsx
    ├── contexts/
    │   └── AuthContext.tsx
    ├── pages/
    │   ├── LoginPage.tsx
    │   └── AdminPage.tsx
    └── services/
        └── AuthService.ts
```

---

## 4. Provider Composition (`src/index.tsx`)

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWithAuth from './AppWithAuth';
import reportWebVitals from './reportWebVitals';
import { AuthGate } from './AuthGate';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthGate><AppWithAuth /></AuthGate>
  </React.StrictMode>
);

reportWebVitals();
document.getElementById('tuc-splash-styles')?.remove();
```

`AuthGate` is the outer username/password lock. `AppWithAuth` wraps the inner router that exposes `/login`, `/admin`, and a fallback `/*` route to the canvas `App`.

---

## 5. Router Composition (`src/AppWithAuth.tsx`)

```tsx
<AuthProvider>
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={
        <ProtectedRoute><AdminPage /></ProtectedRoute>
      } />
      <Route path="/*" element={<App />} />
    </Routes>
  </BrowserRouter>
</AuthProvider>
```

---

## 6. Animation Constants (verbatim from `src/App.tsx`)

```ts
const MAX_DRONES           = 1000;
const DISPLAY_DURATION     = 45000;   // 45 s loop
const JITTER_AMOUNT        = 5;       // px random offset for Greek targets
const POINTS_PER_LENGTH    = 500;     // density along each line segment
const CULMINATION_PHASE_DUR = 5000;   // 5 s

const COLORS = {
  indigoSky:       '#1a202c',  // canvas background
  warmGold:        '#FFD700',
  regalPurple:     '#A020F0',
  panAfricanRed:   '#EF3340',
  panAfricanGreen: '#009732',
  pureWhite:       '#FFFFFF',
};
```

Phase timing inside `Drone.update(elapsed)`:

| Phase | Range | Effect |
|---|---|---|
| 1. Scatter → Africa | 0 → 10 000 ms | lerp(start → africa target), white → africa.color |
| 2. Hold outline | 10 000 → 12 000 ms | freeze positions, africa colour |
| 3. Form "AFRICA" text | 12 000 → 22 000 ms | lerp(africa → text target), africa.colour → text.colour |
| 4. Hold text | 22 000 → 24 000 ms | freeze, text colour |
| 5. Transition → Greek | 24 000 → 40 000 ms | text → greek target; colour: text → white (first 25%) → greek (rest) |
| 6. Culmination | 40 000 → 45 000 ms | size 3→7→3, alpha pulse, gold flash → final colour fade-out |

After 46 000 ms the loop calls `initDrones(letterIndex+1, w, h)`.

---

## 7. Shape Data (verbatim)

- **`AFRICA_OUTLINE_POINTS`** — 24 normalised points (`x`,`y` in [0..1]) coloured red / green / gold, outline-iterated into `AFRICA_SHAPE_SEGMENTS`.
- **`GREEK_LETTERS_ORDER`** — `["alpha","beta","gamma","delta","epsilon","zeta","eta","theta","iota","kappa","lambda","mu","nu","xi","omicron","pi","rho","sigma","tau","upsilon","phi","chi","psi","omega"]`.
- **`GREEK_LETTER_SHAPES_DATA`** — 24-key map; each value is an array of `{ p1: {x,y,part}, p2: {x,y,part} }` line segments in normalised `[0..1]` space.
- **`AFRICA_TEXT_SHAPES_DATA`** (memoised in `DroneDisplay`) — only the letters `A`,`F`,`R`,`I`,`C` are required to spell "AFRICA".

`generateShapePoints(segments, scaleX, scaleY, offsetX, offsetY)` linearly samples every segment at `Math.round(length * POINTS_PER_LENGTH)` points and returns absolute pixel coordinates.

`initDrones(letterIndex, width, height)` (re-runs on resize):
1. Compute Africa bounding box → scale to `min(w,h) * 0.6`, centre on canvas.
2. Compute Greek-letter bounding box → scale to `min(w,h) * 0.7`, centre.
3. Generate "AFRICA" text points scaled to `africaScale * 0.15` wide × `africaScale * 0.3` tall, offset to `africaOffset + (0.2, 0.4)*africaScale`.
4. `droneCount = min(MAX_DRONES, floor(width*height/500))`.
5. Each drone: random `(startX, startY)`; targets `africa[i % len]`, `greek[i % len]` (with ±2.5 px jitter), `text[i % len]`.

Render via `requestAnimationFrame`; canvas auto-resizes through a `ResizeObserver` on the parent `<div>`.

---

## 8. `Drone` Class (verbatim API)

```ts
class Drone {
  constructor(
    startX: number, startY: number,
    targets: { africa: Pt; greek: Pt; text: Pt },
    color: string, africanTextColor: string, size = 3
  );
  lerp(start: number, end: number, t: number): number;
  interpolateColor(c1: string, c2: string, factor: number): string; // hex → rgb interp → hex
  update(elapsed: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}
```

`interpolateColor` parses `#RRGGBB` via slice/parseInt; round-trip uses `(1<<24 + r<<16 + g<<8 + b).toString(16)`. Drones default to `pureWhite` if `drawColor` is unset.

---

## 9. UI Composition (`App.tsx` JSX)

The page outside the canvas is statically themed:
- Background `#28282B` (charcoal), text white, `font-family: sans-serif`.
- Header bar `#3D2B1F` (dark brown), title `Drone Display Showcase` in `#FFD700`, nav links `#demo` and `#about`.
- Centred `<main>` with three sections:
  1. `#introduction` — short hero copy.
  2. `#demo` — `<DroneDisplay />` inside a `bg-[#1a202c] border-2 border-[#FFD700]` card, min-height 500 px.
  3. `#about` — bullet list explaining the algorithm and listing the six phase durations.
- Footer `#3D2B1F` with copyright + tagline.

---

## 10. Authentication

### Outer gate (`src/AuthGate.tsx`)

- **Session key:** `sessionStorage["tuc_auth_drone_showcase"] === "1"`.
- **Accent colour (login card icon + button):** `#0d9488` (teal-600).
- Hard-coded credentials: `admin` / `admin`. Failure message: `"Invalid credentials. Use admin / admin"`.
- The login screen is inline-styled; it greets with `"Drone Showcase"` and footer line `"Techbridge University College · admin / admin"`.

### Inner router auth (`src/contexts/AuthContext.tsx` + `src/services/AuthService.ts`)

- `API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'`.
- `TOKEN_KEY = 'tuc_drone_showcase_token'` in `localStorage`.
- `AuthService.login(u,p)` → POST `${API_BASE}/api/auth/login` with `{username, password}`. On `success && token`, stores token.
- `AuthService.validateToken(token)` → GET `${API_BASE}/api/auth/validate` with `Authorization: Bearer …`.
- `AuthService.logout()` removes the token; `AuthService.isAuthenticated()` returns `!!token`.
- `AuthContext` exposes `{ isAuthenticated, user, login, logout, isLoading }`. On mount it validates the stored token; on backend failure it leaves state intact.
- `<ProtectedRoute>` redirects unauthenticated visitors of `/admin` to `/login`.

`User` shape: `{ id: string; username: string; role: string }`.

---

## 11. Admin Panel (`src/pages/AdminPage.tsx`)

Two-pane layout:

- **Sidebar** — `bg-[#0f172a]` dark, with a yellow `bg-[#ffcb05]` shield icon, the title `Drone Showcase`, two tabs (`overview`, `logs`), and a Sign-Out button at the bottom.
- **Main pane** — header `Drone Showcase — Admin` with subtitle `Techbridge University College · Staff Portal`.

Tabs:

1. **Overview** — 3-column compliance grid, six tiles: `React Version 19.2.4`, `Docker Configured`, `SRS docs/SRS.md`, `Tests vitest.config.ts`, `Auth Active`, `Phase Phase 2 Complete`. Each tile shows `✓ compliant` (emerald) or `✗ gap` (red).
2. **Activity Log** — table of `{ id, time, action, detail }` rows; seeded with one `SESSION_START` entry on mount.

`LoginPage.tsx` posts to the same `AuthService.login` API and redirects to `/admin` on success.

---

## 12. Build / Run / Test

```bash
pnpm install
pnpm run dev            # vite, port 3000, opens browser
pnpm run build          # → dist/
pnpm run preview
pnpm run serve          # serve -s dist -l 3000
pnpm test               # vitest
pnpm run test:ui        # vitest UI
pnpm run test:coverage  # vitest run --coverage
pnpm run test:e2e       # vitest --config vitest.e2e.config.ts
```

---

## 13. Docker

- **Dockerfile** — multi-stage. Stage 1 `node:24-alpine` enables corepack + pnpm, runs `pnpm install --frozen-lockfile || npm install`, then `pnpm run build`. Stage 2 also `node:24-alpine`, installs `serve` globally, copies `dist/`, exposes **4173**, healthchecks `wget --spider http://localhost:4173/health`.
- **nginx.conf** (used when deployed under the gateway image) — listens on `80`, root `/usr/share/nginx/html`, SPA fallback `try_files $uri $uri/ /index.html`, `/health` returns `healthy`, security headers `X-Frame-Options SAMEORIGIN`, `X-Content-Type-Options nosniff`, `X-XSS-Protection 1; mode=block`, `Referrer-Policy strict-origin-when-cross-origin`, gzip enabled.
- **docker-compose-all-apps.yml** — service `drone-showcase`, build context `./drone-showcase`, dockerfile `../Dockerfile.vite`, network `tuc-network`, healthcheck `wget http://localhost/health`.

---

## 14. Environment Variables

```bash
# Frontend (Vite)
VITE_API_URL=http://localhost:5000     # backend auth API base
NODE_ENV=development
```

`AuthGate` does not consume env; it is hard-coded `admin/admin`. Promote to `import.meta.env.VITE_AUTH_USERNAME` / `VITE_AUTH_PASSWORD` if real-credential rotation is required.

---

## 15. Branding Overlay

While the canvas page uses charcoal/brown/gold, all NEW chrome (login card, admin page, navigation) MUST follow the Techbridge brand:

| Token | Hex |
|---|---|
| Gold | `#C8A84B` |
| Ink | `#0F0C07` |
| Cream | `#F2EBD9` |
| Paper | `#141210` |

Typography: Playfair Display (titles), Bebas Neue (display), Inter / Cormorant Garamond (body).

---

## 16. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | App builds with zero TypeScript errors |
| AC-2 | `AuthGate` blocks the canvas until session login succeeds with `admin/admin` |
| AC-3 | Canvas renders ≤ 1000 drones and auto-resizes via `ResizeObserver` |
| AC-4 | Phase timeline matches §6 exactly (10 s + 2 s + 10 s + 2 s + 16 s + 5 s = 45 s) |
| AC-5 | Pan-African colours (`#EF3340`, `#FFD700`, `#009732`) appear during the Africa-outline phase |
| AC-6 | Greek letters cycle alpha → omega and loop back to alpha |
| AC-7 | `interpolateColor('#FF0000','#0000FF',0.5)` returns `#7f007f` (or `#800080`) |
| AC-8 | `/admin` route is protected: unauthenticated visits redirect to `/login` |
| AC-9 | Admin Overview shows the six compliance tiles (React 19.2.4, Docker, SRS, Tests, Auth, Phase) |
| AC-10 | Sidebar Sign-Out clears the token and navigates back to `/login` |
| AC-11 | Dockerfile produces a healthy image; `/health` returns `healthy` |
| AC-12 | Service appears under `drone-showcase:` in `docker-compose-all-apps.yml` on `tuc-network` |
| AC-13 | `index.tsx` removes `#tuc-splash-styles` after first paint (no FOUC) |
| AC-14 | All static text refers to "Techbridge University College" or "TUC" — never AUCDT — in newly produced chrome |
| AC-15 | Tests run via `pnpm test`; coverage achievable via `pnpm test:coverage` |
