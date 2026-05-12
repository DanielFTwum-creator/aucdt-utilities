# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/e2e.spec.ts >> Compliance Workflow Dashboard >> should reset progress
- Location: tests/e2e.spec.ts:24:3

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Compliance Workflow Dashboard', () => {
  4  |   test.beforeEach(async ({ page }) => {
> 5  |     await page.goto('/');
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  6  |   });
  7  | 
  8  |   test('should load the dashboard and display framework title', async ({ page }) => {
  9  |     await expect(page.locator('h1')).toContainText('Compliance Workflow Dashboard');
  10 |   });
  11 | 
  12 |   test('should toggle phase expansion', async ({ page }) => {
  13 |     const phaseCard = page.locator('.phase-card').first();
  14 |     await phaseCard.click();
  15 |     await expect(phaseCard).toHaveClass(/expanded/);
  16 |   });
  17 | 
  18 |   test('should mark phase as complete', async ({ page }) => {
  19 |     const checkbox = page.locator('.phase-complete-checkbox').first();
  20 |     await checkbox.click();
  21 |     await expect(checkbox).toBeChecked();
  22 |   });
  23 | 
  24 |   test('should reset progress', async ({ page }) => {
  25 |     // Setup: Mark a phase complete
  26 |     await page.locator('.phase-complete-checkbox').first().click();
  27 |     
  28 |     // Act: Reset
  29 |     page.on('dialog', dialog => dialog.accept());
  30 |     await page.getByRole('button', { name: /Reset/i }).click();
  31 |     
  32 |     // Assert: Check progress bar or checkbox
  33 |     await expect(page.locator('.phase-complete-checkbox').first()).not.toBeChecked();
  34 |   });
  35 | 
  36 |   test('should open and close the help modal', async ({ page }) => {
  37 |     await page.getByRole('button', { name: /Help & Support/i }).click();
  38 |     await expect(page.getByText(/Help & Support/i)).toBeVisible();
  39 |     await page.getByRole('button', { name: /Close/i }).click();
  40 |     await expect(page.getByText(/Help & Support/i)).not.toBeVisible();
  41 |   });
  42 | 
  43 |   test('should navigate to admin panel and prompt for login', async ({ page }) => {
  44 |     await page.getByRole('button', { name: /Admin Security Panel/i }).click();
  45 |     await expect(page.locator('h2')).toContainText(/Admin Login/i);
  46 |   });
  47 | });
  48 | 
```