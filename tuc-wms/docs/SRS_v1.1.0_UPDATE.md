# TUC-WMS SRS — v1.1.0 Update & Implementation Gap Analysis

**Document ID:** TUC-ICT-SRS-2026-004 · **Version:** 1.1.0 · **Status:** IMPLEMENTED (MVP core)
**Date:** 6 June 2026 · **Author:** Daniel Frempong Twum, Head of ICT
**Standard:** IEEE 29148:2018 · **Supersedes:** v1.0.1 (4 June 2026)

> This is a revision addendum to the approved base SRS (v1.0.1). It records the as-built system
> following the June 2026 implementation sprint, adds an FR-level implementation-status traceability
> matrix, a gap analysis of deferred scope, and notes new capabilities beyond v1.0.1.
> The base requirement text (§1–§6 of v1.0.1) is unchanged except where listed under **Amendments**.

---

## Revision History (append to base §Revision History)

| Version | Date | Author | Description |
|---|---|---|---|
| 1.1.0 | 6 June 2026 | D. F. Twum | **As-built update.** Auth (incl. **MFA enrolment**, FR-AUTH-008) delivered end-to-end. Projects, Tasks, Kanban, and Timeline modules implemented and deployed to `wms.techbridge.edu.gh`. Admin user management (FR-AUTH-004) delivered **plus a new pre-provisioning capability** (create users before first login). Notifications seeded: **rich email on task assignment** (FR-NOTIF, partial). Adds Implementation Status matrix + Gap Analysis. Workflow Automation (FR-AUTO), full Notifications/Inbox (FR-NOTIF), and Reporting (FR-RPT) remain deferred. |

---

## Architecture as built (informative)

- **Backend:** Spring Boot 3 / Java 21, single `application.yml` with env-fallback profiles
  (H2 file mode in prod today; MariaDB:3307 is the target — **migration pending**). groupId
  `gh.edu.techbridge`, artifact `tuc-wms`. systemd unit on port 8081 behind Plesk nginx.
- **Frontend:** React 19 + Vite + pnpm SPA, delivered separately at the vhost root; inline-style
  components, CSS-variable TUC palette. Deployed via server-side build (`frontend/deploy.ps1 -Build`).
- **Auth:** Google Workspace OAuth2/OIDC; stateless JWT handoff (single-use `code` + `mfa` ticket,
  signed, no shared store); 15-min access JWT in memory + 7-day HttpOnly refresh cookie.
- **Real-time:** SSE (`/api/projects/{id}/stream`) for Kanban (FR-KB-007).
- **Email:** TUC hosted gateway (`api.techbridge.edu.gh/aucdt-dev/sendMail`), institutional
  rotating campus-frame template.

---

## Implementation Status Matrix (FR-level)

Legend: ✅ Implemented & deployed · 🟡 Partial · ⛔ Deferred (not started)

### §3.1 Authentication & Access Control — ✅ COMPLETE
| FR | Status | Notes |
|---|---|---|
| FR-AUTH-002 (JWT 15m + refresh 7d) | ✅ | In-memory access token; HttpOnly refresh cookie. |
| FR-AUTH-003 (RBAC, 5 roles, server-assigned) | ✅ | Student/Lecturer/AdminStaff/HOD/SystemAdmin. |
| FR-AUTH-004 (admin user mgmt) | ✅ | + **NEW**: pre-provision users by email before first login; edit name; activate/deactivate. |
| FR-AUTH-006 (append-only audit, 12-mo) | ✅ | `wms_audit_log`; event column hardened to VARCHAR. |
| FR-AUTH-008 (TOTP MFA for HOD/SysAdmin) | ✅ | **Enrolment flow built** (QR + confirm during login) — the v1.0.1 gap. |
| FR-AUTH-009 (domain 403, @techbridge.edu.gh) | ✅ | Enforced at provisioning + pre-provisioning. |
| FR-AUTH-010 (first-login provision = Student) | ✅ | OAuth matches a pre-provisioned record by email (keeps assigned role). |

