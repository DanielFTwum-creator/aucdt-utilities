# Software Requirements Specification — TUC Work Management System (AS-BUILT)

**Techbridge University College · ICT Department · Oyibi, Greater Accra, Ghana**

| Field | Value |
|---|---|
| Document ID | TUC-ICT-SRS-2026-004 |
| Version | **2.5.0 (AS-BUILT baseline)** |
| Status | Reflects deployed system at `wms.techbridge.edu.gh` |
| Date | 19 June 2026 |
| Author | Daniel Frempong Twum — Head of ICT & Special Advisor to the Founder |
| Standard | IEEE 29148:2018 |
| Supersedes | v2.4.0 (as-built baseline) / v2.3.0 (as-built baseline) / v2.2.0 (as-built baseline) / v2.0.0 (as-built baseline) / v1.1.0 (delta) / v1.0.1 (approved requirements baseline) |
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
view; SystemAdmin user management with pre-provisioning; rich email notification on task
assignment; a fully featured in-app notifications inbox; a secure Gemini API key proxy for
fleet-wide custody; database persistence for the UMaT tracker; and a hosted Lecturer Evaluation Module (LEMS) for student/staff evaluations; a Workflow Automation (FR-AUTO) rule builder; and a Reporting & Dashboards (FR-RPT) visual dashboard.

**1.3 Definitions.** WMS = Work Management System. Stage = a project workflow column. Handoff token =
short-lived signed JWT bridging the OAuth callback to the SPA. MFA = TOTP (Google-Authenticator-compatible).

---

## 2. Overall Description (as built)

**2.1 Architecture.**
- **Backend:** Spring Boot 3.3.5, Java 21, `gh.edu.techbridge:tuc-wms`. Single `application.yml`
  with env-var fallbacks. systemd unit `tuc-wms` on **port 8081** behind Plesk **nginx** (proxies
  `/api/`). JDK 21 installed side-by-side with the host's Java 8.
- **Persistence:** JPA/Hibernate (`ddl-auto=update`). Production runs **MariaDB on port 3306** (`jdbc:mariadb://127.0.0.1:3306/tuc_wms_db`), fully migrated from the legacy H2 file mode on 7 June 2026. Tables are `wms_`-prefixed (see §5).
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
**Deferred within §3.2 [NOT BUILT]:** project templates (FR-PROJ-003). Global Task Search (FR-TASK-009), Bulk Task Operations (FR-TASK-010), Task Comments & @mentions (FR-TASK-005), Per-Task Activity Logs (FR-TASK-006), and File Attachments (FR-TASK-007) are **[BUILT, COMPLETE]** and integrated.

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

### 3.5 Workflow Automation (FR-AUTO-001..008) — **[BUILT, COMPLETE]**
Provides a project-scoped rule builder enabling automated actions when triggers are activated and conditions are met. Runs synchronously inside task mutations with a thread-local execution guard to prevent recursive automation cascades (infinite loops).

| Endpoint | Access | Behaviour |
|---|---|---|
| `GET /api/projects/{projectId}/automations/rules` | view | Lists all rules for the project. |
| `POST /api/projects/{projectId}/automations/rules` | Editor | Creates a new automation rule with trigger, condition, and action. |
| `PUT /api/projects/{projectId}/automations/rules/{ruleId}` | Editor | Updates rule properties. |
| `PUT /api/projects/{projectId}/automations/rules/{ruleId}/toggle` | Editor | Toggles rule active status. |
| `DELETE /api/projects/{projectId}/automations/rules/{ruleId}` | Editor | Deletes a rule. |
| `GET /api/projects/{projectId}/automations/history` | view | Lists rule execution history logs (paginated). |

### 3.6 Notifications & Inbox (FR-NOTIF-001..007) — **[BUILT, COMPLETE]**
- **FR-NOTIF-001 Email Notification:** Rich **email on task assignment** (`notify/TaskMailService`, `MailGatewayClient`) is sent asynchronously via the TUC gateway. Uses the rotating campus-frame template (maroon/gold with institutional crest) and includes a task deep-link `…/projects/{id}?task={taskId}`. Fires on task creation and when assignees are added; skips inactive and current acting users.
- **FR-NOTIF-002 In-app Inbox Feed:** A persistent, in-app notification list scoped strictly per recipient (`notify/NotificationController`). Returns a user's own rows, ordered reverse-chronologically.
- **FR-NOTIF-003 Mark Read / Read All:** Read flags can be updated individually or in bulk via controller PUT mapping.
- **FR-NOTIF-006 Polled Unread Badges:** Exposes a lightweight `/unread-count` endpoint polled by the UI navigation badge.

