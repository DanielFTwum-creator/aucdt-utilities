# drone-showcase - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for drone-showcase.

### FILE: .dockerignore
```text
node_modules
dist
build
.git
.gitignore
*.md
.env
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
coverage
.nyc_output
*.log
.cache
.vscode
.idea
*.swp
*.swo
test-results
playwright-report

```

### FILE: .env.production
```text
# Create .env.production file
echo "GENERATE_SOURCEMAP=false" >> .env.production
echo "INLINE_RUNTIME_CHUNK=false" >> .env.production
```

### FILE: .gitignore
```text
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

```

### FILE: .npmrc
```text
# Use pnpm as package manager
package-manager=pnpm

```

### FILE: CREATION.md
```md
﻿# CREATION.md â€” Drone Showcase

**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/drone-showcase/`
**Last verified:** 2026-04-26

---

## 1. What This App Is

The Drone Showcase (`drone-showcase` v0.1.0) is a **canvas-based animated showcase SPA** for Techbridge University College (TUC). It choreographs up to 1000 virtual drones to form three sequential shapes on an HTML5 `<canvas>`:

1. The outline of the **African continent** (in Pan-African red / gold / green).
2. The text **"AFRICA"** drawn inside the continent.
3. A cycling **Greek alphabet** letter (alpha â†’ omega, looping).

The display loops every **45 seconds**, advancing to the next Greek letter. Each cycle has six phases: scatter-to-Africa-outline â†’ hold-outline â†’ form-text â†’ hold-text â†’ transition-to-Greek-letter â†’ culmination-burst.

The app is **gated by a session-storage login** (`admin` / `admin`) before the canvas renders. Authenticated users see the showcase; the route hash `/admin` (rendered in the `BrowserRouter` portion of `AppWithAuth`) opens an admin panel containing an Overview compliance grid and an Activity Log table. The app is part of the TUC monorepo gateway and is deployed via the `drone-showcase` service in `docker-compose-all-apps.yml`.

---

## 2. Tech Stack (exact versions)

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.5** (never change) |
| DOM | react-dom | 19.2.5 |
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
| Container | node:24-alpine â†’ nginx:alpine | â€” |

---

## 3. Directory Structure (verbatim)

```
drone-showcase/
â”œâ”€â”€ index.html
â”œâ”€â”€ index.css
â”œâ”€â”€ package.json                # name: drone-showcase, version: 0.1.0
â”œâ”€â”€ pnpm-lock.yaml
â”œâ”€â”€ pnpm-workspace.yaml
â”œâ”€â”€ vite.config.ts              # dev port 3000, base './'
â”œâ”€â”€ vitest.config.ts
â”œâ”€â”€ vitest.e2e.config.ts
â”œâ”€â”€ tsconfig.json
â”œâ”€â”€ Dockerfile                  # node:24-alpine multi-stage â†’ serve dist on :4173
â”œâ”€â”€ nginx.conf                  # SPA fallback to /index.html, /health endpoint
â”œâ”€â”€ DEPLOYMENT.md
â”œâ”€â”€ README.md
â”œâ”€â”€ public/
â”œâ”€â”€ docs/
â”‚   â”œâ”€â”€ ADMIN_GUIDE.md
â”‚   â”œâ”€â”€ architecture.svg
â”‚   â”œâ”€â”€ dataflow.svg
â”‚   â”œâ”€â”€ DEPLOYMENT.md
â”‚   â”œâ”€â”€ SRS.md
â”‚   â””â”€â”€ TESTING.md
â””â”€â”€ src/
    â”œâ”€â”€ index.tsx               # createRoot + AuthGate + AppWithAuth
    â”œâ”€â”€ index.css
    â”œâ”€â”€ App.tsx                 # canvas showcase root (~650 LOC)
    â”œâ”€â”€ App.css
    â”œâ”€â”€ App.test.js
    â”œâ”€â”€ AppWithAuth.tsx         # BrowserRouter with /login, /admin, /*
    â”œâ”€â”€ AuthGate.tsx            # session-storage username/password gate
    â”œâ”€â”€ reportWebVitals.js
    â”œâ”€â”€ setupTests.js
    â”œâ”€â”€ logo.svg
    â”œâ”€â”€ vite-env.d.ts
    â”œâ”€â”€ __tests__/
    â”œâ”€â”€ components/
    â”‚   â””â”€â”€ ProtectedRoute.tsx
    â”œâ”€â”€ contexts/
    â”‚   â””â”€â”€ AuthContext.tsx
    â”œâ”€â”€ pages/
    â”‚   â”œâ”€â”€ LoginPage.tsx
    â”‚   â””â”€â”€ AdminPage.tsx
    â””â”€â”€ services/
        â””â”€â”€ AuthService.ts
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
| 1. Scatter â†’ Africa | 0 â†’ 10 000 ms | lerp(start â†’ africa target), white â†’ africa.color |
| 2. Hold outline | 10 000 â†’ 12 000 ms | freeze positions, africa colour |
| 3. Form "AFRICA" text | 12 000 â†’ 22 000 ms | lerp(africa â†’ text target), africa.colour â†’ text.colour |
| 4. Hold text | 22 000 â†’ 24 000 ms | freeze, text colour |
| 5. Transition â†’ Greek | 24 000 â†’ 40 000 ms | text â†’ greek target; colour: text â†’ white (first 25%) â†’ greek (rest) |
| 6. Culmination | 40 000 â†’ 45 000 ms | size 3â†’7â†’3, alpha pulse, gold flash â†’ final colour fade-out |

After 46 000 ms the loop calls `initDrones(letterIndex+1, w, h)`.

---

## 7. Shape Data (verbatim)

- **`AFRICA_OUTLINE_POINTS`** â€” 24 normalised points (`x`,`y` in [0..1]) coloured red / green / gold, outline-iterated into `AFRICA_SHAPE_SEGMENTS`.
- **`GREEK_LETTERS_ORDER`** â€” `["alpha","beta","gamma","delta","epsilon","zeta","eta","theta","iota","kappa","lambda","mu","nu","xi","omicron","pi","rho","sigma","tau","upsilon","phi","chi","psi","omega"]`.
- **`GREEK_LETTER_SHAPES_DATA`** â€” 24-key map; each value is an array of `{ p1: {x,y,part}, p2: {x,y,part} }` line segments in normalised `[0..1]` space.
- **`AFRICA_TEXT_SHAPES_DATA`** (memoised in `DroneDisplay`) â€” only the letters `A`,`F`,`R`,`I`,`C` are required to spell "AFRICA".

`generateShapePoints(segments, scaleX, scaleY, offsetX, offsetY)` linearly samples every segment at `Math.round(length * POINTS_PER_LENGTH)` points and returns absolute pixel coordinates.

`initDrones(letterIndex, width, height)` (re-runs on resize):
1. Compute Africa bounding box â†’ scale to `min(w,h) * 0.6`, centre on canvas.
2. Compute Greek-letter bounding box â†’ scale to `min(w,h) * 0.7`, centre.
3. Generate "AFRICA" text points scaled to `africaScale * 0.15` wide Ã— `africaScale * 0.3` tall, offset to `africaOffset + (0.2, 0.4)*africaScale`.
4. `droneCount = min(MAX_DRONES, floor(width*height/500))`.
5. Each drone: random `(startX, startY)`; targets `africa[i % len]`, `greek[i % len]` (with Â±2.5 px jitter), `text[i % len]`.

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
  interpolateColor(c1: string, c2: string, factor: number): string; // hex â†’ rgb interp â†’ hex
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
  1. `#introduction` â€” short hero copy.
  2. `#demo` â€” `<DroneDisplay />` inside a `bg-[#1a202c] border-2 border-[#FFD700]` card, min-height 500 px.
  3. `#about` â€” bullet list explaining the algorithm and listing the six phase durations.
- Footer `#3D2B1F` with copyright + tagline.

---

## 10. Authentication

### Outer gate (`src/AuthGate.tsx`)

