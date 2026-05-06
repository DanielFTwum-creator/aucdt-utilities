import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', (msg) => {
    console.log(`[PAGE] ${msg.type()} ${msg.text()}`);
  });
  page.on('pageerror', (err) => {
    console.error('[PAGE ERROR]', err);
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    window.__dmcdaiAuto2FAEnabled = true;
  });
  await page.waitForSelector('text=Techbridge 2FA Login');
  const otpEmail = process.env.DMCDAI_TEST_EMAIL ?? 'student@techbridge.edu.gh';
  await page.fill('#email', otpEmail);
  await page.click('button:has-text("Send code")');
  await page.waitForSelector('#code');
  const otp = await page.evaluate(() => window.__dmcdaiPendingOtp);
  console.log('OTP captured', otp);
  await page.fill('#code', otp);
  await page.click('button:has-text("Verify code")');
  await page.waitForTimeout(2000);
  const body = await page.content();
  console.log('BODY LENGTH', body.length);
  console.log('BODY SNIPPET', body.slice(0, 500));
  await browser.close();
})();
