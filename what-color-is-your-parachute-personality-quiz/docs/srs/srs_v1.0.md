# IEEE SRS — What Colour Is Your Parachute? Personality Quiz
**Version:** 1.0.0 (as-built)
**Institution:** Techbridge University College
**Status:** Active

## 1. Introduction
A 3-phase personality quiz based on the *What Colour Is Your Parachute?* framework. Users select trait tokens across two phases, then receive a personalised archetype reveal.

## 2. Scope
Single-page React application. No backend required. State lives in React hooks; no persistence between sessions.

## 3. Functional Requirements
| ID | Requirement |
|---|---|
| FR-1 | Phase 1: user selects from a trait pool (multi-select tokens) |
| FR-2 | Phase 2: user refines selections from chosen set |
| FR-3 | Phase 3: system reveals personality archetype based on selected traits |
| FR-4 | User can restart quiz at any time |
| FR-5 | Admin panel accessible via `#/admin` with password `admin123` |
| FR-6 | Audit log of quiz events stored in localStorage |

## 4. Non-Functional Requirements
- ARIA 100% coverage on all interactive elements
- Responsive: mobile-first Tailwind layout
- React 19.2.4

## 5. Architecture
- **Framework:** Vite + React + TypeScript
- **Styling:** Tailwind CSS 4
- **State:** useState + useCallback
- **Admin:** `#/admin` hash route → AdminLoginModal → AdminDashboard
