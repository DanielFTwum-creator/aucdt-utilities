# Peace Vinyl

An interactive vinyl-record music player ("Peace & One Love") for Techbridge
University College, with Google sign-in.

Live at: **https://ai-tools.techbridge.edu.gh/peace-vinyl/**

## Stack

- React 19 + Vite 6 + TypeScript, Tailwind CSS 4
- Express 4 (`server.js`) — handles the Google OAuth token exchange and serves the
  built SPA in production
- Sign-in: bespoke Google OAuth 2.0 (not WMS SSO) — see `CONSTRAINTS.md` for a known
  redirect-path bug in the current OAuth flow

## Run locally

```powershell
cd C:\Development\github\aucdt-utilities\peace-vinyl
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local` and set `VITE_GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`, and `VITE_GOOGLE_REDIRECT_URI` — the server exits at boot if
the OAuth vars are missing.

## Deploy

```powershell
cd C:\Development\github\aucdt-utilities\peace-vinyl
.\deploy.ps1 -Build
```

Builds the SPA and (re)starts the `peace-vinyl` PM2 process on port 3026. See
`CONSTRAINTS.md` for the full environment spec, a known OAuth path bug, and the
pre-delivery gate.
