# Software Requirements Specification — TUC Work Management System (AS-BUILT)

**Techbridge University College · ICT Department · Oyibi, Greater Accra, Ghana**

| Field | Value |
|---|---|
| Document ID | TUC-ICT-SRS-2026-004 |
| Version | **2.0.0 (AS-BUILT baseline)** |
| Status | Reflects deployed system at `wms.techbridge.edu.gh` |
| Date | 6 June 2026 |
| Author | Daniel Frempong Twum — Head of ICT & Special Advisor to the Founder |
| Standard | IEEE 29148:2018 |
| Supersedes | v1.1.0 (delta) / v1.0.1 (approved requirements baseline) |
| Basis | **Reverse-engineered from the deployed codebase** (`gh.edu.techbridge.wms`) — every requirement below corresponds to shipped code, not intent. |

> **Reading guide:** This document describes TUC-WMS **as it actually exists today**. Sections marked
> **[BUILT]** are deployed and verified in production. Sections marked **[NOT BUILT]** are scoped in the
> requirements baseline (v1.0.1) but not yet implemented; they are retained here for completeness and
> roadmap. Where the as-built system **exceeds** the original spec, it is marked **[NEW vs v1.0.1]**.

---

## 1. Introduction

**1.1 Purpose.** Define the actual functional and non-functional behaviour of TUC-WMS, a
university-scoped task/project/workflow platform (Asana-inspired) replacing ad-hoc tools.

**1.2 Scope (as built).** TUC-WMS today provides: Google Workspace SSO with TOTP MFA enrolment;
projects with custom workflow stages, members, and visibility; tasks with rich descriptions,
sub-tasks, dependencies; a Kanban board with WIP limits and real-time SSE updates; a Timeline/Gantt
view; SystemAdmin user management with pre-provisioning; and rich email notification on task
assignment. Workflow automation, full notifications/inbox, and reporting are **not yet built**.

**1.3 Definitions.** WMS = Work Management System. Stage = a project workflow column. Handoff token =
short-lived signed JWT bridging the OAuth callback to the SPA. MFA = TOTP (Google-Authenticator-compatible).

---

## 2. Overall Description (as built)

**2.1 Architecture.**
- **Backend:** Spring Boot 3.3.5, Java 21, `gh.edu.techbridge:tuc-wms`. Single `application.yml`
  with env-var fallbacks. systemd unit `tuc-wms` on **port 8081** behind Plesk **nginx** (proxies
  `/api/`). JDK 21 installed side-by-side with the host's Java 8.
- **Persistence:** JPA/Hibernate (`ddl-auto=update`). **Prod runs H2 file mode**
  (`jdbc:h2:file:/opt/tuc-wms/data/tucwms`) — persists across restarts. MariaDB:3307 is the target
  (env-wired) but **not yet provisioned**. Tables are `wms_`-prefixed (see §5).
- **Frontend:** React 19 + Vite + pnpm SPA at the vhost root; inline-style components, CSS-variable
  TUC palette (maroon `#6b0020`, gold `#f5a800`). `react-router-dom` v6.
- **Auth:** Google OAuth2/OIDC (Spring Security `oauth2Login` on `/api/oauth2/authorization/google`).
- **Real-time:** Server-Sent Events. **Email:** TUC hosted gateway.

**2.2 User classes & roles (FR-AUTH-003 — BUILT).** Server-assigned global roles:
`STUDENT` (default), `LECTURER`, `ADMIN_STAFF`, `HOD`, `SYSTEM_ADMIN`. `HOD`/`SYSTEM_ADMIN`
require MFA. Per-project roles (layered): `VIEWER < COMMENTER < EDITOR < OWNER`
(`ProjectPermissionService`); SYSTEM_ADMIN and the creator are treated as OWNER.

---

## 3. Functional Requirements (as built)

### 3.1 Authentication & Access Control — [BUILT, COMPLETE]
Endpoints (`AuthController`, `OAuthEntryController`, `MeController`):

