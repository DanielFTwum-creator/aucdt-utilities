import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { GoogleGenAI, Type } from '@google/genai';
import { fileURLToPath } from 'url';

// --- Server Setup ---
const app = express();
const port = 3000;
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


// --- Gemini API Initialization ---
let ai;
if (!process.env.API_KEY) {
  console.error('FATAL ERROR: API_KEY environment variable is not set.');
  process.exit(1);
}
try {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (e) {
  console.error("Error during Gemini AI client initialization.", e);
  process.exit(1);
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
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correct: { type: Type.INTEGER },
    },
    required: ["question", "options", "correct"],
  };
  const sanitizedText = text.replace(/[\x00-\x1F\x7F]/g, '');
  const prompt = `Based on the following text about "${subject}", generate ${count} multiple-choice questions. Format the response as a JSON array. Text: --- ${sanitizedText} ---`;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: questionSchema },
        },
    });
    res.json(JSON.parse(response.text.trim()));
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: 'Failed to generate questions from AI service.' });
  }
});

// --- Static File Serving ---
app.use(express.static(__dirname));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});