# LECTURER AI — TESTING & QUALITY ASSURANCE PROTOCOL
## DOCUMENT REF: TUC-TST-GUIDE-2026
### FRAMEWORK: Playwright, Vitest, Interactive Browser Testing Suite

---

## 1. STRATEGIC QA BOUNDARIES
To guarantee the reliability of the **LecturerAI** training workbook, the system includes three layers of quality assurance checks:
1.  **On-Premise Health checks**: Quick endpoint checks of the service wrapper.
2.  **Playwright Regression Browser Tests**: Programmatic simulated actions in headless Chrome/WebKit.
3.  **Interactive Test Runner**: Integrated browser-level tester permitting workshops and audits to trigger checks in one click.

---

## 2. SERVICE HEALTH-CHECK CONFIGURATION
The Node.js/Express server includes an automated health status endpoint.

### Endpoint Telemetry
*   **Path**: `/api/health`
*   **Port Binding**: `3000`
*   **Method**: `GET`
*   **Successful Response (HTTP 200)**:
    ```json
    {
      "status": "ok",
      "timestamp": "2026-07-11T22:12:05.123Z",
      "environment": "production"
    }
    ```

---

## 3. PLAYWRIGHT REGRESSION TESTING SUITE

We use Playwright to simulate lecturer interactions. Below is the complete test script to verify authentication boundaries, PDF handout creation, and briefcase persistence.

Save this script at `tests/lecturer_ai_regression.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('LecturerAI Core Integration Checks', () => {
  const TARGET_URL = 'http://localhost:3000';

  // 1. Verify Onboarding Tour and Block Navigation
  test('should load onboarding tabs and switch content blocks', async ({ page }) => {
    await page.goto(TARGET_URL);
    
    // Check main title
    await expect(page.locator('text=University College AI Ambassadors')).toBeVisible();

    // Navigate to Prompt Library
    const libraryTab = page.locator('#onboarding-tab-templates');
    await expect(libraryTab).toBeVisible();
    await libraryTab.click();
    
    // Confirm template library search view
    await expect(page.locator('text=Take-Away Prompt Templates Library')).toBeVisible();
  });

  // 2. Test jsPDF Handout Generation
  test('should permit PDF handout generation for active templates', async ({ page }) => {
    await page.goto(TARGET_URL);
    
    // Switch to Prompt Library
    await page.locator('#onboarding-tab-templates').click();
    
    // Locate the Export PDF button
    const pdfBtn = page.locator('button:has-text("Export Handout PDF")');
    await expect(pdfBtn).toBeVisible();
    
    // Run the generator and capture download hook
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      pdfBtn.click()
    ]);
    
    expect(download.suggestedFilename()).toContain('handout.pdf');
  });

  // 3. Verify Admin Security Auth Block
  test('should enforce password boundary on Admin Portal', async ({ page }) => {
    await page.goto(TARGET_URL);
    
    // Click on Admin Gateway
    const adminTab = page.locator('#onboarding-tab-admin');
    await expect(adminTab).toBeVisible();
    await adminTab.click();
    
    // Verify protected text is visible
    await expect(page.locator('text=Enter Administrator Key')).toBeVisible();
    
    // Try weak password
    const pwdInput = page.locator('input[type="password"]');
    await pwdInput.fill('wrong-password-123');
    await page.locator('button:has-text("Unlock Admin Panel")').click();
    
    // Confirm access denied block is visible
    await expect(page.locator('text=Access Denied')).toBeVisible();

    // Try valid master credentials
    await pwdInput.fill('tuc-ict-admin-2026');
    await page.locator('button:has-text("Unlock Admin Panel")').click();
    
    // Confirm transition to secure sub-views
    await expect(page.locator('text=Audit Records')).toBeVisible();
    await expect(page.locator('text=Accessibility & W3C')).toBeVisible();
  });
});
```

---

## 4. HOW TO RUN AUTOMATED SCRIPTS
1.  **Install dependencies**:
    ```bash
    npm install -D @playwright/test
    npx playwright install
    ```
2.  **Execute the automated regression suites**:
    ```bash
    npx playwright test
    ```
3.  **View UI Execution Dashboard**:
    ```bash
    npx playwright show-report
    ```
