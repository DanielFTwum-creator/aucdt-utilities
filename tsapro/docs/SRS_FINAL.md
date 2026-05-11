# Software Requirements Specification (SRS)
## TSAPro — Techbridge Salary Administration Portal
## Version 4.0 (Consolidated & Implementation-Verified)

**Date:** February 3, 2026
**Prepared for:** Techbridge University College Administration
**Project Status:** All Phases Complete
**Package name:** `tsapro`

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0–2.0 | Oct 2023 | Initial requirements, admin panel & audit logging added |
| 3.0 | Nov 14, 2025 | Full 4-part revision (PART1–PART4). Pre-implementation. |
| 3.1 | Nov 20, 2025 | Condensed single-page summary |
| 3.3 | Feb 3, 2026 | Implementation-verified revision; NFR-2 credential-hygiene issue resolved |
| **4.0** | **Feb 3, 2026** | **This document.** Consolidation of all prior versions into a single authoritative SRS. Naming standardised to TSAPro / Techbridge throughout. |

> **Superseded documents** (safe to delete): `SRS.md`, `SRS_PART1.md`–`SRS_PART4.md`, `SRS_ASAPro_Final.md`.
> **Related but separate artifact:** `SRS_IMPLEMENTATION_COMPARISON.md` (traceability report — not an SRS).

---

## 1. Introduction

### 1.1 Purpose

This document is the single authoritative requirements specification for **TSAPro** (Techbridge Salary Administration Portal). It consolidates all prior SRS revisions (v3.0 four-part series, v3.1 summary, v3.3 implementation-verified revision) into one coherent document.

Every functional requirement in Section 3 has been verified against the running codebase. Non-functional requirements (Section 4) and data requirements (Section 5) carry forward the detailed specifics from the original v3.0 series, pruned of anything contradicted by the verified implementation.

### 1.2 Scope

**In Scope:**
- **Authentication** — Secure, single-user administrative access with password management and strength enforcement.
- **Salary Calculation** — Automated net-salary computation (Monthly / Annual views) based on 2025 Ghanaian tax regulations (GRA) and SSNIT rules.
- **Grade Management** — Full CRUD on the Techbridge Salary Scale (Grade/Step codes), including AI-assisted PDF ingestion.
- **Auditing** — Comprehensive, tamper-evident logging of all critical system events with JSON detail storage.
- **Self-Diagnostics** — Built-in calculation-engine validation and Playwright-style E2E simulation.
- **AI Assistance** — CLAUDE (Conversational Language Audit & User Diagnostic Engine) chat widget powered by Google Gemini.
- **Accessibility** — WCAG 2.1 Level AA compliant interface with Light, Dark, and High-Contrast themes.

**Out of Scope:**
- Payroll processing / disbursement.
- Employee database management (HRIS).
- Server-side storage (application uses client-side persistence only).
- Multi-user concurrent access.
- Mobile-native applications.

### 1.3 Definitions & Abbreviations

| Term | Definition |
|------|------------|
| **CLAUDE** | Conversational Language Audit & User Diagnostic Engine — the in-app AI assistant |
| **GHS (₵)** | Ghanaian Cedis |
| **GRA** | Ghana Revenue Authority |
| **PAYE** | Pay As You Earn (progressive income tax) |
| **SPA** | Single-Page Application |
| **SSNIT** | Social Security and National Insurance Trust |
| **Step Code** | Internal code representing a job level and salary grade (e.g. `SM0105/4`) |
| **TSAPro** | Techbridge Salary Administration Portal — this application |
| **WCAG** | Web Content Accessibility Guidelines |

### 1.4 References

- Ghana Revenue Authority — PAYE Tax Rates 2025
- SSNIT Act 766 (as amended) — Contribution Guidelines
- WCAG 2.1 Level AA Accessibility Standards
- Techbridge University College Salary Structure Documentation (2025)
- IEEE 830-1998 SRS Template Standard

---

## 2. Overall Description

### 2.1 Product Perspective

TSAPro is a standalone, client-side Single Page Application built with **React 19 + TypeScript**, bundled by **Vite**. It operates without a dedicated backend; the browser's `localStorage` provides all data persistence, giving offline capability after initial load.

