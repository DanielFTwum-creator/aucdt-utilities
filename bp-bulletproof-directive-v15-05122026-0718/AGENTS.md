# AI Orchestrated QA Framework - Agent Instructions

You are acting as the primary orchestrator for the **TUC Project Refresh Framework**, an application designed to enforce state synchronisation, automated IEEE-compliant documentation, and phased execution constraints for production-grade software development.

## Application Architecture

This is a React 19.x + Vite + Tailwind CSS application using TypeScript.

### Project Features and Structure
1. **Phased Execution Dashboard**: A UI (`App.tsx`, `PhaseCard.tsx`) displaying checklist phases (Foundation, Security & Accessibility, Testing, Documentation, Finalisation).
    - Status filtering (All/Completed/Pending), completion tracking (states in `App.tsx`)
    - Phase logic relies on `constants.ts` storing phase checklists and frameworks.
2. **Single Shot Prompts**: The application generates explicit context blocks and checklist prompts for LLM agents (Claude and Google AI Studio) to autonomously execute tasks across the project. 
    - Found inside `constants.ts` (e.g. `SINGLE_SHOT_CLAUDE`, `SINGLE_SHOT_AISTUDIO`, `DIRECTIVES`).
    - Quick actions card allows clipboard exports per phase or as a combined shot.
3. **Admin Panel (`/admin`)**: A password-protected area for audit logging of administrative and system events.
    - Implemented in `AdminPanel.tsx` accessible via hash routing (`#/admin`).
    - Tracks user interactions into an `auditLogs` array mapping to type `AuditLog` in `types.ts`.
4. **Interactive Playwright Self-Test**: A dashboard (`TestDashboard.tsx` and `PlaywrightRunner.tsx`) simulating E2E test execution and displaying validation logs.
    - Simulates terminal/Playwright actions over application logic.
5. **Documentation Viewer (`DocViewer.tsx`)**: Displays system artifacts such as IEEE 830 SRS documents, Architecture SVGs, Database Schema SVGs, and specific deployment and test guides.
    - Employs dynamic imports using Vite's `?raw` plugin capability (e.g. `import srsContent from '../docs/TUC-ICT-SRS-2026-001.md?raw'`).
    - Uses `react-markdown` to parse content dynamically.
6. **Themes & Interface**: Dark/Light/High-Contrast CSS variable swapping, ARIA tooltips, and Lucide React Icons (`components/Icons.tsx`).

## Execution Constraints & Rules

When modifying or recreating this application, you MUST adhere to the following rules:

### 1. Zero Broken Links Policy
- Every button, tab, and navigation link must function and display appropriate content or a simulated UI. 
- Do not leave empty template strings where links should be.

### 2. Strict Phased Flow Enforcement
- The framework enforces a multi-phase checklist. When updating `constants.ts` or related phase definitions, ensure there is a clear mechanism to lock subsequent phases until the previous phase's requirements (Gate) are satisfied.

### 3. Documentation Format Requirements
- **Language**: UK British English.
- **SRS Format**: IEEE 830 / IEEE 29148 standard.
- **Naming Conventions**: `TUC-ICT-SRS-YYYY-NNN`, `ORG-INC-YYYY-NNN` (e.g., `TUC-ICT-SRS-2026-001.md`).
- **Diagrams**: All architecture and schema representations must be raw SVG code (e.g., `docs/SystemArchitecture.svg`, `docs/DatabaseArchitecture.svg`), embedded within the appropriate SRS or Markdown document (such as `docs/ADMIN_GUIDE.md`, `docs/DEPLOYMENT_GUIDE.md`).

### 4. Admin and Diagnostic Routines
- All diagnostic components, self-test endpoints, and administrative tools must be securely gated behind a client-side (or server-side if expanded) authentication check.
- The `AuditLog` must accurately record state transitions, generation events, and logins.

### 5. Playwright Integration
- The testing reference implementation must always use **Playwright**, not Puppeteer. Verify that references in documents (like `TESTING_GUIDE.md`) and package scripts point to Playwright (`@playwright/test`).

### 6. Component Modularity
- Adhere to the existing component structure: abstract UI components (e.g., `PhaseCard.tsx`, `SRSModal.tsx`, `Toast.tsx`) from operational logic (`App.tsx`, `constants.ts`).
- Any new icons added must be defined using inline SVG in `components/Icons.tsx` (using standard lucide-react visual patterns).

### 7. Theming & Accessibility
- The application implements Light, Dark, and High-Contrast themes. Ensure any new Tailwind implementation integrates with the existing CSS Custom Properties for themes (`bg-bg-primary`, `text-text-primary`, `border-border`, etc.).
- Maintain robust ARIA roles on all interactive elements.

## Recreating or Extending

If you are asked to recreate or migrate this application:
1. Ensure `package.json` contains React 19.x and `@playwright/test`.
2. Generate all the raw Markdown texts (SRS, deployment guides) and SVG architecture diagrams, ensuring their availability in the `docs/` folder. Simulate their loading in `DocViewer.tsx` via raw imports (e.g., `import srsContent from '../docs/TUC-ICT-SRS-2026-001.md?raw'`).
3. Ensure the single shot export buttons (`SINGLE_SHOT_CLAUDE` and `SINGLE_SHOT_AISTUDIO`) remain fully available on the primary dashboard view and perfectly mirror the established checklist guidelines, utilizing clipboard API (`navigator.clipboard.writeText`) together with notification feedback (`Toast.tsx`).
4. Re-establish global types (`types.ts`) managing `Framework`, `Phase`, `Task`, `AuditLog`. Ensure `constants.ts` maintains standard IEEE 830 directives representing software development frameworks (soc2, pci, gdpr, hipaa).

**When the user issues a prompt, first consult this file to verify you are not violating the Zero Broken Links Policy or strict documentation requirements.**
