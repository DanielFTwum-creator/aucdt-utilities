# TUC-WMS Projects & Tasks API (Phase 2)

> SRS TUC-ICT-SRS-2026-004 v1.0.0 §3.2 (Projects FR-PROJ-001..007, Tasks FR-TASK-001..010).
> All endpoints require a valid access JWT (`Authorization: Bearer …`) — see AUTH_API.md.
> Per-project permissions (FR-PROJ-006) are enforced server-side on top of the global role.

## Project roles (per project)
`VIEWER` < `COMMENTER` < `EDITOR` < `OWNER`. SYSTEM_ADMIN and the project creator are treated as OWNER.

## Projects

| Method/Path | Permission | Notes |
|---|---|---|
| `POST /api/projects` | global role Lecturer/HOD/AdminStaff/SystemAdmin (FR-PROJ-001) | body: `{name, description, department, startDate, endDate, visibility, stages}`. Creator becomes OWNER; default stages `["To Do","In Progress","Review","Done"]` if none given. → 201 summary |
| `GET /api/projects` | any authenticated (visibility-filtered) | summary cards: `{id,name,ownerId,dueDate,memberCount,visibility,archived}` (FR-PROJ-007) |
| `GET /api/projects/{id}` | view (visibility/member) | detail incl. description, department, startDate, stages |
| `PUT /api/projects/{id}` | EDITOR+ (not archived) | partial update; `visibility` (FR-PROJ-005), `stages` (FR-PROJ-003) |
| `POST /api/projects/{id}/archive?archived=true|false` | OWNER | soft delete (FR-PROJ-004) |
| `GET /api/projects/{id}/members` | view | list members + roles |
| `POST /api/projects/{id}/members` | OWNER | body `{email, projectRole}` — add/update a member (FR-PROJ-006) |
| `DELETE /api/projects/{id}/members/{userId}` | OWNER | remove (cannot remove the owner) |

Visibility: `PUBLIC` (all TUC), `DEPARTMENT`, `MEMBERS`, `PRIVATE`.

## Tasks (scoped to a project)

| Method/Path | Permission | Notes |
|---|---|---|
| `POST /api/projects/{projectId}/tasks` | EDITOR+ | body: `{title, description(rich HTML), assigneeIds[], dueDate, priority, status, tags[], parentTaskId, blockedByTaskIds[]}`. `status` must be one of the project's stages. `parentTaskId` makes a sub-task (one level deep only). → 201 |
| `GET /api/projects/{projectId}/tasks` | view | all tasks in the project |
| `GET /api/projects/{projectId}/tasks/{taskId}` | view | one task |
| `PUT /api/projects/{projectId}/tasks/{taskId}` | EDITOR+ | partial update (incl. `status` to move stage — FR-TASK / Kanban) |
| `POST /api/projects/{projectId}/tasks/{taskId}/duplicate` | EDITOR+ | duplicate within the project (FR-TASK-008) |
| `DELETE /api/projects/{projectId}/tasks/{taskId}` | EDITOR+ | deletes the task and its sub-tasks |

Priority: `LOW|MEDIUM|HIGH|CRITICAL`. Task `status` mirrors a project workflow stage (drives the Kanban view).

## Deferred to a later phase (not yet implemented)
Task comments + @mentions (FR-TASK-005), per-task activity log (FR-TASK-006), file
attachments (FR-TASK-007), global task search (FR-TASK-009), bulk operations (FR-TASK-010),
project templates (FR-PROJ-003 "Should Have"). The Kanban (FR-KB), Timeline (FR-TL),
Reports (FR-RPT) and Notifications (FR-NOTIF) modules build on these endpoints.
