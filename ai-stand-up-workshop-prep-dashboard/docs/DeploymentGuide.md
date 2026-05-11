# Deployment Guide
## for AI Stand-up & Workshop Prep Dashboard

### Version 1.0

---

### 1. Introduction

This guide provides step-by-step instructions for building and deploying the AI Stand-up & Workshop Prep Dashboard to a production environment.

The application is a client-side Single Page Application (SPA) built with React. This means the deployment process involves generating a set of static HTML, CSS, and JavaScript files that can be served by any modern web server or static hosting provider.

### 2. Prerequisites

Before you begin, ensure you have the following software installed on your local machine:
-   **Node.js** (LTS version recommended)
-   **npm** (comes with Node.js) or a compatible package manager like **pnpm** or **yarn**.
-   **Git** for cloning the source code repository.

### 3. Build Process

The first step is to create a production-ready build of the application. This process transpiles the TypeScript/React code, bundles all assets, and optimizes them for performance.

1.  **Clone the Repository:**
    Open your terminal, navigate to the directory where you want to store the project, and run the following command:
    ```bash
    git clone <repository_url>
    cd <project_directory>
    ```

2.  **Install Dependencies:**
    Install all the necessary project dependencies by running:
    ```bash
    npm install
    ```
    *(Use `pnpm install` or `yarn` if you prefer those package managers.)*

3.  **Create the Production Build:**
    Run the build script. (Note: A standard `build` script is assumed in `package.json`).
    ```bash
    npm run build
    ```
    This command will generate a `dist` or `build` folder in your project's root directory. This folder contains all the static files (e.g., `index.html`, bundled `.js` and `.css` files) that you will deploy.

### 4. Deployment

Once you have the production build folder, you can deploy it using any static site hosting service. Below are instructions for some popular choices. The general principle is to upload the *contents* of your `build` or `dist` directory to the hosting provider.

#### 4.1 Option A: Vercel

Vercel is a zero-configuration deployment platform that is ideal for React applications.

1.  **Sign up/Log in:** Go to [vercel.com](https://vercel.com) and create an account (you can use your GitHub account).
2.  **Import Project:** From your Vercel dashboard, click "Add New... > Project".
3.  **Connect Git Repository:** Import the Git repository containing your project.
4.  **Configure Project:** Vercel will automatically detect that it is a React project. The default settings are usually correct:
    -   **Framework Preset:** `Create React App` (or `Vite` if applicable)
    -   **Build Command:** `npm run build`
    -   **Output Directory:** `build` or `dist`
5.  **Deploy:** Click the "Deploy" button. Vercel will build and deploy your site, providing you with a live URL.

#### 4.2 Option B: Netlify

Netlify offers a similar drag-and-drop or Git-based deployment workflow.

1.  **Sign up/Log in:** Go to [netlify.com](https://netlify.com) and create an account.
2.  **Drag and Drop:**
    -   On your Netlify dashboard, find the "Sites" section.
    -   Drag the `build` or `dist` folder from your local machine and drop it into the designated area in the Netlify UI.
    -   Netlify will upload the files and provide you with a live URL.
3.  **Git-based (Recommended):**
    -   Follow the on-screen instructions to connect your Git repository.
    -   Set the build command to `npm run build` and the publish directory to `build` or `dist`.
    -   Netlify will automatically deploy your site whenever you push changes to your repository.

#### 4.3 Option C: GitHub Pages

You can host your static site for free directly from your GitHub repository.

1.  **Install `gh-pages`:**
    ```bash
    npm install --save-dev gh-pages
    ```
2.  **Update `package.json`:**
    Add a `homepage` field to your `package.json`:
    ```json
    "homepage": "https://<your-username>.github.io/<your-repo-name>"
    ```
    Add the following scripts to the `scripts` section:
    ```json
    "scripts": {
      "predeploy": "npm run build",
      "deploy": "gh-pages -d build"
    }
    ```
3.  **Deploy:**
    Run the deploy script:
    ```bash
    npm run deploy
    ```
    This will build your application and push the contents of the `build` folder to a `gh-pages` branch in your repository, which will be served as your live site.
