# Patois Lyricist - Quality Assurance & Testing Framework

## 1. Manual Regression Protocol
Perform these checks after every deployment.

### 1.1 Security Verification
*   **Brute Force**: Attempt 3 incorrect logins. Verify "Security Lockout" is triggered.
*   **Session Guard**: Leave the tab open for 15 minutes without activity. Verify auto-logout.
*   **Obfuscation**: Open Browser DevTools > Application > LocalStorage. Verify user passwords are not stored in plain text.

### 1.2 Feature Verification
*   **Voice Dictation**: Use the Microphone button to dictate a theme. Verify text input accuracy.
*   **PDF Export**: Generate a song and export as PDF. Verify the formatted layout and title are present.

## 2. Automated E2E Suite (Puppeteer)
Templates are provided in the application's `Diagnostics` panel.

### 2.1 Setup
1.  Install Puppeteer: `npm install puppeteer jest-puppeteer`.
2.  Run the suite: `npm test`.

### 2.2 Sample Test: Registration Flow
```javascript
it('should allow identity enrollment', async () => {
  await page.goto('https://patois-lyricist.local');
  await page.click('.register-link button');
  await page.type('#username', 'test_user');
  await page.type('#password', 'secure_pass_123');
  await page.click('#consent');
  await page.click('button[type="submit"]');
  await page.waitForSelector('header'); // App loaded
});
```

## 3. Forensic Log Auditing
Verify that every automated test execution creates a corresponding entry in the `patoisLyricistAuditLog` with valid resolution and UA metadata.
