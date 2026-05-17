# presentation-app - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for presentation-app.

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
﻿# CREATION.md â€” Presentation App

**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/presentation-app/`
**Last verified:** 2026-04-26

---

## 1. What This App Is

The Presentation App (`presentation-app` v0.1.0) is a **dual-pane fundraising / outreach toolkit SPA** for Techbridge University College (TUC). It packages two artefacts used by TUC's partnership team when courting Mastercard Foundation (and similar African development funders):

1. **Email Templates** â€” three ready-to-send long-form copy decks: *Cold Outreach*, *Warm Introduction Follow-up*, and *Event/Conference Follow-up*. Each shows a subject line and full body in a monospaced `<pre>` block; the partnership lead pastes them into Outlook / Gmail and edits the bracketed placeholders.
2. **Pitch Presentation** â€” a slide deck titled **"Designing Africa's Future"** (Mastercard Foundation Ã— TUC). Slides include hero copy, statistical callouts ("60% youth unemployed", "$23B digital opportunity by 2030", "2% global designers from Africa", "58% financial inclusion vs 76% global"), and impact-alignment grids.

The two views are toggled via a top-tab navigation (`emails` | `presentation`). Slides are advanced via Prev/Next buttons or pagination dots; the hash navigates linearly through `slides.length` (currently 3 slides â€” extensible).

The app is **gated by a session-storage login** (`admin` / `admin`) before any view renders, and exposes a protected `/admin` route inside an inner React Router for compliance/audit dashboards. It is part of the TUC monorepo gateway and deployed via the `presentation-app` service in `docker-compose-all-apps.yml`.

---

## 2. Tech Stack (exact versions)

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.5** (never change) |
| DOM | react-dom | 19.2.5 |
| Build | Vite | 7.3.1 |
| React plugin | @vitejs/plugin-react | ^5.1.4 |
| Tailwind plugin | @tailwindcss/vite | ^4.2.0 |
| Tailwind | tailwindcss | ^4.2.0 |
| PostCSS | postcss | ^8.5.6 |
| Language | TypeScript | ^5.7.2 |
| Routing | react-router-dom | ^7.1.0 |
| Icons | **lucide-react** ^0.525.0 (newer than other apps in the repo) â€” used for ChevronLeft/Right, Mail, FileText, Users, Target, Building, Lightbulb, TrendingUp, Award, Calendar, CheckCircle, Phone |
| Web vitals | web-vitals | ^2.1.4 |
| Static server | serve | 14.2.5 |
| Unit tests | Vitest + @testing-library/react + jsdom | ^3.0.0 / ^16.3.2 / ^26.1.0 |
| Test DOM matchers | @testing-library/jest-dom | ^6.6.3 |
| User-event | @testing-library/user-event | ^14.6.1 |
| Coverage | @vitest/coverage-v8 | ^3.0.0 |
| Package manager | pnpm | 10.30.1 (declared in `packageManager`) |
| Container | node:24-alpine â†’ nginx:alpine | â€” |

This is the only project in this CREATION batch that ships **`tailwind.config.js` and `postcss.config.js` at the project root** in addition to the `@tailwindcss/vite` plugin.

---

## 3. Directory Structure (verbatim)

```
presentation-app/
â”œâ”€â”€ index.html
â”œâ”€â”€ index.css
â”œâ”€â”€ package.json                # name: presentation-app, version: 0.1.0
â”œâ”€â”€ pnpm-lock.yaml
â”œâ”€â”€ pnpm-workspace.yaml
â”œâ”€â”€ vite.config.ts              # dev port 3000, base './', tailwindcss plugin
â”œâ”€â”€ vitest.config.ts
â”œâ”€â”€ vitest.e2e.config.ts
â”œâ”€â”€ tsconfig.json
â”œâ”€â”€ tailwind.config.js
â”œâ”€â”€ postcss.config.js
â”œâ”€â”€ Dockerfile                  # node:24-alpine multi-stage â†’ serve dist :4173
â”œâ”€â”€ nginx.conf                  # SPA fallback /index.html, /health endpoint
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
    â”œâ”€â”€ App.tsx                 # presentation root (~320 LOC)
    â”œâ”€â”€ App.css
    â”œâ”€â”€ App.test.js
    â”œâ”€â”€ AppWithAuth.tsx         # router with /login, /admin, /*
    â”œâ”€â”€ AuthGate.tsx
    â”œâ”€â”€ reportWebVitals.js
    â”œâ”€â”€ setupTests.js
    â”œâ”€â”€ logo.svg
    â”œâ”€â”€ postcss.config.tsx      # repo-tracking variant; functional config is at root
    â”œâ”€â”€ tailwind.config.tsx     # repo-tracking variant; functional config is at root
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

