# LuxThumb Designer — Testing Guide

**Version:** 1.0  
**Date:** 9 May 2026  
**Framework:** Playwright (Browser Automation)  
**Coverage:** Integration tests for core flows and accessibility  

---

## 1. Overview

LuxThumb Designer uses **Playwright** for end-to-end testing. Tests cover:
- Core UI functionality (form submission, theme switching)
- Admin panel authentication and audit logging
- Export functionality (PNG, PDF, JPG, JSON)
- Accessibility (ARIA labels, focus, keyboard navigation)
- Responsive layout (desktop viewports)

---

## 2. Setup & Installation

### 2.1 Install Playwright
```bash
npm install --save-dev @playwright/test
```

### 2.2 Configure Playwright
File: `playwright.config.ts` (already configured)
```typescript
testDir: './tests',
fullyParallel: true,
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
},
use: {
  baseURL: 'http://localhost:3000',
  trace: 'on-first-retry',
}
```

### 2.3 Verify Installation
```bash
npx playwright --version
# Output: Version X.X.X
```

---

## 3. Running Tests

### 3.1 Run All Tests
```bash
npm test
```
- Starts dev server (port 3000) automatically
- Runs all test files in `tests/` directory
- Headless mode (no browser window visible)
- Generates HTML report in `playwright-report/`

### 3.2 Run Specific Test File
```bash
npm test -- tests/app.spec.ts
```

### 3.3 Run Tests in UI Mode (Recommended for Debugging)
```bash
npm test:ui
```
- Opens Playwright Inspector window
- Click test steps to step through execution
- Inspect DOM, network requests, console logs
- Very useful for understanding failures

### 3.4 Run Tests in Headed Mode (Visible Browser)
```bash
npx playwright test --headed
```
- Opens Chrome browser window
- Watch tests execute in real time
- Useful for visual verification

### 3.5 Run Single Test
```bash
npx playwright test -g "theme switching"
```
- Runs only tests matching "theme switching"

---

## 4. Test Structure

### 4.1 Test File Locations
```
tests/
├── app.spec.ts          (core UI, admin, theme, accessibility tests)
└── export.spec.ts       (export functionality tests)
```

### 4.2 Test Format (Playwright Example)
```typescript
import { test, expect } from '@playwright/test';

test.describe('Core Application', () => {
  test('should display LuxThumb Designer title', async ({ page }) => {
    await page.goto('/');
    const title = page.locator('h1');
    await expect(title).toContainText('LuxThumb Designer');
  });
});
```

---

## 5. Current Test Suite

### 5.1 Core Application Tests (`tests/app.spec.ts`)

#### Test: Page Title
```typescript
test('should load with correct page title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/LuxThumb Designer/);
});
```

#### Test: Aspect Ratio Selection
```typescript
test('should apply correct styling to selected aspect ratio', async ({ page }) => {
  await page.goto('/');
  const ratioButton = page.locator('button', { hasText: '4:5' });
  await ratioButton.click();
  await expect(ratioButton).toHaveClass(/border-\[#C9A84C\]/);
});
```

#### Test: Form Input
```typescript
test('should fill brand name input field', async ({ page }) => {
  await page.goto('/');
  const input = page.locator('input[placeholder*="Fancy Homes"]');
  await input.fill('My Brand');
  await expect(input).toHaveValue('My Brand');
});
```

### 5.2 Admin Panel Tests

#### Test: Admin Authentication
```typescript
test('should show audit dashboard after correct password', async ({ page }) => {
  await page.goto('/');
  const adminButton = page.locator('button[aria-label="Open admin panel"]');
  await adminButton.click();
  
  const passwordInput = page.locator('#admin-password');
  await passwordInput.fill('admin123');
  
  const loginButton = page.locator('button', { hasText: 'Login' });
  await loginButton.click();
  
  const dashboard = page.locator('text=Audit Dashboard');
  await expect(dashboard).toBeVisible();
});
```

#### Test: Admin Logout
```typescript
test('should logout from admin panel', async ({ page }) => {
  // ... login first ...
  
  const logoutButton = page.locator('button[aria-label="Logout from admin panel"]');
  await logoutButton.click();
  
  const adminButton = page.locator('button[aria-label="Open admin panel"]');
  await expect(adminButton).toBeVisible();
});
```