```
[External HR Process] ──► [TSAPro Portal] ──► [Audit Records]
        │                        │                    │
   Grade Assignment        Salary Calculation   Management Review
```

### 2.2 Product Functions

1. User Authentication & credential management
2. Salary Calculation (Standard and Flexible modes)
3. Override Management with full audit trails
4. Grade/Step CRUD + AI-assisted bulk import
5. Comprehensive Audit Logging & export
6. Calculation History with search
7. Self-Diagnostics (engine validation + E2E simulation)
8. AI Assistant (CLAUDE) via Gemini
9. Theming & Accessibility (Light / Dark / High-Contrast)

### 2.3 User Characteristics

**Primary User — HR Administrator**
- Manages salary determinations for new recruits.
- Overrides standard values when necessary.
- Reviews audit logs for compliance.
- Manages system credentials and runs periodic diagnostics.
- Technical proficiency: Intermediate (familiar with web applications).

### 2.4 Operating Environment

| Requirement | Specification |
|-------------|---------------|
| Browser | Chrome 90+, Firefox 88+, Edge 90+, Safari 14+ |
| Minimum resolution | 1024 × 768 |
| Internet | Required for initial load only; offline thereafter |
| Storage | Browser `localStorage` (5–10 MB, browser-dependent) |

### 2.5 Design & Implementation Constraints

- **Platform:** Client-side SPA only; no server-side processing.
- **Currency:** All calculations in Ghanaian Cedis (₵).
- **Regulation basis:** GRA 2025 tax tables; SSNIT current guidelines.
- **Accessibility:** WCAG 2.1 Level AA mandatory.
- **Security:** Single-user; `localStorage` is acknowledged as non-encrypted (see NFR-4).

### 2.6 Assumptions & Dependencies

| # | Assumption / Dependency |
|---|-------------------------|
| A-1 | Single user accesses the system at any given time |
| A-2 | Workstations are physically secure |
| A-3 | Users understand Techbridge salary structures and grade codes |
| A-4 | GRA tax rates remain stable during the tax year |
| A-5 | `localStorage` is available and functional in the target browser |
| D-1 | GRA publishes updated rates; system updated annually (January) |
| D-2 | Techbridge provides updated salary-structure documentation as needed |
| D-3 | `GEMINI_API_KEY` provided in `.env.local` for AI features |

---

## 3. Functional Requirements

> All requirements below have been verified against the running codebase (v3.3 verification pass).

### FR-1: Authentication & Security

| ID | Requirement | Notes |
|----|-------------|-------|
| FR-1.1 | System shall require password authentication for access. | Single admin password; stored in `localStorage` key `aucdt-salary-password` |
| FR-1.2 | System shall support password changes, enforcing a minimum length of 8 characters. | |
| FR-1.3 | Sessions shall persist via `localStorage` but support explicit logout. | |
| FR-1.4 | The login form shall include a password-visibility toggle. | |
| FR-1.5 | The password-change form shall include a Confirm Password field; submission is blocked on mismatch. | |
| FR-1.6 | A real-time password-strength meter shall display while typing. Scored 0–5 on length (≥8, ≥12), uppercase, digits, special characters. Colour: Weak = red, Medium = amber, Strong/Very Strong = green. | |
| FR-1.7 | The system shall reject a password change where the new password is identical to the current password. | |
| FR-1.8 | All failed login attempts and password-change failures shall be recorded in the Audit Log with a descriptive reason. | No credential value is persisted in the log (NFR-2 resolved) |

### FR-2: Salary Engine

