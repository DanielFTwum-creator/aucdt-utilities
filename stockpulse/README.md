<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# StockPulse - Stock Market Analytics

StockPulse is a comprehensive, real-time stock market analytics dashboard featuring watchlists, portfolio tracking, paper trading simulation, price alerts, and AI-powered market insights.

## Features
- **Real-Time Market Data:** Interactive price charts and live quotes.
- **Portfolio & Paper Trading:** Track your actual holdings or practice with a simulated cash account.
- **Watchlists & Alerts:** Monitor your favorite tickers and get notified on price movements.
- **AI Insights:** Leverage Google Gemini for trading signals and rationale.
- **Admin Dashboard:** Manage users, monitor system health, and export audit logs.

## Architecture
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Recharts, Framer Motion
- **Backend:** Node.js, Express, SQLite (`node:sqlite`)
- **Authentication:** JWT with secure HTTP-only cookies

## Run Locally

**Prerequisites:** Node.js v20+, pnpm

1. Install dependencies across both frontend and backend:
   ```bash
   pnpm install
   cd backend && pnpm install
   cd ..
   ```

2. Set up environment variables:
   - Create a `.env` in the `backend/` directory with `PORT=3001` and your `GEMINI_API_KEY`.
   - Set up `JWT_SECRET` in the `backend/.env`.

3. Run the full stack:
   ```bash
   pnpm run dev:all
   ```

4. Open the app at `http://localhost:3000`
