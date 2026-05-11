# Applicant Dashboard

## Purpose
University applicant tracking and management dashboard providing real-time insights into admissions pipeline. Displays key performance indicators, interactive charts, filtering capabilities, and export functionality for admissions officers and administrators.

## Stack
- React 19.2.5
- TypeScript 5.8.2
- Express (backend)
- Vite 7.3.1
- PostgreSQL with TimescaleDB (backend)
- Recharts 3.7.0
- Tailwind CSS 4.2.1
- Vitest 3.0.0
- Playwright 1.49.0

## Setup
1. pnpm install
2. Set up PostgreSQL database with migrations (migrations/01_init.sql)
3. pnpm run dev (Vite dev server + backend server)
4. Configure .env with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
5. pnpm run build (production build to dist/)
6. pnpm test (unit tests)
7. pnpm test:e2e (Playwright E2E tests)

## Key Decisions
- Separate React frontend and Express backend with full TypeScript support for type safety.
- PostgreSQL with TimescaleDB chosen for time-series applicant data and aggregation performance.
- Vite provides fast development iteration for dashboard UI changes.
- Recharts for flexible, responsive data visualizations across multiple chart types.

## Open Questions
- Will the dashboard integrate with institutional identity systems for applicant authentication?
- Should the system support real-time WebSocket updates or polling-based data refresh?