### 5.3 Theme Switching Tests

#### Test: Theme Toggle
```typescript
test('should switch to light theme', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityButton = page.locator('button[aria-label*="accessibility"]');
  await accessibilityButton.click();
  
  const lightThemeButton = page.locator('button', { hasText: 'Light' });
  await lightThemeButton.click();
  
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'light');
});
```

#### Test: Theme Persistence
```typescript
test('should persist theme to localStorage and restore on reload', async ({ page }) => {
  await page.goto('/');
  
  // Set theme to light
  await page.locator('button[aria-label*="accessibility"]').click();
  await page.locator('button', { hasText: 'Light' }).click();
  
  // Verify localStorage
  const theme = await page.evaluate(() => localStorage.getItem('luxthumb-theme'));
  expect(theme).toBe('light');
  
  // Reload page and verify theme is restored
  await page.reload();
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'light');
});
```

### 5.4 Accessibility Tests

#### Test: ARIA Labels
```typescript
test('should have aria-label on all control buttons', async ({ page }) => {
  await page.goto('/');
  
  const buttons = page.locator('button[aria-label]');
  const count = await buttons.count();
  expect(count).toBeGreaterThan(0);
});
```

#### Test: Admin Password Input Accessibility
```typescript
test('should have aria-label on admin password input', async ({ page }) => {
  await page.goto('/');
  const adminButton = page.locator('button[aria-label="Open admin panel"]');
  await adminButton.click();
  
  const input = page.locator('#admin-password');
  await expect(input).toHaveAttribute('aria-label', /password/i);
});
```

### 5.5 Export Tests (`tests/export.spec.ts`)

#### Test: PNG Export
```typescript
test('export png does not fail', async ({ page }) => {
  await page.goto('/');
  
  // Fill required field
  await page.getByPlaceholder(/e.g. Confident CEO/).fill('Test Subject');
  
  // Wait for download and verify
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('button', { hasText: 'PNG' }).click()
  ]);
  
  const path = await download.path();
  const stat = fs.statSync(path!);
  expect(stat.size).toBeGreaterThan(100);
});
```

---

## 6. Test Commands Cheat Sheet

| Command | Purpose |
|---|---|
| `npm test` | Run all tests (headless) |
| `npm test:ui` | Run tests in UI mode (interactive) |
| `npx playwright test --headed` | Run tests with visible browser |
| `npx playwright test -g "pattern"` | Run tests matching pattern |
| `npx playwright test tests/app.spec.ts` | Run specific test file |
| `npx playwright test --debug` | Run single test in debug mode |
| `npx playwright codegen http://localhost:3000` | Record test interactions (generate code) |

---

## 7. Manual Testing Checklist

Use this checklist for features not covered by automated tests:

### 7.1 Configuration Input
- [ ] Type in brand name → appears in canvas
- [ ] Upload logo image → appears in canvas top-left
- [ ] Upload background image → appears behind content
- [ ] Adjust background zoom/offset sliders → canvas updates live
- [ ] Upload subject image → appears right side of canvas
- [ ] Adjust subject zoom/offset → canvas updates live
- [ ] Edit headline, subheadline, tagline → canvas updates
- [ ] Add feature icons → appears in canvas

### 7.2 AI Prompt Generation
- [ ] Click "Engage Engine" → shows loading spinner
- [ ] Wait for Gemini API response → prompts appear below canvas
- [ ] Copy Midjourney prompt → text copied to clipboard
- [ ] Copy Imagen 3 prompt → text copied to clipboard
- [ ] Copy Motion Extension → text copied to clipboard
- [ ] Invalid API key → error alert shown (not crash)

### 7.3 Export
- [ ] PNG export → file downloads correctly
- [ ] JPG export → file downloads correctly
- [ ] PDF export → file downloads correctly
- [ ] JSON export → file contains all form data
- [ ] Filename sanitisation → special characters removed

### 7.4 Design History
- [ ] Save design → appears in history list
- [ ] Load design → restores all form inputs
- [ ] Delete design → removed from history
- [ ] Multiple designs → all visible in history list

