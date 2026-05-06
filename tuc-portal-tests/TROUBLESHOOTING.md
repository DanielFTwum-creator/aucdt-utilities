# Troubleshooting Guide

Common issues and solutions for AUCDT Portal Testing Suite.

## Installation Issues

### 1. Node.js Not Found

**Error**: `node: command not found` or `npm: command not found`

**Solution**:
- Install Node.js v18 or higher from https://nodejs.org/
- Verify installation: `node -v` and `npm -v`
- Restart terminal after installation

### 2. Playwright Installation Fails

**Error**: `Failed to install browsers`

**Solution**:
```bash
# Try with sudo (Linux/Mac)
sudo npx playwright install --with-deps

# Or install specific browser
npx playwright install chromium

# Windows: Run as Administrator
npx playwright install
```

### 3. Permission Denied (Linux/Mac)

**Error**: `EACCES: permission denied`

**Solution**:
```bash
# Fix npm permissions
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules

# Or use sudo
sudo npm install
```

## Test Execution Issues

### 1. Tests Timeout

**Error**: `Test timeout of 30000ms exceeded`

**Solution**:
- Increase timeout in `playwright.config.ts`:
```typescript
timeout: 60 * 1000,  // 60 seconds
```
- Or for specific test:
```typescript
test('my test', async ({ page }) => {
  test.setTimeout(60000);
  // test code
});
```

### 2. Element Not Found

**Error**: `Timeout 30000ms exceeded waiting for selector`

**Solution**:
```typescript
// Add explicit wait
await page.waitForSelector('#element', { timeout: 10000 });

// Or check if element exists first
if (await page.isVisible('#element')) {
  await page.click('#element');
}

// Update selector in page object
this.element = page.locator('better-selector').first();
```

### 3. Tests Fail in Headless Mode

**Error**: Tests pass in headed mode but fail in headless

**Solution**:
```bash
# Run in headed mode to debug
npm run test:headed

# Check for timing issues
# Add proper waits:
await page.waitForLoadState('networkidle');
```

### 4. Flaky Tests

**Error**: Tests sometimes pass, sometimes fail

**Solution**:
- Remove hard-coded timeouts
- Use explicit waits:
```typescript
// Bad
await page.waitForTimeout(5000);

// Good
await page.waitForSelector('#element');
await page.waitForLoadState('networkidle');
```
- Add retry logic in `playwright.config.ts`:
```typescript
retries: 2,
```

## Browser Issues

### 1. Browser Not Found

**Error**: `Executable doesn't exist`

**Solution**:
```bash
# Reinstall browsers
npx playwright install

# Or specific browser
npx playwright install chromium
```

### 2. Browser Crashes

**Error**: `Browser closed unexpectedly`

**Solution**:
```bash
# Install system dependencies (Linux)
npx playwright install-deps

# Check system resources
# Close other applications
# Increase system memory if in VM/Docker
```

### 3. Wrong Browser Version

**Error**: Browser version mismatch

**Solution**:
```bash
# Update Playwright
npm update @playwright/test

# Reinstall browsers
npx playwright install
```

## Network Issues

### 1. Cannot Access Test URL

**Error**: `net::ERR_CONNECTION_REFUSED`

**Solution**:
- Verify URL is correct in `.env`
- Check if portal is accessible manually
- Check network/firewall settings
- Verify VPN connection if required

### 2. SSL Certificate Errors

**Error**: `SSL certificate problem`

**Solution**:
```typescript
// In playwright.config.ts
use: {
  ignoreHTTPSErrors: true,
}
```

### 3. Slow Network

**Error**: Tests timeout due to slow loading

**Solution**:
```typescript
// Increase navigation timeout
use: {
  navigationTimeout: 60000,
}
```

## Environment Variable Issues

### 1. Environment Variables Not Loaded

**Error**: Tests using default values instead of .env

**Solution**:
```bash
# Install dotenv
npm install dotenv

# Create .env file
cp .env.example .env

# Edit with your values
nano .env
```

### 2. Credentials Not Working

**Error**: Login fails with correct credentials

**Solution**:
- Verify credentials in `.env`
- Check for extra spaces
- Verify account is not locked
- Test login manually first

## Docker Issues

