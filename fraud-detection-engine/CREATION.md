# fraud-detection-engine â€” Creation Document

## Purpose

**Fraud Detection Engine (FDE)** is a real-time FinTech monitoring platform for Techbridge University College (TUC). It provides institutional-grade fraud detection, entity health scoring, and alert orchestration integrated with The Sentinel AI Orchestrator.

**Use cases:**
- Real-time monitoring of financial entities and transaction streams
- Automated health score computation and status reporting
- Alert generation and workflow acknowledgement
- Administrative diagnostics and performance monitoring
- Autonomous remediation integration via Sentinel

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 19.2.5 (locked) |
| **Language** | TypeScript | ~6.0.3 |
| **Build Tool** | Vite | 8.0.10 (dev) / 6.2.0 (dependencies) |
| **Styling** | Tailwind CSS | 4.2.4 |
| **State** | Zustand | 5.0.12 |
| **Charts** | Recharts | 3.8.1 |
| **Routing** | React Router DOM | 7.14.2 |
| **Backend** | Express | 5.2.1 |
| **Database** | SQLite | better-sqlite3 12.9.0 |
| **API Client** | Axios | 1.15.2 |
| **Deployment** | Docker | nginx:alpine |
| **Package Manager** | pnpm | (preferred) |

## Key Decisions

### 1. **React 19.2.5 (Locked)**
- Version is intentionally locked to 19.2.5 to avoid breaking changes
- No minor/patch upgrades without full regression testing
- Rationale: Stability and reproducibility across deployments

### 2. **SQLite over Relational DB**
- Embedded database (better-sqlite3) for simplicity and portability
- No external database service dependency
- Data persists across server restarts in `fde.db`
- Suitable for institutional single-instance deployments

### 3. **Zustand for State Management**
- Lightweight, unopinionated state container
- Simple API with no boilerplate
- Sufficient for application scope (entities, alerts, theme, auth)

### 4. **Express 5.x + Vite Dev Server**
- Express serves production builds and REST API
- Vite middleware in development for fast HMR
- No separate frontend/backend build step needed

### 5. **Authentication: Self-Contained**
- Built-in credentials (`admin/admin`)
- No external OAuth/SSO required
- Admin routes protected with `RequireAuth` guard
- Future enhancement: JWT token support

### 6. **Theme: Light / Dark / High-Contrast**
- All pages theme-aware using Tailwind CSS utilities
- Theme state persisted in localStorage
- WCAG 2.1 AA accessibility compliance on all themes

### 7. **Sentinel Integration: REST + Webhooks**
- Health reporting endpoint: `/api/v1/sentinel/health-report`
- Remediation endpoint: `/api/v1/sentinel/remediation`
- Bidirectional communication via REST (WebSocket pending)

### 8. **Testing: Vitest + Playwright**
- Unit/component tests with Vitest and React Testing Library
- E2E tests with Playwright
- Coverage tracking via @vitest/coverage-v8

## Setup Instructions

### Prerequisites
- Node.js 20+
- pnpm 9+ (or npm 10+)
- Docker (for containerized deployment)

### Development

```bash
# Install dependencies
pnpm install

# Start dev server (Express + Vite HMR on localhost:3000)
pnpm run dev

# Run tests (interactive)
pnpm run test

# Run E2E tests
pnpm run test:e2e

# Check TypeScript
pnpm run lint

# Build for production
pnpm run build
```

### Production Deployment

```bash
# Build Docker image
docker build -t fraud-detection-engine:3.0.0 .

# Run container
docker run -p 80:3000 fraud-detection-engine:3.0.0

# Container serves built SPA + Express API on port 80
```

### Database Initialization

The SQLite database (`fde.db`) is created automatically on first server start via `/api/init` endpoint. Metrics are simulated every 5 seconds for demo/testing purposes.

## Project Structure

