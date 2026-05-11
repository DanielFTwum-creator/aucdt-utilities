import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test('export png does not fail', async ({ page }) => {
  await page.goto('/');

  // Listen for dialogs
  page.on('dialog', dialog => {
    console.log('Dialog:', dialog.message());
    dialog.dismiss();
  });
  
  // Fill the foregroundSubject to see if it causes issues
  await page.getByPlaceholder('e.g. Confident CEO').fill('Test Subject');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('button', { hasText: 'PNG' }).click()
  ]);

  const path = await download.path();
  const stat = fs.statSync(path!);
  console.log(`Downloaded size: ${stat.size} bytes`);
  
  expect(stat.size).toBeGreaterThan(100);
});
