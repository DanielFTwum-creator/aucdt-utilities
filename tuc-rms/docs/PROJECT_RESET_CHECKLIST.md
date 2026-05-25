# TUC RMS — Project Reset Checklist (6-Phase Blueprint)

> **Status:** PHASE 1 COMPLETE ✅  
> **Date Started:** May 25, 2026  
> **Target Completion:** May 28, 2026

---

## PHASE 1: FOUNDATION ✅

### TypeScript Setup
- [x] Created `frontend/tsconfig.json` (React 19 + Vite target)
- [x] Created `frontend/tsconfig.node.json`
- [x] Converted `frontend/vite.config.js` → `vite.config.ts`
- [x] Updated `frontend/package.json`:
  - [x] Added `"typescript": "^5.6.0"`
  - [x] Added `"@types/node": "^20.0.0"`
  - [x] Verified `@types/react` & `@types/react-dom` present

### JSX → TSX Migration (13 files)
- [x] `frontend/src/main.jsx` → `main.tsx` (with root element check)
- [x] `frontend/src/App.jsx` → `App.tsx` (React.FC + ProtectedRouteProps interface)
- [x] `frontend/src/context/AuthContext.jsx` → `AuthContext.tsx`:
  - [x] User interface with id, email, name, role
  - [x] AuthContextValue interface
  - [x] useAuth hook with context check
  - [x] Session timeout logic (25-min warning, 30-min logout)
- [x] `frontend/src/components/Layout.tsx`:
  - [x] Notification interface
  - [x] useAuth + useAuth types
  - [x] ARIA labels on navigation + banner
  - [x] Session timeout warning banner
- [x] `frontend/src/pages/Login.tsx` (FormEvent type)
- [x] `frontend/src/pages/Dashboard.tsx` (StatCard interface, user.name fix)
- [x] `frontend/src/pages/ChangePassword.tsx` (PasswordForm interface)
- [x] `frontend/src/pages/AuditLog.tsx` (AuditEntry interface, table a11y)
- [x] `frontend/src/pages/Courses.tsx` (CourseForm, Course, Department, Programme interfaces)
- [x] `frontend/src/pages/EnterScores.tsx` (TSX copy, functional)
- [x] `frontend/src/pages/ApproveResults.tsx` (TSX copy, functional)
- [x] `frontend/src/pages/Students.tsx` (TSX copy, functional)
- [x] `frontend/src/pages/Transcripts.tsx` (TSX copy, functional)
- [x] `frontend/src/pages/Reports.tsx` (TSX copy, functional)
- [x] `frontend/src/pages/Users.tsx` (TSX copy, functional)

### Database Password Hashes
- [x] Read `backend/database.sql`
- [x] Generated bcrypt hash for "password": `$2b$10$GRgQc59gybQp.QHhvGmIm.heLMROupzyY9OooB1kzeTz9lBB55822`
- [x] Replaced all 16 seed user password_hash values with correct hash

### SRS v3.0 Complete Rewrite
- [x] Created `docs/TUC-ICT-SRS-2026-001-TUC-RMS-v3.0.md` (IEEE 830/29148 format):
  - [x] Header: Document ID, Version 3.0, Status "ACTIVE DEVELOPMENT", Date 2026-05-25
  - [x] Section 1: Introduction + Scope (Capacitor, theme switching, audit, testing)
  - [x] Section 2: System Architecture (React 19, Express 5, MySQL, Capacitor bridge)
  - [x] Section 3: Functional Requirements (12 FRs: auth, security, results, student, course, transcript, UI, test, mobile)
  - [x] Section 4: Non-Functional Requirements (response time, uptime, TypeScript, a11y, rate limit, session TTL)
  - [x] Section 5: Database Schema (10 tables with relationships)
  - [x] Section 6: API Endpoints (expanded: health, results, students, courses, users, test)
  - [x] Section 7: Testing Strategy (25+ Playwright tests across 5 suites)
  - [x] Section 8: Security & Compliance (JWT, bcryptjs, rate limiting, audit, GDPR/CCPA/GDPA)
  - [x] Section 9: Deployment Configuration (env vars, Docker Compose, build scripts)
  - [x] Section 10: Revision History (v1.0, v2.0, v2.1, v3.0)
  - [x] Section 11: Diagrams (references to architecture.svg, erd.svg)
  - [x] Section 12: Acceptance Criteria (build, functionality, testing, a11y, security, deployment)
  - [x] Section 13: Sign-off (prepared by, status, next review)

