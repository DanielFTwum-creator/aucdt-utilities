# SickBay Management System, Developer Guide

**Document ID:** `TUC-ICT-DEV-2026-004-SICKBAY`
**Repository path:** `sick-bay-management-system/`
**Archetype:** React 19 Vite SPA + Express backend (`server.ts` via `tsx`) + MariaDB
**Server port:** `3046` (see `SERVER_PORTS.md`, verified 22 Jul 2026)
**Deployed sub-path:** `/sickbay/` | **PM2 process:** `sickbay`
**Last revised:** 22 July 2026 (database-backed release)

---

## 1. Architecture

SickBay is a fully database-backed fleet app. The SPA holds no data of its own; it fetches everything from the REST API and writes back through it. All clinical data lives in MariaDB `tuc_sickbay` on the app-DB instance (port 3306).

```
Browser (React 19 SPA at /sickbay/, in-memory WMS token)
    | HTTPS  (sign-in redirects to WMS; API calls carry Bearer token)
    v
nginx (ai-tools.techbridge.edu.gh, proxies /sickbay/ UN-stripped)
    | http://localhost:3046/sickbay/...
    v
Express server.ts (tsx, PM2 "sickbay", port 3046)
    - Pattern 38 strip middleware + dual route mounts
    - requireAuth: Bearer token verified against WMS /api/me
    - snake_case DB rows mapped to camelCase frontend types
    | mysql2 pool
    v
MariaDB tuc_sickbay @ localhost:3306 (scoped user, 7 tables)

WMS (wms.techbridge.edu.gh): Google SSO + TOTP MFA, token verification,
OAuth relay (Pattern 35). SickBay never holds GOOGLE_CLIENT_SECRET.
```

### Core technologies

- **Frontend:** React 19, TypeScript 5.8, Vite 6 (`base: '/sickbay/'`), Tailwind CSS v4, lucide-react, motion, Recharts, jsPDF, qrcode (lazy-loaded)
- **Backend:** Node v26.3.1 (NVM), Express 4, `tsx` runtime, `mysql2/promise`, `dotenv`, `cookie-parser`
- **Database:** MariaDB 10.3, database `tuc_sickbay`, scoped user `sickbay_app`@localhost (Pattern 37)
- **Auth:** WMS SSO (Google Workspace + TOTP), bearer-token gate on the API

---

## 2. Directory Structure

```
sick-bay-management-system/
├── CONSTRAINTS.md            # Environment spec (overrides defaults)
├── server.ts                 # Express entry point (port 3046, run via tsx)
├── deploy.ps1                # PowerShell deploy script
├── vite.config.ts            # base '/sickbay/', manualChunks code-split
├── package.json              # pnpm scripts: dev / build / lint / start
├── db/
│   └── migrations/
│       ├── 001_init_sickbay.sql            # DB + 6 core tables
│       ├── 002_seed_staff.sql              # 50 staff patients (STF001..STF050)
│       └── 003_daily_checks_and_med_seed.sql  # daily_health_checks + med inventory seed
├── docs/                     # This documentation set (served at /sickbay/docs/)
└── src/
    ├── App.tsx               # SSO boot flow, data loading, write handlers
    ├── types.ts              # Frontend (camelCase) domain types
    ├── lib/
    │   ├── api.ts            # REST client (Bearer token, BASE_URL-prefixed)
    │   └── wmsAuth.ts        # WMS SSO client (exchange, MFA, silent session)
    ├── server/               # SHIPPED TO THE SERVER; imported by server.ts at runtime
    │   ├── db.ts             # mysql2 pool (env-driven)
    │   ├── routes.ts         # Auth-gated REST API + row mappers
    │   └── wmsAuth.ts        # verifyWmsToken / refreshWmsSession (server-side)
    └── components/           # Dashboard, VisitLogger, RosterView, InventoryView,
                              # ReferralsView, FacilityLogView, ReportsView,
                              # VisitsListView, VitalsTrendView, LoginPage, ...
```

Note: `src/` is required at **runtime** on the server, not only at build time. `server.ts` imports `./src/server/{routes,db,wmsAuth}` via tsx; without `src/` the process dies on `ERR_MODULE_NOT_FOUND` (see the comment in `deploy.ps1`).

---

## 3. Local Development

```powershell
cd C:\Development\github\aucdt-utilities\sick-bay-management-system
pnpm install
pnpm dev        # Vite dev server on port 3046
pnpm lint       # tsc --noEmit
pnpm build      # production bundle (must show no chunks > 600 kB)
```