`AppWithAuth` mounts the inner `BrowserRouter` with `/login`, `/admin` (protected), and `/*` (the toolkit `App`).

---

## 5. Application State (`src/App.tsx`)

```ts
const [activeTab,    setActiveTab]    = useState<'emails'|'presentation'>('emails');
const [currentSlide, setCurrentSlide] = useState<number>(0);
```

Two arrays are declared in module scope:

- `slides: { title: string; subtitle: string; content: ReactNode }[]` â€” currently 3 entries (see Â§7).
- `emailTemplates: { title: string; subject: string; content: string }[]` â€” currently 3 entries (see Â§6).

Slide advance:

```ts
const nextSlide = () => setCurrentSlide(p => (p + 1) % slides.length);
const prevSlide = () => setCurrentSlide(p => (p - 1 + slides.length) % slides.length);
```

Pagination dots call `setCurrentSlide(index)` directly. Prev/Next are `disabled` at the boundaries (`currentSlide === 0` / `=== slides.length - 1`).

---

## 6. Email Templates (verbatim subjects)

| # | Title | Subject |
|---|---|---|
| 1 | `Cold Outreach` | `Partnership Opportunity: Transforming West Africa's Creative Economy Through Design-Led Innovation` |
| 2 | `Warm Introduction Follow-up` | `Following Up on [Referrer's Name] Introduction - AUC Partnership Opportunity` |
| 3 | `Event/Conference Follow-up` | `Great Meeting You at [Event Name] - AUC Partnership Discussion` |

Every body is multi-line with bracketed placeholders (`[Name/Team]`, `[Your Name]`, `[Phone]`, `[Email]`) and references `aucdt.edu.gh`. **Note:** Some bodies still mention the legacy "AUC" abbreviation; new content should switch to **TUC / Techbridge University College** per the repo policy.

Each card is rendered as:

```tsx
<div className="bg-white rounded-lg shadow-sm border p-6">
  <h3>{title}</h3>
  <div className="bg-gray-50 p-3 rounded-md"><strong>Subject:</strong> {subject}</div>
  <div className="bg-gray-50 p-4 rounded-md">
    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{content}</pre>
  </div>
</div>
```

---

## 7. Slide Deck (verbatim copy)

| # | Title | Subtitle |
|---|---|---|
| 1 | `Designing Africa's Future` | `A Strategic Partnership Between Mastercard Foundation and Techbridge University College` |
| 2 | `The Challenge We're Solving Together` | `West Africa's Innovation Gap` |
| 3 | `Why This Matters to Mastercard Foundation` | `Aligned Impact, Amplified Reach` |

### Slide 1 layout

- Hero card: `bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 rounded-lg`, `<h1 class="text-4xl font-bold">Designing Africa's Future</h1>`, subtitle `Transforming West Africa's Creative Economy Through Design-Led Innovation`.
- 2-column grid:
  - Blue card `bg-blue-50` â€” `<Building />` icon, `Techbridge University College`, "Ghana's Premier Design & Technology Institution".
  - Green card `bg-green-50` â€” `<Target />` icon, `Mastercard Foundation`, "Empowering African Youth & Innovation".

### Slide 2 layout â€” 2Ã—2 stat grid

| Card | Bg | Stat | Caption |
|---|---|---|---|
| Red | `bg-red-50` | **60%** | West African youth unemployed or underemployed |
| Blue | `bg-blue-50` | **$23B** | Digital economy opportunity by 2030 |
| Yellow | `bg-yellow-50` | **2%** | Of global design professionals are African |
| Green | `bg-green-50` | **58%** | Financial inclusion rate (vs 76% global) |

Plus a `bg-gray-100` panel: heading `The Missing Link`, body `Human-centered design capabilities for local solutions`.

### Slide 3 layout â€” alignment list

Four pill rows on tinted backgrounds:

1. `bg-blue-50` + `<Target />` â†’ **Financial Inclusion** â†’ Training designers who create accessible financial products.
2. `bg-green-50` + `<Users />` â†’ **Youth Employment** â†’ Direct job creation + entrepreneurship pipeline.
3. `bg-purple-50` + `<Award />` â†’ **African Leadership** â†’ Building local capacity for indigenous solutions.
4. `bg-orange-50` + `<TrendingUp />` â†’ **Systems Change** â†’ Transforming how technology serves African communities.

