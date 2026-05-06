# MarkAI Deployment Guide

This guide outlines the steps required to deploy the MarkAI front-end application and its supporting back-end server.

## 1. Prerequisites

-   A static web hosting service (e.g., Vercel, Netlify, AWS S3, Firebase Hosting) for the front-end.
-   A Node.js hosting service (e.g., Vercel, Render, Heroku) for the back-end server.
-   Ability to configure environment variables on both hosting services.
-   Node.js and npm installed on your local machine for building the project and running tests.

## 2. Environment Variables

The application relies on environment variables for critical configuration. These must be set in your back-end server's deployment environment.

### 2.1 Gemini API Key (Required)

The core AI features will not function without a valid Google Gemini API key.

-   **Variable Name:** `API_KEY`
-   **Value:** Your Google Gemini API key.
-   **Note:** This key is used exclusively by the back-end server (`server.js`) to securely proxy requests to the Google API. **Never expose this key on the client-side.**

### 2.2 Admin Password (DEPRECATED)

This variable previously set the password for the protected admin dashboard.

-   **Variable Name:** `ADMIN_PASSWORD`
-   **Status:** DEPRECATED
-   **Note:** For the current client-side demo, the admin password is now hardcoded to **`admin123`** within the application's `AdminContext`. The `ADMIN_PASSWORD` environment variable is no longer used.

## 3. Deployment Steps

MarkAI is a Single Page Application (SPA) with a lightweight Node.js back-end.

### 3.1 Front-End Deployment (Static Site)

1.  **Build the Application:**
    -   A production deployment first requires a build step using a tool like Vite or Create React App (though this project is set up for direct browser execution). For a production build, you would run a command like `npm run build`.
    -   This step compiles the TypeScript/JSX, bundles all assets, and optimizes the code for production. The output is typically a `dist` or `build` folder.

2.  **Update API Endpoint:**
    -   In `services/geminiService.ts`, change the `API_BASE_URL` from `http://localhost:3000/api` to the public URL of your deployed back-end server.
    -   Re-run the build step after this change.

3.  **Upload Files:**
    -   Upload the contents of the build output folder (e.g., `dist/`) to your static hosting service.

4.  **Configure Routing:**
    -   Configure your hosting service to serve `index.html` as the main entry point. Ensure that routing rules are set up to direct all paths to `index.html` to allow client-side routing to work correctly (this is a standard configuration for SPAs).

### 3.2 Back-End Deployment (Node.js Server)

1.  **Configure Environment Variables:**
    -   In your Node.js hosting provider's dashboard, set the `API_KEY` environment variable.

2.  **Deploy the Server:**
    -   Upload the `server.js`, `package.json`, and `.env.local` (if used for non-secret variables) files to your Node.js hosting service.
    -   The service will typically run `npm install` and then start the server using the `start` script defined in `package.json` (`node server.js`).
    -   Ensure your hosting service's CORS policy allows requests from your front-end's domain.

## 4. Running Tests in CI/CD

The project includes an end-to-end test suite using Puppeteer that can be integrated into a CI/CD pipeline.

1.  **Install Dependencies:**
    -   Your CI/CD environment must run `npm install` to install project dependencies, including Puppeteer.

2.  **Start Local Servers:**
    -   The CI/CD pipeline must start both the front-end development server and the back-end server before running tests.

3.  **Run E2E Tests:**
    -   Once the servers are running, execute the test script:
        ```bash
        npm run test:e2e
        ```
    -   This will launch a headless Chromium browser and perform the automated test steps. The results will be printed to the console. A non-zero exit code on failure will correctly signal a failed build in your CI/CD pipeline.