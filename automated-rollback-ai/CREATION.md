# Automated Rollback AI

## Purpose
AI-driven deployment rollback automation system that monitors production health metrics and automatically triggers safe rollbacks when anomalies or performance degradation is detected. Reduces mean time to recovery (MTTR) for failed deployments.

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
4. pnpm test (unit tests)
5. Configure .env with deployment system credentials and monitoring endpoints

## Key Decisions
- Express backend monitors deployment health, triggers rollback decisions, and executes rollback APIs.
- SQLite tracks rollback history, success rates, and performance metrics.
- Recharts visualizes deployment status, rollback triggers, and recovery metrics.
- Google GenAI analyzes deployment logs and health signals to improve rollback decision accuracy.

## Open Questions
- What health metrics trigger automatic rollback decisions (error rate, latency, availability)?
- Should the system support gradual/canary rollback strategies or full immediate rollback only?
