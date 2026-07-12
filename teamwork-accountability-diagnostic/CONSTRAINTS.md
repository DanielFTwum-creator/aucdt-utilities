# CONSTRAINTS.md — Teamwork & Accountability Diagnostic

> Environment spec for this app. Claude reads this at Session Start (Protocol step 2).

| Field | Value |
|---|---|
| Public URL | `https://ai-tools.techbridge.edu.gh/teamwork/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/teamwork/` |
| Stack | React 19 · TypeScript · Tailwind v4 (build-time) · Vite |
| Serving | **static SPA** — Apache serves `dist/` with an `.htaccess` SPA fallback |
| Backend | **none** — no `server.ts`, no PM2, **no port** |
| Auth | **none** — public. Self-scoring diagnostic; state kept in `localStorage` only |
| AI | **none** — no Gemini/relay. (The AI-Studio `metadata.json` capability tag is inert; the code makes no AI calls.) |

## Why no backend / port / auth

The diagnostic runs entirely client-side (questions → scoring → results in
`localStorage`). There is nothing to protect and nothing to relay, so it is served
as static files by Apache — it does **not** run under PM2 and holds no port. It is
listed under "Apps without a backend port" in `PORT-REGISTRY.md`.

## Frontend standards

- **Vite base is absolute `/teamwork/`** (Pattern 29).
- **Lean initial load** (Pattern 32): Tailwind is build-time (v4 plugin), no
  `cdn.tailwindcss.com`, no external fonts, no esm.sh importmap. Main JS ~356 kB
  (gzip ~113 kB) — under the 600 kB warning, no code-split required.
- If a `manifest.json` is added later, its icons must be a local `favicon.svg`
  (`node scripts/check-manifests.mjs`, Pattern 33).

## Deploy

`.\deploy.ps1 -Build` (server-side build from `main`, so FF `main` first). Builds the
SPA and rsyncs `dist/` to the web root; writes an `.htaccess` SPA fallback. The one-time
Apache/nginx wiring for `/teamwork/` is a server-side step (Pattern 26/28), not the script.

## pnpm

pnpm only; this app is its own workspace root (`pnpm-workspace.yaml`) so installs don't
walk up to the monorepo root. `docx` is a devDep used by `src/generate_srs.cjs`
(doc-generation script), not bundled into the app.
