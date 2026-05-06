import { PuppeteerScenario } from '../types';

export const SCENARIOS: PuppeteerScenario[] = [
  {
    id: 'E2E-001',
    name: 'Admin Login Flow',
    description: 'Verifies that an admin user can log in with valid credentials and is redirected to the dashboard.',
    criticality: 'HIGH',
    code: `
import { test, expect } from '@playwright/test';

test('Admin Login Flow', async ({ page }) => {
  // 1. Navigate to Login
  await page.goto('/#/login');

  // 2. Enter Credentials
  await page.locator('#username').fill('admin');
  await page.locator('#password').fill('password');

  // 3. Submit
  await page.locator('button[type="submit"]').click();

  // 4. Verify Redirection
  const title = await page.locator('h1').textContent();
  expect(title).toBe('Active Jobs');
});
    `,
    steps: [
      { id: 1, action: 'goto', selector: '/#/login', description: 'Navigate to Login Page' },
      { id: 2, action: 'type', selector: '#username', description: 'Type Username' },
      { id: 3, action: 'type', selector: '#password', description: 'Type Password' },
      { id: 4, action: 'click', selector: 'button[type="submit"]', description: 'Click Login Button' },
      { id: 5, action: 'waitFor', selector: '/dashboard', description: 'Wait for Dashboard Redirection' }
    ]
  },
  {
    id: 'E2E-002',
    name: 'Create New Job',
    description: 'Ensures the job creation form submits correctly and validates input.',
    criticality: 'HIGH',
    code: `
import { test, expect } from '@playwright/test';

test('Create New Job', async ({ page }) => {
  await page.goto('/#/jobs/new');

  // 1. Fill Form
  await page.locator('input[placeholder="e.g. Monthly Sales Report"]').fill('Playwright Auto-Test Job');
  await page.locator('select').selectOption('PDF');

  // 2. Submit
  await page.getByRole('button', { name: 'Create Job' }).click();

  // 3. Verify Navigation
  await expect(page.locator('table')).toBeVisible();
});
    `,
    steps: [
      { id: 1, action: 'goto', selector: '/#/jobs/new', description: 'Navigate to New Job Page' },
      { id: 2, action: 'type', selector: 'input[name="name"]', description: 'Enter Job Name' },
      { id: 3, action: 'select', selector: 'select[name="format"]', description: 'Select PDF Format' },
      { id: 4, action: 'click', selector: 'button.create-job', description: 'Submit Form' },
      { id: 5, action: 'assert', expected: '/jobs', description: 'Verify Redirect to Job List' }
    ]
  },
  {
    id: 'E2E-003',
    name: 'API Gateway Rate Limit',
    description: 'Checks if rate limiting controls can be toggled via the UI.',
    criticality: 'MEDIUM',
    code: `
import { test, expect } from '@playwright/test';

test('API Gateway Rate Limit Toggle', async ({ page }) => {
  await page.goto('/#/admin/api-gateway');
  await page.getByRole('button', { name: 'Global Policy' }).click();
  await page.locator('#toggle-rate-limit').click();
  const isChecked = await page.locator('#toggle-rate-limit').isChecked();
  console.log('Rate limit active:', isChecked);
});
    `,
    steps: [
      { id: 1, action: 'goto', selector: '/#/admin/api-gateway', description: 'Go to API Gateway' },
      { id: 2, action: 'click', selector: 'tab-settings', description: 'Switch to Settings Tab' },
      { id: 3, action: 'click', selector: '#toggle', description: 'Toggle Rate Limit Switch' },
      { id: 4, action: 'verify', selector: '#toggle', description: 'Verify Switch State Changed' }
    ]
  },
  {
    id: 'E2E-004',
    name: 'Verify Diagnostics',
    description: 'Navigates to Diagnostics page and verifies all component health checks are visible.',
    criticality: 'MEDIUM',
    code: `
import { test, expect } from '@playwright/test';

test('Verify Diagnostics', async ({ page }) => {
  await page.goto('/#/admin/diagnostics');
  await expect(page.locator('h1', { hasText: 'System Diagnostics' })).toBeVisible();
  const healthChecks = await page.locator('[role="listitem"]').count();
  expect(healthChecks).toBeGreaterThanOrEqual(5);
});
    `,
    steps: [
      { id: 1, action: 'goto', selector: '/#/admin/diagnostics', description: 'Navigate to Diagnostics' },
      { id: 2, action: 'waitFor', selector: 'h1', description: 'Wait for Header' },
      { id: 3, action: 'count', selector: '[role="listitem"]', description: 'Count Health Check Items' },
      { id: 4, action: 'assert', expected: '>= 5', description: 'Verify at least 5 checks present' }
    ]
  },
  {
    id: 'E2E-005',
    name: 'Theme Toggle Accessibility',
    description: 'Toggles between Light, Dark, and High-Contrast modes.',
    criticality: 'LOW',
    code: `
import { test, expect } from '@playwright/test';

test('Theme Toggle Accessibility', async ({ page }) => {
  await page.goto('/');
  await page.locator('button[aria-label="Toggle Theme"]').click();
  const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  expect(isDark).toBe(true);

  await page.locator('button[aria-label="Toggle Theme"]').click();
  const isHighContrast = await page.evaluate(() => document.documentElement.classList.contains('high-contrast'));
  expect(isHighContrast).toBe(true);
});
    `,
    steps: [
      { id: 1, action: 'click', selector: 'button[aria-label="Toggle Theme"]', description: 'Click Theme Toggle (Dark)' },
      { id: 2, action: 'verify', selector: 'html.dark', description: 'Verify Dark Mode Class' },
      { id: 3, action: 'click', selector: 'button[aria-label="Toggle Theme"]', description: 'Click Theme Toggle (High Contrast)' },
      { id: 4, action: 'verify', selector: 'html.high-contrast', description: 'Verify High Contrast Class' }
    ]
  }
];
