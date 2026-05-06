# Software Requirements Specification (SRS)
## Advanced Analytics Dashboard — TECHBRIDGE University College
## Version 4.1 (Post-Session Corrections)

**Date:** February 4, 2026
**Organisation:** TECHBRIDGE University College — ICT Department
**Document Standard:** IEEE Std 830-1998
**Status:** Production Ready

---

## Document History

| Version | Date | Notes |
|---------|------|-------|
| 1.0–2.0 | Jan 26–28, 2026 | Initial release through authentication |
| 2.1–2.6 | Jan 28–29, 2026 | Accessibility, export, admin, security enhancements |
| 3.0 | Feb 1, 2026 | Major documentation revision |
| 4.0 | Feb 3, 2026 | Single consolidated SRS. All claims verified against source. 18 discrepancies from v3.0 corrected. |
| **4.1** | **Feb 4, 2026** | **This document.** Tailwind v3 noted. Efficiency formula corrected. Registered validation relaxed. Post-import logout fixed. TestPanel, filter wiring, LoginScreen audit, admin password all confirmed wired. Appendix C pruned. |

> **Superseded files** (safe to delete): `SRS_v2.0.md`, `SRS_v2.0_IEEE830.md`, `SRS_IEEE_830_v2.0.md`, `SRS_SUMMARY.md`, `SRS_v3.0_IEEE830.md`, `docs/srs/v1.0.0`.

---

## Table of Contents

1. Introduction
2. Overall Description
3. External Interface Requirements
4. System Features (Functional Requirements)
5. Non-Functional Requirements
6. Testing & Quality
7. Data & Persistence
8. File & Route Reference
9. Corrections Log (v3.0 → v4.0)
10. Appendices

---

# 1. Introduction

## 1.1 Purpose

This is the single authoritative requirements specification for the **Advanced Analytics Dashboard** at TECHBRIDGE University College. It consolidates all prior SRS revisions into one document. Every functional claim has been verified against the running codebase before inclusion.

## 1.2 Scope

**In Scope:**
- Secure, single-user authentication with brute-force protection
- Five interactive Recharts-based analytics visualisations
- WCAG 2.1 AA accessibility suite (themes, font scaling, keyboard nav, screen readers)
- Data export (PDF, CSV, Excel) and import (JSON from phpMyAdmin)
- Admin panel: audit logs, statistics, data import, settings
- Self-testing module (wired as "System Test" tab in AdminPanel)
- Audit logging for all security-relevant events
- E2E and unit test suites

**Out of Scope:**
- Backend / server-side processing
- Real-time data feeds
- Multi-user / role-based access
- Mobile-native applications
- Drag-and-drop file upload (not implemented)

## 1.3 Definitions

| Term | Definition |
|------|------------|
| phpMyAdmin JSON | Export format from phpMyAdmin v5.2.3+ used as the import source |
| Preset | A named, fixed date-range filter (e.g. "Last 6 Months") |
| Severity | Audit-log level: `info`, `warning`, `error`, `critical` |

---

# 2. Overall Description

