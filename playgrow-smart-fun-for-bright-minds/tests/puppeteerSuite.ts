import { TestSuite } from '../types';

const createScreenshot = (content: string): string => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <style>
            .title { font: bold 20px sans-serif; fill: #1f2937; }
            .text { font: 14px sans-serif; fill: #4b5563; }
        </style>
        ${content}
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

const createDarkScreenshot = (content: string): string => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="100%" height="100%" fill="#1f2937"/>
        <style>
            .title { font: bold 20px sans-serif; fill: #f9fafb; }
            .text { font: 14px sans-serif; fill: #d1d5db; }
        </style>
        ${content}
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

export const PUPPETEER_TEST_SUITE: TestSuite[] = [
  {
    id: 'admin-login',
    title: 'Admin Login Flow',
    description: 'Tests the full administrator login journey, including failures.',
    steps: [
      {
        description: 'Navigate to World Map and find Admin lock icon.',
        duration: 500,
        screenshot: createScreenshot(`
            <rect x="10" y="10" width="380" height="280" stroke="#cbd5e1" stroke-width="2" fill="#bfdbfe"/>
            <text x="200" y="40" text-anchor="middle" class="title">PlayGrow World Map</text>
            <circle cx="200" cy="150" r="40" fill="#93c5fd" />
            <circle cx="100" cy="200" r="30" fill="#a5b4fc" />
            <circle cx="300" cy="180" r="35" fill="#a78bfa" />
            <rect x="20" y="20" width="40" height="40" fill="#facc15" stroke="black" stroke-width="2" />
            <text x="40" y="45" text-anchor="middle" font-size="24">🔒</text>
        `),
      },
      {
        description: 'Click lock icon to open Admin Login page.',
        duration: 300,
        screenshot: createScreenshot(`
            <rect x="50" y="50" width="300" height="200" rx="10" fill="white" stroke="#e5e7eb" stroke-width="2"/>
            <text x="200" y="90" text-anchor="middle" class="title">Admin Access</text>
            <rect x="80" y="120" width="240" height="40" rx="5" fill="#e5e7eb"/>
            <rect x="80" y="170" width="240" height="40" rx="5" fill="#3b82f6"/>
        `),
      },
      {
        description: 'Enter incorrect password and submit.',
        duration: 800,
        screenshot: createScreenshot(`
            <rect x="50" y="50" width="300" height="200" rx="10" fill="white" stroke="#e5e7eb" stroke-width="2"/>
            <text x="200" y="90" text-anchor="middle" class="title">Admin Access</text>
            <rect x="80" y="120" width="240" height="40" rx="5" fill="#e5e7eb"/>
            <text x="90" y="145" class="text">••••••••</text>
            <text x="200" y="210" text-anchor="middle" fill="#ef4444" class="text">Incorrect password</text>
        `),
        shouldFail: true,
      },
      {
        description: 'Enter correct password and submit.',
        duration: 800,
        screenshot: createScreenshot(`
            <rect x="50" y="50" width="300" height="200" rx="10" fill="white" stroke="#e5e7eb" stroke-width="2"/>
            <text x="200" y="90" text-anchor="middle" class="title">Admin Access</text>
            <rect x="80" y="120" width="240" height="40" rx="5" fill="#e5e7eb"/>
            <text x="90" y="145" class="text">playgrow_admin</text>
        `),
      },
      {
        description: 'Verify successful navigation to Admin Dashboard.',
        duration: 400,
        screenshot: createScreenshot(`
            <text x="200" y="40" text-anchor="middle" class="title">Admin Dashboard</text>
            <rect x="20" y="70" width="170" height="200" rx="10" fill="white" stroke="#e5e7eb"/>
            <text x="105" y="90" text-anchor="middle" class="text">System Controls</text>
             <rect x="190" y="70" width="190" height="200" rx="10" fill="white" stroke="#e5e7eb"/>
            <text x="285" y="90" text-anchor="middle" class="text">Audit Log</text>
        `),
      },
    ],
  },
  {
    id: 'zone-navigation',
    title: 'Zone Navigation',
    description: 'Ensures users can navigate from the map to a zone detail page.',
    steps: [
       {
        description: 'Start at World Map.',
        duration: 300,
        screenshot: createScreenshot(`
            <rect x="10" y="10" width="380" height="280" stroke="#cbd5e1" stroke-width="2" fill="#bfdbfe"/>
            <text x="200" y="40" text-anchor="middle" class="title">PlayGrow World Map</text>
            <circle cx="200" cy="150" r="40" fill="#93c5fd" />
            <text x="200" y="155" text-anchor="middle" class="text">Brainy Town</text>
        `),
      },
      {
        description: 'Click on "Brainy Town" zone.',
        duration: 600,
        screenshot: createScreenshot(`
            <rect x="10" y="10" width="380" height="280" stroke="#cbd5e1" stroke-width="2" fill="#bfdbfe"/>
            <text x="200" y="40" text-anchor="middle" class="title">PlayGrow World Map</text>
            <circle cx="200" cy="150" r="45" fill="#93c5fd" stroke="#3b82f6" stroke-width="3" />
            <text x="200" y="155" text-anchor="middle" class="text">Brainy Town</text>
        `),
      },
      {
        description: 'Verify navigation to Brainy Town detail page.',
        duration: 500,
        screenshot: createScreenshot(`
            <rect x="10" y="10" width="380" height="50" fill="white" stroke="#e5e7eb"/>
            <text x="200" y="40" text-anchor="middle" class="title">Brainy Town</text>
            <rect x="20" y="80" width="110" height="150" rx="10" fill="white" stroke="#e5e7eb"/>
            <rect x="145" y="80" width="110" height="150" rx="10" fill="white" stroke="#e5e7eb"/>
            <rect x="270" y="80" width="110" height="150" rx="10" fill="white" stroke="#e5e7eb"/>
        `),
      }
    ]
  },
   {
    id: 'theme-switching',
    title: 'Theme Switching',
    description: 'Checks the functionality of the theme switcher.',
    steps: [
      {
        description: 'Start in default Light theme.',
        duration: 200,
        screenshot: createScreenshot(`
            <rect x="10" y="10" width="380" height="280" stroke="#cbd5e1" stroke-width="2" fill="#bfdbfe"/>
            <text x="200" y="40" text-anchor="middle" class="title">Light Theme</text>
            <rect x="280" y="20" width="100" height="40" rx="20" fill="white" stroke="#e5e7eb"/>
            <circle cx="300" cy="40" r="15" fill="#3b82f6"/>
            <text x="300" y="45" text-anchor="middle" fill="white">☀️</text>
        `),
      },
      {
        description: 'Click Dark theme button.',
        duration: 400,
        screenshot: createScreenshot(`
            <rect x="10" y="10" width="380" height="280" stroke="#cbd5e1" stroke-width="2" fill="#bfdbfe"/>
            <text x="200" y="40" text-anchor="middle" class="title">Switching to Dark</text>
            <rect x="280" y="20" width="100" height="40" rx="20" fill="white" stroke="#e5e7eb"/>
            <circle cx="340" cy="40" r="15" fill="#3b82f6"/>
            <text x="340" y="45" text-anchor="middle" fill="white">🌙</text>
        `),
      },
      {
        description: 'Verify Dark theme is applied.',
        duration: 500,
        screenshot: createDarkScreenshot(`
            <rect x="10" y="10" width="380" height="280" stroke="#4b5563" stroke-width="2" fill="#374151"/>
            <text x="200" y="40" text-anchor="middle" class="title">Dark Theme</text>
             <rect x="280" y="20" width="100" height="40" rx="20" fill="#4b5563" stroke="#6b7280"/>
            <circle cx="340" cy="40" r="15" fill="#3b82f6"/>
            <text x="340" y="45" text-anchor="middle" fill="white">🌙</text>
        `),
      },
    ],
  },
];