| Endpoint | Access | Behaviour |
|---|---|---|
| `GET /api/auth/google` | public | 302 → `/api/oauth2/authorization/google` (SRS §3.2 entry preserved). |
| `GET /api/oauth2/authorization/google` | public | Spring initiates Google OAuth (302 to Google). |
| `GET /api/auth/google/callback` | public | Google callback → `OAuthSuccessHandler`. |
| `POST /api/auth/exchange` | public | Exchange single-use `code` (5-min TTL) → access JWT + refresh cookie. |
| `POST /api/auth/mfa/verify` | public | TOTP verify for enrolled MFA users → session. |
| `POST /api/auth/mfa/enroll/begin` | public (mfa ticket) | **[NEW vs v1.0.1]** Generate secret + otpauth URI for first-time enrolment. |
| `POST /api/auth/mfa/enroll/confirm` | public (mfa ticket) | **[NEW]** Verify first code, persist secret, issue session. |
| `POST /api/auth/refresh` | cookie | Mint new access token from HttpOnly `wms_refresh` cookie. |
| `POST /api/auth/logout` | public | Clear refresh cookie. |
| `GET /api/me` | authenticated | Current user (email, name, role, photo, mfaEnrolled). |
| `GET /api/users` | authenticated | **[NEW]** Minimal active-user directory (id/email/name) for member pickers. |

- **FR-AUTH-002** access JWT (15m, in-memory) + refresh JWT (7d, HttpOnly+Secure+SameSite=Lax cookie, path `/api/auth`). ✅
- **FR-AUTH-008 MFA** — verify **and enrolment** (QR wizard during login). ✅ (enrolment was the v1.0.1 gap, now closed)
- **FR-AUTH-009** domain restriction `@techbridge.edu.gh` (403 + audit). ✅
- **FR-AUTH-010** first-login provisioning = STUDENT; matches a pre-provisioned record by email. ✅
- **FR-AUTH-006** append-only audit (`wms_audit_log`). ✅

### 3.1a Admin User Management — [BUILT] (FR-AUTH-004) (`AdminUserController`, SYSTEM_ADMIN only)
| Endpoint | Behaviour |
|---|---|
| `GET /api/admin/users` | List all users (id/email/name/role/active). |
| `POST /api/admin/users` | **[NEW vs v1.0.1]** Pre-provision a user by email before first login (domain-enforced; default STUDENT). |
| `PUT /api/admin/users/{id}/role` | Reassign global role. |
| `PUT /api/admin/users/{id}/name` | **[NEW]** Edit display name. |
| `PUT /api/admin/users/{id}/active` | Deactivate/reactivate (revokes access immediately). |
Frontend guards: cannot self-demote from SYSTEM_ADMIN or self-deactivate.

### 3.2 Project & Task Management — [BUILT] (`ProjectController`, `TaskController`)
**Projects:** `POST /api/projects` (Lecturer/HOD/AdminStaff/SystemAdmin — FR-PROJ-001),
`GET /api/projects` (visibility-filtered summaries — FR-PROJ-007), `GET /api/projects/{id}` (detail
incl. stages), `PUT /api/projects/{id}` (visibility FR-PROJ-005, stages FR-PROJ-002),
`POST /api/projects/{id}/archive` (FR-PROJ-004, soft archive), members CRUD
`GET/POST/DELETE /api/projects/{id}/members` (Owner/Editor/Commenter/Viewer — FR-PROJ-006).
**Tasks:** `POST/GET/PUT/DELETE /api/projects/{id}/tasks[/{taskId}]`, `…/duplicate` (FR-TASK-008).
Fields: title, **rich-text description (Tiptap)**, assignees, start/due dates, priority
(LOW/MED/HIGH/CRIT), status (= a project stage), tags, **sub-task** parentTaskId (one level —
FR-TASK-003), **dependencies** blockedByTaskIds (FR-TASK-004), milestone.
**Deferred within §3.2 [NOT BUILT]:** project templates (FR-PROJ-003), comments/@mentions
(FR-TASK-005 — partially seeded via assignment email), activity log (FR-TASK-006), attachments
(FR-TASK-007), global search (FR-TASK-009), bulk ops (FR-TASK-010).

### 3.3 Kanban Board — [BUILT] (`KanbanController`, `ProjectStreamController`)
`GET /api/projects/{id}/board` (columns by stage; cards; filters assignee/priority/label/due —
FR-KB-004/006), `PUT /api/projects/{id}/board/wip-limits` (Owner; over-limit flag — FR-KB-005),
`GET /api/projects/{id}/stream` (**SSE**; task.created/updated/deleted — FR-KB-007 ≤5s).
Frontend: @dnd-kit drag-drop (move = `PUT …/tasks` status), quick-add, EventSource live refresh.
nginx `proxy_buffering off` on `/stream` **is applied** (verified in the wms vhost, precedes `/api/`),
so cross-client updates are live. ✅

