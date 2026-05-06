# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TSAP (Technical Salary Audit Platform)** - A browser-based React application for Ghanaian university salary administration at TECHBRIDGE University College. This is a client-side-only application that calculates compliant net salaries based on Ghanaian PAYE, SSNIT, and regulatory frameworks. All data persists in localStorage with comprehensive audit logging.

## Commands

### Development
```bash
pnpm install         # Install dependencies (faster with pnpm)
pnpm dev             # Start Vite dev server (http://localhost:3000)
pnpm build           # Production build → dist/
pnpm preview         # Preview production build
```

**Note**: This project uses pnpm for faster, more efficient dependency management.

### Environment Setup
Create `.env.local` with:
```
GEMINI_API_KEY=your_api_key_here
```

Required for AI features (PDF parsing, natural language queries, audit analysis). The app functions without it, but AI assistant features will be unavailable.

## Architecture

### Core Context Providers (React Context API)

Three primary contexts wrap the application in `App.tsx`:

1. **AuthContext** (`contexts/AuthContext.tsx`)
   - Single admin password authentication stored in localStorage
   - All authentication events logged to audit trail
   - Access via `useAuth()` hook

2. **ThemeContext** (`contexts/ThemeContext.tsx`)
   - Manages light/dark/high-contrast themes
   - Persists theme selection in localStorage
   - Drives CSS variable system in `GlobalStyles.tsx`

3. **StepCodesContext** (`contexts/StepCodesContext.tsx`)
   - Central database for salary grade/step records
   - CRUD operations with full audit logging
   - Data stored in localStorage under `'aucdt-salary-step-codes'`
   - Validates and sanitizes data on mount

**Pattern**: Always use `useXContext()` hooks within components. Never access contexts directly.

### Calculation Engine: `utils/salaryCalculations.ts`

**Single source of truth** for all salary computations. Critical functions:

- `performFullSalaryCalculation()` - Primary orchestrator for salary calculations
- `calculatePaye()` - Progressive tax using Ghana Revenue Authority 2025 bands
- `calculateSsnit()` - 5.5% contribution with Tier 1 cap (₵42,000 annual)

**Critical Implementation Detail**: PAYE bands use `[{width, rate}]` structure where `width` is the income range in currency, NOT a percentage. Always calculate with annual income first, then convert to monthly.

### AI Service: `services/geminiService.ts`

Wraps Google Generative AI (Gemini) for:
- PDF salary scale parsing (base64 → JSON)
- Natural language salary queries
- Audit log analysis
- Regulatory explanations

API key loaded on demand within `ClaudeAssistant` component.

### Audit Logging: `services/auditLogService.ts`

Every data-changing action must call `addLog(AuditLogEvent, details)`:
- Authentication events (login/logout/password changes)
- Grade/step CRUD (logs specific field changes)
- Salary calculations (full breakdown with override flags)

Logs stored in localStorage under `'aucdt-salary-audit-log'`, exportable from AdminPage.

## Data Model

### StepCodeData Interface
```typescript
{
  empCode: string,              // Employee code
  code: string,                 // Grade/step code (e.g., "SM0105/4")
  status: string,               // Employment status
  annualSalary: number,         // Base annual salary
  allowance: number,            // Consolidated monthly allowance
  isSsnitExempt: boolean,       // SSNIT exemption flag
  netSalaryInSheet: number,     // Reference net salary for validation
  studentLoanInSheet: number | null
}
```

### Salary Calculation Overrides

Administrative overrides supported:
- `salaryOverrideValue` / `wasSalaryOverridden` - Override annual salary
- `allowanceOverrideValue` / `wasAllowanceOverridden` - Override consolidated allowance
- `wasSsnitExemptOverridden` - Toggle SSNIT exemption
- `studentLoanApplied` - Enable/disable 5% student loan deduction

All overrides logged in audit trail with before/after values.

## localStorage Keys

**Critical**: This is a client-side-only application. No backend. All data persists locally.

