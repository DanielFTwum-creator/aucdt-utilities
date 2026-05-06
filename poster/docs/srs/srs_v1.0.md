# IEEE SRS — Poster
**Version:** 1.0.0 (as-built)
**Institution:** Techbridge University College
**Status:** Active

## 1. Introduction
Poster is a static promotional poster application — renders a branded TUC event/announcement poster as a React component, suitable for print and digital display.

## 2. Functional Requirements
| ID | Requirement |
|---|---|
| FR-1 | Render branded TUC poster from React component |
| FR-2 | Admin panel accessible via `#/admin` (password: `admin123`) |
| FR-3 | Audit log in localStorage |

## 3. Architecture
- **Framework:** Vite + React (JSX, no TypeScript)
- **Styling:** Inline styles (no Tailwind dependency)
- **Admin:** Injected in `src/main.jsx` wrapper
- **Color:** TUC Red `#D0111B`
