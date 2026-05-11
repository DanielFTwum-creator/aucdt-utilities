# API Monetization Portal

## Purpose
API marketplace and monetization platform enabling institutions and developers to publish, discover, subscribe to, and monetize APIs. Supports usage metering, billing, developer documentation, and API lifecycle management.

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
5. Configure .env with payment processor and API gateway credentials

## Key Decisions
- Express backend manages API registry, usage tracking, billing calculations, and authentication.
- SQLite stores API metadata, subscription plans, usage logs, and billing records.
- Recharts visualizes API usage metrics, revenue analytics, and developer engagement trends.
- Google GenAI assists with API documentation generation and developer support chatbot.

## Open Questions
- Will the platform support SaaS billing models (tiered subscriptions, usage-based pricing)?
- Should it integrate with payment processors (Stripe, PayPal) for automated billing?
