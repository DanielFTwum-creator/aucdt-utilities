# academic-integrity-detector

## Purpose
Detects and analyzes academic integrity violations in educational materials for faculty and administrators at Techbridge University College. It provides a dashboard for monitoring alerts and integrating with the Sentinel AI Orchestrator for automated remediation.

## Stack
- React 19.2.4
- TypeScript 5.8.2
- Vite 6.2.0
- Express 4.21.2
- SQLite (better-sqlite3)
- Tailwind CSS 4.1.14
- Zustand 5.0.11
- Recharts 3.7.0
- Google Generative AI (@google/genai)

## Setup
1. Navigate to the project directory: `cd academic-integrity-detector`
2. Install dependencies: `pnpm install`
3. Start the development server: `pnpm run dev`
4. Build for production: `pnpm run build`

## Key Decisions
- **Hybrid Architecture:** Combines a Vite-powered React SPA with a lightweight Express server and SQLite database to ensure rapid local development and easy deployment.
- **Sentinel Integration:** Implements a dedicated service layer and admin console for deep integration with The Sentinel AI Orchestrator, enabling real-time health reports and automated remediation actions.
- **AI-Driven Analysis:** Leverages the Google Generative AI SDK to power the detection and analysis of integrity violations within the academic content.

## Open Questions
- How will the system scale if the volume of analyzed documents increases significantly beyond the current SQLite capacity?
- What specific TUC rubric standards should be integrated into the AI's detection logic to reduce false positives?
