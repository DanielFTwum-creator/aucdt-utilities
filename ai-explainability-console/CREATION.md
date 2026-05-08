# AI Explainability Console

## Purpose
XAI (Explainable AI) dashboard for monitoring model interpretability, fairness metrics, feature importance, and algorithmic decision explanations. Enables stakeholders to understand and audit AI model behavior.

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
4. pnpm test (run tests with Vitest)
5. Configure .env with Google GenAI API credentials

## Key Decisions
- Express backend handles model analysis pipelines and explainability computations.
- SQLite stores fairness audits, feature importance rankings, and decision logs.
- Recharts visualizes feature importance distributions, decision boundaries, and fairness metrics.
- Framer Motion enhances visualization of complex model behavior and decision flows.

## Open Questions
- Will the console support integration with live model endpoints (TensorFlow Serving, MLflow)?
- Should SHAP or LIME explanations be pre-computed or calculated on-demand per user request?

