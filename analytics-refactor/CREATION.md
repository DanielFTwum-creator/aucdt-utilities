# CREATION.md â€” Analytics Refactor (Advanced Analytics Dashboard)
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/analytics-refactor/`
**Last verified:** 2026-04-26

---

## 1. What This App Is

The Advanced Analytics Dashboard (`advanced-analytics-dashboard` v3.0.0) is a **read-only admissions/enrolment analytics SPA** for Techbridge University College (TUC). It surfaces year-over-year growth, conversion funnel efficiency, monthly seasonal patterns, quality-vs-quantity tradeoffs, and a composite performance scorecard across the admissions pipeline (signups â†’ applicants â†’ accepted â†’ registered).

The app is **gated by a username/password login** before any analytics render. Authenticated users get the dashboard; users who additionally pass the admin password gate get the **Admin Panel** (audit log, data import, internal test panel). All data is loaded client-side from a fallback JSON dataset OR from `localStorage["imported_analytics_data"]` if a CSV/XLSX has been imported. There is no production API yet â€” the data hook contains a TODO for `/api/analytics/admission-data`.

This is the analytics service that is wired into the TUC monorepo gateway (`docker-compose.yml`, service name `analytics-refactor`).

---

## 2. Tech Stack (exact versions)

| Layer | Technology | Version |
|---|---|---|
| Runtime | React | **19.2.5** (never change) |
| Build | Vite | 7.3.1 |
| Language | TypeScript | ^5.7 (also tolerates `.tsx` files holding plain JS) |
| Styling | Tailwind CSS | ^4.1 (PostCSS, autoprefixer); custom `styles/themes.css` |
| Charts | Recharts | ^3.7.0 |
| Icons | @heroicons/react | ^2.2.0 |
| PDF export | jspdf + jspdf-autotable | ^4.1 / ^5.0 |
| XLSX export | xlsx (SheetJS) | ^0.18.5 |
| Image export (optional) | html2canvas | ^1.4.1 (optionalDependencies) |
| Date pickers (optional) | react-datepicker + date-fns | ^9.1 / ^4.1 (optionalDependencies) |
| Static server | serve | 14.2.5 |
| Unit tests | Vitest + @testing-library/react + happy-dom | ^3.0 / ^16.3 / ^17 |
| E2E | Playwright | ^1.49 |
| Lint | ESLint (react-app config) | ^10 |
| Format | Prettier | ^3.8 |
| Package manager | pnpm | 10.30.1 (declared in `packageManager`) |
| Container | node:24-alpine â†’ nginx:alpine | â€” |
| Engines | node â‰¥22 | â€” |

**Coverage threshold (vitest, jest-shaped config in `package.json`):** branches/functions/lines/statements **70%** each.

---

## 3. Directory Structure (verbatim)

```
analytics-refactor/
â”œâ”€â”€ index.html
â”œâ”€â”€ package.json                 # name: advanced-analytics-dashboard, version: 3.0.0
â”œâ”€â”€ pnpm-lock.yaml
â”œâ”€â”€ pnpm-workspace.yaml          # includes ./, ./backend
â”œâ”€â”€ vite.config.ts               # dev port 3000
â”œâ”€â”€ tsconfig.json
â”œâ”€â”€ tailwind.config.js
â”œâ”€â”€ postcss.config.js
â”œâ”€â”€ playwright.config.ts
â”œâ”€â”€ vitest.config.ts
â”œâ”€â”€ vitest.e2e.config.ts
â”œâ”€â”€ Dockerfile                   # multi-stage node:24-alpine â†’ nginx:alpine
â”œâ”€â”€ nginx.conf                   # SPA fallback to /index.html
â”œâ”€â”€ deploy.sh / deploy.bat
â”œâ”€â”€ ACCESSIBILITY.md
â”œâ”€â”€ CHANGELOG.md
â”œâ”€â”€ CLEAN_BUILD_INSTRUCTIONS.md
â”œâ”€â”€ DEPLOYMENT.md
â”œâ”€â”€ REAL_DATA_SEEDED.md
â”œâ”€â”€ RELEASE_NOTES_v3.0.0.md
â”œâ”€â”€ SRS.md                       # IEEE SRS v3.0.0
â”œâ”€â”€ README.md
â”œâ”€â”€ public/
â”œâ”€â”€ docs/                        # SRS, architecture SVGs, deployment guide
â”œâ”€â”€ e2e/                         # Playwright specs
â”œâ”€â”€ backend/                     # workspace placeholder package
â””â”€â”€ src/
    â”œâ”€â”€ index.tsx                # createRoot tree (see Â§5)
    â”œâ”€â”€ index.js                 # legacy CRA entry (kept for fallback)
    â”œâ”€â”€ index.css                # Tailwind directives
    â”œâ”€â”€ AuthGate.tsx             # auth wrapper rendering LoginScreen until token exists
    â”œâ”€â”€ setupTests.js
    â”œâ”€â”€ vite-env.d.ts
    â”œâ”€â”€ styles/
    â”‚   â””â”€â”€ themes.css           # CSS variables for light/dark/high-contrast
    â”œâ”€â”€ config/
    â”‚   â””â”€â”€ auth.config.tsx      # AUTH_CONFIG, validateCredentials, session helpers
    â”œâ”€â”€ contexts/
    â”‚   â”œâ”€â”€ ThemeContext.tsx     # 'light' | 'dark' | 'high-contrast'
    â”‚   â”œâ”€â”€ ExportContext.tsx    # cross-component export queue
    â”‚   â””â”€â”€ FilterContext.tsx    # cohort/year/programme filters
    â”œâ”€â”€ hooks/
    â”‚   â”œâ”€â”€ useChartExport.tsx   # PNG/PDF/CSV/XLSX
    â”‚   â””â”€â”€ useKeyboardShortcuts.tsx  # Ctrl+P print, Ctrl+E export, etc. + announcer
    â”œâ”€â”€ services/
    â”‚   â”œâ”€â”€ AuthService.tsx          # login/logout, session token mgmt
    â”‚   â”œâ”€â”€ AuditLogger.tsx          # logAuth, logSecurity, logExport â€” persisted log
    â”‚   â”œâ”€â”€ DataImportService.tsx    # CSV/XLSX â†’ validated JSON â†’ localStorage
    â”‚   â””â”€â”€ ExportService.tsx        # exposes export pipeline used by hook
    â”œâ”€â”€ utils/
    â”‚   â”œâ”€â”€ colors.tsx               # exported palettes (see Â§10)
    â”‚   â”œâ”€â”€ formatters.tsx
    â”‚   â”œâ”€â”€ inputValidation.tsx
    â”‚   â””â”€â”€ logger.tsx
    â””â”€â”€ components/
        â”œâ”€â”€ ErrorBoundary.tsx
        â”œâ”€â”€ accessibility/
        â”‚   â”œâ”€â”€ SkipLinks.tsx
        â”‚   â””â”€â”€ AccessibilityToolbar.tsx
        â”œâ”€â”€ admin/
        â”‚   â”œâ”€â”€ AdminPanel.tsx       # password-gated â€” audit log + import + test
        â”‚   â”œâ”€â”€ DataImportModal.tsx
        â”‚   â””â”€â”€ TestPanel.tsx        # internal diagnostics (see Â§11)
        â”œâ”€â”€ analytics/
        â”‚   â”œâ”€â”€ AdvancedAnalytics.tsx        # root view component
        â”‚   â”œâ”€â”€ components/
        â”‚   â”‚   â”œâ”€â”€ DashboardHeader.tsx
        â”‚   â”‚   â”œâ”€â”€ AllTimeStatsBanner.tsx
        â”‚   â”‚   â”œâ”€â”€ CustomTooltip.tsx
        â”‚   â”‚   â”œâ”€â”€ ChartInsight.tsx
        â”‚   â”‚   â”œâ”€â”€ LoadingState.tsx
        â”‚   â”‚   â”œâ”€â”€ ErrorState.tsx
        â”‚   â”‚   â””â”€â”€ EmptyState.tsx
        â”‚   â”œâ”€â”€ charts/
        â”‚   â”‚   â”œâ”€â”€ YearOverYearChart.tsx
        â”‚   â”‚   â”œâ”€â”€ FunnelEfficiencyChart.tsx
        â”‚   â”‚   â”œâ”€â”€ SeasonalPatternChart.tsx
        â”‚   â”‚   â”œâ”€â”€ QualityQuantityChart.tsx
        â”‚   â”‚   â”œâ”€â”€ PerformanceScorecardChart.tsx
        â”‚   â”‚   â””â”€â”€ index.tsx
        â”‚   â”œâ”€â”€ context/
        â”‚   â”œâ”€â”€ hooks/
        â”‚   â”‚   â””â”€â”€ useAnalyticsData.tsx     # fetch + memoise + validate
        â”‚   â”œâ”€â”€ styles/
        â”‚   â”œâ”€â”€ utils/
        â”‚   â”‚   â”œâ”€â”€ analyticsCalculations.js # pure functions (see Â§6)
        â”‚   â”‚   â”œâ”€â”€ dataValidation.js
        â”‚   â”‚   â””â”€â”€ testData.js
        â”‚   â””â”€â”€ __tests__/
        â”œâ”€â”€ export/
        â”‚   â””â”€â”€ ExportModal.tsx
        â””â”€â”€ filters/
            â””â”€â”€ FilterPanel.tsx
