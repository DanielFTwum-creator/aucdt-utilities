# LEAP - Deployment Guide

This guide provides instructions for building and deploying the LEAP frontend prototype application. As a frontend-only Single-Page Application (SPA), deployment is straightforward.

### Prerequisites

-   Node.js and npm (or a compatible package manager) installed.
-   A valid Google Gemini API key.

### 1. Environment Variables

The application requires two environment variables to be configured. Create a `.env.local` file in the root of the project and add the following:

```
# Your Google Gemini API Key
# This is REQUIRED for the AI Curriculum Management feature to work.
API_KEY="YOUR_GEMINI_API_KEY"

# Optional: A password for the admin dashboard.
# If not set, it will default to 'admin123'.
ADMIN_PASSWORD="your_secure_password"
```

**IMPORTANT:** Never commit your `.env.local` file or expose your API key in public repositories.

### 2. Building the Application

1.  **Install Dependencies:**
    Open your terminal in the project root and run:
    ```bash
    npm install
    ```

2.  **Build for Production:**
    Run the build script:
    ```bash
    npm run build
    ```
    This command will compile the React/TypeScript code and bundle it into a `dist` (or `build`) folder. This folder contains the static HTML, CSS, and JavaScript files ready for deployment.

### 3. Deployment Options

The contents of the `dist` folder can be deployed to any static site hosting provider.

#### Option A: Simple Static Server (for testing)

You can use a simple local server to test the production build.

1.  Install `serve` globally:
    ```bash
    npm install -g serve
    ```
2.  Serve the build folder:
    ```bash
    serve -s dist
    ```
    This will start a local server, and you can access the application at the URL provided (e.g., `http://localhost:3000`).

#### Option B: Hosting Providers (Vercel, Netlify, etc.)

Providers like Vercel or Netlify make deploying static sites very easy.

1.  **Push to Git:** Push your project code to a GitHub, GitLab, or Bitbucket repository.
2.  **Connect to Provider:**
    -   Sign up for an account with your chosen provider (e.g., Vercel).
    -   Connect your Git account and import the project repository.
3.  **Configure Build Settings:**
    -   **Build Command:** `npm run build`
    -   **Output Directory:** `dist` (or `build`, depending on your setup)
4.  **Configure Environment Variables:**
    -   In the project settings on the provider's dashboard, add the `API_KEY` and `ADMIN_PASSWORD` environment variables. This is the secure way to manage secrets.
5.  **Deploy:**
    The provider will automatically build and deploy your site. Any subsequent pushes to your main branch will trigger a new deployment.
