# CLAUDE.md - AI Development Guide

This file provides context for AI assistants (like Claude) when helping with this project.

## Project Overview

**Project Name**: AUCDT Portal Automated Testing Suite  
**Technology Stack**: Playwright, TypeScript, Node.js  
**Purpose**: End-to-end testing for AUCDT Admissions Portal  
**Architecture**: Page Object Model (POM)

## Key Technologies

- **Playwright**: Modern browser automation framework
- **TypeScript**: Type-safe JavaScript superset
- **Node.js**: JavaScript runtime environment
- **Docker**: Containerization for consistent test environments

## Project Structure

```
aucdt-portal-tests/
├── tests/                  # Test specifications
├── utils/                  # Page objects and helpers
├── test-data/             # Test data and fixtures
├── config/                # Configuration files
└── test-results/          # Generated test reports
```

## Design Patterns

### 1. Page Object Model (POM)
- Each page/component has its own class
- Locators defined as class properties
- Actions encapsulated as methods
- Inherits from BasePage for common functionality

### 2. Test Data Management
- Centralized in `test-data/testData.ts`
- Environment-specific data in `.env`
- Separate valid/invalid test cases

### 3. Utilities and Helpers
- Reusable functions in `utils/helpers.ts`
- Common page actions in `BasePage.ts`
- Type-safe TypeScript throughout

## Coding Standards

### TypeScript
- Strict type checking enabled
- Explicit return types for methods
- Interface definitions for complex objects
- No `any` types unless absolutely necessary

### Naming Conventions
- **Files**: camelCase for utilities, PascalCase for page objects
- **Classes**: PascalCase (e.g., `LoginPage`)
- **Methods**: camelCase (e.g., `navigateToLoginPage()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `TEST_USERNAME`)
- **Test files**: `*.spec.ts` suffix

### Test Structure
```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup
  });

  test('Should do something specific', async ({ page }) => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Common Tasks

### Adding New Tests
1. Create test file in `tests/` directory
2. Import required page objects
3. Use `test.describe()` for grouping
4. Use `test.beforeEach()` for setup
5. Write clear, descriptive test names

### Adding New Page Objects
1. Create class extending `BasePage`
2. Define locators in constructor
3. Implement page-specific methods
4. Use TypeScript types for parameters
5. Add JSDoc comments for documentation

### Updating Selectors
- Prefer `data-testid` attributes
- Use CSS selectors over XPath
- Keep selectors in page objects
- Make selectors resilient to UI changes

### Debugging Tests
```bash
# UI mode - interactive debugging
npm run test:ui

# Debug mode - step through tests
npm run test:debug

# Headed mode - see browser
npm run test:headed
```

## Test Data Guidelines

### Valid Test Data
- Use realistic but fake data
- Avoid production credentials
- Store in `test-data/testData.ts`
- Use environment variables for sensitive data

### Invalid Test Data
- Boundary values
- Special characters
- Empty strings
- SQL injection attempts
- XSS attempts

## Best Practices

### 1. Test Independence
- Each test should run standalone
- No dependency on test execution order
- Clean up test data after tests

### 2. Explicit Waits
```typescript
// Good
await page.waitForSelector('#element');

// Bad
await page.waitForTimeout(5000);
```

### 3. Assertions
```typescript
// Use Playwright's expect
await expect(element).toBeVisible();
await expect(element).toHaveText('Expected Text');
```

### 4. Error Handling
```typescript
try {
  await element.click();
} catch (error) {
  console.error('Element not clickable:', error);
  throw error;
}
```

### 5. Logging
```typescript
import { logTestInfo } from '../utils/helpers';

logTestInfo('Step completed successfully');
```

## Configuration Files

### playwright.config.ts
- Browser configurations
- Timeout settings
- Reporter configurations
- Device emulation

### tsconfig.json
- TypeScript compiler options
- Module resolution
- Output directory

### package.json
- Dependencies
- Scripts
- Project metadata

## CI/CD Integration

### GitHub Actions
- Workflow defined in `.github/workflows/tests.yml`
- Runs on push, PR, and schedule
- Multi-browser testing
- Artifact upload for reports

### Docker
- Dockerfile for containerization
- docker-compose.yml for orchestration
- Consistent environment across machines

## Environment Variables

Required in `.env`:
```
TEST_USERNAME=your_test_username
TEST_PASSWORD=your_test_password
TEST_EMAIL=your_test_email@example.com
```

Optional:
```
HEADLESS=true
TIMEOUT=30000
BROWSER=chromium
```

## Common Issues & Solutions

### Issue: Tests failing locally but passing in CI
**Solution**: Check browser versions, clear cache, verify environment variables

### Issue: Selector not found
**Solution**: Use `waitForSelector()`, verify element exists, update selector

### Issue: Flaky tests
**Solution**: Add proper waits, use `waitForLoadState()`, avoid hard-coded timeouts

### Issue: Slow test execution
**Solution**: Run in parallel, optimize waits, use network idle strategically

## Dependencies

### Core
- `@playwright/test`: Testing framework
- `typescript`: Type safety
- `@types/node`: Node.js types

### Development
- None currently (all included in Playwright)

## Future Enhancements

Potential areas for improvement:
1. Visual regression testing with AI comparison
2. Performance budgets and monitoring
3. API testing integration
4. Database verification
5. Email verification
6. Multi-language testing
7. Advanced reporting dashboards
8. Test data generation
9. Parallel execution optimization
10. Cross-device testing expansion

## Working with AI Assistants

When asking AI for help:

### Good Requests
✅ "Add a new test for password reset functionality"
✅ "Create a page object for the registration form"
✅ "Help debug this failing test"
✅ "Optimize this selector to be more resilient"
✅ "Add TypeScript types to this function"

### Context to Provide
- What feature you're testing
- Current error messages
- Expected vs actual behavior
- Relevant code snippets
- Browser/environment details

### Code Review Focus
- Type safety
- Selector stability
- Wait strategies
- Test independence
- Code reusability

## Resources

- [Playwright Docs](https://playwright.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
- [POM Pattern](https://playwright.dev/docs/pom)

---

This document helps AI assistants understand the project structure, conventions, and best practices when helping with development tasks.