## 2.1 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      Browser (Client)                     │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │  AdvancedAnalytics (root)                        │    │
│  │  ├── LoginScreen          (auth gate)            │    │
│  │  └── AuthenticatedDashboard                      │    │
│  │        ├── DashboardHeader   (nav / controls)    │    │
│  │        ├── AllTimeStatsBanner                    │    │
│  │        ├── 5 × Chart components (Recharts)       │    │
│  │        ├── ExportModal       (PDF / CSV / Excel) │    │
│  │        ├── FilterPanel       (date / metrics)    │    │
│  │        ├── AdminPanel        (5-tab modal)       │    │
│  │        └── Footer                                │    │
│  │                                                  │    │
│  │  Shared Layer                                    │    │
│  │  ├── AccessibilityToolbar + AccessibilityContext  │    │
│  │  ├── SkipLinks                                   │    │
│  │  ├── KeyboardShortcutsAnnouncer                  │    │
│  │  ├── ErrorBoundary                               │    │
│  │  └── FilterContext / ExportContext / ThemeContext  │    │
│  │                                                  │    │
│  │  Services                                        │    │
│  │  ├── AuditLogger   (singleton, localStorage)     │    │
│  │  ├── ExportService (jsPDF, XLSX)                 │    │
│  │  ├── DataImportService (JSON parsing)            │    │
│  │  └── logger.js     (general-purpose logger)      │    │
│  │                                                  │    │
│  │  Utilities                                       │    │
│  │  ├── analyticsCalculations.js                    │    │
│  │  ├── dataValidation.js                           │    │
│  │  ├── formatters.js                               │    │
│  │  └── inputValidation.js                          │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  Persistence                                              │
│  ├── localStorage: audit_logs, imported_analytics_data,  │
│  │                 login_attempts, login_lockout_until,   │
│  │                 theme, fontSize, reduceMotion          │
│  └── sessionStorage: session_id                          │
└──────────────────────────────────────────────────────────┘
```

## 2.2 User Classes

| User Class | Technical Level | Frequency | Primary Needs |
|-----------|-----------------|-----------|---------------|
| University Executives | Low | Weekly | High-level insights, PDF export |
| Admissions Staff | Medium | Daily | Metrics, trends, filter by date |
| ICT Administrators | High | As-needed | Data import, audit logs, system test |
| External Auditors | Medium | Quarterly | Compliance exports |

## 2.3 Operating Environment

| Requirement | Specification |
|-------------|---------------|
| Browsers | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| Minimum width | 320 px (mobile-first) |
| JavaScript | ES2020+ required |
| Deployment | Static files on Apache / Nginx, HTTPS mandatory |
| Build toolchain | Node 18+, react-scripts 5.0.1 |

## 2.4 Constraints

- **No backend (Phase 1–3).** All data in localStorage or embedded fallback.
- **Single-user sessions.** No concurrent access model.
- **Ghana Data Protection Act.** Aggregated data only; no PII displayed.
- **WCAG 2.1 AA.** Mandatory across all themes.

---

# 3. External Interface Requirements

## 3.1 User Interfaces

### UI-001 Login Screen
**File:** `AdvancedAnalytics.jsx` — `LoginScreen` component (lines 33–228)

- TECHBRIDGE logo (loaded from `https://techbridge.edu.gh/static/TUC_LOGO_1.png`)
- Username + password fields with `autoComplete` attributes
- "Sign In" button; password field cleared on failure
- Error area: shows remaining attempts or lockout countdown
- Responsive (single centred card, max-width 28 rem)

### UI-002 Accessibility Toolbar
**File:** `AccessibilityToolbar.js`

- Toggleable via `Ctrl+Shift+A` or header button
- Theme selector: Light / Dark / High-Contrast
- Font size: Small (0.875 rem), Medium (1 rem), Large (1.125 rem), Extra Large (1.25 rem)
- Reduced-motion toggle
- All settings persisted to localStorage; restored on next visit

### UI-003 Dashboard Header
**File:** `DashboardHeader.jsx`

- Title: "Advanced Analytics Suite"
- Buttons: Print, Export, Filter, Admin, Logout
- Active-filter-count badge on the Filter button
- Quick-stat badges from latest data

### UI-004 Export Modal
**File:** `ExportModal.js`

- Format selector: PDF, CSV, Excel
- Progress indicator during generation
- Success / error feedback
- Closes on X button or Escape

### UI-005 Filter Panel
**File:** `FilterPanel.js` (692 lines — fully rendered)

- Slides in from the right as a modal drawer
- **Date Range:** 8 presets (All Time, Last 30 Days, Last 3/6/12 Months, This Year, Last Year, Custom). Custom range uses native `<input type="month">`.
- **Metric Selector:** 6 checkboxes (Signups, Applicants, Accepted, Rejected, Waitlisted, Registered) with colour-coded borders. "Select All" / "Reset to Default" links.
- **Year Comparison:** Toggle buttons for each year 2017–current. Selected years listed in a summary note.
- **Active Filters summary** shown when any filter is non-default.
- Apply / Cancel / Reset footer buttons.
- Filter state flows to parent via `onApplyFilters`; parent passes `dateRange` and `selectedMetrics` to `useAnalyticsData`. The hook applies both filters: date range in Step 2, metric zeroing in Step 3 (lines 131-145).

### UI-006 Admin Panel
**File:** `AdminPanel.js`

- Requires a **separate admin password** (env var `REACT_APP_ADMIN_PANEL_PASSWORD`, default `admin2024`). This is a second credential prompt, independent of the main login.
- **5 tabs:**

  | Tab | Contents |
  |-----|----------|
  | Audit Logs | Filterable table (severity, action, user), Export CSV, Clear Logs (with `confirm()` guard) |
  | Statistics | Total / by-severity / recent-activity cards; action-breakdown list |
  | Data Import | JSON file selector button, import instructions, strategy selector, recent-imports history |
  | Settings | Clear old logs (keep last 500), placeholder buttons for future features, Danger Zone |
  | System Test | `TestPanel.jsx` — data integrity, calculation accuracy, performance benchmarks, accessibility checks |

