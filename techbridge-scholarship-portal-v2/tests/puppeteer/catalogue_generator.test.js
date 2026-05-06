/**
 * TECHBRIDGE Scholarship Portal - Catalogue Generator E2E Test
 * Executes full flow, takes screenshots, and builds a visual catalogue.
 */

import playwright from '@playwright/test';
import fs from 'fs';
import path from 'path';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log('🚀 Starting Catalogue Generation Suite...');
  
  const resultsDir = 'tests/results';
  const catalogFile = path.join(resultsDir, 'catalogue.html');
  
  if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
  }

  const browser = await chromium.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 }
  });
  
  const page = await browser.newPage();
  const screenshots = [];

  const capture = async (name, caption) => {
      const fileName = `${name.replace(/\s+/g, '_').toLowerCase()}.png`;
      const filePath = path.join(resultsDir, fileName);
      await page.screenshot({ path: filePath, fullPage: true });
      screenshots.push({ fileName, caption });
      console.log(`📸 Captured: ${caption}`);
  };

  try {
    // Polling for server readiness
    console.log('⏳ Polling for server at http://localhost:3000...');
    let ready = false;
    for (let i = 0; i < 30; i++) {
        try {
            await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 2000 });
            ready = true;
            break;
        } catch (e) {
            await delay(1000);
        }
    }
    if (!ready) throw new Error("Server not available at http://localhost:3000 after 30 seconds");
    console.log('✅ Server is UP');

    // 1. Landing & Navigation
    await page.goto('http://localhost:3000?view=form', { waitUntil: 'networkidle0', timeout: 60000 });
    await page.waitForSelector('button');
    await capture('landing', 'Application Landing - Initial State');

    // Switch to Bond Tab
    const buttons = await page.$$('button');
    for (const button of buttons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text.includes('2. Bond / Undertaking')) {
            await button.click();
            break;
        }
    }
    await delay(1000);
    await capture('bond_tab', 'Switched to Bond / Undertaking Tab');

    // 2. Step 1: Scholar Details
    await page.type('input[placeholder="e.g. John Doe"]', 'Dr. Catalogue Tester');
    await page.type('input[placeholder="GHA-000000000-0"]', 'GHA-777888999-0');
    await page.type('input[placeholder="Parent/Guardian Name"]', 'Sarah Catalogue');
    await page.type('input[placeholder="Full residential address"]', 'Suite 101, Innovation Hub, Accra');
    await page.type('input[type="email"]', 'catalogue.test@techbridge.edu.gh');
    await page.type('input[type="tel"]', '0201234567');
    await capture('step1_filled', 'Step 1: Scholar Identity Details Filled');

    await page.click('button::-p-text("Continue")');
    await delay(800);

    // 3. Step 2: Programme Details
    await page.waitForSelector('input[placeholder="e.g. Computer Science"]');
    await page.type('input[placeholder="e.g. Computer Science"]', 'Information Technology');
    await page.type('input[placeholder="e.g. 3 Years"]', '4 Years');
    await page.type('input[placeholder="e.g. TECHBRIDGE Fellowship Grant"]', 'Institutional Excellence Grant');
    await page.type('input[placeholder="Completion of PhD in..."]', 'Advanced UI/UX Systems');
    await capture('step2_filled', 'Step 2: Academic Programme & Bond Terms');

    await page.click('button::-p-text("Continue")');
    await delay(800);

    // 4. Step 3: Guarantor & Witnesses
    await page.waitForSelector('input[placeholder="Full legal name"]');
    await page.type('input[placeholder="Full legal name"]', 'Justice Amanor');
    await page.type('input[placeholder="GHA-000000000-0"]', 'GHA-001234567-8');
    await page.type('input[placeholder="Full residential address"]', 'Legal Dept, TUC Campus');
    await page.type('input[placeholder="+233 00 000 0000"]', '055 12 345 6789');

    const witnessInputs = await page.$$('input[placeholder="Witness Name"]');
    await witnessInputs[0].type('Dr. Registrar');
    await page.type('input[placeholder="e.g. Registrar / TUC-001"]', 'REG-TUC-2026');
    await witnessInputs[1].type('Prof. Witness');
    await page.type('input[placeholder="Witness ID"]', 'W-ID-444');
    await capture('step3_filled', 'Step 3: Guarantor & Legal Witnesses');

    await page.click('button::-p-text("Continue")');
    await delay(800);

    // 5. Step 4: Review & Execution
    await page.waitForSelector('input[type="checkbox"]');
    await capture('step4_review', 'Step 4: Final Document Review');

    // Agree and Sign
    await page.click('input[type="checkbox"]');
    await page.type('input[placeholder="Type your full name exactly as it appears on your ID"]', 'Dr. Catalogue Tester');
    await delay(2000); // Wait for signature preview
    await capture('step4_signed', 'Step 4: Signed & Ready for Execution');

    // Submit
    const submitBtnSelector = 'button:not([disabled])::-p-text("Finalize Agreement")';
    await page.click(submitBtnSelector);
    
    // 6. Success State
    await page.waitForFunction(
        () => document.body.textContent.includes("Process Another Application"),
        { timeout: 30000 }
    );
    await delay(2000);
    await capture('success_state', 'Execution Success - Final Confirmation');

    // 7. Generate Catalogue HTML
    console.log('📑 Building Screenshot Catalogue...');
    const catalogHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E2E Execution Catalogue - Techbridge Portal</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background: #0F0C07; color: #f0e8d5; margin: 0; padding: 40px; }
        h1 { font-family: 'Playfair Display', serif; color: #c9a84c; text-align: center; font-size: 3rem; margin-bottom: 10px; }
        .meta { text-align: center; color: #a09070; margin-bottom: 50px; font-size: 0.9rem; letter-spacing: 2px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 40px; max-width: 1400px; margin: 0 auto; }
        .step-card { background: #1c1a16; border: 1px solid #7a6230; padding: 20px; border-radius: 8px; transition: transform 0.3s; }
        .step-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(201, 168, 76, 0.2); }
        .img-container { width: 100%; height: 300px; overflow: hidden; border-radius: 4px; border: 1px solid #000; margin-bottom: 15px; cursor: pointer; }
        .img-container img { width: 100%; height: auto; transition: transform 0.5s; }
        .img-container:hover img { transform: scale(1.05); }
        .caption { font-weight: 600; color: #c9a84c; margin-bottom: 5px; }
        .timestamp { font-size: 0.8rem; opacity: 0.6; }
    </style>
</head>
<body>
    <h1>E2E EXECUTION CATALOGUE</h1>
    <div class="meta">OFFICIAL SYSTEM TEST LOG // DATE: ${new Date().toLocaleDateString()}</div>
    
    <div class="grid">
        ${screenshots.map((s, i) => `
        <div class="step-card">
            <div class="caption">STEP ${i + 1}: ${s.caption}</div>
            <div class="img-container" onclick="window.open('${s.fileName}')">
                <img src="${s.fileName}" alt="${s.caption}">
            </div>
            <div class="timestamp">Captured at ${new Date().toLocaleTimeString()}</div>
        </div>
        `).join('')}
    </div>
</body>
</html>
    `;

    fs.writeFileSync(catalogFile, catalogHTML);
    console.log(`✅ Catalogue created successfully at: ${catalogFile}`);

  } catch (error) {
    console.error('❌ CATALOGUE GENERATION FAILED:', error.message);
    await page.screenshot({ path: path.join(resultsDir, 'catalogue_failure.png') });
  } finally {
    await browser.close();
  }
})();
