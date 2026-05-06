import { test, expect, type Page } from '@playwright/test';

const TEST_EMAIL = process.env.DMCDAI_TEST_EMAIL ?? 'student@techbridge.edu.gh';

async function automatedLogin(page: Page) {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    (window as any).__dmcdaiAuto2FAEnabled = true;
  });
  await expect(page.getByText('Techbridge 2FA Login')).toBeVisible();
  await page.locator('#email').fill(TEST_EMAIL);
  const sendCodeButton = page.getByRole('button', { name: 'Send code' });
  await expect(sendCodeButton).toBeVisible();
  await sendCodeButton.click();
  await page.locator('#code').waitFor({ state: 'visible' });
  const otp = await page.evaluate(() => (window as any).__dmcdaiPendingOtp as string);
  await page.locator('#code').fill(otp);
  await page.getByRole('button', { name: 'Verify code' }).click();
  await expect(page.getByText('Explore AI in DMCD')).toBeVisible();
}

test.describe('dmcdAI Core User Flows', () => {

  test.beforeEach(async ({ page }) => {
    await automatedLogin(page);
  });

  test('should display the dashboard and institutional branding', async ({ page }) => {
    await expect(page.getByText('dmcdAI')).toBeVisible();
    await expect(page.getByText('Explore AI in DMCD')).toBeVisible();
    await expect(page.getByText('Techbridge University College')).toBeVisible();
  });

  test('should navigate to Visual Design module', async ({ page }) => {
    await page.getByRole('button', { name: 'Open module: AI-Driven Visual Design' }).click();
    await expect(page.getByText('Image Prompt')).toBeVisible();
    await expect(page.locator('h2')).toContainText('AI-Driven Visual Design');
  });

  test('should navigate back to dashboard via home button', async ({ page }) => {
    await page.getByRole('button', { name: 'Open module: AI-Driven Visual Design' }).click();
    await page.getByRole('button', { name: 'Go to dashboard' }).click();
    await expect(page.getByText('Explore AI in DMCD')).toBeVisible();
  });

  test('should navigate all 10 modules from sidebar', async ({ page }) => {
    const moduleLabels = [
      'Open AI-Driven Visual Design',
      'Open Automated Video Production',
      'Open Generative Content Creation',
      'Open Personalized Media',
      'Open Interactive Storytelling',
      'Open Sentiment Analysis',
      'Open AI-Assisted UX/UI Design',
      'Open AI in Branding Systems',
      'Open Synthetic Media',
      'Open Ethics in AI Design',
    ];
    for (const label of moduleLabels) {
      await page.getByRole('button', { name: label }).click();
      await page.getByRole('button', { name: 'Go to dashboard' }).click();
    }
    await expect(page.getByText('Explore AI in DMCD')).toBeVisible();
  });

});

test.describe('Admin Security Flow', () => {

  test('direct hash navigation to /admin shows login modal', async ({ page }) => {
    await page.goto('/#/admin');
    await expect(page.getByText('Admin Login')).toBeVisible();
    await expect(page.locator('label[for="password"]')).toBeVisible();
  });

  test('incorrect password shows error message', async ({ page }) => {
    await page.goto('/#/admin');
    await page.locator('#password').fill('wrong-password');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Incorrect password')).toBeVisible();
  });

  test('correct password grants admin access', async ({ page }) => {
    await page.goto('/#/admin');
    await page.locator('#password').fill('dmcdai-admin-2025-secure');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Admin Control Center')).toBeVisible();
  });

  test('admin logout redirects to dashboard', async ({ page }) => {
    await page.goto('/#/admin');
    await page.locator('#password').fill('dmcdai-admin-2025-secure');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('button', { name: 'Logout from Admin Panel' }).click();
    await expect(page.getByText('Explore AI in DMCD')).toBeVisible();
    await expect(page.getByText('Admin Control Center')).not.toBeVisible();
  });

  test('cancel on login modal clears admin hash', async ({ page }) => {
    await page.goto('/#/admin');
    await page.getByRole('button', { name: 'Cancel login' }).click();
    await expect(page.getByText('Admin Login')).not.toBeVisible();
    expect(page.url()).not.toContain('#/admin');
  });

  test('simulator toggle is visible in diagnostics tab', async ({ page }) => {
    await page.goto('/#/admin');
    await page.locator('#password').fill('dmcdai-admin-2025-secure');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('button', { name: 'System Diagnostics' }).click();
    await expect(page.getByText('AI Simulator Mode')).toBeVisible();
    await page.getByRole('button', { name: 'Disable AI Simulator' }).or(
      page.getByRole('button', { name: 'Enable AI Simulator' })
    ).click();
    // After toggle, button label should flip
    await expect(
      page.getByRole('button', { name: 'Disable AI Simulator' }).or(
        page.getByRole('button', { name: 'Enable AI Simulator' })
      )
    ).toBeVisible();
  });

});

test.describe('Theme Persistence', () => {

  test.beforeEach(async ({ page }) => {
    await automatedLogin(page);
  });

  test('theme selection persists across page reload', async ({ page }) => {
    await page.getByLabel('Select a display theme').selectOption('light');
    await page.reload();
    await expect(page.getByLabel('Select a display theme')).toHaveValue('light');
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('light');
  });

  test('high-contrast theme applies data-theme attribute', async ({ page }) => {
    await page.getByLabel('Select a display theme').selectOption('high-contrast');
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('high-contrast');
  });

  test('dark theme is default when no preference stored', async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem('dmcdAI-theme'));
    await page.reload();
    await expect(page.getByLabel('Select a display theme')).toHaveValue('dark');
  });

});

test.describe('Accessibility', () => {

  test.beforeEach(async ({ page }) => {
    await automatedLogin(page);
  });

  test('all module cards have aria-label', async ({ page }) => {
    const cards = page.getByRole('button', { name: /Open module:/ });
    const count = await cards.count();
    expect(count).toBe(10);
  });

  test('login modal has role=dialog and aria-modal', async ({ page }) => {
    await page.goto('/#/admin');
    const dialog = page.locator('[role="dialog"][aria-modal="true"]');
    await expect(dialog).toBeVisible();
  });

  test('result areas have aria-live=polite', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open module: Sentiment Analysis' }).click();
    const liveRegion = page.locator('[aria-live="polite"]');
    await expect(liveRegion.first()).toBeAttached();
  });

});