### Project Reset Checklist
- [x] Created `docs/PROJECT_RESET_CHECKLIST.md` (this file)

---

## PHASE 2: SECURITY & UI — TODO

### Backend Dependencies
- [ ] Add `"express-rate-limit": "^7.5.0"` to `backend/package.json`
- [ ] Run `cd backend && npm install` (or mock node install)

### Audit Middleware
- [ ] Create `backend/middleware/index.js`:
  - [ ] `auditMiddleware` wrapping res.json()
  - [ ] Log all authenticated POST/PUT/DELETE to `audit_log` table
  - [ ] Capture: user_id, action, details, ip_address, created_at
  - [ ] Errors swallowed (never block response)
- [ ] Mount in `backend/server.js` (after express.json())
- [ ] Mount in `backend/server-production.js` (same)

### Rate Limiting
- [ ] Update `backend/server.js`:
  - [ ] Import express-rate-limit
  - [ ] Create `loginLimiter` (5 req / 15 min)
  - [ ] Apply to `POST /api/auth/login`
- [ ] Update `backend/server-production.js` (same changes)

### Admin Secondary Auth Endpoint
- [ ] Update `backend/routes/auth.js`:
  - [ ] Add `POST /api/auth/verify-admin` endpoint
  - [ ] Require registrar role
  - [ ] bcryptjs.compare(password, user.password_hash)

### Frontend TypeScript Components (Theme + Admin Confirm)
- [ ] Create `frontend/src/context/ThemeContext.tsx`:
  - [ ] useTheme hook
  - [ ] ThemeProvider component
  - [ ] Persist theme to localStorage ("light", "dark", "high-contrast")
  - [ ] Apply via `document.documentElement.setAttribute('data-theme', ...)`
- [ ] Create `frontend/src/components/ThemeToggle.tsx`:
  - [ ] Cycles light → dark → high-contrast
  - [ ] aria-label on button
- [ ] Create `frontend/src/components/ConfirmAdminAction.tsx`:
  - [ ] Modal for password re-entry
  - [ ] Calls `POST /api/auth/verify-admin`
  - [ ] Wraps destructive actions (password reset, user deactivate, score reject)

### CSS Theme Switching
- [ ] Update `frontend/src/index.css`:
  - [ ] Add `[data-theme="dark"]` block with dark colour variables
  - [ ] Add `[data-theme="high-contrast"]` block with bold colours
  - [ ] Define semantic variables: --card-bg, --topbar-bg, --input-bg, --hover-bg
  - [ ] Update key selectors (.card, .topbar, .modal, .form-control, tbody tr:hover)
  - [ ] Add `:focus-visible` ring styles
  - [ ] Add `.skip-link` class

### HTML Setup
- [ ] Update `frontend/index.html`:
  - [ ] Add `<a href="#main-content" class="skip-link">Skip to main content</a>` as first child of body
  - [ ] Add FOSC-prevention inline script: `document.documentElement.setAttribute('data-theme', localStorage.getItem('tuc_theme')||'')`
  - [ ] Update `<title>` to "TUC Results Management System"

### Update App.tsx
- [ ] Wrap `<AuthProvider>` with `<ThemeProvider>`
- [ ] Add TestRunner route (registrar only, `/test-runner`)

### Update AuthContext.tsx
- [ ] Already done in Phase 1: inactivity tracking (25-min warning, 30-min logout)
- [ ] Export `showTimeoutWarning` & `dismissTimeoutWarning`

### Update Layout.tsx
- [ ] Add full ARIA attributes:
  - [ ] `role="navigation"` on sidebar
  - [ ] `role="banner"` on header
  - [ ] `role="main" id="main-content"` on main
  - [ ] `aria-label` / `aria-expanded` on notification bell
  - [ ] `aria-label="Sign out"` on logout
- [ ] Import & render `<ThemeToggle />` in topbar-right
- [ ] Add session timeout warning banner:
  - [ ] `role="alert" aria-live="assertive"`
  - [ ] Show when `showTimeoutWarning === true`
  - [ ] Dismiss button calls `dismissTimeoutWarning()`
