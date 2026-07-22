CREATE DATABASE IF NOT EXISTS tuc_sickbay CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tuc_sickbay;

CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_code VARCHAR(50) UNIQUE,
  full_name VARCHAR(255),
  patient_type ENUM('Student','Staff'),
  gender ENUM('Male','Female'),
  age INT,
  class_or_dept VARCHAR(255),
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(50),
  allergies TEXT,
  chronic_conditions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT,
  temperature DECIMAL(4,1),
  blood_pressure VARCHAR(20),
  pulse_rate INT,
  symptoms TEXT,
  presenting_conditions TEXT,
  severity ENUM('Mild','Moderate','Severe'),
  treatment TEXT,
  medication_dispensed_id INT NULL,
  medication_dispensed_qty INT NULL,
  disposition ENUM('Back to Class','Sent Home','Referral to Hospital','Observe in Sick Bay'),
  observed_bed_no VARCHAR(20) NULL,
  observation_end_time DATETIME NULL,
  notes TEXT,
  treated_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS medications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  category ENUM('Analgesics','Antihistamines','Inhalers','Gastrointestinal','First Aid','Supplies','Other'),
  quantity_on_hand INT,
  unit VARCHAR(50),
  reorder_threshold INT,
  batch_number VARCHAR(100),
  expiry_date DATE,
  over_stock_threshold INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referrals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  visit_id INT,
  patient_name VARCHAR(255),
  patient_id INT,
  referral_hospital VARCHAR(255),
  reason TEXT,
  status ENUM('Pending','Transferred','Discharged','Followed Up'),
  outcome_notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (visit_id) REFERENCES visits(id),
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS facility_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  equipment_name VARCHAR(255),
  status ENUM('Functional','Needs Maintenance','Non-Functional'),
  reported_issue TEXT NULL,
  reported_by VARCHAR(255),
  resolution_days INT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  action VARCHAR(255),
  category ENUM('AUTH','CLINICAL','INVENTORY','FACILITY','SYSTEM'),
  actor VARCHAR(255),
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
