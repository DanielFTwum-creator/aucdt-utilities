# Changelog — analytics-refactor

> For full history see the root [CHANGELOG.md](../CHANGELOG.md).

---

## [3.0.0] — 2026-02-26

### Added
- `MetricSelector` component — inline metric toggle buttons with `aria-pressed`, per-metric colour coding
- `vitest.e2e.config.ts` — separate Vitest config for Playwright E2E tests (Node environment)
- `docs/` directory — 8 reference documents (README, ARCHITECTURE, API, ADMIN_GUIDE, DEPLOYMENT, TESTING_GUIDE, TROUBLESHOOTING, CHANGELOG)
- Unit tests: `MetricSelector.test.tsx` (7 tests), `StateComponents.test.js` (8 tests, expanded from 3)
- Unit tests: `useAnalyticsData.test.js` — rewritten from Jest to Vitest

### Changed
- `DashboardHeader.tsx` — integrated `MetricSelector` between title and control buttons
- `ChartWithTable.tsx` — `aria-pressed` fixed to string `'true'/'false'` (lines 74, 85)
- `ExportModal.tsx` — `aria-pressed` fixed to string; progressbar `aria-label="Export progress"` added
- `package.json` — `test:e2e` script updated from `node e2e/dashboard.test.js` to `vitest run --config vitest.e2e.config.ts`
- `src/services/AuthService.tsx` — updated comment: TUC-Auth-API

### Branding
- All visible AUCDT/AsanSka University references updated to TUC/Techbridge University College

---

## [2.6.1] — 2026-01-29

### Changed
- Technology stack updates: React 19.2.4, Recharts 3.7.0, Tailwind 4.1.18, Vite 7.3.1

---

## [2.5.5] — 2025-12

### Added
- Phase 2 complete: all 5 chart visualisations
- WCAG 2.1 AA accessibility pass
- Export: PDF, CSV, Excel
- JSON import (phpMyAdmin format)
- Admin panel with audit logging
- Three themes: Light, Dark, High-Contrast

---

## [2.0.0] — 2025-09

### Added
- Phase 1: data abstraction layer, custom hooks, validation
- Year-over-Year chart
- Funnel chart
- Loading / Error / Empty states
