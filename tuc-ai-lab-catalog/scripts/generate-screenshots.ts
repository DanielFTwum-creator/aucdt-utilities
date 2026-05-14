import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import tool config
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, '../src/config/tools.ts');
const configUrl = new URL(`file://${configPath.replace(/\\/g, '/')}`).href;

// Dynamically import the tools config
let TOOLS: any[] = [];
try {
  const config = await import(configUrl);
  TOOLS = config.getScreenshotTools();
  console.log(`✓ Loaded ${TOOLS.length} tools from config`);
} catch (err: any) {
  console.error('❌ Failed to import tools config:', err.message);
  process.exit(1);
}

const screenshotsDir = path.join(__dirname, '../public/screenshots');

// Ensure screenshots directory exists
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function generateScreenshot(tool: any): Promise<void> {
  let browser;
  try {
    const screenshotUrl = tool.screenshotUrl || tool.url;
    console.log(`📸 Capturing: ${tool.title} (${screenshotUrl})`);

    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const context = await browser.newContext({
      viewport: { width: 1024, height: 768 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ignoreHTTPSErrors: true
    });

    const page = await context.newPage();

    // Navigate
    await page.goto(screenshotUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(1000);

    // Inject auth so apps using markai pattern skip login
    const slugKey = tool.slug.replace(/-/g, '_');
    const previewUser = JSON.stringify({
      id: 'preview-001',
      username: 'TUC Preview',
      email: 'preview@techbridge.edu.gh'
    });

    await page.evaluate(({ keys, val }) => {
      for (const key of keys) localStorage.setItem(key, val);
    }, {
      keys: [`${slugKey}_user`, 'tuc_ai_lab_user', 'markai_user', 'user'],
      val: previewUser
    });

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Hide common popups
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.innerHTML = `
        [id*="cookie"], [class*="cookie"],
        [id*="modal"], [class*="modal"],
        [id*="banner"], [class*="banner"],
        [id*="popup"], [class*="popup"] { display: none !important; }
      `;
      document.head.appendChild(style);
    });

    // Capture
    const filepath = path.join(screenshotsDir, `${tool.slug}.jpg`);
    await page.screenshot({
      path: filepath,
      type: 'jpeg',
      quality: 90,
      fullPage: false
    });

    console.log(`✅ Saved: ${filepath}`);
  } catch (error: any) {
    console.error(`❌ Error for ${tool.title}:`, error?.message || error);
  } finally {
    if (browser) await browser.close();
  }
}

async function main() {
  console.log('🚀 Starting screenshot generation...\n');

  for (const tool of TOOLS) {
    await generateScreenshot(tool);
  }

  console.log('\n✨ Screenshot generation complete!');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
