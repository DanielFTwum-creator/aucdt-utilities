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
| FR-4 | Admin panel accessible via `#/admin` |
| FR-5 | Audit log in localStorage |

## 3. Architecture
- **Framework:** Vite + React + TypeScript
- **Charts:** Recharts
- **Backend:** Node.js/Express market data proxy (`backend/`)
- **E2E:** Playwright tests in `e2e/`
- **Styling:** Tailwind CSS
