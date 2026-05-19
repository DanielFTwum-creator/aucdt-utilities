# Peace Vinyl OAuth Deployment Guide

Peace Vinyl uses Google OAuth 2.0 for user authentication. This guide covers both local development and production (Plesk) deployment.

## Quick Start

### Local Development

1. **Get Google Client Secret**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Find your "Peace Vinyl" OAuth 2.0 Client ID
   - Copy the **Client Secret**

2. **Configure `.env.local`**
   ```bash
   VITE_GOOGLE_CLIENT_ID=537671076222-q0ovngh3m2m560kdcrsn2hk0cae5rudg.apps.googleusercontent.com
   VITE_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
   GOOGLE_CLIENT_SECRET=<paste-your-secret-here>
   VITE_GEMINI_API_KEY=<REDACTED_OLD_GEMINI_KEY>
   ```

3. **Add localhost to Google Cloud Console**
   - Go to OAuth 2.0 Client credentials page
   - Under "Authorized redirect URIs", add:
     ```
     http://localhost:3000/auth/google/callback
     ```

4. **Build and start**
   ```bash
   pnpm build
   node server.js
   ```

5. **Test**
   - Open http://localhost:3000
   - Click "Sign in with Google"
   - Account selector should appear
   - Select your Google account
   - You should be logged in

## Production (Plesk) Deployment

### Prerequisites

- SSH access to Plesk server (root@66.226.72.199)
- Google Client Secret configured in `.env.local`
- Production redirect URI registered in Google Cloud Console

### Setup Google OAuth for Production

1. **Add production redirect URI**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Edit your "Peace Vinyl" OAuth 2.0 Client
   - Add to "Authorized redirect URIs":
     ```
     https://ai-tools.techbridge.edu.gh/peace/auth/google/callback
     ```

2. **Verify `.env.local` has the secret**
   ```bash
   GOOGLE_CLIENT_SECRET=<REDACTED_CLIENT_SECRET>
   ```

### Deploy

```powershell
cd peace-vinyl
.\deploy.ps1 -Build
```

This script will:
- ✅ Build the React frontend
- ✅ Deploy `dist/` (static files) to Plesk
- ✅ Deploy `server.js` (backend) to Plesk
- ✅ Install Node.js dependencies
- ✅ Start the backend server on port 3001
- ✅ Configure Apache to proxy `/api/*` to the backend
- ✅ Copy `.env.local` to `.env` on the server

### After Deployment

1. **Verify frontend**
   ```
   https://ai-tools.techbridge.edu.gh/peace
   ```

2. **Verify backend**
   - SSH to server
   - Check logs: `tail /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/server.log`
   - Should see: `OAuth server listening on http://127.0.0.1:3001`

3. **Test OAuth flow**
   - Visit https://ai-tools.techbridge.edu.gh/peace
   - Click "Sign in with Google"
   - Account selector should appear
   - Complete login

## How It Works

### Frontend (`src/contexts/AuthContext.tsx`)

1. User clicks "Sign in with Google"
2. Frontend redirects to Google OAuth consent screen
3. User selects Google account (due to `prompt=select_account`)
4. Google redirects back with authorization `code`
5. Frontend exchanges code via `/api/auth/google/token` (backend)
6. User logged in with returned user object

### Backend (`server.js`)

1. Receives `POST /api/auth/google/token` with authorization code
2. Uses `GOOGLE_CLIENT_SECRET` to exchange code with Google OAuth servers
3. Receives `id_token` (JWT) and `access_token` from Google
4. Decodes JWT to extract user info (id, email, name)
5. Returns user object to frontend
6. Frontend stores user in sessionStorage and shows app

## Troubleshooting

### "Account selector not showing"
- Add `prompt=select_account` parameter ✅ (already done)

### "403 Forbidden on callback"
- Check that redirect URI is registered in Google Cloud Console
- Verify `.env.local` has correct `VITE_GOOGLE_REDIRECT_URI`

### "Cannot exchange code for tokens"
- Check `GOOGLE_CLIENT_SECRET` is correct
- Verify backend is running on production
- Check server logs: `cat server.log`

### "User not logged in after callback"
- Check browser console for errors
- Verify `/api/auth/google/token` endpoint is working
- Check server logs for OAuth errors

## File Structure

```
peace-vinyl/
├── .env.local              # Local dev config (git ignored)
├── .env.production         # Production config template
├── .env.example            # Documentation
├── server.js               # Express backend with OAuth handler
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx # OAuth login/logout logic
│   ├── components/
│   │   ├── LoginView.tsx   # Login UI
│   │   └── ...
│   └── App.tsx            # Main app routing
└── package.json            # Dependencies
```

## Key Changes from Standard SPA

1. **Backend server required** — `server.js` handles OAuth token exchange
2. **Secure secret handling** — `GOOGLE_CLIENT_SECRET` only on backend
3. **Proxy configuration** — Apache routes `/api/*` to backend server
4. **Environment-aware** — Local dev vs production redirect URIs

## References

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [OAuth 2.0 Authorization Code Flow](https://datatracker.ietf.org/doc/html/rfc6749#section-1.3.1)
- [Plesk Node.js Deployment](https://docs.plesk.com/)