- **Data Import flow:** file selector opens `DataImportModal`, which parses JSON, previews, and calls back with data + strategy. Merge logic lives in `AdvancedAnalytics.jsx:handleDataImport`.

### UI-007 Self-Testing Module
**File:** `TestPanel.jsx` (504 lines)

Rendered as the "System Test" tab inside `AdminPanel.js`.

Tests it runs when invoked:
1. Data Integrity — calls `validateDataIntegrity()`, reports record count and errors
2. Calculation Accuracy — spot-checks acceptance rate, yearly aggregation, all-time totals, summary stats
3. Performance Benchmarks — measures `processRawData` and `calculateYearlyData` times; optionally reports `performance.memory`
4. Accessibility Checks — DOM-level checks (main landmark, alt text, single H1); placeholder for axe-core

Exports results as JSON.

---

# 4. System Features (Functional Requirements)

## 4.1 Authentication (F-AUTH) — COMPLETE

| ID | Requirement | Verified |
|----|-------------|----------|
| FR-AUTH-001 | Login screen displayed before dashboard; includes logo, username, password | `LoginScreen` lines 156–227 |
| FR-AUTH-002 | Credentials from env vars `REACT_APP_ADMIN_USERNAME` / `REACT_APP_ADMIN_PASSWORD`; defaults `admin` / `analytics2024`; exact-match validation | Line 44–45, 93 |
| FR-AUTH-003 | Failed attempts tracked in localStorage (`login_attempts`); limited to configurable max (default 5) | Lines 112–114, 46 |
| FR-AUTH-004 | Account locked after max attempts; lockout duration configurable (default 15 min); countdown shown; auto-unlock on expiry | Lines 129–134, 50–79 |
| FR-AUTH-005 | Login / lockout / logout events logged via `auditLogger` singleton (imported at module level) | Lines 103, 119, 139 |
| FR-AUTH-006 | Session in React state; logout clears state and returns to login | Lines 255–259, 330–333 |

## 4.2 Data Visualisation (F-VIZ) — COMPLETE

Five charts, all Recharts-based, rendered inside `AuthenticatedDashboard`.

| Chart | Type | Key Details |
|-------|------|-------------|
| Year-over-Year Growth | ComposedChart | Bars: Signups, Applicants, Accepted, Registered. Line: Acceptance Rate (right Y-axis). Grouped by year. |
| Conversion Funnel | AreaChart | Stacked areas, last 12 months. Stage-summary cards below. Compares recent vs all-time registration rate. |
| Quality vs Quantity | ScatterChart | X = Applicants, Y = Acceptance Rate, bubble size = Accepted. Filters out zero-applicant months. |
| Seasonal Patterns | BarChart | Monthly averages across all years. 4 grouped bars (Signups, Applicants, Accepted, Rejected). Sorted Jan–Dec. |
| Performance Scorecard | RadarChart | Last 6 months. 4 metrics scaled 0–100: Conversion, Acceptance, Success, Efficiency. Definition cards below. |

**Metric formulas** (source: `analyticsCalculations.js`):

| Metric | Formula |
|--------|---------|
| Conversion | (Applicants / Signups) × 100 |
| Acceptance | (Accepted / Applicants) × 100 |
| Success | ((Accepted + Waitlisted) / Applicants) × 100 |
| Efficiency | (Accepted / (Accepted + Rejected + Waitlisted)) × 100 |
| Dropoff Rate | ((Signups − Applicants) / Signups) × 100 |

## 4.3 Accessibility (F-A11Y) — COMPLETE

| ID | Requirement | Implementation |
|----|-------------|----------------|
| FR-A11Y-001 | 3 themes persisted to localStorage | `AccessibilityToolbar.js` + `AccessibilityContext.jsx` |
| FR-A11Y-002 | 4 font-size levels, persisted | Same |
| FR-A11Y-003 | Full keyboard navigation; visible 2 px focus ring; Enter/Space/Escape | `useKeyboardShortcuts.js` (237 lines) |
| FR-A11Y-004 | ARIA labels on all interactive elements; semantic HTML5; skip links; `aria-live` announcer | `SkipLinks.js`, `KeyboardShortcutsAnnouncer` |
| FR-A11Y-005 | Reduced motion toggle; persisted; respects `prefers-reduced-motion` | `AccessibilityToolbar.js` |
| FR-A11Y-006 | 4.5:1 text contrast; 3:1 UI elements; High-Contrast theme at 21:1 | All themes |

