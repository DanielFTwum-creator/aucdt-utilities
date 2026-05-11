**Project:** GhanaNewsAI — GNA UPDATED IEEE SRS
**SRS path:** GhanaNewsAI/GNA UPDATED IEEE SRS.pdf
**Priority score:** 300

- **Detected server-side needs (from SRS):** feed ingestion, scraping, normalization, scheduled fetch (cron), persistent storage, search API, caching, auth for admin, export, audit logs.
- **Current repo state:** SRS present; no backend detected.
- **Risk:** High — feeds & scraping require server-side fetch/caching; client-only approach is insufficient for reliability and security.

Recommended next steps
- Provision a minimal Node/Express service with endpoints:
  - `POST /ingest/feed` (feed registration)
  - `GET /articles` (paginated search)
  - `POST /webhook/scrape` (cron/trigger)
  - `GET /admin/stats` (auth)
- Persistence: PostgreSQL (or SQLite for PoC) with tables: feeds, articles, fetch_logs, users, audit_logs.
- Add background worker (Bull/Queue or simple Cron) for scraping and canonicalization.
- Security: Admin JWT auth, rate-limiting, input validation.
- Tests: unit tests for ingestion/parsing, integration tests for endpoints, e2e for feed-to-article flow.
- CI: add GitHub Actions workflow to run `install`, `lint`, `test`, and build container image.

Estimated effort: Medium → ~3-5 developer days for PoC.
