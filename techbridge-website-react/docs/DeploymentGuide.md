# Deployment Guide
## AUCDT Website Replica

This guide covers the steps to build and deploy the React application to a production environment.

### Prerequisites
*   **Node.js** (v14.0.0 or higher)
*   **npm** (v6.0.0 or higher)

### 1. Local Development

To run the application locally for development or testing:

```bash
# Install dependencies
npm install

# Start the development server
npm start
```
The app will be available at `http://localhost:3000`.

### 2. Production Build

To create an optimized build for production:

```bash
npm run build
```

This command creates a `build/` directory containing:
*   `index.html`: The entry point.
*   `static/`: Minified JavaScript and CSS files with content hashing for cache control.

### 3. Deployment Options

#### Option A: Netlify (Recommended)
1.  Connect your repository to Netlify.
2.  **Build Command**: `npm run build`
3.  **Publish Directory**: `build`
4.  Netlify handles the routing configuration automatically.

#### Option B: Vercel
1.  Import your project into Vercel.
2.  Vercel will auto-detect the Create React App framework.
3.  Deploy.

#### Option C: Traditional Web Server (Apache/Nginx)
1.  Upload the contents of the `build/` folder to your server's public directory (e.g., `/var/www/html`).
2.  **Important**: Since this is a Single Page Application (SPA), you must configure your server to redirect all 404 requests to `index.html` so that React Router can handle client-side routing.

**Apache `.htaccess` example:**
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### 4. Post-Deployment Verification
After deployment:
1.  Visit the URL.
2.  Verify the Hero Slider images load correctly.
3.  Test the **Theme Switcher** to ensure CSS variables are working.
4.  Check the **Virtual Assistant** functionality.