| ID | Requirement | Notes |
|----|-------------|-------|
| FR-2.1 | System shall calculate SSNIT at 5.5%, capped at the Tier 1 limit of ₵42,000 annual base. An expandable detail panel shall show base, rate, contribution, and whether the cap was applied. | SSNIT-exempt flag bypasses the calculation entirely |
| FR-2.2 | System shall calculate PAYE using the progressive 2025 annual tax brackets (see Appendix A). An expandable panel shall show a bracket-by-bracket breakdown. | |
| FR-2.3 | System shall provide two calculation modes: **Standard Mode** (restricts inputs to a predefined Grade/Step; manual edits still permitted with override flagging) and **Flexible Mode** (Grade-Family dropdown + "Custom (Fully Manual)" option; selecting Custom shows a free-text label input). | |
| FR-2.4 | System shall detect and flag manual overrides in Standard Mode. Inline warnings appear when salary, allowance, or SSNIT-exempt status differ from the selected grade's stored values. All three override flags are persisted in the Audit Log. | `wasSalaryOverridden`, `wasAllowanceOverridden`, `wasSsnitExemptOverridden` |
| FR-2.5 | System shall support an optional Student Loan deduction. Standard Mode uses the fixed monthly amount from the grade record; Flexible Mode calculates 5% of taxable income. | |
| FR-2.6 | System shall accept a second, independent "Additional Monthly Allowance" input. This amount is additive to the Consolidated Allowance and flows into Gross Monthly, Taxable Income, and the annual summary. It is recorded in the Audit Log. | |
| FR-2.7 | The payslip shall display the Effective Tax Rate (annual PAYE ÷ Gross Annual × 100), to two decimal places, below the Total Deductions line in Monthly view. | |
| FR-2.8 | The payslip shall include an "Export Payslip" button that downloads a plain-text `.txt` payslip. Filename pattern: `payslip_{recruitName}_{YYYY-MM-DD}.txt`. Contents: earnings, deductions, effective tax rate, net monthly take-home, annual summary. | |
| FR-2.9 | The payslip panel shall toggle between Monthly and Annual views via a segmented control. | |
| FR-2.10 | Salary calculations shall update in real time as the administrator types. Each change is logged after a 1-second debounce. No explicit "Calculate" button is required. | |

### FR-3: Administration

| ID | Requirement | Notes |
|----|-------------|-------|
| FR-3.1 | Administrator shall Add, Edit, and Delete Grade/Step definitions. The Add form collects: Grade/Step Code, Status/Title, Annual Basic Salary, Monthly Consolidated Allowance, SSNIT Exempt flag. New entries receive an auto-generated `empCode` prefixed `CUSTOM-`. | |
| FR-3.2 | The Grade/Step list shall support **Sorting** (all columns, asc/desc on header click), **Filtering** (real-time search by code / status / empCode with a match-count badge), and a **Dual View** toggle (standard table ↔ Matrix View via `GradeScaleTable`). | |
| FR-3.3 | System shall support PDF ingestion for bulk Grade updates via AI extraction (Gemini). Two-step workflow: (1) select PDF → "Analyze with AI" → preview table; (2) review preview → "Import & Update Database". A bulk-import audit event is recorded. | Requires `GEMINI_API_KEY` |
| FR-3.4 | Administrator shall view a read-only Security Audit Log with: **Export CSV** (downloads `audit_logs_{date}.csv`, records `LOGS_EXPORTED`), **Clear Logs** (confirmation dialog, records `AUDIT_LOG_CLEARED` before clearing), and inline expansion of `SALARY_CALCULATION` entries. | |
| FR-3.5 | The Admin Panel shall display a Security Health Check panel showing: (a) whether the password is still the system default (amber warning if so, green if changed); (b) total audit-log record count. | |

### FR-4: AI Assistant (CLAUDE)

| ID | Requirement | Notes |
|----|-------------|-------|
| FR-4.1 | System shall provide a floating, collapsible chat interface powered by Google Gemini, accessible from all authenticated pages. | Lazy-loaded; initialised only when chat is opened |
| FR-4.2 | The assistant shall have tool access to: `calculateSalary`, `getAuditLogs`, and `getStepCodes` to provide context-aware answers. | Implemented via Gemini function-calling declarations |

### FR-5: Calculation History

| ID | Requirement | Notes |
|----|-------------|-------|
| FR-5.1 | A dedicated History page (`/history`) shall display all past salary calculations as expandable cards, ordered most-recent first. | |
| FR-5.2 | Each card shows Recruit Name, timestamp, and Net Monthly Salary. Expanding reveals the full structured breakdown (shared `SalaryCalculationDetails` component). | |
| FR-5.3 | A search input shall filter the history list in real time by Recruit Name (case-insensitive). | |

### FR-6: Theming & Accessibility

