# Testing & CI/CD Setup — Fraud Detection Engine

**Version:** 3.0.0  
**Last Updated:** 2026-04-27  
**Status:** Fully Configured

---

## Overview

The Fraud Detection Engine includes a comprehensive testing strategy with three layers:

1. **Unit Tests** — Components, utilities, hooks (Vitest)
2. **Integration Tests** — Component interactions (React Testing Library)
3. **End-to-End Tests** — User workflows (Playwright)

All tests are configured to run locally and in CI/CD pipelines.

---

## Local Testing

### Prerequisites

```bash
# Ensure you have Node.js 20+ and pnpm installed
node --version  # v20.x or higher
pnpm --version  # 9.x or higher
```

### Unit Tests (Vitest)

**Run unit tests in watch mode:**
```bash
pnpm test
```

**Run unit tests once (CI mode):**
```bash
pnpm test:coverage
```

**View coverage report:**
```bash
# After running pnpm test:coverage, open the HTML report
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

**Configuration:** `vitest.config.ts`
- **Environment:** jsdom (browser-like)
- **Coverage Target:** > 70% for branches, functions, lines, statements
- **Files Included:** `src/**/*.{ts,tsx}`
- **Excluded:** Test files, stubs, node_modules

### E2E Tests (Playwright)

**Run E2E tests (interactive):**
```bash
# Ensure dev server is running first
pnpm run dev  # In terminal 1

# In terminal 2
pnpm run test:e2e
```

**Run E2E tests with UI:**
```bash
pnpm run test:e2e -- --ui
```

**View test report:**
```bash
npx playwright show-report
```

**Configuration:** `playwright.config.ts`
- **Test Directory:** `./tests`
- **Browser:** Chromium (Desktop Chrome)
- **Base URL:** http://localhost:3000
- **Screenshots:** Captured on failure
- **Traces:** Recorded on first retry (CI only)

---

## E2E Test Suite

Current E2E test coverage:

| Test File | Coverage | Status |
|-----------|----------|--------|
| `tests/dashboard.spec.ts` | Dashboard navigation, stat cards, trend chart | ✅ Complete |
| `tests/alerts.spec.ts` | Alert generation, acknowledgement workflow | ✅ Complete |
| `tests/theme.spec.ts` | Light/Dark/High-Contrast theme switching | ✅ Complete |
| `tests/admin.spec.ts` | Admin login, diagnostics pages | ✅ Complete |

**Example test structure:**
```typescript
// tests/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('Dashboard displays entity count stats', async ({ page }) => {
  await page.goto('/');
  const totalEntitiesCard = page.getByText('Total Entities');
  await expect(totalEntitiesCard).toBeVisible();
  const count = await page.getByTestId('entity-count').textContent();
  expect(Number(count)).toBeGreaterThan(0);
});
```

---

## Unit Test Suite

Current unit test coverage:

| Test File | Coverage | Status |
|-----------|----------|--------|
| `src/__tests__/App.test.tsx` | Router configuration, route existence | ✅ Complete |

**To add more unit tests:**
1. Create a test file next to the component: `MyComponent.test.tsx`
2. Import the component and write assertions:
   ```typescript
   import { render, screen } from '@testing-library/react';
   import MyComponent from './MyComponent';

   test('renders correctly', () => {
     render(<MyComponent />);
     expect(screen.getByText('Hello')).toBeInTheDocument();
   });
   ```
3. Run `pnpm test` to execute automatically

---

## CI/CD Pipeline

### GitHub Actions Workflow

**Location:** `.github/workflows/ci-all-projects.yml`

**Trigger Events:**
- Commits to `main`, `develop`, `master` branches
- Pull requests to any of these branches
- Manual dispatch via GitHub UI

**Workflow Steps:**

1. **Detect Changes**
   - Identifies which projects have changed
   - Monorepo-aware (only tests affected projects)
   - Note: `fraud-detection-engine` is not yet in the monitored list (see update below)

2. **Lint**
   - Runs `npm run lint` (or `pnpm run lint` — currently uses npm)
   - Checks TypeScript via `tsc --noEmit`
   - Fails on type errors

3. **Test**
   - Runs `npm test -- --coverage`
   - Uploads coverage reports as artifacts
   - Retries twice in CI mode

4. **Build Docker Image**
   - Creates Docker image from `Dockerfile`
   - Pushes to GitHub Container Registry (ghcr.io)
   - Only on successful lint + test

### Adding fraud-detection-engine to CI/CD

**Update Required:** The monorepo's CI/CD pipeline doesn't yet monitor `fraud-detection-engine`. To enable automated testing:

1. Edit `.github/workflows/ci-all-projects.yml`
2. Add to the `projects` array in the `detect-changes` job:
   ```yaml
   declare -a projects=(
     ...existing projects...
     "fraud-detection-engine"  # Add this line
   )
   ```

**Note:** This ensures fraud-detection-engine is tested on every commit/PR.

---

## Running Tests Before Commit

### Git Hook (Pre-commit)

Set up a pre-commit hook to run tests automatically:

```bash
# Create .git/hooks/pre-commit (or .husky/pre-commit if using husky)
#!/bin/bash
cd fraud-detection-engine
pnpm run lint && pnpm test:coverage
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

