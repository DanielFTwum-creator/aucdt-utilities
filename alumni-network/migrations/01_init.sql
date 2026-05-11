CREATE TABLE IF NOT EXISTS alumni_profiles (
  id VARCHAR(255) PRIMARY KEY,
  alumni_name VARCHAR(255),
  graduation_year INT,
  current_job_title VARCHAR(255),
  company VARCHAR(255),
  location VARCHAR(255),
  bio TEXT,
  profile_verified BOOLEAN,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_graduation (graduation_year)
);

CREATE TABLE IF NOT EXISTS alumni_connections (
  id VARCHAR(255) PRIMARY KEY,
  alumni_id_1 VARCHAR(255),
  alumni_id_2 VARCHAR(255),
  connection_date DATETIME,
  connection_strength VARCHAR(50),
  shared_interests TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alumni_id_1) REFERENCES alumni_profiles(id),
  FOREIGN KEY (alumni_id_2) REFERENCES alumni_profiles(id)
);

INSERT INTO alumni_profiles (id, alumni_name, graduation_year, current_job_title, company, profile_verified) VALUES
('alm_demo_001', 'Alumni One', 2019, 'Software Engineer', 'TechCorp', true);

INSERT INTO alumni_connections (id, alumni_id_1, alumni_id_2, connection_date, connection_strength) VALUES
('alc_demo_001', 'alm_demo_001', 'alm_demo_001', '2024-01-15 12:00:00', 'strong');