```

---

## 4. Data Model (canonical record shape)

Each row in the seeded/imported dataset is a **monthly admissions record**:

```ts
interface RawAdmissionsRecord {
  MONTH: string;       // "YYYY-MM" â€” must match /^\d{4}-\d{2}$/
  SIGNUPS: string;     // numeric string (kept as string in CSV import)
  APPLICANTS: string;
  ACCEPTED: string;
  REJECTED: string;
  WAITLISTED: string;
  REGISTERED: string;
}

// After processRawData(...)
interface ProcessedAdmissionsRecord {
  month: string;                 // "YYYY-MM"
  year: string;                  // "YYYY"
  monthIndex: number;            // 1..12
  signups: number;
  applicants: number;
  accepted: number;
  rejected: number;
  waitlisted: number;
  registered: number;
  acceptanceRate: number;        // round(accepted / applicants * 1000) / 10  â†’ 1 dp
  registrationRate: number;      // round(registered / accepted * 1000) / 10
  conversionRate: number;        // round(registered / signups * 1000) / 10
}
```

`dataValidation.validateDataIntegrity(data)` returns `{ valid, errors[], recordCount }`. Validation rules:
- Every record contains all 7 required fields.
- `MONTH` matches `^\d{4}-\d{2}$`.
- All numeric fields parse to non-negative integers.
- `applicants â‰¥ accepted + rejected + waitlisted` (warn only).

---

## 5. Provider Composition (`src/index.tsx`)

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/themes.css';
import AdvancedAnalytics from './components/analytics/AdvancedAnalytics';
import { ThemeProvider } from './contexts/ThemeContext';
import { ExportProvider } from './contexts/ExportContext';
import { FilterProvider } from './contexts/FilterContext';
import { AuthGate } from './AuthGate';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthGate>
      <ThemeProvider>
        <ExportProvider>
          <FilterProvider>
            <AdvancedAnalytics />
          </FilterProvider>
        </ExportProvider>
      </ThemeProvider>
    </AuthGate>
  </React.StrictMode>
);
```

