# TechBridge University College - Deployment Guide

## Overview
This guide outlines the process for deploying the Retrospective Archive application. The application is a React 19.2.4 Single Page Application (SPA) built with Vite and styled with Tailwind CSS 4.0.

## Prerequisites
- Node.js (v18 or higher)
- `pnpm` or `npm` package manager
- Docker (optional, for containerized deployment)

## Local Development
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Production Build
To create an optimized production build:
```bash
npm run build
```
This will generate static files in the `/dist` directory. These files can be served by any static file server (Nginx, Apache, Vercel, Netlify, etc.).

## Docker Deployment
The application can be containerized using Docker.

### 1. Build the Image
```bash
docker build -t techbridge-archive -f Dockerfile.vite .
```

### 2. Run the Container
```bash
docker run -p 3000:3000 techbridge-archive
```

## Environment Variables
Currently, the application relies on hardcoded configuration for the prototype phase. For production, ensure the following variables are set if integrating with a real backend:
- `VITE_API_URL`: The URL of the backend API.
- `VITE_ADMIN_PASSWORD`: The password required for the Admin portal (replaces the hardcoded `admin123`).

## Accessibility & Compliance
Ensure that any deployment environment maintains the strict ARIA and accessibility standards implemented in Phase 2. The application must be served over HTTPS to ensure secure authentication in the Admin portal.
