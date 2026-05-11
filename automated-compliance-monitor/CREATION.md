# Automated Compliance Monitor

## Purpose
Real-time compliance monitoring and alerts system ensuring adherence to institutional policies, regulations, and standards. Flags violations, automates remediation workflows, and provides audit trails for regulatory reporting.

## Stack
- React 19.2.5
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
5. Set up .env with API credentials and compliance rule definitions

## Key Decisions
- Express backend monitors systems, evaluates compliance policies, and triggers alerts.
- SQLite persists violation records, remediation actions, and compliance audit trails.
- Recharts displays violation trends, compliance status dashboards, and remediation progress.
- Google GenAI provides intelligent compliance violation analysis and remediation suggestions.

## Open Questions
- Should the system support automated remediation actions (e.g., account suspension, permission revocation)?
- Will it integrate with ticketing systems (Jira) for violation triage and tracking?
