-- TUC Results Management System Database v2
CREATE DATABASE IF NOT EXISTS tuc_rms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tuc_rms;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('registrar','qa_officer','lecturer','hod') NOT NULL,
  department VARCHAR(100),
  staff_id VARCHAR(50) UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS programmes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  department_id INT NOT NULL,
  programme_type ENUM('degree','diploma','certificate') NOT NULL,
  duration_years INT DEFAULT 4,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  index_number VARCHAR(30) UNIQUE NOT NULL,
  programme_id INT NOT NULL,
  level INT NOT NULL,
  semester INT NOT NULL,
  nationality VARCHAR(60) DEFAULT 'Ghanaian',
  gender ENUM('Male','Female','Other'),
  date_of_birth DATE,
  email VARCHAR(150),
  phone VARCHAR(20),
  academic_year VARCHAR(20) DEFAULT '2025/2026',
  status ENUM('active','graduated','withdrawn','deferred') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (programme_id) REFERENCES programmes(id)
);

CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_code VARCHAR(30) UNIQUE NOT NULL,
  course_name VARCHAR(200) NOT NULL,
  credit_hours INT DEFAULT 3,
  department_id INT NOT NULL,
  level INT NOT NULL,
  semester INT NOT NULL,
  programme_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id),
  FOREIGN KEY (programme_id) REFERENCES programmes(id)
);

