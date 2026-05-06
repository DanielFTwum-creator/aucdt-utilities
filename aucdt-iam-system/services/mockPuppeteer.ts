import { TestCase, TestStep } from '../types';

// Helper to generate a placeholder screenshot SVG with context
const generateScreenshot = (text: string, color: string = '#3b82f6', mode: 'light' | 'dark' = 'light') => {
  const bg = mode === 'dark' ? '#1f2937' : '#f3f4f6';
  const winBg = mode === 'dark' ? '#111827' : '#ffffff';
  const textColor = mode === 'dark' ? '#e5e7eb' : '#1f2937';
  const tsColor = mode === 'dark' ? '#9ca3af' : '#6b7280';

  const svg = `
  <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${bg}"/>
    <!-- Browser Window -->
    <rect x="20" y="20" width="760" height="560" rx="10" fill="${winBg}" stroke="${color}" stroke-width="4"/>
    <rect x="20" y="20" width="760" height="40" rx="10" fill="${color}"/>
    <!-- Window Controls -->
    <circle cx="40" cy="40" r="6" fill="#ff5f56"/>
    <circle cx="60" cy="40" r="6" fill="#ffbd2e"/>
    <circle cx="80" cy="40" r="6" fill="#27c93f"/>
    <!-- Mock UI Elements -->
    <rect x="50" y="80" width="200" height="20" rx="4" fill="#e5e7eb" opacity="0.5"/>
    <rect x="50" y="120" width="700" height="150" rx="4" fill="#e5e7eb" opacity="0.2"/>
    <rect x="50" y="290" width="700" height="20" rx="4" fill="#e5e7eb" opacity="0.2"/>
    
    <!-- Overlay Text -->
    <text x="400" y="300" font-family="monospace" font-size="24" text-anchor="middle" fill="${tsColor}" opacity="0.5">MOCK BROWSER CAPTURE</text>
    <text x="400" y="340" font-family="sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="${textColor}">${text}</text>
    <text x="760" y="570" font-family="monospace" font-size="12" text-anchor="end" fill="${tsColor}">${new Date().toISOString()}</text>
  </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Delay helper
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Test Suites Definition
export const TEST_SUITES: TestCase[] = [
  {
    id: 'TS-001',
    name: 'E2E: Student Journey',
    description: 'Verifies login, logbook entry creation, AI refinement, and submission.',
    status: 'IDLE',
    steps: [
      { id: 's1', description: 'Launch Browser & Navigate to Login', status: 'PENDING' },
      { id: 's2', description: 'Input Credentials (Student)', status: 'PENDING' },
      { id: 's3', description: 'Verify Dashboard Load', status: 'PENDING' },
      { id: 's4', description: 'Navigate to Logbook', status: 'PENDING' },
      { id: 's5', description: 'Create New Entry with AI', status: 'PENDING' },
      { id: 's6', description: 'Verify Submission Status', status: 'PENDING' }
    ]
  },
  {
    id: 'TS-002',
    name: 'Security: Admin Access',
    description: 'Tests RBAC enforcement and audit logging triggers.',
    status: 'IDLE',
    steps: [
      { id: 's1', description: 'Attempt Admin Access (No Auth)', status: 'PENDING' },
      { id: 's2', description: 'Challenge Prompt Displayed', status: 'PENDING' },
      { id: 's3', description: 'Input Admin Password', status: 'PENDING' },
      { id: 's4', description: 'Verify Admin Dashboard Access', status: 'PENDING' },
      { id: 's5', description: 'Check Audit Log Creation', status: 'PENDING' }
    ]
  },
  {
    id: 'TS-003',
    name: 'Integration: Gemini API',
    description: 'Checks connectivity to AI service and response handling.',
    status: 'IDLE',
    steps: [
      { id: 's1', description: 'Initialize Gemini Client', status: 'PENDING' },
      { id: 's2', description: 'Send Test Prompt', status: 'PENDING' },
      { id: 's3', description: 'Validate Response Latency', status: 'PENDING' },
      { id: 's4', description: 'Handle API Error Gracefully', status: 'PENDING' }
    ]
  },
  {
    id: 'TS-004',
    name: 'UI/UX: Accessibility & Themes',
    description: 'Verifies High Contrast toggle and Dark Mode responsiveness.',
    status: 'IDLE',
    steps: [
      { id: 's1', description: 'Check Default Theme (Time-based)', status: 'PENDING' },
      { id: 's2', description: 'Toggle Dark Mode', status: 'PENDING' },
      { id: 's3', description: 'Verify Background/Text Contrast', status: 'PENDING' },
      { id: 's4', description: 'Enable High Contrast Mode', status: 'PENDING' },
      { id: 's5', description: 'Verify ARIA Attributes Present', status: 'PENDING' }
    ]
  },
  {
    id: 'TS-005',
    name: 'Auth: Password Recovery',
    description: 'Tests the forgot password modal and mock email simulation.',
    status: 'IDLE',
    steps: [
      { id: 's1', description: 'Open Login Screen', status: 'PENDING' },
      { id: 's2', description: 'Click Forgot Password', status: 'PENDING' },
      { id: 's3', description: 'Enter Email & Submit', status: 'PENDING' },
      { id: 's4', description: 'Verify Mock Network Request', status: 'PENDING' },
      { id: 's5', description: 'Check Success Alert', status: 'PENDING' }
    ]
  }
];

// Mock Runner Logic
export const runStepMock = async (suiteId: string, step: TestStep): Promise<{ screenshot: string, duration: number }> => {
  const startTime = Date.now();
  
  // Variable delay to simulate real processing
  const delay = Math.floor(Math.random() * 800) + 400; 
  await wait(delay);

  // Mock Screenshots based on step context
  let screenshotText = step.description;
  let color = '#3b82f6'; // Blue
  let mode: 'light' | 'dark' = 'light';

  if (step.description.includes('Error')) {
    screenshotText = 'Error Boundary Test';
    color = '#ef4444'; // Red
  } else if (step.description.includes('Admin')) {
    screenshotText = 'Admin Panel';
    color = '#10b981'; // Green
  } else if (step.description.includes('Dark') || step.description.includes('Contrast')) {
    screenshotText = 'Accessibility Check';
    color = '#a855f7'; // Purple
    mode = 'dark';
  } else if (step.description.includes('Password')) {
    screenshotText = 'Auth Modal';
    color = '#f59e0b'; // Amber
  }

  return {
    screenshot: generateScreenshot(screenshotText, color, mode),
    duration: Date.now() - startTime
  };
};