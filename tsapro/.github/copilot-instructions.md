# Copilot Instructions for TSAP (ASAP Pro)

## Project Overview

**TSAP (Technical Salary Audit Platform)** - An AI-enhanced Ghanaian university salary administration system for TECHBRIDGE University College. This is a secure, browser-based React application that calculates compliant net salaries based on Ghanaian PAYE, SSNIT, and regulatory frameworks.

## Architecture & Critical Components

### Context Providers (React Context API)
- **AuthContext**: Password-based authentication (single admin password stored in localStorage). All login/logout/password changes logged to audit trail.
- **ThemeContext**: Light/dark/high-contrast themes persisted in localStorage across sessions.
- **StepCodesContext**: Manages salary grade/step database with full audit logging for CRUD operations on salary scales.

**Pattern**: Contexts wrap providers at top-level in `App.tsx`. Use `useXContext()` hooks within components - never access contexts directly.

### Calculation Engine: `utils/salaryCalculations.ts`
This is the **single source of truth** for all salary computations. Core functions:
- `performFullSalaryCalculation()` - Primary calculation orchestrator accepting annual salary, allowances, SSNIT exemption, student loan flag
- `calculatePaye()` - Progressive tax bands per Ghana Revenue Authority 2025 specifications
- `calculateSsnit()` - 5.5% contribution with Tier 1 cap (₵42,000 annual) and exemption support

**Critical Detail**: PAYE uses annual bands structured as `[{width, rate}]` pairs - width is the income range, NOT a percentage. Always calculate with annual income first, then convert to monthly.

### AI Service Integration: `services/geminiService.ts`
Wraps Google Generative AI (Gemini) API for:
- PDF salary scale parsing (base64 → JSON grade/step data)
- Natural language salary queries → form auto-population
- Audit log analysis & regulatory explanations
- Function calling for deterministic operations

**Environment**: Requires `GEMINI_API_KEY` in `.env.local`. API key loaded on demand within `ClaudeAssistant` component.

### Data Model
**StepCodeData** interface (the primary data object):
```
code (e.g., "SM0105/4"), status, empCode, annualSalary, allowance, isSsnitExempt, 
netSalaryInSheet, studentLoanInSheet
```
All grade/step records stored in localStorage under `'aucdt-salary-step-codes'` key with validation & sanitization on load.

## Developer Workflows

### Local Development
```bash
npm install                    # Install dependencies (React 19, Vite, TypeScript)
export GEMINI_API_KEY="..."   # PowerShell: $env:GEMINI_API_KEY="..."
npm run dev                    # Start Vite dev server (typically http://localhost:5173)
npm run build                  # Production build → dist/
npm run preview               # Preview built bundle locally
```

### Audit Logging Pattern
Every user action triggering data changes calls `addLog(AuditLogEvent, details)` from `services/auditLogService.ts`:
- Login attempts (success/failure), logout
- Password changes
- Grade/step CRUD operations (logs specific field changes)
- Salary calculations (full breakdown logged with override flags)

Logs stored in localStorage under `'aucdt-salary-audit-log'`, exported as JSON from AdminPage.

## Project-Specific Conventions

### Salary Calculation Overrides
The app supports administrative overrides for:
- `salaryOverrideValue` / `wasSalaryOverridden` - Override annual salary
- `allowanceOverrideValue` / `wasAllowanceOverridden` - Override consolidated allowance
- `wasSsnitExemptOverridden` - Toggle SSNIT exemption
- `studentLoanApplied` - Enable/disable 5% student loan deduction on taxable income

All override flags logged in audit trail with before/after values.

### localStorage Keys (Not Synced to Server)
- `'aucdt-salary-password'` - Admin password (default in `constants.ts`)
- `'aucdt-salary-step-codes'` - Grade/step database
- `'aucdt-salary-audit-log'` - Security audit trail
- Theme preference key (set dynamically by ThemeContext)

**Important**: This is a client-side-only application. No backend API. All data persists locally; clearing browser storage resets the app.

### UI Component Patterns
- Reusable components in `components/common/`: Button, Card, Input, Select, Toggle, GradeScaleTable
- Layout components: Header (authenticated nav), Footer, GlobalStyles (CSS variables)
- Page-level components in `pages/`: LoginPage, DashboardPage (main salary calculator), AdminPage (grade management), HistoryPage (audit logs), SelfTestPage

### CSS Variable System
Colors defined in `GlobalStyles.tsx` with CSS variables:
- `--color-bg-primary`, `--color-text-primary`, `--color-accent-primary`
- Applied dynamically based on Theme context
- Use `className="text-[var(--color-text-primary)]"` pattern (Tailwind + CSS vars)

## Integration Points & Dependencies

### External APIs
- **Google Generative AI API** (`@google/genai`): Required for PDF parsing, natural language queries, regulatory explanations. Endpoint: `gemini-3-flash-preview` model.

### Key File Dependencies
- `DashboardPage.tsx` → `salaryCalculations.ts` + `StepCodesContext` → displays form, performs calculations, logs results
- `AdminPage.tsx` → `StepCodesContext` → CRUD for grade/step records
- `ClaudeAssistant.tsx` → `geminiService.ts` → Chat widget available from all authenticated pages
- `HistoryPage.tsx` → `auditLogService.ts` → View/export audit logs

### Routing
Hash-based routing (`HashRouter` in `App.tsx`). Routes:
- `/` → LoginPage
- `/dashboard` → DashboardPage (main app)
- `/admin` → AdminPage (grade management)
- `/history` → HistoryPage (audit logs)
- `/self-test` → SelfTestPage

All routes require `isAuthenticated` check via `useAuth()` hook.

## Important Conventions to Preserve

1. **Audit Logging is Non-Negotiable**: Every data mutation must trigger `addLog()`. Log field changes explicitly.
2. **Client-Side Calculations Only**: No backend - calculations happen in browser. Keep `salaryCalculations.ts` as single source of truth.
3. **SSNIT Exemption Logic**: Always check `isSsnitExempt` flag before calculating SSNIT. Exemption is binary per grade/step.
4. **Student Loan Optional**: 5% deduction on taxable income **only** if explicitly enabled. Separate field in breakdown.
5. **Data Validation on Load**: `StepCodesContext` sanitizes localStorage data on mount to prevent UI breakage from corrupted records.

## Quick Debugging Tips

- Check browser DevTools → Application → LocalStorage to inspect stored data
- Audit logs in localStorage help trace action sequences
- Salary calculations must match `netSalaryInSheet` reference values in `constants.ts` (validation dataset)
- Gemini API errors: verify `GEMINI_API_KEY` in `.env.local` and network access
- Theme not persisting? Check ThemeContext localStorage key in theme selection handler
