export interface TestCase {
  id: string;
  name: string;
  description: string;
  run: () => Promise<boolean>;
}

export const TEST_SUITE: TestCase[] = [
  {
    id: 'local-storage-check',
    name: 'LocalStorage Availability',
    description: 'Checks if localStorage is available and working.',
    run: async () => {
      try {
        localStorage.setItem('test-key', 'test-value');
        const val = localStorage.getItem('test-key');
        localStorage.removeItem('test-key');
        return val === 'test-value';
      } catch {
        return false;
      }
    }
  },
  {
    id: 'api-connectivity',
    name: 'API Connectivity Check',
    description: 'Pings the submission endpoint to check reachability (expects 404 or similar on GET, but connection success).',
    run: async () => {
      try {
        // We just check if we can connect. The endpoint expects POST, so GET might fail with 404 or 405, which is fine for connectivity.
        const res = await fetch('https://portal.aucdt.edu.gh/aucdt-dev/sendMail', { method: 'OPTIONS' });
        return res.status >= 200 && res.status < 500;
      } catch {
        return false;
      }
    }
  },
  {
    id: 'dom-integrity',
    name: 'DOM Integrity',
    description: 'Checks if the root element exists.',
    run: async () => {
      return !!document.getElementById('root');
    }
  }
];