### 7.5 Admin Panel
- [ ] Admin button visible → click opens login dialog
- [ ] Wrong password → clears input, stays on login
- [ ] Correct password → shows audit dashboard
- [ ] Dashboard stats → totals match logged actions
- [ ] Expand log entry → shows full details
- [ ] Export JSON → downloads audit log file
- [ ] Export CSV → downloads audit log in spreadsheet format
- [ ] Clear all logs → confirmation dialog, then clears
- [ ] Logout → closes admin panel

### 7.6 Accessibility
- [ ] Theme switcher → Dark/Light/High-Contrast work
- [ ] Font size adjuster → Small/Normal/Large/Extra-Large apply
- [ ] Reduced motion toggle → animations stop
- [ ] Keyboard navigation → Tab through all inputs, Enter submits
- [ ] Focus indicators → Visible gold outline on focused elements
- [ ] Screen reader → Page structure readable (h1, labels, descriptions)

### 7.7 Responsive Design
- [ ] Desktop (1920×1080) → layout optimal
- [ ] Tablet (1024×1366, iPad) → sidebar collapses or scales
- [ ] Mobile (375×667, iPhone) → not required, but doesn't crash

---

## 8. Debugging Failed Tests

### 8.1 Enable Debug Mode
```bash
npx playwright test --debug
```
- Launches test in debug mode
- Inspector window shows each step
- Inspect page DOM, network, console logs

### 8.2 View Test Report
After test run:
```bash
npx playwright show-report
```
- Opens HTML report in browser
- Click failed test to see screenshot, trace, logs

### 8.3 Common Failures

| Error | Likely Cause | Solution |
|---|---|---|
| `Timeout waiting for locator` | Element not found on page | Verify selector is correct; check page loaded |
| `Expected toHaveValue('...')` but got `undefined` | Input not filled | Add `await page.waitForLoadState()` |
| `API key error (401)` | Invalid Gemini API key in `.env` | Update `.env.local` with valid key |
| `Theme not persisting` | LocalStorage not set | Check theme.css is imported; verify localStorage getter/setter |

### 8.4 Check Console Logs
```bash
npx playwright test --reporter=list
```
- Verbose output with console logs from browser
- Search for error messages from app

---

## 9. CI/CD Integration

### 9.1 GitHub Actions (Example)
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v2
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### 9.2 Local Pre-Commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

---

## 10. Best Practices

1. **Test Isolation:** Each test should be independent (no shared state)
2. **Explicit Waits:** Use `waitForLoadState()`, `waitForEvent()` instead of `sleep()`
3. **Descriptive Names:** Test names should clearly state what they verify
4. **Fast Feedback:** Run quick tests locally before pushing (use `-g` for pattern matching)
5. **Visual Debugging:** Use `page.screenshot()` to capture state during test
6. **Error Messages:** Add context to assertions: `expect(x).toBe(y, 'reason why')`
7. **Headless Efficiency:** Run headless in CI; use headed/UI mode only for debugging

---

## 11. Adding New Tests

### 11.1 Test Template
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something specific', async ({ page }) => {
    // Arrange: Set up page state
    await page.goto('/');
    
    // Act: Perform user action
    await page.locator('button').click();
    
    // Assert: Verify result
    await expect(page.locator('div')).toContainText('Success');
  });
});
```

### 11.2 Common Selectors
```typescript
// By text
page.locator('button', { hasText: 'Login' });

// By placeholder
page.getByPlaceholder('Enter email');

// By aria-label
page.locator('[aria-label="Close"]');

// By test ID (add data-testid="..." to HTML)
page.locator('[data-testid="admin-button"]');

// By CSS class
page.locator('.btn-primary');

// By ID
page.locator('#my-input');
```

---

## 12. Additional Resources

- **Playwright Docs:** https://playwright.dev/
- **SRS:** `docs/TUC-ICT-SRS-2026-LUXTHUMB.md`
- **Admin Guide:** `docs/ADMIN_GUIDE.md`
- **Deployment:** `docs/DEPLOYMENT_GUIDE.md`

---

**Test Owner:** Development Team  
**Last Updated:** 9 May 2026  
**Maintenance:** Add tests for new features before merge
