const { chromium } = require('@playwright/test');
const express = require('express');
const path = require('path');
const fs = require('fs');
const getPort = require('get-port');

describe('TUC Assessment Platform E2E Tests', () => {
    let browser;
    let page;
    let server;
    let port;

    beforeAll(async () => {
        // Find an available port
        port = await getPort();
        const app = express();
        // Serve static files from the project root
        app.use(express.static(path.join(__dirname, '..')));
        server = app.listen(port);

        browser = await chromium.launch({ 
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
        server.close();
    });

    it('should allow a student to navigate and complete an assessment', async () => {
        // 1. Navigate to the homepage
        await page.goto(`http://localhost:${port}/`);
        
        // 2. Verify the dashboard is visible
        await page.waitForSelector('h2 ::-p-text(Academic Programmes)');
        
        // 3. Click on the "Digital Media" programme
        await page.click('h3 ::-p-text(Digital Media)');

        // 4. Verify the programme detail page is loaded
        await page.waitForSelector('h2 ::-p-text(Digital Media)');
        
        // 5. Click on an assessment with questions
        await page.click('span ::-p-text(DMCD111)');

        // 6. Verify the assessment player is visible
        await page.waitForSelector('h2 ::-p-text(DMCD111 - Introduction to Digital Media)');
        await page.waitForSelector('h3 ::-p-text(What does RGB stand for in digital colour models?)');

        // 7. Answer the question
        await page.click('div ::-p-text(Red, Green, Blue)');

        // 8. Submit the assessment
        await page.click('button ::-p-text(Submit Assessment)');

        // 9. Confirm submission in the modal
        await page.waitForSelector('h3 ::-p-text(Confirm Submission)');
        await page.click('button ::-p-text(Submit)');

        // 10. Verify the results page is displayed
        await page.waitForSelector('h2 ::-p-text(Assessment Complete!)');
        const scoreText = await page.$eval('div.absolute span.text-5xl', el => el.textContent);
        
        // 11. Check the score
        expect(scoreText).toBe('100%');
    });

    it('should allow an admin to log in and view the admin panel', async () => {
        // 1. Navigate to the homepage
        await page.goto(`http://localhost:${port}/`);
        await page.waitForSelector('h2 ::-p-text(Academic Programmes)');
        
        // 2. Click the admin button
        const adminButtonSelector = 'button ::-p-text(Admin)';
        await page.waitForSelector(adminButtonSelector);
        await page.click(adminButtonSelector);

        // 3. Verify login modal appears
        await page.waitForSelector('h3 ::-p-text(Admin Access)');

        // 4. Enter password and log in
        await page.type('input[type="password"]', 'admin');
        await page.click('button[type="submit"]');

        // 5. Verify the admin panel is visible
        await page.waitForSelector('h2 ::-p-text(Administrative Panel)');
        const adminPanelTitle = await page.$eval('h2', el => el.textContent);
        expect(adminPanelTitle).toBe('Administrative Panel');

        // 6. Navigate back home
        await page.click('button ::-p-text(Home)');
        await page.waitForSelector('h2 ::-p-text(Academic Programmes)');
        const homeTitle = await page.$eval('h2', el => el.textContent);
        expect(homeTitle).toBe('Academic Programmes');
    });

    it('should show an error for incorrect admin password', async () => {
        // 1. Navigate to the homepage
        await page.goto(`http://localhost:${port}/`);
        await page.waitForSelector('h2 ::-p-text(Academic Programmes)');
        
        // 2. Click the admin button
        const adminButtonSelector = 'button ::-p-text(Admin)';
        await page.waitForSelector(adminButtonSelector);
        await page.click(adminButtonSelector);

        // 3. Verify login modal appears
        await page.waitForSelector('h3 ::-p-text(Admin Access)');

        // 4. Enter incorrect password and attempt to log in
        await page.type('input[type="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // 5. Verify error message is displayed
        await page.waitForSelector('p ::-p-text(Incorrect password. Please try again.)');
        const errorMessage = await page.$eval('.text-red-500', el => el.textContent);
        expect(errorMessage).toBe('Incorrect password. Please try again.');
    });
});

describe('Data Integrity Tests', () => {
    let initialProgrammeData;

    beforeAll(() => {
        const constantsPath = path.join(__dirname, '..', 'constants.ts');
        let fileContent = fs.readFileSync(constantsPath, 'utf8');

        // This extracts the object assigned to initialProgrammeData without needing a TS transpiler.
        const objectString = fileContent.substring(fileContent.indexOf('{'), fileContent.lastIndexOf(';') + 1);
        initialProgrammeData = new Function(`return ${objectString}`)();
    });

    it('should contain all Jewellery Design courses from the PDF', () => {
        const expectedCourseCodes = new Set([
            'BJDT111', 'ACDT112', 'ACDT113', 'ACDT114', 'ACDT115', 'ACDT116', 'BJDT121', 'BJDT122', 'BJDT123', 'BJDT125', 'ACDT125', 'ACDT126',
            'BJDT231', 'BJDT232', 'BJDT233', 'BJDT234', 'BJDT235', 'BJDT236', 'ACDT237', 'BJDT241', 'BJDT242', 'BJDT243', 'BJDT244', 'BJDT245', 'BJDT246', 'BJDT247',
            'BJDT351', 'BJDT352', 'BJDT353', 'BJDT354', 'BJDT355', 'ACDT356', 'ACDT357', 'BJDT361', 'BJDT362', 'BJDT363', 'BJDT364', 'BJDT365', 'ACDT367',
            'BJDT471', 'BJDT472', 'BJDT481', 'BJDT482', 'BJDT483', 'BJDT484', 'BJDT485', 'ACDT486'
        ]);

        const programme = initialProgrammeData.programmes.find(p => p.id === 'jd');
        const actualCourseCodes = new Set(Object.values(programme.assessments).flat().map(asm => asm.id));
        
        expect(actualCourseCodes).toEqual(expectedCourseCodes);
    });
    
    it('should contain all Digital Media courses from the PDF', () => {
        const expectedCourseCodes = new Set([
            'DMCD111', 'DMCD112', 'DMCD113', 'DMCD114', 'ACDT114-DM', 'ACDT115-DM', 'ACDT116-DM', 'DMCD121', 'DMCD122', 'DMCD123', 'DMCD124', 'ACDT124', 'ACDT125-DM', 'ACDT126-DM',
            'DMCD231', 'DMCD232', 'DMCD233', 'DMCD234', 'DMCD235', 'DMCD236', 'ACDT231', 'DMCD241', 'DMCD242', 'DMCD243', 'DMCD244', 'DMCD245',
            'DMCD351', 'DMCD352', 'DMCD353', 'DMCD354', 'DMCD355', 'ACDT351', 'DMCD361', 'DMCD362', 'DMCD363', 'DMCD364', 'ACDT361', 'DMCD365', 'DMCD366',
            'DMCD471', 'DMCD472', 'DMCD473', 'DMCD474', 'ACDT471', 'DMCD481', 'DMCD482', 'DMCD483', 'DMCD484'
        ]);

        const programme = initialProgrammeData.programmes.find(p => p.id === 'dm');
        const actualCourseCodes = new Set(Object.values(programme.assessments).flat().map(asm => asm.id));
        
        expect(actualCourseCodes).toEqual(expectedCourseCodes);
    });

    it('should contain all Fashion Design courses from the PDF', () => {
        const expectedCourseCodes = new Set([
            'FDT151', 'FDT153', 'FDT155', 'FDT157', 'FDT159', 'ACDT114', 'ACDT117', 'ACDT115', 'ACDT116', 'FDT150', 'FDT152', 'FDT154', 'FDT156', 'FDT158', 'FDT160', 'ACDT127', 'ACDT126', 'WEL150',
            'FDT251', 'FDT253', 'FDT255', 'FDT257', 'FDT259', 'FDT261', 'FDT263', 'FDT265', 'FDT267', 'FDT250', 'FDT252', 'FDT254', 'FDT256', 'FDT258', 'FDT260', 'FDT262', 'FDT264', 'WEL250',
            'FDT351', 'FDT353', 'FDT355', 'FDT357', 'FDT359', 'FDT361', 'FDT363', 'ACDT367', 'WEL350', 'FDT352',
            'FDT451', 'FDT453', 'FDT455', 'FDT457', 'FDT459', 'FDT450', 'FDT452', 'FDT454', 'FDT460', 'FDT464'
        ]);

        const programme = initialProgrammeData.programmes.find(p => p.id === 'fd');
        const actualCourseCodes = new Set(Object.values(programme.assessments).flat().map(asm => asm.id));

        expect(actualCourseCodes).toEqual(expectedCourseCodes);
    });

    it('should contain all Product Design courses from the PDF', () => {
        const expectedCourseCodes = new Set([
            'BPDE111', 'ACDT112', 'ACDT113', 'ACDT114', 'ACDT115', 'ACDT116', 'ACDT117', 'BPDE121', 'BPDE122', 'BPDE123', 'BPDE125', 'ACDT125', 'ACDT126', 'ACDT127',
            'BPDE231', 'BPDE232', 'BPDE233', 'BPDE234', 'BPDE235', 'BPDE236', 'BPDE237', 'BPDE241', 'BPDE242', 'BPDE243', 'BPDE244', 'BPDE245', 'BPDE246', 'ACDT247',
            'BPDE351', 'BPDE352', 'BPDE353', 'BPDE354', 'BPDE355', 'ACDT356', 'BPDE361', 'BPDE362', 'BPDE363', 'BPDE364', 'BPDE365', 'ACDT367',
            'BPDE471', 'BPDE472', 'BPDE481', 'BPDE482', 'BPDE483', 'BPDE484', 'ACDT485'
        ]);

        const programme = initialProgrammeData.programmes.find(p => p.id === 'pd');
        const actualCourseCodes = new Set(Object.values(programme.assessments).flat().map(asm => asm.id));
        
        expect(actualCourseCodes).toEqual(expectedCourseCodes);
    });
});
