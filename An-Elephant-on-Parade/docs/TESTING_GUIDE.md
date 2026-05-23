# TUC Automated Testing Standards & Playwright SOP
## Document Ref: TUC-TST-GDE-2026-001
### Organisation: Techbridge University College (TUC), Oyibi, Ghana
### Approver: Daniel Twum, Head of ICT

---

## 1. Introduction
This guide contains the formal automated testing protocols, scenarios, and scripts used to verify the functional and UX integrity of the Techbridge AI Blueprint (TAB) application. It includes Playwright integration blueprints and detailed unit test cases.

---

## 2. Playwright Core Integration Setup

We use Playwright to execute high-fidelity end-to-end (E2E) testing on Chromium, WebKit, and Gecko browser engines.

### 2.1 Installing Playwright Workspace
```bash
npm install -D @playwright/test
npx playwright install
```

### 2.2 Complete Playwright Verification Script
Write the following testing script at `tests/app.spec.ts` to verify the main system features automatically.

```typescript
import { test, expect } from '@playwright/test';

test.describe('Techbridge AI Blueprint Verification', () => {

  test.beforeEach(async ({ page }) => {
    // Open target local development deployment node
    await page.goto('http://localhost:3000');
  });

  test('Verify home cover page and core navigation', async ({ page }) => {
    // 1. Confirm main brand is present
    await expect(page.locator('text=An Elephant on Parade')).toBeVisible();

    // 2. Click the prep panel button
    await page.click('text=Prep');
    await expect(page.locator('text=Facilitator Preparation')).toBeVisible();

    // 3. Click sandbox button
    await page.click('text=Sandbox');
    await expect(page.locator('text=Interactive Instrument Sandbox')).toBeVisible();
  });

  test('Verify admin passcode authentication gate', async ({ page }) => {
    // 1. Double check that we can open the admin panel
    await page.click('text=Admin Hub'); // If the admin hub is loaded in navbar
    await expect(page.locator('placeholder=Enter system passcode')).toBeVisible();

    // 2. Enter faulty passcode
    await page.fill('placeholder=Enter system passcode', 'WRONG-PASS');
    await page.click('text=Authenticate Administrator');
    await expect(page.locator('text=Invalid credentials')).toBeVisible();

    // 3. Enter real admin passcode
    await page.fill('placeholder=Enter system passcode', 'TUC-ICT-2026');
    await page.click('text=Authenticate Administrator');
    await expect(page.locator('text=ICT Security Council')).toBeVisible();
  });

  test('Verify volume slider and theme adjustments', async ({ page }) => {
    await page.click('text=Sandbox');
    
    // 1. Click mute toggle
    const muteBtn = page.locator('#virt-mute-toggle-btn');
    await expect(muteBtn).toBeVisible();
    await muteBtn.click();
    await expect(page.locator('text=Muted')).toBeVisible();

    // 2. Adjust volume slider
    const volSlider = page.locator('#master-volume-slider');
    await expect(volSlider).toBeVisible();
    await volSlider.fill('0.5'); // Set volume strictly to 50%
  });

});
```

---

## 3. Playwright Command Reference

Execute the following commands in terminal environments to launch automated sweeps:

```bash
# 1. Run all test suites headlessly:
npx playwright test

# 2. Run tests and open HTML output reports:
npx playwright test --show-report

# 3. Debugging specific test cases:
npx playwright test tests/app.spec.ts --debug
```
---
*Authorized for active curriculum validation audits at TUC.*
