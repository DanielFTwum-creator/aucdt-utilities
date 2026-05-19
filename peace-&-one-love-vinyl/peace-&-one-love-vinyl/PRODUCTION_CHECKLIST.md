# Production Deployment Checklist — Peace & One Love Vinyl

**Project:** Peace & One Love Vinyl  
**Destination:** https://ai-tools.techbridge.edu.gh/peace  
**Deploy Date:** 2026-05-19  
**Status:** ✅ Ready for Production

---

## Pre-Deployment Verification

- ✅ **Dependencies:** pnpm install completed, 209 packages added
- ✅ **Build:** Vite production build successful (5.11s)
- ✅ **Output Size:** 357 KB total (356 KB assets + 1 KB HTML)
- ✅ **Gzip Compression:** 
  - JS: 352.53 KB → 112.56 KB (68% reduction)
  - CSS: 7.20 KB → 2.13 KB (70% reduction)
- ✅ **dist/ Structure:** Verified (index.html + assets folder)
- ✅ **Environment:** Uses shared glucose .env.local (TUC credentials)
- ✅ **Deploy Script:** deploy.ps1 validated and ready

---

## Environment Configuration

**Shared with glucose project:**
```
VITE_GOOGLE_CLIENT_ID=537671076222-q0ovngh3m2m560kdcrsn2hk0cae5rudg.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=https://ai-tools.techbridge.edu.gh/peace/auth/google/callback
VITE_GEMINI_API_KEY=AIzaSyCFQ0urCzKztMRfCw-I0IUcqcpVi-_TUVk
```

**Location:** `glucose/.env.local` (copied at deploy time)

---

## Deployment Steps

### 1. Build & Deploy (Automated)
```powershell
cd peace-&-one-love-vinyl
./deploy.ps1 -Build
```

**What happens:**
- Copies `.env.local` from glucose
- Runs `npm run build`
- Creates production `dist/` folder
- SCP transfers files to Plesk server at `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/`
- Creates `.htaccess` with SPA routing rules
- Sets permissions: `techbridge.edu.gh_md:psacln` with 755 mode

### 2. Verify Deployment
```bash
# SSH to server
ssh root@66.226.72.199

# Check files
ls -la /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/
ls -la /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/.htaccess

# Test permissions
stat /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/
```

### 3. Verify in Browser
Visit: **https://ai-tools.techbridge.edu.gh/peace**

Expected:
- Page loads without 404 errors
- OAuth redirect URI works: `/peace/auth/google/callback`
- Gemini API integration functional

---

## Post-Deployment Checklist

- [ ] URL accessible: https://ai-tools.techbridge.edu.gh/peace
- [ ] No 404 errors on page load
- [ ] CSS/JS assets loaded correctly
- [ ] OAuth Google login functional
- [ ] Gemini AI features operational
- [ ] Console (F12) shows no JavaScript errors
- [ ] Mobile responsive (test on phone/tablet)
- [ ] Gzip compression active (check DevTools Network tab)

---

## Rollback Plan

If deployment fails:

```powershell
# Option 1: SSH & clean directory
ssh root@66.226.72.199 "rm -rf /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/*"

# Option 2: Re-run deployment
./deploy.ps1 -Build
```

---

## Maintenance & Updates

### Regular Tasks
- Monitor `/var/log/apache2/error.log` for 404s or permission issues
- Check Gemini API quota monthly
- Update dependencies quarterly: `pnpm update`

### CI/CD Integration (Future)
When ready, add to GitHub Actions:
```yaml
- name: Deploy to Plesk
  run: |
    ./peace-&-one-love-vinyl/deploy.ps1 -Build
```

---

## File Sizes & Performance

| File | Size | Gzipped | Notes |
|------|------|---------|-------|
| index.html | 0.41 KB | 0.28 KB | Entry point, SPA routing |
| JS Bundle | 352.53 KB | 112.56 KB | React + Vite optimized |
| CSS Bundle | 7.20 KB | 2.13 KB | Tailwind + Motion |
| **Total** | **~357 KB** | **~115 KB** | Production-ready |

**Load time expectations:**
- On 3G: ~2-3 seconds (115 KB @ 60 KB/s)
- On broadband: ~100-200 ms
- Cached: <50 ms

---

## Support & Contact

**Deployment Issues:**
- SSH access: `root@66.226.72.199`
- Server OS: Ubuntu, Plesk control panel
- Web server: Nginx/Apache via Plesk
- Location: `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/`

**Contact:**
- Daniel Frempong Twum / TUC ICT
- daniel.twum@techbridge.edu.gh

---

**Last Updated:** 2026-05-19 — Ready for Production ✅
