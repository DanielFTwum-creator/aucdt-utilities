# Puppeteer Self-Test Guide

This guide explains how to use the integrated Puppeteer self-testing functionality in ThesisAI Frontend.

## Overview

The self-testing framework provides:
- **Automated E2E Testing**: Comprehensive Puppeteer test suite for critical user journeys
- **Interactive UI**: Self-Test tab in the frontend for running tests
- **Real-time Results**: Live test execution with detailed step-by-step logging
- **Screenshot Capture**: Visual verification of test states
- **RESTful API**: Backend service for test execution and results

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  - Self-Test Tab (http://localhost:3000)                    │
│  - Real-time test status polling                            │
│  - Screenshot display                                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ HTTP API Calls
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                 Backend API (Express)                        │
│  - Test execution endpoints (http://localhost:8080)         │
│  - Status monitoring                                         │
│  - Results storage                                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Launches
                      │
┌─────────────────────▼───────────────────────────────────────┐
│            Puppeteer Test Suite                              │
│  - Page Load Test                                            │
│  - Header Navigation Test                                    │
│  - Hero Section Test                                         │
│  - Feature Cards Test                                        │
│  - Responsive Design Test                                    │
│  - Accessibility Test                                        │
│  - Performance Test                                          │
└──────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- pnpm 8.15.0 (specified in package.json)
- Chromium/Chrome browser installed on system

### Installation

```bash
# Install dependencies
pnpm install
```

### Running the Tests

#### Option 1: Using the Web UI (Recommended)

1. **Start the backend test server** (in terminal 1):
   ```bash
   pnpm test-server
   ```
   This will start the API server on http://localhost:8080

2. **Start the frontend** (in terminal 2):
   ```bash
   pnpm dev
   ```
   This will start the React app on http://localhost:3000

3. **Navigate to the Self-Test tab**:
   - Open http://localhost:3000 in your browser
   - Click the "Self-Test" tab in the navigation
   - Click "Run All Tests" button

4. **View results**:
   - Tests will run automatically
   - Progress will be displayed in real-time
   - Click on any test to expand and view:
     - Detailed execution steps
     - Error messages (if failed)
     - Screenshots of the final state

#### Option 2: Using the API directly

```bash
# Start the test server
pnpm test-server

# In another terminal, run tests via API
curl -X POST http://localhost:8080/api/tests/run -H "Content-Type: application/json" -d '{"baseUrl": "http://localhost:3000"}'

# Check test status
curl http://localhost:8080/api/tests/status

# Get results
curl http://localhost:8080/api/tests/results
```

## API Endpoints

### `GET /api/health`
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-24T10:30:00.000Z"
}
```

### `GET /api/tests/status`
Get current test execution status

**Response:**
```json
{
  "isRunning": false,
  "hasResults": true,
  "timestamp": "2025-11-24T10:30:00.000Z"
}
```

### `POST /api/tests/run`
Run all Puppeteer tests

**Request Body:**
```json
{
  "baseUrl": "http://localhost:3000"
}
```

**Response:**
```json
{
  "message": "Test run started",
  "status": "running",
  "timestamp": "2025-11-24T10:30:00.000Z"
}
```

### `GET /api/tests/results`
Get latest test results

**Response:**
```json
{
  "name": "ThesisAI Critical User Journeys",
  "tests": [
    {
      "name": "Page Load Test",
      "status": "passed",
      "duration": 1234,
      "screenshot": "data:image/png;base64,...",
      "steps": [
        "Navigating to http://localhost:3000",
        "Waiting for page title",
        "Page title found: \"ThesisAI\"",
        "Checking for ThesisAI logo",
        "ThesisAI logo verified"
      ]
    }
  ],
  "totalDuration": 15000,
  "passed": 7,
  "failed": 0,
  "skipped": 0
}
```

### `POST /api/tests/run/:testName`
Run a specific test

**Supported test names:**
- `pageLoad`
- `headerNavigation`
- `heroSection`
- `featureCards`
- `responsiveDesign`
- `accessibility`
- `performance`

### `DELETE /api/tests/results`
Clear stored test results

## Test Suite Details

### 1. Page Load Test
- Navigates to the application
- Verifies page title
- Checks for ThesisAI logo
- **Success Criteria**: Page loads within timeout, logo visible

### 2. Header Navigation Test
- Verifies navigation links exist
- Tests link functionality
- **Success Criteria**: All navigation elements functional

### 3. Hero Section Test
- Checks main heading content
- Verifies CTA buttons
- Tests button interactions
- **Success Criteria**: Hero content renders correctly

### 4. Feature Cards Test
- Scrolls to features section
- Verifies all three feature cards
- Checks grid layout
- **Success Criteria**: All cards visible with correct layout

### 5. Responsive Design Test
- Tests mobile viewport (375x667)
- Tests tablet viewport (768x1024)
- Tests desktop viewport (1920x1080)
- **Success Criteria**: App renders on all viewports

### 6. Accessibility Test
- Checks semantic HTML elements
- Verifies heading hierarchy
- Tests button accessibility
- **Success Criteria**: Proper accessibility structure

### 7. Performance Test
- Measures page load time
- Checks Cumulative Layout Shift
- **Success Criteria**: Load time < 5s, acceptable CLS

## Troubleshooting

### Browser Not Found Error
If you see "Failed to launch browser" errors:

1. **Set the executable path** (Linux):
   ```bash
   export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
   pnpm test-server
   ```

2. **Or install Chrome/Chromium**:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install chromium-browser

   # macOS
   brew install chromium
   ```

### Port Already in Use
If port 8080 or 3000 is already in use:

```bash
# Change backend port
PORT=8081 pnpm test-server

# Change frontend port (edit vite.config.ts)
# Update server.port to desired port
```

### Tests Timing Out
- Ensure both frontend and backend are running
- Check that the baseUrl is accessible
- Increase timeout in test configuration if needed

### API Connection Errors
- Verify backend is running on port 8080
- Check CORS settings if running on different origins
- Ensure proxy configuration in vite.config.ts is correct

## Development

### Adding New Tests

1. Open `puppeteer/tests/critical-journeys.test.ts`
2. Add a new test method to the `PuppeteerTestSuite` class:

```typescript
async testMyNewFeature(): Promise<TestResult> {
  return this.runTest('My New Feature Test', async (page) => {
    const steps: string[] = [];

    steps.push('Navigating to the app');
    await page.goto(this.baseUrl, { waitUntil: 'networkidle0' });

    // Add your test logic here
    steps.push('Testing feature...');

    return { steps };
  });
}
```

3. Add the test to `runAllTests()`:

```typescript
const testResults = await Promise.all([
  this.testPageLoad(),
  this.testHeaderNavigation(),
  // ... other tests
  this.testMyNewFeature(), // Add here
]);
```

4. Update the backend server to support running the test individually (optional)

### Modifying the UI

The Self-Test UI is located in `src/components/SelfTest.tsx`. Key features:

- Real-time status polling (2-second interval)
- Expandable test details
- Screenshot display
- Error handling

## Performance Considerations

- Tests run sequentially by default (can be modified to run in parallel)
- Screenshots are base64-encoded (can be large)
- API polling interval: 2 seconds
- Default test timeout: 30 seconds per test
- Overall timeout: 2 minutes

## CI/CD Integration

To integrate with CI/CD pipelines:

```bash
# Run tests headless without UI
curl -X POST http://localhost:8080/api/tests/run \
  -H "Content-Type: application/json" \
  -d '{"baseUrl": "http://localhost:3000"}' && \
  sleep 30 && \
  curl http://localhost:8080/api/tests/results | jq '.failed' | \
  xargs -I {} test {} -eq 0
```

## License

MIT License - See LICENSE file for details
