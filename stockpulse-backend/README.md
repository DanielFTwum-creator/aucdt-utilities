# StockPulse Backend

The Express/SQLite API behind StockPulse, a stock-market analytics dashboard:
real-time watchlists, portfolio and paper-trading tracking, price alerts, and
AI-powered trading signals.

Live at: **https://ai-tools.techbridge.edu.gh/stockpulse/** (API under `/stockpulse/api/`)

> **This folder is documentation only.** The actual backend source lives in the
> sibling repo folder `../stockpulse/backend/`, and the frontend it serves lives in
> `../stockpulse/`. See `CONSTRAINTS.md` for why, and `AGENT.md` for the real file
> layout.

## Stack

- Node.js + Express 5 + TypeScript, run via `tsx`
- SQLite for users, watchlists, portfolios, paper-trading accounts, alerts, and
  audit logs
- JWT-based email/password auth (bcrypt), plus an optional separate Google OAuth
  login path — not WMS SSO
- Yahoo Finance (`yahoo-finance2`) for market data
- AI trading signals relayed through the central WMS Gemini proxy (this backend
  never holds a Gemini key)

## Run locally

```powershell
cd C:\Development\github\aucdt-utilities\stockpulse\backend
pnpm install
pnpm dev
```

In a second terminal, run the frontend:

```powershell
cd C:\Development\github\aucdt-utilities\stockpulse
pnpm install
pnpm dev
```

Set `JWT_SECRET`, `GEMINI_PROXY_KEY`, `DB_PATH`, and `ADMIN_EMAILS` in
`stockpulse/backend/.env` (see `stockpulse/.env.example` for the full list; note it
still references a stale direct `GEMINI_API_KEY` line — use `GEMINI_PROXY_KEY`
instead, per `CONSTRAINTS.md`).

## Deploy

```powershell
cd C:\Development\github\aucdt-utilities\stockpulse
.\deploy.ps1 -Build
```

Builds the frontend, ships both the static SPA and this API to the server, and
(re)starts the `stockpulse-backend` PM2 process on port 3020. Apache's
`.htaccess` serves the SPA and proxies only `/api/` to this backend — see
`CONSTRAINTS.md` §9 for why an nginx sub-path proxy must never be added here.
