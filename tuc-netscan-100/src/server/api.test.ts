import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import express from 'express';
import { createNetScanApi, askGeminiForDiagnosis } from './api.ts';

describe('TUC NetScan-100 Backend API & Services', () => {
  let app: express.Application;
  let server: any;
  let port: number;

  before(async () => {
    app = express();
    app.use(express.json());
    app.use('/api/v1', createNetScanApi());
    
    // Start server on a random open port
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        port = (server.address() as any).port;
        resolve();
      });
    });
  });

  after(() => {
    if (server) {
      server.close();
    }
  });

  test('should fallback to local expert system when GEMINI_API_KEY is not set', async () => {
    // Force key to be empty/unset
    const oldKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    try {
      const response = await askGeminiForDiagnosis('Tell me about telnet and port 23 risks');
      assert.ok(response.includes('TUC NetScan Security Advisory'));
      assert.ok(response.includes('Telnet/23'));
      assert.ok(response.includes('iptables'));
    } finally {
      process.env.GEMINI_API_KEY = oldKey;
    }
  });

  test('GET /api/v1/health should return network status and mode', async () => {
    const res = await fetch(`http://localhost:${port}/api/v1/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.json() as any;
    assert.strictEqual(body.mode, 'LIVE_LAN');
    assert.ok('status' in body);
    assert.ok('discovered_devices' in body);
  });

  test('GET /api/v1/devices should return active/inactive devices list', async () => {
    const res = await fetch(`http://localhost:${port}/api/v1/devices`);
    assert.strictEqual(res.status, 200);
    const body = await res.json() as any;
    assert.ok(Array.isArray(body));
  });

  test('GET /api/v1/topology should return topology tree', async () => {
    const res = await fetch(`http://localhost:${port}/api/v1/topology`);
    assert.strictEqual(res.status, 200);
    const body = await res.json() as any;
    assert.ok(body.inferred);
    assert.ok('tree' in body);
  });
});
