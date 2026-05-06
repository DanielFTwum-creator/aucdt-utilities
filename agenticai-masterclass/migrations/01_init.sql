CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(255) PRIMARY KEY,
  course_name VARCHAR(255),
  instructor VARCHAR(255),
  duration_hours INT,
  difficulty_level VARCHAR(50),
  enrollment_count INT,
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_level (difficulty_level),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS enrollments (
  id VARCHAR(255) PRIMARY KEY,
  course_id VARCHAR(255),
  learner_name VARCHAR(255),
  progress_percent INT,
  completion_date DATE,
  certificate_issued BOOLEAN,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  INDEX idx_course (course_id),
  INDEX idx_progress (progress_percent)
);

INSERT INTO courses (id, course_name, instructor, duration_hours, difficulty_level, enrollment_count, status) VALUES
('crs_001', 'AI Fundamentals Masterclass', 'Dr. Chen', 40, 'intermediate', 125, 'active'),
('crs_002', 'Advanced Prompt Engineering', 'Sarah AI', 20, 'advanced', 89, 'active'),
('crs_003', 'AI Ethics & Safety', 'Prof. Johnson', 15, 'beginner', 210, 'active');

INSERT INTO enrollments (id, course_id, learner_name, progress_percent, completion_date, certificate_issued) VALUES
('enr_001', 'crs_001', 'Aba Asante', 85, NULL, false),
('enr_002', 'crs_002', 'Kwesi Osei', 100, '2024-02-20', true),
('enr_003', 'crs_003', 'Amina Mensah', 45, NULL, false);
