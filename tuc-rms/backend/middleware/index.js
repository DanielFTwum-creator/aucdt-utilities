const db = require('../db');

/**
 * Audit middleware: logs all authenticated POST/PUT/DELETE requests
 * to the audit_log table. Errors are swallowed (never blocks response).
 */
const auditMiddleware = (req, res, next) => {
  const originalJson = res.json;

  res.json = function(data) {
    // Only audit authenticated requests with mutating methods
    const isAuthenticated = req.user;
    const isMutating = ['POST', 'PUT', 'DELETE'].includes(req.method);

    if (isAuthenticated && isMutating) {
      // Build action and details from request
      const actionPath = req.path;
      const action = `${req.method}_${actionPath.split('/').filter(p => p).join('_').toUpperCase()}`;
      const details = JSON.stringify({
        path: req.path,
        method: req.method,
        body: req.body ? Object.keys(req.body).slice(0, 5) : null
      });

      // Get client IP (handle proxied requests)
      const ipAddress = req.headers['x-forwarded-for']
        ? req.headers['x-forwarded-for'].split(',')[0].trim()
        : req.socket.remoteAddress;

      // Log asynchronously (don't block response)
      setImmediate(() => {
        db.query(
          'INSERT INTO audit_log (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
          [req.user.id, action, details, ipAddress],
          (err) => {
            // Silently swallow errors
            if (err) console.error('Audit log error:', err.message);
          }
        );
      });
    }

    // Always respond with original data
    return originalJson.call(this, data);
  };

  next();
};

module.exports = { auditMiddleware };
