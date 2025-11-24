# Puppeteer Test Server

This directory contains the backend test server for running Puppeteer E2E tests on the ThesisAI frontend application.

## Features

- **Express API Server**: RESTful API endpoints for test execution
- **Puppeteer Test Suite**: Comprehensive E2E tests for critical user journeys
- **Real-time Results**: Test results with screenshots and detailed step-by-step execution
- **Mock Fallback**: Graceful fallback to mock results if browser is unavailable

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server health status and timestamp.

### Run Tests
```
POST /api/tests/run
```
Executes the full Puppeteer test suite and returns results with screenshots.

### Test Status
```
GET /api/tests/status
```
Returns information about available tests and last run status.

## Test Suites

### Critical User Journeys
1. **Homepage loads successfully** - Verifies homepage rendering and key elements
2. **Navigation menu is functional** - Tests navigation links and scroll behavior
3. **Feature cards are interactive** - Validates hover effects and content display
4. **Call-to-action buttons work** - Tests CTA button functionality
5. **Responsive design on mobile** - Verifies mobile viewport responsiveness

### Performance Tests
1. **Page load time under 3 seconds** - Measures initial page load performance
2. **Animation performance is smooth** - Monitors frame rate and layout stability

## Running the Test Server

### Development Mode
```bash
pnpm test-server:dev
```

### Production Mode
```bash
pnpm test-server
```

The server will start on port 8080.

## Environment Variables

- `APP_URL` - URL of the application to test (default: http://localhost:3000)
- `CHROME_PATH` - Path to Chrome/Chromium executable (default: /usr/bin/google-chrome)

## Architecture

```
test-server/
├── server.ts           # Express server setup
├── test-runner.ts      # Test execution coordinator
├── tests/
│   ├── index.ts        # Test loader with fallback
│   └── puppeteer-tests.ts  # Actual Puppeteer test implementations
├── package.json        # Server dependencies
└── tsconfig.json       # TypeScript configuration
```

## Mock Mode

If a browser is not available (e.g., in containerized environments without Chrome), the test server will automatically return mock results that demonstrate the testing capability. This ensures the frontend Self-Test tab can be previewed and developed even without a full browser installation.

## Integration with Frontend

The frontend's Self-Test tab communicates with this server via Axios to:
1. Start test execution
2. Retrieve real-time results
3. Display screenshots captured during tests
4. Show detailed step-by-step test progression

## Adding New Tests

To add a new test:

1. Create a new test function in `tests/puppeteer-tests.ts`
2. Follow the existing pattern for test structure
3. Return a `TestResult` object with status, duration, screenshots, and steps
4. Add the test to the appropriate test suite function

Example:
```typescript
async function testNewFeature(browser: Browser): Promise<TestResult> {
  const testName = 'New feature works correctly';
  const startTime = Date.now();
  const steps: TestResult['steps'] = [];

  try {
    const page = await browser.newPage();
    await page.goto(APP_URL);

    // Add test steps here
    steps.push({
      description: 'Step description',
      status: 'passed',
      timestamp: Date.now()
    });

    const screenshot = await page.screenshot({ encoding: 'base64' });
    await page.close();

    return {
      name: testName,
      status: 'passed',
      duration: Date.now() - startTime,
      screenshot: `data:image/png;base64,${screenshot}`,
      steps
    };
  } catch (error) {
    return {
      name: testName,
      status: 'failed',
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
      steps
    };
  }
}
```
