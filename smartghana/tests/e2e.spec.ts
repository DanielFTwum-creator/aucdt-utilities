import { test, expect } from '@playwright/test';

test.describe('Techbridge × SmartBridge Alliance E2E Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    // We point to the local dev server
    await page.goto('/');
  });

  test('should display the correct page title and branding', async ({ page }) => {
    // Check if the main heading exists or some identifying text
    const heroTitle = page.locator('h2', { hasText: 'The Synergy of Global Tech and Local Execution.' });
    await expect(heroTitle).toBeVisible();

    // Check for Techbridge logo in navbar
    const logo = page.locator('img[alt="Techbridge University College Logo"]');
    await expect(logo).toBeVisible();
  });

  test('should have a functional navigation bar with all anchors', async ({ page }) => {
    const navAnchors = ['Synergy', 'Model', 'Compliance', 'Delivery', 'Economic Impact'];
    
    for (const anchor of navAnchors) {
      const link = page.locator(`nav a:has-text("${anchor}")`);
      await expect(link).toBeVisible();
    }
  });

  test('should scroll to the "Review Partnership Model" section when CTA is clicked', async ({ page }) => {
    const ctaButton = page.locator('button:has-text("Review Partnership Model")');
    await ctaButton.click();
    
    // Check if the section with ID review-model is in viewport (or at least exists and is scrolled to)
    const reviewSection = page.locator('#review-model');
    await expect(reviewSection).toBeInViewport();
  });

  test('should display the Synergy Matrix with all dimensions', async ({ page }) => {
    const synergySection = page.locator('#synergy');
    await expect(synergySection).toBeVisible();

    const dimensions = ['Operational Delivery', 'User Experience', 'Data & Hosting'];
    for (const dim of dimensions) {
      await expect(page.locator(`h3:has-text("${dim}")`)).toBeVisible();
    }
  });

  test('should display the 4 specialized degree programmes', async ({ page }) => {
    const programmesSection = page.locator('#programmes');
    await expect(programmesSection).toBeVisible();

    const degreeTitles = [
      'Product Design & Entrepreneurship',
      'Fashion Design Technology',
      'Jewellery Design Technology',
      'Digital Media & Communications Design'
    ];

    for (const title of degreeTitles) {
      await expect(page.locator(`h4:has-text("${title}")`)).toBeVisible();
    }
  });

  test('should display data visualization components (Charts)', async ({ page }) => {
    // Recharts uses SVG elements
    const charts = page.locator('.recharts-responsive-container');
    const count = await charts.count();
    // We expect multiple charts (GVA, Sectoral, Workforce, Readiness)
    expect(count).toBeGreaterThanOrEqual(3);
    
    // Check for at least one SVG being present within a chart container
    const firstChartSvg = charts.first().locator('svg');
    await expect(firstChartSvg).toBeVisible();
  });

  test('should display the 6R Framework steps', async ({ page }) => {
    const modelSection = page.locator('#model');
    await expect(modelSection).toBeVisible();

    const rs = ['Review', 'Reduce', 'Refine', 'Reuse', 'Regenerate', 'Reinforce'];
    for (const r of rs) {
      await expect(page.locator(`h4:has-text("${r}")`)).toBeVisible();
    }
  });

  test('should display the Economic Impact metrics', async ({ page }) => {
    const economicSection = page.locator('#economic');
    await expect(economicSection).toBeVisible();

    await expect(page.locator('text=$2.4B')).toBeVisible();
    await expect(page.locator('text=42%')).toBeVisible();
    await expect(page.locator('text=150+')).toBeVisible();
  });

  test('should be responsive and show/hide elements correctly', async ({ page, isMobile }) => {
    if (isMobile) {
      // In mobile view, the navigation links should be hidden (as per current App.tsx hidden lg:flex)
      const navLinks = page.locator('nav .hidden.lg\\:flex');
      await expect(navLinks).toBeHidden();
    } else {
      // In desktop view, they should be visible
      const navLinks = page.locator('nav .hidden.lg\\:flex');
      await expect(navLinks).toBeVisible();
    }
  });

  test('should have a functional "Alliance Brief" download button', async ({ page }) => {
    const downloadButton = page.locator('button:has-text("Alliance Brief")');
    await expect(downloadButton).toBeEnabled();
  });

  test('should display the compliance section with security icons', async ({ page }) => {
    const sovereigntySection = page.locator('#sovereignty');
    await expect(sovereigntySection).toBeVisible();
    
    await expect(page.locator('text=GDPR & DPA')).toBeVisible();
    await expect(page.locator('text=Data residency in West African AWS zones')).toBeVisible();
  });

});
