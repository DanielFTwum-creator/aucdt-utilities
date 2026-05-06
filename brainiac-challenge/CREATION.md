# brainiac-challenge

## Purpose
Gamified cognitive challenge and assessment platform for Techbridge University College. Delivers adaptive difficulty brain teasers and analytical problems to assess student cognitive aptitude, reasoning ability, and problem-solving skills with real-time scoring and leaderboard functionality.

## Stack
- pnpm 10.30.1
- Node.js 24.x
- TypeScript 5.8+
- Vite 6.2.0+
- React 19.2.4
- Tailwind CSS 4.2+
- Recharts 3.7.0

## Setup
1. Navigate to project directory: `cd brainiac-challenge`
2. Install dependencies: `pnpm install`
3. Start development server: `pnpm run dev`
4. Run tests: `pnpm test`
5. Build for production: `pnpm run build`
6. Preview production build: `pnpm run preview`

## Key Decisions
- **Adaptive Difficulty Engine:** Uses state-based challenge selection to adjust problem complexity based on user performance history.
- **Real-Time Leaderboards:** Recharts visualizations display competitor rankings and skill distribution across user cohorts.
- **Immutable Challenge Library:** Challenges stored as versioned specifications to enable reproducible scoring and fair comparisons across assessment cycles.

## Open Questions
- **Cheating Prevention:** What anti-tampering measures prevent leaderboard manipulation or answer-key exploitation?
- **Skill Mapping:** How does cognitive performance on brainiac-challenge correlate with academic success metrics for validation?
