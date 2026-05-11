/// <reference types="playwright" />

import { describe, beforeAll, it, expect } from '@jest/globals';
import 'jest-playwright';
import 'expect-playwright';
import { Dialog } from '@playwright/test';

describe('Lecturer Assessment System E2E Tests', () => {

  beforeAll(async () => {
    // Playwright automatically navigates to the server URL from jest-playwright.config.js
    // We can just wait for the root element to be visible.
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });
    await page.waitForSelector('#root');
  });

  it('should display the header and home tab content on load', async () => {
    await expect(page).toMatchElement('h1', { text: 'University College' });
    await expect(page).toMatchElement('h2', { text: 'Student Dashboard' });
  });

  it('should successfully submit a lecturer assessment', async () => {
    // Navigate to the assessment tab
    await expect(page).toClick('button', { text: 'Submit Assessment' });
    await page.waitForSelector('.assessment-form-container');

    // Fill out the form
    await expect(page).toSelect('select[name="programme"]', 'Digital Media');
    await page.waitForFunction(() => document.querySelector<HTMLSelectElement>('#lecturer')?.options.length > 1);
    await expect(page).toSelect('select[name="lecturer"]', 'Ms. Lisa Wilson');
    
    // Select a course from the new dropdown
    await page.waitForFunction(() => document.querySelector<HTMLSelectElement>('#subject')?.options.length > 1);
    await expect(page).toSelect('select[name="subject"]', 'Web Design');
    
    await expect(page).toSelect('select[name="semester"]', 'First Semester');

    // Click stars for ratings
    await page.evaluate(() => {
        const clickStar = (item: number, star: number) => {
            const starEl = document.querySelector(`.rating-item:nth-child(${item}) span:nth-child(${star})`) as HTMLElement;
            if (starEl) starEl.click();
        };
        clickStar(1, 4); // Teaching
        clickStar(2, 5); // Communication
        clickStar(3, 3); // Content
        clickStar(4, 5); // Punctuality
    });
    // Wait for state to update (optional, but good practice)
    await new Promise(resolve => setTimeout(resolve, 100));


    await expect(page).toFill('textarea[name="comments"]', 'This is an automated test comment.');
    await expect(page).toSelect('select[name="recommendation"]', 'Highly Recommend');

    // Submit the form
    await expect(page).toClick('button[type="submit"]');

    // Verify success modal
    await page.waitForSelector('.fa-check-circle');
    await expect(page).toMatch('Assessment Submitted!');
    await expect(page).toClick('button', { text: 'Continue' });

    // Verify the result appears in the results tab
    await expect(page).toClick('button', { text: 'View Results' });
    await page.waitForSelector('p.font-bold.text-lg.text-primary-text');
    await expect(page).toMatch('Ms. Lisa Wilson');
    await expect(page).toMatch('Web Design');
  });

  it('should handle admin login and show audit logs', async () => {
    // Navigate to the admin tab
    await expect(page).toClick('button', { text: 'Admin' });
    await page.waitForSelector('#admin-password');

    // Attempt incorrect login
    await expect(page).toFill('input[type="password"]', 'wrongpassword');
    // Verify error (using page.on('dialog') for alerts)
    const dialogPromise = new Promise<Dialog>(resolve => page.once('dialog', resolve));
    await expect(page).toClick('button', { text: 'Login' });
    const dialog = await dialogPromise;
    expect(dialog.message()).toBe('Incorrect password.');
    await dialog.dismiss();


    // Correct login
    await expect(page).toFill('input[type="password"]', 'admin');
    await expect(page).toClick('button', { text: 'Login' });
    
    // Verify admin panel is visible
    await page.waitForSelector("xpath/ //h3[contains(., 'Audit Log')]");
    
    // Verify audit logs from previous test are present
    await expect(page).toMatch('ASSESSMENT SUBMIT');
    await expect(page).toMatch('ADMIN LOGIN');
  });

});
