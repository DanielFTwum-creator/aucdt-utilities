# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StockPulse is a full-stack stock market application with a React frontend and an Express backend. The two halves run on separate ports and are linked via a Vite dev proxy.

- **Frontend:** Vite + React 19 + TypeScript + Tailwind CSS 4 — runs on `http://localhost:3000`
- **Backend:** Express 5 + TypeScript — runs on `http://localhost:3001`
- **Database:** Node.js built-in `node:sqlite` (`DatabaseSync`) — file at `backend/data/stockpulse.db`

## Commands

### Frontend (root directory)

```bash
pnpm install
pnpm run dev          # dev server on :3000, proxies /api → :3001
pnpm run build        # production build → dist/
pnpm test             # Vitest unit tests
pnpm test:coverage    # coverage report
```

### Backend

```bash
cd backend
pnpm install
pnpm dev              # tsx watch, port 3001
pnpm build            # tsc → dist/
pnpm start            # node dist/index.js
pnpm test             # Vitest
```

### E2E Tests (Playwright)

Both servers must be running before E2E tests. Workers are set to 1 because tests share the SQLite DB.

```bash
pnpm exec playwright test              # all specs
pnpm exec playwright test e2e/auth.spec.ts   # single spec
pnpm exec playwright show-report       # open last HTML report
```

## Architecture

### Request flow

Browser → Vite proxy (`/api/*`) → Express backend (`:3001`) → `yahoo-finance2` / Gemini AI / SQLite

The Vite `server.proxy` in `vite.config.ts` forwards every `/api` request to `:3001`, so the frontend always fetches relative URLs (e.g., `fetch('/api/market/indices')`).

### Frontend structure

`src/App.tsx` is the root. It uses hash-based routing (`#/watchlist`, `#/portfolio`, etc.) — no React Router. The active `View` is derived from `window.location.hash` and each view renders a top-level component directly.

**Key hooks:**
- `src/hooks/useAuth.ts` — JWT session stored in `localStorage` (`sp_token`, `sp_user`); exports `authFetch` which injects the `Authorization` header on every request.
- `src/hooks/useTheme.ts` — light/dark toggle persisted in localStorage.

**Shared prop pattern:** Most feature components receive `{ user, authFetch, onLoginClick, onUpgrade }` from `App`.

**Tier gating:** `TIER_LIMITS` in `src/types/index.ts` defines per-feature limits for `free` vs `premium` tiers. Check user tier before calling premium-only endpoints.

### Backend structure

```
backend/src/
  index.ts          — Express app, middleware, route registration
  db/schema.ts      — DatabaseSync init + all CREATE TABLE IF NOT EXISTS DDL
  middleware/auth.ts — requireAuth / requirePremium / optionalAuth (JWT verify)
  routes/           — auth, market, watchlist, portfolio, paper, alerts, ai, admin
  services/
    market.ts       — yahoo-finance2 wrappers (getQuote, getHistory, getIndices, …)
    gemini.ts       — Google Gemini AI analysis via @google/genai
```

All routes follow the same pattern: import `db` from `schema.ts`, use `requireAuth` middleware, run `db.prepare(...).run/all/get`.

### AI signals

`POST /api/ai/analyze/:ticker` requires auth, applies per-tier rate limiting (5/hr free, 60/hr premium), fetches a live quote, calls `analyzeStock()` in `gemini.ts`, and persists the result to `ai_signals`.

### Admin route

`GET /api/admin/*` is guarded by `requireAdminOrPremium`. Admin emails are set via the `ADMIN_EMAILS` env var (comma-separated). The frontend `#/admin` view renders `src/components/Admin/AdminPanel.tsx`.

## Environment Variables

### Backend (`backend/.env`)

```
PORT=3001
JWT_SECRET=changeme
CORS_ORIGIN=http://localhost:3000
GEMINI_API_KEY=your_key
ADMIN_EMAILS=admin@example.com
```

### Frontend (`.env` at root)

The frontend uses relative `/api` URLs — no `VITE_API_URL` is needed in development.

## Data Layer Notes

- The SQLite DB is created automatically on first backend start at `backend/data/stockpulse.db` with WAL mode enabled.
- Schema is auto-migrated via `CREATE TABLE IF NOT EXISTS` in `backend/src/db/schema.ts` — there is no migration tool.
- Paper trading starts every new user with `$100,000` virtual cash.

## Testing Notes

- Frontend unit tests live in `src/**/*.test.{ts,tsx}` and use jsdom + `@testing-library/react`.
- E2E specs in `e2e/` use Playwright with `baseURL: http://localhost:3000`.
- `fullyParallel: false` and `workers: 1` are intentional — the shared SQLite file causes race conditions under parallel workers.
