# CREATION.md — TUC Analytics Dashboard
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/tuc-analytics-dashboard/`
**Last verified:** 2026-04-26

---

## 1. What This App Is

The TUC Analytics Dashboard (`react_repo` v0.0.0, public homepage path `/aucdt-analytics-dashboard/`) is a **multi-tab admissions analytics SPA** that surfaces the full TUC funnel — signups → applicants → accepted → registered — with seasonal, trend, demographic, and conversion drill-downs. It is the larger sibling of `analytics-refactor` and includes:

- A 7-tab dashboard (Overview, Trends, Funnel Analysis, Seasonal, Multi-Party Demographics, Export, About).
- Trendline overlays (linear / polynomial / exponential) toggleable per metric.
- A time-range filter with year-by-year selection (2017 → 2025) plus "recent", "2020-2025", and "all".
- A full Radix-UI / shadcn component library and Tailwind 4 token system with three themes (light/dark/high-contrast).
- A two-tier auth flow: a basic `AuthGate` (`admin/admin`) and a separate **AdminPanel** modal that integrates with the TUC-Auth-API (`VITE_API_URL`).

Data is fetched at runtime from JSON in `public/data/`:
- `data/funnel-data.json` — primary funnel time-series
- `data/corrected_multi_party_demographics.json` — corrected student vs sponsor/guardian demographics

The service is wired into the TUC monorepo gateway and is in the WAR-deployment list.

---

## 2. Tech Stack (exact versions)

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.4** (never change) |
| DOM | react-dom | 19.2.4 |
| Build | Vite | 7.3.1 |
| Vite plugin | @vitejs/plugin-react | ^4.3.4 |
| Language | TypeScript | ~5.6.2 |
| Styling | Tailwind CSS | ^4.0.0 (`@tailwindcss/vite` ^4.0.0); tailwind-merge ^2.6.0; tailwindcss-animate ^1.0.7 |
| Autoprefixer / PostCSS | autoprefixer 10.4.20 / postcss 8.4.49 | — |
| Charts (primary) | Recharts | ^2.12.4 |
| Charts (alt) | chart.js + react-chartjs-2 + chartjs-adapter-date-fns | ^4.4.9 / ^5.3.0 / ^3.0.0 |
| Stats | simple-statistics ^7.8.8, regression ^2.0.1 | — |
| Routing | react-router-dom | ^6 |
| Forms | react-hook-form ^7.54.2 + @hookform/resolvers ^3.10.0 + zod ^3.24.1 | — |
| Component primitives | @radix-ui/react-* (~25 packages, see §3) | — |
| Themes | next-themes | ^0.4.4 |
| Date utils | date-fns ^3.0.0, react-day-picker 8.10.1 | — |
| Icons | lucide-react | ^0.364.0 |
| Toast | sonner | ^1.7.2 |
| Image export | html2canvas | ^1.4.1 |
| Carousels | embla-carousel-react | ^8.5.2 |
| OTP input | input-otp | ^1.4.2 |
| Resizable layouts | react-resizable-panels | ^2.1.7 |
| Vaul (drawer) | vaul | ^1.1.2 |
| Cmd palette | cmdk | 1.0.0 |
| Class utils | clsx ^2.1.1, class-variance-authority ^0.7.1 | — |
| Test runner | Vitest | ^4.0.17 |
| Test env | happy-dom ^20.3.0, jsdom ^27.4.0 | — |
| Testing Library | @testing-library/react ^16.3.1, @testing-library/jest-dom ^6.9.1, @testing-library/user-event ^14.6.1 | — |
| E2E | @playwright/test | ^1.48.1 |
| Lint | ESLint ^9.15.0 + typescript-eslint ^8.15.0 | — |
| Static server | serve | 14.2.5 |
| Package manager | pnpm | 10.30.1 |
| Container | node:24-alpine → `serve` on 4173 (or nginx:alpine via `nginx.conf`) | — |

---

## 3. Directory Structure (verbatim)

```
tuc-analytics-dashboard/
├── index.html                  # TUC brand meta, fonts
├── index.css                   # Tailwind directives
├── components.json             # shadcn/radix config (alias-aware)
├── eslint.config.js
├── playwright.config.ts        # baseURL localhost:5173, testDir e2e/tests, multi-browser
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vite.config.ts              # base './', alias '@'→'./src', vitest happy-dom
├── vitest.config.ts / vitest.e2e.config.ts
├── package.json                # name: react_repo, homepage: /aucdt-analytics-dashboard/
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── Dockerfile / Dockerfile.prod
├── nginx.conf                  # SPA fallback; /health
├── DEPLOYMENT.md
├── GEMINI.md                   # multi-agent workflow doc
├── README.md
├── SRS.md                      # Analytics Dashboard SRS v1.0
├── docs/                       # diagrams, architecture
├── e2e/                        # Playwright tests
├── public/
│   └── data/
│       ├── funnel-data.json
│       └── corrected_multi_party_demographics.json
├── backend/                    # workspace placeholder
├── migrations/
├── WEB-INF/                    # Tomcat WAR context
└── src/
    ├── main.tsx                # createRoot → StrictMode → ErrorBoundary → App
    ├── App.tsx                 # <ThemeProvider><EnhancedDashboard /></ThemeProvider>
    ├── App.css / index.css
    ├── App.test.tsx
    ├── AuthGate.tsx            # Basic admin/admin sessionStorage gate
    ├── vite-env.d.ts
    ├── index.js                # legacy entry (kept for Tomcat fallback)
    ├── context/
    │   └── ThemeContext.tsx    # CSS variable theme system (see §10)
    ├── components/
    │   ├── EnhancedDashboard.tsx        # 7-tab dashboard root
    │   ├── Dashboard.tsx                # legacy single-pane dashboard
    │   ├── AdminPanel.tsx               # JWT-token admin modal
    │   ├── ErrorBoundary.tsx
    │   ├── ThemeToggle.tsx
    │   ├── TrendlineControls.tsx
    │   ├── charts/
    │   │   ├── ConversionRateChart.tsx
    │   │   ├── DonutChart.tsx
    │   │   └── TimeSeriesChart.tsx
    │   ├── tabs/
    │   │   ├── OverviewTab.tsx          # KPIs + headline metrics
    │   │   ├── TrendsTab.tsx            # YoY + trendline overlays
    │   │   ├── FunnelAnalysisTab.tsx    # signup→applied→accepted→registered
    │   │   ├── SeasonalTab.tsx          # monthly seasonality
    │   │   ├── EnhancedDemographicsTab.tsx
    │   │   ├── CorrectedMultiPartyDemographicsTab.tsx
    │   │   ├── ExportTab.tsx
    │   │   ├── AboutTab.tsx
    │   │   └── TestingTab.tsx           # admin-only diagnostics
    │   └── ui/                         # shadcn components (radix wrappers)
    ├── context/
    ├── hooks/
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
    ├── lib/                            # cn(), helpers
    ├── services/
    │   └── AuthService.tsx             # POST /api/auth/login, validate, logout
    ├── utils/
    │   └── trendlines.ts               # TrendlineOptions + computation
    ├── test/
    │   └── setup.ts                    # @testing-library/jest-dom + happy-dom
    └── __tests__/
