# Cypress Test Suite Guide — Dictation App

**Status:** Ready for local testing  
**Coverage:** 60+ test cases across 6 test suites  
**Environment:** Node 18+ required

---

## Setup & Installation

### 1. Install Cypress

```bash
pnpm add -D cypress
```

### 2. Install Tab Navigation Support (optional)

Cypress doesn't natively support Tab key testing. The custom commands in `cypress/support/commands.ts` handle this.

### 3. Verify Dev Server Running

```bash
pnpm dev
```

The app should be running on `http://localhost:5173` (or check `cypress.config.ts` for baseUrl).

---

## Running Tests

### Run All Tests (Interactive Mode)

```bash
pnpm exec cypress open
```

This opens the Cypress test runner. Select a test file and watch it run in real-time.

### Run All Tests (Headless)

```bash
pnpm exec cypress run
```

Runs all tests without the GUI, outputs results to terminal.

### Run Specific Test Suite

```bash
pnpm exec cypress run --spec "cypress/e2e/theme.cy.ts"
pnpm exec cypress run --spec "cypress/e2e/tabs.cy.ts"
pnpm exec cypress run --spec "cypress/e2e/header.cy.ts"
pnpm exec cypress run --spec "cypress/e2e/ui-components.cy.ts"
pnpm exec cypress run --spec "cypress/e2e/accessibility.cy.ts"
pnpm exec cypress run --spec "cypress/e2e/responsive.cy.ts"
```

### Run with Specific Browser

```bash
pnpm exec cypress run --browser chrome
pnpm exec cypress run --browser firefox
pnpm exec cypress run --browser edge
```

### View Test Results

```bash
pnpm exec cypress run --reporter spec
```

---

## Test Suites

### 1. **Theme Management** (`theme.cy.ts`)
**Tests:** Light/dark mode toggle, localStorage persistence, color contrast  
**Key Tests:**
- ✅ Default light mode on load
- ✅ Toggle between light and dark
- ✅ Persistence across page reload
- ✅ All components apply dark mode styles
- ✅ Proper contrast in both modes

**Running:**
```bash
pnpm exec cypress run --spec "cypress/e2e/theme.cy.ts"
```

---

### 2. **Tabs Component** (`tabs.cy.ts`)
**Tests:** Tab rendering, switching, ARIA attributes, keyboard navigation  
**Key Tests:**
- ✅ Both tabs render (Polished Note, Raw Transcript)
- ✅ Default tab is Polished Note
- ✅ Click switches tabs
- ✅ Correct content displayed per tab
- ✅ Arrow keys navigate between tabs
- ✅ Proper ARIA roles and attributes
- ✅ Tab state maintains across interactions

**Running:**
```bash
pnpm exec cypress run --spec "cypress/e2e/tabs.cy.ts"
```

---

### 3. **Header Component** (`header.cy.ts`)
**Tests:** Header rendering, buttons, accessibility, styling  
**Key Tests:**
- ✅ Header displays title "Dictation App"
- ✅ Theme toggle button present
- ✅ Record button present
- ✅ New Note button present (with aria-label)
- ✅ Logout button present
- ✅ Focus ring visible on buttons
- ✅ Sticky positioning
- ✅ Microphone icon renders

**Running:**
```bash
pnpm exec cypress run --spec "cypress/e2e/header.cy.ts"
```

---

### 4. **UI Components & Layout** (`ui-components.cy.ts`)
**Tests:** Title input, empty state, main layout, focus management  
**Key Tests:**
- ✅ Title input accepts text
- ✅ Input has proper styling (light/dark modes)
- ✅ Focus ring on input
- ✅ Empty state displays correctly
- ✅ Empty state has microphone icon
- ✅ Main element has flex and gradient
- ✅ Responsive max-width container
- ✅ Focus order is correct

**Running:**
```bash
pnpm exec cypress run --spec "cypress/e2e/ui-components.cy.ts"
```

---

### 5. **Accessibility (WCAG 2.1 AA)** (`accessibility.cy.ts`)
**Tests:** Semantic HTML, ARIA attributes, keyboard navigation, focus indicators  
**Key Tests:**
- ✅ Semantic `<header>`, `<main>`, `<button>`, `<input>` tags
- ✅ Tab roles and aria-selected attributes
- ✅ Tab aria-controls properly set
- ✅ Icon buttons have aria-label
- ✅ Tab navigation with arrow keys
- ✅ Enter key on buttons
- ✅ Sufficient color contrast
- ✅ 2px focus rings visible
- ✅ Readable font sizes and line heights

