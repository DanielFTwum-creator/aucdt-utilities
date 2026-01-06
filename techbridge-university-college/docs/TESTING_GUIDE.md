# TUC Testing & Diagnostics Guide

## 1. Automated Testing (Puppeteer-Lite)
The TUC platform features a built-in, zero-dependency end-to-end diagnostic suite.

### How to Run:
1.  Navigate to the footer.
2.  Click **Test Suite** or go to `/#test`.
3.  Press **Run Diagnostics**.

### Test Scenarios Covered:
*   **TUC Brand Verification**: Ensures the rebranded institutional name and motto are present.
*   **BridgeBot AI Validation**: Confirms the assistant initializes and identifies as "BridgeBot".
*   **Visual Accessibility Check**: Cycles through Light/Dark/High-Contrast themes and verifies DOM states.
*   **Admin Security Integrity**: Validates brute-force protection logic and password rejection.

## 2. Manual Verification Checklist
*   **Navigation**: All sub-menu links for Academics (Faculty, Calendar, etc.) are functional.
*   **Responsiveness**: Main programmes (DMCD, FDT, JDT, PDE) stack correctly on mobile.
*   **Themes**: High-contrast mode applies #000 backgrounds and #fff text globally.
*   **Chatbot**: Streaming response works and accepts multimodal (image) context.

## 3. Visual Regression
Use the **Snapshot Gallery** in the Test Suite to visually inspect component rendering after major updates. snapshots are captured at critical state transitions.