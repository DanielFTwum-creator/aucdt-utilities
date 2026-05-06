# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Auth – registration >> duplicate email shows error and does not register again
- Location: e2e\auth.spec.ts:61:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('alert')
Expected substring: "already exists"
Received string:    "Too many requests. Please try again later."
Timeout: 8000ms

Call log:
  - Expect "toContainText" with timeout 8000ms
  - waiting for getByRole('alert')
    12 × locator resolved to <div role="alert" class="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm p-3 rounded-lg mb-4">…</div>
       - unexpected value "Too many requests. Please try again later."

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation "Main navigation" [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e6]
      - generic [ref=e9]: StockPulse
    - navigation [ref=e10]:
      - button "Watchlist" [ref=e11]:
        - img [ref=e13]
        - text: Watchlist
      - button "Portfolio" [ref=e15]:
        - img [ref=e17]
        - text: Portfolio
      - button "Paper Trade" [ref=e18]:
        - img [ref=e20]
        - text: Paper Trade
      - button "Alerts" [ref=e22]:
        - img [ref=e24]
        - text: Alerts
      - button "AI Signals" [ref=e27]:
        - img [ref=e29]
        - text: AI Signals
      - button "News" [ref=e37]:
        - img [ref=e39]
        - text: News
      - button "Screener (Premium)" [ref=e42]:
        - img [ref=e44]
        - text: Screener
        - img "Premium feature" [ref=e47]
    - button "Sign in to get started →" [ref=e52]
  - generic [ref=e53]:
    - banner [ref=e54]:
      - generic "Market closed" [ref=e55]:
        - text: Market Closed
        - generic [ref=e57]: · 7:06 PM ET
      - generic [ref=e58]:
        - button "Switch to dark mode" [ref=e59]:
          - img [ref=e60]
        - button "Sign In" [ref=e62]:
          - img [ref=e63]
          - text: Sign In
    - main [ref=e66]:
      - generic [ref=e67]:
        - img [ref=e68]
        - heading "Track your stocks" [level=2] [ref=e71]
        - paragraph [ref=e72]: Sign in to build your personalised watchlist with real-time quotes and AI signals.
        - button "Sign in free" [ref=e73]
  - dialog "Authentication" [ref=e74]:
    - generic [ref=e75]:
      - button "Close" [ref=e76]:
        - img [ref=e77]
      - generic [ref=e80]:
        - img [ref=e81]
        - generic [ref=e84]: StockPulse
      - heading "Create your account" [level=2] [ref=e85]
      - paragraph [ref=e86]: Start your 14-day free trial. No credit card required.
      - alert [ref=e87]:
        - img [ref=e88]
        - text: Too many requests. Please try again later.
      - generic [ref=e90]:
        - generic [ref=e91]:
          - generic [ref=e92]: Full Name
          - textbox "Full Name" [ref=e93]:
            - /placeholder: Jane Smith
            - text: Dup Test 2
        - generic [ref=e94]:
          - generic [ref=e95]: Email
          - textbox "Email" [ref=e96]:
            - /placeholder: you@example.com
            - text: e2e_dup_mo6m572i1d9y@test.local
        - generic [ref=e97]:
          - generic [ref=e98]: Password
          - generic [ref=e99]:
            - textbox "Password" [ref=e100]:
              - /placeholder: ••••••••
              - text: TestPass123!
            - button "Show password" [ref=e101]:
              - img [ref=e102]
        - button "Create Account" [ref=e105]
      - paragraph [ref=e106]:
        - text: Already have an account?
        - button "Sign in" [ref=e107]
      - paragraph [ref=e108]: By signing up you agree to our Terms of Service and Privacy Policy.