CREATE TABLE IF NOT EXISTS lecturer_courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lecturer_id INT NOT NULL,
  course_id INT NOT NULL,
  academic_year VARCHAR(20) DEFAULT '2025/2026',
  semester INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_assignment (lecturer_id, course_id, academic_year),
  FOREIGN KEY (lecturer_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE IF NOT EXISTS results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  lecturer_id INT NOT NULL,
  academic_year VARCHAR(20) DEFAULT '2025/2026',
  semester INT NOT NULL,
  class_score DECIMAL(5,2) DEFAULT NULL,
  exam_score DECIMAL(5,2) DEFAULT NULL,
  total_score DECIMAL(5,2) GENERATED ALWAYS AS (IFNULL(class_score,0) + IFNULL(exam_score,0)) STORED,
  grade VARCHAR(5) GENERATED ALWAYS AS (
    CASE
      WHEN (IFNULL(class_score,0) + IFNULL(exam_score,0)) >= 80 THEN 'A'
      WHEN (IFNULL(class_score,0) + IFNULL(exam_score,0)) >= 70 THEN 'B+'
      WHEN (IFNULL(class_score,0) + IFNULL(exam_score,0)) >= 60 THEN 'B'
      WHEN (IFNULL(class_score,0) + IFNULL(exam_score,0)) >= 55 THEN 'C+'
      WHEN (IFNULL(class_score,0) + IFNULL(exam_score,0)) >= 50 THEN 'C'
      WHEN (IFNULL(class_score,0) + IFNULL(exam_score,0)) >= 45 THEN 'D+'
      WHEN (IFNULL(class_score,0) + IFNULL(exam_score,0)) >= 40 THEN 'D'
      ELSE 'F'
    END
  ) STORED,
  grade_point DECIMAL(3,2) GENERATED ALWAYS AS (
    CASE
      WHEN (IFNULL(class_score,0) + IFNULL(exam_score,0)) >= 80 THEN 4.00
      WHEN (IFNULL(class_score,0) + IFNULL(exam_score,0)) >= 70 THEN 3.50
      WHEN (IFNULL(class_score,0) + IFNULL(exam_score,0)) >= 60 THEN 3.00
      WHEN (IFNULL(class_score,0) + IFNULL(exam_score,0)) >= 55 THEN 2.50
      WHEN (IFNULL(class_score,0) + IFNULL(exam_score,0)) >= 50 THEN 2.00
      WHEN (IFNULL(class_score,0) + IFNULL(exam_score,0)) >= 45 THEN 1.50
      WHEN (IFNULL(class_score,0) + IFNULL(exam_score,0)) >= 40 THEN 1.00
      ELSE 0.00
    END
  ) STORED,
  remarks VARCHAR(50) GENERATED ALWAYS AS (
    CASE WHEN (IFNULL(class_score,0) + IFNULL(exam_score,0)) >= 40 THEN 'PASS' ELSE 'FAIL' END
  ) STORED,
  submitted_at TIMESTAMP DEFAULT NULL,
  status ENUM('draft','submitted','approved','rejected') DEFAULT 'draft',
  registrar_approved_at TIMESTAMP NULL,
  qa_approved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_result (student_id, course_id, academic_year),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (lecturer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(50),
  record_id INT,
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS student_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  reviewed_by INT NOT NULL,
  category ENUM('Academic Standing','Enrollment Issue','Grade Dispute','Documents','General') NOT NULL DEFAULT 'General',
  priority ENUM('Low','Medium','High','Critical') NOT NULL DEFAULT 'Medium',
  description TEXT NOT NULL,
  status ENUM('Open','In Progress','Resolved','Closed') NOT NULL DEFAULT 'Open',
  resolution TEXT,
  resolved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_sr_student (student_id),
  INDEX idx_sr_status (status),
  INDEX idx_sr_priority (priority)
);

INSERT IGNORE INTO departments (name, code) VALUES
('Digital Media and Communication Design', 'DMCD'),
('Fashion Design Technology', 'FDT'),
('Jewellery Design Technology', 'JDT'),
('Product Design and Entrepreneurship', 'PDE');

INSERT IGNORE INTO programmes (name, code, department_id, programme_type, duration_years) VALUES
('B.Tech Digital Media and Communication Design', 'BTDMCD', 1, 'degree', 4),
('B.Tech Fashion Design Technology', 'BTFDT', 2, 'degree', 4),
('BA Jewellery Design Technology', 'BAJDT', 3, 'degree', 4),
('BA Product Design and Entrepreneurship', 'BAPDE', 4, 'degree', 4),
('Certificate in Fashion Design Technology', 'CFDT', 2, 'certificate', 1),
('Diploma in Jewellery Design Technology', 'DJDT', 3, 'diploma', 2),
('Diploma in Product Design', 'DPD', 4, 'diploma', 2),
('DMCD Certificate', 'CDMCD', 1, 'certificate', 1);

INSERT IGNORE INTO users (full_name, email, password_hash, role, department, staff_id) VALUES
('Dr. Andrew Richard Owusu Addo', 'registrar@tuc.edu.gh', '$2b$10$9TX9GoXflOmKtDgtINNt7OuCeHVcNAT0HiI89rKLMhpOBVwJGsaLO', 'registrar', NULL, 'REG001'),
('QA Officer', 'qa@tuc.edu.gh', '$2b$10$9TX9GoXflOmKtDgtINNt7OuCeHVcNAT0HiI89rKLMhpOBVwJGsaLO', 'qa_officer', NULL, 'QA001'),
('Mr. Robert Bunkangsang Buchag', 'buchag@tuc.edu.gh', '$2b$10$9TX9GoXflOmKtDgtINNt7OuCeHVcNAT0HiI89rKLMhpOBVwJGsaLO', 'lecturer', 'DMCD', 'LEC001'),
('Mr. Samuel Wellington', 'wellington@tuc.edu.gh', '$2b$10$9TX9GoXflOmKtDgtINNt7OuCeHVcNAT0HiI89rKLMhpOBVwJGsaLO', 'lecturer', 'DMCD', 'LEC002'),
('Mr. Selasi Ahiabu', 'ahiabu@tuc.edu.gh', '$2b$10$9TX9GoXflOmKtDgtINNt7OuCeHVcNAT0HiI89rKLMhpOBVwJGsaLO', 'lecturer', 'DMCD', 'LEC003'),
('Mr. Bright Agbosu', 'agbosu@tuc.edu.gh', '$2b$10$9TX9GoXflOmKtDgtINNt7OuCeHVcNAT0HiI89rKLMhpOBVwJGsaLO', 'lecturer', 'DMCD', 'LEC004'),
('Mr. Daniel Boateng', 'boateng@tuc.edu.gh', '$2b$10$9TX9GoXflOmKtDgtINNt7OuCeHVcNAT0HiI89rKLMhpOBVwJGsaLO', 'lecturer', 'DMCD', 'LEC005'),
('Mr. William Daitey', 'daitey@tuc.edu.gh', '$2b$10$9TX9GoXflOmKtDgtINNt7OuCeHVcNAT0HiI89rKLMhpOBVwJGsaLO', 'lecturer', 'DMCD', 'LEC006'),
('Ms. Mary Eddy Takyi', 'takyi@tuc.edu.gh', '$2b$10$9TX9GoXflOmKtDgtINNt7OuCeHVcNAT0HiI89rKLMhpOBVwJGsaLO', 'lecturer', 'FDT', 'LEC007'),
('Ms. Florence Kushitor', 'kushitor@tuc.edu.gh', '$2b$10$9TX9GoXflOmKtDgtINNt7OuCeHVcNAT0HiI89rKLMhpOBVwJGsaLO', 'lecturer', 'FDT', 'LEC008'),
('Mr. Nutifafa Fiadzomor', 'nutifafa@tuc.edu.gh', '$2b$10$9TX9GoXflOmKtDgtINNt7OuCeHVcNAT0HiI89rKLMhpOBVwJGsaLO', 'lecturer', 'FDT', 'LEC009'),
('Mr. Selete Komla Delali Ofori', 'ofori@tuc.edu.gh', '$2b$10$9TX9GoXflOmKtDgtINNt7OuCeHVcNAT0HiI89rKLMhpOBVwJGsaLO', 'lecturer', 'JDT', 'LEC010'),
('Mr. Kwame Baah Panin Owusu', 'owusu@tuc.edu.gh', '$2b$10$9TX9GoXflOmKtDgtINNt7OuCeHVcNAT0HiI89rKLMhpOBVwJGsaLO', 'lecturer', 'JDT', 'LEC011'),
('Mr. Aaron Adjacodjoe', 'adjacodjoe@tuc.edu.gh', '$2b$10$9TX9GoXflOmKtDgtINNt7OuCeHVcNAT0HiI89rKLMhpOBVwJGsaLO', 'lecturer', 'PDE', 'LEC012'),
('Mr. Kwame Ntim Pipim', 'ntimpipim@tuc.edu.gh', '$2b$10$9TX9GoXflOmKtDgtINNt7OuCeHVcNAT0HiI89rKLMhpOBVwJGsaLO', 'lecturer', 'PDE', 'LEC013'),
('Mr. Isaac N. Ofori Obeng', 'obeng@tuc.edu.gh', '$2b$10$9TX9GoXflOmKtDgtINNt7OuCeHVcNAT0HiI89rKLMhpOBVwJGsaLO', 'lecturer', 'DMCD', 'LEC014');

INSERT IGNORE INTO courses (course_code, course_name, credit_hours, department_id, level, semester, programme_id) VALUES
('AUCDT115','Introduction to African Art & Culture',3,1,100,1,1),
('AUCDT116','Introduction to Communication Skills',3,1,100,1,1),
('AUCDT114','Basic Drawing',3,1,100,1,1),
('AUCDT117','Introduction to Information and Communication Technology',3,1,100,1,1),
('DMCD111','Introduction to Digital Media and Communication Design',3,1,100,1,1),
('DMCD112','Basic Design',3,1,100,1,1),
('DMCD113','Introduction to Computer Graphics Applications',3,1,100,1,1),
('DMCD121','Idea Development Techniques',3,1,100,2,1),
('DMCD122','Character Design',3,1,100,2,1),
('DMCD123A','Advanced Computer Graphics Applications',3,1,100,2,1),
('DMCD123B','Introduction to Typography',3,1,100,2,1),
('DMCD124','Design History',3,1,100,2,1),
('AUCDT126','Communication Skills II',3,1,100,2,1),
('AUCDT127','Information and Communication Technology II',3,1,100,2,1),
('DMCD231','Corporate Identity',3,1,200,1,1),
('DMCD232','Printing Technology',3,1,200,1,1),
('DMCD233','Typography and Basic Layout Design',3,1,200,1,1),
('DMCD234','Fundamentals of Photography',3,1,200,1,1),
('DMCD235','Introduction to Animation',3,1,200,1,1),
('DMCD236','Production Management',3,1,200,1,1),
('AUCDT231','Introduction to Entrepreneurship',3,1,200,1,1),
('DMCD241','Branding',3,1,200,2,1),
('DMCD242','Digital Print Technology',3,1,200,2,1),
('DMCD243','Basic Programming in Web Design',3,1,200,2,1),
('DMCD244','Digital Photography',3,1,200,2,1),
('DMCD245','Animation',3,1,200,2,1),
('DMCD246','Introduction to Video Production and Motion',3,1,200,2,1),
('DMCD351','Advertising Design',3,1,300,1,1),
('DMCD352','Online Media Technology',3,1,300,1,1),
('DMCD353','Copywriting',3,1,300,1,1),
('DMCD354','Video Production',3,1,300,1,1),
('DMCD355','Motion Graphics',3,1,300,1,1),
('DMCD356','Seminar in DMCD',3,1,300,1,1),
('AUCDT357','Research Methods',3,1,300,1,1),
('DMCD471','Audio Visual Post Production',3,1,400,1,1),
('DMCD472','Portfolio Development',3,1,400,1,1),
('DMCD473','Interactive Animation',3,1,400,1,1),
('AUCDT471','Project / Studio Based Research',6,1,400,1,1),
('FDT111','Introduction to Fashion',3,2,100,1,2),
('FDT112','Introduction to Textiles',3,2,100,1,2),
('FDT113','Basic Pattern Technology',3,2,100,1,2),
('FDT114','Sewing Techniques',3,2,100,1,2),
('FDT121','Introduction to Creative Design in Fashion',3,2,100,2,2),
('FDT122','Textile Design',3,2,100,2,2),
('FDT123','Pattern Adaptation',3,2,100,2,2),
('FDT124','Garment Construction',3,2,100,2,2),
('FDT125','Freehand Cutting',3,2,100,2,2),
('FDT126','Basic Design',3,2,100,2,2),
('BJDT111','Introduction to Jewellery Design',3,3,100,1,3),
('AUCDT112','Workshop Safety Practices',3,3,100,1,3),
('AUCDT113','Foundations in Technical Drawing',3,3,100,1,3),
('BPDE111','Introduction to Industrial/Product Design',3,4,100,1,4),
('BPDE121','Idea Development and Design Processes',3,4,100,2,4),
('BPDE122','Workshop Practices',3,4,100,2,4),
('BPDE123','Orthographic and Isometric Projections',3,4,100,2,4),
('BPDE124','Freehand Drawing Techniques',3,4,100,2,4);

INSERT IGNORE INTO students (full_name, index_number, programme_id, level, semester, nationality) VALUES
('Roselyn Etsa Kumashie','100156',2,100,1,'Ghanaian'),
('Naomi Obeng','100153',2,100,1,'Ghanaian'),
('Hester Amponsah Asamoah','100161',2,100,1,'Ghanaian'),
('Alhasum Louisa Owusua','100136',2,100,1,'Ghanaian'),
('Thelma Atsu','100142',2,100,1,'Ghanaian'),
('Elizabeth Amewugah','100138',2,100,1,'Ghanaian'),
('Dzifanu Hosu','100143',2,100,1,'Ghanaian'),
('Abena Boamah','100144',2,100,1,'Ghanaian'),
('Agnes Amoah','100145',2,100,1,'Ghanaian'),
('Juliana Awafu','100100',2,200,1,'Ghanaian'),
('Ileen Naa Kwarley Titus-Glover','100098',2,200,1,'Ghanaian'),
('Alberta Kpogli','100107',2,200,1,'Ghanaian'),
('Keziah Yayra Goku','100102',2,200,1,'Ghanaian'),
('Josephine Asantewaa Offei','100088',2,200,1,'Ghanaian'),
('Mrs. Evelyn Adupong Fosu','100099',2,200,1,'Ghanaian'),
('Rita Siame','100051',2,300,1,'Ghanaian'),
('Owusua Jessica','100053',2,300,1,'Ghanaian'),
('Paula Elorm Dowoli','100056',2,300,1,'Ghanaian'),
('Ellen Ohenewaa Botwe','100075',2,300,1,'Ghanaian'),
('Sharon Newman','100094',2,400,1,'Ghanaian'),
('Precious Adjo Akpalu','100023',2,400,1,'Ghanaian'),
('Mary Bebaa Sah','100011',2,400,1,'Ghanaian'),
('Issah Nurudeen Nuru','100013',2,400,1,'Ghanaian'),
('Gold Akosua Adeyemo','100160',3,100,1,'Ghanaian'),
('Basil Kpabi Nyarko','100141',3,100,1,'Ghanaian'),
('Cynthia Wornyo','100159',3,100,1,'Ghanaian'),
('Solomon Bamfo Akoto','100133',3,100,2,'Ghanaian'),
('Bright Acheampong','100170',1,100,1,'Ghanaian'),
('Kofi Mensah','100171',1,100,1,'Ghanaian'),
('Ama Serwaa','100172',1,100,1,'Ghanaian'),
('Kweku Asante','100173',1,100,1,'Ghanaian'),
('Abena Darko','100174',1,100,1,'Ghanaian'),
('Emmanuel Tetteh','100080',1,200,1,'Ghanaian'),
('Adwoa Mensah','100081',1,200,1,'Ghanaian'),
('Kwame Asante','100082',1,200,1,'Ghanaian'),
('Akosua Bonsu','100040',1,300,1,'Ghanaian'),
('Yaw Darko','100041',1,300,1,'Ghanaian'),
('Kwadwo Amponsah','100180',4,100,1,'Ghanaian'),
('Efua Quayson','100181',4,100,1,'Ghanaian'),
('Janet Yeboah Yayra','100166',5,100,1,'Ghanaian'),
('Princess Korkor','100149',5,100,1,'Ghanaian'),
('Gifty Dziedzorm Jably','100165',5,100,1,'Ghanaian'),
('Beatrice Binney','100146',5,100,1,'Ghanaian'),
('Jemimah Klenam Adamaley','100155',5,100,1,'Ghanaian'),
('Victoria Mawunyo Abla Kudoh','100154',5,100,1,'Ghanaian');

INSERT IGNORE INTO lecturer_courses (lecturer_id, course_id, academic_year, semester) VALUES
(3,7,'2025/2026',1),(3,10,'2025/2026',2),(3,24,'2025/2026',2),
(4,19,'2025/2026',1),(4,25,'2025/2026',2),(4,37,'2025/2026',1),
(5,15,'2025/2026',1),(5,17,'2025/2026',1),(5,22,'2025/2026',2),
(6,4,'2025/2026',1),(6,20,'2025/2026',1),(6,23,'2025/2026',2),
(7,2,'2025/2026',1),(7,13,'2025/2026',2),
(8,3,'2025/2026',1),(8,6,'2025/2026',1),
(9,43,'2025/2026',1),(9,47,'2025/2026',2),
(10,44,'2025/2026',1),
(11,42,'2025/2026',1),(11,46,'2025/2026',2),
(12,52,'2025/2026',1),
(13,51,'2025/2026',1),
(14,54,'2025/2026',1),(14,55,'2025/2026',2),
(15,21,'2025/2026',1),
(16,32,'2025/2026',1),(16,35,'2025/2026',1);