Closing quote card: `bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg`, italic `"The future of African development depends on African-led innovation"`.

---

## 8. UI Composition (`App.tsx` JSX)

- **Top tab bar** â€” `bg-white shadow-sm border-b`. Tabs: `Email Templates` (Mail icon), `Pitch Presentation` (FileText icon). Active tab: `border-b-2 border-blue-500 text-blue-600`.
- **Content container** â€” `max-w-6xl mx-auto p-6`.
- **Email view** â€” heading `Email Templates`, subtitle `Ready-to-use outreach templates for Mastercard Foundation`, then a vertical stack of three template cards.
- **Presentation view** â€” header card showing `slides[currentSlide].title`, `slides[currentSlide].subtitle`, slide counter `Slide X of Y`, and Prev/Next chevron buttons. Below: slide content card `bg-white rounded-lg shadow-sm border p-8 min-h-96`. Below that: pagination dots â€” `w-3 h-3 rounded-full`, active `bg-blue-500`, inactive `bg-gray-300`.

The page background is `bg-gray-50`; cards are `bg-white rounded-lg shadow-sm border`.

---

## 9. Authentication

### Outer gate (`src/AuthGate.tsx`)

- **Session key:** `sessionStorage["tuc_auth_presentation_app"] === "1"`.
- **Accent colour (login icon + button):** `#3b82f6` (blue-500).
- Hard-coded credentials: `admin` / `admin`. Failure: `"Invalid credentials. Use admin / admin"`.
- Login card title: `"Presentation App"`. Footer: `"Techbridge University College Â· admin / admin"`.

### Inner router (`AuthContext` + `AuthService`)