`AuthGate` reads `localStorage[AUTH_CONFIG.sessionStorageKey]`. If session is missing or expired, it renders `<LoginScreen onLogin={...} />`; otherwise it renders children.

---

## 6. Analytics Calculation Pipeline (`src/components/analytics/utils/analyticsCalculations.js`)

Five pure functions, fed by `useAnalyticsData`:

| Function | Input | Output |
|---|---|---|
| `processRawData(records)` | `RawAdmissionsRecord[]` | `ProcessedAdmissionsRecord[]` |
| `calculateYearlyData(processed)` | processed | `[{ year, signups, applicants, accepted, rejected, waitlisted, registered, acceptanceRate, growthRate }]` (one row per year, sorted ascending) |
| `calculateFunnelData(processed)` | processed | `[{ stage: 'Signups'|'Applicants'|'Accepted'|'Registered', value, conversionFromPrev }]` |
| `calculateCorrelationData(processed)` | processed | `[{ applicants, acceptanceRate, year, month }]` for scatter |
| `calculateSeasonalData(processed)` | processed | `[{ month: 1..12, name: 'Jan'..'Dec', avgSignups, avgApplicants, avgAccepted, avgRegistered }]` |
| `calculateRadarData(processed)` | processed | `[{ metric, current, previous, target }]` for the scorecard radar |
| `calculateAllTimeStats(processed)` | processed | `{ signups, applicants, accepted, rejected, waitlisted, registered, acceptanceRate, registrationRate }` |
| `calculateTrends(yearly)` | yearly | `{ signupsTrend, applicantsTrend, acceptedTrend, registeredTrend }` (% YoY for last full year) |

All functions must round percentages to **one decimal place** and return JSON-safe primitives only.

---

## 7. `useAnalyticsData` Hook (`src/components/analytics/hooks/useAnalyticsData.tsx`)

Signature: `useAnalyticsData({ dateRange, selectedMetrics })`.

Behaviour:

