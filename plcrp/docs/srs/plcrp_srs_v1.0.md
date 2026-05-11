# IEEE SRS â€” PLCRP: Production-Level Content Rights Platform
**Version:** 1.0.0 (as-built)
**Document ID:** TUC-ICT-PLCRP-SRS-v1.0
**Institution:** Techbridge University College
**Status:** Active Development

---

## 1. Introduction

### 1.1 Purpose
PLCRP is an educational sandbox demonstrating production-level content rights management for AI-generated and human-authored music tracks. It enforces hard stage gates, tracks rights status, and maintains a verifiable audit log.

### 1.2 Scope
Single-page React application with localStorage persistence. Intended as an institutional teaching tool for ICT and digital media programmes.

---

## 2. Functional Requirements

| ID | Priority | Requirement |
|---|---|---|
| FR-1 | MUST | Track ingestion with automatic rights resolution (free-tier AI platform â†’ NON_COMMERCIAL) |
| FR-2 | MUST | S2 gate: NON_COMMERCIAL tracks cannot be promoted past Stage 2 |
| FR-3 | MUST | S4 gate: tracks must have â‰¥2 human authorship elements to proceed to S5 |
| FR-4 | MUST | Admin panel at `#/admin` (TUC 2FA for standard users; password gate for admins) |
| FR-5 | MUST | Audit log of all rights decisions, logins, promotions stored in localStorage |
| FR-6 | MUST | Release manager blocks NON_COMMERCIAL tracks at bundle time |
| FR-7 | MUST | Distribution module shows only COMMERCIAL Stage-S5 tracks |
| FR-8 | SHOULD | Audit chain hash (SHA-256-lite) for each track record |
| FR-9 | SHOULD | Playwright E2E tests covering E2 (S2 gate), E5 (S4 gate), E8 (audit chain) |

---

## 3. Non-Functional Requirements

- React 19.2.5 (locked)
- Vite 6 + TypeScript 5.8
- Tailwind CSS 4.2 (TUC brand tokens)
- Dark / Light / High-Contrast themes
- 100% ARIA coverage on interactive elements
- Build target â‰¤ 250 kB gzipped main bundle

---

## 4. Stage Pipeline

| Stage | Name | Key Gate |
|---|---|---|
| S1 | Ingestion | None â€” raw upload |
| S2 | Rights Check | NON_COMMERCIAL tracks BLOCKED here |
| S3 | Editorial | Rights must be COMMERCIAL |
| S4 | Authorship | â‰¥2 human authorship elements required |
| S5 | Distribution Ready | Only stage eligible for DSP submission |

---

## 5. Architecture

```
plcrp/
â”œâ”€â”€ App.tsx                     # Root â€” hash routing, auth gate
â”œâ”€â”€ index.tsx                   # Entry point
â”œâ”€â”€ types.ts                    # Track, Release, AuditLog, RightsStatus
â”œâ”€â”€ constants.tsx               # MODULES[], STAGES[], color maps
â”œâ”€â”€ contexts/
â”‚   â”œâ”€â”€ AuthContext.tsx         # TUC 2FA + admin password auth
â”‚   â””â”€â”€ ThemeContext.tsx        # dark/light/high-contrast
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ Sidebar.tsx             # Module navigation + theme switcher
â”‚   â”œâ”€â”€ Header.tsx              # Breadcrumb + user info + logout
â”‚   â”œâ”€â”€ Dashboard.tsx           # KPI strip + stage summary + module grid
â”‚   â”œâ”€â”€ Admin.tsx               # Audit log + Diagnostics (tabbed)
â”‚   â”œâ”€â”€ LoginModal.tsx          # 2FA (access) or password (admin) modal
â”‚   â””â”€â”€ Loader.tsx              # Spinner with ARIA live region
â”œâ”€â”€ modules/
â”‚   â”œâ”€â”€ Module1_Tracks.tsx      # Track Library (CRUD, rights badge)
â”‚   â”œâ”€â”€ Module2_Releases.tsx    # Release bundling (NON_COMMERCIAL blocked)
â”‚   â”œâ”€â”€ Module3_RightsAudit.tsx # Track detail + promote button (gate enforced)
â”‚   â”œâ”€â”€ Module4_StagePipeline.tsx # Kanban view S1â†’S5
â”‚   â”œâ”€â”€ Module5_AuthorshipRegistry.tsx # Human element recording
â”‚   â””â”€â”€ Module6_Distribution.tsx # DSP submission (COMMERCIAL S5 only)
â”œâ”€â”€ services/
â”‚   â”œâ”€â”€ auditLogService.ts      # localStorage audit with entity/result tagging
â”‚   â””â”€â”€ trackService.ts        # Track CRUD + canPromote() gate logic
â””â”€â”€ tests/
    â”œâ”€â”€ auth.spec.ts
    â”œâ”€â”€ rights-gate.spec.ts     # E2 + E5 gate tests
    â””â”€â”€ audit-log.spec.ts       # E8 audit chain tests
```

---

## 6. Security Notes

- Admin password: `plcrp-admin-2025` (institutional sandbox â€” not production credentials)
- TUC 2FA requires `@techbridge.edu.gh` email domain
- All sessions stored in sessionStorage (cleared on tab close)
- No server-side state â€” all persistence is localStorage / sessionStorage
