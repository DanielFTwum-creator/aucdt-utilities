# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Navigation & layout >> sidebar "watchlist" navigates to correct view
- Location: e2e\navigation.spec.ts:23:5

# Error details

```
Error: Registration failed: 429 {"error":"Too many requests. Please try again later."}
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
> 28 |     throw new Error(`Registration failed: ${res.status()} ${await res.text()}`);
     |           ^ Error: Registration failed: 429 {"error":"Too many requests. Please try again later."}
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
  53 |   await page.getByRole('button', { name: 'Sign In' }).click();
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