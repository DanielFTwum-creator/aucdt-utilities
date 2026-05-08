# System Requirements Specification (SRS) - v3.0.0
## Project: Techbridge University College (TUC) Utilities Suite
**Date:** March 11, 2026
**Status:** AS-BUILT

---

## 1. Executive Summary
This suite consists of 261 applications (245 Frontend, 16 Backend) serving the Techbridge University College ecosystem. This version (v3.0.0) marks the completion of the "Refactor & Integration" phase, ensuring full containerization and administrative oversight.

## 2. Institutional Compliance Mandates
- **React Version:** React 19.2.5 (Locked).
- **Styling:** Material Design / Tailwind v4 / 6R Methodology.
- **Accessibility:** 100% ARIA/Tooltip coverage.
- **Branding:** TUC Gold (#C8A84B), Ink (#0F0C07), Cream (#F2EBD9).

## 3. Architecture & Infrastructure
- **Infrastructure:** Docker Compose (262 services).
- **Gateway:** Nginx (Port 8080) serving as a centralized proxy and catalogue host.
- **Frontend:** React 19.2.5 + Vite 7.3.1.
- **Backend:** Node.js 20+ / Express with integrated Admin Dashboards.
- **Database:** PostgreSQL/MySQL (Project-specific).

## 4. Key Functional Modules
### 4.1 Admin Section (`#/admin`)
- Hidden administrative route in all frontend apps.
- Password protection enabled.
- Integrated Audit Logging and System Diagnostics.

### 4.2 Backend Admin UIs
- All 16 backend APIs serve a static Admin UI at `/`.
- Standardized `/health` endpoints for orchestration.

### 4.3 App Catalogue
- Centralized gallery at `http://localhost:8080/catalogue/`.
- Automated screenshot capture using Playwright.

## 5. Testing Framework
- **Unit Testing:** Vitest.
- **E2E Testing:** Playwright (Primary).
- **Visual Validation:** Playwright-based screenshot automation.

## 6. Revision History
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2026-03-07 | 1.0 | Initial Scaffolding | ReactUIRemediator |
| 2026-03-11 | 3.0.0 | Full Backend Integration & Docker Fix | Gemini CLI |

---
*Verified by TUC ICT Department*
