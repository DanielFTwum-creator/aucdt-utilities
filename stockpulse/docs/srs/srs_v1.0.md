# IEEE SRS — StockPulse
**Version:** 1.0.0 (as-built)
**Institution:** Techbridge University College
**Status:** Active

## 1. Introduction
StockPulse is a real-time stock market analytics dashboard. Provides live market data, watchlists, and chart visualisations.

## 2. Functional Requirements
| ID | Requirement |
|---|---|
| FR-1 | Stock search and lookup by ticker symbol |
| FR-2 | Watchlist management (add/remove symbols) |
| FR-3 | Price chart with configurable time ranges |
| FR-4 | Admin panel accessible via `#/admin` with audit logs |
| FR-5 | User authentication and JWT sessions |
| FR-6 | Portfolio tracking (positions, cost basis, shares) |
| FR-7 | Paper trading (simulated cash accounts, orders, positions) |
| FR-8 | Price alerts and condition tracking |
| FR-9 | AI-powered stock signals and rationale via Gemini |
| FR-10 | Data export to CSV for Admin and Portfolio |

## 3. Architecture
- **Framework:** Vite + React + TypeScript
- **Charts:** Recharts
- **Backend:** Node.js/Express (`backend/`)
- **Database:** Native `node:sqlite` (SQLite) storing users, portfolios, paper trading, and alerts
- **Authentication:** JWT, bcryptjs
- **AI Integration:** `@google/genai` (Gemini API)
- **E2E:** Playwright tests in `e2e/`
- **Styling:** Tailwind CSS
