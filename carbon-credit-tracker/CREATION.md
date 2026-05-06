# carbon-credit-tracker

## Purpose
Environmental sustainability and carbon offset tracking system for Techbridge University College. Monitors institutional carbon footprint, manages carbon credit portfolios, and tracks progress toward net-zero operations targets through integrated analytics and environmental impact reporting.

## Stack
- React 19.2.4
- TypeScript 5.8
- Vite 6.2.0
- Tailwind CSS 4.1.14
- Express 4.21.2
- Google GenAI API
- Better-SQLite3
- Recharts 3.7.0
- Framer Motion
- Zustand

## Setup
1. Navigate to project directory: `cd carbon-credit-tracker`
2. Install dependencies: `pnpm install`
3. Start development server: `pnpm run dev`
4. Run unit tests: `pnpm test`
5. Run E2E tests: `pnpm test:e2e`
6. Build for production: `pnpm run build`

## Key Decisions
- **Full Environmental Intelligence:** React UI with Recharts visualizations displaying carbon metrics across operational domains (energy, transport, waste).
- **AI-Powered Projections:** Google GenAI generates predictive models for carbon trajectory and optimization recommendations.
- **Verified Audit Records:** Better-SQLite3 stores signed carbon transaction records meeting environmental accounting standards.

## Open Questions
- **Credit Verification:** How does the system validate third-party carbon credits to prevent fraudulent offsets?
- **Scope 3 Emissions:** Should the tracker include upstream supply chain and student commute emissions, or remain limited to operational Scopes 1-2?