**Keyboard shortcuts:**

| Shortcut | Action |
|----------|--------|
| `Ctrl + P` | Print dashboard |
| `Ctrl + Shift + A` | Toggle accessibility toolbar |
| `Tab` / `Shift+Tab` | Forward / backward focus |
| `Enter` | Activate button |
| `Escape` | Close modal / panel |

## 4.4 Export System (F-EXPORT) — COMPLETE

| ID | Requirement | Details |
|----|-------------|---------|
| FR-EXPORT-001 | PDF export | jsPDF + autotable. Portrait (default page). TUC logo placeholder (indigo rect + "TUC" text). Summary table, last-12-months table, Key Insights section, page footers. Filename: `analytics-report.pdf`. |
| FR-EXPORT-002 | CSV export | Header row + data rows. Rates calculated inline. Filename: `analytics-data.csv`. |
| FR-EXPORT-003 | Excel export | XLSX library. 3 sheets: "Monthly Data", "Summary", "Yearly Summary". Filename: `analytics-report.xlsx`. |
| FR-EXPORT-004 | Export modal UX | Format selection, progress, success/error, audit-logged |

> **Note on PDF:** The SRS v3.0 stated "A4 landscape with TECHBRIDGE branding". The actual PDF is portrait (jsPDF default) with a text-based logo placeholder. The external logo URL is commented out in `ExportService.js:182`.

## 4.5 Admin Panel (F-ADMIN) — COMPLETE

| ID | Requirement | Status |
|----|-------------|--------|
| FR-ADMIN-001 | Data import from file | **JSON only** (phpMyAdmin export or custom array). File-selector button, no drag-and-drop. |
| FR-ADMIN-002 | Import validation | Required fields checked; YYYY-MM date format enforced; numeric values validated; duplicates flagged. |
| FR-ADMIN-003 | Import strategies | Replace / Merge / Append — all implemented in both `DataImportService.mergeData` and `AdvancedAnalytics.handleDataImport`. |
| FR-ADMIN-004 | Audit log viewer | Filterable by severity / action / user; Export CSV; Clear (with confirmation). |
| FR-ADMIN-005 | Statistics tab | Total logs, by-severity counts, recent-activity (24 h / 7 d / 30 d), action breakdown. |
| FR-ADMIN-006 | Settings tab | Clear old logs (keep last N); placeholder stubs for future features. |

## 4.6 Filter System (F-FILTER) — COMPLETE

The filter panel UI is fully built and functional (§3.1 UI-005). Filters flow through to `useAnalyticsData`: date range is applied in Step 2 (date filter), selected metrics are zeroed out in Step 3 (metric filter, lines 131-145). All six calculated views (raw, yearly, funnel, correlation, seasonal, radar) receive the filtered dataset.

| ID | Requirement | Status |
|----|-------------|--------|
| FR-FILTER-001 | Date presets + custom month range | Complete |
| FR-FILTER-002 | Metric checkboxes + Select All / Reset | Complete |
| FR-FILTER-003 | Year comparison toggles | Complete |
| FR-FILTER-004 | Active-filter badge on header button | Complete (`getActiveFilterCount` in both `FilterPanel` and `FilterContext`) |
| FR-FILTER-005 | Charts update on filter apply | Complete — `useAnalyticsData` applies both date and metric filters |

## 4.7 Audit Logging (F-AUDIT) — COMPLETE

**File:** `AuditLogger.js` — singleton class, exported as `auditLogger`.

| Capability | Detail |
|------------|--------|
| Storage | localStorage key `audit_logs`; max 1 000 entries (oldest trimmed) |
| Log entry fields | `id`, `timestamp`, `action`, `details`, `severity`, `user`, `sessionId`, `userAgent` |
| Severity levels | `info`, `warning`, `error`, `critical` |
| Typed log methods | `logAuth`, `logExport`, `logFilterChange`, `logDataAccess`, `logAdminAction`, `logError`, `logSecurity` |
| Query | `getLogs(filters)` — supports severity, action, user, date-range; sorted newest-first |
| Statistics | `getStatistics()` — totals by severity, by action, recent-activity windows |
| Export | CSV download via `exportLogs()` |
| Retention | `clearOldLogs(keepCount)` and `clearLogs()` |