| ID | Requirement | Notes |
|----|-------------|-------|
| FR-6.1 | System shall support three themes: Light, Dark, High-Contrast, switchable at any time via a header theme switcher. | |
| FR-6.2 | The selected theme is persisted in `localStorage` (`aucdt-salary-theme`) and restored on next visit. | |
| FR-6.3 | If no theme is persisted, the system determines a smart default: checks OS `prefers-color-scheme`; falls back to a time-of-day heuristic (Dark between 18:00–06:00, Light otherwise). | |
| FR-6.4 | Every theme change shall be recorded in the Audit Log as a `THEME_CHANGE` event (previous + new theme). | |
| FR-6.5 | The application shall include a "Skip to main content" link for keyboard accessibility. | |

### FR-7: Self-Testing

| ID | Requirement | Notes |
|----|-------------|-------|
| FR-7.1 | System shall include a Calculation Engine Validation suite that verifies 100% of database entries against expected net values (`netSalaryInSheet`). Tolerance: ±₵0.01. | 35+ test cases from `constants.ts` |
| FR-7.2 | System shall include an E2E Simulation suite (Playwright-style) that visually replays user workflows and verifies UI states. | Visual feedback via `ScreenshotFrame` component |

---

## 4. Non-Functional Requirements

### NFR-1: Accessibility (WCAG 2.1 Level AA)

**Keyboard Navigation**
- All interactive elements fully operable via keyboard.
- Tab order follows logical reading order; visible focus indicators (≥2 px outline, ≥3:1 contrast).
- Skip-navigation link provided. Escape closes modals/dropdowns; Enter activates buttons; arrow keys navigate dropdowns.

**Screen Reader Compatibility**
- All interactive elements have appropriate ARIA labels or associated `<label>` elements.
- Dynamic content announced via `aria-live` regions; errors associated via `aria-describedby`.
- Supported readers: NVDA, JAWS (Windows), VoiceOver (macOS/iOS).

**Visual Accessibility**
- Normal-text contrast ≥4.5:1; large text (18 pt+) ≥3:1.
- High-Contrast theme meets WCAG AAA (≥7:1).
- Minimum font size 14 px; scalable to 200% without loss of functionality.
- Color is never the sole means of conveying information; all icons have text alternatives.

**Content Structure**
- Proper heading hierarchy (H1 → H2 → H3, no skipping). One H1 per page.
- Semantic HTML5 elements (`<nav>`, `<main>`, `<footer>`, `<section>`) define landmark regions.
- Tables used only for tabular data with proper `<th>` associations.

### NFR-2: Performance

| Operation | Target | Maximum |
|-----------|--------|---------|
| Initial page load | < 1.5 s | 2 s |
| Salary calculation | < 50 ms | 100 ms |
| Theme switching | < 100 ms | 200 ms |
| Login authentication | < 300 ms | 500 ms |
| Audit log filtering (1 000 entries) | < 500 ms | 1 s |
| Self-test suite (full) | < 3 s | 5 s |

**Resource limits:** `localStorage` < 5 MB total; browser memory < 100 MB; initial network payload < 2 MB.

### NFR-3: Usability

- New users shall complete a first salary calculation within 5 minutes without training.
- Confirmation required for all destructive actions (delete grade, clear logs).
- Override warnings displayed before calculation completes.
- Real-time input validation with field-level feedback (green check / red ×).
- Feedback messages: specific, actionable, auto-dismiss in 3–5 seconds.

### NFR-4: Security

**Data Protection**
- No plain-text credentials in logs, error messages, or console output (NFR-2 credential-hygiene — resolved in v3.3; see `AuthContext.tsx` → `login()`).
- Sensitive data cleared from memory on logout.

**Known Limitations (acknowledged; mitigated by deployment context)**
1. `localStorage` is unencrypted and accessible via DevTools → **deploy on internal network only**.
2. No server-side authentication → **physical workstation security required**.
3. Client-side code is inspectable → **audit trail detects anomalies**.
4. HTTPS mandatory at hosting layer.

**Access Control**
- All authenticated routes check `isAuthenticated` via `useAuth()`.
- Password-change and log-deletion operations execute only in an authenticated session.

### NFR-5: Reliability

- Graceful degradation if `localStorage` is unavailable (warning + limited functionality).
- All calculations accurate to 2 decimal places; no cumulative rounding errors.
- Application remains stable after JavaScript errors; critical errors logged for diagnostics.

### NFR-6: Maintainability

