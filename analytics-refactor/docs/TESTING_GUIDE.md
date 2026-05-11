# Testing Guide

## Overview

| Type | Framework | Config | Command |
|---|---|---|---|
| Unit / Component | Vitest 3 + Testing Library | `vite.config.ts` | `pnpm test` |
| E2E | Playwright 24 | `vitest.e2e.config.ts` | `pnpm run test:e2e` |
| Coverage | v8 | `vite.config.ts` | `pnpm run test:coverage` |

---

## Unit Tests

### Running

```bash
pnpm test                  # Watch mode
pnpm run test:coverage     # Single run with coverage report
```

Coverage thresholds (must pass): **70%** branches, functions, lines, statements.

### Test File Locations

```
src/
├── hooks/__tests__/
│   └── useAnalyticsData.test.js
└── components/analytics/components/__tests__/
    ├── MetricSelector.test.tsx      (7 tests)
    ├── StateComponents.test.js      (8 tests)
    └── [chart].test.{js,tsx}        (per chart)
```

### Writing a New Unit Test

```js
// src/utils/__tests__/myUtil.test.js
import { describe, it, expect } from 'vitest';
import { myFunction } from '../myUtil';

describe('myFunction', () => {
  it('returns expected value', () => {
    expect(myFunction(input)).toBe(expected);
  });
});
```

Environment is `happy-dom`. DOM APIs are available. No browser needed.

### Mocking

```js
import { vi } from 'vitest';

// Mock a module
vi.mock('../services/AuthService', () => ({
  AuthService: { isAuthenticated: vi.fn(() => true) },
}));

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve(mockData) })
);
```

---

## E2E Tests (Playwright)

### Prerequisites

1. Install Playwright: `pnpm install` (it's in `optionalDependencies`)
2. Start the dev server: `pnpm run dev`
3. In a second terminal: `pnpm run test:e2e`

### Test Flows Covered

| Flow | Tests |
|---|---|
| Authentication | Login, invalid creds, account lockout |
| Dashboard Display | 5 charts, stats banner, mobile layout, no console errors |
| Export | Modal opens, PDF download listener |
| Keyboard Navigation | Tab focus, Ctrl+Shift+A toolbar, Ctrl+P print |
| Accessibility Audit | axe-core — no critical/serious violations |
| Performance | Page load < 3s, charts render < 2s |

### Running in Headed Mode (see the browser)

```bash
E2E_HEADLESS=false pnpm run test:e2e
```

### Against Production

```bash
E2E_BASE_URL=https://analytics.techbridge.edu.gh pnpm run test:e2e
```

### Slow Motion (for debugging)

```bash
E2E_SLOW_MO=200 E2E_HEADLESS=false pnpm run test:e2e
```

---

## Coverage Report

After `pnpm run test:coverage`, open the HTML report:

```bash
# Windows
start analytics-refactor/coverage/index.html
```

Target: >70% on all metrics for `src/utils/` and `src/hooks/`.