```

---

## 4. Provider Composition

`src/main.tsx`:
```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
```

`src/App.tsx`:
```tsx
function App() {
  return (
    <ThemeProvider>
      <EnhancedDashboard />
    </ThemeProvider>
  );
}
```

> The `AuthGate` is imported in `main.tsx` but the canonical mount path uses `<App />` directly — gate insertion is optional and may be re-enabled by wrapping `<App />` in `<AuthGate>` for institutional preview deployments.

---

## 5. Authentication

Two layers:

### 5.1 `AuthGate` (`src/AuthGate.tsx`) — frontend-only gate
- `sessionStorage` key: `tuc_auth_tuc_analytics_dashboard` (value `'1'`).
- Hard-coded test creds: **`admin` / `admin`**.
- On submit failure: "Invalid credentials. Use admin / admin".
- Branding: ⚡ icon + "TUC Analytics Dashboard" heading, accent `#4f46e5`, footer "Techbridge University College · admin / admin".

### 5.2 `AdminPanel` (`src/components/AdminPanel.tsx`) — JWT-backed
- Calls `authService.login(username, password)` → `POST {VITE_API_URL}/api/auth/login`.
- Calls `authService.validateToken(token)` → `GET /api/auth/validate` with `Authorization: Bearer ${token}` on mount.
- Token stored in `localStorage["aucdt_admin_token"]`.
- Tabs: `overview | users | logs | settings`.
- Seed admin user (in-memory): `{ id:'1', username:'admin', email:'admin@aucdt.edu.au', role:'admin', createdAt:'2026-01-01T00:00:00Z' }`.
- Audit log shape:
  ```ts
  interface AuditLog {
    id: string; userId: string; action: string; details: string;
    timestamp: string; ipAddress: string; status: 'success' | 'failure';
  }
  ```

