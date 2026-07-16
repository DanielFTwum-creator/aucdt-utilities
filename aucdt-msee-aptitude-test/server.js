import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

// --- Server Setup ---
const app = express();
// Respect the PORT assigned by pm2/ecosystem.config.js (3011). Hardcoding 3000
// collided with dmcdai and caused an EADDRINUSE crash loop.
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3011;
const saltRounds = 10;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// --- Database Connection ---
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'msee_test_db',
};

let pool;
try {
  pool = mysql.createPool(dbConfig);
  console.log("MySQL Connection Pool created successfully.");
} catch (error) {
  console.error("FATAL ERROR: Could not create MySQL connection pool.", error);
  process.exit(1);
}


// --- Gemini custody: this app NEVER holds the Gemini key (fleet standard, ---
// --- Pattern 11). Every generateContent call is relayed to the WMS proxy  ---
// --- with the GEMINI_PROXY_KEY service credential; only WMS adds the key. ---
const WMS_GEMINI_URL = process.env.WMS_GEMINI_URL || 'https://wms.techbridge.edu.gh/api/gemini/generate';
const GEMINI_PROXY_KEY = process.env.GEMINI_PROXY_KEY || '';
const MODEL = 'gemini-2.5-flash';

// --- Google OAuth (fleet standard, Pattern 35): the code->token exchange is  ---
// --- relayed through WMS with the same GEMINI_PROXY_KEY service credential,   ---
// --- so this app never holds GOOGLE_CLIENT_SECRET. Only WMS holds it.         ---
const WMS_OAUTH_EXCHANGE_URL = process.env.WMS_OAUTH_EXCHANGE_URL || 'https://wms.techbridge.edu.gh/api/oauth/google/exchange';
const REDIRECT_URI = process.env.VITE_GOOGLE_REDIRECT_URI || 'https://ai-tools.techbridge.edu.gh/aucdt-msee-aptitude-test/callback';

if (!GEMINI_PROXY_KEY) {
  console.warn('[msee] WARNING: GEMINI_PROXY_KEY not set — /api/generate and Google login will return 503');
}

// Decode the payload of a Google id_token (JWT) without verifying the signature.
// The token comes straight from Google via the trusted WMS relay, so we only read it.
function decodeJWT(token) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
}

class RelayError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'RelayError';
    this.status = status;
  }
}

