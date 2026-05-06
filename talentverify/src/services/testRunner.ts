import playwright from '@playwright/test';

interface TestResult {
  name: string;
  status: 'pass' | 'fail';
  message?: string;
  screenshot?: string; // Base64
}

export async function runSystemTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  let browser;

  try {
    console.log('Launching browser for tests...');
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    // Set viewport to a standard desktop size
    await page.setViewport({ width: 1280, height: 800 });
    
    const baseUrl = 'http://localhost:3000';

    // --- Test 1: Public Login Page ---
    try {
      console.log('Test 1: Navigating to login...');
      await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle0' });
      const title = await page.title();
      
      if (title.includes('TalentVerify') || await page.$('h1')) {
        results.push({ name: '1. Load Login Page', status: 'pass' });
      } else {
        throw new Error('Login page title or header not found');
      }
      
      const loginScreenshot = await page.screenshot({ encoding: 'base64' });
      results.push({ name: 'Login Page UI', status: 'pass', screenshot: loginScreenshot });

    } catch (e: any) {
      results.push({ name: '1. Load Login Page', status: 'fail', message: e.message });
    }

    // --- Test 2: Role Selection Interaction ---
    try {
      console.log('Test 2: Verifying Role Cards...');
      // Check for Recruiter card
      const recruiterCard = await page.$x("//h3[contains(., 'Recruiter')]");
      if (recruiterCard.length > 0) {
        results.push({ name: '2. Recruiter Role Card Visible', status: 'pass' });
      } else {
        throw new Error('Recruiter card not found');
      }

      // Check for Candidate card
      const candidateCard = await page.$x("//h3[contains(., 'Candidate')]");
      if (candidateCard.length > 0) {
        results.push({ name: '2. Candidate Role Card Visible', status: 'pass' });
      } else {
        throw new Error('Candidate card not found');
      }

    } catch (e: any) {
      results.push({ name: '2. Role Selection', status: 'fail', message: e.message });
    }

    // --- Test 3: Admin Login Flow ---
    try {
      console.log('Test 3: Attempting Admin Login...');
      
      // Click "System Admin Access"
      const adminBtn = await page.$x("//button[contains(., 'System Admin Access')]");
      if (adminBtn.length > 0) {
        await (adminBtn[0] as any).click();
        // Wait for form animation
        await new Promise(r => setTimeout(r, 500));
        
        // Type password
        await page.type('input[type="password"]', 'admin123');
        
        // Click Authenticate
        const authBtn = await page.$x("//button[contains(., 'Authenticate')]");
        if (authBtn.length > 0) {
            await Promise.all([
                (authBtn[0] as any).click(),
                page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {})
            ]);
            
            // Wait for SPA routing to settle
            await new Promise(r => setTimeout(r, 2000));
            
            const url = page.url();
            if (url.includes('/admin/diagnostics')) {
                results.push({ name: '3. Admin Login Success', status: 'pass' });
                const dashScreenshot = await page.screenshot({ encoding: 'base64' });
                results.push({ name: 'Admin Dashboard UI', status: 'pass', screenshot: dashScreenshot });
            } else {
                 throw new Error(`Failed to redirect to admin dashboard. Current URL: ${url}`);
            }
        } else {
            throw new Error('Authenticate button not found');
        }
      } else {
        throw new Error('System Admin Access button not found');
      }

    } catch (e: any) {
      results.push({ name: '3. Admin Login', status: 'fail', message: e.message });
    }

    // --- Test 4: Admin Navigation ---
    // Only proceed if we are logged in (url check)
    if (page.url().includes('/admin/')) {
        try {
            console.log('Test 4: Verifying Admin Navigation...');
            
            // Navigate to Audit Logs
            const logsLink = await page.$('a[href="/admin/logs"]');
            if (logsLink) {
                await logsLink.click();
                await new Promise(r => setTimeout(r, 1000));
                if (page.url().includes('/admin/logs')) {
                    results.push({ name: '4. Nav to Audit Logs', status: 'pass' });
                    const logsScreenshot = await page.screenshot({ encoding: 'base64' });
                    results.push({ name: 'Audit Logs UI', status: 'pass', screenshot: logsScreenshot });
                } else {
                    results.push({ name: '4. Nav to Audit Logs', status: 'fail', message: 'URL did not change' });
                }
            } else {
                results.push({ name: '4. Nav to Audit Logs', status: 'fail', message: 'Link not found' });
            }

            // Navigate back to Diagnostics
            const diagLink = await page.$('a[href="/admin/diagnostics"]');
            if (diagLink) {
                await diagLink.click();
                await new Promise(r => setTimeout(r, 1000));
                if (page.url().includes('/admin/diagnostics')) {
                     results.push({ name: '4. Nav to Diagnostics', status: 'pass' });
                }
            }

        } catch (e: any) {
            results.push({ name: '4. Admin Navigation', status: 'fail', message: e.message });
        }
    }

  } catch (error: any) {
    console.error('Test Runner Error:', error);
    results.push({ name: 'Test Runner Initialization', status: 'fail', message: error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return results;
}
