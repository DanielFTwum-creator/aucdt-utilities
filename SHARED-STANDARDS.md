# Techbridge University College — Canonical AI Governance Layer

**Referenced by:** CLAUDE.md and GEMINI.md
**Refresh Directive:** <https://ai-tools.aucdt.edu.gh/refresh>
**Last Synchronized:** April 2026

---

## Institution Identity

| Field | Value |
|---|---|
| **Current Name** | Techbridge University College (TUC) |
| **Former Name** | AUCDT (Asanka University College of Design & Technology) |
| **Name Change Effective** | February 2026 |
| **Primary Domain** | techbridge.edu.gh |
| **Legacy Domain** | aucdt.edu.gh (still active) |
| **Portal** | portal.aucdt.edu.gh |
| **AI Tools** | ai-tools.aucdt.edu.gh |

---

## Monorepo Identity

- **Repository:** aucdt-utilities
- **Structure:** Flat monorepo — each subdirectory is a standalone project
- **Scale:** ~300 active projects (target: 256 curated — THE AGENT Book Project)
- **Composition:** ~300 apps — Vite/React frontends + Node.js backends + Java/Spring Boot services
- **Java Projects:** `lems` (Spring Boot, lecturer evaluation), `send-platform-api` (Spring Boot 3.5, MySQL, Quartz), `lyriastream/gateway` (Spring Boot gateway), `techBridge-takehome-master`
- **Docker:** 100% coverage achieved (March 2026) — all services configured
- **CI/CD:** Bitbucket Pipelines (parallel builds)
- **Deployment:** Tomcat 9 @ 66.226.72.199 (WAR), Docker containers (Nginx)

---

## Mandatory Technical Standards

### React Version Lock
```
React: 19.2.4 — MANDATORY. Never downgrade. Never upgrade without explicit approval.
```

### Frontend Stack
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7.3.1 (primary) — React Scripts legacy only for unmigrated projects
- **Package Manager:** pnpm (preferred), npm (fallback)
- **UI:** Tailwind CSS 4.2+, Lucide React, Heroicons
- **Charts:** Recharts 3.7.0
- **State:** React hooks, custom hooks pattern

### Backend Stack
- **Runtime:** Node.js 24
- **Framework:** Express 5.2.1
- **Language:** TypeScript 5.9.3
- **Database:** MySQL2 3.17.4 / MariaDB / SQLite
- **Auth:** JWT (jsonwebtoken 9.0.3), bcryptjs 3.0.3
- **Security:** Helmet 8.1.0, express-rate-limit 8.2.1, CORS 2.8.6

### Testing Stack
- **Unit:** Vitest 3.0.0, Jest
- **E2E:** Playwright (aucdt-portal-tests), Playwright 24.37.3
- **Library:** @testing-library/react 16.3.2
- **Coverage Target:** >70% for core utilities

### DevOps
- **Containerization:** Docker multi-stage builds (node:24-alpine → nginx:alpine)
- **Orchestration:** Docker Compose 3.8
- **CI/CD:** Bitbucket Pipelines
- **Reverse Proxy:** Nginx Alpine
- **Image Size Target:** ~20MB per app

---

## Techbridge Branding Standards

### Colour Palette
| Token | Hex | Usage |
|---|---|---|
| Gold | `#C8A84B` | Primary accent, borders, headings |
| Ink | `#0F0C07` | Dark background |
| Cream | `#F2EBD9` | Body text on dark |
| Paper | `#141210` | Card backgrounds |
| Deep Brown | `#5C4033` | Secondary dark surface, primary buttons |
| Green | `#3DB54A` | Status indicators, success states |
| White | `#FFFFFF` | Light mode base |

### Typography
| Role | Font |
|---|---|
| Assessment / Report Titles | Playfair Display |
| Display / Headers | Bebas Neue |
| Body / Evaluative Text | Cormorant Garamond or Inter |

### Tone
Academic, rigorous, institutional. Never casual in client-facing output.

---

## The 6R Methodology (UI/UX Enhancement Framework)

All UI work must align with the 6R directives:

1. **REDUCE** — Eliminate cognitive overload. Minimize clutter during active sessions. Streamline parameters into logical sub-panels.
2. **REUSE** — Narrative consistency. Standardized grids and the institutional "Audit Stream" pattern across the suite.
3. **RECYCLE** — Data equity. AI grading strictly follows TUC rubric. Shared "Phase Tracker" component used across all projects.
4. **RETHINK** — Interaction design. Fluid real-time adjustments with immediate visual feedback.
5. **REFINE** — Technical polish. 100% ARIA/Tooltip coverage. Robust state persistence.
6. **REIMAGINE** — Evaluative experience. High-fidelity PDF reports. Smart AI-driven remediation suggestions.

---

## Phased Refresh Directive Structure

All projects follow this 5-phase refresh sequence. Execute phases sequentially.

### PHASE 1: FOUNDATION SETUP
Sync project, verify all files, generate/update IEEE SRS (v3.0.0), verify React 19.2.4 compliance.
`STATE "PHASE 1 COMPLETE" when finished.`

