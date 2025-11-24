# Puppeteer E2E Testing Framework

## Overview

This directory contains the Puppeteer end-to-end (E2E) testing framework for ThesisAI Frontend. The framework provides comprehensive automated testing with real-time results, screenshot capture, and an interactive frontend interface.

## Features

✅ **10 Comprehensive Test Cases** covering:
- Page loading and rendering
- Header navigation elements
- Hero section display
- Feature cards rendering
- Navigation link functionality
- Button interactions
- Responsive design (mobile/desktop)
- Footer display
- Animations
- Complete user journeys

✅ **Real-time Test Execution** - Watch tests run live

✅ **Screenshot Capture** - Automatic screenshots on test completion (pass or fail)

✅ **Interactive Frontend** - "Puppeteer Self-Test" tab in the application

✅ **Detailed Results** - View test duration, status, errors, and screenshots

## Directory Structure

```
e2e/
├── puppeteer.config.ts    # Puppeteer configuration and utilities
├── tests/
│   └── app.e2e.ts        # Main E2E test suite
├── runner.ts             # CLI test runner
├── server.ts             # Test server for frontend integration
├── results/              # Test result JSON files (auto-generated)
└── README.md             # This file
```

## Prerequisites

- Node.js 18+
- pnpm 8.15.0
- Chrome/Chromium installed on the system

## Installation

Dependencies are already included in the main project:

```bash
pnpm install
```

## Running Tests

### Option 1: Command Line

Run tests from the command line:

```bash
# Run E2E tests
pnpm test:e2e
```

This will:
1. Launch a headless Chrome browser
2. Run all 10 test cases
3. Capture screenshots
4. Generate a JSON results file in `e2e/results/`
5. Display results in the console

### Option 2: Interactive Frontend

1. Start the test server:
```bash
pnpm test:e2e:server
```

2. Start the development server in another terminal:
```bash
pnpm dev
```

3. Open the app in your browser (http://localhost:3000)

4. Click "Self-Test" in the navigation

5. Click "Run Tests" to execute the test suite

6. View real-time results with screenshots

## Test Suite Details

### Test Cases

1. **Page loads successfully**
   - Verifies the application loads without errors
   - Checks for valid page title

2. **Header elements are visible**
   - Validates ThesisAI logo presence
   - Checks navigation links (Features, About)

3. **Hero section displays correctly**
   - Verifies main heading text
   - Checks "Start Assessment" button

4. **Three feature cards are rendered**
   - Validates all 3 feature cards exist
   - Checks card titles: Document Analysis, AI Evaluation, Detailed Feedback

5. **Navigation to features section works**
   - Tests anchor link navigation
   - Verifies scroll functionality

6. **Start Assessment button is clickable**
   - Tests button interaction
   - Verifies no navigation occurs (not implemented yet)

7. **Responsive design works on mobile**
   - Tests mobile viewport (375x667)
   - Validates layout in mobile view

8. **Footer displays copyright information**
   - Checks footer presence
   - Validates copyright text

9. **Page animations are present**
   - Verifies Framer Motion animations
   - Checks animation rendering

10. **Get Started button in header works**
    - Tests header button functionality
    - Validates button interaction

### Test Results

Each test result includes:
- **Name**: Test case name
- **Status**: `passed`, `failed`, or `running`
- **Duration**: Execution time in milliseconds
- **Error**: Error message (if failed)
- **Screenshot**: Base64-encoded screenshot

## Configuration

### Environment Variables

- `VITE_TEST_URL`: Base URL for testing (default: `http://localhost:3000`)
- `TEST_SERVER_PORT`: Test server port (default: `3001`)

### Browser Configuration

Browser settings in `puppeteer.config.ts`:
- Headless mode: enabled
- Viewport: 1280x720 (desktop), 375x667 (mobile)
- Flags: `--no-sandbox`, `--disable-setuid-sandbox`, `--disable-dev-shm-usage`

## API Endpoints (Test Server)

When running the test server (`pnpm test:e2e:server`):

- `POST /api/tests/run` - Start test execution
- `GET /api/tests/results` - Get test results
- `GET /api/tests/status` - Get current test status

## Troubleshooting

### Chrome not found

If you get a "Chrome not found" error, ensure Chrome/Chromium is installed:

**Ubuntu/Debian:**
```bash
sudo apt-get install chromium-browser
```

**macOS:**
```bash
brew install --cask google-chrome
```

### Port conflicts

If port 3001 is in use, set a different port:
```bash
TEST_SERVER_PORT=3002 pnpm test:e2e:server
```

### Screenshots not capturing

Ensure sufficient disk space and write permissions in the `e2e/results/` directory.

## Development

### Adding New Tests

Add new test cases in `e2e/tests/app.e2e.ts`:

```typescript
await runTest(testSuite, page, 'Test name', async () => {
  // Test logic here
  // Throw error on failure
});
```

### Customizing Configuration

Modify browser settings in `e2e/puppeteer.config.ts`:

```typescript
export async function launchBrowser(): Promise<{ browser: Browser; chrome: any }> {
  // Customize Chrome flags and Puppeteer options
}
```

## CI/CD Integration

Add to your CI/CD pipeline:

```yaml
- name: Run E2E Tests
  run: |
    pnpm install
    pnpm build
    pnpm preview &
    sleep 5
    pnpm test:e2e
```

## License

MIT License - Copyright (c) 2025 DanielFTwum-creator