Default backend URL: `http://localhost:5000` (overridable via `VITE_API_URL`).

---

## 6. Data Models

### 6.1 `FunnelData` (the runtime payload)
```ts
interface FunnelData {
  timeSeriesData: Array<{
    month: string; signups: number; applicants: number;
    accepted: number; registered: number;
  }>;
  totalMetrics: {
    totalSignups: number; totalApplicants: number;
    totalAccepted: number; totalRegistered: number;
    acceptedNotRegistered: number; signupsNeverApplied: number;
    overallConversionRate: number;
  };
  conversionRates: {
    signupToApplication: number;
    applicationToAcceptance: number;
    acceptanceToRegistration: number;
  };
  funnelBreakdown: {
    registered: number; acceptedNotRegistered: number;
    rejected: number; waitlisted: number;
  };
  enhanced_demographics?: EnhancedDemographicData | null;   // legacy, kept null
  corrected_multi_party_demographics?: CorrectedDemographicData;
  important_correction?: {
    correction_date: string; correction_reason: string;
    corrected_analysis: string; key_finding: string;
  };
}
```

### 6.2 `CorrectedDemographicData`
Splits **student** demographics from **sponsor/guardian** demographics — this correction was added 2025-06-08 because earlier data conflated the two parties. The dashboard surfaces it as a banner: "TUC is primarily a domestic Ghanaian institution with a global family support network" (96.9% domestic students, 3.1% international).

### 6.3 `EnhancedDemographicData`
Full schema includes `metadata`, `demographic_insights` (regional, international, diversity, access patterns), `geographic_analytics` (state, city cluster, conversion-by-region), and `communication_patterns` (country code, mobile/landline). Marked deprecated — kept for backward compatibility.

---

## 7. EnhancedDashboard State

The root tab component (`src/components/EnhancedDashboard.tsx`) holds:

```ts
const [data, setData] = useState<FunnelData | null>(null);
const [filteredData, setFilteredData] = useState<FunnelData | null>(null);
const [timeRange, setTimeRange] = useState<string>('all');
const [activeTab, setActiveTab] = useState<string>('overview');
const [showTrendlines, setShowTrendlines] = useState<boolean>(false);
const [trendlineOptions, setTrendlineOptions] = useState<TrendlineOptions>({ type: 'linear' });
const [activeTrendlines, setActiveTrendlines] = useState<{
  signups: boolean; applicants: boolean; accepted: boolean; registered: boolean;
}>({ signups: true, applicants: true, accepted: true, registered: true });
const [lastUpdated, setLastUpdated] = useState<string>('');
const [isLoading, setIsLoading] = useState<boolean>(true);
const [dataStatus, setDataStatus] = useState<'live' | 'cached' | 'offline'>('live');
const [geographicFilter, setGeographicFilter] = useState<string>('all');
const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
```

`loadData()` (mount-effect):
1. `fetch(${BASE_URL}data/funnel-data.json)` → primary funnel.
2. `fetch(${BASE_URL}data/corrected_multi_party_demographics.json)` → demographic merge.
3. Stamp `important_correction.correction_date = "2025-06-08"`, set `enhanced_demographics = null`.
4. On any failure → `dataStatus = 'offline'`.

`filterDataByTimeRange()` switches over a string union:
- `'all'` → 2017-09 → 2025-06
- `'recent'` → 2022-01 → 2025-06
- `'2020-2025'` → 2020-01 → 2025-06
- `'2017'` → 2017-09 → 2017-12
- `'2018'`–`'2024'` → full calendar year
- `'2025'` → 2025-01 → 2025-06

After filtering, totals are re-aggregated via `reduce` over the filtered `timeSeriesData`.

---

## 8. Tabs (`src/components/tabs/`)

