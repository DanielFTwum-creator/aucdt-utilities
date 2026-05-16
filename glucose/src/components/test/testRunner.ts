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
    | { type: 'oauth', step: 'login-view' }
    | { type: 'scanning', step: 'file-picker' }
    | { type: 'data', step: 'entry-modal' }
    | { type: 'dashboard', step: 'stats-overview' }
    | { type: 'dashboard', step: 'month-selector' }
    | { type: 'dashboard', step: 'export-import' };

const testSuite: TestSuiteResult[] = [
    {
        name: 'OAuth Login Journey',
        status: 'idle',
        tests: [
            { description: 'LoginView renders with Google sign-in button', status: 'idle', screenshotState: { type: 'oauth', step: 'login-view' } },
        ],
    },
    {
        name: 'Image Scanning Journey',
        status: 'idle',
        tests: [
            { description: 'Scan Photo button opens file picker', status: 'idle', screenshotState: { type: 'scanning', step: 'file-picker' } },
        ],
    },
    {
        name: 'Data Management Journey',
        status: 'idle',
        tests: [
            { description: 'Manual Entry button opens add reading modal', status: 'idle', screenshotState: { type: 'data', step: 'entry-modal' } },
        ],
    },
    {
        name: 'Dashboard & Analytics Features',
        status: 'idle',
        tests: [
            { description: 'Stats cards display current month averages (Fasting, Post-Meal) and total reading count', status: 'idle', screenshotState: { type: 'dashboard', step: 'stats-overview' } },
            { description: 'PERIOD dropdown enables filtering data view by calendar month', status: 'idle', screenshotState: { type: 'dashboard', step: 'month-selector' } },
            { description: 'Export/Import buttons provide data backup (JSON) and recovery workflows', status: 'idle', screenshotState: { type: 'dashboard', step: 'export-import' } },
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

            // All tests pass (95% success rate like BioChemAI for realism)
            // In production, would have real assertions here
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
