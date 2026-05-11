import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = path.join(__dirname, '..', 'dist', 'screenshots');

async function runTests() {
  console.log('Starting Puppeteer E2E Test Suite...');
  
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const results = [];

  try {
    // Test 1: Load main application
    console.log(`Navigating to ${BASE_URL}...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    const appTitle = await page.title();
    
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-main-app.png') });
    results.push({ name: 'Load Main Application', status: 'passed', message: `Title: ${appTitle}` });

    // Test 2: Verify Login Page
    console.log(`Navigating to ${BASE_URL}/login...`);
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
    
    const hasPasswordField = await page.$('input[type="password"]') !== null;
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-login-page.png') });
    
    if (hasPasswordField) {
      results.push({ name: 'Verify Login Page', status: 'passed', message: 'Password field found' });
    } else {
      results.push({ name: 'Verify Login Page', status: 'failed', message: 'Password field missing' });
    }

  } catch (error) {
    console.error('Test Execution Failed:', error);
    results.push({ name: 'Suite Execution', status: 'failed', message: error.message });
  } finally {
    await browser.close();
  }

  // Write results for the dashboard
  const reportPath = path.join(SCREENSHOT_DIR, 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    results
  }, null, 2));

  console.log('Test execution complete. Report generated at', reportPath);
  
  const hasFailures = results.some(r => r.status === 'failed');
  if (hasFailures) {
    process.exit(1);
  }
}

runTests().catch(console.error);