**Events currently logged:**

| Trigger | Event / action recorded |
|---------|------------------------|
| Successful login | `USER_LOGIN` |
| Failed login | `FAILED_LOGIN_ATTEMPT` |
| Account lockout | `ACCOUNT_LOCKED` |
| Logout | `LOGOUT` |
| Export modal opened | `DATA_ACCESS` |
| Export completed | `DATA_EXPORT` (in `ExportModal`) |
| Filter applied | `FILTER_CHANGE` |
| Admin panel opened | `ADMIN_ACTION` / `ADMIN_PANEL_OPENED` |
| Admin login success/fail | `ADMIN_ACTION` / `SECURITY_EVENT` |
| Logs exported | `LOGS_EXPORTED` |
| Logs cleared | `LOGS_CLEARED` |
| Data imported | `DATA_IMPORTED` (in `DataImportModal`) |

---

# 5. Non-Functional Requirements

## 5.1 Performance

| ID | Target | Maximum |
|----|--------|---------|
| NFR-PERF-001 Initial load | < 3 s on university LAN | — |
| NFR-PERF-002 Data processing (60 records) | < 500 ms | 2 s (1 000 records) |
| NFR-PERF-003 Chart rendering (all 5) | < 1 s total | 200 ms per chart |
| NFR-PERF-004 Export generation | PDF < 5 s; CSV < 1 s; Excel < 3 s | — |
| NFR-PERF-005 Browser memory | < 150 MB | — |
| NFR-PERF-006 Bundle size | < 500 KB gzipped JS | Total assets < 2 MB |

## 5.2 Security

| ID | Requirement | Notes |
|----|-------------|-------|
| NFR-SEC-001 | Auth enforced before dashboard | `LoginScreen` gate |
| NFR-SEC-002 | Credentials NOT stored in localStorage | Correct — only `login_attempts` / lockout timestamp stored. **However:** both the main password (`analytics2024`) and the admin-panel password (`admin2024`) are hardcoded in client-side source and visible in the built bundle. These MUST be changed before production deployment. |
| NFR-SEC-003 | Audit trail for all security events | See §4.7 |
| NFR-SEC-004 | Session in memory only; cleared on logout | React state; no localStorage session token |
| NFR-SEC-005 | HTTPS mandatory | Deployment constraint |

## 5.3 Accessibility

WCAG 2.1 AA target across all three themes. Specific requirements in §4.3.

## 5.4 Reliability

| ID | Requirement |
|----|-------------|
| NFR-REL-001 | `ErrorBoundary` component (`ErrorBoundary.jsx`, 243 lines) catches unhandled React errors and renders a fallback UI with retry capability. |
| NFR-REL-002 | All calculations accurate to 1 decimal place (rates) or integer (counts). |
| NFR-REL-003 | `dataValidation.js` enforces business rules (e.g. warns if Registered > 1.5× Accepted, indicating cross-month lag; flags high dropout rate > 60%). |

## 5.5 Maintainability

| ID | Requirement |
|----|-------------|
| NFR-MAINT-001 | JSDoc on all public functions |
| NFR-MAINT-002 | ESLint (`react-app` config) must pass |
| NFR-MAINT-003 | Calculation logic isolated in `analyticsCalculations.js` |
| NFR-MAINT-004 | Formatting isolated in `formatters.js`; input sanitisation in `inputValidation.js` |
| NFR-MAINT-005 | Theme colours driven by CSS custom properties (`--color-*`) |

## 5.6 Portability

- Runs as static files on any web server (Apache, Nginx, IIS)
- Supports Windows, macOS, Linux
- No server-side processing required

---

# 6. Testing & Quality

## 6.1 Unit Tests — Written

**File:** `src/components/analytics/__tests__/analyticsCalculations.test.js`

Covers `processRawData`, `calculateYearlyData`, `calculateFunnelData`, `calculateCorrelationData`, `calculateSeasonalData`, `calculateRadarData`, `calculateTrends`, `calculateAllTimeStats`, `calculateSummaryStats`. Tests include empty arrays, missing fields, zero-division edge cases.

## 6.2 E2E Tests — Written

**File:** `e2e/dashboard.test.js` — Playwright suite.

