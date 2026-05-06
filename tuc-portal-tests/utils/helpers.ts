import { Page } from '@playwright/test';

/**
 * Utility functions for testing
 */

/**
 * Generate random email
 */
export function generateRandomEmail(): string {
  const timestamp = Date.now();
  return `test_${timestamp}@example.com`;
}

/**
 * Generate random phone number (Ghana format)
 */
export function generateRandomPhone(): string {
  const randomNum = Math.floor(Math.random() * 900000000) + 100000000;
  return `+233${randomNum}`;
}

/**
 * Generate random string
 */
export function generateRandomString(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Format date to DD/MM/YYYY
 */
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Wait for Angular to be ready (if the app uses Angular)
 */
export async function waitForAngular(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    return (window as any).getAllAngularTestabilities !== undefined;
  }, { timeout: 10000 }).catch(() => {
    // Angular might not be loaded, continue anyway
  });
}

/**
 * Take screenshot with timestamp
 */
export async function takeTimestampedScreenshot(page: Page, name: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ 
    path: `test-results/screenshots/${name}_${timestamp}.png`,
    fullPage: true 
  });
}

/**
 * Scroll page to bottom
 */
export async function scrollToBottom(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
}

/**
 * Scroll page to top
 */
export async function scrollToTop(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
}

/**
 * Get current timestamp
 */
export function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Log test information
 */
export function logTestInfo(message: string): void {
  console.log(`[${getTimestamp()}] ${message}`);
}

/**
 * Wait for API response
 */
export async function waitForApiResponse(
  page: Page, 
  urlPattern: string | RegExp, 
  timeout: number = 30000
): Promise<any> {
  const response = await page.waitForResponse(
    (response) => {
      const url = response.url();
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern);
      }
      return urlPattern.test(url);
    },
    { timeout }
  );
  return response.json();
}

/**
 * Check if element exists without throwing error
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  try {
    const element = await page.locator(selector).count();
    return element > 0;
  } catch {
    return false;
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}
