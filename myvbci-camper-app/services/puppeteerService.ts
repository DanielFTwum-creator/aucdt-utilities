import { TestSuite, TestStatus, TestResult } from '../types';

const MOCK_DELAY = 700; // ms

// Helper to simulate async operations
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to generate a placeholder screenshot for failed tests
const generateFailureScreenshot = (testName: string, error: string): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 250;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#fef2f2'; // light red
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = '#ef4444'; // red
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Header
  ctx.fillStyle = '#b91c1c'; // dark red
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('Puppeteer Test Failed', 20, 40);

  // Test Name
  ctx.fillStyle = '#374151';
  ctx.font = '14px sans-serif';
  ctx.fillText(`Test Case: ${testName}`, 20, 70);

  // Error Message (wrap text)
  ctx.fillStyle = '#374151';
  const maxWidth = 460;
  const lineHeight = 18;
  let y = 100;
  const words = `Error: ${error}`.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, 20, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 20, y);

  // Timestamp
  ctx.fillStyle = '#6b7280';
  ctx.font = '12px sans-serif';
  ctx.fillText(new Date().toLocaleString(), 20, canvas.height - 20);

  return canvas.toDataURL();
};


export const TEST_SUITES: TestSuite[] = [
  {
    id: 'auth',
    title: 'Authentication Flow',
    tests: [
      {
        id: 'auth-login-admin',
        description: 'Admin can successfully log in',
        run: async ({ users }) => {
            const admin = users.find((u: any) => u.role === 'ADMIN');
            if (admin) return { success: true };
            return { success: false, error: 'Admin user not found in mock data.' };
        },
      },
      {
        id: 'auth-login-camper',
        description: 'Camper can successfully log in',
        run: async ({ users }) => {
            const camper = users.find((u: any) => u.role === 'CAMPER');
            if (camper) return { success: true };
            return { success: false, error: 'Camper user not found in mock data.' };
        },
      },
      {
        id: 'auth-login-fail',
        description: 'Login fails with incorrect credentials',
        run: async () => {
          // This test is designed to succeed by correctly identifying a failure
          return { success: true };
        },
      },
    ],
  },
  {
    id: 'admin',
    title: 'Admin Panel Operations',
    tests: [
      {
        id: 'admin-view-dashboard',
        description: 'Admin can view the dashboard with stats',
        run: async ({ bookings }) => {
            if (bookings.length > 0) return { success: true };
            return { success: false, error: 'No booking data found to populate dashboard.' };
        },
      },
      {
        id: 'admin-create-camp',
        description: 'Admin can create a new camp',
        run: async () => {
          // Simulate filling form and submitting
          return { success: true };
        },
      },
      {
        id: 'admin-create-room',
        description: 'Admin can add a room to a camp',
        run: async () => {
          // Simulate selecting camp and adding a room
          return { success: true };
        },
      },
       {
        id: 'admin-delete-room-fail',
        description: 'Admin cannot delete a room with active campers',
        run: async () => {
          // This test is designed to fail to show the screenshot feature
          return { success: false, error: 'AssertionError: Expected confirmation modal for deletion to be blocked, but it was not.' };
        },
      },
    ],
  },
  {
    id: 'camper',
    title: 'Camper Registration Journey',
    tests: [
        {
            id: 'camper-view-camps',
            description: 'Camper can view available camps',
            run: async ({ camps }) => {
                if (camps.length > 0) return { success: true };
                return { success: false, error: 'No camps are available for viewing.' };
            },
        },
        {
            id: 'camper-register-success',
            description: 'Camper can complete registration for an available room',
            run: async ({ rooms }) => {
                const availableRoom = rooms.find((r: any) => r.status === 'Available');
                if (availableRoom) return { success: true };
                return { success: false, error: 'Could not find any available room to complete registration.' };
            },
        },
        {
            id: 'camper-register-fail-full',
            description: 'Camper registration is blocked for a full room',
            run: async ({ rooms }) => {
                const fullRoom = rooms.find((r: any) => r.status === 'Full');
                if (fullRoom) return { success: true };
                // This test should pass if it finds a full room and confirms it is not selectable.
                return { success: false, error: 'No full rooms found to test blocking condition.' };
            },
        },
    ],
  },
];

export const runPuppeteerTests = async (
  context: any,
  onTestUpdate: (testId: string, result: TestResult) => void
) => {
  for (const suite of TEST_SUITES) {
    for (const test of suite.tests) {
      const startTime = Date.now();
      onTestUpdate(test.id, { status: TestStatus.RUNNING });
      
      await wait(MOCK_DELAY);

      try {
        const result = await test.run(context);
        const duration = Date.now() - startTime;
        if (result.success) {
          onTestUpdate(test.id, { status: TestStatus.PASSED, duration });
        } else {
          onTestUpdate(test.id, {
            status: TestStatus.FAILED,
            error: result.error || 'Test failed with an unknown error.',
            screenshot: generateFailureScreenshot(test.description, result.error || 'Unknown error'),
            duration,
          });
        }
      } catch (e: any) {
        const duration = Date.now() - startTime;
        onTestUpdate(test.id, {
          status: TestStatus.FAILED,
          error: e.message,
          screenshot: generateFailureScreenshot(test.description, e.message),
          duration,
        });
      }
    }
  }
};
