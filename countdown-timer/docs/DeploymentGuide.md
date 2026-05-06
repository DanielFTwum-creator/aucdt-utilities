# Deployment Guide

## 1. Introduction
This guide provides instructions for deploying the Countdown Timer application.

## 2. Prerequisites
- Node.js (v22.14.0 or later recommended)
- npm (v10.9.2 or later recommended)

## 3. Installation
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using npm:
   ```bash
   npm install
   ```

## 4. Configuration
1. Ensure the `package.json` file specifies React version 19.2.4.
2. Verify the `vite.config.ts` file is configured for a React SPA.
3. Ensure the `server.ts` file is configured to serve the built assets in production.

## 5. Build Process
1. Build the application for production:
   ```bash
   npm run build
   ```
2. The build process will generate static assets in the `dist` directory.

## 6. Deployment
1. The application is designed to be deployed as a full-stack application using Express and Vite.
2. Ensure the production environment has Node.js installed.
3. Set the `NODE_ENV` environment variable to `production`.
4. Start the server:
   ```bash
   npm start
   ```
   (Note: The `start` script should be defined in `package.json` as `node server.ts` or similar, depending on the hosting environment's requirements. For AI Studio, the `dev` script `tsx server.ts` is used during development.)

## 7. Post-Deployment Verification
1. Navigate to the application's URL.
2. Verify the countdown timer is displayed correctly.
3. Navigate to the `/admin` route and verify the login page is accessible.
4. Log in using the password `admin123`.
5. Verify the Admin Dashboard, including theme settings, diagnostics, audit logs, and the Playwright Self-Test tab, are fully functional.
6. Run the Playwright Self-Test suite to ensure the application is functioning as expected in the production environment.
