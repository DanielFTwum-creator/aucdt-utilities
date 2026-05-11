# TESTING GUIDE
## LinkScan Techbridge

### 1. E2E Testing with Playwright
The application uses Playwright for end-to-end verification.

### 2. Running Tests
Tests are located in `/tests/e2e.test.ts`.

```bash
# Run all tests
npx playwright test
```

### 3. Key Test Scenarios
- **Title Verification:** Confirms the institutional branding is correct.
- **Auth Flow:** Verifies the `/admin` login blocks unauthorized access.
- **Link Integrity:** Ensures the scan engine correctly interfaces with the proxy.

### 4. Internal Diagnostics
The Admin Dashboard contains a "Diagnostics" tab for executing institutional integrity tests and viewing mock system health.
