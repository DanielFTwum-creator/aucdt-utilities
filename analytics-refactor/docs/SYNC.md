# SYNC.md — Session State Handoff
**Generated:** 2026-02-04
**Purpose:** Full state dump for claude.ai continuation. Read this first before touching any code.

---

## 1. Workspace Layout

```
tuc-utilities/
├── analytics-refactor/     ← PRIMARY project (this repo root for git)
│   ├── src/                ← React source
│   ├── docs/               ← SRS_FINAL.md, this file
│   ├── build/              ← Latest production build (SERVING on :3000)
│   ├── .env                ← Dev credentials (see §3)
│   └── ...
└── tsapro/                 ← SECONDARY project (tracked in same git repo)
    ├── src/                ← Vite + React + TypeScript
    ├── docs/               ← SRS_FINAL.md, guides, SVGs
    ├── dist/               ← Production build
    ├── .npmrc              ← ci=true
    └── vite.config.ts      ← base: './', chunkSizeWarningLimit: 600
```

Git repo root is `analytics-refactor/`. Both `analytics-refactor/` and `../tsapro/` changes appear in `git status`.

---

## 2. Build & Serve Status (as of handoff)

| Project | Toolchain | Build Status | Served |
|---|---|---|---|
| analytics-refactor | react-scripts 5.0.1 | Clean, 0 warnings | `http://localhost:3000` (`npx serve -s build -p 3000`) |
| tsapro | Vite + pnpm | Clean, 0 warnings | Not currently served |

### analytics-refactor build output (gzipped)
```
346.9 kB    main.js
 92.43 kB   955.chunk.js
 46.32 kB   146.chunk.js
 42.88 kB   137.chunk.js
  8.68 kB   43.chunk.js
  7.08 kB   main.css          ← Tailwind utilities present (verified)
```

---

## 3. Credentials (dev only)

| Variable | Value | Where used |
|---|---|---|
| `REACT_APP_ADMIN_USERNAME` | `admin` | LoginScreen (`AdvancedAnalytics.jsx`) |
| `REACT_APP_ADMIN_PASSWORD` | `analytics2024` | LoginScreen |
| `REACT_APP_ADMIN_PANEL_PASSWORD` | `admin2024` | AdminPanel.js (inner password prompt) |

All three are in `.env` and documented in `.env.example`. The panel password was moved from a hardcoded literal to `process.env.REACT_APP_ADMIN_PANEL_PASSWORD` in this session.

---

## 4. What Changed This Session (analytics-refactor)

### 4.1 Tailwind v4 → v3 downgrade (CRITICAL fix)
Tailwind v4 (`@tailwindcss/postcss`) does not work with `react-scripts 5.0.1`. The PostCSS pipeline in CRA does not invoke the v4 content-scanning step, so utility classes were never generated — the app rendered with zero styles.

| File | What changed |
|---|---|
| `package.json` | Removed `@tailwindcss/postcss`. Changed `tailwindcss` `^4.1.18` → `^3.4.14` (resolved 3.4.19). |
| `postcss.config.js` | Plugin key: `'@tailwindcss/postcss': {}` → `tailwindcss: {}` |
| `src/index.css` | `@import "tailwindcss"` → three v3 directives (`@tailwind base/components/utilities`) |
| `tailwind.config.js` | **New file.** Content scan: `./src/**/*.{js,jsx,ts,tsx}`. No theme extensions needed — all custom classes are plain CSS in component `<style>` blocks and `accessibility.css`. |
| `pnpm-lock.yaml` | Regenerated via `pnpm install --no-frozen-lockfile` |

### 4.2 Admin panel password → env var
`AdminPanel.js` line 33: `const ADMIN_PASSWORD = 'admin2024'`
→ `const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PANEL_PASSWORD || 'admin2024'`

Added `REACT_APP_ADMIN_PANEL_PASSWORD` to `.env` and `.env.example`.

### 4.3 Stale backup deleted
`src/components/analytics/AdvancedAnalytics.jsx.backup` removed.

