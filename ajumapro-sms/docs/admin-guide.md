# Ajumapro SMS — Admin Guide

## Overview

The Admin Portal (`#/admin`) is a secure, isolated environment for system diagnostics, monitoring,
and testing. It serves as the central command center for the Ajumapro Student Management System.

All data displayed in the portal is sourced from the **live backend API** (`/api/*`). The portal
degrades gracefully to localStorage caching if the backend is temporarily unreachable.

---

## Authentication

| Field        | Value                           |
| ------------ | ------------------------------- |
| **URL**      | `http://localhost:3000/#/admin` |
| **Email**    | `admin@ajumapro.com`            |
| **Password** | `admin123`                      |
| **Token**    | JWT, 7-day expiry               |

Authentication is handled by the backend (`POST /api/auth/login`). On success, a signed JWT is
returned and attached as a `Bearer` token to all subsequent API requests. The token is stored in
`localStorage` as `auth_token`. All login attempts — successful or failed — are persisted to the
audit log in the SQLite database.

---

## Modules

### 1. Dashboard

High-level system status overview.

- Displays the current React version (strictly **19.2.4**).
- Shows overall system health status.
- Renders the 10 most recent audit log entries fetched from `/api/audit`.

### 2. Diagnostics

Real-time system health metrics sourced from the backend (`GET /api/diagnostics`).

| Metric                 | Source                                                |
| ---------------------- | ----------------------------------------------------- |
| **Network Latency**    | Measured SQLite round-trip time on the backend        |
| **Active Connections** | Count of non-expired sessions in the `sessions` table |
| **API Error Rate**     | Ratio of 4xx/5xx to total requests since server start |
| **Uptime**             | Calculated from server process start time             |

### 3. DB Monitor

Database connectivity and query performance (`GET /api/db/status`).

- **Engine:** SQLite with WAL mode (Write-Ahead Logging for concurrent reads)
- **Status:** Live connectivity probe on every page load
- **Query Latency:** Measured execution times for representative `SELECT`, `INSERT`, and `COUNT` queries
- **Counts:** Live totals for audit log entries and admin users

### 4. Testing Suite

Interactive dashboard to run End-to-End (E2E) tests.

- Executes a simulated Playwright test suite covering 5 core user flows.
- Results are written to the audit log via `POST /api/audit` on test start and completion.
- Captures a live DOM snapshot using `html2canvas` on completion.

### 5. System Logs

Comprehensive, scrollable view of all system events (`GET /api/audit`).

All entries are persisted in the `audit_logs` SQLite table. Tracked event types include:

| Action          | Trigger                   |
| --------------- | ------------------------- |
| `SYSTEM_INIT`   | Server first boot         |
| `DB_INIT`       | Database schema creation  |
| `USER_SEED`     | Default admin provisioned |
| `AUTH_SUCCESS`  | Successful login          |
| `AUTH_FAILED`   | Bad credentials           |
| `AUTH_LOGOUT`   | User logged out           |
| `TEST_START`    | E2E suite initiated       |
| `TEST_COMPLETE` | E2E suite finished        |

### 6. Performance

Hardware utilisation metrics sourced from the Node.js `os` and `process` modules
(`GET /api/performance`).

| Metric           | Source                                         |
| ---------------- | ---------------------------------------------- |
| **CPU Usage**    | `os.loadavg()[0]` normalised by CPU core count |
| **Memory Usage** | `os.totalmem()` minus `os.freemem()`           |
| **Heap Usage**   | `process.memoryUsage().heapUsed`               |

---

## Accessibility & Theming

The Admin Portal achieves 100% ARIA coverage on all interactive elements and supports three themes
toggled via the floating button (bottom-right):

| Theme         | Class         |
| ------------- | ------------- |
| Dark          | default       |
| Light         | `theme-light` |
| High Contrast | `theme-hc`    |

Theme preference is persisted to `localStorage` as `app_theme`.
