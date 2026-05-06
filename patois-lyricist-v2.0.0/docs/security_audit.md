# Security Audit: Patois Lyricist v2.0.0

## 1. Authentication
- Currently uses local state/localStorage.
- Gap: Not truly secure against sophisticated attacks. Need better session management.

## 2. Authorization
- AdminPanel exists but relies on simple password logic. 
- Gap: Need role-based authorization check in `App.tsx` state management.

## 3. Accessibility
- Need to audit WCAG AA pass/fail.

## 4. Diagnostics
- Gap: `/admin/diagnostics` route/view needs to display system health metrics.
