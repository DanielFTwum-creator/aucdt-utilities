# Attendance Tracking System

## Purpose
Student attendance and engagement tracking system for monitoring class participation, identifying at-risk students, and generating attendance reports for academic advisors and instructors.

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
- React frontend with Vite for rapid development of attendance tracking interface.
- Recharts provides attendance trend visualization and at-risk student identification charts.
- Tailwind CSS enables consistent, responsive interface for instructors and administrators.
- Context-based state management for session attendance records and student engagement metrics.

## Open Questions
- Will the system integrate with learning management systems (Canvas, Blackboard) for automatic roster sync?
- Should it support biometric or geolocation-based attendance verification?

