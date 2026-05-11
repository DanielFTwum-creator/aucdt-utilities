# Deployment Documentation

## System Requirements
- **Browser**: Modern evergreen browsers (Chrome 110+, Edge 110+, Firefox 110+).
- **Network**: Active internet connection required for Google Gemini API integration.
- **Key**: A valid Google AI Studio API Key must be available in the environment.

## Environment Variables
Ensure the following variable is configured in your deployment platform (Vercel, Cloudflare, etc.):
`API_KEY` - Your Gemini API credentials.

## Deployment Steps
1. **Build**: Ensure all TypeScript components are compiled via Vite/ESBuild.
2. **CDN Assets**: The application relies on external fonts and icons. Ensure `cdn.tailwindcss.com` and `aistudiocdn.com` are not blocked by corporate firewalls.
3. **Model Configuration**: The app defaults to `gemini-3-flash-preview` for text and `gemini-2.5-flash-image` for images. To change these, modify the constants in `AISandbox.tsx`.

## Troubleshooting
- **API Errors**: Check the Admin Panel "System Health" section. Ensure the API Key has not reached its quota limits.
- **Image Issues**: If images fail to load, verify that the AUC DT storage URLs in `constants.ts` are still active.