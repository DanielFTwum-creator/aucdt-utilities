# CREATION.md â€” Presentation App

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
- `TOKEN_KEY = 'tuc_presentation_app_token'`.
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
