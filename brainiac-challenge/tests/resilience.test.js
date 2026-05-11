
const mockQuizWithInvalidData = require('./mockQuizWithInvalidData.json');

describe('Brainiac Challenge Resilience Test', () => {

  beforeAll(async () => {
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.url().includes('generativelanguage.googleapis.com')) {
        console.log('Intercepting API request and responding with invalid data for resilience test.');
        // This test specifically uses the mock with invalid data.
        request.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockQuizWithInvalidData),
        });
      } else {
        request.continue();
      }
    });

    // Go to a blank page first to ensure a clean state from other test files
    await page.goto('about:blank');
    // Navigate to the app
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle0' });
  });

  afterAll(async () => {
    // Good practice to clear listeners and disable interception
    page.removeAllListeners('request');
    await page.setRequestInterception(false);
  });

  it('should filter out invalid questions and still render a valid quiz', async () => {
    // Ensure we are on the settings page
    await page.waitForSelector('[data-testid="settings-view"]');

    // Start the challenge
    await page.click('[data-testid="start-challenge-button"]');

    // Wait for the quiz view to appear, skipping the generating view
    await page.waitForSelector('[data-testid="quiz-view"]');

    // **Assertion**: Check that the quiz is rendered with ONLY the valid questions.
    // The mock data has 3 valid and 2 invalid questions.
    // The quiz should therefore have a total of 3 questions.
    const questionCounter = await page.waitForSelector('[data-testid="question-counter"]');
    const questionCountText = await page.evaluate(el => el.textContent, questionCounter);
    expect(questionCountText).toBe('Question 1 of 3');

    // **Assertion**: Check that the displayed question is the first VALID one from the mock.
    const questionTextEl = await page.waitForSelector('[data-testid^="question-text-"]');
    const questionText = await page.evaluate(el => el.textContent, questionTextEl);
    expect(questionText).toContain("What is the capital of France?");

    // **Assertion**: Check that the navigator has the correct number of buttons.
    const navigatorButtons = await page.$$('[data-testid^="navigator-q-"]');
    expect(navigatorButtons.length).toBe(3);
  });
});