| Endpoint | Access | Behaviour |
|---|---|---|
| `GET /api/notifications` | authenticated | Returns list of user's own notifications (`unread` and `limit` query parameters) and total unread count. |
| `GET /api/notifications/unread-count` | authenticated | Lightweight retrieval of user's unread notification count. |
| `PUT /api/notifications/{id}/read` | authenticated | Marks a specific notification as read. Restricts edit to the recipient owner only. |
| `PUT /api/notifications/read-all` | authenticated | Marks all caller's notifications as read. |

### 3.7 Reporting & Dashboards (FR-RPT-001..007) — **[BUILT, COMPLETE]**
Provides visual, project-scoped reports showing overall completion rates, milestone progress, active vs overdue metrics, task status/stage distributions, and assignee workloads.

| Endpoint | Access | Behaviour |
|---|---|---|
| `GET /api/projects/{projectId}/reports` | view | Retrieves overall project completion rates, milestones statistics, counts per stage, workload counts by assignee, and overdue task backlog. |

### 3.8 Lecturer Evaluation Module (LEMS) — [BUILT] [NEW]
Hosted within WMS (`lems/` package), allowing students and staff to perform academic curriculum management and anonymous lecturer evaluations. Evaluated submissions are structured anonymously with a salted student deduplication hash (`LEMS_DEDUPE_SALT`).

| Endpoint | Access | Behaviour |
|---|---|---|
| `POST /api/lems/curriculum/import` | Admin | Imports and updates programs, courses, and course-lecturer assignments parsed from program PDFs. |
| `GET /api/lems/catalog` | authenticated | Retrieves the academic catalog details (courses, lecturers, programmes). |
| `GET /api/lems/evaluations` | authenticated | Lists available or submitted evaluations. |
| `POST /api/lems/evaluations/submit` | Student/SSO | Submits a completed course evaluation, persisting scores and text comments anonymously. |
| `GET /api/lems/audit` | HOD+ | Retrieves audit logs of LEMS mutations (e.g. curriculum imports). |

### 3.9 Central Gemini API Key Proxy — [BUILT] [NEW]
Exposes secure AI model capabilities and handles secure custody of the shared Gemini API Key (`gemini/` package) so frontend and consumer clients do not store keys client-side.

| Endpoint | Access | Behaviour |
|---|---|---|
| `POST /api/gemini/chat` | authenticated | Proxies and relays chat prompt payloads to the Gemini API. |
| `GET /api/gemini/key` | Internal service header | Relays the raw Gemini API key to registered servers. Authenticated by a constant-time compare of `X-Gemini-Proxy-Key`. |

### 3.10 UMaT Tracker Persistence — [BUILT] [NEW]
Persists tracker entries and compliance audit trails for the UMaT Tracker application (`umat/` package), migrating state storage from SPA local storage to the central WMS database.

| Endpoint | Access | Behaviour |
|---|---|---|
| `GET /api/umat/tracking` | authenticated | Retrieves per-recommendation tracking states. |
| `POST /api/umat/tracking` | authenticated | Saves or updates tracking state, appending a change log entry. |
| `GET /api/umat/changelog` | authenticated | Retrieves UMaT compliance audit changelogs. |

### 3.11 Administrative Docs Endpoint — [BUILT] [NEW]
Serves system documentation directly from backend resources (`docs/AdminDocsController.java`).

| Endpoint | Access | Behaviour |
|---|---|---|
| `GET /api/admin/docs/sso-handbook` | SYSTEM_ADMIN | Serves the HTML rendering of the SSO Ecosystem Handbook (`TUC-ICT-SRS-2026-013_SSO_Ecosystem.html`) loaded from classpath resources. |

### 3.12 Global Task Search & Bulk Task Operations — [BUILT] (FR-TASK-009, FR-TASK-010)

Provides a visibility-aware global task search across viewable projects, and bulk management operations on the Kanban Board.

