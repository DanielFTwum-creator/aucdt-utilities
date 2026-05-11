const mockQuizResponse = require('./mockQuiz.json');

describe('Brainiac Challenge E2E Test Suite', () => {

  beforeAll(async () => {
    // Enable request interception to mock API calls
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      // Check if the request is for the Gemini API
      if (request.url().includes('generativelanguage.googleapis.com')) {
        console.log('Mocking API request to:', request.url());
        request.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockQuizResponse),
        });
      } else {
        request.continue();
      }
    });

    // Navigate to the app once, before all tests
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle0' });
  });

  afterAll(async () => {
    await page.setRequestInterception(false);
  });

  it('should load the settings page correctly', async () => {
    await page.waitForSelector('[data-testid="settings-view"]');
    const title = await page.$eval('[data-testid="main-title"]', (el) => el.textContent);
    expect(title).toBe('Brainiac Challenge');
    
    // Check for TUC logo
    const logo = await page.$('img[alt="TUC Logo"]');
    expect(logo).not.toBeNull();
  });

  it('should allow user to configure quiz settings', async () => {
    // Select Level
    await page.select('[data-testid="level-select"]', 'Junior High School');

    // Select Topic - wait for options to update
    await page.waitForFunction(() => {
        const select = document.querySelector('[data-testid="topic-select"]');
        return Array.from(select.options).some(opt => opt.text === 'Integrated Science');
    });
    await page.select('[data-testid="topic-select"]', 'Integrated Science');

    // Select Difficulty
    await page.select('[data-testid="difficulty-select"]', 'Easy');
    
    // Select Time Limit
    await page.select('[data-testid="time-limit-select"]', '300'); // 5 minutes

    // Test custom topic
    await page.select('[data-testid="topic-select"]', 'Other...');
    await page.waitForSelector('[data-testid="custom-topic-input"]');
    await page.type('[data-testid="custom-topic-input"]', 'Custom Test Topic');
  });

  it('should start the quiz and navigate through it', async () => {
    await page.click('[data-testid="start-challenge-button"]');

    // Wait for generating view and then quiz view
    await page.waitForSelector('[data-testid="generating-quiz-view"]');
    await page.waitForSelector('[data-testid="quiz-view"]');

    // Check for timer
    await page.waitForSelector('[data-testid="quiz-timer"]');
    const timerText = await page.$eval('[data-testid="quiz-timer"]', el => el.textContent);
    expect(timerText).toMatch(/05:00|04:59/); // Check for initial time, allowing for slight delay

    const questionCountText = await page.$eval('[data-testid="question-counter"]', el => el.textContent);
    expect(questionCountText).toBe('Question 1 of 2');

    // --- Question 1 ---
    await page.waitForSelector('[data-testid="question-text-1"]');
    // Click the 3rd option (index 2), which is correct
    await page.click('[data-testid="option-1-2"]');
    await page.click('[data-testid="next-button"]');

    // --- Question 2 ---
    await page.waitForSelector('[data-testid="question-text-2"]');
    expect(await page.$eval('[data-testid="question-counter"]', el => el.textContent)).toBe('Question 2 of 2');
    // Click the 1st option (index 0), which is incorrect
    await page.click('[data-testid="option-2-0"]');

    // Submit
    const nextButton = await page.waitForSelector('[data-testid="next-button"]');
    const nextButtonText = await page.evaluate(el => el.textContent, nextButton);
    expect(nextButtonText).toBe('Submit Answers');
    await nextButton.click();
  });
  
  it('should display the results page with correct score and review', async () => {
    await page.waitForSelector('[data-testid="results-view"]');
    
    const score = await page.$eval('[data-testid="score-percentage"]', el => el.textContent);
    expect(score).toBe('50%'); // 1 out of 2 correct

    const feedback = await page.$eval('[data-testid="score-feedback"]', el => el.textContent);
    expect(feedback).toContain("Good effort!");
    
    // Check review section
    const reviewItems = await page.$$('[data-testid^="review-item-"]');
    expect(reviewItems.length).toBe(2);

    // Review item 1 should be correct
    const reviewItem1CorrectIcon = await page.$('[data-testid="review-item-1-correct"]');
    expect(reviewItem1CorrectIcon).not.toBeNull();
    
    // Review item 2 should be incorrect
    const reviewItem2IncorrectIcon = await page.$('[data-testid="review-item-2-incorrect"]');
    expect(reviewItem2IncorrectIcon).not.toBeNull();
  });

  it('should handle the audit log correctly', async () => {
    // Go back to settings
    await page.click('[data-testid="new-challenge-button"]');
    await page.waitForSelector('[data-testid="settings-view"]');

    // Open audit log
    await page.click('[data-testid="audit-log-button"]');
    await page.waitForSelector('[data-testid="audit-log-modal"]');
    
    // Check for the log entry from the previous test
    await page.waitForSelector('[data-testid="audit-log-item-0"]');
    const logTopic = await page.$eval('[data-testid="audit-log-item-0-topic"]', el => el.textContent);
    expect(logTopic).toBe('Custom Test Topic');
    
    // Open log details
    await page.click('[data-testid="audit-log-item-0"]');
    await page.waitForSelector('[data-testid="audit-log-details-modal"]');
    
    // Verify some detail content
    const detailsContent = await page.$eval('[data-testid="audit-log-details-modal"]', el => el.innerHTML);
    expect(detailsContent).toContain('Gemini Prompt');
    expect(detailsContent).toContain('Gemini JSON Response');

    // Close details
    await page.click('[data-testid="audit-log-details-close-button"]');
    await page.waitForFunction(() => !document.querySelector('[data-testid="audit-log-details-modal"]'));

    // Close main audit log modal
    await page.click('[data-testid="audit-log-close-button"]');
    await page.waitForFunction(() => !document.querySelector('[data-testid="audit-log-modal"]'));

    // Verify we are back on the settings page
    await page.waitForSelector('[data-testid="settings-view"]');
  });

});