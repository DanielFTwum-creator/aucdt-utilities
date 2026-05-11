import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Loader2, Terminal } from 'lucide-react';

interface TestResult {
  id: string;
  name: string;
  file: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  logs: string[];
  screenshot?: string;
}

const TEST_SUITE: Omit<TestResult, 'status' | 'logs'>[] = [
  { id: '1', name: 'E2E-01: Homepage Load & Navigation', file: 'homepage.test.ts' },
  { id: '2', name: 'E2E-02: Shop / Collections',        file: 'shop.test.ts'     },
  { id: '3', name: 'E2E-03: About Page Content',        file: 'about.test.ts'    },
  { id: '4', name: 'E2E-04: AI Studio Tabs',            file: 'ai-studio.test.ts'},
  { id: '5', name: 'E2E-05: Admin Console Auth & Inventory', file: 'admin.test.ts' },
];

const SIMULATED_LOGS: Record<string, string[]> = {
  '1': [
    'playwright: launching Chromium…',
    'page.goto http://localhost:3000',
    'expect(h1).toContainText("YOUR") → ✓',
    'expect(nav link "Shop Collections").toBeVisible() → ✓',
    'expect(nav link "About").toBeVisible() → ✓',
    'expect(CTA link to="/shop").toBeVisible() → ✓',
    'expect(kente-strip).toBeVisible() → ✓',
  ],
  '2': [
    'playwright: launching Chromium…',
    'page.goto http://localhost:3000/shop',
    'expect(h1).toContainText("Collections") → ✓',
    'expect(product cards with ₵).count() >= 5 → ✓',
    'expect(colour filter swatches).toBeVisible() → ✓',
    'expect("How to Order" sidebar).toBeVisible() → ✓',
    'expect(Payment Options banner).toBeVisible() → ✓',
  ],
  '3': [
    'playwright: launching Chromium…',
    'page.goto http://localhost:3000/about',
    'expect(h1).toContainText("About SashMade") → ✓',
    'expect("Sharon A.").toBeVisible() → ✓',
    'expect("Jospong").toBeVisible() → ✓',
    'expect("0247 139 986").toBeVisible() → ✓',
  ],
  '4': [
    'playwright: launching Chromium…',
    'page.goto http://localhost:3000/ai-studio',
    'expect(h1).toBeVisible() → ✓',
    'expect("Visual Decoder").toBeVisible() → ✓',
    'expect("Generative Loom").toBeVisible() → ✓',
  ],
  '5': [
    'playwright: launching Chromium…',
    'page.goto /admin/login → login form visible ✓',
    'page.goto /admin/dashboard (unauthenticated) → redirected to /admin/login ✓',
    'adminLogin(): fill username=admin, password=***',
    'expect("Inventory Manager").toBeVisible() → ✓',
    'expect("Adehye Style").toBeVisible() → ✓',
    'expect("Download Inventory").toBeVisible() → ✓',
  ],
};

export function Testing() {
  const [tests, setTests] = useState<TestResult[]>(
    TEST_SUITE.map((t) => ({ ...t, status: 'pending', logs: [] }))
  );
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (testId: string) => {
    setTests((prev) =>
      prev.map((t) =>
        t.id === testId
          ? { ...t, status: 'running', logs: ['playwright: initializing test runner…'] }
          : t
      )
    );

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

    setTests((prev) =>
      prev.map((t) => {
        if (t.id !== testId) return t;
        const passed = Math.random() > 0.15; // 85 % pass rate simulation
        return {
          ...t,
          status: passed ? 'passed' : 'failed',
          duration: Math.floor(Math.random() * 1800) + 400,
          logs: [
            ...t.logs,
            ...(SIMULATED_LOGS[testId] ?? []),
            passed
              ? '✓ All assertions passed.'
              : '✗ Assertion failed. Screenshot captured.',
          ],
          screenshot: passed ? undefined : 'https://picsum.photos/seed/pw-fail/800/450',
        };
      })
    );
  };

  const runAllTests = async () => {
    setIsRunning(true);
    // Reset all to pending first
    setTests((prev) => prev.map((t) => ({ ...t, status: 'pending', logs: [], screenshot: undefined })));
    for (const t of TEST_SUITE) {
      await runTest(t.id);
    }
    setIsRunning(false);
  };

  const passed  = tests.filter((t) => t.status === 'passed').length;
  const failed  = tests.filter((t) => t.status === 'failed').length;
  const pending = tests.filter((t) => t.status === 'pending').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-white">Automated Testing</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1 text-sm">
            Playwright E2E Test Suite — {tests.length} specs across 5 pages
          </p>
        </div>
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="flex items-center gap-2 px-6 py-3 bg-[#4A5340] text-white rounded-xl hover:bg-[#3A4232] disabled:opacity-50 transition-colors font-bold"
        >
          {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
          Run All Tests
        </button>
      </div>

      {/* Summary bar */}
      {tests.some((t) => t.status !== 'pending') && (
        <div className="flex gap-4 text-sm font-bold">
          <span className="text-green-600">{passed} passed</span>
          {failed > 0 && <span className="text-red-500">{failed} failed</span>}
          {pending > 0 && <span className="text-stone-400">{pending} pending</span>}
        </div>
      )}

      {/* Test cards */}
      <div className="grid gap-4">
        {tests.map((test) => (
          <div
            key={test.id}
            className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden"
          >
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                {/* Status icon */}
                {test.status === 'pending' && (
                  <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-700 flex items-center justify-center shrink-0">
                    <Terminal className="w-4 h-4 text-stone-400" />
                  </div>
                )}
                {test.status === 'running' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  </div>
                )}
                {test.status === 'passed' && (
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                )}
                {test.status === 'failed' && (
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
                    <XCircle className="w-4 h-4 text-red-500" />
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="font-bold text-stone-900 dark:text-white">{test.name}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                    {test.file}
                    {test.duration ? ` · ${test.duration}ms` : ''}
                  </p>
                </div>
              </div>

              <button
                onClick={() => runTest(test.id)}
                disabled={isRunning || test.status === 'running'}
                className="shrink-0 px-4 py-2 text-sm font-medium text-[#4A5340] dark:text-[#D97706] hover:bg-stone-50 dark:hover:bg-stone-700 rounded-lg transition-colors disabled:opacity-40"
              >
                Rerun
              </button>
            </div>

            {/* Logs pane */}
            {test.status !== 'pending' && (
              <div className="bg-stone-900 px-5 py-4 font-mono text-xs text-stone-300 border-t border-stone-800">
                <div className="space-y-1 mb-3">
                  {test.logs.map((line, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-stone-600 shrink-0">[pw]</span>
                      <span className={
                        line.includes('✗') || line.includes('FAIL') ? 'text-red-400' :
                        line.includes('✓') || line.includes('PASS') ? 'text-green-400' :
                        'text-stone-300'
                      }>
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
                {test.screenshot && (
                  <div className="mt-3">
                    <p className="text-stone-500 mb-2">Failure screenshot:</p>
                    <img
                      src={test.screenshot}
                      alt="Test failure screenshot"
                      className="rounded-lg border border-stone-700 max-h-48"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-stone-400 text-center">
        Run <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded">pnpm test:e2e</code> in the terminal to execute against a live server.
        &nbsp;Reports saved to <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded">tests/playwright-report/</code>.
      </p>
    </div>
  );
}
