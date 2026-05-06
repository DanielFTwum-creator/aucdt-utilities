CREATE TABLE IF NOT EXISTS mentors (
  id VARCHAR(255) PRIMARY KEY,
  mentor_name VARCHAR(255),
  expertise_area VARCHAR(255),
  years_experience INT,
  bio TEXT,
  availability VARCHAR(50),
  max_mentees INT,
  current_mentees INT,
  rating DECIMAL(3,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mentees (
  id VARCHAR(255) PRIMARY KEY,
  mentor_id VARCHAR(255),
  mentee_name VARCHAR(255),
  learning_goals TEXT,
  matching_date DATE,
  progress_score INT,
  meeting_frequency VARCHAR(50),
  program_status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mentor_id) REFERENCES mentors(id)
);

INSERT INTO mentors (id, mentor_name, expertise_area, rating) VALUES
('mn_demo_001', 'Mentor One', 'Technology', 4.8);

INSERT INTO mentees (id, mentor_id, mentee_name, learning_goals, program_status) VALUES
('me_demo_001', 'mn_demo_001', 'Mentee One', 'Improve coding skills', 'active');
