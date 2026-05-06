/**
 * Environment Configuration
 * Create a .env file in the root directory with your actual values
 */

export const ENV = {
  // Application URLs
  BASE_URL: process.env.BASE_URL || 'https://portal.aucdt.edu.gh/admissions-qa/#/',
  LOGIN_URL: process.env.LOGIN_URL || 'https://portal.aucdt.edu.gh/admissions-qa/#/main-applcation-login',
  
  // Test Credentials
  TEST_USERNAME: process.env.TEST_USERNAME || 'test_user',
  TEST_PASSWORD: process.env.TEST_PASSWORD || 'Test@123',
  TEST_EMAIL: process.env.TEST_EMAIL || 'test@example.com',
  
  // Test Configuration
  HEADLESS: process.env.HEADLESS === 'true',
  TIMEOUT: parseInt(process.env.TIMEOUT || '30000'),
  RETRY_COUNT: parseInt(process.env.RETRY_COUNT || '2'),
  
  // Browser Configuration
  BROWSER: process.env.BROWSER || 'chromium',
  SLOW_MO: parseInt(process.env.SLOW_MO || '0'),
  
  // Screenshot and Video
  SCREENSHOT_ON_FAILURE: process.env.SCREENSHOT_ON_FAILURE !== 'false',
  VIDEO_ON_FAILURE: process.env.VIDEO_ON_FAILURE !== 'false',
  
  // Reporting
  REPORT_DIR: process.env.REPORT_DIR || 'test-results',
  SCREENSHOT_DIR: process.env.SCREENSHOT_DIR || 'test-results/screenshots',
  
  // CI/CD
  CI: process.env.CI === 'true',
  
  // Database (if needed for test data)
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
};

export default ENV;
