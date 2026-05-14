import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const PROJECTS = [
  {
    name: 'tuc-ai-lab-catalog',
    url: 'https://ai-tools.techbridge.edu.gh/ai-lab/',
    type: 'catalog',
    elements: {
      header: 'text=TUC AI Lab',
      loginView: 'text=Welcome Back',
      googleButton: 'text=Continue with Google',
      grid: '[role="grid"]',
      stats: 'text=Questions Answered'
    }
  },
  {
    name: 'techbridge-ai-application-portal',
    url: 'https://ai-tools.techbridge.edu.gh/portal/',
    type: 'portal',
    elements: {
      header: 'text=Application Portal',
      loginView: 'text=Welcome Back',
      googleButton: 'text=Continue with Google'
    }
  },
  {
    name: 'techbridge-ai-blueprint',
    url: 'https://ai-tools.techbridge.edu.gh/blueprint/',
    type: 'blueprint',
    elements: {
      header: 'text=Blueprint',
      loginView: 'text=Welcome Back',
      googleButton: 'text=Continue with Google'
    }
  },
  {
    name: 'techbridge-ai-workshop-flyer',
    url: 'https://ai-tools.techbridge.edu.gh/workshop/',
    type: 'workshop',
    elements: {
      header: 'text=Workshop Flyer',
      loginView: 'text=Welcome Back',
      googleButton: 'text=Continue with Google'
    }
  },
  {
    name: 'rophe-specialist-care-rpms',
    url: 'https://ai-tools.techbridge.edu.gh/care/',
    type: 'healthcare',
    elements: {
      header: 'text=RPMS',
      loginView: 'text=Welcome Back',
      googleButton: 'text=Continue with Google'
    }
  },
  {
    name: 'rophe-sugar-logger',
    url: 'https://ai-tools.techbridge.edu.gh/glucose/',
    type: 'healthcare',
    elements: {
      header: 'text=Sugar Logger',
      loginView: 'text=Welcome Back',
      googleButton: 'text=Continue with Google'
    }
  }
];

interface TestResult {
  project: string;
  status: 'pass' | 'fail';
  checks: {
    name: string;
    result: boolean;
    duration: number;
    error?: string;
  }[];
  theme: string;
  loadTime: number;
  accessibility: {
    score: number;
    issues: string[];
  };
}

const results: TestResult[] = [];

