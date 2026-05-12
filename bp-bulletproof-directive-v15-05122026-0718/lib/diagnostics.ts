/**
 * Self-testing / Diagnostics service.
 * Simulates internal health checking and UI-level tests.
 */
import html2canvas from 'html2canvas';

export interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
  screenshot?: string;
  duration?: number;
}

export class DiagnosticsService {
  /**
   * Represents health check endpoints for major services (mocked for client-side).
   */
  static async checkHealthEndpoints(): Promise<{ service: string; status: 'ok' | 'error'; ms: number }[]> {
    const services = ['Auth Service', 'Database Connectivity', 'Notification Service', 'API Gateway'];
    
    return Promise.all(
      services.map(async (service) => {
        const start = performance.now();
        // Simulate network latency
        await new Promise(r => setTimeout(r, Math.random() * 300 + 50));
        
        // Return 95% pass rate mock logic
        const isOk = Math.random() > 0.05;
        return {
          service,
          status: isOk ? 'ok' : 'error',
          ms: Math.round(performance.now() - start),
        };
      })
    );
  }

  /**
   * Internal diagnostic routines triggered from the UI.
   * Runs through standard checks.
   */
  static getTestSuites(): TestResult[] {
    return [
      { id: 't1', name: 'Local Storage Integrity', status: 'pending' },
      { id: 't2', name: 'Environment Variables Loading', status: 'pending' },
      { id: 't3', name: 'Theme Application Logic', status: 'pending' },
      { id: 't4', name: 'Session State Stability', status: 'pending' },
      { id: 't5', name: 'Accessibility (ARIA)', status: 'pending' },
      { id: 't6', name: 'Simulated API Failure Recovery', status: 'pending' }
    ];
  }

  static async runTest(test: TestResult): Promise<TestResult> {
    const start = performance.now();
    try {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
      
      switch (test.id) {
        case 't1':
          localStorage.setItem('diag_test', '1');
          if (localStorage.getItem('diag_test') !== '1') throw new Error('Local storage read/write failed');
          localStorage.removeItem('diag_test');
          break;
        case 't2':
          // Mock ENV check
          break;
        case 't3':
          if (!document.documentElement.className) throw new Error('Theme class not applied to document');
          break;
        case 't4':
          // Mock session 
          break;
        case 't5': {
          const domButtons = document.querySelectorAll('button');
          for (let i = 0; i < Math.min(domButtons.length, 5); i++) {
            if (!domButtons[i].hasAttribute('aria-label') && !domButtons[i].textContent?.trim()) {
              throw new Error(`Button without readable label found: ${domButtons[i].outerHTML.slice(0, 30)}...`);
            }
          }
          break;
        }
        case 't6':
          // Intentionally fail sometimes to demo screenshot capture
          if (Math.random() > 0.6) {
             throw new Error('API Gateway timed out during simulated ping.');
          }
          break;
        default:
          break;
      }
      
      return { 
        ...test, 
        status: 'passed', 
        message: 'Test completed successfully',
        duration: Math.round(performance.now() - start) 
      };
    } catch (error: any) {
      // Capture screenshot on error
      let screenshot;
      try {
        const canvas = await html2canvas(document.body, { 
            scale: 0.5,
            useCORS: true,
            ignoreElements: (element) => element.id === 'test-runner-overlay' // Don't snap the runner itself
        });
        screenshot = canvas.toDataURL('image/jpeg', 0.5);
      } catch (e) {
        console.error('Failed to capture screenshot', e);
      }

      return { 
        ...test, 
        status: 'failed', 
        message: error.message || String(error), 
        screenshot,
        duration: Math.round(performance.now() - start)
      };
    }
  }
}
