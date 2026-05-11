# AI Log Pattern Analyzer

## Purpose
Log analysis and anomaly detection system using AI for identifying patterns, root causes, and operational issues in application and infrastructure logs. Reduces mean time to resolution (MTTR) for production incidents.

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
5. Configure .env with API credentials and log ingestion endpoints

## Key Decisions
- Express backend ingests logs, performs pattern matching, and triggers anomaly detection.
- SQLite stores log patterns, baselines, and detected anomalies for historical analysis.
- Recharts visualizes error trends, incident timelines, and system health metrics.
- Google GenAI provides intelligent root cause analysis and natural language explanations.

## Open Questions
- Will the system support real-time log streaming from multiple sources (application servers, infrastructure)?
- Should alerts be configurable with escalation policies and notification channels?
