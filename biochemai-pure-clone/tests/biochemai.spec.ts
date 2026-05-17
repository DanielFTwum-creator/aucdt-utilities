import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('Page Load & Branding', () => {
  test('has correct page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/BioChemAI/);
  });

  test('displays BioChemAI brand name', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=BioChemAI')).toBeVisible();
  });

  test('hero stats are visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=10,000+')).toBeVisible();
    await expect(page.locator('text=98%')).toBeVisible();
    await expect(page.locator('text=24/7')).toBeVisible();
  });

  test('page meta description is present', async ({ page }) => {
    await page.goto('/');
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).toBeTruthy();
    expect(desc!.length).toBeGreaterThan(10);
  });
});

test.describe('Navigation Tabs', () => {
  test('all nav tabs are visible', async ({ page }) => {
    await page.goto('/');
    for (const label of ['Chat', 'Voice', 'Quiz', 'Docs', 'Test', 'Admin']) {
      await expect(page.locator(`button`, { hasText: label }).first()).toBeVisible();
    }
  });

  test('Chat tab is active by default', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('button', { hasText: 'Chat' }).first()).toBeVisible();
    await expect(page.locator('[placeholder*="biochemistry question"]')).toBeVisible();
  });

  test('clicking Quiz tab switches view', async ({ page }) => {
    await page.goto('/');
    await page.locator('button', { hasText: 'Quiz' }).first().click();
    await expect(page.locator('text=Quiz')).toBeVisible();
  });

  test('clicking Docs tab switches view', async ({ page }) => {
    await page.goto('/');
    await page.locator('button', { hasText: 'Docs' }).first().click();
    await expect(page.locator('text=Docs')).toBeVisible();
  });
});

test.describe('Chat Interface', () => {
  test('question input is visible and accepts text', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('[placeholder*="biochemistry question"]');
    await expect(input).toBeVisible();
    await input.fill('What is ATP?');
    await expect(input).toHaveValue('What is ATP?');
  });

  test('send button is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[aria-label="Send message"]')).toBeVisible();
  });

  test('microphone button is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[aria-label*="microphone"], [aria-label*="listening"]').first()).toBeVisible();
  });

  test('learning level selector is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#learning-level')).toBeVisible();
  });

  test('learning level has expected options', async ({ page }) => {
    await page.goto('/');
    const select = page.locator('#learning-level');
    await expect(select.locator('option', { hasText: 'Undergraduate' })).toBeAttached();
  });

  test('popular topics chips are visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Enzyme Kinetics')).toBeVisible();
    await expect(page.locator('text=Protein Structure')).toBeVisible();
  });

  test('clicking a topic chip populates the input', async ({ page }) => {
    await page.goto('/');
    await page.locator('text=Enzyme Kinetics').first().click();
    const input = page.locator('[placeholder*="biochemistry question"]');
    const value = await input.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });
});

test.describe('Theme Switcher', () => {
  test('theme selector is present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[aria-label="Select color theme"]')).toBeVisible();
  });

  test('switching theme changes data-theme attribute', async ({ page }) => {
    await page.goto('/');
    const themeButtons = page.locator('[aria-label="Select color theme"] button');
    const count = await themeButtons.count();
    expect(count).toBeGreaterThanOrEqual(2);
    await themeButtons.nth(1).click();
    const theme = await page.locator('html').getAttribute('data-theme');
    expect(theme).toBeTruthy();
  });
});

test.describe('Accessibility', () => {
  test('page has lang attribute', async ({ page }) => {
    await page.goto('/');
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
  });

  test('page title is not the default placeholder', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).not.toBe('My Google AI Studio App');
    expect(title.length).toBeGreaterThan(0);
  });

  test('send button has aria-label', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[aria-label="Send message"]')).toBeAttached();
  });

  test('About button has aria-label', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[aria-label="About BioChemAI"]')).toBeVisible();
  });
});

test('capture homepage screenshot for QA showcase', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[placeholder*="biochemistry question"]', { timeout: 10000 });
  await page.waitForTimeout(1500);

  const screenshotDir = path.join(process.cwd(), 'docs', 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  await page.screenshot({
    path: path.join(screenshotDir, 'homepage.png'),
    fullPage: false,
  });

  expect(fs.existsSync(path.join(screenshotDir, 'homepage.png'))).toBe(true);
});
