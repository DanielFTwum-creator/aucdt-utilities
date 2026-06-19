import { chromium } from '@playwright/test';

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  console.log('Navigating to Watchlist...');
  await page.goto('https://ai-tools.techbridge.edu.gh/stockpulse/#/watchlist');
  await page.waitForTimeout(3000); // Wait for initialization

  // Attempt to add a ticker so the watchlist isn't empty
  try {
    await page.fill('input[placeholder="Search tickers to add (e.g. AAPL, Tesla)…"]', 'AAPL');
    await page.waitForTimeout(1500);
    const result = page.locator('ul#ticker-search-results li button').first();
    if (await result.isVisible()) {
      await result.click();
    }
  } catch (e) {
    console.log('Could not add ticker, continuing...');
  }
  await page.waitForTimeout(2000);

  console.log('Capturing Watchlist / Dashboard...');
  await page.screenshot({ path: 'public/screenshots/watchlist.png' });
  await page.screenshot({ path: 'public/screenshots/dashboard.png' });
  
  console.log('Capturing Portfolio...');
  await page.goto('https://ai-tools.techbridge.edu.gh/stockpulse/#/portfolio');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'public/screenshots/portfolio.png' });

  console.log('Capturing Paper Trade...');
  await page.goto('https://ai-tools.techbridge.edu.gh/stockpulse/#/paper');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'public/screenshots/paper-trade.png' });

  console.log('Capturing AI Signals...');
  await page.goto('https://ai-tools.techbridge.edu.gh/stockpulse/#/ai');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'public/screenshots/ai-signals.png' });

  console.log('Closing browser...');
  await browser.close();
  console.log('Done!');
})();
