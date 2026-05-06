# AI Knowledge Compression Lab

## Purpose
Knowledge extraction and compression laboratory for distilling large datasets into efficient, interpretable representations. Focuses on model distillation, feature extraction, and information density optimization for resource-constrained environments.

## Stack
- React 19.2.4
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
5. Configure .env with API credentials

## Key Decisions
- Express backend orchestrates compression pipelines and knowledge extraction workflows.
- SQLite persists compressed knowledge representations and compression metrics.
- Recharts displays compression ratios, information loss analysis, and efficiency gains.
- Google GenAI provides semantic understanding for intelligent compression strategies.

## Open Questions
- What compression algorithms are targeted (quantization, pruning, distillation)?
- Should the lab support streaming compression for large datasets or batch processing only?

