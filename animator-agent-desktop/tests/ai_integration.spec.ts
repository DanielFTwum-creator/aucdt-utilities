import { test, expect } from '@playwright/test';

test.describe('AI Integration Recording', () => {
  test('capture demonstration', async ({ page }) => {
    test.setTimeout(60000);

    // 1. Load the application
    await page.goto('/');
    await expect(page.getByText('Animator Agent')).toBeVisible();
    await page.waitForTimeout(2000);

    // 2. Locate Agent Input
    const agentInput = page.getByPlaceholder('Enter new animation instruction...');
    
    // 3. Enter Instruction slowly
    await agentInput.click();
    const instruction = 'Enhance lighting and add camera shake';
    for (const char of instruction) {
      await page.keyboard.type(char);
      await page.waitForTimeout(50);
    }
    await page.waitForTimeout(2000);

    // 4. Submit
    await page.keyboard.press('Enter');

    // 5. Wait for the processing state to show up and then finish
    // We'll just wait for a fixed time to ensure it's captured
    await page.waitForTimeout(8000);

    // 6. Demonstrate timeline result (visual check)
    await page.waitForTimeout(4000);
  });
});
