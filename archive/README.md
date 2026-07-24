# archive/

Retired app directories, kept in-repo (not deleted) so history and code stay
recoverable. Each entry below is a duplicate or superseded version of a live
app; the canonical replacement is named. To restore one, `git mv` it back to
the repo root.

## Retired apps

| Archived | Superseded by (keeper) | Reason | Retired |
|---|---|---|---|
| `mature-students-exam-app-waec-integrated` | `mature-students-exam-app` | Older snapshot of the same app. The keeper pins newer deps and absorbed the WAEC generator, then added Chart.js/Mermaid diagram rendering the archived copy lacks. Neither was deployed; keeper is catalogued. | 2026-07-24 |
| `fees-comparison-dashboard` | `ghana-university-fees-dashboard` | Same app (byte-identical `metadata.json`). The keeper is a code superset: adds `AuditService`, a `RefreshStatus` view, and more docs. The archived copy only carried leftover scaffolding (`WEB-INF/web.xml`, a stray `AuthGate.jsx`/`index.js` pair). Catalog slug re-pointed to the keeper. Neither was deployed. | 2026-07-24 |
| `techbridge-lead-generator` | `techbridge-lead-generation-infographic` | Same cloned enquiry-form logic (identical message copy, field shape, validation regex). The keeper has typed components, an audit-log UI, docs + e2e, `metadata.json`, and is deployed + catalogued. The archived copy's `migrations/01_init.sql` leads-tracking schema has no equivalent in the keeper; it is preserved here (and in git history) if that schema is ever needed. | 2026-07-24 |

## Not retired (looked like duplicates, verified distinct or held)

- `poster` vs `techbridge-university-college-banner`: same `TechbridgeBanner()`
  artwork, banner is the redesigned superset. **Held, not archived** —
  `poster` is deployed live at `/poster/`, catalogued, and indexed in the
  ai-tools root sitemap. Retiring it needs a deliberate deploy (301
  `/poster/` -> banner + sitemap update), not a repo move.
- `scholarship-bond-portal-v3` vs `techbridge-scholarship-portal-v2`: diverged
  forks (different architectures), both catalogued as separate products. Kept.
- `cinematic-triptych-generator` vs `lumina-triptych-studio`: diverged forks
  (three-panel vs single-composed generator). Both kept.

Source: read-only duplicate audit, 2026-07-24.