- `'aucdt-salary-password'` - Admin password (default in `constants.ts`)
- `'aucdt-salary-step-codes'` - Grade/step database
- `'aucdt-salary-audit-log'` - Security audit trail
- Theme preference key (dynamically set by ThemeContext)

Clearing browser storage resets the entire application.

## File Structure

```
App.tsx                           # Root component with routing
constants.ts                      # Configuration, defaults, validation data
types.ts                          # TypeScript interfaces and enums

components/
  common/                         # Reusable UI components
    Button.tsx, Card.tsx, Input.tsx, Select.tsx, Toggle.tsx
    GradeScaleTable.tsx           # Grade/step display table
    SalaryCalculationDetails.tsx  # Calculation breakdown display
  layout/
    Header.tsx, Footer.tsx        # Authenticated navigation
  GlobalStyles.tsx                # CSS variables and theme system
  ClaudeAssistant.tsx             # AI chat widget

contexts/
  AuthContext.tsx                 # Authentication state
  StepCodesContext.tsx            # Grade/step database
  ThemeContext.tsx                # Theme management

pages/
  LoginPage.tsx                   # Authentication entry
  DashboardPage.tsx               # Main salary calculator
  AdminPage.tsx                   # Grade/step management
  HistoryPage.tsx                 # Audit log viewer
  SelfTestPage.tsx                # Validation test runner

services/
  auditLogService.ts              # Audit trail management
  geminiService.ts                # AI integration

utils/
  salaryCalculations.ts           # Salary computation engine

hooks/
  useLocalStorage.ts              # localStorage abstraction
```

## Routing

Hash-based routing (`HashRouter`):
- `/login` - LoginPage
- `/` - DashboardPage (main app, requires auth)
- `/admin` - AdminPage (grade management, requires auth)
- `/history` - HistoryPage (audit logs, requires auth)
- `/self-test` - SelfTestPage (validation, requires auth)

All authenticated routes check `isAuthenticated` via `useAuth()`.

## Key Dependencies

- `DashboardPage.tsx` → `salaryCalculations.ts` + `StepCodesContext` → Main calculation flow
- `AdminPage.tsx` → `StepCodesContext` → Grade/step CRUD
- `ClaudeAssistant.tsx` → `geminiService.ts` → AI features
- `HistoryPage.tsx` → `auditLogService.ts` → Log viewing/export

## Critical Conventions

1. **Audit Logging is Mandatory**: Every data mutation must trigger `addLog()`. Log field changes explicitly.

2. **Client-Side Calculations Only**: No backend - all calculations happen in browser. Keep `salaryCalculations.ts` as single source of truth.

3. **SSNIT Exemption Logic**: Always check `isSsnitExempt` flag before calculating SSNIT. Exemption is binary per grade/step.

4. **Student Loan is Optional**: 5% deduction on taxable income only if explicitly enabled. Separate field in breakdown.

5. **Data Validation on Load**: `StepCodesContext` sanitizes localStorage data on mount to prevent breakage from corrupted records.

6. **Override Tracking**: When implementing new override features, always add corresponding `was[Field]Overridden` boolean flags and log both before/after values.

## Debugging Tips

- Check DevTools → Application → LocalStorage to inspect stored data
- Audit logs trace action sequences
- Salary calculations must match `netSalaryInSheet` reference values in `constants.ts`
- Gemini API errors: verify `GEMINI_API_KEY` in `.env.local`
- Theme persistence: check ThemeContext localStorage key in selection handler

## Vite Configuration

- Dev server runs on port 3000 (host: 0.0.0.0)
- Environment variables: `GEMINI_API_KEY` exposed as `process.env.GEMINI_API_KEY` and `process.env.API_KEY`
- Path alias: `@/*` resolves to project root
- React plugin with JSX transform

## TypeScript Configuration

- Target: ES2022
- Module: ESNext with bundler resolution
- JSX: react-jsx (automatic runtime)
- Path mapping: `@/*` → `./*`
- Types: node
