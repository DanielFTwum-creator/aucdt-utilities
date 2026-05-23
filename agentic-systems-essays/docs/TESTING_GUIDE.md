# Testing Operations SOP [TUC-TAB-TST]
### Document Reference: TUC-ICT-SRS-2026-103

**Institution:** Techbridge University College (TUC), Oyibi, Ghana  
**Owner:** Daniel Twum, Head of ICT  

This SOP covers running Playwright automated tests and auditing local interface accessibility standards.

---

## 🎭 Playwright End-to-End Tests
Ensure your server is live (`localhost:3000`) before running verification.

### 🛠️ E2E Test Installation
In the project directory, execute:
```bash
npm install -D @playwright/test
npx playwright install
```

### 🔐 1. Admin Authentication Test (`tests/auth.spec.ts`)
Creates a headless browser instance, accesses `/`, opens the login overlay, attempts invalid password block, and successfully authenticates using `admin123`.

```ts
import { test, expect } from '@playwright/test';

test.describe('Admin Authentication Suite', () => {
  test('should fail with invalid credentials and succeed with admin123', async ({ page }) => {
    // Go to home page
    await page.goto('http://localhost:3000');
    
    // Check if page element is visible
    await expect(page.locator('h1')).toContainText('DELEGATION LOGS');

    // Click Admin Login button
    await page.click('button[id="admin-login-btn"]');

    // Input invalid passcode
    await page.fill('input[id="admin-pw-input"]', 'wrongpass');
    await page.click('button[id="submit-auth-btn"]');

    // Verify error feedback
    await expect(page.locator('span[id="auth-error-msg"]')).toContainText('DECLINED');

    // Input valid passcode
    await page.fill('input[id="admin-pw-input"]', 'admin123');
    await page.click('button[id="submit-auth-btn"]');

    // Verify successful login
    await expect(page.locator('span[id="active-role-tag"]')).toContainText('Daniel Twum');
  });
});
```

### 🎨 2. Accessible Themes Toggle Test (`tests/theme.spec.ts`)
Verifies that selection shifts are written to `localStorage` and classes apply system-wide.

```ts
import { test, expect } from '@playwright/test';

test.describe('Accessible Theme Switching Suite', () => {
  test('should cycle themes and persist in localStorage', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Open Admin Console (must be logged in)
    await page.click('button[id="admin-login-btn"]');
    await page.fill('input[id="admin-pw-input"]', 'admin123');
    await page.click('button[id="submit-auth-btn"]');

    // Click Dark Theme toggle and verify background class
    await page.click('button[id="theme-black-toggle"]');
    await expect(page.locator('html')).toHaveClass(/dark-theme-active/);

    // Click High Contrast Theme toggle
    await page.click('button[id="theme-contrast-toggle"]');
    await expect(page.locator('html')).toHaveClass(/high-contrast-active/);

    // Refresh and check persistence in localStorage
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/high-contrast-active/);
  });
});
```

---

## ♿ Accessibility Compliance Verifications
1. **ARIA attributes:** Verify screen readers can identify sliders and form overlays. Button actions must contain `aria-label`.
2. **Contrast Levels:** All text targets must pass AAA compliance standards (Contrast Ratio 4.5:1 min for standard text, 3:1 for headers). Under the High-contrast theme, borders must be high visibility colors (e.g. bright cyan `#22d3ee` or yellow `#eab308`).
3. **Keyboard Nav:** Ensure `tabindex="0"` is preserved for focus groups on chapters index.