- `API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'`.
- `TOKEN_KEY = [REDACTED_CREDENTIAL]
- `AuthService.login(u,p)` POSTs `${API_BASE}/api/auth/login`; persists token; `validateToken` GETs `${API_BASE}/api/auth/validate`.
- `<ProtectedRoute>` redirects unauthenticated `/admin` visits to `/login`.
- `User` shape: `{ id, username, role }`.

---

## 10. Admin Panel (`src/pages/AdminPage.tsx`)

Standard TUC two-pane layout:
- **Sidebar** `bg-[#0f172a]`, with a yellow `bg-[#ffcb05]` shield, app title `Presentation App`, two tabs (`overview`, `logs`), Sign-Out at the bottom.
- **Main pane** header `Presentation App â€” Admin Â· Techbridge University College Â· Staff Portal`.

Tabs:

1. **Overview** â€” six compliance tiles: `React Version 19.2.5`, `Docker Configured`, `SRS docs/SRS.md`, `Tests vitest.config.ts`, `Auth Active`, `Phase Phase 2 Complete`.
2. **Activity Log** â€” table of `{ id, time, action, detail }`; seeded with one `SESSION_START` entry.

Future diagnostics (slide accessibility audits, copy-to-clipboard tests for templates) MUST live exclusively under `/admin`.

---

## 11. Build / Run / Test

```bash
pnpm install
pnpm run dev            # vite, port 3000
pnpm run build          # â†’ dist/
pnpm run preview
pnpm run serve          # serve -s dist -l 3000
pnpm test
pnpm run test:ui
pnpm run test:coverage
pnpm run test:e2e
```

---

## 12. Docker

- **Dockerfile** â€” node:24-alpine multi-stage. Stage 1: corepack pnpm + `pnpm install --frozen-lockfile || npm install` + `pnpm run build`. Stage 2: `pnpm add -g serve`, copy `dist/`, expose **4173**, healthcheck `wget --spider http://localhost:4173/health`.
- **nginx.conf** â€” `listen 80`, root `/usr/share/nginx/html`, `try_files $uri $uri/ /index.html`, `/health` returns `healthy`, security headers + gzip + 1-year immutable static cache.
- **docker-compose-all-apps.yml** â€” service `presentation-app`, context `./presentation-app`, dockerfile `../Dockerfile.vite`, network `tuc-network`, healthcheck against `http://localhost/health`.

---

## 13. Environment Variables

```bash
# Frontend (Vite)
VITE_API_URL=http://localhost:5000     # backend auth API for inner router
NODE_ENV=development
```

`AuthGate` is hard-coded; promote to `VITE_AUTH_USERNAME` / `VITE_AUTH_PASSWORD` if rotating credentials.

---

## 14. Branding Overlay (mandatory in any new chrome)

| Token | Hex |
|---|---|
| Gold | `#C8A84B` |
| Ink | `#0F0C07` |
| Cream | `#F2EBD9` |
| Paper | `#141210` |

Typography: Playfair Display (titles), Bebas Neue (display), Inter / Cormorant Garamond (body). When refreshing slide copy, replace any remaining `AUC` / `aucdt.edu.gh` references with **TUC** / **techbridge.edu.gh**.

---

## 15. Accessibility Requirements

- Tab buttons set `aria-selected` based on `activeTab`; the panel below must be `role="tabpanel" aria-labelledby="tab-emails|tab-presentation"`.
- Each slide section should be `role="region" aria-labelledby="slide-heading-N"`.
- Stat cards on slide 2 must announce both the figure ("60%") and caption ("West African youth unemployed or underemployed"). Wrap in `<dl><dt>{stat}</dt><dd>{caption}</dd></dl>` when refactoring.
- Prev/Next buttons should expose `aria-label="Previous slide"` / `aria-label="Next slide"` and not rely on the chevron alone.
- Pagination dots should declare `aria-label={`Go to slide ${i+1}`}` and `aria-current={index === currentSlide ? 'true' : 'false'}`.
- Email body `<pre>` blocks should remain selectable; consider adding a `Copy` button per template for keyboard users.
- Colour contrast: header gradients must keep `text-white` on `from-orange-500 to-red-600` (â‰¥ 4.5:1).

---

## 16. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | App builds with zero TypeScript errors and `tailwindcss` v4.2 compiles via `@tailwindcss/vite` |
| AC-2 | `AuthGate` blocks the toolkit until session login succeeds with `admin/admin` |
| AC-3 | Top tab navigation switches between `emails` and `presentation` views without remounting children |
| AC-4 | Emails view renders exactly 3 templates with the subjects in Â§6 |
| AC-5 | Presentation view renders exactly 3 slides with the titles/subtitles in Â§7 |
| AC-6 | Slide 2 displays the four stat cards 60% / $23B / 2% / 58% in the colours red / blue / yellow / green |
| AC-7 | Prev/Next chevron buttons disable at boundaries; pagination dots highlight `currentSlide` in `bg-blue-500` |
| AC-8 | `/admin` route is protected; unauthenticated visits redirect to `/login` |
| AC-9 | Admin Overview shows the six compliance tiles in Â§10 |
| AC-10 | Dockerfile produces a healthy image; `/health` returns `healthy` |
| AC-11 | Service appears under `presentation-app:` in `docker-compose-all-apps.yml` on `tuc-network` |
| AC-12 | All NEW slide / email copy refers to **Techbridge University College** / **TUC** â€” never AUCDT |
| AC-13 | Tests run via `pnpm test`; coverage achievable via `pnpm test:coverage` |
| AC-14 | All lucide icons (`Mail`, `FileText`, `Building`, `Target`, `Users`, `Award`, `TrendingUp`, `CheckCircle`, `ChevronLeft`, `ChevronRight`) resolve from `lucide-react@^0.525.0` |

```

### FILE: DEPLOYMENT.md
```md
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/presentation-app/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/presentation-app/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/presentation-app/',  // REQUIRED: Assets must load from /presentation-app/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/presentation-app"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/presentation-app">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/presentation-app/`, not at the root
- **Asset Loading**: Without `base: '/presentation-app/'`, assets try to load from `/assets/` instead of `/presentation-app/assets/`
- **Routing**: Without `basename="/presentation-app"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/presentation-app/assets/index-*.js`
- Link tags should reference: `/presentation-app/assets/index-*.css`

If they reference `/assets/` instead of `/presentation-app/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/presentation-app/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/presentation-app/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: presentation-app

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
# Admin Guide — presentation-app

**Application:** presentation-app
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

Audit log data is stored in `localStorage` under the key `tuc_presentation-app_audit`.

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
# Deployment Guide — presentation-app

**Application:** presentation-app
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd presentation-app
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
docker-compose -f docker-compose-all-apps.yml build presentation-app
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up presentation-app
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

**Project:** Presentation App
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Presentation App**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Presentation App** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Presentation App** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

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
Stack: React 19.2.5 + TypeScript, Vite 7.3.1, Tailwind CSS 4.x
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
# Testing Guide — presentation-app

**Application:** presentation-app
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd presentation-app
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
    <meta property="og:title" content="Presentation App | Techbridge University College" />
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
    <meta name="twitter:title" content="Presentation App | Techbridge University College" />
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
    <title>Presentation App | Techbridge University College</title>

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
        <div class="tuc-status">presentation app</div>
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
  "name": "presentation-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/dom": "^10.4.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^13.5.0",
    "lucide-react": "^0.525.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "web-vitals": "^2.1.4",
    "react-router-dom": "^7.1.0",
    "@tailwindcss/vite": "^4.2.0"
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
    "typescript": "^5.7.2",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.5",
    "@vitejs/plugin-react": "^5.1.4",
    "postcss": "^8.5.6",
    "serve": "14.2.5",
    "tailwindcss": "^4.2.0",
    "vite": "7.3.1",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "@tailwindcss/vite": "^4.2.0"
  }
}

```

### FILE: postcss.config.js
```javascript
export default { plugins: {} }

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
/* Tailwind handled by src/index.css */

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
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Mail, FileText, Users, Target, Building, Lightbulb, TrendingUp, Award, Calendar, CheckCircle, Phone } from 'lucide-react';

const PresentationApp = () => {
  const [activeTab, setActiveTab] = useState('emails');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Designing Africa's Future",
      subtitle: "A Strategic Partnership Between Mastercard Foundation and Techbridge University College",
      content: (
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 rounded-lg">
            <h1 className="text-4xl font-bold mb-4">Designing Africa's Future</h1>
            <p className="text-xl">Transforming West Africa's Creative Economy Through Design-Led Innovation</p>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <Building className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="font-bold text-lg">Techbridge University College</h3>
              <p>Ghana's Premier Design & Technology Institution</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <Target className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="font-bold text-lg">Mastercard Foundation</h3>
              <p>Empowering African Youth & Innovation</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "The Challenge We're Solving Together",
      subtitle: "West Africa's Innovation Gap",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-red-50 p-6 rounded-lg">
              <TrendingUp className="w-10 h-10 text-red-600 mb-4" />
              <h3 className="text-2xl font-bold text-red-600">60%</h3>
              <p>West African youth unemployed or underemployed</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <Target className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-blue-600">$23B</h3>
              <p>Digital economy opportunity by 2030</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <Users className="w-10 h-10 text-yellow-600 mb-4" />
              <h3 className="text-2xl font-bold text-yellow-600">2%</h3>
              <p>Of global design professionals are African</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <CheckCircle className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-green-600">58%</h3>
              <p>Financial inclusion rate (vs 76% global)</p>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">The Missing Link</h3>
            <p className="text-lg">Human-centered design capabilities for local solutions</p>
          </div>
        </div>
      )
    },
    {
      title: "Why This Matters to Mastercard Foundation",
      subtitle: "Aligned Impact, Amplified Reach",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-4 bg-blue-50 p-4 rounded-lg">
              <Target className="w-8 h-8 text-blue-600" />
              <div>
                <strong>Financial Inclusion</strong> → Training designers who create accessible financial products
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-green-50 p-4 rounded-lg">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <strong>Youth Employment</strong> → Direct job creation + entrepreneurship pipeline
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-purple-50 p-4 rounded-lg">
              <Award className="w-8 h-8 text-purple-600" />
              <div>
                <strong>African Leadership</strong> → Building local capacity for indigenous solutions
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-orange-50 p-4 rounded-lg">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <strong>Systems Change</strong> → Transforming how technology serves African communities
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
            <p className="text-lg italic">"The future of African development depends on African-led innovation"</p>
          </div>
        </div>
      )
    }
  ];

  const emailTemplates = [
    {
      title: "Cold Outreach",
      subject: "Partnership Opportunity: Transforming West Africa's Creative Economy Through Design-Led Innovation",
      content: `Dear [Name/Team],

Techbridge University College (TUC) is pioneering a unique approach to addressing youth unemployment in Ghana by combining design thinking with technology education—creating pathways for young people to enter the growing creative and digital economy.

**Why This Aligns with Mastercard Foundation's Mission:**
• We're developing the next generation of African innovators who will design inclusive financial and digital solutions
• 73% of our graduates secure employment or start businesses within 6 months
• Our programmes specifically target underserved youth, with 45% of students from low-income households

**Our Proposal:** A strategic partnership to establish the "Mastercard Foundation Innovation Hub" at AUC—a regional center for design-led solutions addressing financial inclusion challenges across West Africa.

**Immediate Impact Opportunity:**
• Train 500+ young designers and technologists over 3 years
• Incubate 50+ startups focused on inclusive digital solutions
• Create research partnerships addressing barriers to financial inclusion through human-centered design

I'd welcome a brief 15-minute call to explore how AUC's unique positioning as Ghana's premier design-technology institution can amplify Mastercard Foundation's impact in West Africa.

Attached you'll find our institutional overview and initial partnership framework.

Best regards,
[Your Name]
[Title]
Techbridge University College
[Phone] | [Email] | aucdt.edu.gh`
    },
    {
      title: "Warm Introduction Follow-up",
      subject: "Following Up on [Referrer's Name] Introduction - AUC Partnership Opportunity",
      content: `Dear [Name],

Thank you for taking [Referrer's name]'s introduction. As mentioned, Techbridge University College is at an exciting inflection point where we can significantly amplify Mastercard Foundation's impact in West Africa's innovation ecosystem.

**What Makes This Partnership Strategic:**

**For Mastercard Foundation:**
• Direct access to train and mentor the next generation of African problem-solvers
• A regional platform for testing and scaling design-led approaches to financial inclusion
• Measurable impact through our established track record of graduate outcomes

**For West Africa's Development:**
• Filling the critical gap in human-centered design capabilities
• Creating local capacity for indigenous solutions to financial and digital inclusion challenges
• Building a sustainable pipeline of innovators who understand African contexts

**Proposed Next Steps:**
1. 30-minute exploratory call to discuss alignment and opportunities
2. Site visit to AUC campus (virtual or in-person)
3. Joint development of a pilot program proposal

Our students are already working on projects like mobile banking UX for rural communities and blockchain solutions for agricultural financing. With Mastercard Foundation's partnership, we can scale these innovations regionally.

Would you be available for a brief call next week? I'm flexible with timing to accommodate your schedule.

Warm regards,
[Your Name]`
    },
    {
      title: "Event/Conference Follow-up",
      subject: "Great Meeting You at [Event Name] - AUC Partnership Discussion",
      content: `Dear [Name],

It was a pleasure meeting you at [Event] and learning more about Mastercard Foundation's innovative approaches to youth empowerment in Africa.

Our conversation about the need for more African-led design solutions particularly resonated with AUC's mission. As I mentioned, we're uniquely positioned as Ghana's only university focused specifically on design and technology integration.

**Since Our Conversation, I've Been Thinking About:**
• Your point about the importance of local context in financial product design
• How AUC's students could contribute to Mastercard Foundation's research initiatives
• The potential for a West African hub that combines academic rigor with practical innovation

**What I'd Love to Explore Further:**
A partnership model where Mastercard Foundation and AUC co-create programmes that:
• Develop local talent with global standards
• Generate research insights on African user experiences
• Create scalable models for other African universities

I've attached a brief overview of our current programmes and some student project examples that might interest you.

Could we schedule 20 minutes in the coming weeks to continue our conversation?

Best,
[Your Name]`
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('emails')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'emails'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email Templates</span>
            </button>
            <button
              onClick={() => setActiveTab('presentation')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'presentation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Pitch Presentation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto p-6">
        {activeTab === 'emails' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Templates</h1>
              <p className="text-gray-600">Ready-to-use outreach templates for Mastercard Foundation</p>
            </div>
            
            <div className="grid gap-8">
              {emailTemplates.map((template, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{template.title}</h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <strong>Subject:</strong> {template.subject}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{template.content}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'presentation' && (
          <div className="space-y-6">
            {/* Presentation Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{slides[currentSlide].title}</h1>
                  <p className="text-gray-600">{slides[currentSlide].subtitle}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Slide {currentSlide + 1} of {slides.length}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={prevSlide}
                      disabled={currentSlide === 0}
                      className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextSlide}
                      disabled={currentSlide === slides.length - 1}
                      className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Content */}
            <div className="bg-white rounded-lg shadow-sm border p-8 min-h-96">
              {slides[currentSlide].content}
            </div>

            {/* Slide Navigation */}
            <div className="flex justify-center space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentationApp;
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

const AUTH_KEY = 'tuc_auth_presentation_app';
const ACCENT   = '#3b82f6';

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
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Presentation App</h1>
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
          <span className="font-bold text-sm">Presentation App</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Presentation App — Admin</h1>
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

### FILE: src/postcss.config.tsx
```typescript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
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

### FILE: src/tailwind.config.tsx
```typescript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### FILE: src/vite-env.d.ts
```typescript
/// <reference types="vite/client" />

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — presentation-app
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('presentation-app E2E', () => {
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

### FILE: tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
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
import tailwindcss from '@tailwindcss/vite'

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

// Vitest unit test configuration — presentation-app
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

// Vitest E2E configuration — presentation-app
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