- **Session key:** `sessionStorage["tuc_auth_drone_showcase"] === "1"`.
- **Accent colour (login card icon + button):** `#0d9488` (teal-600).
- Hard-coded credentials: `admin` / `admin`. Failure message: `"Invalid credentials. Use admin / admin"`.
- The login screen is inline-styled; it greets with `"Drone Showcase"` and footer line `"Techbridge University College Â· admin / admin"`.

### Inner router auth (`src/contexts/AuthContext.tsx` + `src/services/AuthService.ts`)

- `API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'`.
- `TOKEN_KEY = [REDACTED_CREDENTIAL]
- `AuthService.login(u,p)` â†’ POST `${API_BASE}/api/auth/login` with `{username, password}`. On `success && token`, stores token.
- `AuthService.validateToken(token)` â†’ GET `${API_BASE}/api/auth/validate` with `Authorization: Bearer â€¦`.
- `AuthService.logout()` removes the token; `AuthService.isAuthenticated()` returns `!!token`.
- `AuthContext` exposes `{ isAuthenticated, user, login, logout, isLoading }`. On mount it validates the stored token; on backend failure it leaves state intact.
- `<ProtectedRoute>` redirects unauthenticated visitors of `/admin` to `/login`.

`User` shape: `{ id: string; username: string; role: string }`.

---

## 11. Admin Panel (`src/pages/AdminPage.tsx`)

Two-pane layout:

- **Sidebar** â€” `bg-[#0f172a]` dark, with a yellow `bg-[#ffcb05]` shield icon, the title `Drone Showcase`, two tabs (`overview`, `logs`), and a Sign-Out button at the bottom.
- **Main pane** â€” header `Drone Showcase â€” Admin` with subtitle `Techbridge University College Â· Staff Portal`.

Tabs:

1. **Overview** â€” 3-column compliance grid, six tiles: `React Version 19.2.5`, `Docker Configured`, `SRS docs/SRS.md`, `Tests vitest.config.ts`, `Auth Active`, `Phase Phase 2 Complete`. Each tile shows `âœ“ compliant` (emerald) or `âœ— gap` (red).
2. **Activity Log** â€” table of `{ id, time, action, detail }` rows; seeded with one `SESSION_START` entry on mount.

`LoginPage.tsx` posts to the same `AuthService.login` API and redirects to `/admin` on success.

---

## 12. Build / Run / Test

```bash
pnpm install
pnpm run dev            # vite, port 3000, opens browser
pnpm run build          # â†’ dist/
pnpm run preview
pnpm run serve          # serve -s dist -l 3000
pnpm test               # vitest
pnpm run test:ui        # vitest UI
pnpm run test:coverage  # vitest run --coverage
pnpm run test:e2e       # vitest --config vitest.e2e.config.ts
```

---

## 13. Docker

- **Dockerfile** â€” multi-stage. Stage 1 `node:24-alpine` enables corepack + pnpm, runs `pnpm install --frozen-lockfile || npm install`, then `pnpm run build`. Stage 2 also `node:24-alpine`, installs `serve` globally, copies `dist/`, exposes **4173**, healthchecks `wget --spider http://localhost:4173/health`.
- **nginx.conf** (used when deployed under the gateway image) â€” listens on `80`, root `/usr/share/nginx/html`, SPA fallback `try_files $uri $uri/ /index.html`, `/health` returns `healthy`, security headers `X-Frame-Options SAMEORIGIN`, `X-Content-Type-Options nosniff`, `X-XSS-Protection 1; mode=block`, `Referrer-Policy strict-origin-when-cross-origin`, gzip enabled.
- **docker-compose-all-apps.yml** â€” service `drone-showcase`, build context `./drone-showcase`, dockerfile `../Dockerfile.vite`, network `tuc-network`, healthcheck `wget http://localhost/health`.

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
| AC-3 | Canvas renders â‰¤ 1000 drones and auto-resizes via `ResizeObserver` |
| AC-4 | Phase timeline matches Â§6 exactly (10 s + 2 s + 10 s + 2 s + 16 s + 5 s = 45 s) |
| AC-5 | Pan-African colours (`#EF3340`, `#FFD700`, `#009732`) appear during the Africa-outline phase |
| AC-6 | Greek letters cycle alpha â†’ omega and loop back to alpha |
| AC-7 | `interpolateColor('#FF0000','#0000FF',0.5)` returns `#7f007f` (or `#800080`) |
| AC-8 | `/admin` route is protected: unauthenticated visits redirect to `/login` |
| AC-9 | Admin Overview shows the six compliance tiles (React 19.2.5, Docker, SRS, Tests, Auth, Phase) |
| AC-10 | Sidebar Sign-Out clears the token and navigates back to `/login` |
| AC-11 | Dockerfile produces a healthy image; `/health` returns `healthy` |
| AC-12 | Service appears under `drone-showcase:` in `docker-compose-all-apps.yml` on `tuc-network` |
| AC-13 | `index.tsx` removes `#tuc-splash-styles` after first paint (no FOUC) |
| AC-14 | All static text refers to "Techbridge University College" or "TUC" â€” never AUCDT â€” in newly produced chrome |
| AC-15 | Tests run via `pnpm test`; coverage achievable via `pnpm test:coverage` |

```

### FILE: DEPLOYMENT.md
```md
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/drone-showcase/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/drone-showcase/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/drone-showcase/',  // REQUIRED: Assets must load from /drone-showcase/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/drone-showcase"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/drone-showcase">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/drone-showcase/`, not at the root
- **Asset Loading**: Without `base: '/drone-showcase/'`, assets try to load from `/assets/` instead of `/drone-showcase/assets/`
- **Routing**: Without `basename="/drone-showcase"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/drone-showcase/assets/index-*.js`
- Link tags should reference: `/drone-showcase/assets/index-*.css`

If they reference `/assets/` instead of `/drone-showcase/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/drone-showcase/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/drone-showcase/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: drone-showcase

```

### FILE: Dockerfile
```text
# Multi-stage Dockerfile for Vite/React Applications
# Optimized for production deployment

# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Enable Corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || npm install

# Copy application source
COPY . .

# Build application
RUN pnpm run build || npm run build

# Stage 2: Production
FROM node:24-alpine

WORKDIR /app

# Install serve for production preview
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4173/health || exit 1

# Run application
CMD ["serve", "-s", "dist", "-l", "4173"]

```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — drone-showcase

**Application:** drone-showcase
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Accessing the Admin Section

Navigate to: `http://localhost:5173/#/admin`

The admin section is password-protected. Default credentials are set via the `VITE_ADMIN_PASSWORD`
environment variable (see `.env`). Never commit credentials to version control.

---

## Admin Features

### Audit Log

All significant user actions are recorded in the Audit Log panel. Entries include:

| Field | Description |
|---|---|
| Timestamp | ISO 8601 UTC time of the action |
| User | User identifier or "guest" |
| Action | Action type (e.g. LOGIN, SUBMIT, EXPORT) |
| Detail | Additional context |

Audit log data is stored in `localStorage` under the key `tuc_drone-showcase_audit`.

### Diagnostic Panel

The Diagnostic Panel provides:

- **System Info** — React version, build mode, environment variables (non-secret)
- **State Inspector** — Current application state snapshot
- **Network Monitor** — API call history and response codes
- **Test Runner** — Trigger manual smoke tests from the UI

### Theme Controls

Admins may switch between Light, Dark, and High-Contrast themes.
Theme selection persists via `localStorage`.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Admin section password | (required) |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_GA_ID` | Google Analytics tag | `G-FKXTELQ71R` |

---

## Security Notes

- The admin route must not be linked from the public UI
- All diagnostic tools and audit logs are confined to `#/admin`
- No sensitive data may be logged to the browser console in production
- CSP headers enforced via nginx configuration

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — drone-showcase

**Application:** drone-showcase
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd drone-showcase
pnpm install
pnpm run dev        # http://localhost:5173
```

```bash
pnpm run build      # TypeScript compile + Vite bundle → dist/
```


---

## Docker Deployment

### Build

```bash
# From monorepo root
docker-compose -f docker-compose-all-apps.yml build drone-showcase
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up drone-showcase
# App available at http://localhost:5173
```

### All services

```bash
docker-compose -f docker-compose-all-apps.yml up
# Gateway: http://localhost:8080
```

---

## Dockerfile

Multi-stage build pattern:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
```

---

## Environment Variables

Create `.env` (never commit):

```bash
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PASSWORD=[REDACTED_CREDENTIAL]
VITE_GA_ID=G-FKXTELQ71R
```

---

## Health Check

```bash
curl http://localhost:5173/health
# → healthy
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `pnpm install` fails | `rm -rf node_modules pnpm-lock.yaml && npm install --legacy-peer-deps` |
| Vite memory error | `NODE_OPTIONS=--max-old-space-size=4096 pnpm run build` |
| Port 5173 in use | Change port mapping in `docker-compose-all-apps.yml` |
| Blank page in Docker | Check `nginx.conf` — ensure `try_files $uri $uri/ /index.html` |

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Drone Showcase
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Drone Showcase**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Drone Showcase** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

**In scope:**
- All functional UI components and user flows
- Authentication and authorisation (where applicable)
- Data presentation, form handling, and export features
- Admin section and audit logging (where applicable)

**Out of scope:**
- Backend database administration
- Third-party service configuration
- Network infrastructure

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| TUC | Techbridge University College |
| SPA | Single-Page Application |
| SRS | Software Requirements Specification |
| ARIA | Accessible Rich Internet Applications |
| JWT | JSON Web Token |
| CI/CD | Continuous Integration / Continuous Deployment |
| PWA | Progressive Web Application |

### 1.4 References

- SHARED-STANDARDS.md â€” TUC Canonical AI Governance Layer
- CLAUDE.md â€” Audit & Analysis Agent Constitution
- GEMINI.md â€” Execution Agent Constitution
- IEEE 29148-2018 â€” Systems and Software Engineering Requirements
- TUC Refresh Directive: <https://ai-tools.aucdt.edu.gh/refresh>

### 1.5 Overview

Section 2 describes the overall product context. Section 3 lists system features. Section 4 covers external interfaces. Section 5 defines non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

**Drone Showcase** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Core institutional utility functionality

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| Student | Enrolled TUC students using the utility | Standard |
| Staff | Academic and administrative personnel | Elevated |
| Administrator | System admins with full configuration access | Full (#/admin) |
| Public | Unauthenticated visitors (where applicable) | Read-only |

### 2.4 Operating Environment

- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Device:** Desktop (primary), tablet (responsive), mobile (responsive)
- **Network:** TUC campus network or internet-connected
- **Container:** Docker (nginx:alpine), port 80 internal / mapped externally
- **Gateway:** http://localhost:8080 (development)

### 2.5 Design and Implementation Constraints

- **React version:** Exactly 19.2.5 â€” locked, no exceptions
- **Build tool:** Vite 7.3.1
- **Package manager:** pnpm (preferred), npm (fallback)
- **Styling:** Tailwind CSS 4.x with TUC design tokens
- **Accessibility:** WCAG 2.1 AA minimum; 100% ARIA coverage on interactive elements
- **Branding:** TUC colour palette (Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`)
- **Fonts:** Playfair Display (titles), Bebas Neue (display), Cormorant Garamond / Inter (body)

