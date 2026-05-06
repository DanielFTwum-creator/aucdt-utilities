CREATE TABLE IF NOT EXISTS surveys (
  id VARCHAR(255) PRIMARY KEY,
  survey_title VARCHAR(255),
  survey_type VARCHAR(100),
  target_audience VARCHAR(255),
  status VARCHAR(50),
  response_count INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type (survey_type),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS responses (
  id VARCHAR(255) PRIMARY KEY,
  survey_id VARCHAR(255),
  respondent_id VARCHAR(255),
  response_data JSON,
  sentiment_score DECIMAL(3,2),
  submitted_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (survey_id) REFERENCES surveys(id),
  INDEX idx_survey (survey_id),
  INDEX idx_date (submitted_date)
);

INSERT INTO surveys (id, survey_title, survey_type, target_audience, status, response_count) VALUES
('srv_001', 'Student Experience Feedback', 'nps', 'students', 'active', 342),
('srv_002', 'Faculty Satisfaction Survey', 'likert', 'faculty', 'active', 87),
('srv_003', 'Alumni Career Outcomes', 'open_text', 'alumni', 'closed', 156);

INSERT INTO responses (id, survey_id, respondent_id, response_data, sentiment_score, submitted_date) VALUES
('resp_001', 'srv_001', 'std_001', '{\"nps_score\":9,\"reason\":\"Great learning environment\"}', 0.85, '2024-02-23 14:30:00'),
('resp_002', 'srv_002', 'fac_001', '{\"satisfaction\":4,\"areas\":\"resources\"}', 0.72, '2024-02-24 10:15:00'),
('resp_003', 'srv_003', 'alm_001', '{\"employed\":true,\"field\":\"technology\"}', 0.90, '2024-02-01 09:45:00');
