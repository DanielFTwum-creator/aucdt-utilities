import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const APP_URL = 'https://portal.aucdt.edu.gh/genai/6/';
const SCREENSHOTS_DIR = path.join(__dirname, 'qa_snapshots');

test.beforeAll(() => {
  if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
});

test.use({ viewport: { width: 1280, height: 1024 } });

test('TC-01: Home Page loads and renders correctly', async ({ page }) => {
  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await expect(page).toHaveTitle(/.+/);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01-HomePage.png') });
});

test('TC-02: Default Mathematics Exam flow', async ({ page }) => {
  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await page.click('button.aucdt-button-green');
  await page.waitForSelector('h3.font-bold.mb-2');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02-ExamPage.png') });
  const questionCount = await page.locator('h3.font-bold.mb-2').count();
  expect(questionCount).toBeGreaterThan(0);
});

test('TC-03: Navigation and UI elements', async ({ page }) => {
  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03-Navigation.png') });
  // Verify at least one interactive element is present
  const buttons = await page.locator('button').count();
  expect(buttons).toBeGreaterThan(0);
});

test('TC-04: Page responsiveness at mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04-Mobile.png') });
  await expect(page.locator('body')).toBeVisible();
});