### 1. Docker Build Fails

**Error**: `Cannot build Docker image`

**Solution**:
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### 2. Permission Issues in Docker

**Error**: Cannot write to mounted volumes

**Solution**:
```yaml
# In docker-compose.yml, add user
services:
  playwright-tests:
    user: "${UID}:${GID}"
```

## CI/CD Issues

### 1. GitHub Actions Fails

**Error**: Tests fail in GitHub Actions

**Solution**:
- Add secrets in GitHub repository settings
- Check workflow file syntax
- Verify Node.js version matches local
- Check browser installation step

### 2. No Test Reports Generated

**Error**: Cannot find test reports

**Solution**:
```yaml
# Ensure upload artifact step is present
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Screenshot/Video Issues

### 1. Screenshots Not Saved

**Error**: No screenshots in test-results

**Solution**:
```typescript
// In playwright.config.ts
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}

// Create directory
mkdir -p test-results/screenshots
```

### 2. Screenshots Don't Match (Visual Regression)

**Error**: Visual comparison failing

**Solution**:
```bash
# Update baseline screenshots
npx playwright test --update-snapshots

# Or increase tolerance
await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });
```

## TypeScript Issues

### 1. TypeScript Compilation Errors

**Error**: `Cannot find module` or type errors

**Solution**:
```bash
# Reinstall types
npm install --save-dev @types/node

# Clear cache
npm cache clean --force
rm -rf node_modules
npm install
```

### 2. Import Errors

**Error**: Cannot import from local files

**Solution**:
```typescript
// Use correct relative paths
import { LoginPage } from '../utils/LoginPage';

// Check tsconfig.json paths are correct
```

## Performance Issues

### 1. Tests Running Slowly

**Problem**: Tests take too long

**Solution**:
```typescript
// Enable parallel execution in playwright.config.ts
workers: 4,
fullyParallel: true,

// Reduce waiting time
use: {
  actionTimeout: 5000,
}
```

### 2. High Memory Usage

**Problem**: System running out of memory

**Solution**:
- Reduce parallel workers
- Run fewer browser projects
- Close other applications
- Increase system memory

## Debugging Tips

### Enable Debug Mode

```bash
# Debug specific test
DEBUG=pw:api npx playwright test

# Full debug output
DEBUG=* npx playwright test

# UI mode (recommended)
npm run test:ui
```

### Use Playwright Inspector

```bash
# Debug mode with inspector
npm run test:debug

# Or
PWDEBUG=1 npx playwright test
```

### Check Playwright Logs

```bash
# Enable verbose logging
DEBUG=pw:browser* npx playwright test
```

### Generate Test Code

```bash
# Use codegen to generate selectors
npm run test:codegen
```

## Getting Help

If none of these solutions work:

1. **Check Playwright Documentation**
   - https://playwright.dev/docs/intro

2. **Search GitHub Issues**
   - https://github.com/microsoft/playwright/issues

3. **Check Application Logs**
   ```bash
   # View test results
   cat test-results/results.json
   ```

4. **Enable Verbose Logging**
   ```bash
   DEBUG=pw:* npm test
   ```

5. **Create an Issue**
   - Include error message
   - Include steps to reproduce
   - Include environment details:
     ```bash
     node -v
     npm -v
     npx playwright --version
     ```

## Quick Fixes Checklist

Before asking for help, try these:

- [ ] Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- [ ] Reinstall browsers: `npx playwright install`
- [ ] Clear Playwright cache: `rm -rf ~/.cache/ms-playwright`
- [ ] Update Playwright: `npm update @playwright/test`
- [ ] Check `.env` file exists and has correct values
- [ ] Verify test URL is accessible in browser
- [ ] Run single test to isolate issue: `npx playwright test tests/login.spec.ts`
- [ ] Try headed mode: `npm run test:headed`
- [ ] Check for system updates
- [ ] Restart computer (yes, really!)

## Still Having Issues?

Provide this information when asking for help:

```bash
# System information
node -v
npm -v
npx playwright --version
cat /etc/os-release  # Linux
sw_vers             # macOS
ver                 # Windows

# Error output
npm test 2>&1 | tee error.log
```

---

**Last Updated**: Check README.md for latest version
