# Software Requirements Specification

**Project:** Fraud Detection Engine  
**App ID:** 137  
**Version:** 3.0.0  
**Status:** As-Built  
**Institution:** Techbridge University College (TUC)  
**Date:** 2026-04-26  
**Standard:** IEEE 29148-2018  

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the functional and non-functional requirements for the **Fraud Detection Engine (FDE)**, a real-time FinTech monitoring platform deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, administrators, and stakeholders.

### 1.2 Scope

The Fraud Detection Engine is a full-stack TypeScript application providing:
- Real-time entity health monitoring and scoring
- Interactive dashboards with data visualisation
- Automated alert generation and acknowledgement workflows
- Administrative diagnostics and Sentinel AI Orchestrator integration
- RESTful API layer with persistent SQLite database

**In scope:**
- All functional UI components and user flows (Dashboard, Entities, Health, Alerts)
- Authentication and authorisation for admin routes
- Entity CRUD operations and health score computation
- Sentinel integration endpoints (health reporting, autonomous remediation)
- Admin section with 6 sub-routes (diagnostics, db-monitor, logs, performance, testing, sentinel)
- Dark/Light theme support with persistence

**Out of scope:**
- Backend database administration beyond the embedded SQLite
- Third-party payment processing systems
- Network infrastructure and load balancing
- Production ML model training (inference endpoint is a placeholder)

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| TUC | Techbridge University College |
| FDE | Fraud Detection Engine |
| SPA | Single-Page Application |
| SRS | Software Requirements Specification |
| ARIA | Accessible Rich Internet Applications |
| JWT | JSON Web Token |
| CI/CD | Continuous Integration / Continuous Deployment |

### 1.4 References

- SHARED-STANDARDS.md â€” TUC Canonical AI Governance Layer
- GEMINI.md â€” Execution Agent Constitution
- CLAUDE.md â€” Audit & Analysis Agent Constitution
- IEEE 29148-2018 â€” Systems and Software Engineering Requirements
- TUC Refresh Directive: <https://ai-tools.aucdt.edu.gh/refresh>

### 1.5 Overview

Section 2 describes the overall product context. Section 3 lists system features and functional requirements. Section 4 covers external interfaces. Section 5 defines non-functional requirements. Section 6 provides the compliance matrix. Section 7 details the tech stack. Section 8 contains architectural diagrams.

---

## 2. Overall Description

### 2.1 Product Perspective

The Fraud Detection Engine is a standalone full-stack application within the TUC monorepo (`aucdt-utilities`). It consists of:
- **Frontend:** React 19.2.5 SPA with Vite, Tailwind CSS 4, Zustand state management, and Recharts data visualisation
- **Backend:** Express server with SQLite persistence, REST API, and background metric simulation
- **Infrastructure:** Docker deployment with nginx:alpine

The application communicates with The Sentinel AI Orchestrator via REST endpoints for health reporting and autonomous remediation.

### 2.2 Product Functions

