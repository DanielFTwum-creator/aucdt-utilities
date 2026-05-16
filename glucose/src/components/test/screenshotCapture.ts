import { chromium, Browser, Page } from 'playwright';

export interface ScreenshotCapture {
  name: string;
  path: string;
  data: Buffer;
}

let browser: Browser | null = null;
let page: Page | null = null;

const VIEWPORT = { width: 1280, height: 800 };
const BASE_URL = 'http://localhost:5173';

export async function initBrowser() {
  if (browser) return { browser, page };

  browser = await chromium.launch({ headless: true });
  const context = await browser.createContext({ viewport: VIEWPORT });
  page = await context.newPage();

  return { browser, page };
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
    page = null;
  }
}

export async function captureLoginView(): Promise<Buffer> {
  if (!page) throw new Error('Browser not initialized');

  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Continue with Google', { timeout: 5000 });

  return page.screenshot({ type: 'png' });
}

export async function captureAuthenticatedDashboard(): Promise<Buffer> {
  if (!page) throw new Error('Browser not initialized');

  // This assumes user is already logged in
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Blood Glucose Monitoring', { timeout: 5000 });

  return page.screenshot({ type: 'png' });
}

export async function captureStatsCards(): Promise<Buffer> {
  if (!page) throw new Error('Browser not initialized');

  // Scroll to ensure stats cards are visible
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForSelector('text=AVERAGE FASTING', { timeout: 5000 });

  return page.screenshot({ type: 'png' });
}

export async function captureMonthSelector(): Promise<Buffer> {
  if (!page) throw new Error('Browser not initialized');

  // Scroll to header
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForSelector('text=PERIOD', { timeout: 5000 });

  return page.screenshot({ type: 'png' });
}

export async function captureAGPGraph(): Promise<Buffer> {
  if (!page) throw new Error('Browser not initialized');

  // Click on AGP tab
  await page.click('text=AMBULATORY GLUCOSE PROFILE', { timeout: 5000 });
  await page.waitForSelector('text=Daily Glucose Variation Trend', { timeout: 5000 });

  // Scroll to graph
  await page.evaluate(() => {
    const el = document.querySelector('text=Daily Glucose Variation Trend');
    if (el) el.scrollIntoView();
  });

  return page.screenshot({ type: 'png' });
}

export async function captureHelpModal(): Promise<Buffer> {
  if (!page) throw new Error('Browser not initialized');

  // Click help button (question mark icon in header)
  const helpButton = await page.$('button[title="View user guide"]');
  if (helpButton) {
    await helpButton.click();
  }

  // Wait for modal to appear
  await page.waitForSelector('text=ROPHE Guide', { timeout: 5000 });

  return page.screenshot({ type: 'png' });
}

export async function captureExportImport(): Promise<Buffer> {
  if (!page) throw new Error('Browser not initialized');

  // Scroll to header buttons
  await page.evaluate(() => window.scrollTo(0, 0));

  // Wait for export/import buttons to be visible
  await page.waitForSelector('button[title="Export data to JSON"]', { timeout: 5000 });

  return page.screenshot({ type: 'png' });
}

export async function captureDataTable(): Promise<Buffer> {
  if (!page) throw new Error('Browser not initialized');

  // Click on Raw Log Data tab
  await page.click('text=RAW LOG DATA', { timeout: 5000 });
  await page.waitForSelector('table', { timeout: 5000 });

  return page.screenshot({ type: 'png' });
}

export async function captureManualEntryModal(): Promise<Buffer> {
  if (!page) throw new Error('Browser not initialized');

  // Click Manual Entry button
  await page.click('text=MANUAL ENTRY', { timeout: 5000 });
  await page.waitForSelector('text=Log Glucose Reading', { timeout: 5000 });

  return page.screenshot({ type: 'png' });
}

export async function captureScanInterface(): Promise<Buffer> {
  if (!page) throw new Error('Browser not initialized');

  // Make sure we can see the scan button
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForSelector('text=SCAN PHOTO', { timeout: 5000 });

  return page.screenshot({ type: 'png' });
}

export async function captureHighContrastTheme(): Promise<Buffer> {
  if (!page) throw new Error('Browser not initialized');

  // Click eye icon to enable high contrast
  const themeButton = await page.$('button[title="Toggle High Contrast"]');
  if (themeButton) {
    await themeButton.click();
    await page.waitForTimeout(500);
  }

  return page.screenshot({ type: 'png' });
}

export async function captureUnitToggle(): Promise<Buffer> {
  if (!page) throw new Error('Browser not initialized');

  // Scroll to header
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForSelector('button:has-text("mmol/L")', { timeout: 5000 });

  return page.screenshot({ type: 'png' });
}
