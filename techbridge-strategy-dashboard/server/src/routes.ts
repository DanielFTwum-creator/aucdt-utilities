import {Router} from 'express';
import path from 'path';
import fs from 'fs/promises';
import multer from 'multer';
import {body, validationResult} from 'express-validator';
import {authMiddleware, generateToken, requireRole} from './auth';
import {strictLimiter} from './rateLimiter';

const router = Router();

const uploadsPath = path.join(__dirname, '..', '..', 'uploads');
const docsPath = path.join(__dirname, '..', '..', '..', 'docs');
const logsPath = path.join(__dirname, '..', '..', 'logs');

const storage = multer.diskStorage({
  destination: (req, _file, cb) => cb(null, uploadsPath),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({storage});

// ensure logs dir exists on startup (file ops in routes assume it exists)
import {existsSync, mkdirSync} from 'fs';
if (!existsSync(logsPath)) mkdirSync(logsPath, {recursive: true});

const auditLogFile = path.join(logsPath, 'audit.log');
const requirementsFile = path.join(__dirname, '..', '..', 'data', 'requirements.json');

// GET /api/requirements - attempt to read the SRS file for this project and return it as text
// Helper: load SRS content
async function loadSrsText() {
  const candidate = path.join(docsPath, 'specifications', 'SRS-TechBridge-v1.0.md');
  const fallback = path.join(docsPath, 'SRS.md');
  let filePath = candidate;
  try {
    await fs.access(candidate);
  } catch (e) {
    filePath = fallback;
  }
  const content = await fs.readFile(filePath, 'utf-8');
  return {filePath, content};
}

// Parse SRS for requirement tokens like **REQ-API-1**: description
function parseRequirementsFromText(text: string) {
  const re = /\*\*(REQ-[A-Z0-9-]+)\*\*:\s*(.+)/g;
  const results: Array<{code: string; text: string}> = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    results.push({code: m[1], text: m[2].trim()});
  }
  return results;
}

// GET /api/requirements - return parsed requirements or raw SRS slice. Supports ?q=search
router.get('/requirements', async (req, res) => {
  try {
    const {filePath, content} = await loadSrsText();
    const parsed = parseRequirementsFromText(content);
    const q = (req.query.q as string) || '';
    if (q) {
      const filtered = parsed.filter(r => r.code.toLowerCase().includes(q.toLowerCase()) || r.text.toLowerCase().includes(q.toLowerCase()));
      return res.json({ok: true, source: filePath, count: filtered.length, requirements: filtered});
    }
    // default: return parsed items and a short raw preview
    return res.json({ok: true, source: filePath, count: parsed.length, requirements: parsed, preview: content.slice(0, 32_000)});
  } catch (err) {
    res.status(500).json({ok: false, error: 'Failed to read/parse SRS file', detail: String(err)});
  }
});

// GET /api/requirements/:id - return a specific requirement by code
router.get('/requirements/:id', async (req, res) => {
  try {
    const id = req.params.id.toUpperCase();
    const {content, filePath} = await loadSrsText();
    const parsed = parseRequirementsFromText(content);
    const found = parsed.find(r => r.code === id || r.code.toUpperCase() === id);
    if (!found) return res.status(404).json({ok: false, error: 'Requirement not found', id});
    return res.json({ok: true, source: filePath, requirement: found});
  } catch (err) {
    res.status(500).json({ok: false, error: 'Failed to read/parse SRS file', detail: String(err)});
  }
});

// Admin-only: create requirement
router.post(
  '/requirements',
  strictLimiter,
  authMiddleware,
  requireRole('admin'),
  body('code').isString().trim().isLength({min: 3, max: 50}),
  body('text').isString().trim().isLength({min: 1, max: 2000}),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ok: false, errors: errors.array()});
    const {code, text} = req.body;
    try {
      const existingRaw = await fs.readFile(requirementsFile, 'utf-8').catch(() => '[]');
      const arr = JSON.parse(existingRaw);
      if (arr.find((r: any) => r.code === code)) return res.status(409).json({ok: false, error: 'Code exists'});
      const newItem = {code, text, createdAt: new Date().toISOString()};
      arr.push(newItem);
      await fs.writeFile(requirementsFile, JSON.stringify(arr, null, 2), 'utf-8');
      await fs.appendFile(auditLogFile, `${new Date().toISOString()} CREATE ${code} ${req.ip}\n`);
      return res.json({ok: true, requirement: newItem});
    } catch (err) {
      return res.status(500).json({ok: false, error: 'Failed to create requirement', detail: String(err)});
    }
  }
);

