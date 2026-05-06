# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Compliance Workflow Dashboard >> should open and close the help modal
- Location: tests/e2e.spec.ts:37:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Help & Support/i })

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Compliance Workflow Dashboard', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await page.waitForLoadState('networkidle');
  7  |   });
  8  | 
  9  |   test('should load the dashboard and display framework title', async ({ page }) => {
  10 |     await expect(page.locator('h1')).toContainText('Compliance Workflow Dashboard');
  11 |   });
  12 | 
  13 |   test('should toggle phase expansion', async ({ page }) => {
  14 |     const phaseCard = page.locator('.phase-card').first();
  15 |     await phaseCard.click();
  16 |     await expect(phaseCard).toHaveClass(/expanded/);
  17 |   });
  18 | 
  19 |   test('should mark phase as complete', async ({ page }) => {
  20 |     const checkbox = page.locator('.phase-complete-checkbox').first();
  21 |     await checkbox.click();
  22 |     await expect(checkbox).toBeChecked();
  23 |   });
  24 | 
  25 |   test('should reset progress', async ({ page }) => {
  26 |     // Setup: Mark a phase complete
  27 |     await page.locator('.phase-complete-checkbox').first().click();
  28 |     
  29 |     // Act: Reset
  30 |     page.on('dialog', dialog => dialog.accept());
  31 |     await page.getByRole('button', { name: /Reset/i }).click();
  32 |     
  33 |     // Assert: Check progress bar or checkbox
  34 |     await expect(page.locator('.phase-complete-checkbox').first()).not.toBeChecked();
  35 |   });
  36 | 
  37 |   test('should open and close the help modal', async ({ page }) => {
> 38 |     await page.getByRole('button', { name: /Help & Support/i }).click();
     |                                                                 ^ Error: locator.click: Test timeout of 30000ms exceeded.
  39 |     await expect(page.getByText(/Help & Support/i)).toBeVisible();
  40 |     await page.getByRole('button', { name: /Close/i }).click();
  41 |     await expect(page.getByText(/Help & Support/i)).not.toBeVisible();
  42 |   });
  43 | 
  44 |   test('should navigate to admin panel and prompt for login', async ({ page }) => {
  45 |     await page.getByRole('button', { name: /Admin Security Panel/i }).click();
  46 |     await expect(page.locator('h2')).toContainText(/Admin Login/i);
  47 |   });
  48 | });
  49 | 
```