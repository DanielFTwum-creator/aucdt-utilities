# CONSTRAINTS.md — TUC Results Management System (RMS)

> Environment specification for the TUC RMS.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | TUC Results Management System |
| PM2 process | `tuc-rms` (id: 22) — runs the **backend** only |
| Backend port | **5000** |
| Frontend URL | `https://rms.techbridge.edu.gh/` |
| Backend API base | `https://rms.techbridge.edu.gh/api/` (proxied by nginx) |
| Backend deploy path | `/var/www/vhosts/techbridge.edu.gh/tuc-rms-api/` |
| Frontend deploy path | `/var/www/vhosts/techbridge.edu.gh/rms.techbridge.edu.gh/` |
| Stack | React 19 + Vite + TypeScript (frontend) · Node.js + Express (backend, plain JS) · MySQL |
| Root `package.json` | Playwright E2E test suite — not the app entrypoint |

---

## 2. Developer Machine

| Item | Value |
|---|---|
| OS | Windows 11 Home |
| Primary shell | **PowerShell 7+** |
| Package manager | **pnpm** |
| Node (local) | System node |

---

## 3. Monorepo Structure

```text
tuc-rms/
├── backend/          ← Express API (plain JS, no tsx required)
│   ├── server.js     ← dev entry
│   ├── server-production.js  ← production entry (what PM2 runs)
│   ├── db.js         ← MySQL connection (mysql2)
│   ├── middleware/   ← audit logging, JWT auth
│   └── routes/       ← auth, users, students, courses, results, reports, dashboard
├── frontend/         ← React 19 + Vite + TypeScript
│   ├── src/          ← pages/, components/, context/
│   └── package.json
├── tests/            ← Playwright E2E + accessibility tests
├── cypress/          ← Cypress tests
└── package.json      ← Root = Playwright test runner (NOT the app)
```

---

## 4. Runtime Environment (Production)

### Backend

| Item | Value |
|---|---|
| Host | Ubuntu + Plesk — `66.226.72.199` |
| Node version | System node (v20 sufficient — plain JS, no tsx) |
| PM2 interpreter | `node` (default) |
| PM2 exec cwd | `/var/www/vhosts/techbridge.edu.gh/tuc-rms-api` |
| Script | `server-production.js` |
| Uptime note | 16-day uptime as of 2026-06-26 — stable; prefer `pm2 reload` over restart |

### Frontend

| Item | Value |
|---|---|
| Served by | nginx (static files, no Node process) |
| Root | `/var/www/vhosts/techbridge.edu.gh/rms.techbridge.edu.gh/` |
| Build command | `pnpm build:prod` (uses `vite.config.production.js`) |

---

## 5. Required Environment Variables (Backend `.env`)

| Variable | Value/Purpose |
|---|---|
| `PORT` | `5000` — backend listen port |
| `DB_HOST` | `localhost` |
| `DB_PORT` | `3306` |
| `DB_USER` | `aucdtadmin_dev` |
| `DB_NAME` | `tuc_rms_prod` |
| `DB_PASS` | (check `.env` on server — never commit) |
| `FRONTEND_URL` | `https://rms.techbridge.edu.gh` — used for CORS |
| `JWT_SECRET` | (check `.env` on server) |
| `NODE_ENV` | `production` |
| `SMTP_HOST` | `localhost` |
| `SMTP_FROM` | `noreply@techbridge.edu.gh` |

---

## 6. Auth Flow

- **JWT-based** — login returns a Bearer token stored client-side
- Login endpoint: `POST /api/auth/login` — requires `email` + `password` (not `username`)
- Rate-limited: 5 attempts per 15-minute window on `/api/auth/login`
- Roles: `registrar`, `lecturer`, `ict`, `admin` (check `routes/auth.js` for role enum)
- Audit middleware logs all authenticated `POST`/`PUT`/`DELETE` requests

---

## 7. Deploy Pattern

**Backend** — manual or via `tuc-rms/deploy.ps1`:

```bash
# On server — update backend code and restart
cd /var/www/vhosts/techbridge.edu.gh/tuc-rms-api
git pull  # if git-managed, or scp files
pm2 reload tuc-rms   # prefer reload (zero-downtime) over restart
```

**Frontend** — build locally then rsync/scp:

```powershell
cd frontend
pnpm install && pnpm build:prod
# scp dist/* to /var/www/vhosts/techbridge.edu.gh/rms.techbridge.edu.gh/
```

**No PM2 for frontend** — nginx serves static files directly.

---

## 8. Pre-Delivery Gate

Before deploying, confirm:

```
☐ Backend: pm2 show tuc-rms → status: online, 0 unstable restarts
☐ Health check: GET http://localhost:5000/api/health → { status: "ok" }
☐ Frontend CORS: FRONTEND_URL in .env matches rms.techbridge.edu.gh
☐ JWT_SECRET is set and unchanged (changing it invalidates all sessions)
☐ pnpm build:prod succeeds with no TypeScript errors
☐ Login smoke test: POST /api/auth/login with valid creds → 200 + token
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
