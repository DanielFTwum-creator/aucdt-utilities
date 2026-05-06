
/**
 * @jest-environment jest-playwright
 * 
 * End-to-end test suite for the WillPro application.
 *
 * This test simulates a full user journey through the will creation process.
 * It assumes a local web server is running and serving the application.
 * 
 * To run this test:
 * 1. Make sure you have Jest and jest-playwright configured.
 * 2. Start a local server for the project (e.g., `npx http-server .`).
 * 3. Run the test command (e.g., `jest e2e.test.js`).
 */

describe('WillPro End-to-End Test', () => {
    beforeAll(async () => {
        // Navigate to the application's URL.
        // Replace with your local server's URL if different.
        await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
    });

    it('should complete the entire will creation process', async () => {
        // --- Step 1: Jurisdiction ---
        await page.waitForSelector('.jurisdiction-step');
        await expect(page).toMatchElement('h2', { text: 'Jurisdiction & Disclaimer' });
        await page.select('select[name="jurisdiction"]', 'Ghana');
        await page.click('.continue-btn');

        // --- Step 2: Testator ---
        await page.waitForSelector('.testator-step');
        await expect(page).toMatchElement('h2', { text: 'Testator Information' });
        await page.type('input[name="testatorName"]', 'John Kweku Doe');
        await page.type('input[name="testatorAddress"]', '123 Ananse Street, Accra, Ghana');
        await page.type('input[name="testatorDob"]', '1980-01-15'); // YYYY-MM-DD
        await page.click('.continue-btn');

        // --- Step 3: Executor ---
        await page.waitForSelector('.executor-step');
        await expect(page).toMatchElement('h2', { text: 'Appoint an Executor' });
        await page.type('input[name="executorName"]', 'Jane Ama Doe');
        await page.type('input[name="alternateExecutorName"]', 'Peter Mensah');
        await page.click('.continue-btn');
        
        // --- Step 4: Guardianship ---
        await page.waitForSelector('.guardianship-step');
        await expect(page).toMatchElement('h2', { text: 'Appoint a Guardian' });
        await page.click('input[name="hasMinorChildren"]');
        await page.waitForSelector('input[name="guardianName"]');
        await page.type('input[name="guardianName"]', 'Mary Akua Smith');
        await page.type('input[name="alternateGuardianName"]', 'David Kofi Jones');
        await page.click('.continue-btn');

        // --- Step 5: Assets ---
        await page.waitForSelector('.assets-step');
        await expect(page).toMatchElement('h2', { text: 'Real Estate Assets' });
        await page.type('input#propertyDescription', 'House and land');
        await page.type('input#propertyLocation', 'East Legon, Accra');
        await page.click('.add-item-box .btn-primary');
        await expect(page).toMatchElement('.item-list-item strong', { text: 'House and land' });
        await page.click('.continue-btn');

        // --- Step 6: Specific Gifts ---
        await page.waitForSelector('.distribution-step');
        await expect(page).toMatchElement('h2', { text: 'Specific Gifts' });
        await page.type('input#beneficiaryName', 'Kofi Doe');
        await page.type('input#giftItem', 'My Rolex watch');
        await page.click('.add-item-box .btn-primary');
        await expect(page).toMatchElement('.item-list-item strong', { text: 'Kofi Doe' });
        await page.click('.continue-btn');

        // --- Step 7: Residuary Estate ---
        await page.waitForSelector('.residuary-step');
        await expect(page).toMatchElement('h2', { text: 'Residuary Estate' });
        await page.type('input[name="residuaryBeneficiaryName"]', 'Jane Ama Doe');
        await page.click('.continue-btn');
        
        // --- Step 8: Review ---
        await page.waitForSelector('.review-step');
        await expect(page).toMatchElement('h2', { text: 'Review & Generate' });

        // Verify the data on the review page
        await expect(page).toMatchElement('.review-item span', { text: 'Ghana' });
        await expect(page).toMatchElement('.review-item span', { text: 'John Kweku Doe' });
        await expect(page).toMatchElement('.review-item span', { text: 'Jane Ama Doe' });
        await expect(page).toMatchElement('.review-item span', { text: 'Peter Mensah' });
        await expect(page).toMatchElement('.review-item span', { text: 'Mary Akua Smith' });
        await expect(page).toMatchElement('.review-item span', { text: 'David Kofi Jones' });
        await expect(page).toMatchElement('.review-item strong', { text: 'House and land' });
        await expect(page).toMatchElement('.review-item strong', { text: 'Kofi Doe:' });
        await expect(page).toMatchElement('.review-item span', { text: 'My Rolex watch' });

        // Check if the Generate button is present
        await expect(page).toMatchElement('.continue-btn', { text: 'Generate Secure Document' });
    });
});
