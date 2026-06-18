# PlayGrow — Deployment Guide

This guide outlines the steps to build and deploy the PlayGrow static web application to a production environment. PlayGrow is a fully client-side SPA — all 21 games across 7 learning zones run entirely in the browser with no backend, database, or API key required for gameplay. See [DEPLOYMENT.md](DEPLOYMENT.md) for the canonical Docker-based deployment instructions used in the TUC production environment.

---

## 1. Prerequisites

Before you begin, ensure you have the following installed on your local machine:
-   [Node.js](https://nodejs.org/) (which includes npm)
-   [Git](https://git-scm.com/)

## 2. Build Process

The application must be compiled from its source files (React, TypeScript) into a set of static HTML, CSS, and JavaScript files that a browser can understand.

1.  **Clone the Repository (if applicable):**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install Dependencies:**
    Open a terminal in the project's root directory and run the following command to install the necessary packages:
    ```bash
    npm install
    ```

3.  **Create a Production Build:**
    Run the build command to compile and optimize the application for production.
    ```bash
    npm run build
    ```
    This command will create a `dist` (or `build`) directory in your project root. This directory contains all the static files needed for deployment.

_Note: The environment provided does not have a standard build toolchain configured. These commands represent a typical workflow for a standard React/Vite/Create-React-App project._

## 3. Deployment to a Static Host

The contents of the `dist` (or `build`) directory can be deployed to any web server or static hosting service. Services that offer a free tier are an excellent choice for this type of application.

### Recommended Providers:

-   **Vercel:** Offers seamless deployment directly from a Git repository.
-   **Netlify:** Known for its simple drag-and-drop deployment and Git integration.
-   **GitHub Pages:** A free hosting solution integrated directly into your GitHub repository.

### General Deployment Steps:

1.  **Sign up** for an account with your chosen hosting provider (e.g., Netlify).
2.  **Connect Your Git Repository (Recommended):** Most providers can link to your GitHub, GitLab, or Bitbucket account. This enables Continuous Deployment, where any push to your main branch automatically triggers a new build and deployment.
3.  **Manual Deployment (Drag-and-Drop):** Alternatively, you can drag the entire `dist` folder from your local machine directly into the provider's web UI to deploy it.
4.  **Configure Settings (if needed):**
    -   **Build Command:** `npm run build`
    -   **Publish Directory:** `dist` or `build`
5.  **Deploy:** The hosting service will build your project and deploy it to a unique URL.

Once deployed, the application will be live and accessible to users worldwide.
