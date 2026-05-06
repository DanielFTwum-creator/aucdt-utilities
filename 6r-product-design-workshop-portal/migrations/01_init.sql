CREATE TABLE IF NOT EXISTS workshops (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255),
  facilitator VARCHAR(255),
  date_start DATE,
  date_end DATE,
  location VARCHAR(255),
  capacity INT,
  registered_count INT,
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_date (date_start)
);

CREATE TABLE IF NOT EXISTS registrations (
  id VARCHAR(255) PRIMARY KEY,
  workshop_id VARCHAR(255),
  participant_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  registration_date DATETIME,
  completion_status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workshop_id) REFERENCES workshops(id),
  INDEX idx_workshop (workshop_id),
  INDEX idx_status (completion_status)
);

INSERT INTO workshops (id, title, facilitator, date_start, date_end, location, capacity, registered_count, status) VALUES
('ws_001', 'Advanced React Patterns', 'Prof. Sarah Mensah', '2024-03-01', '2024-03-03', 'Tech Campus', 50, 42, 'scheduled'),
('ws_002', 'UI/UX Design Workshop', 'Designer James', '2024-03-10', '2024-03-12', 'Design Studio', 30, 25, 'scheduled'),
('ws_003', 'Data Science Bootcamp', 'Dr. Kwame', '2024-03-15', '2024-03-22', 'Lab Building', 35, 33, 'in_progress');

INSERT INTO registrations (id, workshop_id, participant_name, email, phone, registration_date, completion_status) VALUES
('reg_001', 'ws_001', 'Ama Osei', 'ama@techbridge.edu', '+233123456789', '2024-02-01 10:30:00', 'registered'),
('reg_002', 'ws_002', 'Kofi Asante', 'kofi@techbridge.edu', '+233123456790', '2024-02-15 14:15:00', 'registered'),
('reg_003', 'ws_003', 'Grace Owusu', 'grace@techbridge.edu', '+233123456791', '2024-02-20 09:45:00', 'in_progress');
