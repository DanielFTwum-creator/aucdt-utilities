# AUCDT Analytics Dashboard - Testing Guide

**Document Version:** 1.0  
**Last Updated:** January 15, 2026  
**Audience:** QA Engineers, Developers, Test Managers

---

## Table of Contents

1. [Overview](#overview)
2. [Unit Testing](#unit-testing)
3. [End-to-End Testing](#end-to-end-testing)
4. [Interactive Testing](#interactive-testing)
5. [Test Scenarios](#test-scenarios)
6. [Accessibility Testing](#accessibility-testing)
7. [Performance Testing](#performance-testing)
8. [Test Coverage](#test-coverage)
9. [Reporting & Metrics](#reporting--metrics)

---

## Overview

The AUCDT Analytics Dashboard employs a comprehensive multi-layered testing strategy:

| Test Type | Tool | Location | Command |
|-----------|------|----------|---------|
| Unit Tests | Vitest | `src/**/*.test.tsx` | `pnpm test` |
| E2E Tests | Playwright | `e2e/tests/` | `pnpm test:e2e` |
| Interactive Tests | Built-in | Testing Tab | In-dashboard |
| Accessibility | Axe, Manual | Testing Tab | Via dashboard |

---

## Unit Testing

### Overview

Unit tests verify individual components and functions work correctly in isolation.

**Framework:** Vitest  
**Coverage Target:** > 70%  
**Location:** Tests alongside component files (`.test.tsx` files)

### Running Unit Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode (reload on file changes)
pnpm test --watch

# Run specific test file
pnpm test src/components/EnhancedDashboard.test.tsx

# Run with coverage report
pnpm test --coverage

# Run tests once (CI mode)
pnpm test:unit
```

### Test Structure

```typescript
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EnhancedDashboard } from './EnhancedDashboard';

test('renders dashboard title', () => {
  render(<EnhancedDashboard />);
  const title = screen.getByText(/AUCDT Registration Funnel/i);
  expect(title).toBeInTheDocument();
});

test('loads and displays data', async () => {
  render(<EnhancedDashboard />);
  // Wait for data to load
  const element = await screen.findByText(/Overview/i);
  expect(element).toBeVisible();
});
```

### Writing New Tests

**Best Practices:**

1. **Test Behavior, Not Implementation**
   ```typescript
   // ✓ Good: Tests what user sees
   expect(screen.getByText('Export')).toBeVisible();
   
   // ✗ Bad: Tests internal implementation
   expect(component.state.isVisible).toBe(true);
   ```

2. **Use Descriptive Test Names**
   ```typescript
   // ✓ Good
   test('displays error message when data fails to load');
   
   // ✗ Bad
   test('error');
   ```

3. **Arrange-Act-Assert Pattern**
   ```typescript
   test('filter works correctly', () => {
     // Arrange: set up test data
     const testData = { /* ... */ };
     
     // Act: perform action
     render(<Dashboard data={testData} />);
     userEvent.click(screen.getByRole('button', { name: /filter/i }));
     
     // Assert: verify result
     expect(screen.getByText('Filtered Results')).toBeVisible();
   });
   ```

### Coverage Reports

View coverage after running tests:

```bash
pnpm test --coverage
```

**Coverage Results:**
- **Statements:** Percentage of code statements executed
- **Branches:** Percentage of conditional branches executed
- **Functions:** Percentage of functions called
- **Lines:** Percentage of lines executed

**Target Metrics:**
- Overall: > 70%
- Critical components: > 80%
- Utilities: > 85%

---

## End-to-End Testing

### Overview

E2E tests simulate real user interactions with the complete application.

**Framework:** Playwright  
**Coverage Target:** All major user flows  
**Location:** `e2e/tests/`

### Running E2E Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run with UI mode (interactive)
pnpm test:e2e:ui

# Run in headed mode (see browser)
pnpm test:e2e:headed

# Run specific test file
pnpm test:e2e e2e/tests/dashboard.spec.ts

# Run single test
pnpm test:e2e --grep "Dashboard Load Test"

# Debug mode
pnpm test:e2e --debug
```

### E2E Test Structure

```typescript
import { test, expect } from '@playwright/test';

test('user can navigate dashboard tabs', async ({ page }) => {
  // Navigate to application
  await page.goto('http://localhost:5173');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Click Overview tab
  await page.click('button:has-text("Overview")');
  
  // Verify Overview content is visible
  await expect(page.locator('text=Overview')).toBeVisible();
  
  // Click Trends tab
  await page.click('button:has-text("Trends")');
  
  // Verify Trends content is visible
  await expect(page.locator('canvas')).toBeVisible();
});
```

### Available E2E Tests

**Current Test Suite:**

1. **Dashboard Load Test**
   - Verifies page loads successfully
   - Checks header and navigation presence

2. **Tab Navigation Test**
   - Tests all tab transitions
   - Verifies content updates

3. **Filter Functionality Test**
   - Tests region/location filtering
   - Verifies data updates after filtering

4. **Export Functionality Test**
   - Tests CSV/JSON export
   - Verifies file download

5. **Admin Panel Test**
   - Tests admin login modal
   - Verifies authentication flow

6. **Theme Toggle Test**
   - Tests theme switching
   - Verifies CSS changes

7. **Responsive Design Test**
   - Tests mobile viewports
   - Verifies layout responsiveness

8. **Chart Rendering Test**
   - Tests chart generation
   - Verifies data visualization

### Writing E2E Tests

**Selectors to Use:**

```typescript
// By text (most reliable for user-facing elements)
page.click('button:has-text("Export")');

// By role (accessible way)
page.click('role=button[name="Export"]');

// By test ID (most reliable for testing)
page.click('[data-testid="export-button"]');

// By CSS selector (less reliable)
page.click('.export-btn');
```

**Common Actions:**

```typescript
// Navigation
await page.goto('http://localhost:5173');

// Clicking
await page.click('button');

// Typing text
await page.fill('input[type="password"]', 'password123');

// Selecting from dropdown
await page.selectOption('select', 'option-value');

// Waiting
await page.waitForLoadState('networkidle');
await page.waitForSelector('canvas');
await page.waitForTimeout(1000);

// Screenshots
await page.screenshot({ path: 'screenshot.png' });
```

---

## Interactive Testing

### Built-in Test Tab

The dashboard includes a built-in Testing tab for real-time testing.

### Accessing Interactive Tests

1. Open AUCDT Analytics Dashboard
2. Navigate to "Testing" tab
3. Click "Run All Tests"
4. View results in real-time

### Test Categories

1. **Component Tests**
   - UI element rendering
   - Component interaction
   - State management

2. **Data Tests**
   - Data loading
   - Data filtering
   - Data transformation

3. **Functionality Tests**
   - Tab navigation
   - Export operations
   - Admin operations

4. **Accessibility Tests**
   - Keyboard navigation
   - ARIA labels
   - Color contrast

5. **Performance Tests**
   - Load time
   - Render time
   - Memory usage

### Taking Screenshots

To capture dashboard state for testing:

1. Click "Screenshot" button in Testing tab
2. Screenshot is captured and displayed
3. Can be used for visual regression testing
4. Useful for documentation

### Exporting Test Results

```bash
# Export as JSON
Click "Export JSON" in Testing tab

# Export as CSV
Click "Export CSV" in Testing tab

# Results include:
# - Test name
# - Status (passed/failed)
# - Duration
# - Error message (if failed)
```

---

## Test Scenarios

### Critical User Journeys

#### Scenario 1: View Dashboard Analytics

**Steps:**
1. Open application
2. View Overview tab
3. Observe key metrics and charts
4. Navigate to Trends tab
5. View trend visualizations

**Expected Results:**
- Dashboard loads without errors
- All data displays correctly
- Charts render properly
- Tab switching works smoothly

#### Scenario 2: Export Data

**Steps:**
1. Open application
2. Navigate to Export tab
3. Select export format (CSV or JSON)
4. Click export button
5. File downloads

**Expected Results:**
- File downloads successfully
- File format is correct
- Data is complete
- Anonymization preserved

#### Scenario 3: Admin Access

**Steps:**
1. Click Admin button
2. Enter password
3. Navigate admin tabs
4. View audit logs
5. Logout

**Expected Results:**
- Login modal appears
- Correct password grants access
- Admin panel displays
- Audit logs show activity
- Logout ends session

#### Scenario 4: Change Theme

**Steps:**
1. Click theme toggle button (Light/Dark/High-contrast)
2. Application refreshes with new theme
3. Switch back to original theme

**Expected Results:**
- Theme changes immediately
- All components update colors
- Preference is persisted
- Works across page reloads

#### Scenario 5: View Demographics

**Steps:**
1. Navigate to Demographics tab
2. Observe regional distribution
3. View international metrics
4. Check diversity indices

**Expected Results:**
- Data displays correctly
- All regions shown
- International/domestic breakdown visible
- Metrics are accurate

---

## Accessibility Testing

### WCAG 2.1 AA Compliance

Target standard: WCAG 2.1 Level AA

**Key Areas:**

1. **Perceivable**
   - Text alternatives for images
   - Proper color contrast (4.5:1 for normal text)
   - Resizable text
   - No seizure-inducing animations

2. **Operable**
   - Keyboard navigation support
   - Sufficient time for interactions
   - No keyboard traps
   - Accessible names for controls

3. **Understandable**
   - Clear and simple language
   - Consistent navigation
   - Error messages and suggestions
   - Labels for form inputs

4. **Robust**
   - Valid HTML
   - Proper ARIA labels
   - Browser compatibility
   - Assistive technology support

### Running Accessibility Tests

**Using Axe DevTools:**

```bash
# Install browser extension
# Chrome: https://chrome.google.com/webstore
# Firefox: https://addons.mozilla.org

# Run automated scan
1. Open dashboard
2. Click Axe Extension
3. Review "Issues" tab
4. Fix flagged items
```

**Manual Testing:**

```bash
# Keyboard Navigation
1. Close mouse/trackpad
2. Use Tab to navigate
3. Use Enter to activate buttons
4. Use Shift+Tab to go back
5. Use arrow keys for lists

# Screen Reader Testing
# Windows: NVDA (free)
# Mac: VoiceOver (built-in)
# Web: WAVE browser extension

# Color Contrast
1. Use WebAIM contrast checker
2. Verify 4.5:1 for normal text
3. Verify 3:1 for large text
```

### Accessibility Testing Checklist

- [ ] All interactive elements have keyboard access
- [ ] Focus is clearly visible
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Form labels are associated with inputs
- [ ] Images have alt text
- [ ] ARIA labels where needed
- [ ] No keyboard traps
- [ ] Tab order is logical
- [ ] Links are distinguishable
- [ ] Errors are announced

---

## Performance Testing

### Load Time Testing

```bash
# Using Chrome DevTools
1. Open dashboard
2. F12 > Performance tab
3. Click record
4. Interact with page
5. Stop recording
6. Analyze results

# Target Metrics:
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.8s
```

### Lighthouse Audit

```bash
# Run Lighthouse
1. Open dashboard
2. F12 > Lighthouse tab
3. Select "Mobile" or "Desktop"
4. Click "Analyze page load"
5. Review scores

# Target Scores:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90
```

### Bundle Size Analysis

```bash
# Analyze bundle
pnpm build

# Check asset sizes
ls -lah dist/assets/

# Target sizes:
- JavaScript: < 500KB
- CSS: < 100KB
- Total: < 1MB
```

---

## Test Coverage

### Current Coverage

Run coverage report:

```bash
pnpm test --coverage
```

**Expected Output:**
```
────────────────────────────────────────────────
File                          Statements | Branches | Functions | Lines
────────────────────────────────────────────────
All files                           75%   |    72%  |    78%    |  76%
────────────────────────────────────────────────
```

### Coverage Goals

| Component Type | Target | Current |
|---|---|---|
| UI Components | 80% | 75% |
| Utilities | 85% | 82% |
| Hooks | 85% | 80% |
| Services | 90% | 88% |
| Overall | 70% | 75% |

### Improving Coverage

1. **Identify Gaps**
   ```bash
   pnpm test --coverage -- --reporter=lcov
   ```

2. **Add Missing Tests**
   - Create `.test.tsx` files for untested components
   - Test error conditions
   - Test edge cases

3. **Review Coverage Report**
   - Look for uncovered lines (red)
   - Add tests for critical paths

---

## Reporting & Metrics

### Test Metrics to Track

| Metric | Target | Frequency |
|--------|--------|-----------|
| Pass Rate | > 95% | Per build |
| Coverage | > 70% | Weekly |
| Avg Test Duration | < 5s | Per build |
| Flaky Tests | 0 | Weekly |
| Bug Detection | Early | Per PR |

### Test Report Template

```markdown
# Test Report - [Date]

## Summary
- Total Tests: 150
- Passed: 145
- Failed: 5
- Skipped: 0
- Pass Rate: 96.7%

## Coverage
- Statements: 75%
- Branches: 72%
- Functions: 78%
- Lines: 76%

## Issues Found
- [ISSUE-001]: Tab navigation fails in Safari
- [ISSUE-002]: Export button disabled on first load
- [ISSUE-003]: Dark theme applies incorrectly

## Recommendations
1. Fix tab navigation in Safari
2. Investigate export button state
3. Review theme loading logic
```

### CI/CD Integration

Testing is automatically run:

1. **On Push:** Linting and unit tests
2. **On PR:** Full test suite
3. **On Merge:** Build and deploy tests

Commands:
```bash
# CI environment
pnpm install
pnpm lint           # Code quality
pnpm test:unit      # Unit tests
pnpm test:e2e       # E2E tests
pnpm build          # Production build
```

---

## Troubleshooting Tests

### Common Test Issues

#### Issue: Tests Timeout

**Cause:** Slow network, long operations

**Solution:**
```typescript
test('slow operation', async () => {
  // Increase timeout
}, { timeout: 10000 });  // 10 seconds
```

#### Issue: Flaky Tests

**Cause:** Timing issues, random failures

**Solution:**
```typescript
// Wait for specific condition
await page.waitForLoadState('networkidle');
await page.waitForSelector('canvas');
await expect(element).toBeVisible({ timeout: 5000 });
```

#### Issue: LocalStorage Errors

**Cause:** Browser storage issues

**Solution:**
```typescript
// Clear before test
beforeEach(async ({ page }) => {
  await page.context().clearCookies();
  await page.evaluate(() => localStorage.clear());
});
```

### Debugging Tests

```bash
# Run with debug output
pnpm test:e2e --debug

# Run single test
pnpm test:e2e --grep "Test Name"

# Generate traces
pnpm test:e2e --trace on

# View traces
npx playwright show-trace trace.zip
```

---

## Test Maintenance

### Regular Tasks

**Daily:**
- Review test failures
- Fix broken tests immediately

**Weekly:**
- Update test data
- Review test coverage
- Remove flaky tests

**Monthly:**
- Audit test effectiveness
- Update testing tools
- Review performance benchmarks

---

**Document End**

---

**Version Control:**

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-15 | Initial testing guide |

**Next Review:** Q2 2026