- Tax rates and SSNIT cap defined in `constants.ts`; updatable without structural code changes.
- Salary structure updates via the Admin Panel import workflow or direct `constants.ts` edit.
- Theme colours driven by CSS custom properties in `GlobalStyles.tsx`.
- Single source of truth for calculations: `utils/salaryCalculations.ts`.

### NFR-7: Compatibility

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 90+ (recommended) |
| Firefox | 88+ |
| Edge | 90+ |
| Safari | 14+ |

Required APIs: ES6+, CSS Grid/Flexbox, `localStorage`, CSS Custom Properties.
Supported OS: Windows 10+, macOS 10.15+, major Linux distros.

---

## 5. Data Requirements

### 5.1 Logical Data Model

#### StepCodeData (Grade / Step record)

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| empCode | string | Required, unique | Employee code (auto-prefixed `CUSTOM-` for new entries) |
| code | string | Required, unique | Grade/Step identifier, e.g. `SM0105/4` |
| status | string | Required | Position / title |
| annualSalary | number | > 0 | Annual basic salary (₽) |
| allowance | number | ≥ 0 | Monthly consolidated allowance (₵) |
| isSsnitExempt | boolean | | SSNIT exemption flag |
| netSalaryInSheet | number | | Reference net salary used by the self-test validator |
| studentLoanInSheet | number \| null | | Reference student-loan amount |

#### AuditLogEntry

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | string (UUID) | Required, unique | Auto-generated |
| timestamp | string | ISO 8601 | Auto-generated at creation time |
| event | AuditLogEvent | Required | Enum (see Appendix C) |
| details | string \| undefined | | JSON-serialised detail object |

#### Theme Preference

Stored as a single string value: `'light'`, `'dark'`, or `'high-contrast'`.

### 5.2 localStorage Schema

All keys are live in the current codebase.

```
Key                          Value                  Managed by
─────────────────────────────────────────────────────────────────────
aucdt-salary-password        string                 AuthContext
aucdt-salary-step-codes      JSON → StepCodeData[]  StepCodesContext
aucdt-salary-audit-log       JSON → AuditLogEntry[] auditLogService
aucdt-salary-theme           'light'|'dark'|'high-contrast'  ThemeContext
```

> **Note:** Keys retain the `aucdt-salary-` prefix for backwards compatibility with existing user data. The application identity is TSAPro / Techbridge.

### 5.3 Data Integrity Constraints

- All currency values ≥ 0; rounded to 2 decimal places.
- Audit-log timestamps must not be in the future.
- SSNIT percentage is fixed at 5.5 %; Student Loan at 5 % (both defined in `constants.ts`).
- Override flags are mandatory when any field diverges from the selected grade's stored value.
- `StepCodesContext` sanitises and validates data on mount to guard against corrupted records.

### 5.4 Data Retention

| Data | Retention | Deletion |
|------|-----------|----------|
| Audit Logs | Indefinite | Manual (with confirmation + pre-clear log event) |
| Step Codes | Until updated | Manual via Admin Panel or import |
| Session | Until logout / page close | Automatic |
| Theme preference | Indefinite | Browser storage clear |

---

## 6. System Models

### 6.1 Architecture

```
┌─────────────────────────────────────────────────────┐
│                 PRESENTATION LAYER                   │
│  LoginPage · DashboardPage · AdminPage              │
│  HistoryPage · SelfTestPage                         │
│  Header · Footer · ClaudeAssistant                  │
│  Common components (Button, Card, Input, …)         │
└────────────────────────┬────────────────────────────┘
                         │  React Context API
┌────────────────────────▼────────────────────────────┐
│               BUSINESS LOGIC LAYER                   │
│  AuthContext · StepCodesContext · ThemeContext         │
│  salaryCalculations.ts  (single calc source)        │
│  auditLogService.ts · geminiService.ts              │
└────────────────────────┬────────────────────────────┘
                         │  useLocalStorage hook
┌────────────────────────▼────────────────────────────┐
│             DATA PERSISTENCE LAYER                   │
│  Browser localStorage                               │
│  aucdt-salary-password  |  aucdt-salary-step-codes  │
│  aucdt-salary-audit-log |  aucdt-salary-theme       │
└─────────────────────────────────────────────────────┘
```

### 6.2 Routing

Hash-based routing (`HashRouter`) — works without a server capable of serving SPA fallback.

