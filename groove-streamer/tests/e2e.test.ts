import { chromium } from 'playwright';

async function runTests() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  const title = await page.title();
  console.log('Page title:', title);
  await browser.close();
}

runTests().catch(console.error);
