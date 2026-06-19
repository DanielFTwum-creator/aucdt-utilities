# Admin Guide — StockPulse

## Access
Navigate to `/#/admin` or click "Admin" in the footer.

**Authentication:** Requires an Administrator account to log in securely.

## Features
- **User Management:** View registered users, tiers, and activity.
- **Audit Logs:** View system and user audit events.
- **Data Export:** Export user and audit data to CSV for external analysis.
- **Diagnostics:** Verify market data proxy and database connectivity.

## Backend
Market data, user accounts, and AI signals are driven by the Node.js/Express proxy (`backend/`).
Database is stored in `backend/data/stockpulse.db` using SQLite.

Start locally with:
```bash
cd backend
pnpm dev
```
