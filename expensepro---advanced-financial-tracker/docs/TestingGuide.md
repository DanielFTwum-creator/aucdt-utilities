
# Testing Guide: ExpensePro Lab

### Automated In-App Testing
The application includes a built-in "Testing Lab" accessible via the sidebar.
- **Goal**: Validate UI/Logic without external dependencies.
- **Execution**: Click "Run Automated Tests" to execute the standard suite.

### Playwright Integration
Use the following hook for CI/CD pipelines:
```javascript
// Example Test
it('should load dashboard', async () => {
  await page.goto(APP_URL);
  await page.waitForSelector('.recharts-surface');
});
```

### Manual QA Checklist
1. Verify Theme switching across all pages.
2. Test Receipt scanning with various image qualities.
3. Validate Budget warning triggers (80% and 100%).