To run the backend locally (`pnpm start` runs `tsx server.ts`) you need a `.env` with the `DB_*` variables from section 6 pointing at a reachable MariaDB, otherwise every data route returns 500. `/api/health` still answers (it reports `db: 'error'`).

---

## 4. Backend

### 4.1 `server.ts` (entry point)

Order of concerns, top to bottom:

1. `express.json()` + `cookie-parser`.
2. **Pattern 38 strip middleware**: rewrites `/sickbay/api/...` to `/api/...` because nginx forwards the prefix un-stripped.
3. **Open endpoints** (no bearer token): `/api/health` (with a live `SELECT 1` DB probe), `/api/auth/session` (refreshes a WMS session from the `wms_refresh` cookie), and `POST /api/auth/google/token` (Pattern 35 relay: forwards `{code, redirectUri}` to the WMS exchange endpoint with the `X-Gemini-Proxy-Key` header; the app never holds `GOOGLE_CLIENT_SECRET`).
4. The data router mounted at both `/api` and `/sickbay/api`.
5. Static mounts: `docs/` at `/docs` and `/sickbay/docs`, then the built SPA (`dist/`) at both `/sickbay` and root, with an `index.html` catch-all.

Note on the auth endpoints: the current SPA does not call them. `LoginPage.tsx` redirects straight to `WMS /api/auth/google?app=sickbay`, and `src/lib/wmsAuth.ts` exchanges the code and refreshes sessions directly against WMS from the browser. The server-side endpoints are kept as sub-path-safe fallbacks.

### 4.2 `src/server/db.ts` (connection pool)

A single `mysql2/promise` pool. Two things matter:

