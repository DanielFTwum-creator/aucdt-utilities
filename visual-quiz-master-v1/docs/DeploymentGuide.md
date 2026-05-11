# Visual Quiz Master - Deployment Guide

Visual Quiz Master is a fully client-side application built with React and requires no backend server. This makes deployment straightforward and cost-effective.

### Deployment Method

You can deploy the application on any hosting service that supports static files (HTML, JS, CSS).

#### Files for Deployment
The core of the application consists of the following files:
- `index.html` (The entry point)
- `index.tsx`
- `App.tsx`
- `constants.ts`
- `types.ts`
- `metadata.json`

The `docs/` directory contains documentation and is not required for the application to function.

#### Recommended Platforms

1.  **Vercel / Netlify**
    - Connect your Git repository (e.g., GitHub, GitLab).
    - Configure the project as a static site. No special build command or framework preset is necessary.
    - Set the publish directory to the root of your project.
    - Deploy. These platforms will automatically serve `index.html` at your project's URL.

2.  **GitHub Pages**
    - Push the application files to a GitHub repository.
    - In the repository's settings, navigate to the "Pages" section.
    - Select the branch and folder to deploy from (e.g., `main` branch, `/` (root) folder).
    - Save your changes. GitHub will deploy your site and provide the URL.

3.  **Other Static Hosts (e.g., Cloudflare Pages, AWS S3)**
    - Follow the provider's instructions for uploading static files.
    - Ensure you upload all the necessary application files.
    - Configure `index.html` as the main entry point for your site.

### Dependencies
The application relies on several external JavaScript libraries that are loaded from a Content Delivery Network (CDN). No local installation (e.g., `npm install`) is required. The dependencies are already linked in the `<head>` of `index.html`.