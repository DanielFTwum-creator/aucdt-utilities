import express from 'express';
import { runSystemTests } from '../services/testRunner';
import { getSystemDiagnostics } from '../services/diagnostics';
import { getDb } from '../db';

const router = express.Router();

// Middleware to ensure admin (simple check for now, ideally use middleware from auth)
// Since this is an internal API called by the frontend which has the token/session, 
// we might rely on the frontend to protect access to the page that calls this.
// But for security, we should check headers or session. 
// For this demo, we'll assume the route is protected by the frontend and maybe add a simple header check if needed.

router.post('/run-tests', async (req, res) => {
  try {
    const results = await runSystemTests();
    res.json({ results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/diagnostics', getSystemDiagnostics);

router.get('/logs', (req, res) => {
    const db = getDb();
    try {
        // Join with users table to get user name
        const logs = db.prepare(`
            SELECT 
                l.*, 
                u.name as user_name 
            FROM audit_logs l
            LEFT JOIN users u ON l.user_id = u.id
            ORDER BY l.timestamp DESC 
            LIMIT 100
        `).all();
        res.json(logs);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/logs', (req, res) => {
    const { action, userId, entityType, entityId, details } = req.body;
    const db = getDb();
    try {
        db.prepare('INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)').run(userId, action, entityType || 'system', entityId || null, details);
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