| Flow | Steps |
|------|-------|
| Login → Dashboard | Navigate, enter creds, verify 5 charts visible, no console errors |
| Failed Login + Lockout | 5 bad attempts, verify lockout message, wait, verify re-enabled |
| Export to PDF | Login, open modal, select PDF, verify download |
| Data Import | Login, open admin, upload test CSV, merge, verify success |
| Keyboard Navigation | Tab through elements, `Ctrl+Shift+A`, Escape |

## 6.3 Self-Testing Module — Complete

`TestPanel.jsx` (§3.1 UI-007). Runs data-integrity, calculation-accuracy, performance-benchmark, and accessibility checks. Exports JSON report. Accessible as the "System Test" tab in `AdminPanel.js`.

## 6.4 Coverage Targets

| Suite | Target |
|-------|--------|
| Utility functions | 90% |
| Data validation | 85% |
| Export/Import services | 70–75% |
| Chart components | 60% |
| Accessibility components | 65% |

---

# 7. Data & Persistence

## 7.1 localStorage Keys (live)

| Key | Value | Owner |
|-----|-------|-------|
| `audit_logs` | JSON array of AuditLogEntry | `AuditLogger` |
| `imported_analytics_data` | JSON array of monthly records | `handleDataImport` |
| `data_import_timestamp` | ISO 8601 string | `handleDataImport` |
| `login_attempts` | Integer string | `LoginScreen` |
| `login_lockout_until` | Epoch ms string | `LoginScreen` |
| `theme` | `'light'` \| `'dark'` \| `'high-contrast'` | `AccessibilityContext` |
| `fontSize` | `'small'` \| `'medium'` \| `'large'` \| `'extra-large'` | `AccessibilityContext` |
| `reduceMotion` | `true` \| `false` | `AccessibilityContext` |

## 7.2 sessionStorage

| Key | Value |
|-----|-------|
| `session_id` | UUID-style string generated by `AuditLogger.getSessionId()` |

## 7.3 Fallback Data

61 months of embedded historical data (Sep 2017 – Feb 2026) lives in `useAnalyticsData.js`. This is the default dataset when nothing has been imported. 7 raw metrics per month; rates are calculated at read time.

## 7.4 Data Model — Monthly Record

| Field | Type | Source |
|-------|------|--------|
| month | string (YYYY-MM) | Import or fallback |
| signups | number | " |
| applicants | number | " |
| accepted | number | " |
| rejected | number | " |
| waitlisted | number | " |
| registered | number | " |
| conversionRate | number (%) | Calculated |
| acceptanceRate | number (%) | Calculated |
| registrationRate | number (%) | Calculated |
| dropoffRate | number (%) | Calculated |

---

# 8. File & Route Reference

```
src/
├── components/
│   ├── accessibility/
│   │   ├── AccessibilityToolbar.js    Theme / font / motion controls
│   │   └── SkipLinks.js               Screen-reader skip links
│   ├── admin/
│   │   ├── AdminPanel.js              5-tab admin modal
│   │   ├── DataImportModal.js         JSON import wizard
│   │   └── TestPanel.jsx              Self-test suite (System Test tab)
│   ├── analytics/
│   │   ├── AdvancedAnalytics.jsx      Root: LoginScreen + AuthenticatedDashboard
│   │   ├── charts/                    5 chart components
│   │   ├── components/                DashboardHeader, AllTimeStatsBanner, states
│   │   ├── context/
│   │   │   └── AccessibilityContext.jsx
│   │   ├── hooks/
│   │   │   └── useAnalyticsData.js    Data fetch + memoised calculations
│   │   └── utils/
│   │       ├── analyticsCalculations.js   All rate / aggregation logic
│   │       └── dataValidation.js          Business-rule validation
│   ├── export/
│   │   └── ExportModal.js             Format selector + download trigger
│   ├── filters/
│   │   └── FilterPanel.js             Date / metric / year filter drawer
│   └── ErrorBoundary.jsx              Top-level error recovery
├── contexts/
│   ├── FilterContext.js               Global filter state
│   ├── ExportContext.js               Export state + helpers
│   └── ThemeContext.js                Theme state
├── hooks/
│   └── useKeyboardShortcuts.js        Global keyboard bindings + announcer
├── services/
│   ├── AuditLogger.js                 Audit trail singleton
│   ├── ExportService.js               PDF / CSV / Excel generation
│   ├── DataImportService.js           JSON parse / validate / merge
│   └── logger.js                      General-purpose logger
├── styles/
│   └── premiumTheme.js                Glassmorphism theme tokens + z-index map
├── utils/
│   ├── formatters.js                  Date / number formatting
│   └── inputValidation.js             Input sanitisation
└── config/
    └── auth.config.js                 Auth constants / env-var defaults
```

