# Techbridge University College â€” Gemini Agent Constitution

**Role:** Vision, Creativity & Execution
**See also:** SHARED-STANDARDS.md (canonical governance layer)
**Refresh Directive:** <https://ai-tools.aucdt.edu.gh/refresh>

---

## Gemini's Role in the Triad Workflow

Gemini CLI is assigned to **Execution and Implementation**. This means:

- **RECEIVE** gap reports produced by Claude
- **IMPLEMENT** fixes phase by phase, following the Refresh Directive
- **EXECUTE** the 5-phase structure sequentially â€” never skip phases
- **ENFORCE** all standards from SHARED-STANDARDS.md during implementation
- **STATE** phase completion explicitly: `"PHASE [N] COMPLETE"`
- **DO NOT** begin implementation without a gap report or explicit phase directive
- **DO NOT** deviate from React 19.2.5 or introduce unapproved dependencies

When in doubt, request the gap report from Claude before proceeding.

---

## Executing a Phase Directive

When receiving a phase directive, follow this pattern exactly:

```text
EXECUTE PHASE [N]: [PHASE NAME]
1. [Step description]
2. [Step description]
...
STATE "PHASE [N] COMPLETE" when finished.
```

Do not combine phases. Do not skip steps. Do not proceed to the next phase until the current phase is explicitly stated complete.

---

## Phase Directives (Ready to Execute)

Copy and issue these directives verbatim:

### PHASE 1: FOUNDATION SETUP

```text
EXECUTE PHASE 1: FOUNDATION SETUP - Focus on project synchronization and SRS generation. 1. Perform full project sync and verify all files. 2. Generate/Update comprehensive IEEE Standard SRS for current application state (v3.0.0). 3. Update project metadata and core configuration. 4. Verify React 19.2.5 version compliance. STATE "PHASE 1 COMPLETE" when finished.
```

### PHASE 2: CORE IMPLEMENTATION (SECURITY & UX)

```text
EXECUTE PHASE 2: CORE IMPLEMENTATION - Focus on Admin security, Audit logging, and Accessibility. 1. Implement/Verify password-protected Admin section (#/admin). 2. Integrate comprehensive Audit Logging for all administrative actions. 3. Ensure 100% ARIA/Tooltip coverage for accessibility. 4. Implement/Verify Light, Dark, and High-Contrast themes. STATE "PHASE 2 COMPLETE" when finished.
```

### PHASE 3: TESTING FRAMEWORK INTEGRATION

```text
EXECUTE PHASE 3: TESTING FRAMEWORK - Focus on self-testing and E2E automation. 1. Integrate internal diagnostic/simulation tools in Admin section. 2. Create and verify Playwright E2E test suite. 3. Implement interactive test dashboard with screenshot capture. 4. Verify all core user flows via automated tests. STATE "PHASE 3 COMPLETE" when finished.
```

### PHASE 4: DOCUMENTATION & DIAGRAMS

```text
EXECUTE PHASE 4: DOCUMENTATION & DIAGRAMS - Focus on architectural visualization. 1. Generate System Architecture SVG diagram. 2. Generate Database/Data Flow SVG diagram. 3. Create comprehensive Admin Guide (.md). 4. Create Deployment and Testing Guides (.md). STATE "PHASE 4 COMPLETE" when finished.
```

### PHASE 5: FINAL ALIGNMENT & PACKAGING

```text
EXECUTE PHASE 5: FINAL ALIGNMENT - Focus on SRS synchronization and documentation organization. 1. Perform final Gap Analysis between SRS and Implementation. 2. Synchronize SRS with "as-built" state (v3.0.0). 3. Embed all SVG diagrams into the SRS document. 4. Organize all guides and diagrams in the /docs directory. STATE "PHASE 5 COMPLETE - REFRESH FINISHED" when complete.
```

---

## Repository Overview

**aucdt-utilities** â€” monorepo for **Techbridge University College (TUC)**.
260+ projects (Vite/React frontends + Node.js backends + Java/Spring Boot services). Target: 256 apps (THE AGENT Book Project).

**Java services:** `grooverx/backend` (Spring Boot 3.5, MariaDB, MinIO, Redis), `send-platform-api` (Spring Boot 3.5, MySQL, Quartz).
**Docker:** 100% coverage achieved (March 2026).

> See SHARED-STANDARDS.md for full tech stack, branding, mandatory requirements, and compliance checklist.

---

## Portfolio Pipeline

The canonical workflow for generating portfolio screenshots:

