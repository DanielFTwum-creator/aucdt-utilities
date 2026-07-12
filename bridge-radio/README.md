# Bridge Radio

A public internet radio player for Techbridge University College — live HLS streams
across three genre channels (afrobeats, music, neosoul), a spinning-vinyl UI, and an
optional "find the lyrics" AI lookup.

Live at: **https://radio.techbridge.edu.gh/**

## Stack

- React 19 + Vite 6 + TypeScript, Tailwind CSS 4, hls.js for playback
- Express (run via `tsx`) as a thin backend: HLS CORS/proxy + AI lyrics relay
- No login — the player is open to anyone

## How it works

- The player streams static HLS (`master.m3u8` per genre) served from
  `ai.techbridge.edu.gh`; `/api/proxy` on this app's backend works around CORS and
  rewrites relative `.m3u8` segment URLs to absolute ones.
- `/api/lyrics?track=&genre=` asks Gemini (via the central WMS relay — this app never
  holds a Gemini key) for plausible lyrics to display alongside a track.

## Run locally

```powershell
cd C:\Development\github\aucdt-utilities\bridge-radio
pnpm install
pnpm dev
```

Set `GEMINI_PROXY_KEY` in `.env.local` if you want `/api/lyrics` to return real
results locally (otherwise it responds `503`). See `.env.example`.

## Deploy

```powershell
cd C:\Development\github\aucdt-utilities\bridge-radio
.\deploy.ps1 -Build
```

Builds server-side, rsyncs `dist/`, ships `server.ts`, writes the Plesk root-vhost
nginx config (`vhost_ssl.conf`), and (re)starts the `bridge-radio` PM2 process on
port 3032. See `CONSTRAINTS.md` for the full environment spec and pre-delivery gate.
