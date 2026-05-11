# Deployment Guide
### Interactive Product Development Workbook

**Version:** 1.0

---

## 1. Overview

This guide provides step-by-step instructions for building and deploying the Interactive Product Development Workbook. As a fully client-side React application, it can be deployed to any modern static web hosting service.

## 2. Prerequisites

-   **Node.js and npm:** A modern version of Node.js (v18.x or later) and npm must be installed.
-   **Git:** A version control system to manage the source code.
-   **Google Gemini API Key:** A valid API key is required for the AI-powered features to function. You can obtain one from Google AI Studio.
-   **Static Hosting Provider Account:** An account with a provider like Vercel, Netlify, GitHub Pages, or AWS S3.

## 3. Configuration

### Step 3.1: Set Up Environment Variables

The application requires your Google Gemini API key to be available as an environment variable.

1.  In the root directory of the project, create a file named `.env.local`.
2.  Add the following line to the file, replacing `YOUR_GEMINI_API_KEY` with your actual key:

    ```
    REACT_APP_API_KEY=YOUR_GEMINI_API_KEY
    ```

    *Note: The `REACT_APP_` prefix is a convention for Create React App and other frameworks to expose the variable to the client-side code. If you are using a different build tool like Vite, the variable name might be `VITE_API_KEY`.*

**Security Warning:** Do not commit the `.env.local` file to your Git repository. Add it to your `.gitignore` file to prevent your API key from being exposed.

## 4. Building the Application

The project needs to be "built" to compile the React/TypeScript code and assets into optimized static HTML, CSS, and JavaScript files that can be served by a web server.

1.  **Install Dependencies:** Open a terminal in the project's root directory and run:
    ```bash
    npm install
    ```

2.  **Run the Build Process:** Execute the build command:
    ```bash
    npm run build
    ```
    *(This assumes a standard React project setup. If your `package.json` uses a different command, use that instead.)*

3.  **Verify Output:** Upon successful completion, a `build` (or `dist`) directory will be created in your project root. This directory contains all the static files needed for deployment.

## 5. Deployment

Deploy the contents of the `build` (or `dist`) directory to your chosen hosting provider.

### Example: Deploying with Vercel or Netlify (Recommended)

Vercel and Netlify offer a seamless deployment experience by connecting directly to your Git repository (e.g., on GitHub, GitLab).

1.  **Push to Git:** Make sure your project is pushed to a Git repository.

2.  **Create a New Project:**
    -   Log in to your Vercel or Netlify account.
    -   Create a new project/site and import your Git repository.

3.  **Configure Build Settings:**
    -   **Build Command:** `npm run build`
    -   **Output Directory:** `build` (or `dist`)
    -   **Install Command:** `npm install`

4.  **Add Environment Variable:**
    -   Navigate to your project's settings page.
    -   Go to the "Environment Variables" section.
    -   Add a new variable with the name `REACT_APP_API_KEY` (or `VITE_API_KEY`) and paste your Gemini API key as the value.

5.  **Deploy:**
    -   Trigger a new deployment. Vercel/Netlify will automatically pull your code, build the project using the settings you provided, and deploy the resulting static files to their global CDN.
    -   Future pushes to your main branch will automatically trigger new deployments.

### Example: Manual Deployment (e.g., AWS S3)

1.  Navigate to your cloud provider's console (e.g., AWS S3).
2.  Create a new bucket and configure it for static website hosting.
3.  Manually upload all the files and folders from your local `build` (or `dist`) directory into the bucket.
4.  Ensure public read access is correctly configured for the files.

After deployment, your application will be live and accessible at the URL provided by your hosting service.