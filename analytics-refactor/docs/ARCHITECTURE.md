# Architecture

## Overview

The dashboard is a single-page React application following a layered architecture:

```
Browser
  └── App.tsx  (auth gate + theme provider)
        └── AdvancedAnalytics.tsx  (main layout)
              ├── DashboardHeader.tsx  (controls: date, metrics, export)
              ├── AllTimeStatsBanner.tsx  (aggregate KPIs)
              ├── ChartSection.tsx  (5 chart cards)
              │     ├── YearOverYearChart.tsx
              │     ├── FunnelChart.tsx
              │     ├── CorrelationChart.tsx
              │     ├── SeasonalChart.tsx
              │     └── ScorecardChart.tsx
              ├── DataTable.tsx  (sortable / filterable table)
              ├── ChartWithTable.tsx  (chart + accessible table toggle)
              └── ExportModal.tsx  (PDF / CSV / Excel)
```

## Data Flow

```
raw JSON (public/data/)
  → useAnalyticsData hook
      → dataValidation.js  (validate, normalise)
      → analyticsCalculations.js  (aggregate, trend, funnel)
      → processedMetrics (memoised)
          → chart components (read-only props)
          → DataTable (read-only props)
          → ExportModal (snapshot on open)
```

## Key Files

| Path | Role |
|---|---|
| `src/hooks/useAnalyticsData.js` | Fetch, validate, cache, expose processed data |
| `src/utils/analyticsCalculations.js` | Pure functions: yearly totals, trends, rates |
| `src/utils/dataValidation.js` | Schema validation, field checks, error reporting |
| `src/services/AuthService.tsx` | JWT-based admin authentication |
| `src/components/analytics/AdvancedAnalytics.tsx` | Root layout component |
| `src/components/export/ExportModal.tsx` | PDF/CSV/XLSX export orchestration |

## State Management

No external store. State lives in component hooks:

- `useAnalyticsData` — all data, loading, error states
- `useState` — UI state (modals, active tab, date range, selected metrics)
- `localStorage` — auth token, theme preference

## Theme System

Three themes toggled via CSS custom properties (`--bg-primary`, `--text-primary`, etc.):
- `light` (default)
- `dark`
- `high-contrast` (WCAG AAA target)

Theme class applied to `<html>` element; Tailwind `dark:` variants respond automatically.

## Accessibility Architecture

- All interactive elements have `aria-label` or visible label
- Charts have `role="region"` + `aria-labelledby` headings + `aria-describedby` sr-only descriptions
- Sortable table headers use `aria-sort` (`ascending`/`descending`/`none`)
- Toggle buttons use `aria-pressed` (string `'true'`/`'false'`)
- `progressbar` role has `aria-label`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Keyboard: Tab navigates all controls; Enter/Space activates buttons
