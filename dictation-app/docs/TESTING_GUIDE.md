# Dictation App — Testing Guide v1.0

**Document ID:** TUC-ICT-TEST-2026-001  
**Status:** Final  
**Date:** May 31, 2026  
**Version:** 1.0  
**Audience:** QA Engineers & Developers

---

## 1. Overview

This guide covers all testing procedures for the Dictation App, including unit tests, component tests, E2E tests, and manual testing protocols.

---

## 2. Test Infrastructure

### 2.1 Testing Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Cypress | 15.16.0 | E2E Testing |
| TypeScript | 5.0+ | Type Safety |
| ESLint | Latest | Code Quality |
| Prettier | Latest | Code Formatting |
| axe-core | Latest | Accessibility Testing |

### 2.2 Test Structure

```
cypress/
├── e2e/
│   ├── theme.cy.ts          (5 tests)
│   ├── tabs.cy.ts           (7 tests)
│   ├── header.cy.ts         (8 tests)
│   ├── ui-components.cy.ts  (15 tests)
│   ├── accessibility.cy.ts  (22 tests)
│   └── responsive.cy.ts     (19 tests)
├── support/
│   └── e2e.ts               (beforeEach hook)
└── fixtures/
    └── auth.json            (test data)
```

---

## 3. Running Tests

### 3.1 Prerequisites

```bash
# Verify Node.js installed
node --version  # 18+

# Verify pnpm installed
pnpm --version

# Install dependencies
cd dictation-app
pnpm install
```

### 3.2 Start Dev Server

**Terminal 1:**

```bash
cd dictation-app
pnpm dev

# Expected output:
# VITE v5.0.0 ready in 234 ms
# ➜ Local: http://localhost:5174/
# ➜ Press q to quit
```

### 3.3 Interactive Testing (Cypress GUI)

**Terminal 2:**

```bash
# Open Cypress GUI
pnpm exec cypress open

# Wait 3-5 seconds for Cypress to launch
# Click a test file to run tests
# Watch tests execute in real-time
```

### 3.4 Headless Testing

```bash
# Run all tests in background
pnpm exec cypress run

# Run specific suite
pnpm exec cypress run --spec "cypress/e2e/theme.cy.ts"

# Run with results file
pnpm exec cypress run --reporter json > test-results.json
```

---

## 4. Test Suites

### 4.1 Theme Tests (5 tests)

**File:** `cypress/e2e/theme.cy.ts`

Tests light/dark mode functionality:
- [ ] Default light mode
- [ ] Theme toggle works
- [ ] Theme persists across refresh
- [ ] Dark mode colors correct
- [ ] Contrast meets WCAG AA

### 4.2 Tabs Tests (7 tests)

**File:** `cypress/e2e/tabs.cy.ts`

Tests tab navigation:
- [ ] Tabs render correctly
- [ ] Click switches active tab
- [ ] Arrow key navigation
- [ ] Tab roles correct
- [ ] Active tab indicated
- [ ] Content updates
- [ ] Keyboard focus visible

### 4.3 Header Tests (8 tests)

**File:** `cypress/e2e/header.cy.ts`

Tests header components:
- [ ] Header renders
- [ ] Title displayed
- [ ] Theme toggle button works
- [ ] Buttons accessible
- [ ] Header sticky positioning
- [ ] Mobile responsive
- [ ] All controls visible
- [ ] Focus indicators visible

### 4.4 UI Components Tests (15 tests)

**File:** `cypress/e2e/ui-components.cy.ts`

Tests individual components:
- [ ] Input field renders
- [ ] Input accepts text
- [ ] Buttons clickable
- [ ] Icons render
- [ ] Layout correct
- [ ] Empty state visible
- [ ] Typography correct
- [ ] Spacing correct
- And more...

### 4.5 Accessibility Tests (22 tests)

**File:** `cypress/e2e/accessibility.cy.ts`

Tests WCAG 2.1 AA compliance:
- [ ] Semantic HTML
- [ ] Heading structure
- [ ] Form labels
- [ ] ARIA attributes
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Color contrast
- [ ] Alt text for images
- [ ] Screen reader support
- And more...

### 4.6 Responsive Design Tests (19 tests)

**File:** `cypress/e2e/responsive.cy.ts`

Tests across breakpoints:
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1280px)
- [ ] Landscape orientation
- [ ] Touch targets (44px minimum)
- [ ] Text readability
- [ ] Layout adapts
- [ ] Navigation accessible
- And more...

---

## 5. Expected Results

### 5.1 Pass Criteria

**Minimum Acceptable:**
- 80%+ pass rate (64+/77 tests)
- No timeout errors
- No critical accessibility failures
- No performance regressions

**Target:**
- 90%+ pass rate (70+/77 tests)
- All critical tests pass
- <500ms response time
- Zero security issues

### 5.2 Results Interpretation

