# ClipAI - Deployment Guide

This document provides instructions for deploying the ClipAI application. As a client-side single-page application (SPA), deployment is straightforward.

## 1. Prerequisites

-   A static file hosting service (e.g., Vercel, Netlify, AWS S3, GitHub Pages).
-   Ability to set environment variables on the hosting platform.

## 2. Environment Variables

ClipAI requires one critical environment variable to be set for the AI-powered features to function correctly.

-   **`API_KEY`**: Your Google Gemini API Key.

### How to Set the Variable:

-   In your hosting provider's dashboard (e.g., Vercel, Netlify), navigate to the project's settings.
-   Find the "Environment Variables" section.
-   Create a new variable with the name `API_KEY` and paste your Gemini API key as the value.

**IMPORTANT:** The application code is designed to read this key from `process.env.API_KEY`. The build environment must substitute this variable at build time or have it available in the runtime environment where the static files are served.

## 3. Deployment Steps

1.  **Clone the Repository:**
    ```bash
    git clone <repository_url>
    cd clipai-project
    ```

2.  **Build the Project:**
    The project is set up to be built automatically by most modern hosting platforms. If you need to build it manually, you would typically run:
    ```bash
    npm install
    npm run build
    ```
    This will create a `dist` or `build` directory containing the static `index.html`, `index.tsx` (transpiled to JS), and other assets.

3.  **Configure Your Hosting Provider:**
    -   Connect your Git repository to your chosen hosting provider (Vercel, Netlify, etc.).
    -   Configure the build command (e.g., `npm run build`) and the publish directory (e.g., `dist`).
    -   **Crucially, set the `API_KEY` environment variable as described in Section 2.**

4.  **Deploy:**
    -   Trigger a new deployment. Most platforms will automatically deploy when you push to your main branch.
    -   Once the deployment is complete, the application will be live at the URL provided by your host.

## 4. Verification

-   Open the deployed application URL in your browser.
-   Verify that all core functionalities work (image upload, shape selection, etc.).
-   Test the AI Shape Generation feature. If it fails with an API key error, double-check that your environment variable is set correctly and the project has been redeployed with the new variable.