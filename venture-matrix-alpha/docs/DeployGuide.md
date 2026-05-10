# Deployment Guide - Venture Matrix Alpha

## Build Pipeline
1. `npm run build`: Compiles the React 19.2.4 code into static assets in `/dist`.
2. `npm run start`: Starts the production server (for full-stack builds).

## Environment Variables
Ensure `GEMINI_API_KEY` is set in the runtime environment for brief generation functions.

## Port Configuration
The application binds to port `3000` as per infrastructure requirements.