### Manual Checklist Before Pushing

```bash
# 1. Run type checking
pnpm run lint

# 2. Run unit tests
pnpm test:coverage

# 3. Run E2E tests (ensure dev server is running)
pnpm run dev &  # Start dev server
pnpm run test:e2e

# 4. Build for production
pnpm run build

# 5. Verify no warnings
# Check console output for any errors
```

---

## Test Utilities & Helpers

### React Testing Library Setup

**File:** `src/__tests__/setup.ts`

Provides global test utilities:
- `render()` — Renders React components with necessary providers
- `screen` — Queries for elements in the DOM
- `userEvent` — Simulates user interactions

### Custom Render Function

If you need to wrap components with providers:

```typescript
// src/__tests__/utils.tsx
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { ...options });

export * from '@testing-library/react';
export { customRender as render };
```

---

## Coverage Thresholds

The project enforces code coverage targets via `vitest.config.ts`:

| Metric | Target | Status |
|--------|--------|--------|
| **Branches** | 70% | ⚠️ Currently below (Phase 4) |
| **Functions** | 70% | ⚠️ Currently below (Phase 4) |
| **Lines** | 70% | ⚠️ Currently below (Phase 4) |
| **Statements** | 70% | ⚠️ Currently below (Phase 4) |

**Next Phase (Phase 5):** Increase unit test coverage to meet thresholds.

**Temporary Override:**
To allow commits when coverage is below threshold:
```bash
# Run tests without coverage check
pnpm test -- --coverage --coverage.all=false
```

---

## Troubleshooting

### Tests Hang or Timeout

**Symptom:** `vitest` or `playwright` command hangs indefinitely.

**Solution:**
1. Ensure dev server is running (for E2E tests): `pnpm run dev`
2. Check port 3000 is free: `netstat -an | grep 3000`
3. Kill lingering processes: `pkill -f "node server.ts"`
4. Restart tests: `pnpm run test:e2e`

### Module Not Found Errors

**Symptom:** `Cannot find module 'X'` during test run.

**Solution:**
1. Reinstall dependencies: `pnpm install`
2. Clear build cache: `pnpm run clean && rm -rf dist`
3. Rerun tests: `pnpm test`

### Coverage Report Shows Low Coverage

**Symptom:** Coverage is significantly below 70% target.

**Action Items:**
- Review uncovered code: `open coverage/index.html`
- Identify critical paths not covered
- Add unit tests for covered modules (Phase 5)

### E2E Tests Fail Intermittently

**Symptom:** Tests pass sometimes, fail other times (flaky tests).

**Root Causes:**
- API calls still loading when assertions run
- Timing issues with animations
- Database state not cleaned between tests

**Solution:**
1. Add explicit waits: `await page.waitForSelector('[data-testid="element"]')`
2. Increase timeout: `test('...', async ({ page }) => { ... }, { timeout: 30000 })`
3. Reset state between tests: Create fixtures

---

## Best Practices

### Writing Tests

1. **Test user behaviour, not implementation**
   ```typescript
   // ✅ Good: Tests what the user sees
   expect(screen.getByText('Submit')).toBeInTheDocument();

   // ❌ Bad: Tests internal state
   expect(component.state.isLoading).toBe(false);
   ```

2. **Use accessible queries**
   ```typescript
   // ✅ Good: Uses semantic HTML
   screen.getByRole('button', { name: /submit/i })

   // ❌ Bad: Relies on implementation details
   screen.getByTestId('btn-123')
   ```

3. **Keep tests focused**
   - One assertion per test (or related group)
   - Test one behaviour per test
   - Use descriptive test names

4. **Avoid test interdependencies**
   - Each test must run independently
   - Don't rely on test execution order

### Playwright Best Practices

1. **Wait for elements, don't sleep**
   ```typescript
   // ✅ Good
   await page.waitForSelector('[data-testid="alert"]');

   // ❌ Bad
   await page.waitForTimeout(1000);
   ```

2. **Use test IDs for critical elements**
   ```tsx
   // In component
   <button data-testid="submit-btn">Submit</button>

   // In test
   await page.click('[data-testid="submit-btn"]');
   ```

3. **Isolate test setup and teardown**
   ```typescript
   test.beforeEach(async ({ page }) => {
     await page.goto('/');
   });

   test.afterEach(async ({ page }) => {
     // Cleanup if needed
   });
   ```

---

## Continuous Improvements

### Phase 5 Roadmap

- [ ] Increase unit test coverage to 70% threshold
- [ ] Add integration tests for API calls
- [ ] Add accessibility tests with `axe-playwright`
- [ ] Set up visual regression testing
- [ ] Implement performance budgets
- [ ] Add load testing with k6 or Artillery

### Metrics to Track

```bash
# Get current coverage
pnpm test:coverage

# Monitor bundle size (each build)
pnpm run build
# Check console output for "dist/index.js" size

# Run tests with performance profiling
pnpm test -- --reporter=verbose --reporter=html
```

---

## References

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

*Techbridge University College — Fraud Detection Engine*  
*Managed by The Sentinel AI Orchestrator*
