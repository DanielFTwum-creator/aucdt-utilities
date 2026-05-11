CREATE TABLE IF NOT EXISTS health_records (
  id VARCHAR(255) PRIMARY KEY,
  patient_id VARCHAR(255),
  patient_name VARCHAR(255),
  age INT,
  blood_type VARCHAR(10),
  medical_history TEXT,
  allergies TEXT,
  last_checkup_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_patient (patient_id)
);

CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(255) PRIMARY KEY,
  health_record_id VARCHAR(255),
  appointment_date DATETIME,
  doctor_name VARCHAR(255),
  department VARCHAR(100),
  reason_for_visit TEXT,
  status VARCHAR(50),
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (health_record_id) REFERENCES health_records(id),
  INDEX idx_doctor (doctor_name)
);

INSERT INTO health_records (id, patient_id, patient_name, age) VALUES
('hr_demo_001', 'pat_001', 'Patient One', 22);

INSERT INTO appointments (id, health_record_id, appointment_date, doctor_name, status) VALUES
('ap_demo_001', 'hr_demo_001', '2024-02-15 10:00:00', 'Dr. Clinic', 'scheduled');
