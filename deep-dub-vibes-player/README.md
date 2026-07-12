# Deep Dub Vibes Player

An interactive reggae and dub music player for Techbridge University College, with a
spinning vinyl centrepiece, an interactive waveform, and a live frequency analyser.

Live at: **https://ai-tools.techbridge.edu.gh/deep-dub-vibes-player/**

## Stack

- React 19 + Vite 8 + TypeScript, Tailwind CSS 4
- Express 5 (`server.js`) — handles the Google OAuth token exchange and serves the
  built SPA in production
- Sign-in: bespoke Google OAuth 2.0 (not WMS SSO)

## Run locally

```powershell
cd C:\Development\github\aucdt-utilities\deep-dub-vibes-player
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local` and set `VITE_GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`, and `VITE_GOOGLE_REDIRECT_URI` — the server exits at boot if
the OAuth vars are missing.

## Deploy

```powershell
cd C:\Development\github\aucdt-utilities\deep-dub-vibes-player
.\deploy.ps1 -Build
```

Pulls from the `aucdt-utilities` monorepo, builds with Vite, and (re)starts the
`deep-dub-vibes-player` PM2 process on port 3023. See `CONSTRAINTS.md` for the full
environment spec, known issues, and pre-delivery gate.
