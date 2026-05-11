import { create } from 'zustand';

interface TestResult {
  id: number;
  name: string;
  status: 'pending' | 'running' | 'pass' | 'fail';
  duration?: string;
  error?: string;
}

interface TestStore {
  results: Record<number, TestResult>;
  isRunning: boolean;
  runTest: (id: number) => Promise<void>;
  runAllTests: () => Promise<void>;
  resetTests: () => void;
}

const TESTS = [
  { id: 1, name: 'Unit: Metrics Collector', duration: 1500 },
  { id: 2, name: 'Unit: Health Scorer', duration: 1200 },
  { id: 3, name: 'Integration: DB Persistence', duration: 2000 },
  { id: 4, name: 'Integration: API Endpoints', duration: 2500 },
  { id: 5, name: 'E2E: Dashboard Load', duration: 3000 },
  { id: 6, name: 'Security: Auth Validation', duration: 1800 },
  { id: 7, name: 'Integration: Sentinel Orchestrator', duration: 2200 },
];

export const useTestStore = create<TestStore>((set, get) => ({
  results: {},
  isRunning: false,
  resetTests: () => set({ results: {}, isRunning: false }),
  runTest: async (id: number) => {
    const test = TESTS.find(t => t.id === id);
    if (!test) return;

    set(state => ({
      results: { ...state.results, [id]: { id, name: test.name, status: 'running' } }
    }));

    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, test.duration));

    // 90% pass rate simulation
    const passed = Math.random() > 0.1;
    
    set(state => ({
      results: { 
        ...state.results, 
        [id]: { 
          id, 
          name: test.name, 
          status: passed ? 'pass' : 'fail',
          duration: `${test.duration}ms`,
          error: passed ? undefined : 'Assertion failed: expected true to be false'
        } 
      }
    }));
  },
  runAllTests: async () => {
    set({ isRunning: true, results: {} });
    for (const test of TESTS) {
      await get().runTest(test.id);
    }
    set({ isRunning: false });
  }
}));
