const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { auth, JWT_SECRET } = require('../middleware/auth');

// AUCDT Send Platform — POST /aucdt-dev/sendMail (application/json)
// Swagger: portal.aucdt.edu.gh/aucdt-dev/swagger-ui/#/common-controller/sendMailUsingPOST
const SMTP_GATEWAY_URL = process.env.SMTP_GATEWAY_URL || 'https://api.techbridge.edu.gh/aucdt-dev/sendMail';

const sendViaPlatform = async (to, subject, message, fullName) => {
  const res = await fetch(SMTP_GATEWAY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      applicantId: 'RMS-' + Date.now(),
      fullName,
      senderEmailId: 'noreply@techbridge.edu.gh',
      receiverEmailId: to,
      subject,
      message,
    }),
  });
  if (!res.ok) throw new Error(`SMTP gateway returned ${res.status}`);
};

// In-memory OTP store — keyed by userId, cleared on use
const otpStore = {};

// Role → landing page mapping
const ROLE_LANDING = {
  registrar:  '/dashboard',
  qa_officer: '/dashboard',
  lecturer:   '/courses',
  hod:        '/courses',
  ict:        '/dashboard',
};

// Generate and send magic login link
const sendMagicLink = async (userId, email, fullName, role, sessionToken, otp) => {
  const RMS_BASE = process.env.RMS_BASE_URL || 'https://rms.techbridge.edu.gh';
  const landing = ROLE_LANDING[role] || '/dashboard';
  const magicLink = `${RMS_BASE}/login?token=${encodeURIComponent(sessionToken)}&otp=${encodeURIComponent(otp)}&redirect=${encodeURIComponent(landing)}`;

  if (process.env.NODE_ENV === 'development') {
    console.log(`[MAGIC-LINK] ${email}: ${magicLink}`);
    return true;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#6b0020;padding:28px 32px;text-align:center;">
            <div style="color:#f5a800;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;">Techbridge University College</div>
            <div style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:1px;">Results Management System</div>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 32px;">
            <p style="margin:0 0 8px;font-size:15px;color:#444;">Hi <strong>${fullName}</strong>,</p>
            <p style="margin:0 0 32px;font-size:14px;color:#666;line-height:1.6;">
              Click the button below to sign in to the TUC Results Management System. This link expires in <strong>15 minutes</strong> and can only be used once.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center" style="padding:8px 0 32px;">
                <a href="${magicLink}"
                   style="display:inline-block;background:#6b0020;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:8px;letter-spacing:0.5px;">
                  Sign In to RMS &rarr;
                </a>
              </td></tr>
            </table>
            <p style="margin:0 0 12px;font-size:12px;color:#aaa;line-height:1.6;">
              Button not working? Copy and paste this link into your browser:
            </p>
            <p style="margin:0;font-size:11px;color:#aaa;word-break:break-all;line-height:1.6;">
              <a href="${magicLink}" style="color:#6b0020;">${magicLink}</a>
            </p>
            <hr style="border:none;border-top:1px solid #eee;margin:28px 0;">
            <p style="margin:0;font-size:12px;color:#bbb;line-height:1.6;">
              If you did not request this link, please ignore this email. Your account remains secure.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9f9f9;border-top:1px solid #eee;padding:16px 32px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#bbb;">
              &copy; ${new Date().getFullYear()} Techbridge University College &middot; Oyibi, Greater Accra, Ghana
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await sendViaPlatform(email, 'Sign in to TUC RMS', html, fullName);
    return true;
  } catch (err) {
    console.error('Failed to send magic link:', err);
    return false;
  }
};

// Step 1: Login — sends magic link to inbox
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email and password required' });

    const [rows] = await db.execute('SELECT * FROM tuc_rms_users WHERE email = ? AND is_active = 1', [email]);
    if (!rows[0]) return res.status(401).json({ message: 'Email not found' });

    const user = rows[0];

    // Generate OTP + session token together so both go into the magic link
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[user.id] = { otp, expiresAt: Date.now() + 15 * 60 * 1000 };
    const sessionToken = jwt.sign({ id: user.id, pending_2fa: true }, JWT_SECRET, { expiresIn: '15m' });

    const sent = await sendMagicLink(user.id, user.email, user.full_name, user.role, sessionToken, otp);
    if (!sent) return res.status(500).json({ message: 'Failed to send login link' });

    res.json({
      pending_2fa: true,
      session_token: sessionToken,
      message: 'Login link sent to your email'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Step 2: Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { session_token, otp } = req.body;
    if (!session_token || !otp) return res.status(400).json({ message: 'Session token and OTP required' });

    // Verify session token
    let decoded;
    try {
      decoded = jwt.verify(session_token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Session expired, please login again' });
    }

    if (!decoded.pending_2fa) return res.status(401).json({ message: 'Not in 2FA flow' });

    // Check OTP
    const storedOtp = otpStore[decoded.id];
    if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expiresAt) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    // Get user
    const [rows] = await db.execute('SELECT * FROM tuc_rms_users WHERE id = ?', [decoded.id]);
    if (!rows[0]) return res.status(401).json({ message: 'User not found' });

    const user = rows[0];

    // Clean up OTP
    delete otpStore[decoded.id];

    // Issue final JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '12h' });

    // Log login
    await db.execute('INSERT INTO audit_log (user_id, action, details) VALUES (?, ?, ?)',
      [user.id, 'LOGIN_2FA', `User ${user.email} logged in via 2FA`]);

    res.json({
      token,
      user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role, department: user.department, staff_id: user.staff_id }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

// Change password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) return res.status(400).json({ message: 'Both passwords required' });
    if (new_password.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });

    const [rows] = await db.execute('SELECT password_hash FROM tuc_rms_users WHERE id = ?', [req.user.id]);
    const match = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!match) return res.status(401).json({ message: 'Current password incorrect' });

    const hash = await bcrypt.hash(new_password, 10);
    await db.execute('UPDATE tuc_rms_users SET password_hash = ? WHERE id = ?', [hash, req.user.id]);

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Secondary authentication for admin destructive actions
router.post('/verify-admin', auth, async (req, res) => {
  try {
    // Only registrars can use this endpoint
    if (req.user.role !== 'registrar') {
      return res.status(403).json({ message: 'Only registrars can verify admin actions' });
    }

    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password required' });

    // Fetch user's password hash
    const [rows] = await db.execute('SELECT password_hash FROM tuc_rms_users WHERE id = ?', [req.user.id]);
    if (!rows[0]) return res.status(401).json({ message: 'User not found' });

    // Compare passwords
    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match) return res.status(401).json({ message: 'Password incorrect' });

    res.json({ verified: true, message: 'Admin verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
