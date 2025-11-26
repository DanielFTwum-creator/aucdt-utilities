# Puppeteer E2E Testing Framework

## Overview

This directory contains the comprehensive end-to-end testing framework for ThesisAI Frontend using Puppeteer. The framework provides automated browser testing with real-time results and screenshot capture capabilities.

## Architecture

```
e2e/
├── test-runner.ts     # Core test runner with Puppeteer logic
├── server.ts          # Express server with WebSocket support
├── index.ts           # Entry point for running the test server
└── screenshots/       # Auto-generated test screenshots
```

## Features

- **10 Comprehensive Tests**: Covering all critical user journeys
- **Real-time Updates**: WebSocket-based live test progress
- **Screenshot Capture**: Automatic screenshots on pass/fail
- **Interactive UI**: Self-test tab in frontend for viewing results
- **RESTful API**: Trigger tests and fetch results via HTTP

## Test Suite

The framework includes 10 comprehensive tests:

1. **Page Load and Basic Rendering** - Verifies main page loads correctly
2. **Header Navigation Elements** - Checks navigation links and buttons
3. **Hero Section Interaction** - Tests hero section content
4. **Features Grid Display** - Validates feature cards rendering
5. **Responsive Design - Mobile** - Tests mobile viewport (375x667)
6. **Responsive Design - Tablet** - Tests tablet viewport (768x1024)
7. **Framer Motion Animations** - Verifies animations complete
8. **Footer Display and Content** - Checks footer rendering
9. **Accessibility - Keyboard Navigation** - Tests keyboard accessibility
10. **Performance - Page Load Time** - Ensures page loads under 5 seconds

## Installation

Dependencies are already included in the main `package.json`. No additional installation needed.

Required packages:
- `puppeteer` - Browser automation
- `express` - HTTP server
- `ws` - WebSocket support
- `tsx` - TypeScript execution

## Usage

### Starting the Test Server

```bash
# Start the test runner server on port 8080
pnpm test:e2e:server

# Or specify a custom base URL
BASE_URL=http://localhost:3000 pnpm test:e2e:dev
```

The server will start on `http://localhost:8080` with the following endpoints:

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/test/status` | Get current test execution status |
| GET | `/api/test/results` | Get latest test suite results |
| POST | `/api/test/run` | Trigger a new test run |
| GET | `/api/test/screenshot/:filename` | Get a specific screenshot |
| GET | `/screenshots/:filename` | Static screenshot access |

### WebSocket Connection

Connect to `ws://localhost:8080` for real-time test updates.

**Message Types:**
- `connected` - Initial connection with current status
- `test-started` - Test suite execution started
- `test-running` - Individual test is running
- `test-completed` - Individual test completed
- `test-suite-completed` - All tests completed
- `error` - Error occurred during testing

### Using the Frontend UI

1. Start the frontend development server:
   ```bash
   pnpm dev
   ```

2. Start the test runner server (in a separate terminal):
   ```bash
   pnpm test:e2e:dev
   ```

3. Navigate to the frontend (http://localhost:3000)

4. Click on the **"Self-Test"** tab in the navigation

5. Click **"Run Tests"** to execute the test suite

6. View real-time results, including:
   - Test status (passed/failed/running)
   - Execution duration
   - Error messages
   - Screenshots

## Configuration

### Environment Variables

- `PORT` - Server port (default: 8080)
- `BASE_URL` - Frontend URL to test (default: http://localhost:3000)
- `PUPPETEER_EXECUTABLE_PATH` - Custom Chrome/Chromium path

### Puppeteer Options

The test runner uses the following Puppeteer launch options:

```typescript
{
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'
  ]
}
```

## Test Structure

Each test follows this structure:

```typescript
await runner.runTest(
  'test-id',          // Unique test identifier
  'Test Name',        // Human-readable test name
  async (page) => {   // Test function
    // Test implementation
    await page.goto(baseUrl);
    // Assertions
    if (!condition) throw new Error('Test failed');
  }
);
```

## Screenshots

Screenshots are automatically captured for each test:
- **Success**: `{test-id}-success-{timestamp}.png`
- **Failure**: `{test-id}-failure-{timestamp}.png`

Screenshots are stored in `e2e/screenshots/` and served via:
- REST API: `/api/test/screenshot/:filename`
- Static: `/screenshots/:filename`

## Development

### Adding New Tests

1. Open `e2e/test-runner.ts`
2. Add your test to the `runAllTests()` method:

```typescript
const testN = await this.runTest(
  'test-XX-my-test',
  'My New Test',
  async (page) => {
    // Your test logic here
    await page.goto(this.baseUrl);
    // Assertions
  }
);
suite.tests.push(testN);
```

3. Update the server.ts tests array if using real-time broadcasting

### Debugging Tests

To run tests in headed mode (visible browser):

```typescript
// In test-runner.ts, change:
headless: false  // Make browser visible
```

### Running Individual Tests

You can create a separate script to run individual tests:

```typescript
import { PuppeteerTestRunner } from './test-runner';

const runner = new PuppeteerTestRunner();
await runner.initialize();

const result = await runner.runTest(
  'test-id',
  'Test Name',
  async (page) => {
    // Test logic
  }
);

console.log(result);
await runner.cleanup();
```

## Troubleshooting

### Browser Download Issues

If Puppeteer fails to download Chrome:

```bash
# Skip download and use system Chrome
PUPPETEER_SKIP_DOWNLOAD=true pnpm install

# Set custom executable path
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

### Connection Errors

If WebSocket connection fails:
1. Ensure test server is running on port 8080
2. Check for port conflicts
3. Verify CORS configuration in server.ts

### Test Timeouts

If tests timeout:
1. Increase timeout in test function: `{ timeout: 15000 }`
2. Check network connectivity
3. Verify frontend is accessible at BASE_URL

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build frontend
        run: pnpm build

      - name: Start frontend
        run: pnpm preview &

      - name: Run E2E tests
        run: |
          pnpm test:e2e:dev &
          sleep 5
          curl -X POST http://localhost:8080/api/test/run
```

## Best Practices

1. **Keep tests independent** - Each test should work in isolation
2. **Use proper selectors** - Prefer data-testid over classes
3. **Handle async properly** - Always await page operations
4. **Clean up resources** - Always close pages and browser
5. **Meaningful assertions** - Throw descriptive errors
6. **Screenshot everything** - Helps with debugging
7. **Test responsiveness** - Include mobile and tablet viewports
8. **Check accessibility** - Test keyboard navigation

## Performance

- Average test suite duration: ~30-60 seconds
- Individual test duration: 2-8 seconds
- Screenshot size: 50-200KB per image

## License

MIT License - Same as parent project