// Relay a raw Gemini generateContent body to WMS and return the parsed REST response.
async function callGemini(body) {
  if (!GEMINI_PROXY_KEY) throw new RelayError('GEMINI_PROXY_KEY not configured', 503);
  const upstream = await fetch(`${WMS_GEMINI_URL}?model=${encodeURIComponent(MODEL)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Gemini-Proxy-Key': GEMINI_PROXY_KEY },
    body: JSON.stringify(body),
  });
  if (!upstream.ok) {
    const errText = await upstream.text();
    console.error(`[msee] WMS relay failed ${upstream.status}: ${errText.slice(0, 500)}`);
    throw new RelayError(`WMS relay returned ${upstream.status}`, 502);
  }
  return await upstream.json();
}

function extractText(response) {
  return (response.candidates?.[0]?.content?.parts ?? []).map(p => p.text ?? '').join('');
}

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Forbidden: Administrator access required." });
  }
  next();
}

// --- API Endpoints ---

// AUTH
app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const [result] = await pool.execute('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, hashedPassword]);
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }
        console.error(error);
        res.status(500).json({ error: 'Database error during registration.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    try {
        const [rows] = await pool.execute('SELECT id, email, password_hash, role FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ error: 'Invalid email or password.' });
        
        const user = rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ error: 'Invalid email or password.' });
        
        const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ accessToken, user: { uid: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login.' });
    }
});


// EXAMS
app.get('/api/exams', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, name, description, subject, questions FROM exams ORDER BY created_at DESC');
        // The questions are stored as JSON text in the DB, so we parse them before sending.
        const exams = rows.map(exam => ({ ...exam, questions: JSON.parse(exam.questions) }));
        res.json(exams);
    } catch (error) {
        console.error('Error fetching exams:', error);
        res.status(500).json({ error: 'Failed to fetch exams.' });
    }
});

app.post('/api/exams', authenticateToken, isAdmin, async (req, res) => {
    const { name, description, subject, questions } = req.body;
    if (!name || !questions) {
        return res.status(400).json({ error: 'Exam name and questions are required.' });
    }
    try {
        const [result] = await pool.execute(
            'INSERT INTO exams (name, description, subject, questions, created_by) VALUES (?, ?, ?, ?, ?)',
            [name, description, subject, JSON.stringify(questions), req.user.id]
        );
        res.status(201).json({ message: 'Exam created successfully', examId: result.insertId });
    } catch (error) {
        console.error('Error saving exam:', error);
        res.status(500).json({ error: 'Failed to save exam.' });
    }
});

// PROGRESS
app.get('/api/progress/:examId', authenticateToken, async (req, res) => {
    const { examId } = req.params;
    const userId = req.user.id;
    try {
        const [rows] = await pool.execute(
            'SELECT answers, time_left FROM exam_progress WHERE user_id = ? AND exam_id = ?',
            [userId, examId]
        );
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.json(null); // No progress found
        }
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ error: 'Failed to fetch progress.' });
    }
});

app.post('/api/progress/:examId', authenticateToken, async (req, res) => {
    const { examId } = req.params;
    const userId = req.user.id;
    const { answers, timeLeft } = req.body;
    
    try {
        await pool.execute(
            `INSERT INTO exam_progress (user_id, exam_id, answers, time_left) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE answers = VALUES(answers), time_left = VALUES(time_left)`,
            [userId, examId, JSON.stringify(answers), timeLeft]
        );
        res.status(200).json({ message: 'Progress saved.' });
    } catch (error) {
        console.error('Error saving progress:', error);
        res.status(500).json({ error: 'Failed to save progress.' });
    }
});

app.delete('/api/progress/:examId', authenticateToken, async (req, res) => {
    const { examId } = req.params;
    const userId = req.user.id;
    try {
        await pool.execute(
            'DELETE FROM exam_progress WHERE user_id = ? AND exam_id = ?',
            [userId, examId]
        );
        res.status(200).json({ message: 'Progress cleared successfully.' });
    } catch (error) {
        console.error('Error clearing progress:', error);
        res.status(500).json({ error: 'Failed to clear progress.' });
    }
});


// LOGGING
app.post('/api/logs', authenticateToken, async (req, res) => {
    const { action, details } = req.body;
    const userId = req.user?.id || null;
    try {
        await pool.execute(
            'INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)',
            [userId, action, JSON.stringify(details)]
        );
        res.sendStatus(201);
    } catch (error) {
        console.error("Error writing to audit log:", error);
        res.sendStatus(500);
    }
});

// GEMINI AI
app.post('/api/generate', authenticateToken, isAdmin, async (req, res) => {
  const { text, count, subject } = req.body;
  if (!text || !count || !subject) return res.status(400).json({ error: 'Missing required fields.' });

  const questionSchema = {
    type: "OBJECT",
    properties: {
        question: { type: "STRING" },
        options: { type: "ARRAY", items: { type: "STRING" } },
        correct: { type: "INTEGER" },
    },
    required: ["question", "options", "correct"],
  };
  const sanitizedText = text.replace(/[\x00-\x1F\x7F]/g, '');
  const prompt = `Based on the following text about "${subject}", generate ${count} multiple-choice questions. Format the response as a JSON array. Text: --- ${sanitizedText} ---`;

  try {
    const response = await callGemini({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: { type: "ARRAY", items: questionSchema },
        },
    });
    res.json(JSON.parse(extractText(response).trim()));
  } catch (error) {
    console.error("Gemini relay error:", error);
    const status = error instanceof RelayError ? error.status : 500;
    res.status(status).json({ error: 'Failed to generate questions from AI service.' });
  }
});

// Health check (fleet standard)
app.get(['/api/health', '/aucdt-msee-aptitude-test/api/health'], (_req, res) => res.json({ ok: true }));

// --- Google OAuth callback ---
// Google redirects here with ?code=...; relay the exchange through WMS (no secret
// held), decode the id_token, set the JS-readable user cookie the AuthGate reads,
// then redirect back into the SPA. Registered before the static/catch-all so it wins.
app.get(['/callback', '/aucdt-msee-aptitude-test/callback'], async (req, res) => {
  const { code, error } = req.query;
  if (error) return res.redirect(`/aucdt-msee-aptitude-test/?error=${encodeURIComponent(error)}`);
  if (!code) return res.redirect('/aucdt-msee-aptitude-test/?error=missing_code');
  if (!GEMINI_PROXY_KEY) return res.redirect('/aucdt-msee-aptitude-test/?error=oauth_not_configured');
  try {
    const tokenResponse = await fetch(WMS_OAUTH_EXCHANGE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Gemini-Proxy-Key': GEMINI_PROXY_KEY },
      body: JSON.stringify({ code, redirectUri: REDIRECT_URI }),
    });
    if (!tokenResponse.ok) {
      const err = await tokenResponse.text();
      console.error(`[msee] Token exchange failed ${tokenResponse.status}: ${err.slice(0, 300)}`);
      return res.redirect('/aucdt-msee-aptitude-test/?error=token_exchange_failed');
    }
    const tokens = await tokenResponse.json();
    if (!tokens.id_token) return res.redirect('/aucdt-msee-aptitude-test/?error=no_id_token');
    const userInfo = decodeJWT(tokens.id_token);
    const userJson = JSON.stringify({ id: userInfo.sub, name: userInfo.name, email: userInfo.email });
    res.cookie('aucdt-msee-aptitude-test_user', Buffer.from(userJson).toString('base64'), {
      httpOnly: false, secure: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/aucdt-msee-aptitude-test/',
    });
    return res.redirect('/aucdt-msee-aptitude-test/');
  } catch (err) {
    console.error('[msee] OAuth callback error:', err);
    return res.redirect('/aucdt-msee-aptitude-test/?error=internal_error');
  }
});

// --- Static File Serving ---
// nginx proxies /aucdt-msee-aptitude-test/ to this app WITHOUT stripping the
// prefix, and the SPA is built with an absolute base of the same sub-path
// (Pattern 29). Mount static at BOTH the sub-path and root so asset requests
// (/aucdt-msee-aptitude-test/assets/*.js) resolve to files in __dirname/assets/
// instead of falling through to the index.html catch-all (which would serve
// JS bundles as text/html and break module loading).
// Express 5 (path-to-regexp 8) rejects the bare '*' wildcard; use a regex
// catch-all for the SPA fallback instead.
app.use('/aucdt-msee-aptitude-test', express.static(__dirname));
app.use(express.static(__dirname));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});