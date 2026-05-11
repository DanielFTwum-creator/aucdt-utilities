# Pama Realtor - Deployment Guide

This guide details the steps to deploy the Pama Realtor application to a production environment.

---

## 1. Architecture Overview
Pama Realtor is built as a **No-Build** React application using ES Modules.
- **Dependencies:** Loaded via `esm.sh` CDN (React, Tailwind, Lucide).
- **Compilation:** Handled in-browser by the ES Module specification.
- **Hosting Requirements:** Any static file server.

## 2. Prerequisites
- A GitHub/GitLab repository containing the project files.
- An account with a static hosting provider (Netlify, Vercel, GitHub Pages, or Cloudflare Pages).
- A valid **Google Gemini API Key**.

## 3. Deployment Steps (Netlify Example)

### Step 1: Push to Git
Ensure your project root contains:
- `index.html`
- `index.tsx`
- `App.tsx`
- `/components` folder
- `/docs` folder

### Step 2: Create New Site
1. Log in to Netlify.
2. Click **"Add new site"** > **"Import an existing project"**.
3. Select your Git provider and repository.

### Step 3: Configure Build Settings
Since this is a no-build project, leave the build settings **empty**.
- **Build Command:** `(leave blank)`
- **Publish Directory:** `/` (or `.` depending on provider)

### Step 4: Environment Variables (CRITICAL)
You must inject the API key for the AI Assistant to work.
1. Go to **Site Settings** > **Environment Variables**.
2. Add a new variable:
   - **Key:** `API_KEY`
   - **Value:** `your_actual_google_gemini_api_key_here`
3. *Note:* In the browser, we access this via `process.env.API_KEY`. Some static providers might need a build plugin to inject this into the HTML, or you may need to use a client-side shim if the provider doesn't support runtime env injection for static files.
   - *Workaround:* For strictly static hosting without a build step, you might need to manually insert the key or use a proxy.

### Step 5: Deploy
Click **Deploy Site**. Your application will be live at `https://your-site-name.netlify.app`.

## 4. Troubleshooting
- **"Failed to load app":** Check the Browser Console. Ensure `esm.sh` is reachable and not blocked by corporate firewalls.
- **AI Not Responding:** Check if `API_KEY` is correctly loaded. Open the "Self-Diagnostic Suite" (Admin > Testing) to verify.
