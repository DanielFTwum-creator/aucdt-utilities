# AGENT.md — Drumming for SEL Success (dfs-website)

Quick orientation for an AI agent working in this app. Authoritative environment
spec is **CONSTRAINTS.md** (read it first).

## What this is

A public marketing website for "Drumming for SEL Success" (professional-development
residencies), with a contact-form-to-email flow and an AI best-practices assistant.
No login anywhere. **Deployed slug is `dfs`, not `dfs-website`** — the repo folder
name and the live URL differ.

## Shape

- React 19 + Vite frontend under `src/` (routed with `react-router-dom`,
  component library via `@base-ui/react`/`shadcn`).
- `server.ts` — Express: `POST /api/contact` (Nodemailer → Gmail), `POST
  /api/gemini/best-practices` (and its `/dfs/`-prefixed twin) WMS-relayed Gemini
  assistant, `POST /api/admin/run-tests` (shells out to Playwright), `GET
  /api/admin/test-screenshots`; serves `dist/` in production.
- Cypress suite under `cypress/`; Playwright config at repo root
  (`playwright.config.ts`, `tests/`).

## Rules that bite (see CONSTRAINTS.md + PATTERNS.md)

- **Never hold a Gemini key** — the best-practices assistant relays to WMS with
  `GEMINI_PROXY_KEY` (Pattern 11); no `@google/genai` dependency exists or should be
  added.
- **Public slug is `/dfs/`** — health checks, nginx routing, and any absolute links
  must use that, not `/dfs-website/`.
- `index.html` loads Google Fonts + GTM at boot (not Pattern 32 compliant) — worth
  fixing alongside any other frontend touch.
- Nodemailer credentials (`GMAIL_USER`/`GMAIL_APP_PASSWORD`) are server-only; never
  echo or log them (SEC §12).
- `POST /api/admin/run-tests` shells out to `npx playwright test` from a live route —
  treat this as an internal/admin-only endpoint, not something to expose publicly
  without access control (none currently exists — verify before relying on it being
  gated).

## Build / run

- `pnpm install` → `pnpm dev` (tsx server + Vite) → `pnpm build`.
- `pnpm lint` runs `tsc --noEmit`.
- Deploy: `.\deploy.ps1 -Build` (server-side build, same shape as the rest of the fleet).
