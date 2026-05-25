const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../db');
const { auth, JWT_SECRET } = require('../middleware/auth');

// Email transporter for 2FA OTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  } : undefined
});

// In-memory OTP store (for dev; use Redis in production)
const otpStore = {};

// Generate and send OTP
const sendOTP = async (userId, email, fullName) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore[userId] = { otp, expiresAt };

  // In development, log OTP to console; in production, send via email
  if (process.env.NODE_ENV === 'development') {
    console.log(`[2FA-OTP] User ${email}: ${otp}`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@techbridge.edu.gh',
      to: email,
      subject: 'TUC RMS — Two-Factor Authentication Code',
      html: `
        <h2>Two-Factor Authentication</h2>
        <p>Hi ${fullName},</p>
        <p>Your one-time password (OTP) is:</p>
        <h1 style="font-family:monospace;font-size:32px;letter-spacing:4px;">${otp}</h1>
        <p>This code expires in 10 minutes.</p>
        <p>If you did not attempt to log in, please ignore this email.</p>
      `
    });
    return true;
  } catch (err) {
    console.error('Failed to send OTP email:', err);
    return false;
  }
};

// Step 1: Login (credentials only)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const [rows] = await db.execute('SELECT * FROM users WHERE email = ? AND is_active = 1', [email]);
    if (!rows[0]) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // Send OTP
    const otpSent = await sendOTP(user.id, user.email, user.full_name);
    if (!otpSent) return res.status(500).json({ message: 'Failed to send OTP' });

    // Return temporary session token (expires in 15 minutes)
    const sessionToken = jwt.sign({ id: user.id, pending_2fa: true }, JWT_SECRET, { expiresIn: '15m' });

    res.json({
      pending_2fa: true,
      session_token: sessionToken,
      message: 'OTP sent to your email'
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
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [decoded.id]);
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

    const [rows] = await db.execute('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    const match = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!match) return res.status(401).json({ message: 'Current password incorrect' });

    const hash = await bcrypt.hash(new_password, 10);
    await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.user.id]);

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
    const [rows] = await db.execute('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
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