### §3.2 Task & Project Management — ✅ COMPLETE (MVP), some Should-Haves deferred
| FR | Status | Notes |
|---|---|---|
| FR-PROJ-001 create projects | ✅ | UI: name/desc/department/dates/visibility. |
| FR-PROJ-002 custom workflow stages | ✅ | Settings tab; reorderable; drives Kanban columns. |
| FR-PROJ-003 project templates | ⛔ | Should-Have; deferred. |
| FR-PROJ-004 archive / delete | ✅ | Archive (read-only) implemented; 30-day hard-delete recovery not yet. |
| FR-PROJ-005 visibility settings | ✅ | PUBLIC/DEPARTMENT/MEMBERS/PRIVATE. |
| FR-PROJ-006 members + project roles | ✅ | Owner/Editor/Commenter/Viewer; **member picker dropdown**. |
| FR-PROJ-007 summary cards | ✅ | Name/owner/%/due/members. |
| FR-TASK-001 create tasks (Editor+) | ✅ | |
| FR-TASK-002 task fields (rich text…) | ✅ | **Tiptap** rich description; assignees/due/priority/status/tags/attachments(field). |
| FR-TASK-003 sub-tasks (one level) | ✅ | |
| FR-TASK-004 dependencies (blocked-by) | ✅ | Visualised in Timeline. |
| FR-TASK-005 comments + @mentions | 🟡 | Comments/@mentions UI deferred; **assignment email shipped** as the first notification. |
| FR-TASK-006 per-task activity log | ⛔ | Deferred. |
| FR-TASK-007 attachments (10MB/100MB) | ⛔ | Field exists; upload/storage deferred. |
| FR-TASK-008 duplicate task | ✅ | |
| FR-TASK-009 global task search | ⛔ | Deferred. |
| FR-TASK-010 bulk operations | ⛔ | Deferred. |

### §3.3 Kanban Board — ✅ COMPLETE
| FR | Status | Notes |
|---|---|---|
| FR-KB-001..003 columns/cards/drag | ✅ | @dnd-kit drag-drop = `PUT …/tasks` status. |
| FR-KB-004/006 filters | ✅ | assignee/priority/label/due. |
| FR-KB-005 WIP limits | ✅ | Owner-editable; over-limit highlight. |
| FR-KB-007 near-real-time (≤5s) | ✅ | SSE. **nginx no-buffering on `/stream` still to apply** for instant cross-client. |
| FR-KB-008 | ✅ | |

### §3.4 Timeline / Gantt — ✅ COMPLETE (Must/Should)
| FR | Status | Notes |
|---|---|---|
| FR-TL-001/002 bars by start→due | ✅ | |
| FR-TL-003 dependency links | ✅ | |
| FR-TL-005 conflict detection | ✅ | dependencyConflicts surfaced. |
| FR-TL-004/006/007 reschedule/group/milestone | ✅ | Drag→edit dates; groupBy; milestone diamonds. |
| FR-TL-008 baseline | ⛔ | Could-Have; deferred. |

### §3.5 Workflow Automation (FR-AUTO-001..008) — ⛔ DEFERRED (not started)
### §3.6 Notifications & Inbox (FR-NOTIF-001..007) — 🟡 SEEDED
| FR | Status | Notes |
|---|---|---|
| Email on assignment | 🟡 | **Delivered** — rich institutional email (campus header) + task deep-link, via TUC gateway. |
| In-app inbox feed, digests, prefs | ⛔ | Deferred. |
### §3.7 Reporting & Dashboards (FR-RPT-001..007) — ⛔ DEFERRED (not started)

---

## Non-Functional status (summary)
- **NFR-SEC-008 (token never in localStorage):** ✅ access token in memory only.
- **NFR-SEC (domain restriction, audit, MFA):** ✅ per FR-AUTH above.
- **NFR-REL / persistence:** 🟡 H2 file mode persists across restarts; **MariaDB migration pending** before go-live.
- **NFR-PERF:** not formally load-tested; SSE + async email keep request paths non-blocking.

---

## Gap Analysis & Recommended Roadmap (post-MVP)
1. **MariaDB migration** (NFR-REL) — provision `tuc_wms` DB/user on :3307, point env, migrate H2 data.
2. **Workflow Automation (FR-AUTO)** — rules engine on stage transitions.
3. **Notifications/Inbox (FR-NOTIF)** — in-app feed reusing the task-event plumbing already built.
4. **Reporting/Dashboards (FR-RPT)** — project health, workload, deadlines.
5. **Task collaboration** — comments/@mentions (FR-TASK-005), activity log (006), attachments (007),
   search (009), bulk ops (010).
6. **Should-Haves** — project templates (FR-PROJ-003), Timeline baseline (FR-TL-008).
7. **Ops** — apply nginx no-buffering for `/stream` (FR-KB-007 instant); add a small email-logo asset.

---

## New capabilities beyond v1.0.1 (propose as amendments for a future v1.2)
- **User pre-provisioning** (create accounts before first Google login) — extends FR-AUTH-004/010;
  enables assigning work to colleagues ahead of onboarding. Domain-enforced (FR-AUTH-009).
- **Institutional email template** (rotating campus-video header) — establishes the FR-NOTIF visual standard.

## Acceptance Criteria re-test note (AC-001..014)
Auth-path criteria (AC-001/002/013/014 — domain reject, first-login provision, MFA path) verified in
prod. PM-module criteria exercised manually (create project → task → board drag → timeline) post-deploy.
Formal AC sign-off pass recommended before declaring v1.1.0 APPROVED.
