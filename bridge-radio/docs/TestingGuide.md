# Testing Guide - Bridge Radio

## Internal Playwright E2E Suite
The application features a built-in "Playwright-style" E2E testing suite accessible via the Admin Panel.

### Running Tests
1. Log in to the **Admin Panel**.
2. Navigate to the **Testing** tab.
3. Click **Run Suite**.

### Test Coverage
- **Stream Initialization**: Verifies that the HLS manifest parser successfully populated the tracklist.
- **Theme Switching**: Verifies that the DOM `data-theme` attribute correctly reflects the application state.
- **Audio Controls**: Verifies that the HTML5 Audio element is correctly mounted and referenced.
- **Admin Security**: Verifies that the current session is authenticated.
- **Genre Navigation**: Verifies that all 3 core genres are available.

### Automated Screenshots
The suite uses `html2canvas` to capture a screenshot of the viewport at the end of each test step. These are displayed inline and stored in the **Artifact Gallery**.

## Manual Testing Checklist
- [ ] Verify HLS playback on mobile (iOS/Android).
- [ ] Verify EQ visualizer responsiveness.
- [ ] Verify Sleep Timer (Presets and Custom Slider).
- [ ] Verify Feedback Form submission and Audit Log entry.
- [ ] Verify Autoplay/Shuffle/Loop logic.
- [ ] Verify High Contrast mode legibility.

## Linting
Run the TypeScript linter to catch static errors:
```bash
npm run lint
```