1. On mount, await `setTimeout(800)` (placeholder for future API).
2. **Source priority:**
   - If `localStorage["imported_analytics_data"]` exists â†’ JSON.parse it; log timestamp from `localStorage["data_import_timestamp"]`.
   - Otherwise â†’ `getFallbackData()` (seeded dataset bundled with the app).
3. Run `validateDataIntegrity(data)` and surface warnings via console (do **not** throw).
4. `setRawData(data)`; `setLastFetch(new Date())`.
5. `processedMetrics` is a `useMemo` over `rawData` â†’ calls `processRawData â†’ calculateYearlyData / calculateFunnelData / calculateCorrelationData / calculateSeasonalData / calculateRadarData / calculateAllTimeStats / calculateTrends` and returns the bundle.
6. Re-fetch when `dateRange` changes (NOT when raw data changes â€” exclude to prevent loops).

Returns: `{ data, processedMetrics, loading, error, lastFetch, refetch }`.

---

## 8. Authentication & Sessions (`src/config/auth.config.tsx`)

```ts
export const AUTH_CONFIG = {
  username: process.env.REACT_APP_AUTH_USERNAME || 'admin',
  password: process.env.REACT_APP_AUTH_PASSWORD || 'changeme',
  adminPassword: process.env.REACT_APP_ADMIN_PASSWORD || 'changeme',
  sessionTimeout: parseInt(process.env.REACT_APP_SESSION_TIMEOUT || '3600000', 10), // 1 hour
  sessionStorageKey: process.env.REACT_APP_SESSION_STORAGE_KEY || 'analytics_session',
};
```

Required exports: `validateCredentials`, `validateAdminPassword`, `createSession`, `isSessionValid`, `clearSession`, `performSecurityChecks`.

**Session token:** 32-byte `crypto.getRandomValues` hex; stored as `{ token, createdAt, expiresAt }` JSON.

**Lockout policy** (in `LoginScreen`):
- `MAX_ATTEMPTS = parseInt(process.env.REACT_APP_MAX_LOGIN_ATTEMPTS || '5')`
- `LOCKOUT_DURATION = parseInt(process.env.REACT_APP_LOCKOUT_DURATION || '900000')` (15 min)
- Failed attempts persist in `localStorage["login_attempts"]`; lockout expiry in `localStorage["login_lockout_until"]`.
- On lock, login form displays "Account locked. Try again in N minutes." and disables submit; an interval re-checks every 60s.
- Successful login clears both keys.
- Every login attempt (success or fail) is sent to `auditLogger.logAuth(...)` / `auditLogger.logSecurity(...)`.

`performSecurityChecks()` is called at app boot and warns to the console for: weak/default password, default admin password, prod env still using dev creds, missing HTTPS in prod.

---

## 9. Audit Logger (`src/services/AuditLogger.tsx`)

Singleton with API: `logAuth(event, username, success, meta?)`, `logSecurity(event, payload)`, `logExport(format, target)`, `getEntries()`, `clear()`.

Each entry: `{ id, timestamp, type: 'AUTH'|'SECURITY'|'EXPORT'|'IMPORT'|'FILTER', event, payload }`. Persisted to `localStorage["analytics_audit_log"]` with a rolling cap of 1000 entries.

---

## 10. Theme Tokens (`src/styles/themes.css` and `src/utils/colors.tsx`)

`utils/colors.tsx` exports the canonical palette (WCAG 2.1 AA verified):

```ts
export const textColors = { primary: '#1f2937', secondary: '#4b5563', muted: '#6b7280', inverse: '#ffffff', inverseSecondary: '#f3f4f6' };
export const chartColors = {
  blue:    '#2563eb',  // 4.61:1
  indigo:  '#4f46e5',  // 6.41:1
  purple:  '#7c3aed',  // 5.36:1
  violet:  '#8b5cf6',  // 4.54:1
  green:   '#059669',  // 4.72:1
  emerald: '#10b981',  // 3.37:1 (large text)
  amber:   '#d97706',
  orange:  '#ea580c',
  red:     '#dc2626',
  cyan:    '#0891b2',
  teal:    '#0d9488',
  sky:     '#0284c7',
};
export const colorUsage = {
  signups:    chartColors.blue,
  applicants: chartColors.purple,
  accepted:   chartColors.green,
  registered: chartColors.amber,
  rejected:   chartColors.red,
  waitlisted: chartColors.orange,
  trendPositive: '#86efac',
  trendNegative: '#fca5a5',
  trendNeutral:  '#d1d5db',
};
export const highContrastColors = {
  text: '#000000', background: '#ffffff', border: '#000000',
  link: '#0000ee', linkVisited: '#551a8b', focus: '#ffff00',
  success: '#008000', error: '#ff0000', warning: '#ff8c00',
};
```

