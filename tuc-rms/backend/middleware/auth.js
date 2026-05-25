const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'tuc_rms_secret_2026';

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const [rows] = await db.execute('SELECT id, full_name, email, role, department, staff_id, is_active FROM tuc_rms_users WHERE id = ?', [decoded.id]);
    
    if (!rows[0] || !rows[0].is_active) return res.status(401).json({ message: 'User not found or deactivated' });
    
    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied. Insufficient privileges.' });
  }
  next();
};

const requireAdmin = requireRole('registrar', 'qa_officer');

module.exports = { auth, requireRole, requireAdmin, JWT_SECRET };
