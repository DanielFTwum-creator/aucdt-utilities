# Testing Guide

## Puppeteer Testing Suite

The testing suite relies on Puppeteer for End-To-End (E2E) UI testing and automated screenshot captures. 

## Running Tests
Run the visual regression tests:
```bash
npm run test:e2e
```

## Accessibility (WCAG AA)
The `/admin/testing` route provides functionality to quickly audit the interactive workspace, focusing especially on semantic structure and Aria label compatibility.