| Route | Component | Auth required |
|-------|-----------|---------------|
| `/login` | LoginPage | No |
| `/` | DashboardPage | Yes |
| `/admin` | AdminPage | Yes |
| `/history` | HistoryPage | Yes |
| `/self-test` | SelfTestPage | Yes |

### 6.3 Salary Calculation Data-Flow

```
Input (name, grade, salary, allowance, flags)
        │
        ▼
  Grade/Step Selection  ──► auto-populate fields
        │
        ▼
  Override Detection?  ──► YES → inline warning + flag
        │                   NO → proceed
        ▼
  performFullSalaryCalculation()          ← single entry point
        ├── calculateSsnit()   (5.5%, capped at ₵42 000)
        ├── calculatePaye()    (progressive 2025 bands)
        └── Student Loan       (5% of taxable, if enabled)
        │
        ▼
  Net Salary displayed  +  AuditLog entry (1 s debounce)
```

### 6.4 Audit Trail Flow

```
System event occurs
        │
        ▼
  auditLogService.addLog(event, details)
        │
        ├── Generates UUID + ISO 8601 timestamp
        ├── Serialises details to JSON string
        └── Prepends to array in localStorage
                │
                ▼
        Visible in HistoryPage / AdminPage log viewer
        Exportable as CSV
```

---

## 7. External & Software Interfaces

### 7.1 User Interfaces (key screens)

**Login** — Centred card (max 400 px): logo, password field with visibility toggle, submit button, error area. Theme selector accessible before login.

**Dashboard (Calculator)** — Mode toggle (Standard / Flexible). Grade/Step selector. Recruit-name input. Salary, allowance, additional-allowance, SSNIT-exempt, student-loan fields. Real-time payslip panel with Monthly/Annual segmented control. Export Payslip button.

**Admin Panel** — Security Health Check header. Tabs / sections: Password Management (strength meter, confirm field), Grade/Step CRUD table (sort, filter, dual-view toggle), PDF Import workflow, Audit Log viewer (expand, export CSV, clear).

**History** — Search input, expandable calculation cards ordered newest-first.

**Self-Test** — Run All button, per-entry pass/fail with duration, summary stats, export option. E2E simulation panel with visual step replay.

### 7.2 Software Interfaces

| Interface | Usage |
|-----------|-------|
| `localStorage` API | All persistent data (get/set/remove) |
| Google Generative AI (`@google/genai`) | PDF extraction, CLAUDE chat, function-calling |
| `window.matchMedia('prefers-color-scheme')` | Smart theme default |
| `Blob` + `URL.createObjectURL` | Payslip `.txt` and CSV downloads |

---

## 8. Legal & Regulatory Requirements

- Calculations must align with Ghana Revenue Authority 2025 PAYE tables.
- SSNIT contributions per Act 766 (as amended).
- Complete audit trail required for compliance review; tamper-evident (append-only).
- Employee names and salary data handled; no transmission outside the local browser.
- System must be updated when tax laws change (annual January review).

---

## Appendices

### Appendix A — 2025 PAYE Tax Brackets (Annual)

| Band | Income Range (₵) | Rate | Max Tax on Band |
|------|-------------------|------|-----------------|
| 1 | 0 – 5 880.00 | 0 % | ₵0.00 |
| 2 | 5 880.01 – 7 200.00 | 5 % | ₵66.00 |
| 3 | 7 200.01 – 8 760.00 | 10 % | ₵156.00 |
| 4 | 8 760.01 – 46 760.04 | 17.5 % | ₵6 650.01 |
| 5 | 46 760.05 – 238 760.04 | 25 % | ₵48 000.00 |
| 6 | 238 760.05 – 605 000.04 | 30 % | ₵109 872.00 |
| 7 | 605 000.05+ | 35 % | — |

Implementation in `constants.ts` uses `{ width, rate }` pairs where `width` is the band size in ₵ (last band = `Infinity`). All calculations are performed on **annual** income first, then divided by 12 for monthly figures.

**Worked example:**

