# TechBridge Clinical Platform - Testing Guide

## 1. Overview
This guide details the testing strategies employed to ensure the reliability, security, and clinical accuracy of the TechBridge platform.

## 2. Automated Testing (E2E)
We use **Playwright** for End-to-End (E2E) testing to simulate real user interactions.

### 2.1 Critical User Journeys
The test suite (`tests/e2e.test.js`) validates the following scenarios:
1.  **Home Page Load**: Verifies the dashboard renders without crashing.
2.  **Theme Toggle**: Ensures Light/Dark/High-Contrast modes switch correctly.
3.  **Settings Modal**: Tests opening, rendering, and closing the configuration modal.
4.  **Admin Login**: Validates credential authentication and redirection.

### 2.2 Running Tests
#### Via CLI
```bash
node tests/e2e.test.js
```

#### Via Admin Interface
1.  Log in to `/admin/login`.
2.  Navigate to **Testing Suite**.
3.  Click **Run E2E Suite**.
4.  View live logs and generated screenshots.

### 2.3 Artifacts
- **Screenshots**: Saved to `public/screenshots/`.
- **Logs**: Displayed in the Admin Console.

## 3. Manual Verification Checklist
### 3.1 Clinical Dashboard
- [ ] Verify "Est. 2015" in masthead.
- [ ] Check "Avg Glucose" calculation matches data.
- [ ] Ensure Chart renders all data points.

### 3.2 Data Tools
- [ ] **Export**: Download CSV and verify headers.
- [ ] **Import**: Upload valid JSON and check Data Log update.
- [ ] **Scan**: Upload meter image and verify AI extraction accuracy.

### 3.3 Accessibility
- [ ] **High Contrast**: Switch theme and verify yellow/black palette.
- [ ] **Keyboard Nav**: Tab through all interactive elements.
- [ ] **Screen Reader**: Verify ARIA labels on buttons.

## 4. React Compliance
- **Requirement**: React 19.2.4
- **Verification**: Check `package.json` and browser console for version warnings.
