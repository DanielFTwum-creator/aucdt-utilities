# IEEE 29148 Software Requirements Specification (SRS)
## SickBay Management System (`sickbay`)

**Document Identifier:** `TUC-ICT-SRS-2026-004`
**Revision:** 3.0.0
**Date:** 23 July 2026
**Status:** Approved & As-Built
**Author:** Daniel Frempong Twum, Head of ICT & Special Advisor to the Founder
**Institution:** Techbridge University College (TUC), Oyibi, Greater Accra, Ghana

### Revision History

| Revision | Date | Description |
|---|---|---|
| 2.0.0 | 21 July 2026 | As-built specification for the client-side release |
| 3.0.0 | 23 July 2026 | Database-backed revision: MariaDB persistence, REST API, WMS bearer auth gate, daily health checks; corrected the architecture diagram (the Express server, not nginx, strips the sub-path prefix) |

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the **SickBay Management System (`sickbay`)**, an integrated campus healthcare encounter management platform operating at Techbridge University College.

### 1.2 System Scope
`sickbay` provides campus health officers with digital patient intake, triage registration, vitals analytics, pharmacy inventory monitoring, referral tracking, daily health screening, facility fault logging, and audit reporting. All clinical data is held centrally in a MariaDB database and shared across every signed-in device.

```
+-----------------------------------------------------------------------+
|                 SICKBAY MANAGEMENT SYSTEM (SYSTEM SCOPE)             |
|                                                                       |
|  +--------------------+  +--------------------+  +-----------------+  |
|  | Patient Intake     |  | Clinical Vitals    |  | Pharmacy        |  |
|  | & Triage Roster    |  | Trend Analytics    |  | Inventory       |  |
|  +--------------------+  +--------------------+  +-----------------+  |
|  +--------------------+  +--------------------+  +-----------------+  |
|  | Hospital           |  | Daily Health       |  | PDF Medical     |  |
|  | Referrals          |  | Checks & Facility  |  | Summary Export  |  |
|  |                    |  | Fault Logs         |  | & Audit Trail   |  |
|  +--------------------+  +--------------------+  +-----------------+  |
+-----------------------------------------------------------------------+
```

---

## 2. Overall Description

### 2.1 Product Perspective
The system is a React 19 single-page application backed by a Node.js Express server (`server.ts`, run via `tsx` under PM2 as process `sickbay`) on port `3046`, served at the nginx sub-path `ai-tools.techbridge.edu.gh/sickbay/` on Plesk Ubuntu infrastructure.

All clinical data persists in the **MariaDB database `tuc_sickbay`** on the app-DB instance (`localhost:3306`), accessed through a scoped non-root user (`sickbay_app`@localhost). The browser holds no clinical data; the SPA loads its dataset through the REST API and re-pulls the authoritative dataset after every write.

The backend exposes a **REST API** (`src/server/routes.ts`) of 20 data endpoints covering patients, visits (including a transactional visit write that deducts dispensed stock and raises a hospital referral atomically), visit discharge, medications, referrals, facility logs, daily health checks, audit logs, and summary statistics. The server maps snake_case database columns to the frontend's camelCase types in both directions.

Every data endpoint sits behind a **WMS bearer authentication gate**: `requireAuth` requires an `Authorization: Bearer` token and verifies it server-side via `verifyWmsToken` against WMS `/api/me`, failing closed with `401` when the token is missing or invalid. Auth and health paths fall through the gate so sign-in and monitoring work before a session exists. User sign-in is WMS single sign-on (Google Workspace account, `@techbridge.edu.gh` only) with TOTP multi-factor verification; Google OAuth secrets are held solely by WMS (Pattern 35).

