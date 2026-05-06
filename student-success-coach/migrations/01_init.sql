CREATE TABLE IF NOT EXISTS coaching_sessions (
  id VARCHAR(255) PRIMARY KEY,
  student_id VARCHAR(255),
  coach_name VARCHAR(255),
  session_date DATETIME,
  session_topic VARCHAR(255),
  duration_minutes INT,
  focus_area VARCHAR(100),
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_student (student_id),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS progress_tracking (
  id VARCHAR(255) PRIMARY KEY,
  student_id VARCHAR(255),
  coaching_session_id VARCHAR(255),
  gpa DECIMAL(3,2),
  attendance_rate DECIMAL(3,2),
  assignment_completion INT,
  improvement_score INT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (coaching_session_id) REFERENCES coaching_sessions(id),
  INDEX idx_session (coaching_session_id)
);

INSERT INTO coaching_sessions (id, student_id, coach_name, session_date, session_topic, duration_minutes, status) VALUES
('cs_demo_001', 'std_001', 'Coach Smith', '2024-02-01 10:00:00', 'Academic Planning', 60, 'completed');

INSERT INTO progress_tracking (id, student_id, coaching_session_id, gpa, attendance_rate, assignment_completion, improvement_score) VALUES
('pt_demo_001', 'std_001', 'cs_demo_001', 3.45, 0.95, 90, 7);
