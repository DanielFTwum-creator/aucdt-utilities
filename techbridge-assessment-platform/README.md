# AUCDT Skills Evaluation System - Development Guide

This guide provides instructions for setting up, running, developing, and deploying the AUCDT Skills Evaluation System.

## Table of Contents

1.  [Development Environment Setup](#1-development-environment-setup)
2.  [pnpm Installation & Configuration](#2-pnpm-installation--configuration)
3.  [Project Setup & Development](#3-project-setup--development)
4.  [End-to-End Testing with Playwright](#4-end-to-end-testing-with-playwright)
5.  [Development Tools & IDE Setup](#5-development-tools--ide-setup)
6.  [Local Testing & Debugging](#6-local-testing--debugging)
7.  [Git Workflow & Version Control](#7-git-workflow--version-control)
8.  [Build & Testing Scripts](#8-build--testing-scripts)
9.  [Cross-Platform Compatibility](#9-cross-platform-compatibility)
10. [Performance Optimization](#10-performance-optimization)
11. [Deployment Preparation](#11-deployment-preparation)

---

### 1. Development Environment Setup

To get started, you'll need to install the following tools on your machine:

*   **Node.js (LTS):** The application's tooling relies on the Node.js runtime. We recommend using the latest Long-Term Support (LTS) version.
    *   **Recommendation:** Use a version manager like [nvm](https://github.com/nvm-sh/nvm) (for macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows) (for Windows) to easily switch between Node.js versions.
*   **pnpm:** This project uses `pnpm` as its primary package manager for its performance and disk space efficiency.
*   **Git:** Essential for version control. Download and install Git from the [official website](https://git-scm.com/downloads).
*   **Code Editor:** A modern code editor is crucial for a good development experience.
    *   **Recommendation:** [Visual Studio Code (VS Code)](https://code.visualstudio.com/) is highly recommended due to its excellent JavaScript/TypeScript support and extensive extension ecosystem.
*   **Web Browser:** A modern web browser for running and debugging the application.
    *   **Recommendation:** Google Chrome or Mozilla Firefox, along with their respective developer tools.

### 2. pnpm Installation & Configuration

This project uses `pnpm` to manage dependencies. `pnpm` is a fast, disk-space-efficient package manager that creates a non-flat `node_modules` directory, preventing issues with phantom dependencies.

1.  **Installation:** Once Node.js is installed, open your terminal and run the following command to install `pnpm` globally:
    ```bash
    npm install -g pnpm
    ```
2.  **Verification:** Verify the installation by checking the version:
    ```bash
    pnpm --version
    ```
3.  **Configuration:** The project does not require any special `pnpm` configuration. All required settings are handled by the default `pnpm` setup.

### 3. Project Setup & Development

Follow these steps to get the application running on your local machine.

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install Dependencies:**
    Use `pnpm` to install all project and development dependencies.
    ```bash
    pnpm install
    ```

3.  **Set Up Environment Variables:**
    The application uses the Google Gemini API for generating feedback and requires an API key.
    *   The execution environment is expected to make this key available as `process.env.API_KEY`. In a browser-only context without a build step, `process.env` is not directly available.
    *   For local development, you will need to use a local server that can simulate this environment. A simple approach is to use a tool that can serve static files and inject environment variables.

4.  **Run the Local Development Server:**
    The project consists of static files and does not have a built-in development server. You must serve the files using a simple HTTP server to avoid browser security restrictions (`CORS` errors).
    *   We recommend using the `http-server` package.
    *   Run the following command from the project's root directory:
        ```bash
        npx http-server .
        ```
    *   Open your browser and navigate to the local address provided by the server (e.g., `http://127.0.0.1:8080`).

### 4. End-to-End Testing with Playwright

The project includes an end-to-end (E2E) test suite using **Jest** and **Playwright**. These tests simulate real user interactions in a Chromium browser to verify the application's core functionality from start to finish.

*   **Purpose:** The test suite validates the student assessment flow and the admin login process.
*   **Installation:** The test dependencies are listed under `devDependencies` in `package.json`. Install them by running:
    ```bash
    pnpm install
    ```
*   **Running Tests:** To execute the E2E test suite, run the following command from the project root:
    ```bash
    pnpm test
    ```
    This command will start a temporary web server, launch a headless browser, run the tests defined in `tests/e2e.test.js`, and output the results to your terminal.

### 5. Development Tools & IDE Setup

Using **VS Code** is highly recommended. Enhance your development experience by installing these extensions:

*   **ESLint:** Integrates ESLint into VS Code to highlight problems and help you fix them.
*   **Prettier - Code formatter:** Enforces a consistent code style across the entire codebase.
*   **Tailwind CSS IntelliSense:** Provides autocompletion, syntax highlighting, and linting for Tailwind CSS classes.
*   **GitLens:** Supercharges the Git capabilities built into VS Code, helping you visualize code authorship and history.

### 6. Local Testing & Debugging

*   **Browser Developer Tools:** Use your browser's built-in DevTools (`F12`) for debugging. The **Console** tab is useful for viewing log output, the **Network** tab for inspecting API calls, and the **Elements** tab for examining the DOM.
*   **React Developer Tools:** Install the [React Developer Tools extension](https://react.dev/learn/react-developer-tools) for your browser. It allows you to inspect the React component hierarchy, view component props and state, and profile performance.
*   **Local Storage Inspection:** The application state (e.g., in-progress assessments, audit logs) is persisted in Local Storage. Use the **Application** tab in your browser's DevTools to view and clear this data during testing.

### 7. Git Workflow & Version Control

We recommend a simple, effective branching strategy to keep the codebase clean and manageable.

*   **Branching Strategy:** Use a feature-branch workflow.
    1.  Create a new branch from `main` for every new feature or bug fix (e.g., `feat/add-new-programme` or `fix/results-page-bug`).
    2.  Commit your changes to this branch.
    3.  Push the branch and open a Pull Request (PR) to merge it back into `main`.
    4.  Require at least one code review before merging a PR.
*   **Commit Messages:** Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This creates an explicit and easily readable commit history.
    *   Example: `feat: add AI feedback generation on results page`
    *   Example: `fix: correct logo aspect ratio in header`

### 8. Build & Testing Scripts

The project is currently configured to run directly in the browser via ES modules and an `importmap`, so it **does not have a build process** (e.g., Webpack, Vite) or a unit testing suite. The primary testing mechanism is the E2E suite described above.

**Future Recommendations:**
*   **Unit/Integration Testing:** Introduce a testing framework like [Vitest](https://vitest.dev/) or [Jest](https://jestjs.io/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for component-level tests.
*   **Build Tool:** Integrate a build tool like [Vite](https://vitejs.dev/) to enable features like Hot Module Replacement (HMR) for a better development experience, and to bundle and optimize the application for production.

### 9. Cross-Platform Compatibility

*   **Browsers:** The application is built with modern web technologies and is intended for use on the latest versions of major browsers like Chrome, Firefox, Safari, and Edge. Internet Explorer 11 is not supported.
*   **Responsiveness:** The UI is built with Tailwind CSS and is designed to be responsive. Always test your changes on various screen sizes, from mobile phones to large desktops, using the browser's device emulation tools.

### 10. Performance Optimization

*   **Memoization:** The application uses `React.useCallback` in key areas (like `AssessmentPlayer.tsx`) to prevent unnecessary re-renders. Continue to apply memoization techniques (`useCallback`, `useMemo`, `React.memo`) where appropriate.
*   **Code Splitting:** If the application grows, consider implementing code splitting with `React.lazy()` and `Suspense`. This can be integrated once a build tool like Vite is added to the project, allowing different views (e.g., Admin Panel) to be loaded on demand.
*   **Image Optimization:** Ensure all new image assets are compressed and served in modern formats like WebP where possible.

### 11. Deployment Preparation

The application is a set of static files and can be deployed to any modern static hosting platform.

*   **Hosting Providers:** Platforms like Vercel, Netlify, or Cloudflare Pages are excellent choices.
*   **Environment Variables:** The biggest deployment consideration is the `API_KEY`. Your chosen hosting provider **must** support a mechanism to securely set server-side environment variables and make them available to the application. A simple static file server will not work. You will need a platform that can run functions at the edge or serverlessly to inject the key at runtime, fulfilling the project's security requirements.
*   **Pre-Deployment Checklist:**
    1.  Ensure all code is formatted (`Prettier`) and linted (`ESLint`).
    2.  Remove any temporary code or `console.log` statements.
    3.  Verify that all features work as expected in a production-like environment.
    4.  Confirm the Git `main` branch is up-to-date.