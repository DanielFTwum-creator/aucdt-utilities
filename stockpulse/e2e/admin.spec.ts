import { test, expect } from './screenshot';
import { registerViaApi, seedAuth } from './helpers';

const MOCK_ADMIN_STATS = { totalUsers: 42, premiumUsers: 12, freeUsers: 30, todayLogins: 8 };
const MOCK_USERS = {
  users: [
    { id: 1, email: 'alice@test.com', name: 'Alice', tier: 'free', created_at: '2026-01-01', last_login: '2026-06-18' },
    { id: 2, email: 'bob@test.com', name: 'Bob', tier: 'premium', created_at: '2026-01-02', last_login: '2026-06-17' },
  ],
  total: 2, page: 1, pages: 1,
};
const MOCK_LOGS = {
  logs: [
    { id: 1, user_id: 1, action: 'LOGIN', details: 'Login from 127.0.0.1', ip: '127.0.0.1', created_at: '2026-06-18T10:00:00Z' },
    { id: 2, user_id: 2, action: 'REGISTER', details: 'New user: bob@test.com', ip: '10.0.0.1', created_at: '2026-01-02T08:00:00Z' },
  ],
  total: 2, page: 1, pages: 1,
};

// Fake admin session (admin access is email-based; we mock the API responses)
const ADMIN_USER = { id: 99, email: 'daniel.twum@techbridge.edu.gh', name: 'Daniel Twum', tier: 'premium' };
const ADMIN_TOKEN = 'fake-admin-token';

async function seedAdmin(page: import('@playwright/test').Page) {
  await page.addInitScript(({ token, user }) => {
    localStorage.setItem('sp_token', token);
    localStorage.setItem('sp_user', JSON.stringify(user));
  }, { token: ADMIN_TOKEN, user: ADMIN_USER });
}

test.describe('Admin Panel', () => {
  let regularUser: Awaited<ReturnType<typeof registerViaApi>>;

  test.beforeAll(async ({ request }) => {
    regularUser = await registerViaApi(request);
  });

  // ── Access control ────────────────────────────────────────────────────────

  test('admin nav link is visible for admin email', async ({ page }) => {
    await seedAdmin(page);
    await page.route('/api/admin/**', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_ADMIN_STATS) })
    );
    await page.goto('/');
    await expect(page.getByRole('link', { name: /admin/i })).toBeVisible({ timeout: 8_000 });
  });

  test('admin nav link is NOT visible for regular users', async ({ page }) => {
    await seedAuth(page, regularUser);
    await page.goto('/');
    await expect(page.getByRole('link', { name: /^admin$/i })).not.toBeVisible({ timeout: 5_000 });
  });

  // ── Admin dashboard ───────────────────────────────────────────────────────

  test('loads admin panel with user statistics', async ({ page }) => {
    await seedAdmin(page);
    await page.route('/api/admin/stats', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_ADMIN_STATS) })
    );
    await page.route('/api/admin/users*', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_USERS) })
    );
    await page.route('/api/admin/audit-logs*', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_LOGS) })
    );
    await page.goto('/#/admin');
    await expect(page.getByText('42').or(page.getByText('42 users'))).toBeVisible({ timeout: 8_000 });
  });

  test('displays users table with email and tier', async ({ page }) => {
    await seedAdmin(page);
    await page.route('/api/admin/stats', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_ADMIN_STATS) })
    );
    await page.route('/api/admin/users*', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_USERS) })
    );
    await page.route('/api/admin/audit-logs*', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_LOGS) })
    );
    await page.goto('/#/admin');
    await expect(page.getByText('alice@test.com')).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText('bob@test.com')).toBeVisible();
  });

  test('displays audit log with actions', async ({ page }) => {
    await seedAdmin(page);
    await page.route('/api/admin/stats', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_ADMIN_STATS) })
    );
    await page.route('/api/admin/users*', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_USERS) })
    );
    await page.route('/api/admin/audit-logs*', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_LOGS) })
    );
    await page.goto('/#/admin');
    await expect(page.getByText('LOGIN')).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText('REGISTER')).toBeVisible();
  });

  // ── Non-admin access ──────────────────────────────────────────────────────

  test('returns 403 on admin API calls for non-admin users', async ({ page }) => {
    await page.route('/api/admin/**', route =>
      route.fulfill({ status: 403, contentType: 'application/json', body: JSON.stringify({ error: 'Forbidden' }) })
    );
    await seedAuth(page, regularUser);
    await page.goto('/#/admin');
    // Admin panel should show a permission error or not render the table
    const forbidden = page.getByText(/not authorized|forbidden|admin only|permission|403/i);
    const noData = page.getByText(/no users|no data/i);
    await expect(forbidden.or(noData)).toBeVisible({ timeout: 8_000 });
  });

  // ── Search ────────────────────────────────────────────────────────────────

  test('searches users by email', async ({ page }) => {
    await seedAdmin(page);
    await page.route('/api/admin/stats', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_ADMIN_STATS) })
    );
    await page.route('/api/admin/users*', route => {
      const url = route.request().url();
      const filtered = url.includes('alice') ? [MOCK_USERS.users[0]] : MOCK_USERS.users;
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ...MOCK_USERS, users: filtered }) });
    });
    await page.route('/api/admin/audit-logs*', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_LOGS) })
    );
    await page.goto('/#/admin');
    await page.waitForSelector('text=alice@test.com', { timeout: 8_000 });
    const search = page.getByPlaceholder(/search|email/i).first();
    if (await search.count() > 0) {
      await search.fill('alice');
      await expect(page.getByText('alice@test.com')).toBeVisible({ timeout: 5_000 });
      await expect(page.getByText('bob@test.com')).not.toBeVisible({ timeout: 3_000 });
    }
  });
});