- [ ] Add Test Runner nav link (registrar only)

### Update Pages (ARIA + Modals)
- [ ] Update `frontend/src/pages/Users.tsx`:
  - [ ] Wrap user deactivation & password reset in `<ConfirmAdminAction>`
- [ ] Update `frontend/src/pages/ApproveResults.tsx`:
  - [ ] Wrap Reject action in `<ConfirmAdminAction>`
- [ ] Update `frontend/src/pages/Students.tsx` (A11y):
  - [ ] Modal: `role="dialog" aria-modal="true" aria-labelledby="modal-title"`
  - [ ] Modal title: `<h2 id="modal-title">`
  - [ ] Close button: `aria-label="Close dialog"`
  - [ ] Focus trap on modal open/close
  - [ ] Table: `role="table" aria-label="..."`, `<th scope="col">`, spinners `role="status" aria-live="polite"`
- [ ] Update `frontend/src/pages/Courses.tsx` (A11y):
  - [ ] Modal ARIA (dialog, title, close label)
  - [ ] Table ARIA (role, labels, scope)
- [ ] Update `frontend/src/pages/ApproveResults.tsx` (A11y):
  - [ ] Modal ARIA
  - [ ] Table ARIA
- [ ] Update all pages: focus trap + semantic HTML

---

## PHASE 3: TESTING — TODO

### Root Playwright Config
- [ ] Create `package.json` at root with Playwright scripts:
  - [ ] `"test": "playwright test"`
  - [ ] `"test:ui": "playwright test --ui"`
  - [ ] `"test:report": "playwright show-report"`
- [ ] Create `playwright.config.js`:
  - [ ] testDir: `./tests`
  - [ ] baseURL: `http://localhost:5173`
  - [ ] chromium only
  - [ ] webServer arrays for frontend + backend

### Test Files (25+ tests)
- [ ] Create `tests/auth.spec.js` (6 tests):
  - [ ] Login page displays
  - [ ] Invalid credentials error
  - [ ] Rate limiting (5 bad attempts)
  - [ ] Successful registrar login + redirect
  - [ ] Logout clears token
  - [ ] Unauthenticated redirect to login
- [ ] Create `tests/admin-workflows.spec.js` (10 tests):
  - [ ] Dashboard loads stats
  - [ ] Users table renders
  - [ ] Add-user modal workflow
  - [ ] Edit/cancel user
  - [ ] Password reset modal
  - [ ] Audit log page loads
  - [ ] Approve-results page loads
  - [ ] Theme cycle: light → dark → high-contrast
  - [ ] Check `[data-theme]` attribute per cycle
  - [ ] Notifications bell badge updates
- [ ] Create `tests/lecturer-workflows.spec.js` (4 tests):
  - [ ] Lecturer login
  - [ ] Courses page (no "Add Course" button)
  - [ ] Enter scores navigation
  - [ ] Save draft scores
- [ ] Create `tests/health-check.spec.js` (2 tests):
  - [ ] `GET /api/health` returns `status: ok`
  - [ ] `GET /api/health/full` returns DB status + memory fields
- [ ] Create `tests/accessibility.spec.js` (3 tests):
  - [ ] Skip link present + focusable
  - [ ] Modal focus trap (focus remains in modal)
  - [ ] Login page axe audit (requires `@axe-core/playwright`)

### Backend Health Check Expansion
- [ ] Update `backend/server.js`:
  - [ ] Expand `GET /api/health` with uptime, timestamp
  - [ ] Add `GET /api/health/full` with DB ping, memory usage
  - [ ] Import `const db = require('./db')` (if not present)
- [ ] Update `backend/server-production.js` (same additions)

### Test Runner Backend
- [ ] Create `backend/routes/test-runner.js`:
  - [ ] SSE endpoint: `GET /api/test/run`
  - [ ] Registrar-only (check auth)
  - [ ] Blocked if NODE_ENV === 'production'
  - [ ] Spawn Playwright subprocess + stream test output
- [ ] Mount in both server.js & server-production.js

### Test Runner Frontend
- [ ] Create `frontend/src/pages/TestRunner.tsx`:
  - [ ] Admin-only page at `/test-runner`
  - [ ] Registrar login gate
  - [ ] Suite list with Run buttons
  - [ ] SSE log panel (connects to `/api/test/run`)
  - [ ] Screenshot gallery (if tests capture images)
  - [ ] Disabled in NODE_ENV=production

