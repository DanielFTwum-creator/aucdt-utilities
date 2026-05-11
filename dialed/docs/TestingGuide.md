# Testing Guide - DIALED

## Philosophy
DIALED adopts a "Test-First" implementation approach using Playwright for End-to-End (E2E) verification and internal diagnostic simulations.

## E2E Testing (Playwright)
### Setup
```bash
npx playwright install
```

### Execution
Run the full suite in headless mode:
```bash
npx playwright test
```

### Coverage
- **Intro Flow**: Verifies initial render and ARIA accessibility.
- **Game Entry**: Verifies state transition to Countdown/Memorize.
- **Admin Access**: Verifies RBAC and credential verification.

## Internal Diagnostics
The **Testing Tab** in the Admin Console allows on-demand verification of:
1. `CORE_INTRO_RENDER`
2. `AUTH_SESSION_VALIDATION`
3. `COLOR_ALGORITHM_PRECISION`
4. `FIRESTORE_WRITE_THROTTLE`
5. `RESPONSIVE_BREAKPOINT_AUDIT`

## Screenshot Regression
Screenshots are captured at critical state transitions and stored for manual review in the Admin Console gallery. Current captured views:
- Intro Screen
- Picker Interface
- Admin Console
