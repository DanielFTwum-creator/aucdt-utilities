import { ScreenshotState } from './MockScreenshot';

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

const testSuite: TestSuiteResult[] = [
    {
        name: 'Chat Mode User Journey',
        status: 'idle',
        tests: [
            { description: 'Initial state: Renders welcome message', status: 'idle', screenshotState: { type: 'chat', step: 'initial' } },
            { description: 'User input: Types and sends a question', status: 'idle', screenshotState: { type: 'chat', step: 'question' } },
            { description: 'Loading state: Shows "thinking" indicator', status: 'idle', screenshotState: { type: 'chat', step: 'loading' } },
            { description: 'Final state: Displays AI response with sources', status: 'idle', screenshotState: { type: 'chat', step: 'response' } },
        ],
    },
    {
        name: 'Quiz Mode User Journey',
        status: 'idle',
        tests: [
            { description: 'Initial state: Renders quiz setup screen', status: 'idle', screenshotState: { type: 'quiz', step: 'setup' } },
            { description: 'Loading state: Shows quiz generation spinner', status: 'idle', screenshotState: { type: 'quiz', step: 'loading' } },
            { description: 'Active quiz: Renders first question', status: 'idle', screenshotState: { type: 'quiz', step: 'question' } },
            { description: 'User interaction: Selects a correct answer', status: 'idle', screenshotState: { type: 'quiz', step: 'correct' } },
            { description: 'User interaction: Selects an incorrect answer', status: 'idle', screenshotState: { type: 'quiz', step: 'incorrect' } },
            { description: 'Final state: Displays results screen', status: 'idle', screenshotState: { type: 'quiz', step: 'results' } },
        ],
    },
    {
        name: 'Admin Panel User Journey',
        status: 'idle',
        tests: [
            { description: 'Access attempt: Opens password modal', status: 'idle', screenshotState: { type: 'admin', step: 'modal' } },
            { description: 'Authentication: Fails with incorrect password', status: 'idle', screenshotState: { type: 'admin', step: 'fail' } },
            { description: 'Authentication: Succeeds with correct password', status: 'idle', screenshotState: { type: 'admin', step: 'success' } },
            { description: 'Final state: Displays Admin Panel with logs', status: 'idle', screenshotState: { type: 'admin', step: 'panel' } },
        ],
    },
    {
        name: 'Theme Switching Functionality',
        status: 'idle',
        tests: [
            { description: 'Initial theme: Renders in Ocean Mode', status: 'idle', screenshotState: { type: 'theme', step: 'ocean' } },
            { description: 'User action: Switches to Golden Mode', status: 'idle', screenshotState: { type: 'theme', step: 'golden' } },
            { description: 'User action: Switches to Cyberpunk Mode', status: 'idle', screenshotState: { type: 'theme', step: 'cyberpunk' } },
            { description: 'User action: Switches to Minimal Mode', status: 'idle', screenshotState: { type: 'theme', step: 'minimal' } },
            { description: 'User action: Switches to Cinema Mode', status: 'idle', screenshotState: { type: 'theme', step: 'cinema' } },
        ]
    }
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const runTestSuite = async (
    onProgress: (progress: TestSuiteResult[]) => void
): Promise<TestSuiteResult[]> => {
    const currentResults = JSON.parse(JSON.stringify(testSuite)); // Deep copy

    for (const suite of currentResults) {
        suite.status = 'running';
        onProgress([...currentResults]);
        await delay(500);

        let allTestsPassed = true;
        for (const test of suite.tests) {
            test.status = 'running';
            onProgress([...currentResults]);
            await delay(700);
            
            // In a real scenario, this would be an assertion. 
            // Here we simulate a 95% success rate for realism.
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