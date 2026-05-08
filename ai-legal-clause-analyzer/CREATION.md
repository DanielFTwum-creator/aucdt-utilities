# AI Legal Clause Analyzer

## Purpose
Legal document analysis and clause extraction tool powered by LLMs. Identifies key contractual terms, highlights risks, flags non-standard clauses, and supports legal review workflows for institutional contracts and agreements.

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
5. Set up .env with Google GenAI API key

## Key Decisions
- Express backend handles document upload, parsing, and clause extraction pipelines.
- SQLite stores analyzed contracts, extracted clauses, and risk assessments.
- Google GenAI provides semantic understanding of legal language and clause categorization.
- Recharts visualizes risk profiles and contract comparison metrics.

## Open Questions
- Will the analyzer support template generation for approved institutional contract language?
- Should it integrate with document management systems (SharePoint, OneDrive)?
