# Master Project Refresh — Progress Tracker

**Started:** April 24, 2026  
**Status:** IN PROGRESS — Phase 1 (conformance fixes) COMPLETE, Phases 2–5 pending for non-conformant projects

---

## Permanent Requirements

| Requirement | Status |
|---|---|
| React = 19.2.4 (no caret, no range) | ✅ ENFORCED across all 274 React projects |
| ZERO broken links (`href="#"`) | ✅ FIXED across all projects |
| All diagnostics in `/admin/*` routes | ✅ Enforced in conformant projects; 10 projects still missing admin |
| ARIA coverage | ✅ Present in 263/274 projects; 11 projects still missing |
| `/docs` folder with SRS + guides + SVG diagrams | ✅ Present in 268/274 projects; 6 projects still missing |
| Gap analysis after each section | ✅ Completed for markai; pending for non-conformant set |

---

## Audit Results (April 24, 2026)

**Total React projects audited:** 274  
**Fully conformant (no gaps):** 241  
**Projects with gaps:** 33

---

## COMPLETED FIXES

### React Version
| Project | Fix |
|---|---|
| `compliance-workflow-dashboard` | Pinned `^19.2.5` → `19.2.4` ✅ |

### Broken Links (`href="#"` → `href="#top"` or `<button>`)
| Project | File(s) Fixed |
|---|---|
| `asanska-university-college` | `components/Footer.tsx`, `components/Header.tsx` ✅ |
| `ckt-utas-modern-website` | `components/Footer.tsx` ✅ |
| `entrainer-landing-page` | `components/Header.tsx`, `components/Hero.tsx` ✅ |
| `lfpaperworks` | `src/components/Footer.tsx` ✅ |
| `omniextract` | `App.tsx` (converted to `<button>`) ✅ |
| `pama-realtor` | `App.tsx`, `components/Footer.tsx` ✅ |
| `remix-muniratu-portfolio` | `src/components/Footer.tsx`, `src/components/Navbar.tsx` ✅ |
| `send-platform-dashboard` | `pages/Executions.tsx` ✅ |
| `techbridge-promo` | `src/components/Hero.tsx` ✅ |
| `techbridge-website-react` | `components/Footer.tsx`, `components/CallToAction.tsx`, `components/Admin.tsx` (converted to `<button>`) ✅ |

### markai (Full 5-Phase Refresh)
| Phase | Status |
|---|---|
| 1 — Foundation (React 19.2.4, SRS v3.1.0) | ✅ COMPLETE |
| 2 — Security (admin auth, ARIA, themes, broken links) | ✅ COMPLETE |
| 3 — Testing (Playwright, /admin/testing) | ✅ COMPLETE |
| 4 — Documentation (4 SVG diagrams, 3 guides, SRS) | ✅ COMPLETE |
| 5 — Final Alignment (SRS sync, /docs, FR-104 Google OAuth) | ✅ COMPLETE |

---

## REMAINING WORK

### Projects Missing `/admin` Route (10 projects)
These projects have no admin route at all and need a password-protected `#/admin` with audit logs and diagnostics.

| Project | Other Gaps |
|---|---|
| `ai-email-drafter` | — |
| `aucdt-quarto-presentation-editor` | — |
| `aucdt-sendmail-api-tester` | — |
| `entrainer-landing-page` | also missing ARIA |
| ~~`impact-ventures-dashboard`~~ | ✅ COMPLETE (admin + ARIA + /docs — April 24, 2026) |
| `lems` | also missing ARIA |
| `poster` | also missing ARIA, /docs |
| `qmd-to-google-slides-converter` | also missing ARIA |
| `thumbnail-generator` | also missing ARIA |
| `what-color-is-your-parachute_-personality-quiz` | also missing ARIA, /docs |

### Projects Missing ARIA (11 projects — non-admin ones only)
| Project | Notes |
|---|---|
| `ai-studio-project-refresh-dashboard` | Has admin, needs aria- attributes added |
| `asanska-fashion-design-brochure` | Has admin, needs aria- attributes added |
| `myvbci-camper-app` | Has admin, needs aria- attributes added |
| `techbridge-eligibility-checker` | Has admin, needs aria- attributes added |
| `tuc-analytics-dashboard` | Has admin, needs aria- attributes added |

### Projects Missing `/docs` (6 projects)
| Project | Notes |
|---|---|
| `bionicskins™` | Has admin + ARIA, just needs /docs |
| ~~`impact-ventures-dashboard`~~ | ✅ COMPLETE |
| `lfpaperworks` | Has admin + ARIA, just needs /docs |
| `poster` | Also missing admin + ARIA |
| `stockpulse` | Has admin + ARIA, just needs /docs |
| `what-color-is-your-parachute_-personality-quiz` | Also missing admin + ARIA |

---

## RESUME INSTRUCTIONS

When resuming, pick up with:

**Step 1:** Add `/admin` route to the 10 missing-admin projects (use the standard pattern from markai: `AdminLoginModal` + `AdminDashboard` + `AdminContext` with audit logging).

**Step 2:** Add ARIA attributes to the 5 aria-only-gap projects.

**Step 3:** Create `/docs` folders (SRS + guides + SVG diagrams) for the 6 missing-docs projects.

**Step 4:** Run the gap analysis script to confirm 100% conformance:
```bash
find /c/Development/aucdt-utilities -maxdepth 2 -name "package.json" ! -path "*/node_modules/*" | xargs grep -l '"react"' 2>/dev/null | xargs -I{} dirname {} | sort | while read dir; do
  name=$(basename "$dir")
  [ "$name" = "aucdt-utilities" ] && continue
  has_admin=$(find "$dir" -maxdepth 3 -name "*.tsx" -o -name "*.ts" 2>/dev/null | grep -v node_modules | xargs grep -li "admin" 2>/dev/null | head -1 | grep -q . && echo yes || echo no)
  has_aria=$(find "$dir" -maxdepth 3 -name "*.tsx" 2>/dev/null | grep -v node_modules | xargs grep -l 'aria-' 2>/dev/null | head -1 | grep -q . && echo yes || echo no)
  has_docs=$([ -d "$dir/docs" ] && echo yes || echo no)
  has_href_hash=$(find "$dir" -maxdepth 3 -name "*.tsx" 2>/dev/null | grep -v node_modules | xargs grep -l 'href="#"' 2>/dev/null | head -1 | grep -q . && echo YES || echo no)
  react_ver=$(grep '"react"' "$dir/package.json" 2>/dev/null | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+' | head -1)
  echo "$name|react:$react_ver|admin:$has_admin|aria:$has_aria|docs:$has_docs|broken_links:$has_href_hash"
done | grep -E "admin:no|aria:no|docs:no|broken_links:YES|react:(?!19.2.4)"
```
Expected output: **empty** (zero gaps).