**Running:**
```bash
pnpm exec cypress run --spec "cypress/e2e/accessibility.cy.ts"
```

---

### 6. **Responsive Design** (`responsive.cy.ts`)
**Tests:** Mobile (375px), tablet (768px), desktop (1280px), landscape  
**Key Tests:**
- ✅ Mobile: fully visible, touchable buttons, no horizontal overflow
- ✅ Tablet: proper layout, readable text
- ✅ Desktop: efficient spacing, max-width respected
- ✅ Text scales appropriately at breakpoints
- ✅ Buttons have proper size at all viewports
- ✅ Landscape orientation works
- ✅ Breakpoints: sm (640px), md (768px), lg (1024px)

**Running:**
```bash
pnpm exec cypress run --spec "cypress/e2e/responsive.cy.ts"
```

---

## Expected Test Results

### Passing Tests (Green ✅)
- All theme tests
- All tabs tests
- All header tests
- All UI component tests
- Most accessibility tests (unless you have axe plugin installed)
- All responsive tests

### Tests That May Need Adjustment (⚠️)
- **Recording flow tests** — Skipped because they require microphone permissions in headless mode. Test manually or with permission grants.
- **Login flow tests** — Skipped because they require Firebase/Google Auth setup. Can be tested with mock authentication.
- **Tab keyboard navigation** — The custom `tab()` command may need adjustment depending on your keyboard handling.

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: Cypress Tests
on: [push, pull_request]

jobs:
  cypress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm dev &
      - run: pnpm exec cypress run
```

---

## Debugging Failed Tests

### View Detailed Error Messages

```bash
pnpm exec cypress run --spec "cypress/e2e/theme.cy.ts" --reporter spec
```

### Use Debug Mode

```bash
DEBUG=cypress:* pnpm exec cypress run
```

### Manual Debugging in Browser

```bash
pnpm exec cypress open
# Click on test file
# Use cy.debug() in test code
# Inspect in DevTools (F12)
```

### Take Screenshots

Cypress automatically takes screenshots on test failure:
```
cypress/screenshots/
```

### View Video Recordings

Cypress automatically records video of test runs:
```
cypress/videos/
```

---

## Test Maintenance

### Adding New Tests

1. Create new file in `cypress/e2e/` with `.cy.ts` extension
2. Follow pattern:
```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should do something', () => {
    cy.get('selector').should('exist');
  });
});
```

3. Run tests to verify
4. Update this guide with new test suite info

### Updating Tests

When UI changes:
1. Update selectors in affected tests
2. Re-run test suite
3. Commit changes with test updates

### Common Issues

**Issue:** Tests fail due to timeouts  
**Fix:** Increase timeout in `cypress.config.ts`:
```typescript
defaultCommandTimeout: 15000 // increased from 10000
```

**Issue:** Tests fail due to stale localStorage  
**Fix:** Clear in `beforeEach`:
```typescript
cy.window().then((win) => {
  win.localStorage.clear();
});
```

**Issue:** Focus tests fail  
**Fix:** Ensure focus:ring-2 class is on interactive elements

---

## Performance Testing

### Load Time Testing

Add to a new `performance.cy.ts`:
```typescript
it('should load in under 3 seconds', () => {
  const start = Date.now();
  cy.visit('/');
  cy.get('main').should('exist');
  const duration = Date.now() - start;
  expect(duration).to.be.lessThan(3000);
});
```

---

## Accessibility Testing with axe

### Install axe Plugin

```bash
pnpm add -D @axe-core/react cypress-axe
```

### Add to Tests

```typescript
import 'cypress-axe';

it('should not have accessibility violations', () => {
  cy.visit('/');
  cy.injectAxe();
  cy.checkA11y();
});
```

---

## Test Coverage Report

Generate coverage:

```bash
pnpm add -D @cypress/code-coverage
pnpm exec cypress run --coverage
```

View report:
```
coverage/index.html
```

---

## Next Steps

1. **Run all tests** — `pnpm exec cypress run`
2. **Fix failing tests** — Check error messages, update selectors
3. **Add to CI/CD** — Use GitHub Actions or similar
4. **Manual testing** — Test recording flow and microphone permissions
5. **Accessibility audit** — Use axe DevTools browser extension
6. **Performance testing** — Profile with Chrome DevTools

---

## Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Testing Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)

---

**Test Suite Created:** May 31, 2026  
**Total Test Cases:** 60+  
**Coverage Areas:** Theme, Tabs, Header, UI, Accessibility, Responsive Design
