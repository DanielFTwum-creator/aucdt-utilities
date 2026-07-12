# AGENT.md — Peace Vinyl

Quick orientation for an AI agent working in this app. Authoritative environment
spec is **CONSTRAINTS.md** (read it first) — it documents a likely-broken OAuth
redirect path bug found in this pass; read it before touching auth code.

## What this is

A vinyl-spinner music player ("Peace & One Love") with bespoke Google OAuth sign-in.
React 19 + Vite SPA, small Express backend for the OAuth token exchange only —
despite `@google/genai` in `package.json`, there is no AI feature anywhere in `src/`.

## Shape

- `src/components/PeaceOneLoveVinyl.tsx` — the player UI.
- `src/contexts/AuthContext.tsx` — bespoke Google OAuth; caches the user in
  `sessionStorage`, no JWT, no MFA.
- `src/components/LoginView.tsx` — sign-in screen.
- `src/utils/appContext.ts` — shared multi-app OAuth redirect-path helper — **its
  `APP_PATH` is `/peace/`, but this app is deployed at `/peace-vinyl/`**. This is a
  real, unfixed mismatch (see CONSTRAINTS.md §4); verify a live sign-in before
  assuming login works.
- `server.js` — Express (plain JS): `GET /callback`, `POST
  /api/auth/google/token`, serves `dist/` in production.

## Rules that bite (see CONSTRAINTS.md + PATTERNS.md)

- **No AI feature is wired up.** `@google/genai` and `VITE_GEMINI_API_KEY` are dead
  weight from the AI Studio scaffold. If adding AI, use a server-side WMS relay
  (Pattern 11), never a client-side key.
- **OAuth redirect path bug** — `APP_PATH` in `appContext.ts` says `/peace/`; the
  real deployed slug is `/peace-vinyl/`. Don't copy this file's pattern into a new
  app without fixing the path first.
- `server.js`'s port fallback (3001) is stale; `deploy.ps1` always passes
  `PORT=3026` explicitly.
- `index.html` loads Google Fonts + GTM at boot — not Pattern 32 compliant.

## Build / run

- `pnpm install` → `pnpm build` (Vite) → `node server.js` (or `pnpm start`).
- `pnpm lint` runs `tsc --noEmit`.
- Deploy: `.\deploy.ps1 -Build`.
