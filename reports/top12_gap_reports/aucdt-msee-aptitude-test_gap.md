**Project:** MSEE Aptitude Test
**SRS path:** ai-utilities/aucdt-msee-aptitude-test/docs/SRS.md
**Priority score:** 82

- **Detected server-side needs:** exam session persistence, scoring backend, results storage, proctoring hooks, export, user auth.
- **Current repo state:** SRS present; no backend detected.

Recommended next steps
- Implement backend with endpoints: `/start-exam`, `/submit-answer`, `/results`, `/admin/import-questions`.
- Use secure storage for submissions and implement basic anti-cheat/proctoring integration points.
- Add tests and CI; include data retention policy and audit logs.

Estimated effort: Medium (~2-4 days).
