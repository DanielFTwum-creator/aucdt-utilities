# autonomous-refactoring-ai

## Purpose
Meta-level AI system for automated code refactoring and architectural optimization across the monorepo. Manages AI-driven improvements to infrastructure and service-level systems at Techbridge University College.

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
1. Navigate to project directory: `cd autonomous-refactoring-ai`
2. Install dependencies: `pnpm install`
3. Start development server: `pnpm run dev`
4. Run unit tests: `pnpm test`
5. Run E2E tests: `pnpm test:e2e`
6. Build for production: `pnpm run build`

## Key Decisions
- **Full-Stack Architecture:** Integrated React frontend with Express backend for real-time refactoring orchestration and AI coordination.
- **Google GenAI Integration:** Uses Google's Generative AI API for intelligent code analysis and transformation suggestions.
- **Type Safety:** Strict TypeScript configuration enforces type safety across AI service interactions and data flows.

## Open Questions
- **Refactoring Safety Guardrails:** What validation framework ensures refactoring suggestions preserve application semantics and security?
- **Cross-Service Coordination:** How does the AI coordinate changes across dependent services without breaking deployments?
