# AGENT.md — Deep Dub Vibes Player

Quick orientation for an AI agent working in this app. Authoritative environment
spec is **CONSTRAINTS.md** (read it first).

## What this is

An interactive reggae/dub music player: spinning vinyl, waveform visualiser, live
frequency analyser. React 19 + Vite SPA with a small Express backend whose only job
is the Google OAuth token exchange (there is no AI feature despite `@google/genai`
sitting in `package.json` — see CONSTRAINTS.md §6).

## Shape

- `src/App.tsx` — the player UI.
- `src/contexts/AuthContext.tsx` — bespoke Google OAuth (not WMS SSO); caches the
  user in `sessionStorage`, no JWT, no MFA.
- `src/components/LoginView.tsx` — the sign-in screen.
- `src/utils/appContext.ts` — shared multi-app OAuth redirect-path helper.
- `server.js` — Express (plain JS): `GET /callback`, `POST /api/auth/google/token`,
  serves `dist/` in production.

## Rules that bite (see CONSTRAINTS.md + PATTERNS.md)

- **No AI feature is wired up.** `@google/genai` and `VITE_GEMINI_API_KEY` are unused
  dead weight from the AI Studio scaffold — don't assume there's a working Gemini
  call to extend. If adding one, go through a server-side WMS relay (Pattern 11),
  never a client-side key.
- **The OAuth callback route may not be reachable under the deployed sub-path** —
  `server.js` only handles bare `/callback`, but the client requests
  `/deep-dub-vibes-player/callback`. Verify a real sign-in works before assuming
  auth is functional; see CONSTRAINTS.md for the full analysis.
- `server.js`'s port fallback (3009) is stale; `deploy.ps1` always passes
  `PORT=3023` explicitly — don't remove that override without updating the code.
- `index.html` still loads Google Fonts + GTM at boot — not Pattern 32 compliant.

## Build / run

- `pnpm install` → `pnpm build` (Vite) → `pnpm start` (serves `dist/` via
  `server.js`) or `pnpm preview`.
- `pnpm lint` runs `tsc --noEmit`.
- Deploy: `.\deploy.ps1 -Build`.
