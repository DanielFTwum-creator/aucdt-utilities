# SashMade Testing Guide

**Version:** 2.0
**Date:** 2026-04-14
**Required React Version:** 19.2.5
**Test Framework:** Playwright (Chromium)

## 1. Overview
The SashMade platform uses Playwright for end-to-end (E2E) testing. All specs are TypeScript files located in `tests/e2e/`. The `/admin/testing` panel provides an interactive in-browser runner for monitoring test execution.

## 2. E2E Test Suite

### 2.1 Test Files
| File | Spec ID | Coverage |
|---|---|---|
| `homepage.test.ts` | E2E-01 | Hero, navigation, kente strip, mood board |
| `shop.test.ts` | E2E-02 | Product grid, colour filters, payment banner |
| `about.test.ts` | E2E-03 | Founder message, team, contact details |
| `ai-studio.test.ts` | E2E-04 | AI Studio tabs and interactions |
| `admin.test.ts` | E2E-05 | Auth guard, login, inventory manager |

### 2.2 Running Tests
**From terminal (requires dev server or auto-started by Playwright):**
```bash
pnpm test:e2e                   # run all specs
pnpm test:e2e:ui                # interactive Playwright UI mode
pnpm test:e2e:report            # open last HTML report
```

**From Admin Console:**
Navigate to `/admin/testing` â†’ click **Run All Tests** or **Rerun** on individual cards.

### 2.3 Configuration
`playwright.config.ts`:
- Base URL: `http://localhost:3000`
- Browser: Chromium (Desktop Chrome)
- Retries: 1
- Screenshots: on failure only
- Reports: `tests/playwright-report/` (HTML), `list` (terminal)
- Web server: `pnpm run dev` auto-started if not running

## 3. Manual Testing Checklist

### 3.1 Public Pages
- [ ] **Home:** Hero loads, mood board images visible, How to Order steps render, WhatsApp link present.
- [ ] **Shop:** All 5 products display (â‚µ prices), colour filters work, sidebar How to Order visible, Payment Options banner renders.
- [ ] **About:** Flyer image loads, founder quote visible, team grid renders, contact links correct.
- [ ] **SPA routing:** Refresh `/shop`, `/about`, `/privacy` â€” no 404.

### 3.2 Admin Console
- [ ] **Auth guard:** Visiting `/admin/dashboard` unauthenticated redirects to `/admin/login`.
- [ ] **Login:** `admin / sashmade2026` succeeds; invalid credentials show error.
- [ ] **Dashboard:** KPI cards and weekly chart render.
- [ ] **Inventory:** Products listed; price edit + stock toggle persists on reload.
- [ ] **Diagnostics:** Health check cards visible.
- [ ] **Testing:** Runner executes; logs display per test; failure screenshot shown when applicable.
- [ ] **Audit Logs:** Login/logout events captured.

### 3.3 Accessibility
- [ ] All nav buttons have `aria-label`.
- [ ] Mobile hamburger has `aria-expanded`.
- [ ] Images have `alt` text.
- [ ] Keyboard: Tab through nav â†’ cart â†’ login without mouse.

## 4. Troubleshooting
- **`Error: No tests found`:** Confirm `testDir: './tests/e2e'` in `playwright.config.ts` and files end in `.test.ts`.
- **Dev server timeout:** Increase `webServer.timeout` in config, or start `pnpm run dev` manually before running tests.
- **Test failures on CI:** Ensure `GEMINI_API_KEY` env var is set; AI Studio tests may fail without it.
