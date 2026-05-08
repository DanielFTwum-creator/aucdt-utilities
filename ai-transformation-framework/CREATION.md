# AI Transformation Framework

## Purpose
Enterprise AI adoption and digital transformation framework providing structured methodology, best practices, and tools for organizations implementing AI across business processes. Includes roadmapping, risk assessment, and change management guidance.

## Stack
- React 19.2.5
- TypeScript 5.9.3
- Vite 7.3.1 and 6.2.0
- Express 5.2.1
- Google GenAI API 1.43.0
- Better SQLite3 12.6.2
- Tailwind CSS 4.2.1
- HTML-to-Image 1.11.13
- jsPDF 4.2.0
- Recharts 3.7.0
- Framer Motion 12.34.3
- Vitest 3.0.0
- Playwright 1.49.0

## Setup
1. pnpm install
2. pnpm run dev (vite on port 3000, with --host=0.0.0.0 for network access)
3. pnpm run build (production build to dist/)
4. pnpm test (unit tests with Vitest)
5. pnpm test:e2e (Playwright E2E tests)

## Key Decisions
- React frontend provides interactive transformation roadmap and self-assessment tools.
- Express backend orchestrates framework calculations, scoring, and recommendation logic.
- PDF export capabilities enable comprehensive transformation assessment reports.
- Google GenAI provides intelligent recommendations based on organizational context and maturity level.

## Open Questions
- Should the framework include AI skills assessment and team capability gap analysis?
- Will it support organizational benchmarking against industry peers?
