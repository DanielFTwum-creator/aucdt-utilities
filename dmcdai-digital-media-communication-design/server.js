import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SMTP_GATEWAY_URL = process.env.SMTP_GATEWAY_URL || 'https://api.techbridge.edu.gh/aucdt-dev/sendMail';
const JWT_SECRET = process.env.JWT_SECRET || 'tuc_rms_jwt_secret_2026_secure';
const RMS_BASE = process.env.RMS_BASE_URL || 'https://ai-tools.techbridge.edu.gh';
const APP_BASE = `${RMS_BASE}/dmcdai-digital-media-communication-design`;

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
  if (process.env.NODE_ENV === 'development') {
    const link = `${APP_BASE}/?token=${encodeURIComponent(sessionToken)}&otp=${encodeURIComponent(otp)}`;
    console.log(`[MAGIC-LINK] ${email}: ${link}`);
    return true;
  }

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

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
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
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(distPath, 'index.html'));
      } else {
        res.status(404).send('Not found');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DMCDAI] Server running on http://localhost:${PORT}`);
  });
}

startServer();