```bash
# 1. Patch login pages with app-specific branding (run once or after new apps added)
node scripts/patch-login-pages.js

# 2. Build all apps, serve via HTTP, capture /login screenshot (falls back to /)
node scripts/build-serve-screenshot.js --concurrency=2

# 3. Regenerate gallery from current screenshot state
node scripts/generate-gallery.js

# Open portfolio
open catalogue/index.html
```

**Key behaviours:**

- Each app gets a unique port to avoid TCP TIME_WAIT conflicts
- Isolated browser context per app (no cache bleed between captures)
- Logs in with `admin/admin` to capture the post-login dashboard (falls back to `/` if no login page)
- Report written to `catalogue/build-serve-screenshot-report.json`
- Gallery at `catalogue/index.html` with live search

---

## Project-Specific Context

> Per-project context should be defined in the project's own `GEMINI_CONTEXT.md` file,
> not in this global constitution. See SHARED-STANDARDS.md for stack defaults.

---

## 6R Implementation Guide

When implementing UI changes, apply the 6R directives in this order:

### 1. REDUCE â€” Eliminate Cognitive Overload

- Minimize UI clutter during active test/assessment sessions
- Group mapping review parameters into logical sub-panels
- Strip anything non-essential from the primary user flow

### 2. REUSE â€” Narrative Consistency

- Apply **Playfair Display** for assessment titles
- Apply **Inter** for evaluative body text
- Reuse the institutional "Audit Stream" grid pattern for assessment history
- Reference the standard "Phase Tracker" component

### 3. RECYCLE â€” Data Equity

- AI grading must strictly follow TUC rubric and curriculum standards
- Integrate the shared "Phase Tracker" component used across the suite
- Never duplicate logic already available in shared utilities

### 4. RETHINK â€” Interaction Design

- Enable real-time curriculum mapping with immediate visual feedback
- Use Gemini to provide qualitative feedback on assessment "rigor" (AI layer)
- Fluid, responsive interactions â€” no page-reload patterns

### 5. REFINE â€” Technical Polish

- 100% ARIA/Tooltip coverage on all interactive assessment nodes
- Implement robust LocalStorage sync for long-running mapping reviews
- All interactive elements keyboard-navigable

### 6. REIMAGINE â€” Evaluative Experience

- Generate high-fidelity "Curriculum Alignment" PDFs for institutional review
- Provide AI-driven corrective pedagogical suggestions based on assessment results
- Boardroom-quality report output

---

## Techbridge Branding (Quick Reference)

| Token        | Value                       |
| ------------ | --------------------------- |
| Gold         | `#C8A84B`                   |
| Ink (bg)     | `#0F0C07`                   |
| Cream (text) | `#F2EBD9`                   |
| Paper (card) | `#141210`                   |
| Title Font   | Playfair Display            |
| Display Font | Bebas Neue                  |
| Body Font    | Cormorant Garamond / Inter  |

Tone: **Academic. Rigorous. Institutional.**

---

## Mandatory Requirements (Non-Negotiable)

1. **React 19.2.5** â€” Locked. No exceptions.
2. **ZERO Broken Links** â€” Remove or fix every non-functional UI element.
3. **Gap Analysis** â€” Two-way SRS â†” Implementation sync after every major change.
4. **Isolated Diagnostics** â€” Tests, logs, and diagnostics in `#/admin` only.
5. **Documentation Sync** â€” SRS must match as-built state at all times.
6. **Institution Name** â€” Always "Techbridge University College" or "TUC". Never "AUCDT" in new output.
7. **ARIA Coverage** â€” 100% on all interactive nodes.

---

## Docker Quick Reference

```bash
# All services
docker-compose -f docker-compose-all-apps.yml up

# New project â€” add to Docker
# 1. Ensure Dockerfile.vite exists in root
# 2. Add service to docker-compose-all-apps.yml
# 3. docker-compose build <service-name>
# 4. docker-compose up <service-name>
```

---

## Common Commands

```bash
# Frontend (Vite)
pnpm install && pnpm run dev

# Backend
cd backend && npm run dev

# Build
pnpm run build

# Test
npm test
cd aucdt-portal-tests && npm run test
```

---

## Completion Signal

After every phase, state completion explicitly:

```text
PHASE [N] COMPLETE
Summary: [What was done]
Next: [Recommended next phase or action]
Blockers: [Any issues requiring Claude review]
```

If blockers are identified, halt and return a structured report to Claude for analysis before proceeding.
