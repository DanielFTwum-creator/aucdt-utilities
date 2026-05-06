# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: alerts.spec.ts >> Alerts >> can add a percent-change alert
- Location: e2e\alerts.spec.ts:54:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('NVDA')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('NVDA')

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
    - generic [ref=e50]:
      - button "Admin" [ref=e51]:
        - img [ref=e52]
        - text: Admin
      - generic [ref=e56]:
        - generic [ref=e57]: EU
        - generic [ref=e58]:
          - paragraph [ref=e59]: E2E User mo6m47beelk9
          - paragraph [ref=e60]: e2e_mo6m47beelk9@test.local
          - paragraph [ref=e61]: Free Plan
  - generic [ref=e62]:
    - banner [ref=e63]:
      - generic "Market closed" [ref=e64]:
        - text: Market Closed
        - generic [ref=e66]: · 7:05 PM ET
      - generic [ref=e67]:
        - button "Upgrade to Premium" [ref=e68]:
          - img [ref=e69]
          - text: Upgrade
        - button "1 active alert" [ref=e71]:
          - img [ref=e72]
          - generic [ref=e75]: "1"
        - button "Switch to dark mode" [ref=e76]:
          - img [ref=e77]
        - button "Sign out" [ref=e79]:
          - img [ref=e80]
    - main [ref=e83]:
      - generic [ref=e84]:
        - generic [ref=e86]:
          - heading "Alerts" [level=1] [ref=e87]
          - paragraph [ref=e88]: 1/5 active alerts
        - generic [ref=e89]:
          - heading "New Alert" [level=2] [ref=e90]:
            - img [ref=e91]
            - text: New Alert
          - generic [ref=e92]:
            - generic [ref=e93]:
              - generic [ref=e94]: Ticker
              - textbox "Ticker" [ref=e95]:
                - /placeholder: AAPL
                - text: NVDA
            - generic [ref=e96]:
              - generic [ref=e97]: Type
              - combobox "Type" [ref=e98]:
                - option "Price"
                - option "% Change" [selected]
            - generic [ref=e99]:
              - generic [ref=e100]: Condition
              - combobox "Condition" [ref=e101]:
                - option "Above"
                - option "Below" [selected]
            - generic [ref=e102]:
              - generic [ref=e103]: Change (%)
              - spinbutton "Change (%)" [ref=e104]: "-5"
          - alert [ref=e105]: Too many requests. Please try again later.
          - button "Set Alert" [ref=e106]
        - generic [ref=e108]:
          - generic [ref=e109]:
            - img [ref=e110]
            - generic [ref=e113]:
              - text: AAPL
              - generic [ref=e114]: Price above $250
          - generic [ref=e115]:
            - generic [ref=e116]: Active
            - button "Delete alert for AAPL" [ref=e117]:
              - img [ref=e118]
        - generic [ref=e121]:
          - strong [ref=e122]: "Note:"
          - text: Alert triggering requires the background service to be running. Alerts are checked against live market data every 60 seconds during market hours.
