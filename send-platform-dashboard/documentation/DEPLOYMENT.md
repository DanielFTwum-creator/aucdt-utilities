# Deployment Guide
**Project:** SEND Platform Admin Console  
**Framework:** React 19.2.4  

## 1. Prerequisites
*   **Node.js**: Version 18.x or higher.
*   **Package Manager**: `npm` or `yarn`.
*   **Web Server**: Nginx, Apache, or S3-compatible bucket for static hosting.

## 2. Installation
Clone the repository and install dependencies.
```bash
git clone <repository-url>
cd send-admin-console
npm install
```

## 3. Development Server
To run the application locally with Hot Module Replacement (HMR):
```bash
npm start
# Opens at http://localhost:3000
```

## 4. Production Build
The application is a Single Page Application (SPA) that compiles to static HTML/CSS/JS.

### 4.1 Build Command
```bash
npm run build
```

### 4.2 Output Directory
The build artifacts will be generated in the `dist/` (or `build/`) directory.
*   `index.html`: Entry point.
*   `assets/`: Compiled JavaScript and CSS bundles.

### 4.3 React 19.2.4 Requirement
Ensure your build environment supports React 19.
*   Verify `package.json`:
    ```json
    "dependencies": {
      "react": "^19.2.4",
      "react-dom": "^19.2.4"
    }
    ```
*   This project uses ES Modules. Ensure your serving infrastructure correctly handles `.mjs` or `.js` modules if using specific bundlers.

## 5. Hosting Configuration
### 5.1 Nginx Example
Since this is an SPA using Client-Side Routing (React Router), you must configure the server to fallback to `index.html` for 404s.

```nginx
server {
    listen 80;
    server_name admin.send-platform.com;
    root /var/www/send-admin;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 5.2 Environment Variables
Create a `.env` file in the root for build-time configuration (if applicable in future phases).
Currently, the app uses mocked services, so no backend URL configuration is required.
