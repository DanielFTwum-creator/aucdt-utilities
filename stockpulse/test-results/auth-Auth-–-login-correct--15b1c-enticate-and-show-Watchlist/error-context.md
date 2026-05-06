# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Auth – login >> correct credentials authenticate and show Watchlist
- Location: e2e\auth.spec.ts:92:3

# Error details

```
Error: locator.click: Error: strict mode violation: getByRole('button', { name: 'Sign In' }) resolved to 4 elements:
    1) <button type="button" class="text-[12px] text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Sign in to get started →</button> aka getByRole('button', { name: 'Sign in to get started →' })
    2) <button type="button" class="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-xs transition-colors">…</button> aka getByRole('banner').getByRole('button', { name: 'Sign In' })
    3) <button type="button" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm">Sign in free</button> aka getByRole('button', { name: 'Sign in free' })
    4) <button type="submit" aria-busy="false" class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">Sign In</button> aka getByLabel('Authentication').getByRole('button', { name: 'Sign In' })

Call log:
  - waiting for getByRole('button', { name: 'Sign In' })

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
      - heading "Welcome back" [level=2] [ref=e85]
      - paragraph [ref=e86]: Sign in to access your portfolio.
      - generic [ref=e87]:
        - generic [ref=e88]:
          - generic [ref=e89]: Email
          - textbox "Email" [ref=e90]:
            - /placeholder: you@example.com
            - text: e2e_login_mo6m5nyr8ztu@test.local
        - generic [ref=e91]:
          - generic [ref=e92]: Password
          - generic [ref=e93]:
            - textbox "Password" [active] [ref=e94]:
              - /placeholder: ••••••••
              - text: TestPass123!
            - button "Show password" [ref=e95]:
              - img [ref=e96]
        - button "Sign In" [ref=e99]
      - paragraph [ref=e100]:
        - text: Don't have an account?
        - button "Sign up free" [ref=e101]
```

# Test source

```ts
  1  | import type { APIRequestContext, Page } from '@playwright/test';
  2  | 
  3  | export const TEST_PASSWORD = 'TestPass123!';
  4  | 
  5  | export function uid(): string {
  6  |   return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  7  | }
  8  | 
  9  | export interface TestUser {
  10 |   email: string;
  11 |   password: string;
  12 |   name: string;
  13 |   token: string;
  14 |   user: Record<string, unknown>;
  15 | }
  16 | 
  17 | /** Register a fresh user via API and return their credentials + JWT. */
  18 | export async function registerViaApi(request: APIRequestContext): Promise<TestUser> {
  19 |   const id = uid();
  20 |   const email = `e2e_${id}@test.local`;
  21 |   const name = `E2E User ${id}`;
  22 |   const password = TEST_PASSWORD;
  23 | 
  24 |   const res = await request.post('/api/auth/register', {
  25 |     data: { email, password, name },
  26 |   });
  27 |   if (!res.ok()) {
  28 |     throw new Error(`Registration failed: ${res.status()} ${await res.text()}`);
  29 |   }
  30 |   const { token, user } = await res.json();
  31 |   return { email, password, name, token, user };
  32 | }
  33 | 
  34 | /**
  35 |  * Seed localStorage so the app boots as an authenticated user
  36 |  * without going through the login UI. Must be called before page.goto().
  37 |  */
  38 | export async function seedAuth(page: Page, tu: TestUser): Promise<void> {
  39 |   await page.addInitScript(({ token, user }) => {
  40 |     localStorage.setItem('sp_token', token);
  41 |     localStorage.setItem('sp_user', JSON.stringify(user));
  42 |   }, { token: tu.token, user: tu.user });
  43 | }
  44 | 
  45 | /** Login through the UI modal. Assumes modal is already open. */
  46 | export async function fillLoginModal(
  47 |   page: Page,
  48 |   email: string,
  49 |   password: string,
  50 | ): Promise<void> {
  51 |   await page.fill('#auth-email', email);
  52 |   await page.fill('#auth-password', password);
> 53 |   await page.getByRole('button', { name: 'Sign In' }).click();
     |                                                       ^ Error: locator.click: Error: strict mode violation: getByRole('button', { name: 'Sign In' }) resolved to 4 elements:
  54 | }
  55 | 
  56 | /** Open the auth modal, switch to register, fill the form. */
  57 | export async function fillRegisterModal(
  58 |   page: Page,
  59 |   email: string,
  60 |   password: string,
  61 |   name: string,
  62 | ): Promise<void> {
  63 |   await page.getByRole('button', { name: 'Sign up free' }).click();
  64 |   await page.fill('#auth-name', name);
  65 |   await page.fill('#auth-email', email);
  66 |   await page.fill('#auth-password', password);
  67 |   await page.getByRole('button', { name: 'Create Account' }).click();
  68 | }
  69 | 
  70 | /** Navigate to a hash-route view via the sidebar. */
  71 | export async function navigateTo(
  72 |   page: Page,
  73 |   label: 'Watchlist' | 'Portfolio' | 'Paper Trade' | 'Alerts' | 'AI Signals' | 'News',
  74 | ): Promise<void> {
  75 |   await page.getByRole('link', { name: label }).click();
  76 | }
  77 | 
```