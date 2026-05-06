# CREATION.md — StockPulse
**Purpose:** Complete build specification for any agent to implement this application from scratch.
**Target:** Functional parity with `C:/Development/aucdt-utilities/stockpulse/`
**Last verified:** 2026-04-25

---

## 1. What This App Is

StockPulse is a **real-time stock market analytics dashboard** with a full-stack architecture. Users register/login, manage a watchlist, track a paper-trading portfolio, set price alerts, and receive AI-powered trading signals. A Node.js/Express backend proxies market data and handles auth via JWT + SQLite. The frontend is a React SPA with hash-based routing (no React Router).

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend runtime | React | **19.2.4** |
| Build | Vite | ^6 |
| Language | TypeScript | ~5.8 |
| Styling | Tailwind CSS | ^4.2 |
| Charts | Recharts | latest |
| Animation | framer-motion | latest |
| Icons | lucide-react | latest |
| AI signals | `@google/genai` | latest |
| Backend | Express 5 + Node.js 24 | — |
| Auth | JWT + bcrypt | — |
| Database | SQLite (via better-sqlite3 or equivalent) | — |
| Package manager | pnpm | 10.30+ |
| Container | node:24-alpine → nginx:alpine (frontend) | — |

---

## 3. Frontend Directory Structure

```
src/
├── App.tsx               # Hash router, auth gate, view switcher
├── main.tsx
├── index.css             # Tailwind
├── types/                # TypeScript interfaces
├── hooks/
│   ├── useAuth.ts        # login, register, logout, authFetch, upgradeToPremiun
│   └── useTheme.ts       # dark/light toggle, persisted to localStorage
├── components/
│   ├── Auth/
│   │   └── AuthModal.tsx       # Login / register modal
│   ├── Layout/
│   │   ├── Navbar.tsx          # Top bar: index tickers + user actions
│   │   └── Sidebar.tsx         # Left nav: 8 views
│   ├── Admin/
│   │   └── AdminPanel.tsx      # Admin panel (view: 'admin' hash)
│   ├── Watchlist.tsx           # Saved symbols + live price cards
│   ├── Portfolio.tsx           # Holdings with P&L
│   ├── PaperTrading.tsx        # Simulated buy/sell with virtual cash
│   ├── AlertsPanel.tsx         # Price alert management
│   ├── AISignals.tsx           # Gemini-powered trade signal analysis
│   ├── NewsPanel.tsx           # Market news feed
│   ├── StockChart.tsx          # Price chart (Recharts)
│   ├── ComparativeChart.tsx    # Multi-symbol comparison chart
│   ├── SubscriptionModal.tsx   # Premium upgrade prompt
│   └── ErrorBoundary.tsx
└── utils/                # Formatters, helpers
```

---

## 4. 8 Views (hash-routed)

| Hash | View | Description |
|---|---|---|
| `#/watchlist` | Watchlist | Default view. Saved symbols with live price cards. |
| `#/portfolio` | Portfolio | Holdings table with P&L calculation. |
| `#/paper` | Paper Trading | Virtual buy/sell with $10,000 starting cash. |
| `#/alerts` | Alerts | Create/manage price threshold alerts. |
| `#/ai` | AI Signals | Enter a ticker → Gemini returns signal analysis. |
| `#/news` | News | Market news feed from backend. |
| `#/screener` | Screener | Filter stocks by criteria (premium gating). |
| `#/admin` | Admin | Admin panel — user management, system logs. |

---

## 5. Backend API Routes (backend/src/routes/)

| Route | Purpose |
|---|---|
| `POST /api/auth/register` | Create account (email + password) |
| `POST /api/auth/login` | JWT login |
| `GET /api/market/indices` | Market index ticker data (GSPC, DJI, etc.) |
| `GET /api/market/quote/:symbol` | Live quote for one symbol |
| `GET /api/market/history/:symbol` | OHLCV history |
| `GET/POST/DELETE /api/watchlist` | Watchlist CRUD (JWT protected) |
| `GET/POST/DELETE /api/portfolio` | Portfolio holdings (JWT protected) |
| `GET/POST /api/paper` | Paper trading orders (JWT protected) |
| `GET/POST/DELETE /api/alerts` | Price alerts (JWT protected) |
| `GET /api/ai/signal` | Gemini AI signal for a symbol (JWT protected) |
| `GET /api/admin/*` | Admin routes (admin role required) |

---

## 6. Authentication

- **Registration:** email + password → bcrypt hash → SQLite user record
- **Login:** email + password → verify hash → return JWT (7d expiry)
- **Client:** JWT stored in localStorage; sent as `Authorization: Bearer <token>` on all protected requests
- **Admin access:** Users with `role = 'admin'` in the database can access `#/admin`
- **Premium:** `upgradeToPremiun()` function (note: intentional typo in the codebase — preserve it) sets user tier to unlock Screener

---

## 7. Admin Panel (src/components/Admin/AdminPanel.tsx)

Accessible at `#/admin`. Requires admin JWT.

Features:
- User list with role and registration date
- Audit log of all system events (stored in SQLite `audit_logs` table)
- Market data health check

---

## 8. Colour Tokens

```css
/* dark (default) */
--bg-primary:    #0a0f1e;
--bg-secondary:  #111827;
--bg-card:       #1f2937;
--text-primary:  #f9fafb;
--text-muted:    #6b7280;
--accent-green:  #10b981;
--accent-red:    #ef4444;
--accent-blue:   #3b82f6;
--border:        #374151;
```

---

## 9. ARIA Requirements

- `AuthModal`: `role="dialog" aria-modal="true" aria-labelledby`
- `Sidebar` nav buttons: `aria-label`, `aria-current="page"` on active view
- `Navbar`: `role="banner"`
- All form inputs: `<label htmlFor>` paired with `id`
- All icon buttons: `aria-label`
- Chart containers: `role="img" aria-label="Price chart for {symbol}"`
- Error messages: `role="alert"`

---

## 10. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | Frontend builds with zero errors |
| AC-2 | Backend starts and responds on port 3001 |
| AC-3 | User can register, login, and logout |
| AC-4 | Watchlist add/remove persists across sessions |
| AC-5 | Paper trading buy reduces virtual cash; sell increases it |
| AC-6 | Price alerts fire when the threshold is crossed |
| AC-7 | AI Signals view calls backend `/api/ai/signal` and displays Gemini response |
| AC-8 | Admin panel shows user list (admin role required) |
| AC-9 | Dark/light theme toggles correctly |
| AC-10 | All interactive elements have `aria-label`; navigation has `aria-current` |