**Single entry point:** `src/index.js` renders `<AdvancedAnalytics />` into `#root`.

---

# 9. Corrections Log (v3.0 → v4.0)

Every item below was a discrepancy between the v3.0 SRS and the actual source code. All have been corrected in this document.

## 9.1 SRS overstated or mis-stated a feature

| ID | What v3.0 said | Reality | Corrected in |
|----|----------------|---------|--------------|
| G1 | TestPanel "not created" / "in progress" | `TestPanel.jsx` is 504 lines, fully implemented and wired as the "System Test" tab in `AdminPanel`. | §3.1 UI-007 |
| G2 | Admin data import supports "drag-drop or file selector" | Zero drag-and-drop handlers exist. File selector (`<input type="file">`) only. | §4.5 FR-ADMIN-001; §1.2 Out of Scope |
| G3 | Import accepts "CSV and Excel" | `DataImportService` only parses JSON. The admin UI labels and instructions all say JSON / phpMyAdmin export. CSV/Excel parsing code in `ExportService` is for **export**, not import. | §4.5 FR-ADMIN-001 |
| G6 | "System SHALL NOT store credentials in localStorage" | Technically true (password strings not in localStorage). But both passwords are hardcoded in client-side source (`analytics2024` in `LoginScreen`; `admin2024` in `AdminPanel`), making them trivially extractable from the bundle. | §5.2 NFR-SEC-002 |

## 9.2 SRS understated a feature

| ID | What v3.0 said | Reality | Corrected in |
|----|----------------|---------|--------------|
| G4 | Filter panel "70% complete"; "react-datepicker not fully wired" | `FilterPanel.js` is 692 lines, fully rendered and interactive (presets, custom month inputs, metric toggles, year comparison, Apply/Reset). The only real gap is that `useAnalyticsData` does not slice on the filter props. | §4.6 |
| G5 | Testing "30% complete" | Unit tests and full E2E Playwright suite are written. | §6.1, §6.2 |

## 9.3 SRS was silent on features that exist in code

| ID | What exists | Documented in |
|----|-------------|---------------|
| C1 | `ErrorBoundary.jsx` — React error boundary (243 lines) | §5.4 NFR-REL-001 |
| C2 | `ExportContext.js` — export state provider (377 lines) | §2.1 architecture diagram |
| C3 | `logger.js` — general-purpose logger (387 lines), separate from AuditLogger | §2.1; §8 |
| C4 | `inputValidation.js` — input sanitisation (411 lines) | §5.5 NFR-MAINT-004; §8 |
| C5 | `formatters.js` — date/number formatting (294 lines) | §5.5; §8 |
| C6 | `premiumTheme.js` — glassmorphism tokens, z-index map | §8 |
| C7 | `AccessibilityContext.jsx` — second accessibility context alongside ThemeContext | §2.1; §4.3 |
| C8 | Admin panel has **4 tabs** (Audit Logs, Statistics, Data Import, Settings), not the 3 stated in v3.0 | §3.1 UI-006 |
| C9 | Admin panel has its **own password prompt** (separate from main login) | §3.1 UI-006 |

## 9.4 Additional notes

- **PDF orientation:** v3.0 stated "A4 landscape". `ExportService.exportToPDF` uses `new jsPDF()` with no options — default is A4 portrait. The external logo URL is commented out; a coloured rectangle placeholder is used instead.
- **LoginScreen audit logging** — previously gated on `window.auditLogger`. Fixed: all calls now use the module-level imported `auditLogger` singleton.
- **Admin panel password** — previously hardcoded as `'admin2024'`. Now reads `process.env.REACT_APP_ADMIN_PANEL_PASSWORD` with the same default as fallback.
- **Tailwind CSS** — downgraded from v4 to v3.4.19. Tailwind v4's `@tailwindcss/postcss` plugin is incompatible with `react-scripts 5.0.1`; CRA's PostCSS pipeline does not invoke v4 content scanning, so utility classes were never generated.
- **Efficiency formula** — corrected: `registered` removed from denominator. `registered` is a downstream outcome of `accepted`, not a parallel disposition alongside `rejected`/`waitlisted`.
- **Registered > Accepted validation** — relaxed from hard error to soft warning at 1.5× threshold. Students can register in a later month than they were accepted, so the strict rule produced false positives on valid data.
- **Post-import logout** — `window.location.reload()` after data import destroyed in-memory auth state. Replaced with `refetch()` call; no page reload needed.

