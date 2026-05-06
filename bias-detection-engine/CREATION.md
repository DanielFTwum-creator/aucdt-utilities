# bias-detection-engine

## Purpose
AI-powered fairness and bias detection system for Techbridge University College. Analyzes institutional decision-making processes and algorithmic systems to identify and remediate discriminatory patterns in admissions, assessment, and resource allocation.

## Stack
- React 19.2.4
- TypeScript 5.8
- Vite 6.2.0
- Tailwind CSS 4.1.14
- Express 4.21.2
- Google GenAI API
- Better-SQLite3
- Framer Motion
- Zustand

## Setup
1. Navigate to project directory: `cd bias-detection-engine`
2. Install dependencies: `pnpm install`
3. Start development server: `pnpm run dev`
4. Run unit tests: `pnpm test`
5. Run E2E tests: `pnpm test:e2e`
6. Build for production: `pnpm run build`

## Key Decisions
- **GenAI-Driven Analysis:** Uses Google Generative AI to identify subtle statistical patterns and demographic disparities across institutional workflows.
- **Remediation Recommendations:** Provides explainable, actionable suggestions for eliminating detected biases without reducing institutional effectiveness.
- **Persistent Evidence Storage:** Better-SQLite3 maintains immutable records of all bias detection findings for regulatory compliance and trend analysis.

## Open Questions
- **Fairness Metric Selection:** Which fairness definitions (demographic parity, equalized odds, individual fairness) should have priority in conflict scenarios?
- **Human-in-the-Loop Approval:** Should bias remediation recommendations require manual review before implementation, or auto-apply with audit logging?
