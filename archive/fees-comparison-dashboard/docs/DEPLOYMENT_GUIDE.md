# Deployment Guide - EduData Ghana

## 1. Prerequisites
Before deploying, ensure you have the following installed on your local development machine:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**
- A Git client

## 2. Local Development Build
To build the application locally for testing:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/ghana-fees-dashboard.git
   cd ghana-fees-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run in development mode:**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

4. **Create a production build:**
   ```bash
   npm run build
   ```
   This creates a `build` directory with optimized, minified static assets.

## 3. Production Deployment Options

### Option A: Static Hosting (Netlify/Vercel) - *Recommended*
Since this is a client-side SPA, static hosting is the most efficient method.

1. **Connect Repository:**
   - Log in to Netlify or Vercel.
   - select "Import from Git".
   - Choose your repository.

2. **Configure Build Settings:**
   - **Build Command:** `npm run build`
   - **Publish Directory:** `build`

3. **Deploy:**
   - Click "Deploy Site".
   - The platform will automatically install dependencies, build the app, and provision a CDN URL.

### Option B: Traditional Web Server (Apache/Nginx)
1. Run `npm run build` locally.
2. Upload the contents of the `build/` folder to your server's public HTML directory (e.g., `/var/www/html`).
3. **Important Configuration:**
   - Ensure your server is configured to handle client-side routing. All 404 requests should be redirected to `index.html`.
   - **Nginx Example:**
     ```nginx
     location / {
       try_files $uri $uri/ /index.html;
     }
     ```

## 4. Post-Deployment Verification
1. Access the production URL.
2. Verify that the initial load time is acceptable (< 1.5s).
3. Check the **Admin Login** functionality.
4. Verify that data visualizations render correctly on mobile devices.

## 5. Continuous Integration (Optional)
To set up CI for automated testing:
1. Configure your pipeline (GitHub Actions / GitLab CI) to run:
   ```bash
   npm install
   node tests/e2e.js
   ```
2. If the E2E tests pass, proceed with the build and deployment steps.

---
*Generated for EduData Ghana v1.1 - Phase 4*