# Analytics Hub

## Purpose
Centralized analytics and business intelligence dashboard aggregating institutional data. Provides cross-functional visibility into operations, enrollment trends, financial metrics, and key performance indicators (KPIs) for executive decision-making.

## Stack
- React 19.2.4
- TypeScript 5.7.2
- Vite 7.3.1
- Recharts 3.7.0
- Heroicons 2.2.0
- Tailwind CSS 4.1.18
- jsPDF 4.1.0
- XLSX 0.18.5 (Excel export)
- Vitest 3.0.0
- Playwright 1.49.0

## Setup
1. pnpm install
2. pnpm run dev (starts dev server, port 5173)
3. pnpm run build (production build to dist/)
4. pnpm test (unit tests)
5. pnpm test:e2e (Playwright E2E tests)

## Key Decisions
- Vite provides fast development experience for BI dashboard iteration with frequent data updates.
- Recharts enables flexible, responsive charting across multiple visualization types.
- Export capabilities (PDF, Excel) support executive reporting and stakeholder presentations.
- Tailwind CSS simplifies responsive dashboard layouts across device sizes.

## Open Questions
- Will dashboards connect to real-time data sources (data warehouse, APIs)?
- Should the system support custom dashboard creation by non-technical users?

