# CREATION.md — Umoja React App

**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/umoja-react-app/`
**Last verified:** 2026-04-26

---

## 1. What This App Is

The Umoja React App (`umoja-react-app` v1.0.0) is a **four-pillar African-community services landing SPA** for Techbridge University College (TUC). "Umoja" (Swahili for *unity*) showcases four sister product propositions across the African development stack:

1. **UmojaAgri 🌾** — agricultural commerce: market prices, weather forecasts & pest alerts, downloadable farming guides, farmer forum.
2. **UmojaHealth 🏥** — telemedicine chat / voice / video, offline health library, nearby clinics & pharmacies.
3. **UmojaEd 📚** — e-learning & skills development, downloadable courses, certificates of completion.
4. **UmojaSoko 🛍️** — e-commerce marketplace, freelance & artisan hub, secure mobile payments.

The current build is a static placeholder/marketing surface: each route renders a heading and a bullet list of planned features. The app has no data fetching or persistence yet, but ships the full TUC auth/admin scaffolding so it can graduate into a real product without re-plumbing.

The app is **gated by a session-storage login** (`admin` / `admin`) before any view renders, then mounts an inner React Router. Notably, `umoja-react-app` ships a **second `App.js`** at the project root (alongside `src/App.tsx`) — the legacy `App.js` defines the four-pillar Umoja showcase routes (`/`, `/agri`, `/health`, `/ed`, `/soko`); the TS `src/App.tsx` is the auth-aware shell that exposes the admin dashboard. The two are intended to be merged in a future refresh phase.

The app is part of the TUC monorepo gateway and deployed via the `umoja-react-app` service in `docker-compose-all-apps.yml`.

---

## 2. Tech Stack (exact versions)

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.4** (never change) |
| DOM | react-dom | 19.2.4 |
| Build | Vite | 7.3.1 |
| React plugin | @vitejs/plugin-react | ^5.1.4 |
| Tailwind plugin | @tailwindcss/vite | ^4.2.2 |
| Tailwind | tailwindcss | ^4.2.2 |
| Language | TypeScript | ^5.7.2 |
| Routing | **react-router-dom ^6.0.0** (older than other apps in the repo, which use 7.1.0) |
| Icons | lucide-react | ^0.400.0 |
| Static server | serve | 14.2.5 |
| Unit tests | Vitest + @testing-library/react + jsdom | ^3.0.0 / ^16.3.2 / ^26.1.0 |
| Test DOM matchers | @testing-library/jest-dom | ^6.6.3 |
| User-event | @testing-library/user-event | ^14.6.1 |
| Coverage | @vitest/coverage-v8 | ^3.0.0 |
| Package manager | pnpm | 10.30.1 (declared in `packageManager`) |
| Container | node:24-alpine → nginx:alpine | — |

Note: `umoja-react-app` does NOT depend on `react-app-polyfill`, `web-vitals`, `@testing-library/dom`, or `@testing-library/user-event@13` — its `package.json` is leaner than `drone-showcase` / `english-safari` / `pdf-extractor-app`.

---

## 3. Directory Structure (verbatim)

```
umoja-react-app/
├── index.html
├── index.css
├── package.json                # name: umoja-react-app, version: 1.0.0
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── vite.config.ts              # dev port 3000, base './'
├── vitest.config.ts
├── vitest.e2e.config.ts
├── tsconfig.json
├── App.js                      # legacy four-pillar showcase (project root, NOT src/)
├── Dockerfile                  # node:24-alpine multi-stage → serve dist :4173
├── nginx.conf                  # SPA fallback /index.html, /health endpoint
├── DEPLOYMENT.md
├── public/
├── docs/
│   ├── ADMIN_GUIDE.md
│   ├── architecture.svg
│   ├── dataflow.svg
│   ├── DEPLOYMENT.md
│   ├── SRS.md
│   └── TESTING.md
└── src/
    ├── index.tsx               # createRoot + AuthGate + App
    ├── App.tsx                 # auth-aware shell with /login, /admin, /*
    ├── AuthGate.tsx            # session-storage username/password gate
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

Note the absence of `App.css`, `App.test.js`, `index.css` (in `src/`), `logo.svg`, `setupTests.js`, `reportWebVitals.js`, `vite-env.d.ts` and `AppWithAuth.tsx` — this project is structurally simpler than its siblings. There is also no `__tests__` content scaffolded under `src/__tests__` beyond the directory.

---

