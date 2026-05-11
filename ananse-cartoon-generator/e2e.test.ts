/**
 * @jest-environment-playwright
 * 
 * This file contains End-to-End tests for the Ananse Cartoon Generator application.
 * It uses Playwright to control a headless Chrome browser to simulate user interactions.
 * 
 * Prerequisites:
 * - Jest and jest-playwright are installed and configured.
 * - The application is running via `npm start` before starting the tests.
 * 
 * To run: `npm test`
 */
import playwright from '@playwright/test';
import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';

const APP_URL = process.env.APP_URL || 'http://localhost:5173';
const TIMEOUT = 30000; // 30 seconds for long-running AI tasks

describe('Ananse Cartoon Generator E2E Tests', () => {
    let browser: playwright.Browser;
    let page: playwright.Page;

    beforeAll(async () => {
        browser = await chromium.launch();
        page = await browser.newPage();
        page.setDefaultNavigationTimeout(TIMEOUT);
        page.setDefaultTimeout(TIMEOUT);
    });

    afterAll(async () => {
        await browser.close();
    });

    test('should load the initial page correctly', async () => {
        await page.goto(APP_URL);
        
        // Check for header
        const headerText = await page.$eval('h1', el => el.textContent);
        expect(headerText).toBe('Ananse Cartoon Generator');

        // Check for initial prompt in textarea
        const initialPrompt = await page.$eval('[data-testid="prompt-textarea"]', el => (el as HTMLTextAreaElement).value);
        expect(initialPrompt).toContain('Ananse: Walking slowly but steadily');

        // Check that the output area is empty initially
        const initialOutputText = await page.$eval('[data-testid="initial-message"]', el => el.textContent);
        expect(initialOutputText).toContain('Your generated cartoon will appear here');
    });

    test('should generate an image and dialog on "Generate Scene" click', async () => {
        await page.goto(APP_URL);

        // Click the generate button
        await page.click('[data-testid="generate-button"]');

        // Wait for the loader to appear and then disappear
        await page.waitForSelector('[data-testid="loading-spinner"]');
        await page.waitForSelector('[data-testid="loading-spinner"]', { hidden: true });

        // Check if the generated image is displayed
        const imageSrc = await page.$eval('[data-testid="generated-image"]', el => (el as HTMLImageElement).src);
        expect(imageSrc).toMatch(/^data:image\/jpeg;base64,/);

        // Check if the dialog is displayed
        const dialogText = await page.$eval('[data-testid="generated-dialog"]', el => (el as HTMLElement).innerText);
        expect(dialogText).toContain('Ananse:');
        expect(dialogText).toContain('Villager:');
    });
    
    test('should generate a new scene description on "Next Scene" click', async () => {
        await page.goto(APP_URL);

        const originalPrompt = await page.$eval('[data-testid="prompt-textarea"]', el => (el as HTMLTextAreaElement).value);

        // Click the "Next Scene" button
        await page.click('[data-testid="next-scene-button"]');

        // Wait for the loader to appear and disappear (by checking the button's disabled state)
        await page.waitForSelector('[data-testid="next-scene-button"]:disabled');
        await page.waitForSelector('[data-testid="next-scene-button"]:not(:disabled)');

        // Check that the prompt has changed
        const newPrompt = await page.$eval('[data-testid="prompt-textarea"]', el => (el as HTMLTextAreaElement).value);
        expect(newPrompt).not.toBe(originalPrompt);
        expect(newPrompt).toContain('Ananse:');
        expect(newPrompt).toContain('Visual:');
        expect(newPrompt).toContain('Action:');
    });

    test('should add a generated scene to the history section', async () => {
        await page.goto(APP_URL);

        // Initially, there should be no history section
        let historySection = await page.$('[data-testid="history-section"]');
        expect(historySection).toBeNull();
        
        // Click the generate button
        await page.click('[data-testid="generate-button"]');

        // Wait for generation to complete
        await page.waitForSelector('[data-testid="loading-spinner"]', { hidden: true });
        
        // Now history section should be visible
        historySection = await page.waitForSelector('[data-testid="history-section"]');
        expect(historySection).not.toBeNull();

        // Check for a history item
        const historyItem = await page.$('[data-testid="history-section"] .grid > div');
        expect(historyItem).not.toBeNull();
    });
});
