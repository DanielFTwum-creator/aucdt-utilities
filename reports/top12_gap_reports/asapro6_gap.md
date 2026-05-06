**Project:** ASAPro (asapro6)
**SRS path:** ai-utilities/asapro6/SRS.md
**Priority score:** 94

- **Detected server-side needs:** user accounts, persistent storage of student data, exam/session management, API for grading and reports, admin controls, audit.
- **Current repo state:** SRS present; no backend detected.

Recommended next steps
- Implement REST API for users, sessions, grading (`/users`, `/exams`, `/grades`, `/reports`).
- Persist data in Postgres; consider RBAC for admin operations.
- Add scheduled jobs for reports/email digests.
- Add tests and CI pipeline.

Estimated effort: Medium (~3 days).
