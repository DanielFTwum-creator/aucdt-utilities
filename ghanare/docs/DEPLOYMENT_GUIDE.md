# Deployment Guide: GhanaRide Platform Frontend

**Version 1.0**

## 1. Introduction

This document provides a step-by-step guide for building and deploying the GhanaRide frontend as a static web application. The process involves setting up the environment, building the production assets, and deploying them to a modern static hosting provider.

## 2. Prerequisites

Before you begin, ensure you have the following installed on your local machine or build server:

*   **Node.js**: Version 18.x or later.
*   **npm**: Version 9.x or later (comes bundled with Node.js).
*   **Git**: For cloning the source code repository.

## 3. Environment Variables

The application requires a Gemini API key for the AI-Powered Trip Suggestions feature. This key must be provided as an environment variable during the build process.

1.  Create a file named `.env` in the root of the project directory.
2.  Add your Gemini API key to this file:

    ```
    API_KEY=your_gemini_api_key_here
    ```

**IMPORTANT**: Never commit the `.env` file or your API key directly to your Git repository. Add `.env` to your `.gitignore` file. Most deployment platforms provide a secure way to manage environment variables.

## 4. Build Process

The build process will transpile the TypeScript/React code, bundle all assets, and optimize them for production.

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd ghanaride-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the production build:**
    ```bash
    npm run build
    ```

This command will create a `build` (or `dist`) directory in the project root. This directory contains all the static files (`index.html`, JavaScript, CSS) needed to run the application.

## 5. Deploying to a Static Host

The contents of the `build` directory can be deployed to any static web hosting service. Below are general steps for popular platforms.

### Example: Deploying to Vercel or Netlify

1.  Push your project code (without the `.env` file) to a GitHub, GitLab, or Bitbucket repository.
2.  Create a new project on Vercel or Netlify and link it to your repository.
3.  **Configure the build settings:**
    *   **Build Command**: `npm run build`
    *   **Publish Directory**: `build` or `dist`
4.  **Configure Environment Variables:**
    *   In the project settings on your hosting provider's dashboard, add an environment variable with the key `API_KEY` and your Gemini API key as the value.
5.  Trigger a deployment. The platform will automatically clone your repo, build the project with the environment variable, and deploy the contents of the publish directory.

### Example: Deploying to AWS S3

1.  Create an S3 bucket with a globally unique name.
2.  Enable "Static website hosting" in the bucket properties.
3.  Set the "Index document" to `index.html`.
4.  Upload the contents of your local `build` directory to the S3 bucket.
5.  Configure a bucket policy to make the content publicly readable.
6.  (Recommended) Set up an AWS CloudFront distribution in front of your S3 bucket for better performance, caching, and HTTPS.

## 6. Post-Deployment Checks

After deployment, perform the following checks to ensure the application is working correctly:

1.  Navigate to the deployment URL.
2.  Verify that the application loads without errors.
3.  Open the browser's developer console to check for any console errors.
4.  Test the vehicle search functionality.
5.  Test the "AI-Powered Trip Suggestions" feature to confirm that the Gemini API key is correctly configured and the API calls are succeeding.