```
✅ PASS: Test completed successfully
❌ FAIL: Test failed (assertion didn't match)
⏭️  SKIP: Test skipped (marked it.skip)
⚠️  WARN: Test passed but with warnings
🕐 TIMEOUT: Test exceeded time limit
```

---

## 6. Debugging Failed Tests

### 6.1 View Test Output

```bash
# In Cypress GUI
- Click failed test
- Review error message
- Check actual vs expected
- Use Cypress inspector

# In terminal
pnpm exec cypress run
# Scroll to failed test
# Read error details
```

### 6.2 Debug Strategies

**Check Selectors:**

```bash
# Are selectors finding elements?
# Use Cypress selector playground
cy.get('button[data-testid="theme-toggle"]')
```

**Check Timing:**

```bash
# Wait for elements
cy.get('.modal').should('be.visible', {timeout: 5000})
```

**Check Console:**

```bash
# View browser console
cy.window().then(win => console.log(win.__CYPRESS_TEST_MODE__))
```

### 6.3 Common Failures

| Error | Cause | Fix |
|-------|-------|-----|
| "Element not found" | Selector wrong | Update selector |
| "Timeout waiting" | Element slow to render | Add cy.wait() |
| "Assertion failed" | Expected value wrong | Check actual value |
| "Network error" | API unavailable | Mock response |

---

## 7. Manual Testing

### 7.1 Browser Testing

Test in each supported browser:

```
Chrome 90+      - Primary (test here first)
Firefox 88+     - Secondary
Safari 14+      - Mac/iOS
Edge 90+        - Windows
```

**Steps:**

1. Open https://dictation-app.techbridge.edu.gh
2. Go through happy path:
   - Click record button
   - Speak into microphone
   - Verify transcription
   - Check polished version
   - Test theme toggle
   - Verify responsive

3. Test accessibility:
   - Navigate with keyboard only
   - Use screen reader (NVDA/JAWS)
   - Check color contrast

### 7.2 Device Testing

Test on devices:

```
Desktop 1280px+
Tablet 768px
Mobile 375px
Landscape orientation
```

---

## 8. Performance Testing

### 8.1 Load Testing

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test application
ab -n 100 -c 10 https://dictation-app.techbridge.edu.gh/

# Expected:
# Requests per second: > 100
# Time per request: < 500ms
```

### 8.2 Lighthouse Testing

```bash
# In Chrome DevTools
1. Open DevTools (F12)
2. Click Lighthouse tab
3. Click "Generate report"
4. Check scores:
   - Performance: 90+
   - Accessibility: 95+
   - Best Practices: 90+
   - SEO: 90+
```

---

## 9. Security Testing

### 9.1 OWASP Top 10

Test for:
- [ ] Injection attacks
- [ ] Broken authentication
- [ ] Sensitive data exposure
- [ ] XML external entities
- [ ] Broken access control
- [ ] Security misconfiguration
- [ ] XSS attacks
- [ ] Insecure deserialization
- [ ] Using components with known vulns
- [ ] Insufficient logging & monitoring

### 9.2 Tools

```bash
# Install OWASP ZAP
# Scan application
# Review findings
# Document issues
```

---

## 10. Test Results Documentation

### 10.1 Template

```
Test Run Report
Date: May 31, 2026
Environment: Production Staging
Total Tests: 77
Passed: 70 (91%)
Failed: 5 (6%)
Skipped: 2 (3%)

Browser: Chrome 91
Device: Desktop 1280px

Critical Issues: 0
High Priority: 2
Medium Priority: 3
Low Priority: 1

Approved for production: YES/NO
```

### 10.2 File Location

```
docs/
├── TEST_RESULTS.md
├── PERFORMANCE_REPORT.md
├── ACCESSIBILITY_AUDIT.md
└── SECURITY_AUDIT.md
```

---

## 11. Regression Testing

After each update:

```bash
# Run full test suite
pnpm exec cypress run

# Verify pass rate > 80%
# Check for new failures
# Compare with previous results
```

---

## 12. Continuous Integration

### 12.1 GitHub Actions Setup

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm build
      - run: pnpm exec cypress run
```

---

## 13. Test Maintenance

### 13.1 Weekly

- Review failed tests
- Update selectors if UI changed
- Check performance metrics
- Verify accessibility standards

### 13.2 Monthly

- Audit test coverage
- Remove obsolete tests
- Add tests for new features
- Update browser versions

### 13.3 Quarterly

- Full test suite review
- Performance optimization
- Security re-assessment
- Tool version updates

---

## 14. Contacts & Support

**Testing Questions:**
- QA Team: qa@techbridge.edu.gh
- DevOps: devops@techbridge.edu.gh

**Tool Documentation:**
- Cypress: https://docs.cypress.io
- Testing Library: https://testing-library.com
- axe DevTools: https://www.deque.com/axe/devtools/

---

**Status:** ✅ Final  
**Last Updated:** May 31, 2026

