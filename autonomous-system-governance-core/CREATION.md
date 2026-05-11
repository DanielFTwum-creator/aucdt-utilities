# autonomous-system-governance-core

## Purpose
Central governance and policy enforcement engine for autonomous systems at Techbridge University College. Monitors system behavior, validates compliance with institutional directives, and enforces safety constraints across all autonomous operations.

## Stack
- React 19.2.5
- TypeScript 5.8
- Vite 6.2.0
- Tailwind CSS 4.1.14
- Express 4.21.2
- Google GenAI API
- Better-SQLite3
- Framer Motion
- Zustand

## Setup
1. Navigate to project directory: `cd autonomous-system-governance-core`
2. Install dependencies: `pnpm install`
3. Start development server: `pnpm run dev`
4. Run unit tests: `pnpm test`
5. Run E2E tests: `pnpm test:e2e`
6. Build for production: `pnpm run build`

## Key Decisions
- **Policy-as-Code Architecture:** Governance rules stored as executable specifications, enabling AI verification against institutional directives.
- **Real-Time Monitoring:** Express backend continuously monitors autonomous system behavior against compliance thresholds.
- **Immutable Audit Trail:** Better-SQLite3 maintains tamper-proof governance logs for institutional accountability and regulatory compliance.

## Open Questions
- **Policy Conflict Resolution:** How should the system handle conflicting policies from different governance layers (institutional vs department)?
- **Override Mechanisms:** What escalation procedures allow authorized actors to temporarily suspend governance constraints?
