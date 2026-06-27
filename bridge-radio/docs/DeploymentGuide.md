# Deployment Guide - Bridge Radio

## Prerequisites
- Node.js (v18+)
- npm or yarn

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
   The app will be available at `http://localhost:3000`.

## Production Build
1. Build the static assets:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm run start
   ```

## Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=production
```

## Proxy Configuration
The application uses a built-in Express proxy to handle HLS streams. Ensure the server has outbound access to `https://ai.techbridge.edu.gh`.

## Deployment to Cloud Run (Recommended)
This app is optimized for containerized environments.
1. Build the Docker image.
2. Deploy to Cloud Run on port 3000.
3. Ensure the `NODE_ENV` is set to `production`.