### 2.2 System Architecture
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 400" width="100%" height="320">
  <!-- Embedded Architecture Diagram (as-built, rev 3.0.0) -->
  <rect width="900" height="400" fill="#f8fafc" rx="12"/>
  <text x="30" y="36" font-family="sans-serif" font-size="18" font-weight="bold" fill="#0f172a">SickBay System Architecture</text>

  <rect x="20" y="70" width="200" height="120" fill="#ffffff" stroke="#0f172a" stroke-width="2" rx="8"/>
  <text x="34" y="96" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">React 19 SPA Client</text>
  <text x="34" y="118" font-family="sans-serif" font-size="10.5" fill="#475569">- Vite base /sickbay/</text>
  <text x="34" y="136" font-family="sans-serif" font-size="10.5" fill="#475569">- In-memory WMS token</text>
  <text x="34" y="154" font-family="sans-serif" font-size="10.5" fill="#475569">- No clinical data stored</text>
  <text x="34" y="172" font-family="sans-serif" font-size="10.5" fill="#475569">  in the browser</text>

  <rect x="248" y="70" width="200" height="120" fill="#eff6ff" stroke="#1d4ed8" stroke-width="2" rx="8"/>
  <text x="262" y="96" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1d4ed8">Nginx Reverse Proxy</text>
  <text x="262" y="118" font-family="sans-serif" font-size="10.5" fill="#1e40af">- TLS termination</text>
  <text x="262" y="136" font-family="sans-serif" font-size="10.5" fill="#1e40af">- Location /sickbay/</text>
  <text x="262" y="154" font-family="sans-serif" font-size="10.5" fill="#1e40af">- Forwards the prefix</text>
  <text x="262" y="172" font-family="sans-serif" font-size="10.5" fill="#1e40af">  UN-stripped</text>

  <rect x="476" y="70" width="200" height="120" fill="#ecfdf5" stroke="#047857" stroke-width="2" rx="8"/>
  <text x="490" y="96" font-family="sans-serif" font-size="13" font-weight="bold" fill="#047857">Express Backend (3046)</text>
  <text x="490" y="118" font-family="sans-serif" font-size="10.5" fill="#065f46">- tsx runtime (server.ts)</text>
  <text x="490" y="136" font-family="sans-serif" font-size="10.5" fill="#065f46">- Strips /sickbay prefix</text>
  <text x="490" y="154" font-family="sans-serif" font-size="10.5" fill="#065f46">  (Pattern 38)</text>
  <text x="490" y="172" font-family="sans-serif" font-size="10.5" fill="#065f46">- WMS bearer auth gate</text>

  <rect x="704" y="70" width="180" height="120" fill="#fef3c7" stroke="#b45309" stroke-width="2" rx="8"/>
  <text x="718" y="96" font-family="sans-serif" font-size="13" font-weight="bold" fill="#b45309">MariaDB (3306)</text>
  <text x="718" y="118" font-family="sans-serif" font-size="10.5" fill="#92400e">- tuc_sickbay</text>
  <text x="718" y="136" font-family="sans-serif" font-size="10.5" fill="#92400e">- sickbay_app@localhost</text>
  <text x="718" y="154" font-family="sans-serif" font-size="10.5" fill="#92400e">- 7 tables incl.</text>
  <text x="718" y="172" font-family="sans-serif" font-size="10.5" fill="#92400e">  audit_logs</text>

  <line x1="220" y1="130" x2="248" y2="130" stroke="#0f172a" stroke-width="2"/>
  <line x1="448" y1="130" x2="476" y2="130" stroke="#0f172a" stroke-width="2"/>
  <line x1="676" y1="130" x2="704" y2="130" stroke="#0f172a" stroke-width="2"/>

  <rect x="248" y="260" width="428" height="110" fill="#faf5ff" stroke="#7e22ce" stroke-width="2" rx="8"/>
  <text x="262" y="286" font-family="sans-serif" font-size="13" font-weight="bold" fill="#7e22ce">WMS (wms.techbridge.edu.gh)</text>
  <text x="262" y="308" font-family="sans-serif" font-size="10.5" fill="#6b21a8">- Google SSO + TOTP MFA; sole custodian of GOOGLE_CLIENT_SECRET</text>
  <text x="262" y="326" font-family="sans-serif" font-size="10.5" fill="#6b21a8">- GET /api/me validates every SickBay API bearer token</text>
  <text x="262" y="344" font-family="sans-serif" font-size="10.5" fill="#6b21a8">- OAuth exchange relay (Pattern 35)</text>

  <line x1="120" y1="190" x2="120" y2="315" stroke="#7e22ce" stroke-width="2" stroke-dasharray="5,4"/>
  <line x1="120" y1="315" x2="248" y2="315" stroke="#7e22ce" stroke-width="2" stroke-dasharray="5,4"/>
  <text x="128" y="232" font-family="sans-serif" font-size="10" fill="#7e22ce">sign-in +</text>
  <text x="128" y="246" font-family="sans-serif" font-size="10" fill="#7e22ce">exchange</text>
  <line x1="576" y1="190" x2="576" y2="260" stroke="#7e22ce" stroke-width="2" stroke-dasharray="5,4"/>
  <text x="586" y="232" font-family="sans-serif" font-size="10" fill="#7e22ce">verify token (/api/me)</text>
</svg>
```

---

## 3. Specific Requirements

### 3.1 Functional Requirements
- **FR-01 (Triage Registration):** System shall capture patient encounter records with vitals (temperature, blood pressure, pulse rate), presenting symptoms, severity, treatment, and disposition. The visit write shall be atomic: visit insertion, dispensed-stock deduction, and any hospital referral creation succeed or roll back together.
- **FR-02 (Vitals Analytics):** System shall render interactive historical vitals trends comparing patient parameters against normal health ranges.
- **FR-03 (Inventory Management):** System shall monitor pharmaceutical stock, batch numbers, expiry dates, and reorder warnings, and shall deduct stock automatically when medication is dispensed during a visit.
- **FR-04 (Referral Tracking):** System shall track student and staff referrals to external hospitals through the statuses Pending, Transferred, Discharged, and Followed Up, with outcome notes.
- **FR-05 (PDF Export):** System shall generate printable medical encounter summaries in PDF format.
- **FR-06 (Daily Health Checks):** System shall record routine wellness screenings against roster patients (temperature, symptoms, a status of Healthy, Needs Monitor, or Refer to Sickbay, and notes) and present them in a searchable, filterable journal.
- **FR-07 (Central Persistence):** All clinical data (patients, visits, medications, referrals, facility logs, daily health checks, audit logs) shall persist to the central MariaDB database `tuc_sickbay`. No clinical data shall be stored in the browser; records shall be shared across all signed-in devices, and the client shall reload the authoritative dataset from the database after every write.

### 3.2 Security & Compliance
- **SR-01 (WMS Relay Custody):** All Google OAuth operations shall relay through WMS without holding client secrets server-side (Pattern 35).
- **SR-02 (Audit Logging):** All clinical intake, inventory modification, facility, and auth events shall generate timestamped audit entries persisted to the `audit_logs` database table with actor and category.
- **SR-03 (API Authentication Gate):** Every data endpoint shall require a valid WMS bearer token, verified server-side against WMS `/api/me`, and shall fail closed with HTTP 401 when the token is absent, invalid, or expired. Only auth and health paths are exempt from the gate.
