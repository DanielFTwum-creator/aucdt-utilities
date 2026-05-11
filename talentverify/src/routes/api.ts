import express from 'express';
import { getDb } from '../db';

const router = express.Router();

// --- Roles ---
router.get('/roles', (req, res) => {
  const db = getDb();
  const roles = db.prepare('SELECT * FROM roles').all();
  res.json(roles);
});

router.post('/roles', (req, res) => {
  const { title, department, description } = req.body;
  const db = getDb();
  const result = db.prepare('INSERT INTO roles (title, department, description) VALUES (?, ?, ?)').run(title, department, description);
  res.json({ id: result.lastInsertRowid });
});

// --- Questionnaires ---
router.post('/questionnaires', (req, res) => {
  const { role_id, title, description, questions } = req.body;
  const db = getDb();
  
  const createTx = db.transaction(() => {
    const qResult = db.prepare('INSERT INTO questionnaires (role_id, title, description) VALUES (?, ?, ?)').run(role_id, title, description);
    const questionnaireId = qResult.lastInsertRowid;
    
    const insertQuestion = db.prepare('INSERT INTO questions (questionnaire_id, text, type, min_words, max_words, order_index) VALUES (?, ?, ?, ?, ?, ?)');
    
    questions.forEach((q: any, index: number) => {
      insertQuestion.run(questionnaireId, q.text, q.type, q.min_words, q.max_words, index);
    });
    
    return questionnaireId;
  });

  try {
    const id = createTx();
    res.json({ id, status: 'created' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/questionnaires/:roleId', (req, res) => {
  const db = getDb();
  const questionnaire = db.prepare('SELECT * FROM questionnaires WHERE role_id = ?').get(req.params.roleId) as any;
  
  if (questionnaire) {
    const questions = db.prepare('SELECT * FROM questions WHERE questionnaire_id = ? ORDER BY order_index').all(questionnaire.id);
    res.json({ ...questionnaire, questions });
  } else {
    res.status(404).json({ error: 'Questionnaire not found' });
  }
});

import { analyzeAuthorship, analyzeVideoResponse } from '../services/aiAnalysis';

// ... (existing imports)

// --- Applications ---
// ... (existing routes)

router.post('/applications', async (req, res) => {
  const { candidate_name, candidate_email, role_id, responses } = req.body;
  const db = getDb();

  try {
    // Analyze all responses in parallel
    const analyzedResponses = await Promise.all(responses.map(async (r: any) => {
      let analysis = { score: 0, confidence: 0, signals: [] as string[] };
      
      if (r.text_response && r.text_response.startsWith('data:video')) {
        // It's a video
        analysis = await analyzeVideoResponse(r.text_response);
      } else if (r.text_response && !r.text_response.startsWith('data:')) {
        // It's text (and not a file/video data URI)
        analysis = await analyzeAuthorship(r.text_response);
      }
      
      return {
        ...r,
        ai_score: analysis.score,
        ai_signals: JSON.stringify(analysis.signals)
      };
    }));

    // Calculate aggregate score (simple average for now)
    const avgScore = analyzedResponses.reduce((acc: number, curr: any) => acc + curr.ai_score, 0) / analyzedResponses.length;
    
    // Calculate Talent Signal Score (TSS)
    // Initial TSS based on AI signal (lower AI score = higher TSS)
    // Formula: 100 - (ai_score * 0.5) -> If AI score is 100, TSS penalty is 50.
    const tss = Math.max(0, 100 - (avgScore * 0.5));

    const submitTx = db.transaction(() => {
      // 1. Create or Get Candidate
      let candidate = db.prepare('SELECT id FROM candidates WHERE email = ?').get(candidate_email) as any;
      if (!candidate) {
        const cResult = db.prepare('INSERT INTO candidates (name, email) VALUES (?, ?)').run(candidate_name, candidate_email);
        candidate = { id: cResult.lastInsertRowid };
      }

      // 2. Create Application
      const appResult = db.prepare('INSERT INTO applications (candidate_id, role_id, ai_authorship_score, talent_signal_score) VALUES (?, ?, ?, ?)').run(candidate.id, role_id, avgScore, tss);
      const appId = appResult.lastInsertRowid;

      // 3. Save Answers
      const insertAnswer = db.prepare('INSERT INTO answers (application_id, question_id, text_response, video_data, file_data, ai_score) VALUES (?, ?, ?, ?, ?, ?)');
      analyzedResponses.forEach((r: any) => {
        const isVideo = r.text_response && r.text_response.startsWith('data:video');
        const isFile = r.text_response && r.text_response.startsWith('data:application'); // Basic check
        
        insertAnswer.run(
          appId, 
          r.question_id, 
          (isVideo || isFile) ? null : r.text_response, 
          isVideo ? r.text_response : null, 
          isFile ? r.text_response : null,
          r.ai_score
        );
      });

      return appId;
    });

    const id = submitTx();
    res.json({ id, status: 'submitted', ai_score: avgScore, tss });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