| Tab id | Component | Purpose |
|---|---|---|
| `overview` | `OverviewTab.tsx` | KPI strip (4 totals + overall conversion %), funnel breakdown |
| `trends` | `TrendsTab.tsx` | Time-series + trendline overlays (per-metric toggles), trendline type selector |
| `funnel` | `FunnelAnalysisTab.tsx` | Conversion rates between stages, "accepted not registered" cohort |
| `seasonal` | `SeasonalTab.tsx` | Monthly average across years (Jan–Dec donut + line) |
| `demographics` | `CorrectedMultiPartyDemographicsTab.tsx` | Student vs sponsor demographic split with the 2025-06-08 correction banner |
| `export` | `ExportTab.tsx` | PNG (html2canvas), CSV, Excel snapshot of currently-filtered data |
| `about` | `AboutTab.tsx` | Methodology, data sources, last-updated timestamp |

`TestingTab.tsx` is admin-only (mounted only when `showAdminPanel` is true).

---

## 9. Trendline System (`src/utils/trendlines.ts`)

```ts
export type TrendlineType = 'linear' | 'polynomial' | 'exponential' | 'logarithmic' | 'power';
export interface TrendlineOptions {
  type: TrendlineType;
  degree?: number;        // for polynomial
}
```

Implementation uses `regression` and `simple-statistics` to fit each enabled metric (signups/applicants/accepted/registered). Output is a parallel `[{ x, y }]` array overlaid on the Recharts series at the same x-axis points. R² is surfaced inline as a small badge.

---

## 10. Theme System (`src/context/ThemeContext.tsx`)

Three themes via class on `<html>` (`light` / `dark` / `high-contrast`). Persistence: `localStorage["aucdt-theme"]`. On theme change, the provider also writes the full CSS-variable set inline to `<html>.style`:

```ts
const themeVars = {
  'light':         { '--background':'#ffffff', '--foreground':'#000000', '--card':'#f5f5f5',
                     '--primary':'#3b82f6', '--secondary':'#64748b', '--accent':'#f97316',
                     '--muted':'#e2e8f0', '--destructive':'#ef4444', '--border':'#e2e8f0',
                     '--input':'#e2e8f0', '--ring':'#3b82f6', /* + foreground tokens */ },
  'dark':          { '--background':'#0f172a', '--foreground':'#f1f5f9', '--card':'#1e293b',
                     '--primary':'#3b82f6', '--secondary':'#94a3b8', '--accent':'#f97316',
                     '--muted':'#334155', '--destructive':'#f87171', '--border':'#334155', /* ... */ },
  'high-contrast': { '--background':'#ffffff', '--foreground':'#000000', '--card':'#f0f0f0',
                     '--primary':'#0000ee', '--secondary':'#000000', '--accent':'#ff0000',
                     '--muted':'#cccccc', '--destructive':'#ff0000', '--border':'#000000', /* ... */ },
};
```

Initial theme priority: `localStorage["aucdt-theme"]` → `prefers-color-scheme: dark` → `'light'`.

`toggleTheme()` cycles `light → dark → high-contrast → light`.

**TUC brand overlay** (used in headers/banners): Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`, Paper `#141210`. Typography: Playfair Display (titles), Bebas Neue (display), Inter / Cormorant Garamond (body).

---

## 11. Build Configuration

`vite.config.ts`:
- `base: './'`
- Alias: `'@' → './src'`
- Plugins: `react()`, `tailwindcss()`
- `build.chunkSizeWarningLimit: 1000`
- `manualChunks: { 'react-vendor': ['react', 'react-dom'] }`
- Vitest: `globals: true`, `environment: 'happy-dom'`, `setupFiles: './src/test/setup.ts'`, `css: true`

`package.json` declares `homepage: "/aucdt-analytics-dashboard/"` for Tomcat WAR context-path resolution.

---

## 12. Docker

Multi-stage `node:24-alpine` builder + runtime serving via `serve -s dist -l 4173`. `HEALTHCHECK` hits `http://localhost:4173/health` every 30s. The alternate `Dockerfile.prod` uses nginx with `nginx.conf` for SPA fallback (`try_files $uri $uri/ /index.html`) and `/health` returning `'healthy'`.

Network: `tuc-network`. Reachable through gateway at `http://localhost:8080/tuc-analytics-dashboard/`.

---

## 13. Build / Run / Test

