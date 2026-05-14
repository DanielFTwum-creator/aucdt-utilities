import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const PROJECTS = [
  {
    name: 'tuc-ai-lab-catalog',
    url: 'https://ai-tools.techbridge.edu.gh/ai-lab/',
    checkElement: 'text=Welcome Back'
  },
  {
    name: 'techbridge-ai-application-portal',
    url: 'https://ai-tools.techbridge.edu.gh/techbridge-ai-application-portal/',
    checkElement: 'text=Welcome Back'
  },
  {
    name: 'techbridge-ai-blueprint',
    url: 'https://ai-tools.techbridge.edu.gh/techbridge-ai-blueprint/',
    checkElement: 'text=Welcome Back'
  },
  {
    name: 'techbridge-ai-workshop-flyer',
    url: 'https://ai-tools.techbridge.edu.gh/techbridge-ai-workshop-flyer/',
    checkElement: 'text=Welcome Back'
  },
  {
    name: 'rophe-specialist-care-rpms',
    url: 'https://ai-tools.techbridge.edu.gh/rophe-specialist-care-rpms/',
    checkElement: 'text=Welcome Back'
  },
  {
    name: 'rophe-sugar-logger',
    url: 'https://ai-tools.techbridge.edu.gh/rophe-sugar-logger/',
    checkElement: 'text=Welcome Back'
  }
];

// Create screenshots directory
const screenshotsDir = path.join(process.cwd(), 'deployment-verification');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

test.describe('Deployment Verification', () => {
  PROJECTS.forEach((project) => {
    test(`${project.name} - loads LoginView`, async ({ page }) => {
      console.log(`\n📍 Testing: ${project.name}`);
      console.log(`   URL: ${project.url}`);

      // Navigate to the app
      await page.goto(project.url, { waitUntil: 'networkidle' });

      // Wait a bit for React to hydrate
      await page.waitForTimeout(2000);

      // Check if LoginView element exists
      const loginElement = await page.locator(project.checkElement).first();
      await expect(loginElement).toBeVisible({ timeout: 10000 });

      // Check for Google OAuth button
      const googleButton = await page.locator('text=Continue with Google');
      await expect(googleButton).toBeVisible();

      // Check for Sign in button
      const signInButton = await page.locator('button:has-text("Sign In")');
      await expect(signInButton).toBeVisible();

      // Take screenshot
      const filename = `${project.name.replace(/\//g, '-')}-screenshot.png`;
      const filepath = path.join(screenshotsDir, filename);
      await page.screenshot({ path: filepath, fullPage: true });

      console.log(`   ✅ PASS - LoginView rendered correctly`);
      console.log(`   📸 Screenshot: ${filepath}`);

      // Log page info
      const title = await page.title();
      const url = page.url();
      console.log(`   📄 Page Title: ${title}`);
      console.log(`   🔗 Current URL: ${url}`);
    });
  });
});

test.describe('OAuth Configuration Verification', () => {
  test('check environment variables are embedded', async ({ page }) => {
    console.log('\n\n🔐 Checking OAuth Configuration...\n');

    for (const project of PROJECTS) {
      await page.goto(project.url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      // Check if page has Google OAuth configured
      // Look for the Google button which indicates OAuth is set up
      const hasGoogleButton = await page.locator('text=Continue with Google').isVisible();

      if (hasGoogleButton) {
        console.log(`✅ ${project.name} - OAuth configured`);
      } else {
        console.log(`❌ ${project.name} - OAuth NOT found!`);
      }
    }
  });
});

test.describe('Network & Performance', () => {
  PROJECTS.forEach((project) => {
    test(`${project.name} - response time`, async ({ page }) => {
      const startTime = Date.now();

      const response = await page.goto(project.url, { waitUntil: 'networkidle' });
      const responseTime = Date.now() - startTime;

      console.log(`\n⏱️  ${project.name}: ${responseTime}ms`);

      expect(response?.status()).toBeLessThan(400);
      expect(responseTime).toBeLessThan(10000); // Should load within 10 seconds
    });
  });
});

// Summary report
test.afterAll(async () => {
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 DEPLOYMENT VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Screenshots saved to: ${screenshotsDir}`);
  console.log(`Total projects verified: ${PROJECTS.length}`);
  console.log('='.repeat(60) + '\n');
});
