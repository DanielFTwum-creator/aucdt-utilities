# academic-performance-app

## Purpose
A web application for Techbridge University College (TUC) designed to track and analyze academic performance metrics for students and staff. It provides institutional utility for monitoring educational outcomes and student progress.

## Stack
- React 19.2.5
- TypeScript 5.7+
- Vite 7.3.1
- Tailwind CSS 4.2+
- Lucide React
- React Router DOM 7.1.0
- Vitest
- Playwright
- Docker (nginx:alpine)

## Setup
1. Navigate to project directory: `cd academic-performance-app`
2. Install dependencies: `pnpm install`
3. Start development server: `pnpm run dev`
4. Run unit tests: `pnpm test`
5. Run E2E tests: `pnpm test:e2e`
6. Build for production: `pnpm run build`

## Key Decisions
- **Strict Version Locking:** Adheres to the TUC institutional mandate of React 19.2.5 and Vite 7.3.1 to ensure stability across the monorepo.
- **Auth-Gated Architecture:** Implements a centralized `AuthGate` and `ProtectedRoute` pattern to secure institutional data and the administrative section.
- **Containerized Delivery:** Uses a multi-stage Docker build targeting `nginx:alpine` to maintain a minimal image footprint (target ~20 MB).

## Open Questions
- **ARIA Compliance:** The SRS indicates that 100% ARIA coverage is currently non-compliant; how will the audit be conducted?
- **Admin Isolation:** The SRS identifies the admin section as non-compliant regarding total isolation; what is the timeline for remediation?
