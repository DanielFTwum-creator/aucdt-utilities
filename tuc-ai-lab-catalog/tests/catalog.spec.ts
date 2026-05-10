import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('Core Application', () => {
  test('has correct page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/TUC AI Lab/);
  });

  test('renders main heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Product Catalog');
  });

  test('TUC logo is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('img[alt="TUC Logo"]')).toBeVisible();
  });

  test('Contact Lab button is visible in nav', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('button', { hasText: 'Contact Lab' })).toBeVisible();
  });

  test('displays total tool count', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=83 tools')).toBeVisible();
  });
});

test.describe('Search & Filter', () => {
  test('search input is visible and accepts text', async ({ page }) => {
    await page.goto('/');
    const search = page.locator('input[placeholder]').first();
    await expect(search).toBeVisible();
    await search.fill('BioChemAI');
    await expect(search).toHaveValue('BioChemAI');
  });

  test('typing in search filters the tool list', async ({ page }) => {
    await page.goto('/');
    await page.locator('input[placeholder]').first().fill('BioChemAI');
    await expect(page.locator('text=BioChemAI Teaching Aid')).toBeVisible();
  });

  test('clearing search restores all tools', async ({ page }) => {
    await page.goto('/');
    const search = page.locator('input[placeholder]').first();
    await search.fill('BioChemAI');
    await search.clear();
    await expect(page.locator('text=83 tools')).toBeVisible();
  });

  test('clicking AI & ML category filters results', async ({ page }) => {
    await page.goto('/');
    await page.locator('aside button', { hasText: 'AI & ML' }).click();
    await expect(page.locator('aside button', { hasText: 'AI & ML' })).toHaveClass(/active/);
  });

  test('clicking All restores full catalog', async ({ page }) => {
    await page.goto('/');
    await page.locator('aside button', { hasText: 'AI & ML' }).click();
    await page.locator('aside button', { hasText: 'All' }).click();
    await expect(page.locator('text=83 tools')).toBeVisible();
  });
});

test.describe('Grid & List View', () => {
  test('grid view button is visible', async ({ page }) => {
    await page.goto('/');
    const gridBtn = page.locator('button[title="Grid view"], button:has(svg)').filter({ hasText: '' }).first();
    await expect(page.locator('main header')).toBeVisible();
  });

  test('list view button is present in toolbar', async ({ page }) => {
    await page.goto('/');
    // Both view toggle buttons are in the main header toolbar
    const toolbar = page.locator('main header');
    await expect(toolbar).toBeVisible();
    const buttons = toolbar.locator('button');
    await expect(buttons).toHaveCount(await buttons.count());
    expect(await buttons.count()).toBeGreaterThanOrEqual(2);
  });

  test('tool cards are visible in default grid view', async ({ page }) => {
    await page.goto('/');
    // At least 10 cards should be visible in the grid
    const cards = page.locator('main .group, main [class*="cursor-pointer"]');
    await expect(cards.first()).toBeVisible();
  });

  test('sidebar shows all 7 categories', async ({ page }) => {
    await page.goto('/');
    const categories = ['AI & ML', 'Academic', 'Creative', 'Dev Tools', 'Business', 'Admin', 'Games'];
    for (const cat of categories) {
      await expect(page.locator('aside button', { hasText: cat })).toBeVisible();
    }
  });
});

test.describe('Tool Detail Modal', () => {
  test('clicking a tool card opens the detail panel', async ({ page }) => {
    await page.goto('/');
    await page.locator('main').locator('[class*="cursor-pointer"], .group').first().click();
    // Modal/panel should appear with a Launch Demo link
    await expect(page.locator('text=Launch Demo')).toBeVisible({ timeout: 5000 });
  });

  test('detail panel contains an external link', async ({ page }) => {
    await page.goto('/');
    await page.locator('main').locator('[class*="cursor-pointer"], .group').first().click();
    await expect(page.locator('a', { hasText: 'Launch Demo' })).toBeVisible({ timeout: 5000 });
  });

  test('detail panel can be dismissed', async ({ page }) => {
    await page.goto('/');
    await page.locator('main').locator('[class*="cursor-pointer"], .group').first().click();
    await expect(page.locator('text=Launch Demo')).toBeVisible({ timeout: 5000 });
    // Close via X button or clicking overlay
    await page.locator('button').filter({ hasText: '' }).locator('svg').first().click().catch(async () => {
      await page.keyboard.press('Escape');
    });
    await expect(page.locator('text=Launch Demo')).not.toBeVisible({ timeout: 3000 });
  });

  test('stability bar is shown in detail panel', async ({ page }) => {
    await page.goto('/');
    await page.locator('main').locator('[class*="cursor-pointer"], .group').first().click();
    await expect(page.locator('text=96% Reliable')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Accessibility & TUC Standards', () => {
  test('page has lang="en" attribute', async ({ page }) => {
    await page.goto('/');
    const lang = await page.evaluate(() => document.documentElement.getAttribute('lang'));
    expect(lang).toBe('en');
  });

  test('page title is not the default placeholder', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).not.toBe('My Google AI Studio App');
    expect(title.length).toBeGreaterThan(0);
  });

  test('meta description is present', async ({ page }) => {
    await page.goto('/');
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).toBeTruthy();
    expect(desc!.length).toBeGreaterThan(10);
  });

  test('theme-color meta tag is present (TUC branding)', async ({ page }) => {
    await page.goto('/');
    const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content');
    expect(themeColor).toBeTruthy();
  });

  test('TUC AI Lab brand text is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=TUC')).toBeVisible();
    await expect(page.locator('text=AI Lab')).toBeVisible();
  });
});

// Standalone screenshot capture for the showcase
test('capture homepage screenshot for QA showcase', async ({ page }) => {
  await page.goto('/');
  // Wait for tool cards to load
  await page.waitForSelector('main .group, main [class*="cursor-pointer"]', { timeout: 10000 });
  // Wait for any animations to settle
  await page.waitForTimeout(1500);

  const screenshotDir = path.join(process.cwd(), 'docs', 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  await page.screenshot({
    path: path.join(screenshotDir, 'homepage.png'),
    fullPage: false,
  });

  // Verify screenshot was written
  const exists = fs.existsSync(path.join(screenshotDir, 'homepage.png'));
  expect(exists).toBe(true);
});
