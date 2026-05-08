# Deployment Guide
## AI Agent Masterclass Portal

### Architecture Overview
This application is a **Full-Stack Single Page Application (SPA)**. It relies on a Node.js/Express backend server for routing and proxying API requests.
1.  **Node.js**: For running the Express server.
2.  **Vite**: For bundling the frontend.
3.  **CDN**: `aistudiocdn.com` for React 19.2.5 and libraries.
4.  **External APIs**: `aucdt.edu.gh` for email services.

### Prerequisites
- Node.js (v20+ recommended)
- SSL Certificate (HTTPS recommended, though not strictly required for local dev).

### Installation Steps

1.  **Get the Files**:
    Ensure you have the full project structure.

2.  **Setup**:
    ```bash
    npm install
    ```

3.  **Deploy/Run**:
    - Build for production: `npm run build`
    - Start the server: `npm run start` (ensuring `server.ts` handles serving `dist/` and proxying APIs)
    - **Important**: Ensure port 3000 is open.

### Verification
1.  Open the URL in a browser.
2.  Verify the background animation loads.
3.  Go to `#/admin` and log in.
4.  Run the "Connectivity Test" in the Test Suite.

### Requirements Checklist
- [x] **React Version**: 19.2.5 (Verified via ImportMap)
- [x] **Browser Support**: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+
