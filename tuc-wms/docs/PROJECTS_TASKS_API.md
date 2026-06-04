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

## Kanban Board (FR-KB) — Phase 3

| Method/Path | Permission | Notes |
|---|---|---|
| `GET /api/projects/{id}/board` | view | Board grouped by stage. Returns `{projectId, stages[], columns:[{stage, count, wipLimit, overWip, cards:[{id,title,assigneeIds,dueDate,priority,subtaskCount,status}]}]}`. Filters via query params: `assignee`, `priority`, `label`, `dueFrom`, `dueTo` (FR-KB-004/006). |
| `PUT /api/projects/{id}/board/wip-limits` | OWNER | body `{ "In Progress": 5, … }` — per-column WIP limits (FR-KB-005); `overWip` flags exceeded columns. |
| `GET /api/projects/{id}/stream` | view | **SSE** (`text/event-stream`). Events: `task.created`, `task.updated` (incl. drag-drop status change), `task.deleted`. UI opens `EventSource` and refreshes affected cards — meets FR-KB near-real-time (≤5s). |

**Drag-drop / quick-add / column reorder** reuse existing endpoints: move a card =
`PUT …/tasks/{taskId}` with a new `status`; quick-add = `POST …/tasks`; reorder columns =
`PUT /api/projects/{id}` with reordered `stages`.

**⚠️ Deploy note (SSE):** the reverse proxy must NOT buffer the stream. In the wms nginx
config add for the stream path:
```nginx
location ~ ^/api/projects/[0-9]+/stream$ {
    proxy_pass http://127.0.0.1:8081;
    proxy_set_header Connection '';
    proxy_http_version 1.1;
    proxy_buffering off;
    chunked_transfer_encoding off;
    proxy_read_timeout 3600s;
}
```
(place before the general `location /api/` block).

## Deferred to a later phase (not yet implemented)
Task comments + @mentions (FR-TASK-005), per-task activity log (FR-TASK-006), file
attachments (FR-TASK-007), global task search (FR-TASK-009), bulk operations (FR-TASK-010),
project templates (FR-PROJ-003 "Should Have"). The Kanban (FR-KB), Timeline (FR-TL),
Reports (FR-RPT) and Notifications (FR-NOTIF) modules build on these endpoints.
