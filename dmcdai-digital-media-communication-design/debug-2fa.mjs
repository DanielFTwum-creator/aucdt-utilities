import { chromium } from '@playwright/test';
import path from 'path';

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', msg => console.log('CONSOLE', msg.type(), msg.text()));
page.on('pageerror', err => console.log('PAGE ERROR', err));
page.on('requestfailed', req => console.log('REQUEST FAILED', req.url(), req.failure()?.errorText));
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  (window as any).__dmcdaiAuto2FAEnabled = true;
});
console.log('title', await page.title());
const bodyHTML = await page.locator('body').innerHTML();
console.log('body length', bodyHTML.length);
console.log('login title count', await page.locator('text=Techbridge 2FA Login').count());
console.log('send code button count', await page.locator('button:has-text("Send code")').count());
const screenshotPath = path.resolve('diagnostic-login.png');
await page.screenshot({ path: screenshotPath, fullPage: true });
console.log('screenshot saved to', screenshotPath);

if (await page.locator('button:has-text("Send code")').count() > 0) {
  const sendCodeButton = page.locator('button:has-text("Send code")').first();
  console.log('send code visible', await sendCodeButton.isVisible());
  console.log('send code enabled', await sendCodeButton.isEnabled());
  console.log('send code html', await sendCodeButton.evaluate(node => node.outerHTML));
  await page.locator('#email').fill('qa.test@techbridge.edu.gh');
  if (!await sendCodeButton.isVisible()) {
    console.log('send code button is not visible after fill');
  }
  await sendCodeButton.click();
  await page.locator('#code').waitFor({ state: 'visible' });
  const otp = await page.evaluate(() => window.__dmcdaiPendingOtp);
  console.log('otp', otp);
  await page.locator('#code').fill(otp);
  await page.getByRole('button', { name: 'Verify code' }).click();
  await page.waitForTimeout(2000);
  console.log('post-login body length', (await page.locator('body').innerHTML()).length);
  const screenshotPath2 = path.resolve('diagnostic-post-login.png');
  await page.screenshot({ path: screenshotPath2, fullPage: true });
  console.log('screenshot saved to', screenshotPath2);
}

await browser.close();