### 3.4 Timeline / Gantt — [BUILT] (`TimelineController`)
`GET /api/projects/{id}/timeline` → bars (start→due), milestones, dependency links + conflict
detection (FR-TL-005), `?groupBy=assignee|stage`. Reschedule = `PUT …/tasks` dates.
**[NOT BUILT]:** baseline (FR-TL-008, Could-Have).

### 3.5 Workflow Automation (FR-AUTO-001..008) — **[NOT BUILT]**
Visual rule builder (Trigger→Condition→Action), trigger/action catalogue, run history — deferred.

### 3.6 Notifications & Inbox (FR-NOTIF-001..007) — **[PARTIAL]**
**[BUILT]** Rich **email on task assignment** (`notify/TaskMailService`, `MailGatewayClient`): sent
async via the TUC gateway; institutional template (rotating campus-frame header, maroon/gold, crest)
with a task deep-link `…/projects/{id}?task={taskId}`. Fires on task create and on newly-added
assignees on update; never self-notifies; skips inactive users.
**[NOT BUILT]:** in-app inbox feed, @mention emails, digests, per-user preferences.

### 3.7 Reporting & Dashboards (FR-RPT-001..007) — **[NOT BUILT]**

---

## 4. Non-Functional Requirements (as built)
- **NFR-SEC-008** — access token in memory only (never localStorage). ✅
- **Security** — CSRF disabled (stateless JWT API); CORS restricted to frontend origin; refresh cookie
  HttpOnly+Secure+SameSite=Lax; JWT HS over a ≥256-bit secret; audit append-only. ✅
- **NFR-REL / persistence** — H2 file mode (persists); **MariaDB migration pending**. 🟡
- **Performance** — SSE + `@Async` email keep request paths non-blocking; not formally load-tested.
- **Auth fragility hardening (as built)** — startup auth calls have a 12s fetch timeout + 10s splash
  safety-net so the SPA never hangs on a stalled request.

---

## 5. Data Model (as built — `wms_`-prefixed tables)
| Table | Purpose | Notable columns |
|---|---|---|
| `wms_users` | identity-linked user record | email (unique), full_name, role (varchar enum), active, totp_secret (null=unenrolled), photo_url, last_login_at |
| `wms_projects` | project | name, description, department, start/end dates, visibility, archived, owner_id; **stages** (@ElementCollection), wip_limits (@ElementCollection) |
| `wms_project_members` | per-project membership | project_id, user_id, project_role |
| `wms_tasks` | task | title, description(html), status, priority, start/due, milestone, parent_task_id; **assignee_ids / tags / blocked_by** (@ElementCollections) |
| `wms_audit_log` | append-only audit (FR-AUTH-006) | event (VARCHAR — not native ENUM), email, detail, source_ip, occurred_at |

Lazy `@ElementCollection`s are materialised inside `@Transactional(readOnly)` read methods to serialise
correctly under `open-in-view=false`.

---

## 6. Deployment (as built)
- Backend: `mvn -DskipTests clean package` → `app.jar`; deploy = backup → checksum-verify → swap →
  poll `/api/oauth2/authorization/google` for 302 → auto-rollback on failure. Env in `/opt/tuc-wms/.env`
  (`JWT_SECRET`, `GOOGLE_CLIENT_*`, `MAIL_GATEWAY_URL`, …).
- Frontend: `frontend/deploy.ps1 -Build` (server-side pnpm build from `main` → rsync → perms → SPA .htaccess).
- Google console redirect URI: `https://wms.techbridge.edu.gh/api/auth/google/callback`.

---

## 7. Roadmap to next baseline (post v2.0.0 as-built)
MariaDB migration · Workflow Automation (FR-AUTO) · Notifications/Inbox (FR-NOTIF) ·
Reporting (FR-RPT) · task collaboration (comments/activity/attachments/search/bulk) ·
project templates · Timeline baseline · SSE nginx no-buffering · formal AC-001..014 sign-off pass.