```

# Test source

```ts
  1  | import { test, expect } from './screenshot';
  2  | import { registerViaApi, seedAuth } from './helpers';
  3  | 
  4  | test.describe('Alerts', () => {
  5  |   let tu: Awaited<ReturnType<typeof registerViaApi>>;
  6  | 
  7  |   test.beforeAll(async ({ request }) => {
  8  |     tu = await registerViaApi(request);
  9  |   });
  10 | 
  11 |   test.beforeEach(async ({ page }) => {
  12 |     await seedAuth(page, tu);
  13 |     await page.goto('/#/alerts');
  14 |     await expect(page.getByRole('heading', { name: 'Alerts' })).toBeVisible({ timeout: 10_000 });
  15 |   });
  16 | 
  17 |   test('shows sign-in prompt when logged out', async ({ page }) => {
  18 |     await page.evaluate(() => localStorage.clear());
  19 |     await page.goto('/#/alerts');
  20 |     await expect(page.getByText('Price Alerts')).toBeVisible();
  21 |     await expect(page.getByRole('button', { name: 'Sign in free' })).toBeVisible();
  22 |   });
  23 | 
  24 |   test('empty state message is shown when no alerts exist', async ({ page }) => {
  25 |     await expect(page.getByText('No alerts configured')).toBeVisible({ timeout: 8_000 });
  26 |   });
  27 | 
  28 |   test('alert count shows 0/5 for free tier', async ({ page }) => {
  29 |     await expect(page.getByText(/0\/5 active alerts/)).toBeVisible({ timeout: 8_000 });
  30 |   });
  31 | 
  32 |   // ─── Add alert ───────────────────────────────────────────────────────────────
  33 | 
  34 |   test('can add a price alert and it appears in the list', async ({ page }) => {
  35 |     await page.fill('#alert-ticker', 'AAPL');
  36 |     await page.selectOption('#alert-type', 'price');
  37 |     await page.selectOption('#alert-condition', 'above');
  38 |     await page.fill('#alert-value', '250.00');
  39 |     await page.getByRole('button', { name: 'Set Alert' }).click();
  40 | 
  41 |     await expect(page.getByText('AAPL')).toBeVisible({ timeout: 10_000 });
  42 |     await expect(page.getByText(/above \$250/i)).toBeVisible({ timeout: 8_000 });
  43 |   });
  44 | 
  45 |   test('alert count increments after adding', async ({ page }) => {
  46 |     await page.fill('#alert-ticker', 'TSLA');
  47 |     await page.fill('#alert-value', '200.00');
  48 |     await page.getByRole('button', { name: 'Set Alert' }).click();
  49 | 
  50 |     // Count should be at least 1/5 now (tests share the same user)
  51 |     await expect(page.getByText(/\d+\/5 active alerts/)).toBeVisible({ timeout: 8_000 });
  52 |   });
  53 | 
  54 |   test('can add a percent-change alert', async ({ page }) => {
  55 |     await page.fill('#alert-ticker', 'NVDA');
  56 |     await page.selectOption('#alert-type', 'percent_change');
  57 |     await page.selectOption('#alert-condition', 'below');
  58 |     await page.fill('#alert-value', '-5');
  59 |     await page.getByRole('button', { name: 'Set Alert' }).click();
  60 | 
> 61 |     await expect(page.getByText('NVDA')).toBeVisible({ timeout: 10_000 });
     |                                          ^ Error: expect(locator).toBeVisible() failed
  62 |     await expect(page.getByText(/% change.*below/i)).toBeVisible({ timeout: 8_000 });
  63 |   });
  64 | 
  65 |   test('ticker field is required — empty submission shows validation', async ({ page }) => {
  66 |     await page.fill('#alert-value', '100');
  67 |     await page.getByRole('button', { name: 'Set Alert' }).click();
  68 |     // HTML5 required validation should prevent submit; form stays open
  69 |     const tickerInput = page.locator('#alert-ticker');
  70 |     await expect(tickerInput).toBeVisible();
  71 |   });
  72 | 
  73 |   // ─── Delete alert ────────────────────────────────────────────────────────────
  74 | 
  75 |   test('deleting an alert removes it from the list', async ({ page }) => {
  76 |     // Add an alert first
  77 |     await page.fill('#alert-ticker', 'SPY');
  78 |     await page.fill('#alert-value', '500.00');
  79 |     await page.getByRole('button', { name: 'Set Alert' }).click();
  80 |     await expect(page.getByText('SPY')).toBeVisible({ timeout: 10_000 });
  81 | 
  82 |     // Delete it
  83 |     const spyRow = page.locator('[class*="rounded-xl"]').filter({ hasText: 'SPY' }).first();
  84 |     await spyRow.getByRole('button', { name: /delete/i }).click();
  85 | 
  86 |     await expect(spyRow).not.toBeVisible({ timeout: 8_000 });
  87 |   });
  88 | });
  89 | 
```