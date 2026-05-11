**Project:** TSAPro — SRS_IMPLEMENTATION_COMPARISON review
**SRS path:** tsapro/SRS_IMPLEMENTATION_COMPARISON.md
**Priority score:** 50

- **Detected situation:** `SRS_IMPLEMENTATION_COMPARISON.md` documents a client-only implementation matching many SRS items (auth via localStorage, audit log in localStorage, Gemini integration). SRS mentions server-side storage as optional.
- **Current repo state:** Implementation maps to SRS but uses localStorage; no backend present.

Recommended next steps
- Keep `SRS_IMPLEMENTATION_COMPARISON.md` as canonical mapping. If production-grade multi-user use is required, plan a migration:
  - Add server-side storage for audit logs and shared grade DB.
  - Implement migration tool to import localStorage data into DB.
  - Harden API key handling for Gemini (server-side proxy recommended).
- Add CI and tests to lock calculation engine correctness during migration.

Estimated effort: Low–Medium (2–5 days depending on migration).