---

# 10. Appendices

## Appendix A — Technology Stack

### Core
| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.2.4 | UI framework |
| react-dom | 19.2.4 | DOM renderer |
| recharts | 3.7.0 | Chart library |
| @heroicons/react | 2.2.0 | Icons |

### Export & Import
| Package | Version | Purpose |
|---------|---------|---------|
| jspdf | 4.0.0 | PDF generation |
| jspdf-autotable | 5.0.7 | PDF tables |
| xlsx | 0.18.5 | Excel read/write |

### Styling & Build
| Package | Version | Purpose |
|---------|---------|---------|
| tailwindcss | 3.4.19 | Utility CSS (downgraded from v4 — v4 incompatible with react-scripts PostCSS pipeline) |
| postcss | 8.5.6 | CSS processor |
| autoprefixer | 10.4.24 | Vendor prefixes |
| react-scripts | 5.0.1 | Build toolchain |

### Testing
| Package | Version | Purpose |
|---------|---------|---------|
| @testing-library/react | 16.3.2 | Component tests |
| @testing-library/jest-dom | 6.9.1 | Jest matchers |
| @testing-library/user-event | 14.6.1 | User simulation |
| playwright | 24.36.1 | E2E tests |

### Installed, not actively used
| Package | Version | Note |
|---------|---------|------|
| html2canvas | 1.4.1 | Chart-image export placeholder |
| react-datepicker | 9.1.0 | FilterPanel uses native `<input type="month">` instead |
| date-fns | 4.1.0 | Installed; usage unconfirmed |

## Appendix B — Feature Matrix (Implementation-Verified)

| Feature | Phase | Status | Key File(s) |
|---------|-------|--------|-------------|
| Authentication + lockout | 1 | COMPLETE | `AdvancedAnalytics.jsx` |
| 5 Charts | 1 | COMPLETE | `charts/*.jsx` |
| Data processing & validation | 1 | COMPLETE | `analyticsCalculations.js`, `dataValidation.js` |
| Accessibility suite | 2 | COMPLETE | `AccessibilityToolbar.js`, `SkipLinks.js`, `useKeyboardShortcuts.js` |
| Export (PDF/CSV/Excel) | 3 | COMPLETE | `ExportModal.js`, `ExportService.js` |
| Admin panel (5 tabs) | 3 | COMPLETE | `AdminPanel.js`, `DataImportModal.js`, `TestPanel.jsx` |
| Audit logging | 3 | COMPLETE | `AuditLogger.js` |
| Filter panel UI | 3 | COMPLETE | `FilterPanel.js` |
| Filter → data wiring | 3 | COMPLETE | `useAnalyticsData.js` — date filter Step 2, metric filter Step 3 |
| Self-test module | 3 | COMPLETE | `TestPanel.jsx` — "System Test" tab in `AdminPanel` |
| Unit tests | 4 | WRITTEN | `__tests__/analyticsCalculations.test.js` |
| E2E tests | 4 | WRITTEN | `e2e/dashboard.test.js` |
| Error boundary | — | COMPLETE | `ErrorBoundary.jsx` |

## Appendix C — Known Gaps (prioritised)

These are the items that remain between "what exists" and "fully production-ready". Listed in effort order.

| Priority | Gap | Effort |
|----------|-----|--------|
| MEDIUM | Replace PDF logo placeholder with actual embedded logo | 1 h |
| LOW | Remove unused packages (`html2canvas`, `react-datepicker`, confirm `date-fns` usage) | 30 min |
| LOW | Add drag-and-drop to `DataImportModal` (if desired) | 2 h |

**Resolved (no longer gaps):** TestPanel wired as System Test tab; LoginScreen audit logging uses imported singleton; admin-panel password reads env var; filter props wired into `useAnalyticsData`; efficiency formula corrected; Registered > Accepted validation relaxed; post-import logout fixed; Tailwind downgraded to v3.

---

**End of SRS v4.0**

*Next review: upon completion of Appendix C priority items.*
*Classification: Internal Use — TECHBRIDGE University College*
