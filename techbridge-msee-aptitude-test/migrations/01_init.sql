-- MSEE Aptitude Test Database Schema

CREATE TABLE IF NOT EXISTS questions (
  id VARCHAR(255) PRIMARY KEY,
  test_section VARCHAR(100) NOT NULL,
  question_text TEXT NOT NULL,
  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS answers (
  id VARCHAR(255) PRIMARY KEY,
  question_id VARCHAR(255) NOT NULL,
  student_id VARCHAR(255) NOT NULL,
  answer_text TEXT,
  is_correct BOOLEAN DEFAULT FALSE,
  score INT DEFAULT 0,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE INDEX idx_answers_student ON answers(student_id);
CREATE INDEX idx_answers_question ON answers(question_id);

INSERT INTO questions (id, test_section, question_text, difficulty) VALUES 
  ('q001', 'math', 'What is 2+2?', 'easy'),
  ('q002', 'english', 'Define syntax in linguistics', 'medium'),
  ('q003', 'reasoning', 'Complete the pattern: 2,4,8,?', 'hard');