## 4. Provider Composition (`src/index.tsx`)

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthGate } from './AuthGate';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <AuthGate><App /></AuthGate>
  </React.StrictMode>
);
```

(`umoja-react-app/src/index.tsx` does not import `index.css`, does not call `reportWebVitals`, and does not strip `tuc-splash-styles` — diverging from the rest of the monorepo. Refresh phases should normalise this.)

---

## 5. Router (`src/App.tsx`)

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*"     element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/"      element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

So the `/*` catch-all currently routes to `AdminPage` (gated by `ProtectedRoute`). The legacy four-pillar showcase in the root-level `App.js` is intended to be wired into a `/dashboard/*` (or unprotected `/*`) route in a future refresh — but it is NOT mounted by the current TS `App.tsx`. Treat the four-pillar copy in §6 as authoritative product surface to restore.

---

## 6. Legacy Four-Pillar Showcase (`./App.js`, verbatim copy)

The project root holds `App.js` defining the original Umoja showcase. Restoration spec (when re-mounting):

- **Header** — `bg-green-600 text-white p-4 shadow-md`, title `Umoja` (text-2xl font-bold), nav row of four `<Link>`s:
  - `/agri` → `🌾 Agri`
  - `/health` → `🏥 Health`
  - `/ed` → `📚 Education`
  - `/soko` → `🛍️ Soko`
- **Footer** — centred, `bg-gray-200 text-sm`, `Umoja App © 2025`.
- **Routes** —

| Path | Component | Heading | Bullets |
|---|---|---|---|
| `/` | `Home` | `Welcome to Umoja 🌍` | "Empowering African communities through agriculture, healthcare, education, and commerce." |
| `/agri` | `UmojaAgri` | `UmojaAgri 🌾` | 📈 Market Prices · 🌦️ Weather Forecasts & Pest Alerts · 📘 Farming Guides (Downloadable) · 👥 Farmer Forum |
| `/health` | `UmojaHealth` | `UmojaHealth 🏥` | 💬 Telemedicine Chat / Voice / Video · 📚 Health Library (Offline Access) · 🗺️ Nearby Clinics & Pharmacies |
| `/ed` | `UmojaEd` | `UmojaEd 📚` | 🎓 E-Learning & Skills Development · 📥 Downloadable Courses · 📜 Certificate of Completion |
| `/soko` | `UmojaSoko` | `UmojaSoko 🛍️` | 🛒 E-Commerce Marketplace · 🎨 Freelance & Artisan Hub · 💳 Secure Mobile Payments |

Page wrapper: `min-h-screen bg-gray-50 text-gray-800`. Each pillar renders a `<h2 class="text-xl font-semibold">` and an unordered `list-disc list-inside` of bullet items.

---

## 7. Authentication

### Outer gate (`src/AuthGate.tsx`)

- **Session key:** `sessionStorage["tuc_auth_umoja_react_app"] === "1"`.
- **Accent colour (login icon + button):** `#db2777` (pink-600).
- Hard-coded credentials: `admin` / `admin`. Failure: `"Invalid credentials. Use admin / admin"`.
- Login card title: `"Umoja React App"`. Footer: `"Techbridge University College · admin / admin"`.

### Inner router (`AuthContext` + `AuthService`)

- `API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'`.
- `TOKEN_KEY = 'tuc_umoja_react_app_token'`.
- `AuthService.login(u,p)` POSTs `${API_BASE}/api/auth/login`; persists token; `validateToken` GETs `${API_BASE}/api/auth/validate`.
- `AuthContext` exposes `{ isAuthenticated, user, login, logout, isLoading }`. On mount it validates the stored token; on backend failure it leaves state intact so navigation isn't broken when the API is down.
- `<ProtectedRoute>` redirects unauthenticated visits to `/login`.
- `User` shape: `{ id, username, role }`.

---

## 8. Admin Panel (`src/pages/AdminPage.tsx`)

Standard TUC two-pane layout:
- **Sidebar** `bg-[#0f172a]` (slate-900), with a yellow `bg-[#ffcb05]` shield, app title `Umoja React App`, two tabs (`overview`, `logs`), Sign-Out at the bottom.
- **Main pane** header `Umoja React App — Admin · Techbridge University College · Staff Portal`.

Tabs:

1. **Overview** — six compliance tiles: `React Version 19.2.4`, `Docker Configured`, `SRS docs/SRS.md`, `Tests vitest.config.ts`, `Auth Active`, `Phase Phase 2 Complete`. Each tile renders `✓ compliant` (emerald-600) or `✗ gap` (red-500).
2. **Activity Log** — table of `{ id: string; time: string; action: string; detail: string }`; seeded with one `SESSION_START` entry on mount (`time` = `new Date().toLocaleTimeString()`).

When the four-pillar showcase is re-mounted, future diagnostics (data integrity, market-price feed validation) MUST live exclusively under `/admin`.

---

## 9. Build / Run / Test

```bash
pnpm install
pnpm run dev            # vite, port 3000
pnpm run build          # → dist/
pnpm run preview
pnpm run serve          # serve -s dist -l 3000
pnpm test
pnpm run test:ui
pnpm run test:coverage
pnpm run test:e2e
```

---

## 10. Docker

- **Dockerfile** — node:24-alpine multi-stage. Stage 1: corepack pnpm + `pnpm install --frozen-lockfile || npm install` + `pnpm run build`. Stage 2: `pnpm add -g serve`, copy `dist/`, expose **4173**, healthcheck `wget --spider http://localhost:4173/health`.
- **nginx.conf** — `listen 80; root /usr/share/nginx/html; try_files $uri $uri/ /index.html;` plus security headers `X-Frame-Options SAMEORIGIN`, `X-Content-Type-Options nosniff`, `X-XSS-Protection 1; mode=block`, `Referrer-Policy strict-origin-when-cross-origin`. `/health` returns `healthy`. Static assets cached 1 year immutable. Gzip enabled.
- **docker-compose-all-apps.yml** — service `umoja-react-app`, build context `./umoja-react-app`, dockerfile `../Dockerfile.vite`, network `tuc-network`, healthcheck against `http://localhost/health`.

---

## 11. Environment Variables

```bash
# Frontend (Vite)
VITE_API_URL=http://localhost:5000     # backend auth API for inner router
NODE_ENV=development
```

`AuthGate` is hard-coded; promote to `VITE_AUTH_USERNAME` / `VITE_AUTH_PASSWORD` if rotating credentials.

---

## 12. Branding Overlay (mandatory in any new chrome)

| Token | Hex |
|---|---|
| Gold | `#C8A84B` |
| Ink | `#0F0C07` |
| Cream | `#F2EBD9` |
| Paper | `#141210` |

Typography: Playfair Display (titles), Bebas Neue (display), Inter / Cormorant Garamond (body). The legacy `App.js` uses `bg-green-600` (Tailwind emerald) and `bg-gray-50` — when refreshing, transition the header to the TUC palette while keeping the green accent for the **Agri** pillar where it carries semantic meaning. Footer year string `© 2025` should be updated to `© 2026 Techbridge University College`.

---

## 13. Accessibility Requirements

- Header `<nav>` should expose `aria-label="Pillar navigation"`. Each `<Link>` should have unambiguous text — emoji decorations need `aria-hidden="true"`.
- Pillar pages should declare `role="region" aria-labelledby="pillar-heading"`.
- Bullet lists should remain real `<ul>` elements (not pseudo-bullets).
- Every interactive button (admin sidebar, login form) needs a visible focus ring (`focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2`).
- Login form fields use paired `<label>` + `<input>` with `htmlFor` matching `id`. Today the AuthGate uses inline labels (`<label>Username</label>`); refactor to add `htmlFor`.
- Provide skip-link `Skip to main content` on all pillar pages when refactoring.
- Validate 200% browser zoom does not break navigation row.

---

## 14. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | App builds with zero TypeScript errors |
| AC-2 | `AuthGate` blocks the app until session login succeeds with `admin/admin` |
| AC-3 | Outer login uses pink accent `#db2777` and writes `sessionStorage["tuc_auth_umoja_react_app"] = "1"` on success |
| AC-4 | `/` redirects to `/login` for unauthenticated users; `/login` is reachable |
| AC-5 | `/*` (catch-all) is wrapped in `<ProtectedRoute>` and renders `AdminPage` when authenticated |
| AC-6 | Admin Overview shows the six compliance tiles (React 19.2.4, Docker, SRS, Tests, Auth, Phase) |
| AC-7 | Admin Activity Log seeds at least one `SESSION_START` entry on mount |
| AC-8 | Sidebar Sign-Out clears the JWT and navigates back to `/login` |
| AC-9 | The legacy four-pillar showcase routes (`/agri`, `/health`, `/ed`, `/soko`) are restorable from `App.js` per §6 |
| AC-10 | Each pillar renders the exact bullet list specified in §6 |
| AC-11 | `react-router-dom` is held at `^6.0.0` (deliberately one major behind the rest of the monorepo until the merge refresh) |
| AC-12 | Dockerfile produces a healthy image; `/health` returns `healthy` |
| AC-13 | Service appears under `umoja-react-app:` in `docker-compose-all-apps.yml` on `tuc-network` |
| AC-14 | Institution name in any new chrome is **Techbridge University College** / **TUC** |
| AC-15 | Tests run via `pnpm test`; coverage achievable via `pnpm test:coverage` |
