import type { APIRequestContext, Page } from '@playwright/test';

export const TEST_PASSWORD = 'TestPass123!';

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export interface TestUser {
  email: string;
  password: string;
  name: string;
  token: string;
  user: Record<string, unknown>;
}

/** Register a fresh user via API and return their credentials + JWT. */
export async function registerViaApi(request: APIRequestContext): Promise<TestUser> {
  const id = uid();
  const email = `e2e_${id}@test.local`;
  const name = `E2E User ${id}`;
  const password = TEST_PASSWORD;

  const res = await request.post('/api/auth/register', {
    data: { email, password, name },
  });
  if (!res.ok()) {
    throw new Error(`Registration failed: ${res.status()} ${await res.text()}`);
  }
  const { token, user } = await res.json();
  return { email, password, name, token, user };
}

/**
 * Seed localStorage so the app boots as an authenticated user
 * without going through the login UI. Must be called before page.goto().
 */
export async function seedAuth(page: Page, tu: TestUser): Promise<void> {
  await page.addInitScript(({ token, user }) => {
    localStorage.setItem('sp_token', token);
    localStorage.setItem('sp_user', JSON.stringify(user));
  }, { token: tu.token, user: tu.user });
}

/** Login through the UI modal. Assumes modal is already open. */
export async function fillLoginModal(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await page.fill('#auth-email', email);
  await page.fill('#auth-password', password);
  await page.getByRole('button', { name: 'Sign In' }).click();
}

/** Open the auth modal, switch to register, fill the form. */
export async function fillRegisterModal(
  page: Page,
  email: string,
  password: string,
  name: string,
): Promise<void> {
  await page.getByRole('button', { name: 'Sign up free' }).click();
  await page.fill('#auth-name', name);
  await page.fill('#auth-email', email);
  await page.fill('#auth-password', password);
  await page.getByRole('button', { name: 'Create Account' }).click();
}

/** Navigate to a hash-route view via the sidebar. */
export async function navigateTo(
  page: Page,
  label: 'Watchlist' | 'Portfolio' | 'Paper Trade' | 'Alerts' | 'AI Signals' | 'News',
): Promise<void> {
  await page.getByRole('link', { name: label }).click();
}
