import { PlaywrightScenario } from '../types';

export const SCENARIOS: PlaywrightScenario[] = [
  {
    id: 'E2E-001',
    name: 'Admin Login Flow',
    description: 'Verifies that an admin user can log in with valid credentials and is redirected to the dashboard.',
    criticality: 'HIGH',
    code: `
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // 1. Navigate to Login
  await page.goto('http://localhost:3000/#/login');
  
  // 2. Enter Credentials
  await page.type('#username', 'admin');
  await page.type('#password', 'password');
  
  // 3. Submit
  await page.click('button[type="submit"]');
  
  // 4. Verify Redirection
  await page.waitForSelector('h1'); // Dashboard header
  const title = await page.$eval('h1', el => el.textContent);
  
  if (title !== 'Active Jobs') throw new Error('Login failed');
  
  await browser.close();
})();
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
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/#/jobs/new');
  
  // 1. Fill Form
  await page.type('input[placeholder="e.g. Monthly Sales Report"]', 'Playwright Auto-Test Job');
  await page.select('select', 'PDF');
  
  // 2. Submit
  await page.click('button:has-text("Create Job")');
  
  // 3. Verify Navigation
  await page.waitForSelector('table'); // Jobs table
  
  await browser.close();
})();
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
// ...setup...
await page.goto('http://localhost:3000/#/admin/api-gateway');
await page.click('button:has-text("Global Policy")');
await page.click('#toggle-rate-limit');
const isChecked = await page.$eval('#toggle-rate-limit', el => el.checked);
console.log('Rate limit active:', isChecked);
// ...teardown...
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
// ...setup...
await page.goto('http://localhost:3000/#/admin/diagnostics');
await page.waitForSelector('h1:has-text("System Diagnostics")');
const healthChecks = await page.$$eval('[role="listitem"]', items => items.length);
if (healthChecks < 5) throw new Error('Missing health checks');
// ...teardown...
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
// ...setup...
await page.click('button[aria-label="Toggle Theme"]');
const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
await page.click('button[aria-label="Toggle Theme"]');
const isHighContrast = await page.evaluate(() => document.documentElement.classList.contains('high-contrast'));
// ...teardown...
    `,
    steps: [
      { id: 1, action: 'click', selector: 'button[aria-label="Toggle Theme"]', description: 'Click Theme Toggle (Dark)' },
      { id: 2, action: 'verify', selector: 'html.dark', description: 'Verify Dark Mode Class' },
      { id: 3, action: 'click', selector: 'button[aria-label="Toggle Theme"]', description: 'Click Theme Toggle (High Contrast)' },
      { id: 4, action: 'verify', selector: 'html.high-contrast', description: 'Verify High Contrast Class' }
    ]
  }
];