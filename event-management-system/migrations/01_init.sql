CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(255) PRIMARY KEY,
  event_name VARCHAR(255),
  event_type VARCHAR(100),
  event_date DATE,
  location VARCHAR(255),
  capacity INT,
  registered_attendees INT,
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type (event_type),
  INDEX idx_date (event_date),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS registrations (
  id VARCHAR(255) PRIMARY KEY,
  event_id VARCHAR(255),
  attendee_name VARCHAR(255),
  email VARCHAR(255),
  registration_date DATETIME,
  attendance_status VARCHAR(50),
  feedback_score INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id),
  INDEX idx_event (event_id),
  INDEX idx_attendance (attendance_status)
);

INSERT INTO events (id, event_name, event_type, event_date, location, capacity, registered_attendees, status) VALUES
('evt_001', 'Graduation Ceremony 2024', 'ceremony', '2024-05-25', 'Convention Center', 2000, 1850, 'scheduled'),
('evt_002', 'Tech Innovation Summit', 'conference', '2024-04-10', 'Grand Hall', 500, 445, 'scheduled'),
('evt_003', 'Sports Day', 'sports', '2024-03-30', 'Sports Complex', 1000, 920, 'scheduled');

INSERT INTO registrations (id, event_id, attendee_name, email, registration_date, attendance_status, feedback_score) VALUES
('reg_evt_001', 'evt_001', 'Kwame Mensah', 'kwame@aucdt.edu', '2024-02-01 10:30:00', 'confirmed', 5),
('reg_evt_002', 'evt_002', 'Abena Asante', 'abena@aucdt.edu', '2024-03-15 14:20:00', 'confirmed', 4),
('reg_evt_003', 'evt_003', 'Kofi Osei', 'kofi@aucdt.edu', '2024-02-10 09:15:00', 'pending', NULL);
