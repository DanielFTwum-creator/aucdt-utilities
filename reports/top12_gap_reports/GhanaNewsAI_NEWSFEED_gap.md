**Project:** GhanaNewsAI — NEWSFEED SRS
**SRS path:** GhanaNewsAI/NEWSFEED SRS.pdf
**Priority score:** 186

- **Detected server-side needs:** aggregation endpoints, normalization, deduplication, caching, scheduling, admin auth, export.
- **Current repo state:** SRS present; no backend detected.

Recommended next steps
- Build a backend service with endpoints for feed ingestion and article retrieval, plus a scheduler for periodic pulls.
- Use a relational DB (Postgres) + Redis for caching; provide search with basic full-text indexes.
- Add job worker for parsing PDFs/HTML and marking fetched status.
- Implement audit logging and admin UI endpoints.
- Tests and CI as above.

Estimated effort: Medium (~2-4 days).