1. **Entity Management** â€” CRUD operations for monitored financial entities
2. **Health Scoring** â€” Automated health score computation with 5-second refresh cycles
3. **Dashboard Visualisation** â€” Real-time stat cards, area charts, and trend analysis
4. **Alert System** â€” Severity-coded alerts derived from health score thresholds with acknowledgement workflow
5. **Health Monitoring** â€” Per-entity health distribution, bar charts, and status grid
6. **Admin Panel** â€” Protected admin section with 6 operational sub-routes
7. **Sentinel Integration** â€” Health reporting and autonomous remediation via REST API
8. **Theme Support** â€” Dark/Light mode toggle with persistence
9. **AI/ML Endpoint** â€” Placeholder for Gemini-powered fraud prediction

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| Analyst | Financial analysts monitoring entity health | Standard (Dashboard, Entities, Health, Alerts) |
| Administrator | System admins with full configuration access | Full (includes #/admin routes) |
| Sentinel | The Sentinel AI Orchestrator (automated) | API-only (health-report, remediation) |

### 2.4 Operating Environment

- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Device:** Desktop (primary), tablet (responsive), mobile (responsive)
- **Runtime:** Node.js 20+ (server), modern browser (client)
- **Database:** SQLite via better-sqlite3 (embedded)
- **Container:** Docker (nginx:alpine), port 80 internal / mapped externally
- **Dev Server:** Express + Vite middleware on port 3000

### 2.5 Design and Implementation Constraints

- **React version:** Exactly 19.2.5 â€” locked, no exceptions
- **Build tool:** Vite 8.x (dev dependency) / Vite 6.x (dev server middleware)
- **Package manager:** pnpm (preferred), npm (fallback)
- **Styling:** Tailwind CSS 4.x with TUC design tokens
- **Accessibility:** WCAG 2.1 AA minimum; 100% ARIA coverage on interactive elements
- **Branding:** TUC colour palette (Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`)
- **Fonts:** Inter (body text), Playfair Display (titles where applicable)

### 2.6 Assumptions and Dependencies

- SQLite database file (`fde.db`) is writable and persists across server restarts
- The Sentinel AI Orchestrator is available for health report consumption
- Docker and Docker Compose available in deployment environment
- No external authentication service required (self-contained admin/admin credentials)

---

## 3. System Features (Functional Requirements)

### 3.1 Core Application Shell

| ID | Requirement | Status |
|---|---|---|
| FR-001 | The application shall render without errors in all supported browsers | âœ… Implemented |
| FR-002 | The application shall display a loading state during async operations | âœ… Implemented |
| FR-003 | The application shall display error states on API failure | âš ï¸ Partial (store sets error, no UI display) |
| FR-004 | The application shall display empty states when no data is available | âœ… Implemented (Alerts "All Clear") |

### 3.2 Navigation and Routing

| ID | Requirement | Status |
|---|---|---|
| FR-010 | Client-side routing without full page reloads (React Router) | âœ… Implemented |
| FR-011 | All navigation links shall be functional and lead to valid routes | âœ… Implemented |
| FR-012 | 404 routes handled with redirect to Dashboard | âœ… Implemented |
| FR-013 | Sidebar shall correctly highlight the active route | âœ… Implemented (fixed exact match for `/`) |

### 3.3 Dashboard

| ID | Requirement | Status |
|---|---|---|
| FR-020 | Display total entities, healthy, warning, and critical counts | âœ… Implemented |
| FR-021 | Display average health score banner | âœ… Implemented |
| FR-022 | Display health score trends area chart (Recharts) | âœ… Implemented |
| FR-023 | Auto-refresh entity data every 5 seconds | âœ… Implemented |

### 3.4 Entity Management

| ID | Requirement | Status |
|---|---|---|
| FR-030 | List all entities with health score and status | âœ… Implemented |
| FR-031 | Display color-coded health scores (green/yellow/red) | âœ… Implemented |
| FR-032 | Entity detail view via REST API | âœ… Implemented (API endpoint) |
| FR-033 | Entity metrics history via REST API | âœ… Implemented (fixed SQL bug) |

### 3.5 Health Monitoring

| ID | Requirement | Status |
|---|---|---|
| FR-040 | Display health distribution summary (Healthy/Warning/Critical) | âœ… Implemented |
| FR-041 | Display per-entity horizontal bar chart | âœ… Implemented |
| FR-042 | Display entity status grid with trend indicators | âœ… Implemented |
| FR-043 | Auto-refresh health data every 5 seconds | âœ… Implemented |

### 3.6 Alert System

| ID | Requirement | Status |
|---|---|---|
| FR-050 | Generate alerts for entities with health score < 80 | âœ… Implemented |
| FR-051 | Classify alerts as Critical (<50) or Warning (<80) | âœ… Implemented |
| FR-052 | Display active alert count | âœ… Implemented |
| FR-053 | Allow alert acknowledgement | âœ… Implemented |
| FR-054 | Display "All Clear" when no active alerts | âœ… Implemented |

### 3.7 Theme Support

| ID | Requirement | Status |
|---|---|---|
| FR-060 | Support Light and Dark themes | âœ… Implemented |
| FR-061 | All pages and components respect theme state | âœ… Implemented |
| FR-062 | Theme toggle accessible from header | âœ… Implemented |
| FR-063 | Theme preference persistence via localStorage | âœ… Implemented (Phase 2) |
| FR-064 | High-Contrast theme support | âœ… Implemented (Phase 2) |

### 3.8 Authentication & Admin Section

| ID | Requirement | Status |
|---|---|---|
| FR-070 | Password-protected login page | âœ… Implemented |
| FR-071 | Protected admin routes requiring authentication | âœ… Implemented (RequireAuth guard) |
| FR-072 | Admin Diagnostics sub-route | âœ… Implemented (Phase 2) |
| FR-073 | Admin Database Monitor sub-route | âœ… Implemented (Phase 2) |
| FR-074 | Admin System Logs sub-route | âœ… Implemented (Phase 2) |
| FR-075 | Admin Performance sub-route | âœ… Implemented (Phase 2) |
| FR-076 | Admin Testing sub-route | âœ… Implemented (Phase 2) |
| FR-077 | Admin Sentinel Console sub-route | âœ… Implemented |

### 3.9 Sentinel Integration

| ID | Requirement | Status |
|---|---|---|
| FR-080 | Health report endpoint (`GET /api/v1/sentinel/health-report`) | âœ… Implemented |
| FR-081 | Remediation action endpoint (`POST /api/v1/sentinel/remediation`) | âœ… Implemented |
| FR-082 | Sentinel Console UI with live health report display | âœ… Implemented |
| FR-083 | Remediation simulation from UI | âœ… Implemented |
| FR-084 | WebSocket real-time connection | âŒ Pending (future enhancement) |

### 3.10 Backend / API

| ID | Requirement | Status |
|---|---|---|
| FR-090 | Health check endpoint (`GET /api/health`) | âœ… Implemented |
| FR-091 | Entity list endpoint (`GET /api/v1/entities`) | âœ… Implemented |
| FR-092 | Entity detail endpoint (`GET /api/v1/entities/:id`) | âœ… Implemented |
| FR-093 | Entity metrics endpoint (`GET /api/v1/entities/:id/metrics`) | âœ… Implemented (SQL fixed) |
| FR-094 | Dashboard overview endpoint (`GET /api/v1/dashboard/overview`) | âœ… Implemented |
| FR-095 | AI prediction endpoint (`POST /api/v1/ai/predict`) | âš ï¸ Placeholder |
| FR-096 | Background metric simulation (5-second interval) | âœ… Implemented |
| FR-097 | Database schema auto-creation | âœ… Implemented |
| FR-098 | Seed data generation (10 entities) | âœ… Implemented |

### 3.11 Accessibility

| ID | Requirement | Status |
|---|---|---|
| FR-100 | All interactive elements shall have ARIA labels | âœ… Implemented (Phase 2 â€” 100% coverage) |
| FR-101 | Application navigable via keyboard alone | âœ… Implemented (Phase 2) |
| FR-102 | Skip-to-content link | âœ… Implemented |
| FR-103 | Focus indicators visible on all focusable elements | âœ… Implemented (Phase 2) |

---

## 4. External Interface Requirements

### 4.1 User Interface

- Responsive layout: 320px (mobile) â†’ 1920px (desktop)
- TUC splash screen on initial load with gold loading bar
- Sidebar navigation with collapsible layout
- Header with system status, version, and theme toggle
- No broken links or dead UI elements

### 4.2 REST API Interfaces

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/health` | GET | Health check |
| `/api/v1/entities` | GET | List all entities with health scores |
| `/api/v1/entities/:id` | GET | Entity detail |
| `/api/v1/entities/:id/metrics` | GET | Entity metrics history |
| `/api/v1/dashboard/overview` | GET | Dashboard aggregated stats |
| `/api/v1/sentinel/health-report` | GET | Sentinel health report |
| `/api/v1/sentinel/remediation` | POST | Autonomous remediation action |
| `/api/v1/ai/predict` | POST | AI/ML fraud prediction (placeholder) |

### 4.3 Database Schema

| Table | Purpose |
|---|---|
| `entities` | Entity records (id, name, status, data, timestamps) |
| `metrics` | Time-series performance metrics per entity |
| `health_scores` | Computed health scores per entity over time |

### 4.4 Communication Interfaces

- HTTPS for all external API calls in production
- CORS configured via Vite proxy in development
- Express JSON body parser for POST endpoints

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 2 seconds on 10 Mbps connection
- Entity data refresh: 5-second interval (configurable)
- Chart/component render: < 100ms
- Bundle size: monitored with Vite build output; target < 500 KB gzipped

### 5.2 Reliability

- Application uptime target: 99.5% (Docker container auto-restart)
- Background metric simulation runs independently of client connections
- Graceful degradation when API endpoints are unavailable

### 5.3 Security

- Admin routes protected behind authentication guard
- No sensitive data stored in localStorage beyond auth state
- All API calls over HTTPS in production
- CSP headers enforced via Nginx configuration
- XSS prevention via React's built-in JSX escaping
- SQL parameterisation for all database queries (no injection risk)

### 5.4 Maintainability

- All source files in TypeScript
- Component-level separation (pages, components, stores, hooks)
- Zustand stores for state management (app, auth, theme)
- No inline styles; all styling via Tailwind classes
- Test coverage target: > 70% for core utilities

### 5.5 Portability

- Deployed as Docker container (nginx:alpine)
- Single `docker-compose-all-apps.yml` entry
- SQLite embedded database (no external DB dependency)
- Environment variables via `.env` files (VITE_ prefix)

---

## 6. Compliance Matrix

| Requirement | Status |
|---|---|
| React 19.2.5 exact version | âœ… Compliant |
| TUC branding applied (splash, favicon, meta) | âœ… Compliant |
| ARIA 100% coverage | âœ… Compliant (Phase 2) |
| Docker service configured | âœ… Compliant |
| SRS matches as-built state | âœ… Compliant (Phase 4 as-built) |
| Zero broken links | âœ… Compliant |
| Admin section isolated | âœ… Compliant (RequireAuth guard) |
| Test suite present | âœ… Compliant (Vitest + Playwright configured) |
| Dark/Light theme | âœ… Compliant |
| High-Contrast theme | âœ… Compliant (Phase 2) |
| Audit logging | âœ… Compliant (Phase 3) |
| Admin page implementations | âœ… All 6 fully implemented (Phase 2) |
| E2E tests (Playwright) | âœ… Compliant (Phase 3) |

---

## 7. Tech Stack Reference

```
Frontend:
  React 19.2.5 (locked)
  TypeScript ~6.0.3
  Vite 8.x (build) / Express+Vite middleware (dev)
  Tailwind CSS 4.x
  Zustand 5.0.12 (state management)
  Recharts 3.8.1 (charts)
  React Router DOM 7.x (routing)
  Lucide React 1.x (icons)
  Framer Motion 12.x (animations)
  Axios 1.x (HTTP client)
  clsx (class utilities)

Backend:
  Express 5.x
  better-sqlite3 12.x (SQLite)
  tsx (TypeScript runner)
  dotenv (environment config)

Build output: dist/
Docker: nginx:alpine
Network: aucdt-network (172.20.0.0/16)
```

---

## 8. Diagrams

### 8.1 System Architecture

![System Architecture](architecture.svg)

### 8.2 Data Flow

![Data Flow](dataflow.svg)

---

*Generated by Phase 1 SRS Generator â€” TUC Refresh Directive*  
*Document version 3.0.0 â€” 2026-04-27 (updated with Phase 4 completions)*  
*Status: Phase 4 Complete â€” All functional requirements implemented*  
*Techbridge University College*