### PHASE 2: CORE IMPLEMENTATION (SECURITY & UX)
Admin section (#/admin) with password protection, Audit Logging, 100% ARIA coverage, Light/Dark/High-Contrast themes.
`STATE "PHASE 2 COMPLETE" when finished.`

### PHASE 3: TESTING FRAMEWORK INTEGRATION
Internal diagnostics in Admin section, Playwright E2E suite, interactive test dashboard with screenshot capture.
`STATE "PHASE 3 COMPLETE" when finished.`

### PHASE 4: DOCUMENTATION & DIAGRAMS
System Architecture SVG, Database/Data Flow SVG, Admin Guide (.md), Deployment and Testing Guides (.md).
`STATE "PHASE 4 COMPLETE" when finished.`

### PHASE 5: FINAL ALIGNMENT & PACKAGING
Gap Analysis (SRS vs Implementation), SRS sync to as-built state (v3.0.0), embed SVGs into SRS, organize /docs.
`STATE "PHASE 5 COMPLETE - REFRESH FINISHED" when complete.`

---

## Mandatory Project Requirements (Non-Negotiable)

1. **React 19.2.4** — Must remain strictly locked at this version.
2. **ZERO Broken Links** — Every UI element must be fully functional or explicitly removed.
3. **Gap Analysis** — Two-way SRS ↔ Implementation sync required after every major change.
4. **Isolated Diagnostics** — All test simulations, audit logs, and diagnostic tools reside exclusively in the password-protected `#/admin` section.
5. **Documentation Sync** — SRS must always match the as-built application state.
6. **Institution Name** — Use "Techbridge University College" or "TUC" in all new output. AUCDT is legacy only.
7. **ARIA Coverage** — 100% coverage for all interactive nodes and navigation links.

---

## Compliance Checklist (Run Before Any Commit)

- [ ] React version is 19.2.4
- [ ] No broken links or dead UI elements
- [ ] SRS updated to match as-built state
- [ ] Institution referred to as Techbridge University College / TUC
- [ ] All new components have ARIA labels
- [ ] Diagnostics confined to #/admin
- [ ] Branding uses approved palette and typography
- [ ] Docker service added if new project created

---

## THE AGENT Book Project — Path to 256

| Milestone | Status |
|---|---|
| Phase 1: 109 apps, 100% Docker | ✅ Complete (Feb 2026) |
| Phase 2: Expand to 256 apps | ✅ Complete (Mar 2026) |
| Phase 3: Refresh & polish all 256 apps | 🔄 In Progress |
| Java services (grooverx, send-platform-api) | ✅ Complete (Mar 2026) |
| Portfolio pipeline (build → serve → screenshot) | ✅ Complete (Mar 2026) |
| Final: The Sentinel (App #256) | ⏳ Pending |

**The Sentinel:** AI orchestrator (`sentinel-agent`) that autonomously monitors, manages, and repairs all applications. Currently deployed as a submodule at `sentinel-agent/`.

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

**pnpm in scripts / non-interactive contexts — always set `CI=true`**

pnpm refuses to remove stale `node_modules` without a TTY unless `CI=true` is set.
This applies to all automation scripts, spawn calls, and pipeline steps:

```bash
# CLI
CI=true pnpm install --no-frozen-lockfile

# In Node.js scripts (spawn/exec)
env: { ...process.env, CI: 'true' }

# In Bitbucket Pipelines — already injected by the runner; no action needed
```

---

## Subagent Dispatch Protocol

When dispatching a documentation subagent, the task must include all three:

**1. Model instruction**
> "Use the most efficient model available for this structured writing task."

**2. Word limit**
> "Your total output must not exceed 1000 words. If you reach 999 words, stop, write `## Status: Truncated` and list what sections remain."

**3. Output format (CREATION.md, follow exactly)**

```
# [Project Name]

## Purpose
[2 sentences max. What does this project do and for whom.]

## Stack
[Bullet list of technologies only. No explanations.]

## Setup
[Numbered steps to run locally. Commands in backticks.]

## Key Decisions
[3 bullet points. Architecture or design choices that are non-obvious.]

## Open Questions
[2 bullet points. Unresolved issues or next decisions needed.]
```

**Output rules:** No preamble. No closing summary. Start with `#`. Unknown sections → `Unknown — needs owner input.` Filename: `CREATION.md`.

**API caching:** When making API calls from subagents/scripts, enable `cache_control: { type: "ephemeral" }` on large reused static context blocks (system prompts, large doc context). Do not apply to dynamic or user-specific content.

---

## The Sentinel

`sentinel-agent/` (App #256) is the AI orchestrator that monitors, manages, and repairs all applications. Deployed as a git submodule.

> **Guidance to all agents:** Do not assume The Sentinel is running or available. Treat it as a background service. Never defer decisions to it or assume it has acted.

---

## Git Workflow

**Branch:** `feature/descriptive-name` → PR to `master`

**Commit Convention:**
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code restructuring
- `docs:` Documentation
- `test:` Testing changes
- `chore:` Maintenance

---

## External References

| Resource | URL |
|---|---|
| Refresh Directive | https://ai-tools.aucdt.edu.gh/refresh |
| TUC Website | https://techbridge.edu.gh |
| AUCDT Website | https://aucdt.edu.gh |
| Portal | https://portal.aucdt.edu.gh |
| Tomcat Server | 66.226.72.199 → /opt/tomcat/webapps/ |
