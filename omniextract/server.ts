import http from 'http';
import url from 'url';
import querystring from 'querystring';
import fs from 'fs';
import path from 'path';

const PORT = parseInt(process.env.PORT || '3000', 10);
const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const BASE_URL = process.env.BASE_URL || 'https://ai-tools.techbridge.edu.gh/omniextract';

async function exchangeCodeForToken(code: string): Promise<{ access_token: string; id_token?: string }> {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: `${BASE_URL}/callback`,
  });

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
  return res.json();
}

async function fetchUserInfo(accessToken: string): Promise<{ sub: string; name: string; email: string }> {
  const res = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error(`User info fetch failed: ${res.status}`);
  return res.json();
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url || '/', true);
  const pathname = parsedUrl.pathname;

  // OAuth callback endpoint
  if (pathname === '/callback' && req.method === 'GET') {
    const query = parsedUrl.query as Record<string, string>;
    const code = query.code;
    const error = query.error;

    if (error) {
      res.writeHead(302, { Location: `${BASE_URL}/?error=${encodeURIComponent(error)}` });
      return res.end();
    }

    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      return res.end('Missing authorization code');
    }

    try {
      const tokenData = await exchangeCodeForToken(code);
      const userInfo = await fetchUserInfo(tokenData.access_token);

      const userData = {
        id: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
      };

      // Set cookie with user data and redirect to app
      const encodedUser = Buffer.from(JSON.stringify(userData)).toString('base64');
      res.writeHead(302, {
        Location: `${BASE_URL}/`,
        'Set-Cookie': `omniextract_user=${encodeURIComponent(encodedUser)}; Path=/omniextract/; Max-Age=86400; Secure; SameSite=Lax`,
      });
      return res.end();
    } catch (err) {
      console.error('OAuth error:', err);
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      res.writeHead(302, { Location: `${BASE_URL}/?error=${encodeURIComponent(errMsg)}` });
      return res.end();
    }
  }

  // Serve index.html for SPA routing
  if (pathname === '/' || !pathname.includes('.')) {
    try {
      const indexPath = path.join(__dirname, 'dist', 'index.html');
      const content = fs.readFileSync(indexPath, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(content);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
  }

  // Serve static files
  try {
    const filePath = path.join(__dirname, 'dist', pathname);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      const ext = path.extname(filePath);
      const mimeTypes: Record<string, string> = {
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.html': 'text/html',
        '.json': 'application/json',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
      };
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      return res.end(content);
    }
  } catch (err) {
    // Fall through to 404
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`OmniExtract server listening on port ${PORT}`);
});
