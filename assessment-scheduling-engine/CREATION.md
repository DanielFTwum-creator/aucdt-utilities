# Assessment Scheduling Engine

## Purpose
Educational assessment scheduling and calendar management system for managing exams, quizzes, assignments, and course evaluations. Coordinates scheduling across departments, manages room allocation, and prevents scheduling conflicts.

## Stack
- React 19.2.5
- TypeScript 5.8.2
- Vite 7.3.1
- Tailwind CSS 4.2.1
- Recharts 3.7.0
- React Router DOM 7.1.0
- Lucide React icons
- Vitest 3.0.0
- Playwright 1.49.0

## Setup
1. pnpm install
2. pnpm run dev (Vite dev server, port 5173)
3. pnpm run build (production build to dist/)
4. pnpm test (unit tests with Vitest)
5. pnpm test:e2e (Playwright E2E tests)

## Key Decisions
- Frontend-only SPA with Vite for rapid calendar UI development and iteration.
- React hooks and context for managing scheduling state and conflicts.
- Tailwind CSS for responsive calendar interface across desktop and mobile devices.
- Recharts for visualizing assessment distribution and scheduling analytics.

## Open Questions
- Will the system integrate with institutional calendar systems (Outlook, Google Calendar)?
- Should the engine support automatic conflict resolution or only alert administrators?

