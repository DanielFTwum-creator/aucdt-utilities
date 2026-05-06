CREATE TABLE IF NOT EXISTS hostels (
  id VARCHAR(255) PRIMARY KEY,
  hostel_name VARCHAR(255),
  location VARCHAR(255),
  total_rooms INT,
  occupied_rooms INT,
  gender_type VARCHAR(50),
  warden_name VARCHAR(255),
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_location (location)
);

CREATE TABLE IF NOT EXISTS room_assignments (
  id VARCHAR(255) PRIMARY KEY,
  hostel_id VARCHAR(255),
  room_number VARCHAR(50),
  student_id VARCHAR(255),
  student_name VARCHAR(255),
  check_in_date DATE,
  check_out_date DATE,
  room_condition VARCHAR(50),
  assignment_status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id),
  INDEX idx_hostel (hostel_id)
);

INSERT INTO hostels (id, hostel_name, location, total_rooms, occupied_rooms, status) VALUES
('hst_demo_001', 'Main Hostel', 'Campus Ground', 200, 150, 'active');

INSERT INTO room_assignments (id, hostel_id, room_number, student_id, student_name, check_in_date, assignment_status) VALUES
('ra_demo_001', 'hst_demo_001', 'A101', 'std_001', 'Student One', '2024-01-05', 'assigned');
