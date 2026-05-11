**Project:** TechBridge Dashboard (spec)
**SRS path:** techbridge-strategy-dashboard/docs/specifications/SRS-TechBridge-v1.0.md
**Priority score:** 63

- **Detected server-side needs:** metrics ingestion API, scheduled job ingestion, aggregation endpoints, auth for data sources, export.
- **Current repo state:** SRS present; no backend detected.

Recommended next steps
- Backend endpoints: `/metrics/ingest`, `/metrics/query`, `/admin/sources`.
- Use Postgres + materialized views or a small analytics pipeline for aggregation.
- Add CI, tests, and monitoring for data integrity.

Estimated effort: Medium (~3 days).
