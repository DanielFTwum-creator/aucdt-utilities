# Testing & Quality Assurance Guide (v3.2)

## 1. Built-in Self-Diagnostics
The platform includes an internal diagnostic suite to verify environment health without external tools.
- **Access**: Admin Panel -> "Testing" Tab.
- **Checks**:
    - **API Connectivity**: Verifies `API_KEY` presence and connection to Gemini endpoints.
    - **Visual Diagnostic**: The "Capture Layout" feature simulates a high-resolution screenshot stored in the session audit log for integrity verification.

## 2. Automated Playwright Suite
For CI/CD or deep regression testing, use the `docs/tests.js` script.
- **Requirement**: Node.js & Playwright (`npm install playwright`).
- **Execution**: `node docs/tests.js`.
- **Coverage**:
    - User navigation (Keyboard & UI).
    - Admin Password validation (`smartscale2025`).
    - AI Workshop prompt submission lifecycle.

## 3. Workshop Tokenization Testing
Verify that image prompts are correctly processed:
1. Open the AI Workshop Tool.
2. Select "Image Creator".
3. Enter a prompt containing `[STYLE]` and `[ASPECT]`.
4. Select a style (e.g., Cyberpunk) and an aspect ratio (e.g., 16:9).
5. Generate and check the Audit Log to confirm the tokens were replaced with descriptive strings.

## 4. Accessibility Audit
- **Protocol**: Use the "High Contrast" theme and verify that all interactive elements have 4.5:1 contrast ratios.
- **Screen Readers**: All buttons use `aria-label` or `title` attributes. Verify focus trapping in the Admin Modal.

## 5. Troubleshooting
- **API Timeout**: Check network console. Gemini API requires a stable connection.
- **Audit Log Overflow**: The application caps logs at 50 entries to maintain performance.