# Testing Guide
## Shortcut Master Application

### 1. Overview
The application uses a dual-layer testing strategy:
1. **Static Analysis**: Linting via `tsc` and `eslint`.
2. **Automated E2E Testing**: Browser automation via Playwright.

### 2. Manual Testing
- **Accessibility**: Verify theme switching (Light/Dark/High-Contrast) and keyboard navigation (Tab/Enter).
- **AI Safety**: Test the AI Assistant with off-topic queries to verify refusal guardrails.

### 3. Automated Testing (Playwright)
The Playwright suite is integrated into the Admin Dashboard.
- **Critical Path Test**:
  - Verifies home page title.
  - Verifies presence of 4 category cards.
  - Verifies navigation to sub-pages.
- **Admin Auth Test**:
  - Verifies password protection.
  - Verifies redirection to dashboard.

### 4. Running Tests via CLI
You can trigger tests via the API:
```bash
curl -X POST http://localhost:3000/api/tests/run -H "Content-Type: application/json" -d '{"testId": "critical-path"}'
```

### 5. Verification
All tests must pass before a release is considered stable.