`themes.css` declares `[data-theme="light"]`, `[data-theme="dark"]`, `[data-theme="high-contrast"]` blocks that map these into `--bg`, `--fg`, `--accent`, `--card`, `--border`, `--focus-ring`. `ThemeContext` toggles by setting `document.documentElement.dataset.theme`.

**TUC brand overlay** (used in headers/banners): Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`, Paper `#141210`. Typography: Playfair Display (titles), Bebas Neue (display), Inter or Cormorant Garamond (body).

---

## 11. Admin Panel (`src/components/admin/AdminPanel.tsx`)

Triggered from a header gear icon. Opens a modal containing tabs:

1. **Audit Log** â€” table of `auditLogger.getEntries()` with type/event filter and CSV export button.
2. **Data Import** (`DataImportModal`) â€” drop-zone accepting `.csv`/`.xlsx`. On accept:
   - Parse via SheetJS (XLSX) or papaparse-like CSV parsing.
   - Validate column header set: `MONTH, SIGNUPS, APPLICANTS, ACCEPTED, REJECTED, WAITLISTED, REGISTERED`.
   - Run `validateDataIntegrity`; on success write `localStorage["imported_analytics_data"]` and `localStorage["data_import_timestamp"]`, then page-reload to trigger the data hook.
3. **Test Panel** (`TestPanel`) â€” runs:
   - Data integrity test â†’ reports record count + errors.
   - Calculation accuracy test â†’ seeds known input, asserts known output (acceptanceRate, totals, year aggregation).
   - Render performance test â†’ `performance.now()` delta < 100 ms.
   - Accessibility test â†’ integrate axe-core when available; otherwise report 0 violations.
   - Each test card: `{ name, passed, details }`. Final summary: total / passed / failed / timestamp.

The Admin Panel itself requires a **second password prompt** (`validateAdminPassword`) before opening â€” even for an authenticated session.

---

## 12. Keyboard Shortcuts (`src/hooks/useKeyboardShortcuts.tsx`)

- `Ctrl+P` â†’ `window.print()`
- `Ctrl+E` â†’ open Export Modal
- `Ctrl+F` â†’ focus the FilterPanel root element
- `Ctrl+Shift+A` â†’ open Accessibility Toolbar
- `Esc` â†’ close any open modal
- The hook also exports `KeyboardShortcutsAnnouncer` â€” an `aria-live="polite"` region that announces "Print dialog opened" / "Export menu opened" / "Filter focused" for screen readers.

---

## 13. Export Pipeline (`src/hooks/useChartExport.tsx`)

Returns `{ exportToPNG(elementId, filename), exportToPDF(elementId, filename), exportToCSV(data, filename), exportToExcel(data, filename), exporting }`.

- **PNG:** `html2canvas(element, { backgroundColor: '#ffffff', scale: 2 })` â†’ blob â†’ trigger download `<filename>-<timestamp>.png`.
- **PDF:** same canvas â†’ `new jsPDF({ orientation: 'landscape', unit: 'px', format: [w, h] })` â†’ `.addImage(...) â†’ .save(...)`.
- **CSV:** join headers row + JSON-stringified cell rows, blob `text/csv;charset=utf-8;`.
- **XLSX:** `XLSX.utils.json_to_sheet(data)` â†’ workbook â†’ `XLSX.writeFile(wb, '<filename>-<ts>.xlsx')`.

Every export emits `auditLogger.logExport(format, target)`.

---

## 14. Accessibility Requirements (WCAG 2.1 AA)

- `SkipLinks.tsx`: skip-to-main, skip-to-charts, skip-to-filters (visible only on focus).
- `AccessibilityToolbar.tsx`: theme switch (light/dark/high-contrast), font-size step (90%/100%/110%/125%), motion-reduction toggle (sets `prefers-reduced-motion` override class).
- All chart `<section role="region" aria-labelledby="chart-heading-N" aria-describedby="chart-description-N">` with an `sr-only` description paragraph summarising the data trend.
- `aria-live="polite"` region announces loading/error/success states from `useAnalyticsData`.
- All `<button>`s have `aria-label`; icon-only buttons must not rely on visible text.
- Focus rings: `focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`.
- All charts must offer a **"View as Table" toggle** swapping the Recharts component for an accessible `<table>` with `<caption class="sr-only">` and sortable `<th aria-sort="...">`.
- 200% browser zoom must not break layout.
- All form inputs paired `<label htmlFor>` â†” `id`.