- It imports `'dotenv/config'` **before** creating the pool. ES module imports run before `server.ts` calls `dotenv.config()`, so without this the pool would be built with an empty environment and fall back to `root`/empty (which fails, and on this shared box a flapping app can trip MariaDB's `max_connect_errors` host block, Pattern 37).
- Configuration is entirely env-driven:

| Env var | Default | Production value |
|---|---|---|
| `DB_HOST` | `localhost` | `localhost` |
| `DB_PORT` | `3306` | `3306` (**never 3307**, that is the LMS instance) |
| `DB_USER` | `root` | `sickbay_app` (scoped, localhost-only) |
| `DB_PASS` | empty | set once via `nano` on the server, preserved across deploys |
| `DB_NAME` | `tuc_sickbay` | `tuc_sickbay` |

Pool: `connectionLimit: 10`, `waitForConnections: true`.

### 4.3 Auth gate: `requireAuth` + `verifyWmsToken`

`routes.ts` applies `requireAuth` to the whole router. Behaviour:

- Paths starting `/auth` or `/health` fall through (`next('router')`) so the sign-in flow and health probe are never 401'd.
- Otherwise the `Authorization: Bearer <token>` header is required. The token is verified **server-side** by `verifyWmsToken` (`src/server/wmsAuth.ts`), which calls `WMS /api/me` with a 5 second timeout. Success attaches the WMS user to the request; failure returns 401 (`Authentication required` for a missing token, `Invalid or expired session` for a bad one).
- The gate fails closed: the clinical API is not reachable without a valid WMS session.

### 4.4 REST API surface

All data routes live in `src/server/routes.ts` and require a valid WMS bearer token. Paths are shown root-relative; in production the SPA calls them as `/sickbay/api/...` and the strip middleware normalises them.

| # | Method | Path | Description |
|---|---|---|---|
| 1 | GET | `/api/patients` | All patients, ordered by name |
| 2 | POST | `/api/patients` | Create patient; 409 on duplicate `patient_code` |
| 3 | GET | `/api/visits` | All visits (joined to patients), newest first |
| 4 | POST | `/api/visits` | **Transactional**: inserts the visit, deducts dispensed medication stock (`GREATEST(0, qty - n)`), and auto-creates a `Pending` referral when disposition is `Referral to Hospital`. Commit or full rollback |
| 5 | PUT | `/api/visits/:id/discharge` | Ends observation: stamps `observation_end_time = NOW()`, appends checkout notes, sets disposition to `Back to Class` |
| 6 | GET | `/api/medications` | Inventory, ordered by name |
| 7 | POST | `/api/medications` | Add stock line |
| 8 | PUT | `/api/medications/:id` | Full-object update (covers edit, restock, discard, adjust) |
| 9 | DELETE | `/api/medications/:id` | Remove stock line |
| 10 | GET | `/api/referrals` | All referrals (joined to patients), newest first |
| 11 | POST | `/api/referrals` | Add referral (default status `Pending`) |
| 12 | PUT | `/api/referrals/:id` | Update status + outcome notes |
| 13 | GET | `/api/facility-logs` | All facility logs, newest first |
| 14 | POST | `/api/facility-logs` | Report an equipment fault |
| 15 | PUT | `/api/facility-logs/:id/resolve` | Mark resolved: `is_resolved = TRUE`, status `Functional`, records `resolution_days` |
| 16 | GET | `/api/daily-checks` | Daily health checks (joined to patients), newest first |
| 17 | POST | `/api/daily-checks` | Log a wellness check |
| 18 | GET | `/api/audit-logs` | Latest 200 audit entries |
| 19 | POST | `/api/audit-logs` | Append an audit entry |
| 20 | GET | `/api/stats` | `{ totalPatients, visitsToday, lowStockMedications }` |

App-level endpoints in `server.ts` (no bearer token required):

| # | Method | Path | Description |
|---|---|---|---|
| 21 | GET | `/api/health` | Health + live DB connectivity (`db: connected/error`) |
| 22 | GET | `/api/auth/session` | Refresh WMS session from the `wms_refresh` cookie |
| 23 | POST | `/api/auth/google/token` | WMS OAuth relay exchange (Pattern 35) |

23 endpoints total: 20 auth-gated data routes plus 3 open auth/health routes.

### 4.5 snake_case to camelCase mapping

The database uses snake_case columns; the frontend types (`src/types.ts`) are camelCase. `routes.ts` owns the mapping in one direction per verb:

- **Reads:** per-entity mappers (`mapPatient`, `mapVisit`, `mapMed`, `mapReferral`, `mapFacility`, `mapDaily`, `mapAudit`) convert rows to frontend objects. List columns stored as JSON text (`allergies`, `chronic_conditions`, `presenting_conditions`, `symptoms`) are parsed to `string[]`; timestamps become ISO strings; `expiry_date` becomes `YYYY-MM-DD`.
- **Writes:** handlers destructure the camelCase body into positional SQL parameters, serialising arrays with `JSON.stringify`.
- **Identity mapping:** the frontend's `patient.id` is the human code (`patient_code`, e.g. `STF002`), not the INT primary key. `patientPk()` resolves code to PK before any insert that references a patient. Visit, medication, referral, facility and check ids are the INT PKs, stringified.

The client (`src/lib/api.ts`) therefore sends and receives frontend types verbatim and knows nothing about column names.

### 4.6 Client API layer: `src/lib/api.ts`

- Base URL is `import.meta.env.BASE_URL` + `/api`, so calls are `/sickbay/api/...` in production and `/api/...` in dev. Never a bare root `/api` (Pattern 38).
- Every request carries `Authorization: Bearer <token>` from the in-memory token store in `src/lib/wmsAuth.ts` (the token is never written to localStorage) plus `credentials: 'include'`.
- Non-2xx responses raise `Error` with the server's `error` message; `App.tsx` handlers surface it and re-pull the authoritative dataset (`refreshAll()`) after every successful write.

---

## 5. Authentication Flow (WMS SSO, Pattern 35)

1. `LoginPage.tsx` sends the browser to `https://wms.techbridge.edu.gh/api/auth/google?app=sickbay`.
2. WMS runs the Google OAuth dance (only WMS holds the client secret) and redirects back with either `?code=`, `?mfa_ticket=`, or `?error=`.
3. `App.tsx` boot flow: an `error` shows the failure card; an `mfa_ticket` opens the TOTP modal (verify, or first-time enrolment via `mfa/enroll/begin` + `confirm`, QR generated client-side with the lazy-loaded `qrcode` lib); a `code` is exchanged at WMS `/api/auth/exchange`.
4. With no query params, `silentSession()` tries the fleet-wide `wms_refresh` cookie for silent adoption.
5. The resulting access token lives **in memory only** and is attached to every API call; the server re-verifies it against WMS `/api/me` on each request (section 4.3).

Roles come from the WMS session. `isAdminRole` (`src/lib/wmsAuth.ts`) grants admin to `SYSTEM_ADMIN`, `HOD`, `ADMIN_STAFF`, `MEDICAL_OFFICER`; admin gates the Pharmacy Stock, Facility Logs and Reports tabs. Note this is a UI gate: the API itself authorises any valid WMS session, it does not check roles per route.

---

## 6. Database

### 6.1 Schema (7 tables)

Defined in `db/migrations/001_init_sickbay.sql` (six tables) and `003_daily_checks_and_med_seed.sql` (`daily_health_checks`). Charset `utf8mb4`.

- **patients**: `id` INT PK, `patient_code` UNIQUE, `full_name`, `patient_type` ENUM(Student, Staff), `gender` ENUM(Male, Female), `age`, `class_or_dept`, `emergency_contact_name`, `emergency_contact_phone`, `allergies` TEXT (JSON array), `chronic_conditions` TEXT (JSON array), `created_at`, `updated_at`.
- **visits**: `id` PK, `patient_id` FK -> patients.id, `temperature` DECIMAL(4,1), `blood_pressure`, `pulse_rate`, `symptoms`, `presenting_conditions` TEXT (JSON array), `severity` ENUM(Mild, Moderate, Severe), `treatment`, `medication_dispensed_id` INT NULL (references medications.id, no declared FK constraint), `medication_dispensed_qty`, `disposition` ENUM(Back to Class, Sent Home, Referral to Hospital, Observe in Sick Bay), `observed_bed_no`, `observation_end_time`, `notes`, `treated_by`, `created_at`.
- **medications**: `id` PK, `name`, `category` ENUM(Analgesics, Antihistamines, Inhalers, Gastrointestinal, First Aid, Supplies, Other), `quantity_on_hand`, `unit`, `reorder_threshold`, `batch_number` (UNIQUE since 003), `expiry_date`, `over_stock_threshold`, `created_at`, `updated_at`.
- **referrals**: `id` PK, `visit_id` FK -> visits.id, `patient_name`, `patient_id` FK -> patients.id, `referral_hospital`, `reason`, `status` ENUM(Pending, Transferred, Discharged, Followed Up), `outcome_notes`, `created_at`, `updated_at`.
- **facility_logs**: `id` PK, `equipment_name`, `status` ENUM(Functional, Needs Maintenance, Non-Functional), `reported_issue`, `reported_by`, `resolution_days`, `is_resolved` BOOLEAN, `created_at`, `updated_at`.
- **audit_logs**: `id` PK, `action`, `category` ENUM(AUTH, CLINICAL, INVENTORY, FACILITY, SYSTEM), `actor`, `details`, `created_at`.
- **daily_health_checks**: `id` PK, `patient_id` FK -> patients.id, `temperature` DECIMAL(4,1), `symptoms` JSON, `status` ENUM(Healthy, Needs Monitor, Refer to Sickbay), `notes`, `created_at`.

See `docs/erd.svg` for the full diagram.

### 6.2 Migrations

| File | Purpose |
|---|---|
| `001_init_sickbay.sql` | Creates `tuc_sickbay` and the six core tables |
| `002_seed_staff.sql` | Seeds 50 staff patients (`STF001` to `STF050`), `INSERT IGNORE`, idempotent |
| `003_daily_checks_and_med_seed.sql` | Adds `daily_health_checks`, adds the unique key on `medications.batch_number`, seeds the standard 9-line medication inventory (`INSERT IGNORE`, idempotent, never overwrites adjusted quantities) |

### 6.3 Applying migrations on the server (Pattern 37)

`deploy.ps1` ships `db/` to the app directory, so migrations are applied from there. On this Plesk box always use `plesk db`, never a bare `mysql` client:

```bash
plesk db < /var/www/vhosts/system/ai-tools.techbridge.edu.gh/sickbay/db/migrations/001_init_sickbay.sql
plesk db < /var/www/vhosts/system/ai-tools.techbridge.edu.gh/sickbay/db/migrations/002_seed_staff.sql
plesk db < /var/www/vhosts/system/ai-tools.techbridge.edu.gh/sickbay/db/migrations/003_daily_checks_and_med_seed.sql
```

No `-D` flag is needed: each file carries its own `USE tuc_sickbay;` line (001 also creates the database). All three are idempotent and safe to re-run.

Provisioning the scoped user is a one-time interactive step. Run `MYSQL_HISTFILE=/dev/null plesk db` and issue `CREATE USER 'sickbay_app'@'localhost' IDENTIFIED BY ...` + `GRANT ALL PRIVILEGES ON tuc_sickbay.*` there, so the password never lands in shell or mysql history. Then set `DB_PASS` in the app `.env` with `nano` (never `echo`), and `pm2 restart sickbay`.

---

## 7. Sub-Path Serving (Pattern 38)

nginx proxies `https://ai-tools.techbridge.edu.gh/sickbay/` to `http://localhost:3046/sickbay/` **without stripping the prefix**. The contract, all sides of which this app satisfies:

- Vite `base: '/sickbay/'` (absolute, `vite.config.ts`).
- `server.ts` strips `/sickbay/api/` to `/api/` in one middleware, and additionally dual-mounts the router and static dirs at both root and `/sickbay`.
- The SPA prefixes API calls with `import.meta.env.BASE_URL` (`src/lib/api.ts`), never a root-relative `/api/...`.

Symptom table if any side regresses: JS bundles served as `text/html` (blank page) means the base or static mount is wrong; `Unexpected token '<' ... not valid JSON` means a fetch escaped the sub-path.

---

## 8. Code-Splitting and Bundle Budget (Pattern 31)

`vite.config.ts` splits the heavy vendors into their own chunks (`vendor-react`, `vendor-recharts`, `vendor-jspdf`, `vendor-icons`). The `qrcode` library is loaded with a dynamic `import()` only when MFA enrolment starts. `pnpm build` must complete with **no** `chunks larger than 600 kB` warning; treat that warning as a build failure.

---

## 9. Deployment

```powershell
cd C:\Development\github\aucdt-utilities\sick-bay-management-system
.\deploy.ps1 -Build
```

What the script does (`deploy.ps1`):

1. `-Build` runs `pnpm build` locally.
2. scp to `/var/www/vhosts/system/ai-tools.techbridge.edu.gh/sickbay/`: the `dist/` contents, `docs/`, `db/`, `server.ts`, `src/` (runtime imports), `tsconfig.json`, `package.json`, and whichever lockfile exists.
3. Remote (sent as base64 to survive CRLF, Pattern 20): NVM node, `pnpm install --silent || npm install --silent`, then **`.env` handling**: a template (`PORT=3046`, `DB_*` with `DB_USER=sickbay_app` and an empty `DB_PASS`, `WMS_BASE`) is written only if no `.env` exists. An existing `.env` is never clobbered, so DB credentials set once persist across deploys.
4. PM2 hard restart: `pm2 delete sickbay` (if present) then `pm2 start server.ts --name sickbay --interpreter npx --interpreter-args tsx`, `pm2 save`.

First-deploy checklist: apply the migrations (section 6.3), provision `sickbay_app`, set `DB_PASS` via `nano`, restart PM2.

### Verification (definition of done)

```bash
# 1. Build clean locally: pnpm build shows no >600 kB chunk warning.

# 2. New process actually swapped (uptime in seconds, not days):
ssh root@techbridge.edu.gh "pm2 describe sickbay | grep -iE 'uptime|restarts'"

# 3. Health endpoint answers and the DB is connected:
ssh root@techbridge.edu.gh "curl -s http://localhost:3046/sickbay/api/health"
#    expect: {"status":"healthy", ..., "db":"connected"}

# 4. The auth gate fails closed (401 without a token, not 200 and not 500):
ssh root@techbridge.edu.gh "curl -s -o /dev/null -w '%{http_code}' http://localhost:3046/sickbay/api/patients"
#    expect: 401

# 5. Static bundles served as JS, not HTML:
ssh root@techbridge.edu.gh "curl -sI http://localhost:3046/sickbay/assets/<some>.js | grep -iE 'HTTP|content-type'"
#    expect: Content-Type: text/javascript
```

A 500 on step 4 means the DB layer, not the gate, failed (bad credentials or missing schema, Pattern 37). A large uptime on step 2 means the old process is still serving.

---

## 10. Reference Documents

- `docs/USER_GUIDE.md`, clinic-staff manual
- `docs/IEEE_SRS_TUC-ICT-SRS-2026-004.md`, requirements specification
- `docs/architecture.svg` and `docs/erd.svg`, diagrams
- `docs/DOCUMENTATION_PORTAL.html`, self-contained portal served at `/sickbay/docs/DOCUMENTATION_PORTAL.html`
- Monorepo: `PATTERNS.md` (Patterns 31, 35, 37, 38), `CLAUDE.md` §5b, `SERVER_PORTS.md`
