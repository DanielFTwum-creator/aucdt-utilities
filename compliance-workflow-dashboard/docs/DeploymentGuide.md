# Deployment Guide
## for the Compliance Workflow Dashboard

### Version 1.0

---

### 1. Overview

The Compliance Workflow Dashboard is a static, client-side single-page application (SPA). It is built with React and TypeScript and does not have a backend server component. This architecture makes deployment straightforward.

The goal of deployment is to serve the `index.html` file and its associated static assets (like the `index.tsx` module) from a web server or a static hosting service.

### 2. Prerequisites

-   A web server (e.g., Nginx, Apache) or a static hosting provider (e.g., Vercel, Netlify, GitHub Pages, AWS S3, Google Cloud Storage).
-   The complete source code of the application.

### 3. Deployment Steps

Since this project has no build step (it uses ES modules and an import map to load dependencies directly from a CDN), deployment is as simple as copying the files to a web-accessible directory.

#### Method 1: Using a Simple Web Server (e.g., Nginx)

1.  **Copy Files:**
    -   Copy all the project files (`index.html`, `index.tsx`, `App.tsx`, `constants.ts`, etc., and the `components`, `docs`, `hooks` directories) to a directory on your server that Nginx is configured to serve. For example, `/var/www/html/compliance-dashboard`.

2.  **Configure Nginx (Example):**
    -   Create a new Nginx server block configuration for your site.

    ```nginx
    server {
        listen 80;
        server_name your-dashboard-domain.com;

        root /var/www/html/compliance-dashboard;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        # Ensure correct MIME type for .tsx files if needed, though modern setups
        # often rely on the module script type in the HTML.
        # It's better that the file is served as application/javascript.
        location ~ \.tsx$ {
            types { application/javascript tsx; }
        }
    }
    ```

3.  **Restart Nginx:**
    -   Reload or restart your Nginx server to apply the changes.
    -   `sudo systemctl restart nginx`

#### Method 2: Using a Static Hosting Provider (e.g., Vercel, Netlify)

Static hosting providers are often the easiest way to deploy this type of application.

1.  **Connect to a Git Repository:**
    -   Push the entire project codebase to a Git repository (e.g., on GitHub, GitLab, Bitbucket).
2.  **Create a New Project on the Provider:**
    -   Log in to your Vercel or Netlify account.
    -   Create a new project/site and link it to your Git repository.
3.  **Configure Build Settings:**
    -   Since there is **no build step**, you must configure the provider accordingly.
    -   **Build Command:** Leave this field **blank**.
    -   **Output Directory / Publish Directory:** Set this to the **root directory** of your project, or specify the directory where your `index.html` is located if it's not in the root. Most providers will auto-detect this.
4.  **Deploy:**
    -   Trigger the deployment. The provider will clone your repository and serve the files directly.

### 4. Post-Deployment

-   **Verify:** Open the URL provided by your hosting service or your configured domain name in a web browser. The Compliance Workflow Dashboard should load and be fully functional.
-   **HTTPS:** It is highly recommended to serve the application over HTTPS. Most modern static hosting providers enable this by default. If using your own server, configure SSL/TLS using a service like Let's Encrypt.