---

## 15. Build / Run / Test

```bash
pnpm install
pnpm run dev          # vite, port 3000
pnpm run build        # â†’ dist/
pnpm run preview
pnpm test             # vitest
pnpm test:coverage    # â‰¥70% target
pnpm test:e2e         # Playwright
pnpm run lint
pnpm run lint:fix
pnpm run format
```

Required Vitest setup (`setupTests.js`): `import '@testing-library/jest-dom'`.

Required E2E specs (in `e2e/`):
- `dashboard.test.js` â€” load app, log in (admin/changeme), assert title, assert â‰¥5 chart `[role="region"]` regions, assert loadingâ†’loaded transition, screenshot `e2e/screenshots/dashboard.png`.
- `accessibility.test.js` â€” keyboard tab through, axe scan.

---

## 16. Docker

- Multi-stage build: `node:24-alpine` (pnpm install + build) â†’ `nginx:alpine` (serve `/usr/share/nginx/html`).
- `nginx.conf`: `try_files $uri /index.html;` for SPA fallback; expose `/health` returning `OK`.
- Healthcheck (compose): `wget --quiet --tries=1 --spider http://localhost/health`, 30s/10s/3.
- Network: `tuc-network`. Reachable through gateway `nginx-gateway` at `http://localhost:8080/analytics-refactor/` (compose `homepage: ./` keeps relative paths).

---

## 17. Environment Variables

Frontend (`.env`):

```bash
REACT_APP_AUTH_USERNAME=admin
REACT_APP_AUTH_PASSWORD=<change-me>
REACT_APP_ADMIN_PASSWORD=<change-me>
REACT_APP_SESSION_TIMEOUT=3600000
REACT_APP_SESSION_STORAGE_KEY=analytics_session
REACT_APP_MAX_LOGIN_ATTEMPTS=5
REACT_APP_LOCKOUT_DURATION=900000
REACT_APP_DEV_MODE=true
NODE_ENV=development
```

`vite.config.ts` must shim `process.env` so `auth.config.tsx` keeps working: `define: { 'process.env': process.env }` (or migrate to `import.meta.env.VITE_*` keys).

---

## 18. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | App builds with zero TypeScript errors and zero lint errors |
| AC-2 | `AuthGate` blocks unauthenticated users from rendering the dashboard; LoginScreen shown |
| AC-3 | After 5 failed login attempts, the account locks for 15 minutes; UI shows countdown |
| AC-4 | All 5 charts (`YearOverYear`, `FunnelEfficiency`, `Seasonal`, `QualityQuantity`, `PerformanceScorecard`) render with seeded data |
| AC-5 | `processRawData` correctly computes `acceptanceRate = round(accepted/applicants*1000)/10` |
| AC-6 | `calculateYearlyData` aggregates monthly rows into one row per year, sorted ascending |
| AC-7 | `calculateAllTimeStats` returns correct totals across the seeded dataset |
| AC-8 | Theme switcher cycles light/dark/high-contrast via `data-theme` attribute on `<html>` |
| AC-9 | Filter changes propagate to every chart via `FilterContext` |
| AC-10 | Admin Panel is gated by a second password prompt; opens audit log + import + test tabs |
| AC-11 | Data Import accepts CSV and XLSX, validates schema, persists to localStorage, and reloads charts |
| AC-12 | Export of any chart produces PNG, PDF, CSV, and XLSX deliverables; each export emits an audit entry |
| AC-13 | All charts have `role="region"`, `aria-labelledby`, `aria-describedby`, and an accessible "View as Table" toggle |
| AC-14 | Keyboard shortcuts Ctrl+P / Ctrl+E / Ctrl+F operate as documented; Esc closes modals |
| AC-15 | `KeyboardShortcutsAnnouncer` emits `aria-live` updates for each shortcut activation |
| AC-16 | Coverage â‰¥ 70% across branches/functions/lines/statements |
| AC-17 | Playwright `dashboard.test.js` and `accessibility.test.js` pass headless |
| AC-18 | Dockerfile produces an nginx-served image; `/health` returns 200; SPA deep-link refreshes 200 |
| AC-19 | `performSecurityChecks()` runs at boot and logs warnings for weak/default credentials |
| AC-20 | Audit log persists across reloads (capped at 1000 entries) |