```

# Test source

```ts
  1   | import { test, expect } from './screenshot';
  2   | import { uid, TEST_PASSWORD, registerViaApi, fillLoginModal, fillRegisterModal, seedAuth } from './helpers';
  3   | 
  4   | // ─── Guest state ──────────────────────────────────────────────────────────────
  5   | 
  6   | test.describe('Auth – guest state', () => {
  7   |   test('watchlist shows sign-in prompt when unauthenticated', async ({ page }) => {
  8   |     await page.goto('/#/watchlist');
  9   |     await expect(page.getByText('Sign in to build your personalised watchlist')).toBeVisible();
  10  |     await expect(page.getByRole('button', { name: 'Sign in free' })).toBeVisible();
  11  |   });
  12  | 
  13  |   test('portfolio shows sign-in prompt when unauthenticated', async ({ page }) => {
  14  |     await page.goto('/#/portfolio');
  15  |     await expect(page.getByText('Track your real portfolio')).toBeVisible();
  16  |   });
  17  | 
  18  |   test('auth modal opens on "Sign in free" click', async ({ page }) => {
  19  |     await page.goto('/');
  20  |     await page.getByRole('button', { name: 'Sign in free' }).first().click();
  21  |     await expect(page.getByRole('dialog', { name: 'Authentication' })).toBeVisible();
  22  |     await expect(page.getByText('Welcome back')).toBeVisible();
  23  |   });
  24  | 
  25  |   test('auth modal can toggle between login and register modes', async ({ page }) => {
  26  |     await page.goto('/');
  27  |     await page.getByRole('button', { name: 'Sign in free' }).first().click();
  28  |     await expect(page.getByText('Welcome back')).toBeVisible();
  29  | 
  30  |     await page.getByRole('button', { name: 'Sign up free' }).click();
  31  |     await expect(page.getByText('Create your account')).toBeVisible();
  32  |     await expect(page.locator('#auth-name')).toBeVisible();
  33  | 
  34  |     await page.getByRole('button', { name: 'Sign in' }).click();
  35  |     await expect(page.getByText('Welcome back')).toBeVisible();
  36  |   });
  37  | 
  38  |   test('auth modal closes on ✕ button', async ({ page }) => {
  39  |     await page.goto('/');
  40  |     await page.getByRole('button', { name: 'Sign in free' }).first().click();
  41  |     await page.getByRole('button', { name: 'Close' }).click();
  42  |     await expect(page.getByRole('dialog')).not.toBeVisible();
  43  |   });
  44  | });
  45  | 
  46  | // ─── Registration ─────────────────────────────────────────────────────────────
  47  | 
  48  | test.describe('Auth – registration', () => {
  49  |   test('new user can register and lands on Watchlist with defaults', async ({ page }) => {
  50  |     const id = uid();
  51  |     await page.goto('/');
  52  |     await page.getByRole('button', { name: 'Sign in free' }).first().click();
  53  |     await fillRegisterModal(page, `e2e_${id}@test.local`, TEST_PASSWORD, `E2E User ${id}`);
  54  | 
  55  |     await expect(page.getByRole('heading', { name: 'Watchlist' })).toBeVisible({ timeout: 15_000 });
  56  |     const table = page.getByRole('table');
  57  |     await expect(table.getByText('SOXL')).toBeVisible({ timeout: 15_000 });
  58  |     await expect(table.getByText('SOXS')).toBeVisible({ timeout: 15_000 });
  59  |   });
  60  | 
  61  |   test('duplicate email shows error and does not register again', async ({ page, request }) => {
  62  |     const id = uid();
  63  |     const email = `e2e_dup_${id}@test.local`;
  64  | 
  65  |     // Pre-register via API
  66  |     await request.post('/api/auth/register', {
  67  |       data: { email, password: TEST_PASSWORD, name: 'Dup Test' },
  68  |     });
  69  | 
  70  |     await page.goto('/');
  71  |     await page.getByRole('button', { name: 'Sign in free' }).first().click();
  72  |     await fillRegisterModal(page, email, TEST_PASSWORD, 'Dup Test 2');
  73  | 
> 74  |     await expect(page.getByRole('alert')).toContainText('already exists', { timeout: 8_000 });
      |                                           ^ Error: expect(locator).toContainText(expected) failed
  75  |     // Should stay on the auth modal
  76  |     await expect(page.getByRole('dialog', { name: 'Authentication' })).toBeVisible();
  77  |   });
  78  | 
  79  |   test('short password (< 8 chars) blocks registration', async ({ page }) => {
  80  |     const id = uid();
  81  |     await page.goto('/');
  82  |     await page.getByRole('button', { name: 'Sign in free' }).first().click();
  83  |     await fillRegisterModal(page, `e2e_${id}@test.local`, 'short', `User ${id}`);
  84  | 
  85  |     await expect(page.getByRole('alert')).toBeVisible({ timeout: 8_000 });
  86  |   });
  87  | });
  88  | 
  89  | // ─── Login ────────────────────────────────────────────────────────────────────
  90  | 
  91  | test.describe('Auth – login', () => {
  92  |   test('correct credentials authenticate and show Watchlist', async ({ page, request }) => {
  93  |     const id = uid();
  94  |     const email = `e2e_login_${id}@test.local`;
  95  |     await request.post('/api/auth/register', {
  96  |       data: { email, password: TEST_PASSWORD, name: `Login Test ${id}` },
  97  |     });
  98  | 
  99  |     await page.goto('/');
  100 |     await page.getByRole('button', { name: 'Sign in free' }).first().click();
  101 |     await fillLoginModal(page, email, TEST_PASSWORD);
  102 | 
  103 |     await expect(page.getByRole('heading', { name: 'Watchlist' })).toBeVisible({ timeout: 12_000 });
  104 |     await expect(page.getByRole('dialog')).not.toBeVisible();
  105 |   });
  106 | 
  107 |   test('wrong password shows error and stays on modal', async ({ page, request }) => {
  108 |     const id = uid();
  109 |     const email = `e2e_badpw_${id}@test.local`;
  110 |     await request.post('/api/auth/register', {
  111 |       data: { email, password: TEST_PASSWORD, name: `BadPW ${id}` },
  112 |     });
  113 | 
  114 |     await page.goto('/');
  115 |     await page.getByRole('button', { name: 'Sign in free' }).first().click();
  116 |     await fillLoginModal(page, email, 'WrongPassword99!');
  117 | 
  118 |     await expect(page.getByRole('alert')).toContainText('Invalid', { timeout: 8_000 });
  119 |     await expect(page.getByRole('dialog', { name: 'Authentication' })).toBeVisible();
  120 |   });
  121 | 
  122 |   test('unknown email shows error', async ({ page }) => {
  123 |     await page.goto('/');
  124 |     await page.getByRole('button', { name: 'Sign in free' }).first().click();
  125 |     await fillLoginModal(page, `nobody_${uid()}@nowhere.test`, TEST_PASSWORD);
  126 | 
  127 |     await expect(page.getByRole('alert')).toContainText('Invalid', { timeout: 8_000 });
  128 |   });
  129 | });
  130 | 
  131 | // ─── Logout ───────────────────────────────────────────────────────────────────
  132 | 
  133 | test.describe('Auth – logout', () => {
  134 |   test('logout clears session and returns to guest state', async ({ page, request }) => {
  135 |     const tu = await registerViaApi(request);
  136 |     await seedAuth(page, tu);
  137 |     await page.goto('/#/watchlist');
  138 | 
  139 |     await expect(page.getByRole('heading', { name: 'Watchlist' })).toBeVisible();
  140 | 
  141 |     // Find logout — it's in the Navbar user menu
  142 |     await page.getByRole('button', { name: /log.?out/i }).click();
  143 | 
  144 |     await expect(page.getByRole('button', { name: 'Sign in free' })).toBeVisible({ timeout: 8_000 });
  145 |     // Verify localStorage cleared
  146 |     const token = await page.evaluate(() => localStorage.getItem('sp_token'));
  147 |     expect(token).toBeNull();
  148 |   });
  149 | });
  150 | 
```