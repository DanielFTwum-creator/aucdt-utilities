# Deployment and Testing Guide

This guide provides instructions for deploying and testing the Techbridge University College application.

## Deployment
The application is deployed to Cloud Run. Ensure all environment variables are correctly set in the production environment.

## Testing
The application includes an E2E test suite using Playwright.
To run the tests, use:
```bash
npm run test:e2e
```
The tests are located in the `/tests` directory.
