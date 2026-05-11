# autonomous-robotics-coordination-engine

## Purpose
Distributed coordination and orchestration system for autonomous robotics and multi-agent systems at Techbridge University College. Manages real-time system state and AI-driven autonomous decision-making across interconnected services.

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
1. Navigate to project directory: `cd autonomous-robotics-coordination-engine`
2. Install dependencies: `pnpm install`
3. Start development server: `pnpm run dev`
4. Run unit tests: `pnpm test`
5. Run E2E tests: `pnpm test:e2e`
6. Build for production: `pnpm run build`

## Key Decisions
- **Real-Time Orchestration:** Full-stack architecture with React UI and Express backend for live system coordination and state synchronization.
- **GenAI-Driven Decision Making:** Integrates Google Generative AI for intelligent resource allocation and system optimization.
- **Reactive State Management:** Uses Zustand for predictable, centralized state with minimal boilerplate.

## Open Questions
- **Fault Tolerance:** How are cascading failures handled when one autonomous system becomes unreachable?
- **Safety Constraints:** What are the governance rules preventing autonomous systems from violating institutional policies?