---

## PHASE 4: DOCUMENTATION — TODO

### Architecture & ERD Diagrams
- [ ] Create `docs/architecture.svg` (800×600):
  - [ ] User Layer → Plesk/Apache → Frontend + Backend → MySQL
  - [ ] TUC maroon borders, gold arrows
  - [ ] Capacitor mobile on User Layer
- [ ] Create `docs/erd.svg`:
  - [ ] All 10 tables with crow's-foot notation
  - [ ] `results` table highlighted in gold (central entity)
  - [ ] All 13 FK relationships drawn

### Admin Guide
- [ ] Create `docs/ADMIN_GUIDE.md` (11 sections):
  - [ ] 1. User Management (CRUD, roles, deactivation)
  - [ ] 2. Student Management (enroll, edit, status)
  - [ ] 3. Course Management (add, assign lecturers)
  - [ ] 4. Results Workflow (entry, submission, approval)
  - [ ] 5. Audit Log (action codes, filtering)
  - [ ] 6. Notifications (mark read, alerts)
  - [ ] 7. Theme Switching (persistent settings)
  - [ ] 8. Session Management (timeout, warning)
  - [ ] 9. Security Best Practices (passwords, rate limits)
  - [ ] 10. Troubleshooting (common issues)
  - [ ] 11. Contact & Support

### Deployment Guide
- [ ] Create `docs/DEPLOYMENT_GUIDE.md` (11 sections):
  - [ ] 1. SSH Access (Plesk, Ubuntu server)
  - [ ] 2. Environment Variables (setup, secrets)
  - [ ] 3. Frontend Build (`npm run build:prod`, assets)
  - [ ] 4. Apache `.htaccess` (SPA routing)
  - [ ] 5. Deploy Script (`deploy.ps1`, PM2)
  - [ ] 6. PM2 Startup (auto-restart on reboot)
  - [ ] 7. Database Init (schema, seeds, migrations)
  - [ ] 8. Health Checks (endpoints, curl examples)
  - [ ] 9. Rollback (version control, downtime)
  - [ ] 10. Maintenance Mode (static page)
  - [ ] 11. Log Management (PM2, MySQL, Apache)

### Testing Guide
- [ ] Create `docs/TESTING_GUIDE.md` (10 sections):
  - [ ] 1. Playwright Setup (install, config)
  - [ ] 2. Running Tests (all, by suite, --ui, --report)
  - [ ] 3. Test Suite Overview (table: suite, tests, coverage)
  - [ ] 4. Manual API Testing (test-api.ps1 examples)
  - [ ] 5. Interactive Test Runner (`/test-runner` page)
  - [ ] 6. Accessibility Testing (axe, keyboard nav)
  - [ ] 7. CI/CD Integration (GitHub Actions YAML snippet)
  - [ ] 8. Writing Custom Tests (example spec)
  - [ ] 9. Debugging Tests (headed mode, slowdown, traces)
  - [ ] 10. Performance Baseline (response time targets)

---

## PHASE 5: FINALISATION — TODO

### Update SRS with Diagrams
- [ ] Embed SVGs in `docs/TUC-ICT-SRS-2026-001-TUC-RMS-v3.0.md`:
  - [ ] `![Architecture](./architecture.svg)` in Section 2
  - [ ] `![ERD](./erd.svg)` in Section 5
- [ ] Update status to `FINAL`
- [ ] Update revision date to Phase 5 completion date

### Feature Gap Analysis
- [ ] Create `docs/FEATURE_GAP_ANALYSIS.md`:
  - [ ] Table: Req ID | Name | SRS Section | Status | File(s) | Notes
  - [ ] List all 12 FRs (FR-AUTH-001 through FR-MOB-002)
  - [ ] Mark as "Implemented" with file paths (e.g., `AuthContext.tsx`, `backend/middleware/index.js`)
  - [ ] Note any partial implementations or deferred work

### Finalise Docs Directory
- [ ] Confirm final structure:
  ```
  docs/
    TUC-ICT-SRS-2026-001-TUC-RMS-v3.0.md    (Final)
    PROJECT_RESET_CHECKLIST.md
    FEATURE_GAP_ANALYSIS.md
    ADMIN_GUIDE.md
    DEPLOYMENT_GUIDE.md
    TESTING_GUIDE.md
    architecture.svg
    erd.svg
  ```

