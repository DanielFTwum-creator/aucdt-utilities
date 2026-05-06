# AI Code Reviewer

## Purpose
AI-powered code review tool leveraging LLM (Google GenAI) to analyze code quality, identify bugs, suggest refactoring, and enforce best practices across development teams. Integrates with version control workflows.

## Stack
- React 19.2.4
- TypeScript 5.8.2
- Vite 7.3.1
- Google GenAI API 1.9.0
- React Router DOM 7.1.0
- Tailwind CSS 4.2.1
- Lucide React icons
- Vitest 3.0.0

## Setup
1. pnpm install
2. Create .env file with VITE_GOOGLE_GENAI_API_KEY
3. pnpm run dev (starts dev server, port 5173)
4. pnpm run build (production build to dist/)
5. pnpm test (unit tests)
6. pnpm test:e2e (E2E tests)

## Key Decisions
- Frontend-heavy SPA using React for real-time code review interface and instant AI feedback.
- Google GenAI for semantic code analysis, quality metrics, and vulnerability detection.
- Vite provides hot module replacement for rapid UI iteration during feature development.
- Tailwind CSS simplifies responsive design for code editor and review comment panels.

## Open Questions
- Will the tool integrate with GitHub/Bitbucket for automated PR reviews?
- Should historical code review data be persisted for trend analysis and team analytics?

