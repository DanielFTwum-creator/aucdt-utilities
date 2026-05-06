# AUCDT SendMail API Tester - Deployment Guide

This application is a static client-side application built with React. It can be deployed to any static site hosting service.

## Prerequisites

-   [Node.js](https://nodejs.org/) (LTS version recommended)
-   A package manager like `npm` or `yarn`

## Build Process

1.  **Install Dependencies:**
    Navigate to the project's root directory in your terminal and run the following command to install the required packages:
    ```bash
    npm install
    ```

2.  **Build for Production:**
    Run the build script to compile the React application and bundle it for production. This will create an optimized set of static files in a `dist` (or `build`) directory.
    ```bash
    npm run build
    ```

3.  **Verify the Output:**
    After the build is complete, you will find the following files in the `dist` folder:
    -   `index.html`
    -   Static assets (JavaScript, CSS, etc.) in an `assets` subdirectory.

## Deployment

The contents of the `dist` folder are all you need to deploy. You can host these files on any service that supports static sites.

### Example: Deploying to Netlify

1.  **Drag and Drop:**
    -   Go to your [Netlify dashboard](https://app.netlify.com/).
    -   Drag the `dist` folder from your local machine onto the Netlify drop zone.
    -   Netlify will automatically deploy the site and provide you with a URL.

2.  **Git-based Deployment (Recommended):**
    -   Push your project code to a Git repository (GitHub, GitLab, etc.).
    -   In Netlify, click "New site from Git".
    -   Connect your Git provider and select the repository.
    -   Configure the build settings:
        -   **Build command:** `npm run build`
        -   **Publish directory:** `dist`
    -   Click "Deploy site". Netlify will now automatically build and deploy your site whenever you push changes to your repository.

### Example: Deploying to Vercel

The process is very similar to Netlify.
1.  Connect your Git repository.
2.  Vercel will automatically detect that it's a React project.
3.  It will use the standard `npm run build` command and deploy the contents of the `dist` directory.

### Example: Deploying to a Traditional Web Server (Apache, Nginx)

1.  Upload the contents of the `dist` folder to the public directory of your web server (e.g., `/var/www/html`, `public_html`).
2.  Ensure your server is configured to serve `index.html` for requests to the root directory.
3.  If you are using client-side routing (not applicable for this simple app, but good to know), you may need to configure URL rewriting to direct all requests to `index.html`.

That's it! Your API tester is now live.
