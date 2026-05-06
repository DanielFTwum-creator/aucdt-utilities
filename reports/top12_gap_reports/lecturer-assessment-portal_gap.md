**Project:** Lecturer Assessment Portal (db-v2)
**SRS path:** ai-utilities/lecturer-assessment-portal-db-v2-27102025-1602/docs/SRS.md
**Priority score:** 81

- **Detected server-side needs:** student records DB, grade storage, import/export, reporting endpoints, role-based access, audit logs.
- **Current repo state:** SRS present; no backend detected.

Recommended next steps
- Implement REST API for students, assessments, grades, and reporting.
- Use Postgres; add migrations and seeders; implement RBAC for admin/lecturer roles.
- Provide CSV import/export and scheduled reporting jobs.
- Add tests (unit + integration) and CI.

Estimated effort: Medium (~3-5 days).
