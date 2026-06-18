import { test, expect } from './screenshot';
import { uid, TEST_PASSWORD, registerViaApi, fillLoginModal, fillRegisterModal, seedAuth } from './helpers';

// ─── Guest state ──────────────────────────────────────────────────────────────

test.describe('Auth – guest state', () => {
  test('watchlist shows sign-in prompt when unauthenticated', async ({ page }) => {
    await page.goto('/#/watchlist');
    await expect(page.getByText('Sign in to build your personalised watchlist')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in free' })).toBeVisible();
  });

  test('portfolio shows sign-in prompt when unauthenticated', async ({ page }) => {
    await page.goto('/#/portfolio');
    await expect(page.getByText('Track your real portfolio')).toBeVisible();
  });

  test('auth modal opens on "Sign in free" click', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign in free' }).first().click();
    await expect(page.getByRole('dialog', { name: 'Authentication' })).toBeVisible();
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('auth modal can toggle between login and register modes', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign in free' }).first().click();
    await expect(page.getByText('Welcome back')).toBeVisible();

    await page.getByRole('button', { name: 'Sign up free' }).click();
    await expect(page.getByText('Create your account')).toBeVisible();
    await expect(page.locator('#auth-name')).toBeVisible();

    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('auth modal closes on ✕ button', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign in free' }).first().click();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});

// ─── Registration ─────────────────────────────────────────────────────────────

test.describe('Auth – registration', () => {
  test('new user can register and lands on Watchlist with defaults', async ({ page }) => {
    const id = uid();
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign in free' }).first().click();
    await fillRegisterModal(page, `e2e_${id}@test.local`, TEST_PASSWORD, `E2E User ${id}`);

    await expect(page.getByRole('heading', { name: 'Watchlist' })).toBeVisible({ timeout: 15_000 });
    const table = page.getByRole('table');
    await expect(table.getByText('SOXL')).toBeVisible({ timeout: 15_000 });
    await expect(table.getByText('SOXS')).toBeVisible({ timeout: 15_000 });
  });

  test('duplicate email shows error and does not register again', async ({ page, request }) => {
    const id = uid();
    const email = `e2e_dup_${id}@test.local`;

    // Pre-register via API
    await request.post('/api/auth/register', {
      data: { email, password: TEST_PASSWORD, name: 'Dup Test' },
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Sign in free' }).first().click();
    await fillRegisterModal(page, email, TEST_PASSWORD, 'Dup Test 2');

    await expect(page.getByRole('alert')).toContainText('already exists', { timeout: 8_000 });
    // Should stay on the auth modal
    await expect(page.getByRole('dialog', { name: 'Authentication' })).toBeVisible();
  });

  test('short password (< 8 chars) blocks registration', async ({ page }) => {
    const id = uid();
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign in free' }).first().click();
    await fillRegisterModal(page, `e2e_${id}@test.local`, 'short', `User ${id}`);

    await expect(page.getByRole('alert')).toBeVisible({ timeout: 8_000 });
  });
});

// ─── Login ────────────────────────────────────────────────────────────────────

test.describe('Auth – login', () => {
  test('correct credentials authenticate and show Watchlist', async ({ page, request }) => {
    const id = uid();
    const email = `e2e_login_${id}@test.local`;
    await request.post('/api/auth/register', {
      data: { email, password: TEST_PASSWORD, name: `Login Test ${id}` },
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Sign in free' }).first().click();
    await fillLoginModal(page, email, TEST_PASSWORD);

    await expect(page.getByRole('heading', { name: 'Watchlist' })).toBeVisible({ timeout: 12_000 });
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('wrong password shows error and stays on modal', async ({ page, request }) => {
    const id = uid();
    const email = `e2e_badpw_${id}@test.local`;
    await request.post('/api/auth/register', {
      data: { email, password: TEST_PASSWORD, name: `BadPW ${id}` },
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Sign in free' }).first().click();
    await fillLoginModal(page, email, 'WrongPassword99!');

    await expect(page.getByRole('alert')).toContainText('Invalid', { timeout: 8_000 });
    await expect(page.getByRole('dialog', { name: 'Authentication' })).toBeVisible();
  });

  test('unknown email shows error', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign in free' }).first().click();
    await fillLoginModal(page, `nobody_${uid()}@nowhere.test`, TEST_PASSWORD);

    await expect(page.getByRole('alert')).toContainText('Invalid', { timeout: 8_000 });
  });
});

// ─── Logout ───────────────────────────────────────────────────────────────────

test.describe('Auth – logout', () => {
  test('logout clears session and returns to guest state', async ({ page, request }) => {
    const tu = await registerViaApi(request);
    await seedAuth(page, tu);
    await page.goto('/#/watchlist');

    await expect(page.getByRole('heading', { name: 'Watchlist' })).toBeVisible();

    // Find logout — it's in the Navbar user menu
    await page.getByRole('button', { name: /log.?out/i }).click();

    await expect(page.getByRole('button', { name: 'Sign in free' })).toBeVisible({ timeout: 8_000 });
    // Verify localStorage cleared
    const token = await page.evaluate(() => localStorage.getItem('sp_token'));
    expect(token).toBeNull();
  });
});

// ─── Google OAuth callback ────────────────────────────────────────────────────

test.describe('Auth – Google OAuth callback', () => {
  test('?sp_token= param logs user in and is cleared from URL', async ({ page, request }) => {
    // Register to get a valid JWT, then simulate the backend ?sp_token= redirect
    const tu = await registerViaApi(request);

    // Intercept /api/auth/me so the app validates the token from the URL
    await page.route('/api/auth/me', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(tu.user) })
    );

    await page.goto(`/?sp_token=${encodeURIComponent(tu.token)}`);

    // URL should be cleaned — no sp_token param remaining
    await page.waitForFunction(() => !window.location.search.includes('sp_token'), { timeout: 8_000 });
    expect(page.url()).not.toContain('sp_token');

    // User should be authenticated
    const stored = await page.evaluate(() => localStorage.getItem('sp_token'));
    expect(stored).not.toBeNull();
  });

  test('?auth_error= param shows error and clears the param', async ({ page }) => {
    await page.goto('/?auth_error=oauth');

    await expect(page.getByRole('alert').or(page.getByText(/sign-in failed|try again/i))).toBeVisible({ timeout: 8_000 });
    await page.waitForFunction(() => !window.location.search.includes('auth_error'), { timeout: 5_000 });
    expect(page.url()).not.toContain('auth_error');
  });

  test('Google button in auth modal redirects to /api/auth/google', async ({ page }) => {
    // Intercept the redirect so the test doesn't actually leave the domain
    await page.route('/api/auth/google', route =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>mock-google-redirect</body></html>' })
    );

    await page.goto('/');
    await page.getByRole('button', { name: 'Sign in free' }).first().click();
    await page.getByRole('button', { name: /continue with google/i }).click();

    await page.waitForURL(/\/api\/auth\/google/, { timeout: 5_000 });
  });
});
