# Testing Guide: Manual & Automated

## 🧪 Automated Testing (Playwright)
Both projects include a comprehensive Playwright test suite located in `tests/playwright/`.

### Running Tests
To execute the critical journey tests:
```bash
# Ensure the dev server is running first
npm run dev

# In a separate terminal
node tests/playwright/critical-flow.test.js
```

### What is Tested?
- Authentication flow (Dashboard and Admin).
- Component rendering (Charts, Matrix, Header).
- Tab navigation integrity.
- Theme switching.

## 🖱️ Manual Verification
For manual QA, use the **System Health** tab in the Admin section.

1. **Step 1**: Log in as Admin.
2. **Step 2**: Navigate to "System Health" or "Playwright Self-Test".
3. **Step 3**: Click "Run Full Suite".
4. **Step 4**: Monitor the "Journal Output" for any red icons (❌).
5. **Step 5**: If capturing screenshots, verify they appear in the `tests/playwright/screenshots` directory.

## 📸 Capture Milestones
Screenshots are automatically captured during the Playwright run to document the application state at critical transitions.
