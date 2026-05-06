# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> new user watchlist defaults to SOXL and SOXS
- Location: e2e\home.spec.ts:5:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Watchlist' })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('heading', { name: 'Watchlist' })

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
            - text: Test User mo6m5wyf
        - generic [ref=e94]:
          - generic [ref=e95]: Email
          - textbox "Email" [ref=e96]:
            - /placeholder: you@example.com
            - text: test_mo6m5wyf@example.com
        - generic [ref=e97]:
          - generic [ref=e98]: Password
          - generic [ref=e99]:
            - textbox "Password" [ref=e100]:
              - /placeholder: ••••••••
              - text: Password123!
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
  1  | import { test, expect } from './screenshot';
  2  | 
  3  | const uid = () => Date.now().toString(36);
  4  | 
  5  | test('new user watchlist defaults to SOXL and SOXS', async ({ page }) => {
  6  |   await page.goto('/');
  7  | 
  8  |   // Open auth modal then switch to register
  9  |   await page.getByText('Sign in to get started →').click();
  10 |   await page.getByText('Sign up free').click();
  11 | 
  12 |   const id = uid();
  13 |   await page.fill('#auth-name', `Test User ${id}`);
  14 |   await page.fill('#auth-email', `test_${id}@example.com`);
  15 |   await page.fill('#auth-password', 'Password123!');
  16 |   await page.getByRole('button', { name: 'Create Account' }).click();
  17 | 
  18 |   // Wait for watchlist section heading to load
> 19 |   await expect(page.getByRole('heading', { name: 'Watchlist' })).toBeVisible({ timeout: 10000 });
     |                                                                  ^ Error: expect(locator).toBeVisible() failed
  20 | 
  21 |   // Both default tickers must appear in the watchlist rows
  22 |   const table = page.getByRole('table');
  23 |   await expect(table.getByText('SOXL')).toBeVisible({ timeout: 15000 });
  24 |   await expect(table.getByText('SOXS')).toBeVisible({ timeout: 15000 });
  25 | });
  26 | 
```