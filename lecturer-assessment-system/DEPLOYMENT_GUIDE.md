# Deployment Guide for the Lecturer Assessment System

**Version 1.1**

---

### Introduction

This guide provides instructions on how to build and deploy the Lecturer Assessment System for a production environment. Since this is a client-side single-page application (SPA) created with React and Vite, it can be hosted on any static web hosting service.

### Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- **Node.js** (version 16.x or higher)
- **npm** (or a similar package manager like yarn)

### Step 1: Set Up Environment Variables

The application requires an API key for the Google Gemini API to power the PDF data extraction feature.

1.  In the root directory of the project, create a file named `.env.local`.
2.  Inside the `.env.local` file, add your API key, prefixed with `VITE_` as required by Vite:

    ```
    VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```

**Important:** Never commit your `.env.local` file or expose your API key in public repositories. Add `.env.local` to your `.gitignore` file.

The application code in `services/geminiService.ts` will need to be updated to read `import.meta.env.VITE_API_KEY` instead of `process.env.API_KEY`.

### Step 2: Install Dependencies

If you haven't already, open your terminal in the project's root directory and install the necessary Node.js packages:

```bash
npm install
```

### Step 3: Build the Application

Run the Vite build script to compile the React application into a set of optimized, static files (HTML, CSS, JavaScript).

```bash
npm run build
```

This command will create a `dist` folder in your project's root directory. This folder contains everything needed to run your application.

### Step 4: Deploy to a Static Host

You can deploy the contents of the `dist` folder to any static hosting provider. Here are a few popular options:

#### Option A: Netlify

Netlify is one of the easiest ways to deploy a static site.

1.  **Drag and Drop:**
    - Go to [app.netlify.com](https://app.netlify.com/).
    - Log in or sign up.
    - Drag the `dist` folder from your computer and drop it into the Netlify dashboard's deployment area.
    - Netlify will upload the files and provide you with a unique URL for your live application.

2.  **Git-based Deployment (Recommended):**
    - Push your project to a GitHub, GitLab, or Bitbucket repository.
    - On Netlify, select "New site from Git".
    - Connect your Git provider and choose your repository.
    - Set the build command to `npm run build`.
    - Set the publish directory to `dist`.
    - Configure your environment variables (like `VITE_API_KEY`) in the Netlify site settings.
    - Netlify will automatically build and deploy your site whenever you push new changes.

#### Option B: Vercel

Vercel (from the creators of Next.js) also offers excellent support for static sites.

1.  Push your project to a Git repository.
2.  Go to [vercel.com](https://vercel.com/) and sign up.
3.  Import your Git repository.
4.  Vercel will automatically detect that it's a Vite-based React project. It will use the correct build settings (`npm run build` and the `dist` directory).
5.  Add your environment variables in the project settings on Vercel.
6.  Deploy.

#### Option C: Simple Web Server (e.g., Nginx)

If you have your own server:

1.  Upload the contents of the `dist` folder to a directory on your server (e.g., `/var/www/my-app`).
2.  Configure your web server (like Nginx or Apache) to serve this directory. Since this is a single-page application, you need to configure URL rewriting to direct all requests to `index.html`.

**Example Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/my-app;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```
This configuration ensures that when a user refreshes the page on a route like `/results`, the server still serves the `index.html` file, allowing React to handle the client-side routing.