// Admin-only: update requirement
router.put(
  '/requirements/:id',
  strictLimiter,
  authMiddleware,
  requireRole('admin'),
  body('text').isString().trim().isLength({min: 1, max: 2000}),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ok: false, errors: errors.array()});
    const id = req.params.id.toUpperCase();
    const {text} = req.body;
    try {
      const existingRaw = await fs.readFile(requirementsFile, 'utf-8').catch(() => '[]');
      const arr = JSON.parse(existingRaw);
      const idx = arr.findIndex((r: any) => r.code.toUpperCase() === id);
      if (idx === -1) return res.status(404).json({ok: false, error: 'Not found'});
      arr[idx].text = text;
      arr[idx].updatedAt = new Date().toISOString();
      await fs.writeFile(requirementsFile, JSON.stringify(arr, null, 2), 'utf-8');
      await fs.appendFile(auditLogFile, `${new Date().toISOString()} UPDATE ${id} ${req.ip}\n`);
      return res.json({ok: true, requirement: arr[idx]});
    } catch (err) {
      return res.status(500).json({ok: false, error: 'Failed to update', detail: String(err)});
    }
  }
);

// Admin-only: delete requirement
router.delete('/requirements/:id', strictLimiter, authMiddleware, requireRole('admin'), async (req, res) => {
  const id = req.params.id.toUpperCase();
  try {
    const existingRaw = await fs.readFile(requirementsFile, 'utf-8').catch(() => '[]');
    const arr = JSON.parse(existingRaw);
    const idx = arr.findIndex((r: any) => r.code.toUpperCase() === id);
    if (idx === -1) return res.status(404).json({ok: false, error: 'Not found'});
    const removed = arr.splice(idx, 1)[0];
    await fs.writeFile(requirementsFile, JSON.stringify(arr, null, 2), 'utf-8');
    await fs.appendFile(auditLogFile, `${new Date().toISOString()} DELETE ${id} ${req.ip}\n`);
    return res.json({ok: true, removed});
  } catch (err) {
    return res.status(500).json({ok: false, error: 'Failed to delete', detail: String(err)});
  }
});

// GET /api/pdfs - list uploaded files
router.get('/pdfs', async (_req, res) => {
  try {
    const files = await fs.readdir(uploadsPath);
    res.json({ok: true, files});
  } catch (err) {
    res.status(500).json({ok: false, error: 'Failed to list uploads', detail: String(err)});
  }
});

// POST /api/upload - accept a file upload
router.post(
  '/upload',
  strictLimiter,
  upload.single('file'),
  body('title').optional().isString().trim().isLength({max: 200}),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ok: false, errors: errors.array()});
    if (!req.file) return res.status(400).json({ok: false, error: 'No file uploaded (field: file)'});
    // Validate PDF mimetype per SRS
    const mimetype = req.file.mimetype || '';
    const isPdf = mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      // remove the file
      try {
        await fs.unlink(path.join(uploadsPath, req.file.filename));
      } catch (e) {
        // ignore
      }
      return res.status(400).json({ok: false, error: 'Only PDF uploads are allowed'});
    }
    // write audit log
    const logLine = `${new Date().toISOString()} UPLOAD ${req.file.filename} ${req.ip}\n`;
    try {
      await fs.appendFile(auditLogFile, logLine);
    } catch (e) {
      // ignore logging errors
    }
    res.json({ok: true, filename: req.file.filename, original: req.file.originalname});
  }
);

// Authentication: simple login that issues JWT when correct password provided
router.post('/auth/login', body('password').isString(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ok: false, errors: errors.array()});
  const {password} = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ok: false, error: 'Invalid credentials'});
  const token = generateToken({role: 'admin'});
  return res.json({ok: true, token});
});

// GET /api/logs - return recent audit log lines
router.get('/logs', async (_req, res) => {
  try {
    const exists = await fs.stat(auditLogFile).then(() => true).catch(() => false);
    if (!exists) return res.json({ok: true, lines: []});
    const raw = await fs.readFile(auditLogFile, 'utf-8');
    const lines = raw.trim().split(/\r?\n/).slice(-500);
    res.json({ok: true, count: lines.length, lines});
  } catch (err) {
    res.status(500).json({ok: false, error: 'Failed to read logs', detail: String(err)});
  }
});

// POST /api/logs - append an audit log entry
router.post(
  '/logs',
  strictLimiter,
  authMiddleware,
  requireRole('admin'),
  body('level').optional().isString(),
  body('message').isString().isLength({min: 1, max: 2000}),
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ok: false, errors: errors.array()});
  const {level = 'info', message} = req.body;
  const entry = `${new Date().toISOString()} ${level.toUpperCase()} ${String(message).replace(/\n/g, ' ')}\n`;
  try {
    await fs.appendFile(auditLogFile, entry);
    return res.json({ok: true});
  } catch (err) {
    return res.status(500).json({ok: false, error: 'Failed to write log', detail: String(err)});
  }
});

export default router;