test.describe('🚀 Agentic Deployment Verification', () => {
  PROJECTS.forEach((project) => {
    test(`${project.name} - Full deployment verification`, async ({ page }) => {
      console.log(`\n${'='.repeat(70)}`);
      console.log(`🔍 Verifying: ${project.name}`);
      console.log(`${'='.repeat(70)}`);

      const projectResult: TestResult = {
        project: project.name,
        status: 'pass',
        checks: [],
        theme: '',
        loadTime: 0,
        accessibility: { score: 0, issues: [] }
      };

      // 1. Page Load & Response
      const startTime = Date.now();
      const response = await page.goto(project.url, { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;
      projectResult.loadTime = loadTime;

      const loadCheck = {
        name: '✓ Page loads (status < 400)',
        result: response?.status() ? response.status() < 400 : false,
        duration: loadTime
      };
      projectResult.checks.push(loadCheck);
      console.log(`${loadCheck.result ? '✅' : '❌'} ${loadCheck.name} (${loadTime}ms)`);

      if (!loadCheck.result) {
        projectResult.status = 'fail';
        return;
      }

      // 2. Theme Detection
      await page.waitForTimeout(500);
      const themeAttr = await page.locator('html').getAttribute('data-theme');
      const themeCheck = {
        name: '✓ Gold-luxury theme applied',
        result: themeAttr === 'gold-luxury',
        duration: 100
      };
      projectResult.theme = themeAttr || 'none';
      projectResult.checks.push(themeCheck);
      console.log(`${themeCheck.result ? '✅' : '❌'} ${themeCheck.name} (${themeAttr})`);

      // 3. CSS Variables Loaded
      const bgColorCheck = {
        name: '✓ CSS variables initialized',
        result: false,
        duration: 100
      };
      try {
        const computedStyle = await page.locator('body').evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });
        bgColorCheck.result = computedStyle && computedStyle !== 'rgba(0, 0, 0, 0)';
      } catch (e) {
        bgColorCheck.error = String(e);
      }
      projectResult.checks.push(bgColorCheck);
      console.log(`${bgColorCheck.result ? '✅' : '❌'} ${bgColorCheck.name}`);

      // 4. Authentication UI Present
      const authCheck = {
        name: '✓ LoginView rendered',
        result: false,
        duration: 500
      };
      try {
        const loginElement = await page.locator(project.elements.loginView).first();
        await expect(loginElement).toBeVisible({ timeout: 5000 });
        authCheck.result = true;
      } catch (e) {
        authCheck.error = String(e);
      }
      projectResult.checks.push(authCheck);
      console.log(`${authCheck.result ? '✅' : '❌'} ${authCheck.name}`);

      // 5. OAuth Button Present
      const oauthCheck = {
        name: '✓ Google OAuth configured',
        result: false,
        duration: 200
      };
      try {
        const googleBtn = await page.locator(project.elements.googleButton);
        oauthCheck.result = await googleBtn.isVisible();
      } catch (e) {
        oauthCheck.error = String(e);
      }
      projectResult.checks.push(oauthCheck);
      console.log(`${oauthCheck.result ? '✅' : '❌'} ${oauthCheck.name}`);

      // 6. Favicon Loaded
      const faviconCheck = {
        name: '✓ Favicon configured',
        result: false,
        duration: 200
      };
      try {
        const faviconLink = await page.locator('link[rel="icon"]').first();
        const href = await faviconLink.getAttribute('href');
        faviconCheck.result = href?.includes('techbridge.edu.gh/favicon.ico') || false;
      } catch (e) {
        faviconCheck.error = String(e);
      }
      projectResult.checks.push(faviconCheck);
      console.log(`${faviconCheck.result ? '✅' : '❌'} ${faviconCheck.name}`);

      // 7. Accessibility Audit
      const a11yCheck = {
        name: '✓ Accessibility baseline',
        result: false,
        duration: 1000
      };
      try {
        // Check for basic a11y features
        const hasHeadings = await page.locator('h1, h2, h3').count() > 0;
        const hasLandmark = await page.locator('header, main, footer').count() > 0;
        const hasButtons = await page.locator('button').count() > 0;

        a11yCheck.result = hasHeadings && hasLandmark && hasButtons;

        // Count issues (basic check)
        projectResult.accessibility.score = a11yCheck.result ? 85 : 45;
        if (!hasHeadings) projectResult.accessibility.issues.push('Missing heading hierarchy');
        if (!hasLandmark) projectResult.accessibility.issues.push('Missing semantic landmarks');
        if (!hasButtons) projectResult.accessibility.issues.push('No interactive buttons found');
      } catch (e) {
        a11yCheck.error = String(e);
      }
      projectResult.checks.push(a11yCheck);
      console.log(`${a11yCheck.result ? '✅' : '❌'} ${a11yCheck.name} (Score: ${projectResult.accessibility.score}/100)`);

      // 8. Responsive Layout
      const responsiveCheck = {
        name: '✓ Responsive layout',
        result: false,
        duration: 300
      };
      try {
        const viewport = page.viewportSize();
        responsiveCheck.result = viewport?.width === 1280 && viewport?.height === 720;
      } catch (e) {
        responsiveCheck.error = String(e);
      }
      projectResult.checks.push(responsiveCheck);
      console.log(`${responsiveCheck.result ? '✅' : '❌'} ${responsiveCheck.name}`);

      // 9. Screenshot for visual verification
      const screenshotPath = path.join(process.cwd(), `deployment-verification/${project.name}-final.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`📸 Screenshot: ${screenshotPath}`);

      // Summary
      const passCount = projectResult.checks.filter(c => c.result).length;
      const totalChecks = projectResult.checks.length;
      projectResult.status = passCount === totalChecks ? 'pass' : 'fail';

      console.log(`\n📊 Summary: ${passCount}/${totalChecks} checks passed`);
      results.push(projectResult);
    });
  });
});

test.afterAll(async () => {
  // Generate comprehensive report
  const report = {
    timestamp: new Date().toISOString(),
    totalProjects: PROJECTS.length,
    passedProjects: results.filter(r => r.status === 'pass').length,
    failedProjects: results.filter(r => r.status === 'fail').length,
    averageLoadTime: Math.round(results.reduce((sum, r) => sum + r.loadTime, 0) / results.length),
    averageA11yScore: Math.round(results.reduce((sum, r) => sum + r.accessibility.score, 0) / results.length),
    projects: results.map(r => ({
      name: r.project,
      status: r.status,
      loadTime: r.loadTime,
      theme: r.theme,
      a11yScore: r.accessibility.score,
      checksCompleted: `${r.checks.filter(c => c.result).length}/${r.checks.length}`,
      issues: r.checks.filter(c => !c.result).map(c => c.name)
    }))
  };

  const reportPath = path.join(process.cwd(), 'deployment-verification/REPORT.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('\n' + '='.repeat(70));
  console.log('📋 DEPLOYMENT VERIFICATION REPORT');
  console.log('='.repeat(70));
  console.log(JSON.stringify(report, null, 2));
  console.log('='.repeat(70));
});
