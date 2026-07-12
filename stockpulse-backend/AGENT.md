# AGENT.md — StockPulse Backend

Quick orientation for an AI agent working on this app. Authoritative environment
spec is **CONSTRAINTS.md** (read it first — it explains an important path quirk).

## Where the code actually is

**This folder (`stockpulse-backend/`) holds only docs.** The real backend source is
at `../stockpulse/backend/src/`, and the frontend SPA it pairs with is at
`../stockpulse/`. Both are one product, deployed together by
`../stockpulse/deploy.ps1`. Don't go looking for `server.ts`/`package.json` here —
go to `stockpulse/backend/`.

## What this is

A stock-market analytics API: watchlists, portfolio + paper-trading, price alerts,
AI trading signals (via Gemini), and an admin dashboard. Auth is local email/password
with JWT (bcrypt + `jsonwebtoken`), plus an optional separate Google OAuth login —
**this is not WMS SSO**.

## Shape (in `stockpulse/backend/`)

- `src/index.ts` — Express app: helmet, CORS, rate limiting, mounts
  `/api/auth`, `/api/market`, `/api/watchlist`, `/api/portfolio`, `/api/paper`,
  `/api/alerts`, `/api/ai`, `/api/admin`; starts `alertWorker` on boot.
- `src/routes/auth.ts` — register/login/me/upgrade/cancel + optional Google OAuth.
- `src/middleware/auth.ts` — `requireAuth`, `requirePremium`, `optionalAuth` (JWT
  Bearer).
- `src/services/gemini.ts` — `analyzeStock()`, relayed through WMS
  (`GEMINI_PROXY_KEY`) — never a raw `@google/genai` call.
- `src/services/market.ts` — Yahoo Finance data. `src/services/alertWorker.ts` —
  background price-alert loop.
- `src/db/schema.ts` — SQLite schema.
- The frontend (`stockpulse/`) is a separate Vite/React app served as a **static
  SPA by Apache/`.htaccess`**, not by this Node process (Pattern 28 archetype) —
  this backend only answers `/api/*`.

## Rules that bite (see CONSTRAINTS.md + PATTERNS.md)

- **Never hold a raw Gemini key** — `gemini.ts` already relays through WMS
  (Pattern 11); don't add `@google/genai` back to the backend.
- **This is a static-SPA + API app, not self-serving-Node.** Never add an nginx
  `location /stockpulse/` block that proxies the whole sub-path here — that broke
  the live site once already (Pattern 28). Apache's `.htaccess` must own the
  sub-path; this backend only ever answers under `/api/`.
- `tsx` is in `devDependencies` but the server installs with `--prod` — currently
  limping along on `npx`'s auto-fetch. Move `tsx` to `dependencies` if you touch
  packaging (Pattern 13).
- Auth is local JWT, not WMS — don't assume `requireWmsAuth`/`AuthGate` patterns
  from other fleet apps apply here.

## Build / run

- From `stockpulse/backend/`: `pnpm install` → `pnpm dev` (tsx watch) → `pnpm build`
  (tsc) → `pnpm start` (`node dist/index.js`). Tests: `pnpm test` (vitest).
- From `stockpulse/` (frontend): `pnpm install` → `pnpm dev` (Vite, proxies `/api`
  to `localhost:3001` in dev) → `pnpm exec vite build`.
- Deploy (both together): from `stockpulse/`, `.\deploy.ps1 -Build`.
