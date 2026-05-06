**Remediation Plan (Aggregated)**

Scope: implement backends and operational hygiene for prioritized projects identified by repo audit.

1) PoC Backends (priority): GhanaNewsAI, GhanaNewsAI-feeds, Brand Guideline Checker.
  - Deliverables: service scaffold, DB schema, worker, basic auth, CI.
  - Timeline: PoC for GhanaNewsAI (3–5 days); parallel templates (2–3 days).

2) Shared template
  - Create `services/template-node-postgres` that teams copy for new services. Include health, logging, migrations placeholder, Dockerfile, and CI workflow reference.

3) Migration tooling
  - Provide `tools/migrate-localstorage-to-db` for projects using `localStorage` (TSAPro) to migrate that data into server DB.

4) CI/CD
  - Add `.github/workflows/ci-template.yml` and require each new service to include a CI job that runs tests and builds container images.

5) Tests and monitoring
  - Each service must have unit tests (jest), integration tests (supertest), and basic observability (logs + metrics).

6) Security baseline
  - Secrets management, JWT auth, input validation, rate-limiting, backups, rotation.

7) Rollout checklist
  - Staging deployment, smoke tests, data migration dry-run, backup verification, audit log review, production cutover.

Use the `services/template-node-postgres` as the canonical starting point for all new backends.
