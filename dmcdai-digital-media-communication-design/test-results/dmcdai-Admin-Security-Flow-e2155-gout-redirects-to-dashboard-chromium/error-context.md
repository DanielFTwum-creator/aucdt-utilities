# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dmcdai.spec.ts >> Admin Security Flow >> admin logout redirects to dashboard
- Location: tests\dmcdai.spec.ts:90:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#password')

```

# Page snapshot

```yaml
- dialog "Techbridge 2FA Login" [ref=e4]:
  - generic [ref=e5]:
    - heading "Techbridge 2FA Login" [level=2] [ref=e6]
    - generic [ref=e7]:
      - generic [ref=e8]: Techbridge Email Address
      - textbox "Techbridge Email Address" [active] [ref=e9]
      - button "Send code" [ref=e11] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test';
  2   | 
  3   | const TEST_EMAIL = process.env.DMCDAI_TEST_EMAIL ?? 'student@techbridge.edu.gh';
  4   | 
  5   | async function automatedLogin(page: Page) {
  6   |   await page.goto('/', { waitUntil: 'networkidle' });
  7   |   await page.evaluate(() => {
  8   |     (window as any).__dmcdaiAuto2FAEnabled = true;
  9   |   });
  10  |   await expect(page.getByText('Techbridge 2FA Login')).toBeVisible();
  11  |   await page.locator('#email').fill(TEST_EMAIL);
  12  |   const sendCodeButton = page.getByRole('button', { name: 'Send code' });
  13  |   await expect(sendCodeButton).toBeVisible();
  14  |   await sendCodeButton.click();
  15  |   await page.locator('#code').waitFor({ state: 'visible' });
  16  |   const otp = await page.evaluate(() => (window as any).__dmcdaiPendingOtp as string);
  17  |   await page.locator('#code').fill(otp);
  18  |   await page.getByRole('button', { name: 'Verify code' }).click();
  19  |   await expect(page.getByText('Explore AI in DMCD')).toBeVisible();
  20  | }
  21  | 
  22  | test.describe('dmcdAI Core User Flows', () => {
  23  | 
  24  |   test.beforeEach(async ({ page }) => {
  25  |     await automatedLogin(page);
  26  |   });
  27  | 
  28  |   test('should display the dashboard and institutional branding', async ({ page }) => {
  29  |     await expect(page.getByText('dmcdAI')).toBeVisible();
  30  |     await expect(page.getByText('Explore AI in DMCD')).toBeVisible();
  31  |     await expect(page.getByText('Techbridge University College')).toBeVisible();
  32  |   });
  33  | 
  34  |   test('should navigate to Visual Design module', async ({ page }) => {
  35  |     await page.getByRole('button', { name: 'Open module: AI-Driven Visual Design' }).click();
  36  |     await expect(page.getByText('Image Prompt')).toBeVisible();
  37  |     await expect(page.locator('h2')).toContainText('AI-Driven Visual Design');
  38  |   });
  39  | 
  40  |   test('should navigate back to dashboard via home button', async ({ page }) => {
  41  |     await page.getByRole('button', { name: 'Open module: AI-Driven Visual Design' }).click();
  42  |     await page.getByRole('button', { name: 'Go to dashboard' }).click();
  43  |     await expect(page.getByText('Explore AI in DMCD')).toBeVisible();
  44  |   });
  45  | 
  46  |   test('should navigate all 10 modules from sidebar', async ({ page }) => {
  47  |     const moduleLabels = [
  48  |       'Open AI-Driven Visual Design',
  49  |       'Open Automated Video Production',
  50  |       'Open Generative Content Creation',
  51  |       'Open Personalized Media',
  52  |       'Open Interactive Storytelling',
  53  |       'Open Sentiment Analysis',
  54  |       'Open AI-Assisted UX/UI Design',
  55  |       'Open AI in Branding Systems',
  56  |       'Open Synthetic Media',
  57  |       'Open Ethics in AI Design',
  58  |     ];
  59  |     for (const label of moduleLabels) {
  60  |       await page.getByRole('button', { name: label }).click();
  61  |       await page.getByRole('button', { name: 'Go to dashboard' }).click();
  62  |     }
  63  |     await expect(page.getByText('Explore AI in DMCD')).toBeVisible();
  64  |   });
  65  | 
  66  | });
  67  | 
  68  | test.describe('Admin Security Flow', () => {
  69  | 
  70  |   test('direct hash navigation to /admin shows login modal', async ({ page }) => {
  71  |     await page.goto('/#/admin');
  72  |     await expect(page.getByText('Admin Login')).toBeVisible();
  73  |     await expect(page.locator('label[for="password"]')).toBeVisible();
  74  |   });
  75  | 
  76  |   test('incorrect password shows error message', async ({ page }) => {
  77  |     await page.goto('/#/admin');
  78  |     await page.locator('#password').fill('wrong-password');
  79  |     await page.getByRole('button', { name: 'Login' }).click();
  80  |     await expect(page.getByText('Incorrect password')).toBeVisible();
  81  |   });
  82  | 
  83  |   test('correct password grants admin access', async ({ page }) => {
  84  |     await page.goto('/#/admin');
  85  |     await page.locator('#password').fill('dmcdai-admin-2025-secure');
  86  |     await page.getByRole('button', { name: 'Login' }).click();
  87  |     await expect(page.getByText('Admin Control Center')).toBeVisible();
  88  |   });
  89  | 
  90  |   test('admin logout redirects to dashboard', async ({ page }) => {
  91  |     await page.goto('/#/admin');
> 92  |     await page.locator('#password').fill('dmcdai-admin-2025-secure');
      |                                     ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  93  |     await page.getByRole('button', { name: 'Login' }).click();
  94  |     await page.getByRole('button', { name: 'Logout from Admin Panel' }).click();
  95  |     await expect(page.getByText('Explore AI in DMCD')).toBeVisible();
  96  |     await expect(page.getByText('Admin Control Center')).not.toBeVisible();
  97  |   });
  98  | 
  99  |   test('cancel on login modal clears admin hash', async ({ page }) => {
  100 |     await page.goto('/#/admin');
  101 |     await page.getByRole('button', { name: 'Cancel login' }).click();
  102 |     await expect(page.getByText('Admin Login')).not.toBeVisible();
  103 |     expect(page.url()).not.toContain('#/admin');
  104 |   });
  105 | 
  106 |   test('simulator toggle is visible in diagnostics tab', async ({ page }) => {
  107 |     await page.goto('/#/admin');
  108 |     await page.locator('#password').fill('dmcdai-admin-2025-secure');
  109 |     await page.getByRole('button', { name: 'Login' }).click();
  110 |     await page.getByRole('button', { name: 'System Diagnostics' }).click();
  111 |     await expect(page.getByText('AI Simulator Mode')).toBeVisible();
  112 |     await page.getByRole('button', { name: 'Disable AI Simulator' }).or(
  113 |       page.getByRole('button', { name: 'Enable AI Simulator' })
  114 |     ).click();
  115 |     // After toggle, button label should flip
  116 |     await expect(
  117 |       page.getByRole('button', { name: 'Disable AI Simulator' }).or(
  118 |         page.getByRole('button', { name: 'Enable AI Simulator' })
  119 |       )
  120 |     ).toBeVisible();
  121 |   });
  122 | 
  123 | });
  124 | 
  125 | test.describe('Theme Persistence', () => {
  126 | 
  127 |   test.beforeEach(async ({ page }) => {
  128 |     await automatedLogin(page);
  129 |   });
  130 | 
  131 |   test('theme selection persists across page reload', async ({ page }) => {
  132 |     await page.getByLabel('Select a display theme').selectOption('light');
  133 |     await page.reload();
  134 |     await expect(page.getByLabel('Select a display theme')).toHaveValue('light');
  135 |     const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  136 |     expect(theme).toBe('light');
  137 |   });
  138 | 
  139 |   test('high-contrast theme applies data-theme attribute', async ({ page }) => {
  140 |     await page.getByLabel('Select a display theme').selectOption('high-contrast');
  141 |     const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  142 |     expect(theme).toBe('high-contrast');
  143 |   });
  144 | 
  145 |   test('dark theme is default when no preference stored', async ({ page }) => {
  146 |     await page.evaluate(() => localStorage.removeItem('dmcdAI-theme'));
  147 |     await page.reload();
  148 |     await expect(page.getByLabel('Select a display theme')).toHaveValue('dark');
  149 |   });
  150 | 
  151 | });
  152 | 
  153 | test.describe('Accessibility', () => {
  154 | 
  155 |   test.beforeEach(async ({ page }) => {
  156 |     await automatedLogin(page);
  157 |   });
  158 | 
  159 |   test('all module cards have aria-label', async ({ page }) => {
  160 |     const cards = page.getByRole('button', { name: /Open module:/ });
  161 |     const count = await cards.count();
  162 |     expect(count).toBe(10);
  163 |   });
  164 | 
  165 |   test('login modal has role=dialog and aria-modal', async ({ page }) => {
  166 |     await page.goto('/#/admin');
  167 |     const dialog = page.locator('[role="dialog"][aria-modal="true"]');
  168 |     await expect(dialog).toBeVisible();
  169 |   });
  170 | 
  171 |   test('result areas have aria-live=polite', async ({ page }) => {
  172 |     await page.goto('/');
  173 |     await page.getByRole('button', { name: 'Open module: Sentiment Analysis' }).click();
  174 |     const liveRegion = page.locator('[aria-live="polite"]');
  175 |     await expect(liveRegion.first()).toBeAttached();
  176 |   });
  177 | 
  178 | });
  179 | 
```