```
Annual Basic Salary   ₵80,000     Monthly Allowance   ₵3,000
Annual Allowance      ₵36,000     Gross Annual        ₵116,000

SSNIT base = min(80 000, 42 000) = 42 000
SSNIT (annual) = 42 000 × 5.5 % = ₵2 310.00

Taxable Income = 116 000 − 2 310 = ₵113,690.00

PAYE:
  Band 1   5 880.00 @ 0 %    =     0.00
  Band 2   1 320.00 @ 5 %    =    66.00
  Band 3   1 560.00 @ 10 %   =   156.00
  Band 4  38 000.04 @ 17.5 % = 6 650.01
  Band 5  66 929.96 @ 25 %   =16 732.49   ← remainder
  Annual PAYE                  = ₵23,604.50

Monthly figures (÷ 12):
  Gross Monthly   ₵9 666.67
  SSNIT           ₵  192.50
  PAYE            ₵1 967.04
  Net Monthly     ₵7 507.13
```

### Appendix B — SSNIT & Student Loan Quick Reference

| Item | Rate | Base | Cap / Note |
|------|------|------|------------|
| Employee SSNIT | 5.5 % | Annual Basic Salary | Capped at ₵42 000 base (Tier 1) |
| Employer SSNIT | 13 % | Annual Basic Salary | Not deducted from employee |
| Student Loan | 5 % | Taxable Income (annual) | Optional; reduces PAYE base when enabled |

### Appendix C — Audit Event Reference

The `AuditLogEvent` enum defines every loggable event:

| Event | Trigger |
|-------|---------|
| `LOGIN_SUCCESS` | Successful authentication |
| `LOGIN_FAILURE` | Failed login attempt |
| `LOGOUT` | Explicit logout |
| `PASSWORD_CHANGE_SUCCESS` | Password changed |
| `PASSWORD_CHANGE_FAILURE` | Password-change attempt failed |
| `SALARY_CALCULATION` | Calculation performed (full breakdown in details) |
| `GRADE_ADDED` | New Grade/Step created |
| `GRADE_EDITED` | Existing Grade/Step modified |
| `GRADE_DELETED` | Grade/Step removed |
| `AUDIT_LOG_CLEARED` | Logs cleared (recorded before clearing) |
| `LOGS_EXPORTED` | Logs exported as CSV |
| `THEME_CHANGE` | Theme switched (previous + new value) |

### Appendix D — Risk Register

| ID | Risk | Probability | Impact | Score | Mitigation |
|----|------|-------------|--------|-------|------------|
| R-1 | `localStorage` data loss | Medium | High | 6 | Monthly CSV export recommended |
| R-2 | Tax-regulation change | High | High | 9 | Config-driven rates; annual January review |
| R-3 | Browser incompatibility | Low | Medium | 3 | Supported-browser list; CI cross-browser testing |
| R-4 | Unauthorised salary-data access | Medium | Critical | 9 | Physical security; internal-network deployment |
| R-5 | Calculation error | Low | Critical | 6 | Self-test suite validates all entries |
| R-6 | Audit-log tampering | Low | High | 4 | Append-only; pre-clear logging |
| R-7 | Gemini API unavailable | Medium | Low | 2 | Core features work without AI; graceful fallback |

*Score = Probability (1–3) × Impact (1–3). Low 1–3, Medium 4–6, High 7–9.*

### Appendix E — Default Grade List

The authoritative set of grades ships in `constants.ts` (`DEFAULT_STEP_CODES` array, 35+ entries). Each entry originates from the Techbridge University College Salary Scale. New entries added through the Admin Panel receive an auto-generated `CUSTOM-` empCode.

### Appendix F — File & Route Quick Reference

```
constants.ts                  Tax bands, SSNIT cap, default grades
types.ts                      All TypeScript interfaces & enums
utils/salaryCalculations.ts   Calculation engine (single source of truth)
services/auditLogService.ts   Audit trail read / write
services/geminiService.ts     PDF extraction + CLAUDE chat
contexts/AuthContext.tsx       Authentication state & password management
contexts/StepCodesContext.tsx  Grade/Step database
contexts/ThemeContext.tsx      Theme state & smart-default logic
pages/DashboardPage.tsx       Main salary calculator
pages/AdminPage.tsx           Grade CRUD, audit log, health check
pages/HistoryPage.tsx         Calculation history
pages/SelfTestPage.tsx        Engine validation + E2E simulation
components/ClaudeAssistant.tsx  AI chat widget
components/GlobalStyles.tsx   CSS custom-property theme system
```