| Endpoint | Access | Behaviour |
|---|---|---|
| `GET /api/tasks/search` | authenticated | Searches task titles, descriptions, and tags across projects viewable by the user. |
| `POST /api/projects/{projectId}/tasks/bulk-update` | Editor | Batch updates the status, priority, milestone, assignee list, and tags of multiple tasks. Logs activity trails and fires automation triggers. |
| `POST /api/projects/{projectId}/tasks/bulk-delete` | Editor | Batch deletes multiple tasks, cascade-deleting comments, activities, and attachments. |

---

## 4. Non-Functional Requirements (as built)
- **NFR-SEC-008** — access token in memory only (never localStorage). ✅
- **Security** — CSRF disabled (stateless JWT API); CORS restricted to frontend origin; refresh cookie
  HttpOnly+Secure+SameSite=Lax; JWT HS over a ≥256-bit secret; audit append-only. ✅
- **NFR-REL / persistence** — MariaDB database server persistence on port 3306. ✅
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
| `wms_notifications` | user in-app notifications inbox | recipient_id, type, title, body, project_id, task_id, read_flag, created_at |
| `wms_umat_tracking` | UMaT recommendation state | item_id (PK), owner, status, due_date, notes, created_at, updated_at, updated_by |
| `wms_umat_changelog` | UMaT change trail logs | id (PK), item_id, timestamp, field, old_value, new_value, actor |
| `wms_lems_programmes` | LEMS academic programmes | id (PK), name, description, department |
| `wms_lems_courses` | LEMS academic courses | id (PK), name, description, semester, programme_id |
| `wms_lems_lecturers` | LEMS academic lecturers | id (PK), first_name, last_name, email |
| `wms_lems_evaluations` | LEMS course evaluations | id (PK), course_id, student_hash (salted SHA-256 for deduplication), submitted_at, comment |
| `wms_lems_ratings` | LEMS evaluation rating questions | id (PK), evaluation_id, question_key, score |
| `wms_lems_audit` | LEMS changes audit log | id (PK), event_type, details, status, actor |
| `wms_task_comments` | task comments feed | id (PK), task_id, author_id, content (text), created_at |
| `wms_task_activities` | task mutation activities | id (PK), task_id, actor_id, action_type, detail (text), occurred_at |
| `wms_task_attachments` | task file attachments | id (PK), task_id, file_name, content_type, file_size, file_data (mediumblob), uploaded_by_id, uploaded_at |

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

## 7. Roadmap to next baseline (post v2.4.0 as-built)
Task collaboration search/bulk (FR-TASK-009/010) · project templates · Timeline baseline · formal AC-001..014 sign-off pass.

---

## Revision History

| Version | Date | Author | Description |
|---|---|---|---|
| 1.0.1 | 4 June 2026 | D. F. Twum | Approved base requirements specification. |
| 1.1.0 | 6 June 2026 | D. F. Twum | Delta update for MFA and Admin UI. |
| 2.0.0 | 6 June 2026 | D. F. Twum | Reverse-engineered as-built baseline. |
| 2.1.0 | 19 June 2026 | Antigravity | WMS v2.1.0 Alignment. Documents LEMS evaluation, in-app notifications inbox, UMaT Tracker persistence, Gemini API key proxy, and administrative docs endpoints, updating database tables schema. |
| 2.2.0 | 19 June 2026 | Antigravity | Workflow Automation (FR-AUTO) implemented. Documents triggers, conditions, actions, REST controllers, and frontend rule builder tab, updating database schemas. |
| 2.3.0 | 19 June 2026 | Antigravity | Reporting & Dashboards (FR-RPT) implemented. Documents project-scoped visual reports, metrics calculations, stage distribution charts, workload progress segments, and overdue logs. |
| 2.4.0 | 19 June 2026 | Antigravity | Task Collaboration (FR-TASK-005 Comments & @mentions, -006 Activity Logs, -007 File Attachments) implemented. Documents comments parsing, user mentions notifications, history activity tables, and LOB database attachments. |
| 2.5.0 | 19 June 2026 | Antigravity | Global Task Search (FR-TASK-009) and Bulk Task Operations (FR-TASK-010) implemented. Documents debounced global search overlay, bulk selection modes, batch stage/priority/assignee/milestone updates, and bulk delete actions. |
