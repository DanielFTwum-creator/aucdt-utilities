import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// --- Gemini custody: this app NEVER holds the key (fleet standard, Pattern 11). ---
// Every call is relayed to WMS, which adds the central key server-side:
//   :generateContent -> POST /api/gemini/generate   (text + image-edit)
//   :predict         -> POST /api/gemini/predict     (Imagen text-to-image)
// The key never reaches this process.
const WMS_GENERATE_URL = process.env.WMS_GEMINI_URL || 'https://wms.techbridge.edu.gh/api/gemini/generate';
const WMS_PREDICT_URL  = process.env.WMS_GEMINI_PREDICT_URL || 'https://wms.techbridge.edu.gh/api/gemini/predict';
const GEMINI_PROXY_KEY = process.env.GEMINI_PROXY_KEY || '';

if (!GEMINI_PROXY_KEY) {
  console.warn('[DMCDAI] WARNING: GEMINI_PROXY_KEY not set — AI routes will return 503');
}

/** Relay a raw generateContent body to WMS; returns the parsed Gemini REST response. */
async function relayGenerate(model, body) {
  if (!GEMINI_PROXY_KEY) { const e = new Error('GEMINI_PROXY_KEY not configured'); e.status = 503; throw e; }
  const r = await fetch(`${WMS_GENERATE_URL}?model=${encodeURIComponent(model)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Gemini-Proxy-Key': GEMINI_PROXY_KEY },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  if (!r.ok) { const e = new Error(`WMS generate relay ${r.status}: ${text.slice(0, 300)}`); e.status = r.status; throw e; }
  return JSON.parse(text);
}

/** Relay a raw :predict body (Imagen) to WMS; returns the parsed predict response. */
async function relayPredict(model, body) {
  if (!GEMINI_PROXY_KEY) { const e = new Error('GEMINI_PROXY_KEY not configured'); e.status = 503; throw e; }
  const r = await fetch(`${WMS_PREDICT_URL}?model=${encodeURIComponent(model)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Gemini-Proxy-Key': GEMINI_PROXY_KEY },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  if (!r.ok) { const e = new Error(`WMS predict relay ${r.status}: ${text.slice(0, 300)}`); e.status = r.status; throw e; }
  return JSON.parse(text);
}

/** Join all text parts of a generateContent response. */
function responseText(resp) {
  return (resp?.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? '').join('');
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SMTP_GATEWAY_URL = process.env.SMTP_GATEWAY_URL || 'https://api.techbridge.edu.gh/aucdt-dev/sendMail';
const JWT_SECRET = process.env.JWT_SECRET || 'tuc_rms_jwt_secret_2026_secure';
const RMS_BASE = process.env.RMS_BASE_URL || 'https://ai-tools.techbridge.edu.gh';
const APP_BASE = `${RMS_BASE}/dmcdai`;

const tlsAgent = new https.Agent({ rejectUnauthorized: false });

const db = mysql.createPool({
  host: process.env.DB_HOST || '66.226.72.199',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'aucdtadmin_dev',
  password: process.env.DB_PASS || '#4Dwsf07-dev',
  database: process.env.DB_NAME || 'tuc_rms_prod',
  waitForConnections: true,
  connectionLimit: 5,
});

// Round-robin campus frame
const CAMPUS_FRAME_COUNT = 12;
const CAMPUS_FRAME_BASE = 'https://techbridge.edu.gh/static/campus_frame_';
let frameIndex = 0;
const nextCampusFrame = () => {
  frameIndex = (frameIndex % CAMPUS_FRAME_COUNT) + 1;
  return `${CAMPUS_FRAME_BASE}${frameIndex}.jpg`;
};

const sendMagicLink = async (userId, email, fullName, role, sessionToken, otp) => {
  const magicLink = `${APP_BASE}/?token=${encodeURIComponent(sessionToken)}&otp=${encodeURIComponent(otp)}`;
  const campusImg = nextCampusFrame();
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="padding:0;background:#6b0020;background-image:url('${campusImg}');background-size:cover;background-position:center;text-align:center;height:200px;" background="${campusImg}">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(63,0,16,0.68);">
              <tr><td style="padding:28px 32px;text-align:center;height:200px;vertical-align:middle;">
                <img src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" alt="Techbridge University College" width="64" height="64" style="display:block;margin:0 auto 10px;border-radius:50%;background:#fff;padding:4px;" />
                <div style="color:#f5a800;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:5px;">Techbridge University College</div>
                <div style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:1px;">Digital Media & Communication Design</div>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 32px;">
            <p style="margin:0 0 8px;font-size:15px;color:#444;">Hi <strong>${fullName}</strong>,</p>
            <p style="margin:0 0 32px;font-size:14px;color:#666;line-height:1.6;">
              Click the button below to access the DMCDAI Learning Platform. This link expires in <strong>15 minutes</strong> and can only be used once.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center" style="padding:8px 0 32px;">
                <a href="${magicLink}" style="display:inline-block;background:#6b0020;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:8px;letter-spacing:0.5px;">
                  Access DMCDAI &rarr;
                </a>
              </td></tr>
            </table>
            <p style="margin:0 0 12px;font-size:12px;color:#aaa;line-height:1.6;">Button not working? Copy and paste this link:</p>
            <p style="margin:0;font-size:11px;color:#aaa;word-break:break-all;"><a href="${magicLink}" style="color:#6b0020;">${magicLink}</a></p>
            <hr style="border:none;border-top:1px solid #eee;margin:28px 0;">
            <p style="margin:0;font-size:12px;color:#bbb;">If you did not request this link, please ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9f9f9;border-top:1px solid #eee;padding:16px 32px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#bbb;">&copy; ${new Date().getFullYear()} Techbridge University College &middot; Oyibi, Greater Accra, Ghana</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const res = await fetch(SMTP_GATEWAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicantId: 'DMCDAI-' + Date.now(),
        fullName,
        senderEmailId: 'noreply@techbridge.edu.gh',
        receiverEmailId: email,
        subject: 'Access DMCDAI Learning Platform',
        message: html,
      }),
      agent: tlsAgent,
    });
    if (!res.ok) throw new Error(`SMTP gateway returned ${res.status}`);
    return true;
  } catch (err) {
    console.error('[DMCDAI] Failed to send magic link:', err.message);
    return false;
  }
};

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // POST /api/auth/login — First Name + Last Name → magic link
  app.post('/api/auth/login', async (req, res) => {
    try {
      let { email } = req.body;
      if (!email) return res.status(400).json({ message: 'Email required' });
      if (!email.includes('@')) email = `${email.trim().toLowerCase()}@techbridge.edu.gh`;

      const [rows] = await db.execute(
        'SELECT * FROM tuc_rms_users WHERE email = ? AND is_active = 1',
        [email]
      );
      if (!rows[0]) return res.status(401).json({ message: 'Email not found' });

      const user = rows[0];
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await db.execute(
        'INSERT INTO otp_tokens (user_id, otp, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp=VALUES(otp), expires_at=VALUES(expires_at)',
        [user.id, otp, expiresAt]
      );

      const sessionToken = jwt.sign({ id: user.id, pending_2fa: true }, JWT_SECRET, { expiresIn: '15m' });
      const sent = await sendMagicLink(user.id, user.email, user.full_name, user.role, sessionToken, otp);
      if (!sent) return res.status(500).json({ message: 'Failed to send login link' });

      res.json({ pending_2fa: true, session_token: sessionToken, message: 'Login link sent to your email' });
    } catch (err) {
      console.error('[DMCDAI] Login error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // POST /api/auth/verify-otp — verify magic link token+otp, return JWT
  app.post('/api/auth/verify-otp', async (req, res) => {
    try {
      const { session_token, otp } = req.body;
      if (!session_token || !otp) return res.status(400).json({ message: 'Token and OTP required' });

      let decoded;
      try {
        decoded = jwt.verify(session_token, JWT_SECRET);
      } catch {
        return res.status(401).json({ message: 'Session expired, please request a new link' });
      }

      if (!decoded.pending_2fa) return res.status(401).json({ message: 'Invalid session' });

      const [rows] = await db.execute(
        'SELECT id FROM otp_tokens WHERE user_id=? AND otp=? AND expires_at > NOW()',
        [decoded.id, otp]
      );
      if (!rows[0]) return res.status(401).json({ message: 'Invalid or expired login link' });
      await db.execute('DELETE FROM otp_tokens WHERE user_id=?', [decoded.id]);

      const [userRows] = await db.execute('SELECT * FROM tuc_rms_users WHERE id = ?', [decoded.id]);
      if (!userRows[0]) return res.status(401).json({ message: 'User not found' });

      const user = userRows[0];
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '12h' });

      res.json({
        token,
        user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role }
      });
    } catch (err) {
      console.error('[DMCDAI] Verify error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Legacy email proxy (keep for backward compat)
  app.post('/api/send-email', async (req, res) => {
    try {
      const response = await fetch(SMTP_GATEWAY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
        body: JSON.stringify(req.body),
        agent: tlsAgent,
      });
      const data = await response.json();
      if (!response.ok) return res.status(response.status).json(data);
      res.json(data);
    } catch (error) {
      console.error('Error proxying email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  app.get(['/api/health', '/dmcdai/api/health'], (_req, res) =>
    res.json({ ok: true, service: 'dmcdai', custody: GEMINI_PROXY_KEY ? 'wms-relay' : 'unconfigured' })
  );

  // Gemini text proxy — relayed to WMS; the API key never reaches this app (Pattern 11)
  app.post(['/api/gemini/generate', '/dmcdai/api/gemini/generate'], async (req, res) => {
    try {
      const { prompt, systemInstruction, model = 'gemini-1.5-flash', responseMimeType, responseSchema } = req.body;
      if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

      const generationConfig = {};
      if (responseMimeType) generationConfig.responseMimeType = responseMimeType;
      if (responseSchema) generationConfig.responseSchema = responseSchema;

      const body = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };
      if (systemInstruction) body.systemInstruction = { parts: [{ text: systemInstruction }] };
      if (Object.keys(generationConfig).length) body.generationConfig = generationConfig;

      const resp = await relayGenerate(model, body);
      res.json({ text: responseText(resp) });
    } catch (error) {
      console.error('[DMCDAI] Gemini text relay error:', error);
      res.status(error.status === 503 ? 503 : 500).json({ error: 'AI generation failed' });
    }
  });

  // Image generation proxy to bypass CORS
  app.post(['/api/generate-image', '/dmcdai/api/generate-image'], async (req, res) => {
    try {
      const { prompt, base64Image, mimeType } = req.body;

      if (base64Image && mimeType) {
      // Edit path: gemini-2.0-flash-preview-image-generation supports image-in,
      // image-out editing via generateContent — relayed through WMS /generate.
      const resp = await relayGenerate('gemini-2.0-flash-preview-image-generation', {
        contents: [{
          role: 'user',
          parts: [
            { inlineData: { data: base64Image, mimeType } },
            { text: prompt },
          ],
        }],
        generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
      });
      const parts = resp?.candidates?.[0]?.content?.parts ?? [];
      const imgPart = parts.find((p) => p.inlineData?.data);
      if (imgPart) {
        const mt = imgPart.inlineData.mimeType || 'image/png';
        return res.json({ result: `data:${mt};base64,${imgPart.inlineData.data}` });
      }
      throw new Error("EMPTY_RESPONSE");
    }

    // Generate path: text-to-image via Imagen :predict, relayed through WMS /predict.
    // Try models in order of quality, falling back to higher-quota models on 429
    // RESOURCE_EXHAUSTED (imagen-4-ultra has very low quota and was 429-ing every request).
    // Models verified available to the shared key (2026-06-04):
    //   imagen-4.0-fast-generate-001 -> OK (highest quota)
    //   imagen-4.0-ultra-generate-001 -> 429 (quota exhausted) — last resort
    // Lead with the fast model; fall through to the next on quota/transient errors.
    const GENERATE_MODELS = [
      'imagen-4.0-fast-generate-001',
      'imagen-4.0-ultra-generate-001',
    ];
    let lastErr;
    for (const model of GENERATE_MODELS) {
      try {
        // Imagen :predict body — instances[].prompt + parameters.sampleCount.
        const resp = await relayPredict(model, {
          instances: [{ prompt }],
          parameters: { sampleCount: 1 },
        });
        const b64 = resp?.predictions?.[0]?.bytesBase64Encoded;
        if (b64) {
          return res.json({ result: `data:image/png;base64,${b64}` });
        }
        lastErr = new Error('EMPTY_RESPONSE');
      } catch (err) {
        lastErr = err;
        // Fall through to the next model only on quota (429) or transient (503).
        if (err?.status !== 429 && err?.status !== 503) break;
        console.warn(`[DMCDAI] ${model} returned ${err?.status} — trying next model`);
      }
    }
    throw lastErr || new Error('EMPTY_RESPONSE');
    } catch (error) {
      console.error('[DMCDAI] Image gen error:', error);
      // Surface quota exhaustion clearly instead of a generic 500.
      if (error?.status === 429) {
        return res.status(429).json({ error: 'IMAGE_QUOTA_EXHAUSTED', message: 'The image service is over its quota right now. Please try again in a few minutes.' });
      }
      res.status(error?.status === 503 ? 503 : 500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use(async (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      const url = req.originalUrl;
      try {
        const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        const transformed = await vite.transformIndexHtml(url, html);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(transformed);
      } catch (err) {
        next(err);
      }
    });
  } else {
    // Local build puts the SPA in dist/; deploy.ps1 rsyncs dist/* directly into the
    // docroot alongside server.js, so __dirname itself is the web root there. Probe
    // for dist/index.html and fall back to __dirname.
    const distCandidate = path.join(__dirname, 'dist');
    const distPath = fs.existsSync(path.join(distCandidate, 'index.html')) ? distCandidate : __dirname;

    // The docroot also holds backend files (rsync --delete excludes them); never
    // serve those over HTTP. Dotfiles like .env are already ignored by
    // express.static's default dotfiles policy.
    const BLOCKED = ['server.js', 'server.cjs', 'server.ts', 'package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'ecosystem.config.js'];
    app.use((req, res, next) => {
      if (BLOCKED.includes(path.basename(req.path))) return res.status(404).send('Not found');
      next();
    });

    // nginx forwards the /dmcdai prefix through to this process (the API routes
    // are dual-registered for the same reason), so the static handler must be
    // mounted at both the bare root and the sub-path. With only the bare mount,
    // /dmcdai/assets/*.js fell through to the SPA catch-all and was served as
    // text/html; strict MIME checking then blocked every module script
    // (live black screen after the 4 Jul rebuild).
    app.use(express.static(distPath));
    app.use('/dmcdai', express.static(distPath));
    app.get(/.*/, (req, res) => {
      if (!req.path.startsWith('/api/') && !req.path.startsWith('/dmcdai/api/')) {
        res.sendFile(path.join(distPath, 'index.html'));
      } else {
        res.status(404).send('Not found');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DMCDAI] WMS relay listening on http://localhost:${PORT}`);
    console.log(`[DMCDAI] Gemini custody: ${GEMINI_PROXY_KEY ? 'WMS relay (proxy key set)' : 'NOT CONFIGURED — AI routes will 503'}`);
  });
}

startServer();
