# Deployment Guide

## Build
Run the build command to generate static assets:
```bash
npm run build
```
This will create a `dist/` directory.

## Hosting
This application is a static Single Page Application (SPA). It can be hosted on:
- **Netlify**: Drag and drop the `dist` folder.
- **Vercel**: Connect Git repository.
- **AWS S3**: Upload `dist` contents to a public bucket.

## Environment Variables
Currently, no environment variables are required for the base version.
