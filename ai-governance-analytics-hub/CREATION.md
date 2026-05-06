# AI Governance Analytics Hub

## Purpose
AI governance and compliance monitoring platform for policy enforcement, risk assessment, and regulatory reporting. Tracks deployment policies, audit trails, and ensures alignment with institutional AI ethics standards.

## Stack
- React 19.2.4
- TypeScript 5.8.2
- Express 4.21.2
- Vite 6.2.0
- Google GenAI API 1.29.0
- Better SQLite3 12.4.1
- Recharts 3.7.0
- Tailwind CSS 4.1.14
- Framer Motion 12.34.3
- Vitest 3.0.0

## Setup
1. pnpm install
2. pnpm run dev (tsx server + React dev server)
3. pnpm run build (TypeScript + Vite build)
4. pnpm test (unit tests with Vitest)
5. Set up .env with API credentials and database path

## Key Decisions
- Express backend provides REST API for governance policies and compliance checks.
- SQLite maintains governance rule definitions, audit events, and compliance reports.
- Recharts visualizes compliance metrics, risk trends, and policy violations over time.
- TypeScript enforces type safety across governance data structures and policy rules.

## Open Questions
- Will governance rules be user-configurable or managed centrally by administrators?
- Should the system generate automated remediation recommendations for policy violations?

