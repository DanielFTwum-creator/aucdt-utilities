# AGENT.md — Teamwork & Accountability Diagnostic

Quick orientation. Authoritative environment spec is **CONSTRAINTS.md** (read first).

## What this is

A client-side, self-scoring diagnostic that assesses teamwork, coordination, and
accountability through case-study scenarios. React 19 + Vite + Tailwind v4 SPA.
**No backend, no AI, no auth** — results live in `localStorage`.

## Shape

- `src/App.tsx` — the whole diagnostic (questions → scoring → results).
- `src/index.css` — `@import "tailwindcss"` (build-time Tailwind v4).
- `src/generate_srs.cjs` — dev-only script that emits the SRS `.docx` (uses `docx`,
  a devDep; not part of the app bundle).
- No `server.ts`. Served as static files.

## Rules that bite (see CONSTRAINTS.md + PATTERNS.md)

- Static SPA: **no port, no PM2, no relay, no WMS**. Do not add a backend unless a
  real requirement appears (then it needs a registry port + WMS relay).
- Vite `base` is `/teamwork/` (Pattern 29); keep it absolute.
- No external CDN at boot (Pattern 32) — Tailwind is build-time.
- pnpm only; this app is its own workspace root (`pnpm-workspace.yaml`).

## Build / run

- `pnpm install` → `pnpm build` (Vite) → `pnpm dev`.
- `pnpm exec tsc --noEmit` must be clean.
- Deploy: `.\deploy.ps1 -Build` (builds from `main`; FF `main` first). Static —
  rsyncs `dist/` + writes an `.htaccess` SPA fallback; no pm2 restart.