### 4.5 Post-import crash fix (CRITICAL)
After importing a phpMyAdmin export via the Admin panel, the app crashed on reload with:
`TypeError: Cannot read properties of undefined (reading 'substring')`
plus 427 validation warnings.

**Root cause:** `DataImportService.transformData()` converts keys to lowercase (`month`, `signups`…) before writing to localStorage. On reload `processRawData` and `validateDataIntegrity` only looked for uppercase (`MONTH`, `SIGNUPS`…) — so every field resolved to `undefined`.

| File | What changed |
|---|---|
| `analyticsCalculations.js` | `processRawData`: added `.filter()` guard for missing month; each field now resolves `d.UPPER ?? d.lower` |
| `dataValidation.js` | `validateDataIntegrity`: field presence/value checks use `has()/val()` helpers accepting both cases. Duplicate-month check also fixed. |
| `useAnalyticsData.js` | Fallback data updated to `export (6).json` — added `2026-02` record, corrected `2026-01` SIGNUPS 46→47 |

**localStorage key:** `imported_analytics_data` — this is what gets read on reload. Format is lowercase keys (output of `transformData`). Both formats now handled everywhere in the pipeline.

### 4.6 Efficiency formula & validation fix
**Root cause:** `efficiency` included `registered` in the denominator (`accepted / (accepted + rejected + waitlisted + registered)`). `registered` is a downstream outcome of `accepted`, not a parallel disposition — including it deflated the metric. The validation rule `registered > accepted → error` also fired on valid data because students can register in a later month than they were accepted.

| File | What changed |
|---|---|
| `analyticsCalculations.js` | Line 47: removed `registered` from efficiency denominator. Now `accepted / (accepted + rejected + waitlisted)`. |
| `dataValidation.js` | Lines 103-106: hard error `registered > accepted` replaced with a soft warning that only triggers at 1.5× (`registered > accepted * 1.5`). |

### 4.7 Logout-on-import fix
After a successful data import the app did `window.location.reload()` (line 399). Auth state (`isAuthenticated`) is purely in React component state — no localStorage persistence — so the hard reload sent the user back to the login screen.

| File | What changed |
|---|---|
| `AdvancedAnalytics.jsx` | Replaced `setTimeout → window.location.reload()` with a direct call to `refetch()` (already in scope from `useAnalyticsData`). The hook re-reads `imported_analytics_data` from localStorage with no page reload. |

### 4.4 Items confirmed already done (no changes needed)
These were listed as gaps in the SRS Appendix C but were already implemented in prior sessions:
- **LoginScreen audit logging** — uses imported `auditLogger` singleton correctly at lines 103, 113, 130 (not `window.auditLogger`).
- **TestPanel wired into AdminPanel** — imported at line 4, rendered as 5th tab ("System Test") at line 463.
- **selectedMetrics filter** — fully wired: `FilterPanel` → `handleApplyFilters` (line 349 sets state) → `useAnalyticsData` Step 3 (lines 131-145 zeroes unselected metrics).

---

## 5. What Changed This Session (tsapro)

All tsapro work was done in an earlier session and is already complete:

| Change | Detail |
|---|---|
| SRS consolidation | 8 fragmented SRS files → single `docs/SRS_FINAL.md` (v4.0). All naming standardised to TSAPro / Techbridge. |
| `vite.config.ts` | Added `base: './'` and `build: { chunkSizeWarningLimit: 600 }` |
| `.npmrc` | Created with `ci=true` for non-TTY pnpm installs |
| `index.html` | Removed stale `<link rel="stylesheet" href="/index.css">` (no file existed) |
| `App.tsx` | Code-split DashboardPage, AdminPage, SelfTestPage via `React.lazy()` + `<Suspense>`. LoginPage and HistoryPage remain eager. |
| Deleted | `SRS.tex`, `SRS_PART1-4.md`, `SRS_ASAPro_Final.md`, `SRS.tex` (root + docs/) |

---

