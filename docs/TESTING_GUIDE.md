# 🎓 Techbridge University College - Testing Guide

## Testing Frameworks
- **Unit Testing:** Vitest (React apps)
- **E2E Testing:** Playwright (Recommended) / Playwright
- **Visual Testing:** Automated Screenshot Capture (`capture-app-screenshots-playwright.js`)

## Running Tests
### Unit Tests
```bash
cd <app-directory>
pnpm test
```

### E2E Tests
```bash
cd tuc-portal-tests
pnpm exec playwright test
```

### Screenshot Automation
```bash
node capture-app-screenshots-playwright.js
```

## Coverage Requirements
- **MANDATORY:** 100% ARIA coverage for interactive elements.
- **MANDATORY:** 100% Screenshot coverage for the Catalogue.
- **GOAL:** 70%+ Unit test coverage for business logic.

---
*Last Updated: March 11, 2026*
