# TUC RMS Testing Guide

**Document ID:** TUC-RMS-TEST-2026-001  
**Version:** 3.0  
**Last Updated:** 25 May 2026  
**Audience:** QA Engineers, Developers, Release Managers

## Table of Contents
1. [Test Infrastructure](#test-infrastructure)
2. [Prerequisites](#prerequisites)
3. [Running Tests](#running-tests)
4. [Test Suites](#test-suites)
5. [Manual API Testing](#manual-api-testing)
6. [Interactive Test Runner](#interactive-test-runner)
7. [Accessibility Testing](#accessibility-testing)
8. [CI/CD Integration](#cicd-integration)
9. [Writing New Tests](#writing-new-tests)
10. [Known Issues](#known-issues)

---

## Test Infrastructure

### Framework: Playwright 1.49.0

**Why Playwright?**
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Headless and headed modes
- Built-in screenshots and video recording
- SSE event streaming for live log display
- Excellent TypeScript support

### Test Files Location

```
tuc-rms/
├── tests/
│   ├── auth.spec.js
│   ├── admin-workflows.spec.js
│   ├── lecturer-workflows.spec.js
│   ├── health-check.spec.js
│   ├── accessibility.spec.js
│   └── report/  (generated)
├── package.json
└── playwright.config.js
```

### Coverage

**Total Test Count:** 25+ E2E tests
- **Authentication:** 6 tests
- **Admin Workflows:** 10 tests
- **Lecturer Workflows:** 4 tests
- **Health Checks:** 2 tests
- **Accessibility:** 3+ tests

---

## Prerequisites

### System Requirements

- Node.js 18.x or 20.x LTS
- npm or pnpm
- Both frontend and backend servers must be running:
  - Frontend: http://localhost:5173
  - Backend: http://localhost:5000

### Installation

```bash
cd tuc-rms
npm install  # Install root-level dependencies

# or with pnpm
pnpm install
```

### Verify Installation

```bash
npx playwright --version
# Output: Version 1.49.0 (or higher)
```

---

## Running Tests

### Run All Tests

```bash
npm test
# or
npx playwright test
```

**Output:**
```
✓ auth.spec.js (6 tests) — 45s
✓ admin-workflows.spec.js (10 tests) — 2m 30s
✓ lecturer-workflows.spec.js (4 tests) — 1m 15s
✓ health-check.spec.js (2 tests) — 10s
✓ accessibility.spec.js (3 tests) — 30s

Passed: 25 | Failed: 0 | Skipped: 0
Total time: 5m 10s
```

### Run a Specific Test Suite

```bash
npx playwright test tests/auth.spec.js
npx playwright test tests/admin-workflows.spec.js
```

### Run a Single Test

```bash
npx playwright test tests/auth.spec.js -g "should login successfully"
```

### Run Tests in UI Mode (Recommended for Development)

```bash
npm run test:ui
```

This opens an interactive browser where you can:
- Watch tests run in real-time
- Pause execution
- Step through each test
- Inspect DOM elements
- View test source code

### View Test Report

```bash
npm run test:report
```

Opens `tests/report/index.html` in your browser, showing:
- Pass/fail status for each test
- Screenshots of failures
- Video recordings (if enabled)
- Execution time

### Advanced Options

```bash
# Run with specific browser
npx playwright test --project=chromium

# Run with retries disabled
npx playwright test --retries=0

# Debug mode (step through each action)
npx playwright test --debug

# Verbose output
npx playwright test --verbose

# Update snapshots (if used)
npx playwright test --update-snapshots
```

---

## Test Suites

### 1. Authentication (auth.spec.js)

**Purpose:** Verify login flow, security, and rate limiting.

| Test | Description | Duration |
|---|---|---|
| Display login page | Checks all form elements are visible | 3s |
| Invalid credentials | Rejects wrong email/password | 5s |
| Rate limiting | 5 failed attempts blocks further attempts | 10s |
| Successful login | Registrar login redirects to dashboard | 8s |
| Logout | Session clears and redirects to login | 5s |
| Unauthorized redirect | Non-authenticated users redirected to login | 3s |

**Example:**
```bash
npx playwright test tests/auth.spec.js -g "should login successfully"
```

### 2. Admin Workflows (admin-workflows.spec.js)

**Purpose:** Test registrar-specific features.

| Test | Description | Duration |
|---|---|---|
| Dashboard stats | Displays student counts, pending results | 5s |
| Users table | Shows all users with edit/reset buttons | 5s |
| Add user modal | Opens form for new user creation | 8s |
| Close modal | Cancel button properly dismisses modal | 3s |
| Reset password modal | Shows confirmation and updates user | 8s |
| Audit log | Displays action history with timestamps | 5s |
| Approve results | Shows pending batches and approval workflow | 10s |
| Light theme | Applies light colour scheme | 3s |
| Dark theme | Applies dark colour scheme | 3s |
| High-contrast theme | Applies WCAG 2.1 AA accessible theme | 3s |
| Notifications bell | Shows notification dropdown | 3s |

### 3. Lecturer Workflows (lecturer-workflows.spec.js)

**Purpose:** Verify lecturer-specific features and restrictions.

| Test | Description | Duration |
|---|---|---|
| Dashboard | Shows "My Courses" section | 5s |
| Courses page | No "Add Course" button visible | 5s |
| Enter scores page | Navigate to score entry form | 5s |
| Save draft scores | Save incomplete scores for later | 8s |

### 4. Health Check (health-check.spec.js)

**Purpose:** Verify API endpoints and system health.

| Test | Description | Duration |
|---|---|---|
| GET /api/health | Basic health status returns OK | 2s |
| GET /api/health/full | Detailed health with database and memory | 3s |

### 5. Accessibility (accessibility.spec.js)

**Purpose:** Ensure WCAG 2.1 AA compliance.

| Test | Description | Duration |
|---|---|---|
| Skip to main content | Link present and functional | 3s |
| Focus trap in modal | Tab order restricted to modal elements | 5s |
| axe audit | Automated accessibility scan of login page | 10s |

---

## Manual API Testing

### Using test-api.ps1

The `test-api.ps1` PowerShell script provides interactive API testing:

```bash
cd tuc-rms
./test-api.ps1
```

**Available Commands:**

```
health        — GET /api/health
health-full   — GET /api/health/full
login         — POST /api/auth/login (prompts for credentials)
users         — GET /api/users (requires auth token)
students      — GET /api/students (requires auth token)
courses       — GET /api/courses (requires auth token)
results       — GET /api/results (requires auth token)
test-runner   — POST /api/test/run (starts test suite)
```

### Using curl

```bash
# Health check
curl https://results.tuc.edu.gh/api/health

# Full health status
curl https://results.tuc.edu.gh/api/health/full

# Login
curl -X POST https://results.tuc.edu.gh/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "registrar@tuc.edu.gh",
    "password": "Admin@123"
  }'

# Get users (with auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://results.tuc.edu.gh/api/users
```

### Using Postman

1. Import the Postman collection (if available): `docs/postman-collection.json`
2. Set base URL to `http://localhost:5000` (local) or `https://results.tuc.edu.gh` (production)
3. Use "Login" request to obtain auth token
4. Copy token to `Authorization` header for subsequent requests

---

## Interactive Test Runner

### Accessing the Test Runner

1. Log in as **registrar** at http://localhost:5173/login
2. Navigate to **Test Runner** (in sidebar, admin-only)
3. Select a test suite from the grid

### Features

**Suite Selection:**
- All Tests (full suite)
- Authentication (6 tests)
- Admin Workflows (10 tests)
- Lecturer Workflows (4 tests)
- Health Check (2 tests)
- Accessibility (3+ tests)

**Live Log Output:**
- Streaming SSE events from backend
- Colour-coded output (info, success, errors)
- Auto-scrolling to latest entry
- Pause/resume capability

**Test Statistics:**
- Passed count
- Failed count
- Total duration

### Example Workflow

1. Click **All Tests** to select full suite
2. Click **Run Tests**
3. Watch logs stream in real-time
4. View final summary: "25 tests passed, 0 failed"
5. Click **Clear Logs** to reset

---

## Accessibility Testing

### Automated Testing with axe-core

The `accessibility.spec.js` suite includes automated scans using axe DevTools:

```javascript
import { injectAxe, checkA11y } from 'axe-playwright';

test('should pass axe accessibility audit', async ({ page }) => {
  await page.goto('/login');
  await injectAxe(page);
  await checkA11y(page, null);
});
```

### Manual WCAG 2.1 AA Testing

1. Open the application in your browser
2. Install **axe DevTools** browser extension
3. Run a full-page scan
4. Check for errors, warnings, and best practices
5. Test with keyboard navigation (Tab key)
6. Test with screen reader (NVDA on Windows, JAWS, or VoiceOver on macOS)

### Key Accessibility Features

- [ ] Skip to main content link
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] ARIA labels on interactive elements
- [ ] Focus indicators visible
- [ ] Modal focus trap
- [ ] Semantic HTML (headings, landmarks)
- [ ] Colour contrast (4.5:1 for normal text)
- [ ] Theme support (Light, Dark, High-Contrast)

---

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_DATABASE: tuc_rms_test
          MYSQL_ROOT_PASSWORD: root
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3
        ports:
          - 3306:3306

    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build frontend
        working-directory: frontend
        run: npm run build:prod
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Start servers
        run: |
          cd backend && npm run dev &
          cd frontend && npm run dev &
          sleep 10
      
      - name: Run tests
        run: npm test
      
      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: tests/report/
```

### GitLab CI Example

Create `.gitlab-ci.yml`:

```yaml
image: node:20

stages:
  - test

test:e2e:
  stage: test
  services:
    - mysql:8.0
  before_script:
    - npm install
    - npx playwright install --with-deps
  script:
    - npm test
  artifacts:
    when: always
    paths:
      - tests/report/
  only:
    - merge_requests
    - main
```

---

## Writing New Tests

### Test File Structure

```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: run before each test
    await page.goto('/login');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    await page.fill('input[type="email"]', 'user@example.com');
    
    // Act
    await page.click('button[type="submit"]');
    
    // Assert
    await expect(page).toHaveURL('/dashboard');
  });
});
```

### Common Assertions

```javascript
// Element visibility
await expect(page.locator('.modal')).toBeVisible();
await expect(page.locator('.modal')).not.toBeVisible();

// Text content
await expect(page.locator('h1')).toContainText('Dashboard');

// Input values
await expect(page.locator('input[type="email"]')).toHaveValue('test@example.com');

// Attributes
await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

// URLs
await expect(page).toHaveURL('**/dashboard');

// Counts
const rows = await page.locator('tbody tr').count();
expect(rows).toBeGreaterThan(0);
```

### Best Practices

1. **Use data attributes for selection:**
   ```javascript
   // ❌ Avoid: too fragile
   await page.click('button:nth-child(3)');
   
   // ✅ Prefer: reliable
   await page.click('[data-testid="submit-button"]');
   ```

2. **Wait for elements explicitly:**
   ```javascript
   // ✅ Good: explicit wait with timeout
   await page.waitForURL('**/dashboard');
   
   // ✅ Good: wait for element visibility
   await expect(page.locator('.modal')).toBeVisible();
   ```

3. **Use meaningful test names:**
   ```javascript
   // ❌ Avoid: vague
   test('should work', ...)
   
   // ✅ Prefer: descriptive
   test('should approve results and update audit log', ...)
   ```

4. **Test user workflows, not implementation:**
   ```javascript
   // ❌ Avoid: testing internals
   test('should call createUser() function', ...)
   
   // ✅ Prefer: user-centric
   test('registrar can add a new user and user receives email', ...)
   ```

---

## Known Issues

### Flaky Tests

**Issue:** `rate-limiting.spec.js` occasionally fails due to timing

**Workaround:**
```javascript
// Increase timeout for rate-limiting test
test('should implement rate limiting', async ({ page }) => {
  // ... test code ...
}, { timeout: 60000 }); // 60 second timeout
```

### Database State

**Issue:** Tests fail if seed data is missing

**Solution:** Ensure `backend/database.sql` is imported before running tests:

```bash
mysql -u tuc_rms_user -p tuc_rms_db < backend/database.sql
```

### Port Conflicts

**Issue:** Tests fail with "EADDRINUSE" error

**Solution:** Kill processes on ports 5000 and 5173:

```bash
# On Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# On macOS/Linux
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

---

## Continuous Improvement

### Test Metrics

Track these metrics over time:

- **Pass rate:** Target 100%
- **Average duration:** Monitor for performance regressions
- **Flakiness:** Tests that occasionally fail (goal: 0%)
- **Code coverage:** Aim for >80% on critical paths

### Adding New Tests

When adding new features:
1. Write test first (TDD approach)
2. Ensure test fails initially
3. Implement feature
4. Test passes
5. Check accessibility compliance

### Test Review Checklist

- [ ] Test has descriptive name
- [ ] Test is independent (no dependencies on other tests)
- [ ] Test uses explicit waits (no `wait()` calls)
- [ ] Test cleans up after itself
- [ ] Test follows naming conventions
- [ ] Test includes both happy and error paths

---

## Support and Escalation

For testing issues or questions:

- **Playwright Documentation:** https://playwright.dev
- **axe DevTools:** https://www.deque.com/axe/devtools/
- **Internal Slack:** #testing-help
- **Email:** ict@tuc.edu.gh

---

**Document Status:** Final — Version 3.0  
**Next Review Date:** 25 May 2027