### 2.6 Assumptions and Dependencies

- TUC Auth API available at `http://localhost:5000/api/auth/*` (when auth required)
- Mail API at `https://portal.aucdt.edu.gh` (live â€” do not change URL)
- Docker and Docker Compose available in deployment environment
- Google Analytics tag G-FKXTELQ71R injected via `index.html`

---

## 3. System Features (Functional Requirements)

### 3.1 Core Application Shell

**FR-001** The application shall render without errors in all supported browsers.
**FR-002** The application shall display a loading state during async operations.
**FR-003** The application shall display a meaningful error state on API failure with retry option.
**FR-004** The application shall display an empty state when no data is available.

### 3.2 Navigation and Routing

**FR-010** The application shall provide client-side routing without full page reloads.
**FR-011** All navigation links shall be functional and lead to valid routes.
**FR-012** The application shall handle 404 routes gracefully with a fallback page.

### 3.3 Accessibility

**FR-020** All interactive elements shall have ARIA labels or descriptive text.
**FR-021** The application shall be fully navigable via keyboard alone.
**FR-022** Focus indicators shall be visible on all focusable elements.
**FR-023** Colour contrast shall meet WCAG 2.1 AA standards (4.5:1 normal text, 3:1 large).

### 3.4 Theme Support

**FR-030** The application shall support Light, Dark, and High-Contrast themes.
**FR-031** Theme preference shall persist across sessions via localStorage.

### 3.5 Admin Section (where applicable)

**FR-040** The application shall provide a password-protected `#/admin` route.
**FR-041** The admin section shall display an audit log of all significant user actions.
**FR-042** Diagnostic and simulation tools shall be isolated to the admin section only.

---

## 4. External Interface Requirements

### 4.1 User Interface

- Responsive layout: 320px (mobile) â†’ 1920px (desktop)
- TUC branding applied consistently (colours, typography, logo)
- No broken links or dead UI elements

### 4.2 Software Interfaces

| Interface | Protocol | Purpose |
|---|---|---|
| TUC Auth API | REST / JWT | User authentication |
| Google Analytics | HTTPS / gtag.js | Usage tracking |
| TUC Mail API | HTTPS / POST | Email notifications |

### 4.3 Communication Interfaces

- HTTPS for all external API calls
- CORS configured per TUC backend settings

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 2 seconds on 10 Mbps connection
- Chart/component render: < 100ms
- Bundle size: monitored with source-map-explorer; target < 500 KB gzipped

### 5.2 Reliability

- Application uptime target: 99.5% (Docker container auto-restart)
- Error boundary implemented at root level to prevent total failure

### 5.3 Security

- No sensitive data stored in localStorage beyond JWT tokens
- All API calls over HTTPS in production
- CSP headers enforced via Nginx configuration
- XSS prevention via React's built-in JSX escaping

### 5.4 Maintainability

- All source files TypeScript (where applicable)
- Components follow the custom hooks pattern (useXxx)
- No inline styles; all styling via Tailwind classes or CSS variables
- Test coverage target: > 70% for core utilities

### 5.5 Portability

- Deployed as Docker container (nginx:alpine)
- Single `docker-compose-all-apps.yml` entry
- Environment variables via `.env` files (VITE_ prefix)

---

## 6. Compliance

| Requirement | Status |
|---|---|
| React 19.2.5 exact version | âœ… Compliant |
| TUC branding applied | âœ… Compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âœ… Compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1
Build output: dist/
Docker: nginx:alpine
Network: aucdt-network (172.20.0.0/16)
CI/CD: Bitbucket Pipelines
```

---


---

## 8. Diagrams

### 8.1 System Architecture

![System Architecture](architecture.svg)

### 8.2 Data Flow

![Data Flow](dataflow.svg)

---

*Generated by Phase 1b SRS Generator â€” TUC Refresh Directive*
*Document version 3.0.0 â€” 2026-03-07*

```

### FILE: docs/TESTING.md
```md
# Testing Guide — drone-showcase

**Application:** drone-showcase
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd drone-showcase
pnpm install           # ensure devDeps installed
pnpm test              # run unit tests (watch mode)
pnpm test:coverage     # coverage report → coverage/
pnpm test:ui           # Vitest UI at http://localhost:51204
pnpm test:e2e          # E2E stubs (node environment)
```

---

## Test Structure

```
src/
  __tests__/
    setup.ts            # @testing-library/jest-dom import
    App.test.tsx        # Root component smoke tests
    App.e2e.ts          # E2E stub (extend with Playwright)
vitest.config.ts        # Unit test config (jsdom)
vitest.e2e.config.ts    # E2E config (node)
```

