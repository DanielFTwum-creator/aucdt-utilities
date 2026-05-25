import { test, expect } from '@playwright/test';

test.describe('Health Check Endpoints', () => {
  test('GET /api/health should return status ok', async ({ request }) => {
    const response = await request.get('http://localhost:5000/api/health');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('service', 'tuc-rms-api');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('uptime');
    expect(typeof data.uptime).toBe('number');
  });

  test('GET /api/health/full should return detailed health status', async ({ request }) => {
    const response = await request.get('http://localhost:5000/api/health/full');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('database');
    expect(data.database).toHaveProperty('status');
    expect(data).toHaveProperty('memory');
    expect(data.memory).toHaveProperty('heapUsed');
    expect(data.memory).toHaveProperty('heapTotal');
    expect(data.memory).toHaveProperty('external');
  });
});
