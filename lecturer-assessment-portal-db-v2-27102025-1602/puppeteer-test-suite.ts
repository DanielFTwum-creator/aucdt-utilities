import { Test, TestResult } from './types';

/**
 * Simulates a delay to mimic real-world asynchronous operations.
 * @param ms - The number of milliseconds to wait.
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * A base64 encoded SVG to be used as a placeholder screenshot.
 */
const mockScreenshot = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjNmI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U2ltdWxhdGVkIFNjcmVlbnNob3Q8L3RleHQ+PC9zdmc+';

/**
 * A collection of simulated End-to-End tests for demonstration purposes.
 * Each test mimics a real user workflow and returns a result.
 * This logic can be adapted to a true Node.js testing environment with Puppeteer.
 */
export const testSuite: Test[] = [
    {
        title: "Student: Load Assessment Form",
        run: async (): Promise<TestResult> => {
            const startTime = performance.now();
            await delay(300);
            // In a real test, we would check if the main heading is on the page.
            // Here, we simulate a successful load.
            const duration = performance.now() - startTime;
            return {
                success: true,
                log: "Form page loaded successfully.",
                duration,
                screenshotDataUrl: mockScreenshot,
            };
        }
    },
    {
        title: "Student: Submit Incomplete Form",
        run: async (): Promise<TestResult> => {
            const startTime = performance.now();
            await delay(800);
            // Simulate selecting only the programme and clicking submit.
            // The system should show an alert. We'll simulate this check.
            const duration = performance.now() - startTime;
            return {
                success: true,
                log: "Validation alert for incomplete form was correctly triggered.",
                duration,
                screenshotDataUrl: mockScreenshot,
            };
        }
    },
    {
        title: "Student: Successfully Submit a Full Assessment",
        run: async (): Promise<TestResult> => {
            const startTime = performance.now();
            // Simulate filling out all form fields
            await delay(2500);
            // Simulate the API call for email notification
            await delay(1200);
            const duration = performance.now() - startTime;
            return {
                success: true,
                log: "Form submitted, notification sent, and success screen shown.",
                duration,
                screenshotDataUrl: mockScreenshot,
            };
        }
    },
    {
        title: "Admin: Fail Login with Wrong Password",
        run: async (): Promise<TestResult> => {
            const startTime = performance.now();
            await delay(400); // Simulate opening modal and typing
            await delay(500); // Simulate login attempt
            const duration = performance.now() - startTime;
            // Simulate checking for the error message
            return {
                success: true,
                log: "Error message for invalid password displayed correctly.",
                duration,
                screenshotDataUrl: mockScreenshot,
            };
        }
    },
    {
        title: "Admin: Successfully Log In",
        run: async (): Promise<TestResult> => {
            const startTime = performance.now();
            await delay(400);
            await delay(500);
            const duration = performance.now() - startTime;
            // Simulate successful login and redirection to dashboard
            return {
                success: true,
                log: "Admin logged in and redirected to the dashboard.",
                duration,
                screenshotDataUrl: mockScreenshot,
            };
        }
    },
    {
        title: "Admin: Navigate Dashboard Tabs",
        run: async (): Promise<TestResult> => {
            const startTime = performance.now();
            const tabs = ['Programmes', 'Results', 'Lecturers', 'Analytics', 'Admin Panel'];
            for (const tab of tabs) {
                await delay(350);
                // In a real test, we would click each tab and check for a unique element on that page.
            }
            const duration = performance.now() - startTime;
            return {
                success: true,
                log: "Successfully navigated through all main dashboard tabs without errors.",
                duration,
                screenshotDataUrl: mockScreenshot,
            };
        }
    },
    {
        title: "Admin: Filter Lecturer List",
        run: async (): Promise<TestResult> => {
            const startTime = performance.now();
            await delay(200); // Navigate to lecturers tab
            await delay(500); // Simulate typing a search term
            await delay(300); // Simulate selecting a programme from dropdown
            const duration = performance.now() - startTime;
             // In a real test, assert that the table rows have been filtered
            return {
                success: true,
                log: "Lecturer table successfully filtered by search term and programme.",
                duration,
                screenshotDataUrl: mockScreenshot,
            };
        }
    },
];