---

## PHASE 6: APP STORE DEPLOYMENT — TODO

### Frontend Setup
- [ ] Update `frontend/package.json`:
  - [ ] Version → `1.0.0`
  - [ ] Add Capacitor dependencies (core@8.3.3, cli@8.3.3, android@8.3.3, ios@8.3.3)
  - [ ] Add npm scripts:
    - [ ] `"mobile:sync": "cap sync"`
    - [ ] `"mobile:android": "cap open android"`
    - [ ] `"mobile:ios": "cap open ios"`
    - [ ] `"mobile:run:android": "cap run android"`
    - [ ] `"mobile:run:ios": "cap run ios"`

### Capacitor Config
- [ ] Create `frontend/capacitor.config.ts`:
  - [ ] appId: `com.techbridge.tucrms`
  - [ ] appName: `TUC Results`
  - [ ] webDir: `dist`
  - [ ] server hostname: production URL (if local dev, localhost)
  - [ ] iOS/Android background: `#6B0020`

### Privacy Policy
- [ ] Create `frontend/public/privacy.html`:
  - [ ] Standalone HTML (no React)
  - [ ] GDPR/CCPA/GDPA compliant
  - [ ] Sections: intro, data collection, why, retention, rights, sharing, security, cookies, contact
  - [ ] Data controller: TUC ICT Department
  - [ ] Security note: bcryptjs hashing + TLS
  - [ ] GDPA Act 843 reference (Ghana)

### Build & Platforms
- [ ] Run from `frontend/`:
  - [ ] `npm install` (deps + Capacitor)
  - [ ] `npm run build:prod` (Vite production build to dist/)
  - [ ] `npx cap add android` (create Android project)
  - [ ] `npx cap add ios` (create iOS project)
  - [ ] `npx cap sync` (copy web assets)

### App Store Guides
- [ ] Create `docs/APP_STORE_GUIDE.md`:
  - [ ] iOS App Store submission (account, signing, metadata)
  - [ ] Google Play submission (account, signing, metadata)
  - [ ] Screenshots requirements, review timeline
- [ ] Create `docs/MOBILE_BUILD_GUIDE.md`:
  - [ ] Build commands (android, ios)
  - [ ] Debugging (Capacitor CLI, Chrome DevTools)
  - [ ] Device testing (simulator, emulator, real device)
  - [ ] Capacitor sync workflow
- [ ] Create `docs/APP_ICONS_GUIDE.md`:
  - [ ] Required icon sizes (iOS/Android)
  - [ ] `@capacitor/assets` tool commands
  - [ ] Source asset spec: 1024×1024 `resources/icon.png`
  - [ ] Splash screen spec (dimensions, safe area)
- [ ] Create `docs/APPSTORE_READY.md`:
  - [ ] Pre-submission checklist (✅/❌ items)
  - [ ] Timeline estimate (2–4 weeks per platform)

---

## FINAL VERIFICATION

### After All Phases Complete

- [ ] `docker-compose up -d` → all 3 containers healthy
- [ ] `npm test` from root → all Playwright suites ✅ green
- [ ] Visit `http://localhost:5173`, login as registrar, cycle through 3 themes
- [ ] Check `[data-theme]` attribute in DevTools per theme
- [ ] Verify `/test-runner` page loads (registrar), blocked for lecturer
- [ ] `curl http://localhost:5000/api/health/full` → status:ok, DB status, memory
- [ ] Open `docs/TUC-ICT-SRS-2026-001-TUC-RMS-v3.0.md` → version 3.0 Final, SVGs embedded
- [ ] All .tsx files compile with zero TypeScript errors
- [ ] User password reset + deactivate wrapped in ConfirmAdminAction modal
- [ ] Session timeout warning appears at 25 min, logout at 30 min
- [ ] Audit log entries created for all admin actions
- [ ] Rate limiting tested: 6 failed logins → 429 Too Many Requests

---

**Checklist Last Updated:** May 25, 2026  
**Next Milestone:** Phase 2 Security & UI (5–7 days)  
**Estimated Project Completion:** May 31, 2026

