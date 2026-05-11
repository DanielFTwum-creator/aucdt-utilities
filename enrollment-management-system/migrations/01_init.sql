CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(255) PRIMARY KEY,
  matric_number VARCHAR(100),
  full_name VARCHAR(255),
  program VARCHAR(100),
  admission_status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_matric (matric_number),
  INDEX idx_status (admission_status)
);

CREATE TABLE IF NOT EXISTS enrollment_records (
  id VARCHAR(255) PRIMARY KEY,
  student_id VARCHAR(255),
  academic_year VARCHAR(20),
  semester VARCHAR(20),
  courses_enrolled INT,
  gpa DECIMAL(3,2),
  enrollment_status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  INDEX idx_student (student_id),
  INDEX idx_year (academic_year)
);

INSERT INTO students (id, matric_number, full_name, program, admission_status) VALUES
('std_001', 'MAT2024001', 'Akosua Asante', 'Information Technology', 'active'),
('std_002', 'MAT2024002', 'Ekow Mensah', 'Business Administration', 'active'),
('std_003', 'MAT2024003', 'Sena Owusu', 'Engineering', 'active');

INSERT INTO enrollment_records (id, student_id, academic_year, semester, courses_enrolled, gpa, enrollment_status) VALUES
('enr_001', 'std_001', '2023-2024', '1', 6, 3.7, 'active'),
('enr_002', 'std_002', '2023-2024', '1', 5, 3.4, 'active'),
('enr_003', 'std_003', '2023-2024', '1', 7, 3.9, 'active');
