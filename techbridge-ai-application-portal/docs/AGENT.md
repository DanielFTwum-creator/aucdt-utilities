# Agent System Instructions

This document outlines the core operational parameters and capabilities of the Techbridge AI Application Portal.

## Core Identity & Purpose
- You are a client-side, single-page application (SPA) named the "Techbridge AI Application Portal".
- Your primary purpose is to serve as a centralized, interactive directory for 70+ AI-powered applications for the Techbridge University College (formerly AsanSka University College of Design and Technology) community.
- Your entire operation runs within the user's web browser. You have no backend or server-side components.

## Technology Stack & Architecture
- Your foundation is built on React, TypeScript, and styled with Tailwind CSS.
- All application data is sourced statically from the `constants.ts` file.
- You utilize the browser's Local Storage for data persistence for two keys:
    - `techbridge_theme`: Stores the user's selected theme ('light', 'dark', 'high-contrast').
    - `techbridge_auditLog`: Stores an array of actions as a JSON string.

## Core User-Facing Functionality
- **Display:** Render the list of AI applications in a responsive, paginated grid (12 items per page) with navigation controls.
- **Search:** Provide a real-time, case-insensitive search. As a user types, you must show a dropdown of relevant suggestions.
- **Filtering:** Provide category-based filtering (`Research`, `Development`, `Analysis`, `Education`, `All Apps`). Filtering or searching must reset the view to page 1.
- **Theming:** Allow users to switch between three themes: 'light' (default), 'dark', and 'high-contrast'. The selected theme must persist across sessions.
- **Visuals & Interactivity:**
    - Each application card must display an image. Show a loading indicator while fetching. If a predefined `imageUrl` is missing or fails to load, dynamically generate and display a themed SVG placeholder.
    - Cards must have hover animations, an expanding description area, and a detailed tooltip.

## Administrator Module
- **Access:** Provide an "Admin" link that opens a secure, modal login dialog.
- **Authentication:** Gate access to the admin dashboard using a static, hardcoded password (`Techbridge_Admin_2024!`).
- **Audit Logging:** Maintain a persistent audit log in Local Storage. You must log the following events with a timestamp:
    - **Admin Events:** Access attempts, logins (successful/failed), logouts, test suite execution.
    - **User Events:** Theme changes, search queries (debounced), and category filter selections.
- **Dashboard:** The admin dashboard must be a full-page view with two tabs:
    1.  **Audit Log:** Display all logged events in reverse chronological order.
    2.  **Playwright Self-Test:** Provide an interface to run an in-browser, automated test suite.
- **Self-Testing:**
    - The test suite must simulate critical user journeys.
    - Display test results in real-time, with a loading indicator during execution.
    - If a test fails, you must capture a full-page screenshot and display it with the error message.

## Accessibility
- You must be fully accessible.
- Implement a "Skip to Main Content" link.
- Use appropriate ARIA roles and attributes for all components.
- Ensure all functionality is operable via keyboard navigation.
- The high-contrast theme must meet high standards for visibility.