---

## Coverage Targets (TUC Standard)

| Metric | Target |
|---|---|
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |
| Statements | ≥ 70% |

---

## Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## E2E with Playwright (Recommended)

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install chromium

# Run E2E
npx playwright test
```

Extend `src/__tests__/App.e2e.ts` with Playwright page assertions once the app is running.

---

## Admin Section Test Dashboard

Access at `http://localhost:5173/#/admin` → Test Runner tab.

The diagnostic panel provides a manual smoke test runner for verifying core user flows
without leaving the browser.

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: index.css
```css
@import "tailwindcss";


```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Drone Showcase | Techbridge University College" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Drone Showcase | Techbridge University College" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Drone Showcase | Techbridge University College</title>

    <!-- TailwindCSS -->
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />

    <style>
      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
      }

      #root {
        min-height: 100vh;
      }
    </style>

    <script type="module" src="./src/index.tsx"></script>
  
    <style id="tuc-splash-styles">
      body { background-color: #0F0C07 !important; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: serif; overflow: hidden; }
      .tuc-splash { text-align: center; border: 1px solid rgba(200,168,75,0.2); padding: 60px; background: #141210; position: relative; }
      .tuc-splash::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #C8A84B; }
      .tuc-logo { color: #C8A84B; font-size: 3rem; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; display: block; }
      .tuc-status { color: #D4C4A0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.4em; font-size: 0.7rem; opacity: 0.6; }
      .tuc-loading { margin-top: 30px; height: 1px; width: 100px; background: rgba(200,168,75,0.2); margin-left: auto; margin-right: auto; position: relative; overflow: hidden; }
      .tuc-loading::after { content: ""; position: absolute; left: -100%; width: 50%; height: 100%; background: #C8A84B; animation: tuc-load 2s infinite; }
      @keyframes tuc-load { to { left: 150%; } }
    </style>
</head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    
    <div id="root">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">drone showcase</div>
        <div class="tuc-loading"></div>
      </div>
    </div>

  </body>
</html>

```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package.json
```json
{
  "packageManager": "pnpm@10.30.1",
  "name": "drone-showcase",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@tailwindcss/vite": "^4.2.1",
    "@testing-library/dom": "^10.4.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^13.5.0",
    "lucide-react": "^0.400.0",
    "react": "19.2.5",
    "react-app-polyfill": "^3.0.0",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.1.0",
    "tailwindcss": "^4.2.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "dev": "vite",
    "preview": "vite preview",
    "serve": "serve -s dist -l 3000",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.5",
    "@vitejs/plugin-react": "^5.1.4",
    "@vitest/coverage-v8": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "jsdom": "^26.1.0",
    "serve": "14.2.5",
    "typescript": "^5.7.2",
    "vite": "7.3.1",
    "vitest": "^3.0.0"
  }
}

```

### FILE: README.md
```md
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

```

### FILE: src/App.css
```css
.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

```

### FILE: src/App.test.js
```javascript
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

```

### FILE: src/App.tsx
```typescript
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';

// Configuration constants
const MAX_DRONES = 1000;
const DISPLAY_DURATION = 45000; // 45 seconds
const JITTER_AMOUNT = 5;
const POINTS_PER_LENGTH = 500;
const CULMINATION_PHASE_DUR = 5000; // 5 seconds

// Colour palette
const COLORS = {
  indigoSky: '#1a202c',
  warmGold: '#FFD700',
  regalPurple: '#A020F0',
  panAfricanRed: '#EF3340',
  panAfricanGreen: '#009732',
  pureWhite: '#FFFFFF'
};

// Greek letters array
const GREEK_LETTERS_ORDER = [
  "alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta",
  "iota", "kappa", "lambda", "mu", "nu", "xi", "omicron", "pi",
  "rho", "sigma", "tau", "upsilon", "phi", "chi", "psi", "omega"
];

// Africa outline points
const AFRICA_OUTLINE_POINTS = [
  {x: 0.50, y: 0.05, color: COLORS.panAfricanGreen}, 
  {x: 0.60, y: 0.07, color: COLORS.panAfricanGreen},
  {x: 0.70, y: 0.12, color: COLORS.panAfricanRed},
  {x: 0.78, y: 0.18, color: COLORS.panAfricanRed},
  {x: 0.85, y: 0.25, color: COLORS.panAfricanRed},
  {x: 0.88, y: 0.35, color: COLORS.panAfricanRed},
  {x: 0.86, y: 0.45, color: COLORS.panAfricanGreen},
  {x: 0.82, y: 0.55, color: COLORS.panAfricanGreen},
  {x: 0.78, y: 0.65, color: COLORS.panAfricanGreen},
  {x: 0.75, y: 0.75, color: COLORS.warmGold},
  {x: 0.70, y: 0.85, color: COLORS.warmGold},
  {x: 0.60, y: 0.95, color: COLORS.warmGold},
  {x: 0.50, y: 0.92, color: COLORS.panAfricanRed},
  {x: 0.40, y: 0.85, color: COLORS.panAfricanRed},
  {x: 0.35, y: 0.75, color: COLORS.panAfricanRed},
  {x: 0.30, y: 0.65, color: COLORS.warmGold},
  {x: 0.28, y: 0.58, color: COLORS.warmGold},
  {x: 0.25, y: 0.50, color: COLORS.warmGold},
  {x: 0.20, y: 0.45, color: COLORS.panAfricanGreen},
  {x: 0.15, y: 0.38, color: COLORS.panAfricanGreen},
  {x: 0.10, y: 0.30, color: COLORS.panAfricanGreen},
  {x: 0.15, y: 0.20, color: COLORS.panAfricanRed},
  {x: 0.20, y: 0.12, color: COLORS.panAfricanRed},
  {x: 0.30, y: 0.08, color: COLORS.panAfricanRed}
];

// Africa shape segments
const AFRICA_SHAPE_SEGMENTS = (() => {
  const segments = [];
  for (let i = 0; i < AFRICA_OUTLINE_POINTS.length; i++) {
    const p1 = AFRICA_OUTLINE_POINTS[i];
    const p2 = AFRICA_OUTLINE_POINTS[(i + 1) % AFRICA_OUTLINE_POINTS.length];
    segments.push({ p1, p2, part: 'coast', color: p1.color });
  }
  return segments;
})();

// Greek letter shapes
const GREEK_LETTER_SHAPES_DATA = {
  "alpha": [
    { p1: {x: 0.5, y: 0, part: 'main'}, p2: {x: 0, y: 1, part: 'main'} },
    { p1: {x: 0.5, y: 0, part: 'main'}, p2: {x: 1, y: 1, part: 'main'} },
    { p1: {x: 0.25, y: 0.65, part: 'crossbar'}, p2: {x: 0.75, y: 0.65, part: 'crossbar'} }
  ],
  "beta": [
    { p1: {x: 0, y: 0, part: 'stem'}, p2: {x: 0, y: 1, part: 'stem'} },
    { p1: {x: 0.2, y: 0.4, part: 'loop1'}, p2: {x: 0, y: 0.4, part: 'loop1'} },
    { p1: {x: 0.2, y: 1, part: 'loop2'}, p2: {x: 0, y: 1, part: 'loop2'} }
  ],
  "gamma": [
    { p1: {x: 0, y: 0, part: 'top'}, p2: {x: 1, y: 0, part: 'top'} },
    { p1: {x: 0, y: 0, part: 'stem'}, p2: {x: 0, y: 1, part: 'stem'} }
  ],
  "delta": [
    { p1: {x: 0.5, y: 0, part: 'main'}, p2: {x: 0, y: 1, part: 'main'} },
    { p1: {x: 0, y: 1, part: 'main'}, p2: {x: 1, y: 1, part: 'main'} },
    { p1: {x: 1, y: 1, part: 'main'}, p2: {x: 0.5, y: 0, part: 'main'} }
  ],
  "epsilon": [
    { p1: {x: 0, y: 0, part: 'stem'}, p2: {x: 0, y: 1, part: 'stem'} },
    { p1: {x: 0, y: 0, part: 'top'}, p2: {x: 1, y: 0, part: 'top'} },
    { p1: {x: 0, y: 0.5, part: 'middle'}, p2: {x: 0.7, y: 0.5, part: 'middle'} },
    { p1: {x: 0, y: 1, part: 'bottom'}, p2: {x: 1, y: 1, part: 'bottom'} }
  ],
  "zeta": [
    { p1: {x: 0, y: 0, part: 'top'}, p2: {x: 1, y: 0, part: 'top'} },
    { p1: {x: 0, y: 1, part: 'bottom'}, p2: {x: 1, y: 1, part: 'bottom'} },
    { p1: {x: 1, y: 0, part: 'diagonal'}, p2: {x: 0, y: 1, part: 'diagonal'} }
  ],
  "eta": [
    { p1: {x: 0, y: 0, part: 'left'}, p2: {x: 0, y: 1, part: 'left'} },
    { p1: {x: 1, y: 0, part: 'right'}, p2: {x: 1, y: 1, part: 'right'} },
    { p1: {x: 0, y: 0.5, part: 'crossbar'}, p2: {x: 1, y: 0.5, part: 'crossbar'} }
  ],
  "theta": [
    { p1: {x: 0.1, y: 0.5, part: 'crossbar'}, p2: {x: 0.9, y: 0.5, part: 'crossbar'} }
  ],
  "iota": [
    { p1: {x: 0.5, y: 0, part: 'main'}, p2: {x: 0.5, y: 1, part: 'main'} }
  ],
  "kappa": [
    { p1: {x: 0, y: 0, part: 'stem'}, p2: {x: 0, y: 1, part: 'stem'} },
    { p1: {x: 0, y: 0.5, part: 'diagonal1'}, p2: {x: 1, y: 0, part: 'diagonal1'} },
    { p1: {x: 0, y: 0.5, part: 'diagonal2'}, p2: {x: 1, y: 1, part: 'diagonal2'} }
  ],
  "lambda": [
    { p1: {x: 0, y: 1, part: 'left'}, p2: {x: 0.5, y: 0, part: 'left'} },
    { p1: {x: 1, y: 1, part: 'right'}, p2: {x: 0.5, y: 0, part: 'right'} }
  ],
  "mu": [
    { p1: {x: 0, y: 0, part: 'left_stem'}, p2: {x: 0, y: 1, part: 'left_stem'} },
    { p1: {x: 1, y: 0, part: 'right_stem'}, p2: {x: 1, y: 1, part: 'right_stem'} },
    { p1: {x: 0, y: 0, part: 'diag1'}, p2: {x: 0.5, y: 0.7, part: 'diag1'} },
    { p1: {x: 1, y: 0, part: 'diag2'}, p2: {x: 0.5, y: 0.7, part: 'diag2'} }
  ],
  "nu": [
    { p1: {x: 0, y: 0, part: 'left_stem'}, p2: {x: 0, y: 1, part: 'left_st极'} },
    { p1: {x: 1, y: 0, part: 'right_stem'}, p2: {x: 1, y: 1, part: 'right_stem'} },
    { p1: {x: 0, y: 0, part: 'diagonal'}, p2: {x: 1, y: 1, part: 'diagonal'} }
  ],
  "xi": [
    { p1: {x: 0, y: 0, part: 'top'}, p2: {x: 1, y: 0, part: 'top'} },
    { p1: {x: 0, y: 0.5, part: 'middle'}, p2: {x: 1, y: 0.5, part: 'middle'} },
    { p1: {x: 0, y: 1, part: 'bottom'}, p2: {x: 1, y: 1, part: 'bottom'} }
  ],
  "omicron": [
    { p1: {x: 0.5, y: 0.1, part: 'circle'}, p2: {x: 0.5, y: 0.9, part: 'circle'} }
  ],
  "pi": [
    { p1: {x: 0, y: 0, part: 'top'}, p2: {x: 1, y: 0, part: 'top'} },
    { p1: {x: 0, y: 0, part: 'left_stem'}, p2: {x: 0, y: 1, part: 'left_stem'} },
    { p1: {x: 1, y: 0, part: 'right_stem'}, p2: {x: 1, y: 1, part: 'right_stem'} }
  ],
  "rho": [
    { p1: {x: 0, y: 0, part: 'stem'}, p2: {x: 0, y: 1, part: 'stem'} },
    { p1: {x: 0, y: 0.5, part: 'loop'}, p2: {x: 0.25, y: 0, part: 'loop'} }
  ],
  "sigma": [
    { p1: {x: 0.7, y: 0.0}, p2: {x: 0.3, y: 0.0, part: 'curve1'} },
    { p1: {x: 0.3, y: 1.0}, p2: {x: 0.7, y: 1.0, part: 'curve2'} },
    { p1: {x: 0.5, y: 0.5, part: 'main'}, p2: {x: 0.7, y: 0.2, part: 'main'} },
    { p1: {x: 0.5, y: 0.5, part: 'main'}, p2: {x: 0.3, y: 0.8, part: 'main'} }
  ],
  "tau": [
    { p1: {x: 0, y: 0, part: 'top'}, p2: {x: 1, y: 0, part: 'top'} },
    { p1: {x: 0.5, y: 0, part: 'stem'}, p2: {x: 0.5, y: 1, part: 'stem'} }
  ],
  "upsilon": [
    { p1: {x: 0, y: 0, part: 'left_arm'}, p2: {x: 0.5, y: 1, part: 'left_arm'} },
    { p1: {x: 1, y: 0, part: 'right_arm'}, p2: {x: 0.5, y: 1, part: 'right_arm'} }
  ],
  "phi": [
    { p1: {x: 0.5, y: 0, part: 'stem'}, p2: {x: 0.5, y: 1, part: 'stem'} }
  ],
  "chi": [
    { p1: {x: 0, y: 0, part: 'diag1'}, p2: {x: 1, y: 1, part: 'diag1'} },
    { p1: {x: 1, y: 0, part: 'diag2'}, p2: {x: 0, y: 1, part: 'diag2'} }
  ],
  "psi": [
    { p1: {x: 0, y: 0, part: 'left_arm'}, p2: {x: 0.5, y: 0.5, part: 'left_arm'} },
    { p1: {x: 1, y: 0, part: 'right_arm'}, p2: {x: 0.5, y: 0.5, part: 'right_arm'} },
    { p1: {x: 0.5, y: 0.5, part: 'stem'}, p2: {x: 0.5, y: 1, part: 'stem'} }
  ],
  "omega": [
    { p1: {x: 0.3, y: 0.3, part: 'main'}, p2: {x: 0.7, y: 0.3, part: 'main'} },
    { p1: {x: 0.4, y: 1, part: 'feet'}, p2: {x: 0.6, y: 1, part: 'feet'} },
    { p1: {x: 0.4, y: 1}, p2: {x: 0.4, y: 0.7}, part: 'feet' },
    { p1: {x: 0.6, y: 1}, p2: {x: 0.6, y: 0.7}, part: 'feet' }
  ]
};

// Helper function for generating shape points
const generateShapePoints = (shapeSegments, scaleX, scaleY, offsetX, offsetY) => {
  const points = [];
  
  for (const seg of shapeSegments) {
    const dx = seg.p2.x - seg.p1.x;
    const dy = seg.p2.y - seg.p1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const numPoints = Math.max(1, Math.round(length * POINTS_PER_LENGTH));
    
    for (let i = 0; i < numPoints; i++) {
      const t = i / numPoints;
      points.push({
        x: seg.p1.x + dx * t,
        y: seg.p1.y + dy * t,
        color: seg.color || COLORS.warmGold,
        part: seg.part || 'main'
      });
    }
  }
  
  return points.map(p => ({
    x: p.x * scaleX + offsetX,
    y: p.y * scaleY + offsetY,
    color: p.color,
    part: p.part
  }));
};

// Drone class
class Drone {
  constructor(startX, startY, targets, color, africanTextColor, size = 3) {
    this.x = startX;
    this.y = startY;
    this.targets = targets; // { greek, africa, text }
    this.color = color;
    this.africanTextColor = africanTextColor;
    this.size = size;
    this.alpha = 0;
    this.baseAlpha = 1;
    this.drawColor = COLORS.pureWhite;
    this.currentTarget = 'scatter';
  }

  lerp(start, end, t) {
    return start + (end - start) * t;
  }

  interpolateColor(color1, color2, factor) {
    if (!color1 || !color2) return COLORS.pureWhite;
    
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };
    
    const rgbToHex = (r, g, b) => {
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, '0')}`;
    };
    
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    const r = Math.round(rgb1[0] + factor * (rgb2[0] - rgb1[0]));
    const g = Math.round(rgb1[1] + factor * (rgb2[1] - rgb1[1]));
    const b = Math.round(rgb1[2] + factor * (rgb2[2] - rgb1[2]));
    
    return rgbToHex(r, g, b);
  }

  update(elapsed) {
    // Phase timing
    const SCATTER_DUR = 10000;
    const OUTLINE_HOLD_DUR = 2000;
    const TEXT_FORMATION_DUR = 10000;
    const TEXT_HOLD_DUR = 2000;
    const TRANSITION_DUR = 16000;
    
    // Phase calculations
    if (elapsed < SCATTER_DUR) {
      // Phase 1: Scatter to Africa outline
      const t = elapsed / SCATTER_DUR;
      this.x = this.lerp(this.x, this.targets.africa.x, t);
      this.y = this.lerp(this.y, this.targets.africa.y, t);
      this.alpha = this.lerp(0, this.baseAlpha, t);
      this.drawColor = this.interpolateColor(COLORS.pureWhite, this.targets.africa.color, t);
      this.currentTarget = 'africa';
    } 
    else if (elapsed < SCATTER_DUR + OUTLINE_HOLD_DUR) {
      // Phase 2: Hold outline
      this.currentTarget = 'africa';
      this.drawColor = this.targets.africa.color;
    }
    else if (elapsed < SCATTER_DUR + OUTLINE_HOLD_DUR + TEXT_FORMATION_DUR) {
      // Phase 3: Form text
      const t = (elapsed - SCATTER_DUR - OUTLINE_HOLD_DUR) / TEXT_FORMATION_DUR;
      this.x = this.lerp(this.targets.africa.x, this.targets.text.x, t);
      this.y = this.lerp(this.targets.africa.y, this.targets.text.y, t);
      this.drawColor = this.interpolateColor(this.targets.africa.color, this.africanTextColor, t);
      this.currentTarget = 'text';
    }
    else if (elapsed < SCATTER_DUR + OUTLINE_HOLD极 + TEXT_FORMATION_DUR + TEXT_HOLD_DUR) {
      // Phase 4: Hold text
      this.currentTarget = 'text';
      this.drawColor = this.africanTextColor;
    }
    else if (elapsed < DISPLAY_DURATION - CULMINATION_PHASE_DUR) {
      // Phase 5: Transition to Greek letter
      const t = (elapsed - SCATTER_DUR - OUTLINE_HOLD_DUR - TEXT_FORMATION_DUR - TEXT_HOLD_DUR) / TRANSITION_DUR;
      
      if (t < 0.25) {
        // Transition to white
        this.drawColor = this.interpolateColor(this.africanTextColor, COLORS.pureWhite, t * 4);
      } else {
        // Transition to target color
        this.drawColor = this.interpolateColor(COLORS.pureWhite, this.color, (t - 0.25) * 4 / 3);
      }
      
      this.x = this.lerp(this.targets.text.x, this.targets.greek.x, t);
      this.y = this.lerp(this.targets.text.y, this.targets.greek.y, t);
      this.currentTarget = 'greek';
    }
    else {
      // Phase 6: Culmination
      const t = (elapsed - (DISPLAY_DURATION - CULMINATION_PHASE_DUR)) / CULMINATION_PHASE_DUR;
      
      if (t < 0.5) {
        this.size = 3 + 4 * t;
        this.alpha = Math.min(1, this.baseAlpha * (1 + t));
      } else {
        this.size = 3;
        this.alpha = this.baseAlpha * (1 - (t - 0.5) * 2);
      }
      this.drawColor = t < 0.5 ? COLORS.warmGold : this.color;
    }
  }

  draw(ctx) {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    
    if (!this.drawColor) this.drawColor = COLORS.pureWhite;
    
    try {
      const [r, g, b] = this.drawColor.match(/\w\w/g).map(x => parseInt(x, 16));
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
      ctx.fill();
    } catch (e) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.fill();
    }
  }
}

// DroneDisplay component
const DroneDisplay = () => {
  const canvasRef = useRef(null);
  const [drones, setDrones] = useState([]);
  const animationRef = useRef({ 
    startTime: 0, 
    frameId: null, 
    letterIndex: 0 
  });
  const containerRef = useRef(null);

  // Africa text shapes
  const AFRICA_TEXT_SHAPES_DATA = useMemo(() => ({
    "A": [
      {p1: {x: 0.0, y: 1.0}, p2: {x: 0.5, y: 0.0}}, 
      {p1: {x: 0.5, y: 0.0}, p2: {x: 1.0, y: 1.0}},
      {p1: {x: 0.2, y: 0.6}, p2: {x: 0.8, y: 0.6}}
    ],
    "F": [
      {p1: {x: 0.0, y: 0.0}, p2: {x: 1.0, y: 0.0}}, 
      {p1: {x: 0.0, y: 0.0}, p2: {x: 0.0, y: 1.0}},
      {p1: {x: 0.0, y: 0.5}, p2: {x: 0.7, y: 0.5}}
    ],
    "R": [
      {p1: {x: 0.0, y: 0.0}, p2: {x: 0.0, y: 1.0}}, 
      {p1: {x: 0.0, y: 0.0}, p2: {x: 0.7, y: 0.0}},
      {p1: {x: 0.7, y: 0.0}, p2: {x: 1.0, y: 0.3}}, 
      {p1: {x: 1.0, y: 0.3}, p2: {x: 0.7, y: 0.5}},
      {p1: {x: 0.7, y: 0.5}, p2: {x: 0.0, y: 0.5}}, 
      {p1: {x: 0.5, y: 0.5}, p2: {x: 1.0, y: 1.0}}
    ],
    "I": [
      {p1: {x: 0.0, y: 0.0}, p2: {x: 1.0, y: 0.0}}, 
      {p1: {x: 0.5, y: 0.0}, p2: {x: 0.5, y: 1.0}},
      {p1: {x: 0.0, y: 1.0}, p2: {x: 1.0, y: 1.0}}
    ],
    "C": [
      {p1: {x: 0.7, y: 0.2}, p2: {x: 0.3, y: 0.2}}, 
      {p1: {x: 0.3, y: 0.2}, p2: {x: 0.3, y: 0.8}},
      {p1: {x: 0.3, y: 0.8}, p2: {x: 0.7, y: 0.8}}
    ]
  }), []);

  // Initialize drones
  const initDrones = useCallback((letterIndex, width, height) => {
    if (!width || !height) return;
    
    // Calculate Africa dimensions
    const africaBounds = AFRICA_OUTLINE_POINTS.reduce((acc, p) => ({
      minX: Math.min(acc.minX, p.x),
      maxX: Math.max(acc.maxX, p.x),
      minY: Math.min(acc.minY, p.y),
      maxY: Math.max(acc.maxY, p.y)
    }), { 
      minX: Infinity, 
      maxX: -Infinity, 
      minY: Infinity, 
      maxY: -Infinity 
    });
    
    const africaScale = Math.min(width, height) * 0.6;
    const africaOffsetX = (width - africaScale * (africaBounds.maxX - africaBounds.minX)) / 2;
    const africaOffsetY = (height - africaScale * (africaBounds.maxY - africaBounds.minY)) / 2;
    
    const africaPoints = generateShapePoints(
      AFRICA_SHAPE_SEGMENTS,
      africaScale,
      africaScale,
      africaOffsetX - africaBounds.minX * africaScale,
      africaOffsetY - africaBounds.minY * africaScale
    );
    
    // Calculate Greek letter dimensions
    const letterName = GREEK_LETTERS_ORDER[letterIndex];
    const letterSegments = GREEK_LETTER_SHAPES_DATA[letterName];
    
    const letterBounds = letterSegments.reduce((acc, seg) => ({
      minX: Math.min(acc.minX, seg.p1.x, seg.p2.x),
      maxX: Math.max(acc.maxX, seg.p1.x, seg.p2.x),
      minY: Math.min(acc.minY, seg.p1.y, seg.p2.y),
      maxY: Math.max(acc.maxY, seg.p1.y, seg.p2.y)
    }), { 
      minX: Infinity, 
      maxX: -Infinity, 
      minY: Infinity, 
      maxY: -Infinity 
    });
    
    const letterScale = Math.min(width, height) * 0.7;
    const letterOffsetX = (width - letterScale * (letterBounds.maxX - letterBounds.minX)) / 2;
    const letterOffsetY = (height - letterScale * (letterBounds.maxY - letterBounds.minY)) / 2;
    
    const letterPoints = generateShapePoints(
      letterSegments,
      letterScale,
      letterScale,
      letterOffsetX - letterBounds.minX * letterScale,
      letterOffsetY - letterBounds.minY * letterScale
    );
    
    // Generate Africa text points
    const textLetters = "AFRICA";
    const textPoints = [];
    const textColors = [COLORS.panAfricanRed, COLORS.warmGold, COLORS.panAfricanGreen];
    const charWidth = africaScale * 0.15;
    const charHeight = africaScale * 0.3;
    const textOffsetX = africaOffsetX + africaScale * 0.2;
    const textOffsetY = africaOffsetY + africaScale * 0.4;
    
    for (let i = 0; i < textLetters.length; i++) {
      const letter = textLetters[i];
      const points = generateShapePoints(
        AFRICA_TEXT_SHAPES_DATA[letter] || [],
        charWidth,
        charHeight,
        textOffsetX + i * charWidth * 1.1,
        textOffsetY
      );
      points.forEach(p => p.color = textColors[i % textColors.length]);
      textPoints.push(...points);
    }
    
    // Create drones
    const newDrones = [];
    const droneCount = Math.min(MAX_DRONES, Math.floor(width * height / 500));
    
    for (let i = 0; i < droneCount; i++) {
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      
      const africaIndex = Math.floor(i * africaPoints.length / droneCount) % africaPoints.length;
      const letterIndex = Math.floor(i * letterPoints.length / droneCount) % letterPoints.length;
      const textIndex = Math.floor(i * textPoints.length / droneCount) % textPoints.length;
      
      const targets = {
        africa: africaPoints[africaIndex],
        greek: {
          ...letterPoints[letterIndex],
          x: letterPoints[letterIndex].x + (Math.random() - 0.5) * JITTER_AMOUNT,
          y: letterPoints[letterIndex].y + (Math.random() - 0.5) * JITTER_AMOUNT
        },
        text: textPoints[textIndex]
      };
      
      newDrones.push(new Drone(
        startX,
        startY,
        targets,
        letterPoints[letterIndex].color,
        textPoints[textIndex].color
      ));
    }
    
    setDrones(newDrones);
    animationRef.current.startTime = performance.now();
  }, [AFRICA_TEXT_SHAPES_DATA]);

  // Animation loop
  const animate = useCallback(() => {
    const now = performance.now();
    const elapsed = now - animationRef.current.startTime;
    const canvas = canvasRef.current;
    
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = COLORS.indigoSky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drones.forEach(drone => {
      drone.update(elapsed);
      drone.draw(ctx);
    });
    
    // Continue animation or restart
    if (elapsed < DISPLAY_DURATION + 1000) {
      animationRef.current.frameId = requestAnimationFrame(animate);
    } else {
      // Move to next letter
      animationRef.current.letterIndex = (animationRef.current.letterIndex + 1) % GREEK_LETTERS_ORDER.length;
      initDrones(animationRef.current.letterIndex, canvas.width, canvas.height);
    }
  }, [drones, initDrones]);
  
  // Handle resize
  useEffect(() => {
    const currentAnimationRef = animationRef.current;
    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0 && canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        initDrones(currentAnimationRef.letterIndex, width, height);
      }
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      // Initial size
      const { width, height } = containerRef.current.getBoundingClientRect();
      if (width > 0 && height > 0 && canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        initDrones(currentAnimationRef.letterIndex, width, height);
      }
    }
    
    return () => {
      resizeObserver.disconnect();
      if (currentAnimationRef.frameId) {
        cancelAnimationFrame(currentAnimationRef.frameId);
      }
    };
  }, [initDrones]);
  
  // Start animation
  useEffect(() => {
    const currentAnimationRef = animationRef.current;
    
    if (drones.length > 0 && !currentAnimationRef.frameId) {
      currentAnimationRef.frameId = requestAnimationFrame(animate);
    }
    
    return () => {
      if (currentAnimationRef.frameId) {
        cancelAnimationFrame(currentAnimationRef.frameId);
      }
    };
  }, [drones, animate]);
  
  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px]">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
    </div>
  );
};

// Main App component
const App = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-[#28282B] text-white font-sans">
      {/* Header */}
      <header className="w-full bg-[#3D2B1F] shadow-lg py-4 px-6 md:px-12 flex justify-between items-center rounded-b-xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#FFD700]">
          Drone Display Showcase
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#demo" className="text-white hover:text-[#FFD700] transition-colors">Demo</a></li>
            <li><a href="#about" className="text-white hover:text-[#FFD700] transition-colors">About</a></li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto p-6 md:p-12">
        <section id="introduction" className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-[#FFD700] mb-6">Experience the Art of Drone Choreography</h2>
          <p className="text-lg text-white leading-relaxed">
            Welcome to a captivating demonstration of drone light show technology. This application showcases a sophisticated algorithm that choreographs hundreds of virtual drones to form intricate shapes and patterns in the night sky. Witness the seamless transitions from abstract scatterings to meaningful symbols.
          </p>
        </section>

        <section id="demo" className="mb-12">
          <h2 className="text-3xl font-bold text-[#009732] mb-6 text-center">Interactive Demo: The Greek Alphabet & Africa</h2>
          <div className="bg-[#1a202c] p-6 rounded-xl shadow-xl border-2 border-[#FFD700] min-h-[500px]">
            <DroneDisplay />
          </div>
          <p className="text-center text-white mt-6 text-lg">
            Watch as 1000 virtual drones transition through a stunning sequence:
            Initially scattered, they first form the <strong>outline of the African continent</strong>, dynamically coloured. They then seamlessly reshape to spell out <strong>"AFRICA"</strong> within the continent. Finally, they transition into a sequence of the <strong>Greek alphabet</strong>, cycling through each letter with a vibrant culmination effect before moving to the next. The display continuously loops, presenting a new Greek letter each cycle.
          </p>
        </section>

        <section id="about" className="mb-12">
          <h2 className="text-3xl font-bold text-[#3D2B1F] mb-6 text-center">How It Works</h2>
          <div className="bg-white p-6 rounded-xl shadow-xl text-gray-800">
            <ul className="list-disc list-inside space-y-4">
              <li>
                <strong>Dynamic Formations:</strong> Each drone is programmed to move smoothly between predefined target coordinates for different shapes (African continent, "AFRICA" text, and Greek letters).
              </li>
              <li>
                <strong>Colour Transitions:</strong> Drones' colours interpolate seamlessly, reflecting the themes of each display phase (e.g., Pan-African colours for Africa, warm gold and purple for Greek letters).
              </li>
              <li>
                <strong>Responsive Canvas:</strong> The entire display scales automatically to fit your screen size, ensuring an optimal viewing experience on any device.
              </li>
              <li>
                <strong>Phased Animation:</strong> The display progresses through distinct phases:
                <ul className="list-disc list-inside ml-6 mt-2 text-sm">
                  <li>Scatter to African Outline (10 seconds)</li>
                  <li>Hold African Outline (2 seconds)</li>
                  <li>African Text Formation (10 seconds)</li>
                  <li>Hold African Text (2 seconds)</li>
                  <li>African/Text to Greek Letter Transition (16 seconds)</li>
                  <li>Culmination Burst and Fade (5 seconds)</li>
                </ul>
                This sequence totals 45 seconds before looping to the next Greek letter.
              </li>
              <li>
                <strong>Performance:</strong> Optimised for smooth animation with 1000 individual drone particles, demonstrating efficient canvas rendering techniques.
              </li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#3D2B1F] shadow-inner py-6 px-6 md:px-12 text-center text-white text-sm rounded-t-xl">
        <p>&copy; 2025 Drone Display Showcase. All rights reserved.</p>
        <p className="mt-2">Powered by advanced choreography algorithms.</p>
      </footer>
    </div>
  );
};

export default App;
```

### FILE: src/AppWithAuth.tsx
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import App from './App';

export default function AppWithAuth() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

```

### FILE: src/AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_drone_showcase';
const ACCENT   = '#0d9488';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password =[REDACTED_CREDENTIAL]
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      setError('Invalid credentials. Use admin / admin');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{background:'#fff',padding:'36px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
          <div style={{width:'38px',height:'38px',background:ACCENT,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',flexShrink:0}}>⚡</div>
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Drone Showcase</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>Sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          {error && <p style={{color:'#ef4444',fontSize:'13px',margin:'0 0 12px 0'}}>{error}</p>}
          <button
            type="submit"
            style={{width:'100%',padding:'10px',background:ACCENT,color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}
          >
            Sign In
          </button>
        </form>
        <p style={{fontSize:'11px',color:'#cbd5e1',textAlign:'center',marginTop:'16px',marginBottom:0}}>Techbridge University College &nbsp;·&nbsp; admin / admin</p>
      </div>
    </div>
  );
}

```

### FILE: src/components/ProtectedRoute.tsx
```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Verifying session…</div>
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

```

### FILE: src/contexts/AuthContext.tsx
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

interface User { id: string; username: string; role: string }
interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (u: string, p: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = [REDACTED_CREDENTIAL]
    if (!token) { setIsLoading(false); return; }
    AuthService.validateToken(token)
      .then((res: any) => {
        if (res.valid && res.user) { setIsAuthenticated(true); setUser(res.user); }
        else { AuthService.logout(); setIsAuthenticated(false); }
      })
      .catch(() => { /* backend unreachable — keep state */ })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await AuthService.login(username, password);
    if (res.success && res.user) { setIsAuthenticated(true); setUser(res.user); }
    return { success: res.success, message: res.message };
  };

  const logout = () => { AuthService.logout(); setIsAuthenticated(false); setUser(null); };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

```

### FILE: src/index.css
```css
@import "tailwindcss";

@theme {
  --color-tuc-maroon: #630f12;
  --color-tuc-gold: #ffcb05;
  --color-tuc-beige: #f5f5dc;
  --color-tuc-green: #3db54a;
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  background-color: #ffffff;
  color: #1a1a1a;
  -webkit-font-smoothing: antialiased;
}

/* TUC utility classes */
.tuc-header { background-color: #630f12; color: #ffffff; }
.tuc-accent { color: #630f12; }
.tuc-btn {
  background-color: #630f12;
  color: #ffffff;
  border-radius: 6px;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  font-family: var(--font-sans);
}
.tuc-btn:hover { background-color: #7a1318; }
.tuc-gold { color: #ffcb05; }
.tuc-bg { background-color: #630f12; }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #630f12; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #7a1318; }

```

### FILE: src/index.tsx
```typescript
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

document.getElementById('tuc-splash-styles')?.remove();

```

### FILE: src/pages/AdminPage.tsx
```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

type Tab = 'overview' | 'logs';

interface LogEntry { id: string; time: string; action: string; detail: string }

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [logs] = useState<LogEntry[]>([
    { id: '1', time: new Date().toLocaleTimeString(), action: 'SESSION_START', detail: 'Admin session initiated' },
  ]);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0f172a] text-white flex flex-col p-6 shrink-0" aria-label="Admin navigation">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-[#ffcb05] rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-sm">Drone Showcase</span>
        </div>
        <nav className="flex-1 space-y-1" role="navigation">
          {(['overview', 'logs'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t ? 'true' : 'false'}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${tab === t ? 'bg-[#ffcb05] text-[#0f172a] font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {t === 'overview' ? 'Overview' : 'Activity Log'}
            </button>
          ))}
        </nav>
        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-1 px-2">Signed in as</p>
          <p className="text-sm text-slate-300 font-medium px-2 mb-3 truncate">{user?.username || 'Admin'}</p>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 max-w-4xl" role="main">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Drone Showcase — Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Techbridge University College · Staff Portal</p>
        </header>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'React Version', value: '19.2.4', ok: true },
              { label: 'Docker', value: 'Configured', ok: true },
              { label: 'SRS', value: 'docs/SRS.md', ok: true },
              { label: 'Tests', value: 'vitest.config.ts', ok: true },
              { label: 'Auth', value: 'Active', ok: true },
              { label: 'Phase', value: 'Phase 2 Complete', ok: true },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
                <span className={`text-xs ${item.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.ok ? '✓ compliant' : '✗ gap'}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Activity Log</h2>
            </div>
            <table className="w-full text-sm" aria-label="Activity log">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Action</th>
                  <th className="px-6 py-3 text-left">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-400">{log.time}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{log.action}</td>
                    <td className="px-6 py-4 text-gray-500">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

```

### FILE: src/pages/LoginPage.tsx
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(result.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-[#630f12] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#ffcb05]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in with your TUC credentials</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username" type="text" value={username} required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your username"
              aria-label="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password" type="password" value={password} required
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your password"
              aria-label="Password"
            />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-2 px-4 bg-[#630f12] text-white font-semibold rounded-lg hover:bg-[#7a1317] focus:outline-none focus:ring-2 focus:ring-[#630f12] focus:ring-offset-2 disabled:opacity-50 transition-colors"
            aria-label={loading ? 'Signing in' : 'Sign in'}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

```

### FILE: src/reportWebVitals.js
```javascript
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

```

### FILE: src/services/AuthService.ts
```typescript
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = [REDACTED_CREDENTIAL]

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: { id: string; username: string; role: string };
}

export const AuthService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data: AuthResponse = await res.json();
      if (data.success && data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    } catch {
      return { success: false, message: 'Could not connect to TUC Auth API' };
    }
  },

  async validateToken(token: string) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch {
      return { success: false, valid: false };
    }
  },

  logout:          () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  getToken:        () => localStorage.getItem(TOKEN_KEY),
};

```

### FILE: src/setupTests.js
```javascript
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

```

### FILE: src/vite-env.d.ts
```typescript
/// <reference types="vite/client" />

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — drone-showcase
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('drone-showcase E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});

```

### FILE: src/__tests__/App.test.tsx
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});

```

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

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

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src"]
}

```

### FILE: vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom')) return 'vendor-react-dom';
              if (id.includes('react-router')) return 'vendor-router';
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
              if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';
              if (id.includes('lucide') || id.includes('heroicons')) return 'vendor-icons';
              return 'vendor';
            }
          },
        },
      },
    }
})

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — drone-showcase
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});

```

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — drone-showcase
// E2E tests use Node environment (Puppeteer / Playwright)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.e2e.{ts,tsx,js}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 10000,
  },
});

```

