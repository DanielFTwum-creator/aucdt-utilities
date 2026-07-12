# AGENT.md — Deliberate Magic Reader

Quick orientation for an AI agent working in this app. Authoritative environment
spec is **CONSTRAINTS.md** (read it first).

## What this is

A chronicle/essay reader ("Deliberate Magic" series) with an AI essay-generation and
glossary-definition feature, plus bespoke Google OAuth sign-in. React 19 + Vite SPA,
Express + tsx backend. **Deployed slug is `magic-reader`, not
`deliberate-magic-reader`** — the repo folder name and the live URL differ; don't
assume they match when writing links, cookie paths, or the health-check URL.

## Shape

- `server.ts` — Express: `/callback` + `/magic-reader/callback` (OAuth), `/api/essays`,
  `/api/generate-part-6` (WMS-relayed Gemini essay draft), `/api/define` (WMS-relayed
  glossary term, with a hardcoded fallback dictionary if the relay fails),
  `/api/verify-port`, `/api/health`; serves `dist/` in production.
- Frontend source under `src/` (not fully audited in this pass — see server.ts for
  the API surface it consumes).

## Rules that bite (see CONSTRAINTS.md + PATTERNS.md)

- **Never hold a Gemini key** — all AI calls go through `callGemini()` → WMS
  `/api/gemini/generate` with `GEMINI_PROXY_KEY` (Pattern 11). Already migrated;
  don't reintroduce `@google/genai`.
- **Production runs `server.ts` directly via `tsx`**, not the `dist/server.cjs`
  esbuild bundle that `pnpm build`/`pnpm start` produce — `deploy.ps1` ships the raw
  `.ts` file and starts PM2 with `--interpreter-args tsx`. Don't assume the compiled
  bundle is what's live.
- `tsx` is in `devDependencies` but the server's `pnpm install --prod` should exclude
  it — this currently limps along via `npx`'s auto-fetch fallback. Move `tsx` to
  `dependencies` if you touch this app's packaging (Pattern 13 fleet rule).
- The public slug is `/magic-reader/` — cookie path, OAuth callback route, and
  `.htaccess`/nginx routing all use that, not the repo folder name.

## Build / run

- `pnpm install` → `pnpm dev` (tsx server.ts + Vite dev, hot) or `pnpm build`
  (Vite + esbuild, produces assets `deploy.ps1` partially ignores — see above).
- `pnpm lint` runs `tsc --noEmit`.
- Deploy: `.\deploy.ps1 -Build`.