## 6. Uncommitted Changes (full git diff --stat)

All changes below are staged-but-not-committed (actually unstaged — `git add` has not been run):

**analytics-refactor (this project):**
- Modified: `.env.example`, `package.json`, `pnpm-lock.yaml`, `postcss.config.js`, `src/index.css`, `src/components/admin/AdminPanel.js`, `src/components/analytics/AdvancedAnalytics.jsx`, `src/components/analytics/hooks/useAnalyticsData.js`, `src/components/analytics/utils/analyticsCalculations.js`, `src/components/analytics/utils/dataValidation.js`
- New (untracked): `docs/SRS_FINAL.md`, `tailwind.config.js`, `docs/SYNC.md` (this file)
- Deleted: 31 obsolete docs files (old SRS versions, phase notes, bulletproof snapshots, migration guides)

**tsapro (sibling dir, same repo):**
- Modified: `App.tsx`, `index.html`, `vite.config.ts`, `.claude/settings.local.json`
- New (untracked): `.npmrc`, `docs/SRS_FINAL.md`
- Deleted: `SRS.tex`, `docs/SRS.md`, `docs/SRS.tex`, `docs/SRS_ASAPro_Final.md`, `docs/SRS_PART1-4.md`

---

## 7. Remaining Work (from SRS_FINAL Appendix C)

| Priority | Task | Notes |
|---|---|---|
| MEDIUM | Replace PDF logo placeholder with actual embedded logo | jsPDF uses a coloured rectangle + "TUC" text; real logo URL is commented out in ExportService.js:182. |
| LOW | Remove unused packages | `html2canvas` (installed, never imported), `react-datepicker` (optional dep, not used). Confirm `date-fns` usage before removing. |
| LOW | Add drag-and-drop to DataImportModal | Currently file-selector only. Nice-to-have. |
| — | Commit all changes | Nothing has been committed yet. ~21k lines of deleted docs, config fixes, new files. |

Everything else from the HIGH/MEDIUM list has been resolved (TestPanel wired, LoginScreen audit fixed, passwords env-var-driven, filter wired, efficiency formula corrected, logout-on-import fixed).

---

## 8. Key Architecture Facts (for quick context)

- **Single-page, client-side only.** No backend. All data in `localStorage`.
- **Auth is dual-layer:** LoginScreen (dashboard gate) + AdminPanel inner password prompt. Both env-var driven with fallback defaults.
- **Data flow:** `useAnalyticsData` hook → fetches from `localStorage` (or fallback hardcoded data) → `processRawData` → date filter → metric filter → 6 calculated views (raw, yearly, funnel, correlation, seasonal, radar) → 5 Recharts components.
- **Styling:** Tailwind v3 utility classes for layout/colours. Custom theming (light/dark/high-contrast) via CSS custom properties in `accessibility.css` and inline `<style>` blocks. No Tailwind theme extensions needed.
- **Audit trail:** `AuditLogger.js` singleton. All auth events, filter changes, exports, imports, admin actions logged. Persisted in `localStorage` key `audit_logs`. Max 1000 entries.
- **AdminPanel tabs:** Audit Logs | Statistics | Data Import | Settings | System Test (TestPanel.jsx, 504 lines, fully functional).
- **Export:** PDF (jsPDF), CSV, Excel (xlsx, 3 sheets). Logo in PDF is a placeholder coloured rectangle.
- **Tests:** Unit tests in `__tests__/`, E2E via Playwright (`e2e/dashboard.test.js`).

---

## 9. How to Resume

1. Read this file.
2. The app is already built and serving at `http://localhost:3000`. Test in browser.
3. For dev mode: `cd analytics-refactor && pnpm dev` (or `npx react-scripts start`).
4. For a fresh production build: `CI=true npx react-scripts build` then `npx serve -s build -p 3000`.
5. If you need to change deps: `pnpm install --no-frozen-lockfile` (CI env sets frozen-lockfile by default).
6. Commit when ready — see §6 for the full changeset.
