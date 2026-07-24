# ai-tools.techbridge.edu.gh — domain-root SEO/GEO

`robots.txt` and `sitemap.xml` for the **shared domain root**. A sub-path app's
own `/<slug>/robots.txt` and `/<slug>/sitemap.xml` are **not** crawler-authoritative;
only the files served at `https://ai-tools.techbridge.edu.gh/robots.txt` and
`.../sitemap.xml` are. This is the discovery surface that fronts every sub-path app.

## Deploy (place at the vhost web root)

1. Confirm the web root and that nothing is already there:
   ```
   ssh root@techbridge.edu.gh "ls -la /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ | head; echo '-- existing? --'; ls -la /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/robots.txt /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/sitemap.xml 2>/dev/null || echo none"
   ```
2. Upload:
   ```
   scp ai-tools-root/robots.txt ai-tools-root/sitemap.xml root@techbridge.edu.gh:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/
   ```
3. Verify (want 200 + text/plain and application/xml, NOT a sub-path app's HTML):
   ```
   curl.exe -sI https://ai-tools.techbridge.edu.gh/robots.txt
   curl.exe -sI https://ai-tools.techbridge.edu.gh/sitemap.xml
   ```

## Indexable list
Included (public, indexable): ai-lab, poster, umat, math-island, techbridge-university-college-banner.
Excluded (noindex — auth/internal): lems, aitopia-learning-assistant, fail2ban-ai, sick-bay-management-system.
Own subdomains (separate root files): netscan.techbridge.edu.gh, radio.techbridge.edu.gh, lems.techbridge.edu.gh.
Confirm indexability before adding: teamwork.
