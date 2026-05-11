# myVBCI Camper App - Deployment Guide

**Version: 1.0**

---

## 1. Overview

The myVBCI Camper App is a static, frontend-only web application built with React and TypeScript. It does not require a backend server or database, as it uses mock data managed within the application's state.

This guide outlines the steps to deploy the application to a production environment.

## 2. Prerequisites

There are no strict build-time prerequisites as the application is designed to run directly from its source files in a modern development environment. For a traditional deployment, you would typically need:

-   **Node.js and npm:** To run a build process (if one were configured).
-   **A static web server:** Such as Nginx, Apache, or a cloud-based hosting service.

## 3. Configuration

The application requires one essential environment variable for the AI Assistant feature to function.

### Gemini API Key

The application is configured to read the Gemini API key from `process.env.API_KEY`. In a real-world scenario, you would configure this in your hosting environment.

-   **For services like Vercel or Netlify:** Add an environment variable named `API_KEY` in the project settings.
-   **For Nginx/Apache:** You would typically build the app with the key injected at build time, using a `.env` file and a build script.

Since this project has no build step, the API key is expected to be present in the execution environment where the JavaScript code runs.

## 4. Build Process

This application is set up to run without a traditional build step. The `index.html` file uses an `importmap` to load ES modules directly from a CDN.

In a standard production workflow, you would run a build command:

```bash
# This is a hypothetical command, as no build script is configured
npm install
npm run build
```

This command would typically create a `build` or `dist` directory containing optimized, static HTML, CSS, and JavaScript files.

## 5. Deployment

Deployment involves serving the application's static files.

### Method 1: Using a Static Hosting Service (Recommended)

Services like **Vercel**, **Netlify**, or **GitHub Pages** are ideal for this type of application.

1.  Connect your Git repository (GitHub, GitLab, etc.) to the hosting service.
2.  Configure the project settings. Since there is no build command, you may need to specify that none is required.
3.  Set the publish directory to the root of the project.
4.  Add the `API_KEY` environment variable as described in the Configuration section.
5.  The service will automatically deploy the application.

### Method 2: Using a Traditional Web Server (e.g., Nginx)

1.  Copy all the project files (`index.html`, `index.tsx`, `App.tsx`, etc.) to a directory on your server (e.g., `/var/www/myvbci-app`).
2.  Configure Nginx to serve files from this directory. A sample configuration block might look like this:

```nginx
server {
    listen 80;
    server_name myapp.yourdomain.com;

    root /var/www/myvbci-app;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    # You might need to add headers to handle module scripts correctly
    # depending on your setup.
}
```
3. Reload Nginx. The application will now be live.

**Note:** For this specific project setup, ensure your web server is configured to correctly serve files with `.tsx` extensions or that you have a mechanism to transpile them on the fly, which is uncommon for production. The simplest approach is to serve the provided source files directly.
