
# Testing Guide: AI @ TechBridge Portal

## 1. Automated Unit Tests
Component tests are located in `tests/*.test.tsx`.
- `npm test` runs the Jest suite.
- Coverage targets: 85% for business logic.

## 2. End-to-End (E2E) Testing
Using Playwright for browser automation.
```javascript
// Example Test Script
const playwright = require('playwright');
(async () => {
  const browser = await playwright.launch();
  const page = await browser.newPage();
  await page.goto('https://ai.techbridge.edu');
  await page.screenshot({path: 'homepage.png'});
  await browser.close();
})();
```

## 3. Manual Health Checks
Use the "Verify" tab in the Navbar to run internal system diagnostics.
