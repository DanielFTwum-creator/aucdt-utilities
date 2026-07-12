# AGENT.md — Lecturer AI Handbook

Quick orientation for an AI agent working in this app. Authoritative environment
spec is **CONSTRAINTS.md** (read it first).

## What this is

An interactive digital handbook and prompt-engineering companion for TUC lecturers.
React 19 + Vite + Tailwind v4 SPA served by a small Express backend (self-serving-Node)
that relays AI calls to the WMS Gemini proxy.

## Shape

- `src/App.tsx` — the app; tabs/components under `src/components/`.
- `src/auth.tsx` — WMS SSO `AuthGate` (all-TUC) + the `window.fetch` token wrapper.
- `server.ts` — Express: `/api/gemini/generate` (WMS-relayed, `requireWmsAuth`),
  `/api/gemini/status`, `/api/health`; serves `dist/` in production.
- `src/server/wmsAuthMiddleware.ts` — Bearer → WMS `/api/me` gate, domain-locked.

## Rules that bite (see CONSTRAINTS.md + PATTERNS.md)

- **Never hold a Gemini key** — relay to WMS with `GEMINI_PROXY_KEY` (Pattern 11).
- Client AI calls must be **base-prefixed** (`${import.meta.env.BASE_URL}api/...`) so
  the WMS token attaches and nginx routes them.
- Vite `base` is `/lecturer/` (Pattern 29); keep it absolute.
- Code-split heavy libs (Pattern 31); no external CDN at boot (Pattern 32).
- pnpm only; this app is its own workspace root (`pnpm-workspace.yaml`).

## Build / run

- `pnpm install` → `pnpm build` (Vite) → `pnpm dev` (tsx server + Vite middleware).
- `pnpm exec tsc --noEmit` must be clean.
- Deploy: `.\deploy.ps1 -Build` (builds from `main`; FF `main` first).