```bash
pnpm install
pnpm run dev          # runs `pnpm install && vite` (idempotent dep refresh)
pnpm run build        # → dist/
pnpm run preview
pnpm run lint         # eslint .
pnpm test             # Vitest watch
pnpm run test:unit    # vitest run
pnpm run test:e2e     # Playwright (auto-spawns dev server on :5173)
pnpm run test:e2e:ui
pnpm run test:e2e:headed
pnpm run test:e2e:debug
```

Playwright runs against **Chromium / Firefox / WebKit / Mobile Chrome (Pixel 5) / Mobile Safari (iPhone 12)** in `e2e/tests/`. Reporter: `html`. Trace `on-first-retry`, screenshots `only-on-failure`, video `retain-on-failure`. Auto webServer: `pnpm dev` at `http://localhost:5173`.

---

## 14. Environment Variables

```bash
# .env
VITE_API_URL=http://localhost:5000   # tuc-auth-api base
```

Optional:
```bash
NODE_ENV=development
CI=true                              # forces non-interactive pnpm in Docker
```

---

## 15. ARIA / Accessibility Requirements

- Tabs use Radix `<TabsList>` / `<TabsTrigger>` — these emit correct `role="tablist"` / `role="tab"` / `aria-selected` automatically.
- Theme toggle button: `aria-label="Toggle theme"` and announces the next theme via `aria-live="polite"`.
- Charts must be wrapped in `<section role="region" aria-labelledby="..." aria-describedby="...">` with sr-only descriptions.
- KPI cards expose `<dt>`/`<dd>` semantics (or `aria-labelledby` pointing at the metric label).
- `AuthGate` form inputs: explicit `<label>`s; error `<p role="alert" aria-live="assertive">`.
- The "View as Table" toggle (per chart) swaps Recharts for an accessible `<table><caption class="sr-only">…</caption></table>`.
- All Lucide icons include `aria-hidden="true"`.
- Skip-to-main-content link is the first child of `<App />`.
- Focus rings: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]`.
- 200% browser zoom must not break layout; charts must reflow inside `<ResponsiveContainer>`.

---

## 16. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | Build completes with zero TypeScript errors and zero ESLint errors |
| AC-2 | App renders the seven tabs (Overview / Trends / Funnel / Seasonal / Demographics / Export / About) |
| AC-3 | `loadData()` successfully fetches `data/funnel-data.json` and merges `corrected_multi_party_demographics.json` |
| AC-4 | When a JSON load fails, `dataStatus` becomes `'offline'` and a banner is shown |
| AC-5 | Time range selector supports `'all'`, `'recent'`, `'2020-2025'`, and each calendar year 2017–2025 |
| AC-6 | Filtering by time range correctly re-aggregates `totalSignups`, `totalApplicants`, `totalAccepted`, `totalRegistered` |
| AC-7 | Trendline overlays render for each enabled metric using the chosen `TrendlineOptions.type` |
| AC-8 | Theme toggle cycles light → dark → high-contrast and writes CSS variables to `<html>.style` |
| AC-9 | Theme choice persists in `localStorage["aucdt-theme"]` and survives reload |
| AC-10 | `AuthGate` rejects any creds other than `admin/admin`; success writes `sessionStorage["tuc_auth_tuc_analytics_dashboard"]='1'` |
| AC-11 | `AdminPanel` opens via header trigger; calls `POST /api/auth/login` against `VITE_API_URL` |
| AC-12 | Successful admin login stores token in `localStorage["aucdt_admin_token"]` and revalidates on mount |
| AC-13 | The Demographics tab surfaces the 2025-06-08 correction banner stating "primarily domestic Ghanaian institution with global family support network" |
| AC-14 | The Export tab produces PNG (html2canvas), CSV, and Excel artefacts of the currently-filtered slice |
| AC-15 | Playwright suite passes on Chromium, Firefox, and WebKit at `http://localhost:5173` |
| AC-16 | Vitest setup loads `@testing-library/jest-dom` and runs in `happy-dom` |
| AC-17 | Docker image builds on `node:24-alpine` and serves on port 4173 with `/health` returning HTTP 200 |
| AC-18 | nginx variant rewrites SPA deep links via `try_files` |
| AC-19 | Service is reachable through TUC gateway at `http://localhost:8080/tuc-analytics-dashboard/` |
| AC-20 | All charts respect the active theme via the `--background`, `--foreground`, `--card`, `--primary` CSS variables |
