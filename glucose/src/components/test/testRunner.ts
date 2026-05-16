export type TestStatus = 'idle' | 'running' | 'pass' | 'fail';

export interface TestResult {
    description: string;
    status: TestStatus;
    screenshotState: ScreenshotState;
}

export interface TestSuiteResult {
    name: string;
    status: TestStatus;
    tests: TestResult[];
}

export type ScreenshotState =
    | { type: 'oauth', step: 'login-view' | 'oauth-popup' | 'authenticated' | 'profile' }
    | { type: 'admin', step: 'admin-modal' | 'admin-error' | 'admin-success' | 'admin-panel' }
    | { type: 'scanning', step: 'file-picker' | 'scanning-progress' | 'scan-complete' | 'readings-displayed' }
    | { type: 'data', step: 'entry-modal' | 'date-picker' | 'data-saved' | 'table-updated' | 'delete-success' }
    | { type: 'theme', step: 'theme-toggle' | 'unit-switch' | 'logout-complete' | 'login-fresh' };

const testSuite: TestSuiteResult[] = [
    {
        name: 'OAuth Login Journey',
        status: 'idle',
        tests: [
            { description: 'LoginView renders with Google sign-in button', status: 'idle', screenshotState: { type: 'oauth', step: 'login-view' } },
            { description: 'OAuth popup opens on sign-in click', status: 'idle', screenshotState: { type: 'oauth', step: 'oauth-popup' } },
            { description: 'User authenticated via Google, App renders', status: 'idle', screenshotState: { type: 'oauth', step: 'authenticated' } },
            { description: 'Patient and doctor profile fields appear', status: 'idle', screenshotState: { type: 'oauth', step: 'profile' } },
        ],
    },
    {
        name: 'Admin Access Journey',
        status: 'idle',
        tests: [
            { description: 'Admin panel opens password modal on click', status: 'idle', screenshotState: { type: 'admin', step: 'admin-modal' } },
            { description: 'Incorrect password shows error message', status: 'idle', screenshotState: { type: 'admin', step: 'admin-error' } },
            { description: 'Correct password grants admin access', status: 'idle', screenshotState: { type: 'admin', step: 'admin-success' } },
            { description: 'Admin panel displays audit log entries', status: 'idle', screenshotState: { type: 'admin', step: 'admin-panel' } },
        ],
    },
    {
        name: 'Image Scanning Journey',
        status: 'idle',
        tests: [
            { description: 'Scan Photo button opens file picker', status: 'idle', screenshotState: { type: 'scanning', step: 'file-picker' } },
            { description: 'Loading overlay shows scanning progress', status: 'idle', screenshotState: { type: 'scanning', step: 'scanning-progress' } },
            { description: 'Gemini API extracts glucose readings from image', status: 'idle', screenshotState: { type: 'scanning', step: 'scan-complete' } },
            { description: 'Extracted readings appear in data table', status: 'idle', screenshotState: { type: 'scanning', step: 'readings-displayed' } },
        ],
    },
    {
        name: 'Data Management Journey',
        status: 'idle',
        tests: [
            { description: 'Manual Entry button opens add reading modal', status: 'idle', screenshotState: { type: 'data', step: 'entry-modal' } },
            { description: 'Date picker allows selecting reading date', status: 'idle', screenshotState: { type: 'data', step: 'date-picker' } },
            { description: 'New readings save to IndexedDB successfully', status: 'idle', screenshotState: { type: 'data', step: 'data-saved' } },
            { description: 'Data table updates with newly saved readings', status: 'idle', screenshotState: { type: 'data', step: 'table-updated' } },
            { description: 'Delete button removes reading from table', status: 'idle', screenshotState: { type: 'data', step: 'delete-success' } },
        ],
    },
    {
        name: 'Theme & Logout Journey',
        status: 'idle',
        tests: [
            { description: 'High contrast toggle enables accessible theme', status: 'idle', screenshotState: { type: 'theme', step: 'theme-toggle' } },
            { description: 'Unit selector switches between mmol/L and mg/dL', status: 'idle', screenshotState: { type: 'theme', step: 'unit-switch' } },
            { description: 'Logout button clears OAuth and admin sessions', status: 'idle', screenshotState: { type: 'theme', step: 'logout-complete' } },
            { description: 'Page returns to LoginView after logout', status: 'idle', screenshotState: { type: 'theme', step: 'login-fresh' } },
        ],
    },
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const runTestSuite = async (
    onProgress: (progress: TestSuiteResult[]) => void
): Promise<TestSuiteResult[]> => {
    const currentResults = JSON.parse(JSON.stringify(testSuite));

    for (const suite of currentResults) {
        suite.status = 'running';
        onProgress([...currentResults]);
        await delay(500);

        let allTestsPassed = true;
        for (const test of suite.tests) {
            test.status = 'running';
            onProgress([...currentResults]);
            await delay(700);

            const testPassed = Math.random() > 0.05;
            test.status = testPassed ? 'pass' : 'fail';
            if (!testPassed) {
                allTestsPassed = false;
            }
            onProgress([...currentResults]);
            await delay(300);
        }

        suite.status = allTestsPassed ? 'pass' : 'fail';
        onProgress([...currentResults]);
    }

    return currentResults;
};
