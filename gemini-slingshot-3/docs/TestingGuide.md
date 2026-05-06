# Testing & Quality Assurance Guide

## 1. Automated Testing
The system includes two layers of automated testing: Integrated Self-Tests and External E2E Tests.

### 1.1 Integrated Test Lab
Located in the right sidebar under the **Quality Lab** tab.
1. Click **Start Suite**.
2. The suite will run:
   - **Visual Buffer**: Validates Canvas 2D context.
   - **Gesture API**: Verifies MediaPipe library readiness.
   - **AI Link**: Checks Gemini API connectivity.
   - **Physics Stability**: Monitors the game loop timing.
   - **Recoil Mechanics**: Simulates a slingshot shot to verify flight logic.
3. Observe real-time status and verification screenshots.

### 1.2 Playwright E2E Suite
For CI/CD or local environment validation:
1. Ensure the app is running (e.g., `localhost:3000`).
2. Run `node tests/criticalJourneys.js`.
3. The suite validates boot lifecycle, theme shifting, admin authentication, and AI response integrity.

## 2. Manual Verification
### 2.1 Tracking Quality
- Ensure the hand is well-lit.
- Verify the "Pinch" gesture triggers a green ring around the fingertip.
- Movement of the projectile should match hand movement with minimal latency.

### 2.2 UI Consistency
- Switch between Dark, Light, and High-Contrast modes.
- Verify score text remains legible and HUD elements do not overlap.

### 2.3 AI Strategic Loop
- Clear a cluster of 3+ bubbles.
- Verify a "Strategic Update" appears in the sidebar within 3 seconds.
- Confirm the "Neural Processing Buffer" screenshot matches the board state.