```
fraud-detection-engine/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ components/         # Reusable UI components (sidebar, cards, charts)
â”‚   â”œâ”€â”€ pages/              # Route-level pages (Dashboard, Entities, Health, Alerts, Admin)
â”‚   â”œâ”€â”€ pages/admin/        # Protected admin pages (6 sub-routes)
â”‚   â”œâ”€â”€ a11y/               # Accessibility helpers (ARIA tooltips)
â”‚   â”œâ”€â”€ hooks/              # React hooks (polling, data fetching)
â”‚   â”œâ”€â”€ stores/             # Zustand stores (auth, theme, app state)
â”‚   â”œâ”€â”€ services/           # API client services
â”‚   â”œâ”€â”€ types/              # TypeScript type definitions
â”‚   â”œâ”€â”€ utils/              # Utility functions
â”‚   â”œâ”€â”€ App.tsx             # Router configuration
â”‚   â”œâ”€â”€ Layout.tsx          # Main layout (sidebar + main content)
â”‚   â”œâ”€â”€ main.tsx            # Entry point
â”‚   â””â”€â”€ index.css           # Global styles + Tailwind imports
â”œâ”€â”€ server.ts               # Express server (dev + prod)
â”œâ”€â”€ vite.config.ts          # Vite build configuration
â”œâ”€â”€ vitest.config.ts        # Vitest configuration
â”œâ”€â”€ vitest.e2e.config.ts    # Playwright E2E configuration
â”œâ”€â”€ tailwind.config.ts      # Tailwind CSS configuration
â”œâ”€â”€ tsconfig.json           # TypeScript configuration
â”œâ”€â”€ package.json            # Dependencies and scripts
â”œâ”€â”€ Dockerfile              # Docker image definition
â”œâ”€â”€ docs/
â”‚   â”œâ”€â”€ SRS.md              # Software Requirements Specification (IEEE 29148)
â”‚   â”œâ”€â”€ ARCHITECTURE.md     # System architecture and design
â”‚   â”œâ”€â”€ DEPLOYMENT_GUIDE.md # Deployment instructions
â”‚   â”œâ”€â”€ TESTING_GUIDE.md    # Testing procedures
â”‚   â””â”€â”€ ADMIN_GUIDE.md      # Administrator guide
â”œâ”€â”€ CHANGELOG.md            # Version history
â”œâ”€â”€ GAP_ANALYSIS.md         # SRS vs. Implementation alignment
â””â”€â”€ CREATION.md             # This file

```

## Open Questions & Resolutions

### Q1: How are health scores computed?
**A:** Health scores are derived from a simulated metric stream (0â€“100 range). Every 5 seconds, metrics are regenerated per entity with slight variance (Â±10 points). In production, these would be computed from actual transaction/fraud signals.

### Q2: Can I integrate real fraud detection models?
**A:** Yes. The `/api/v1/predict` endpoint is a placeholder. Replace it with calls to your ML inference service (e.g., Gemini AI, custom PyTorch model, or third-party API).

### Q3: How do I add new admin pages?
**A:** Create a new component in `/src/pages/admin/`, add a route in `App.tsx` under the `/admin/*` route group, and link it from `AdminNav.tsx`.

### Q4: Is authentication production-ready?
**A:** The current implementation (`admin/admin` credentials) is suitable for institutional deployments behind a firewall. For public-facing systems, upgrade to JWT tokens or OAuth2 (roadmap item).

### Q5: How do I backup the database?
**A:** The `fde.db` SQLite file persists in the working directory. Back it up as a regular file. Docker volumes can be used for persistent storage across container restarts.

### Q6: Can I deploy to Kubernetes?
**A:** Yes. The Dockerfile is Kubernetes-compatible. Use Helm charts or raw manifests with the Docker image. Ensure persistent volume claims for `fde.db`.

### Q7: How do I test Sentinel integration?
**A:** The `/admin/sentinel-console` page provides a UI to trigger health reports and remediation actions. Logs appear in the Admin Logs tab.

## Recent Milestones

| Phase | Completion Date | Key Deliverables |
|-------|---|---|
| Phase 1 | 2026-02-28 | Core scaffold, SRS v1.0, bug fixes |
| Phase 2 | 2026-03-09 | Admin pages, accessibility (ARIA), themes, persistence |
| Phase 3 | 2026-03-17 | Audit logging, E2E tests, architecture diagrams |
| Phase 4 | 2026-04-26 | Final SRS v3.0.0, gap analysis, documentation |

## Roadmap (Potential Future Enhancements)

- [ ] WebSocket real-time alerts (vs. HTTP polling)
- [ ] JWT token-based authentication
- [ ] Multi-tenant support
- [ ] Real ML fraud detection model integration
- [ ] Database connection pooling for scale
- [ ] GraphQL API alternative to REST
- [ ] Mobile app (React Native)

## Support & Maintenance

**Contact:** daniel.twum@techbridge.edu.gh  
**Institution:** Techbridge University College (TUC), Oyibi, Greater Accra, Ghana  
**Maintainer:** Daniel Frempong Twum, Head of ICT

---

*Last Updated: 2026-04-27*  
*Status: Phase 4 Complete â€” Ready for Phase 5 (Final Alignment & Packaging)*
