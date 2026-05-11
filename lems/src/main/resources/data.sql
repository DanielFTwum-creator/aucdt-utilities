-- Sample Data for LEMS

-- Insert Programmes
INSERT INTO programmes (name, code, description) VALUES
('Bachelor of Science in Computer Science', 'BSCS', 'A comprehensive program in computer science'),
('Bachelor of Science in Information Technology', 'BSIT', 'Focus on IT infrastructure and systems'),
('Bachelor of Business Administration', 'BBA', 'Business management and administration'),
('Bachelor of Fine Arts', 'BFA', 'Visual arts and design program');

-- Insert Lecturers
INSERT INTO lecturers (first_name, last_name, email, department) VALUES
('John', 'Smith', 'john.smith@university.edu', 'Computer Science'),
('Sarah', 'Johnson', 'sarah.johnson@university.edu', 'Computer Science'),
('Michael', 'Williams', 'michael.williams@university.edu', 'Information Technology'),
('Emily', 'Brown', 'emily.brown@university.edu', 'Business'),
('David', 'Davis', 'david.davis@university.edu', 'Fine Arts'),
('Jessica', 'Miller', 'jessica.miller@university.edu', 'Computer Science'),
('Robert', 'Wilson', 'robert.wilson@university.edu', 'Information Technology'),
('Lisa', 'Anderson', 'lisa.anderson@university.edu', 'Business');

-- Insert Courses for BSCS
INSERT INTO courses (name, code, description, semester, programme_id) VALUES
('Introduction to Programming', 'CS101', 'Fundamentals of programming', 1, 1),
('Data Structures', 'CS201', 'Advanced data structures and algorithms', 2, 1),
('Database Management Systems', 'CS301', 'Design and implementation of databases', 3, 1),
('Web Development', 'CS401', 'Full-stack web development', 4, 1);

-- Insert Courses for BSIT
INSERT INTO courses (name, code, description, semester, programme_id) VALUES
('Network Fundamentals', 'IT101', 'Introduction to networking', 1, 2),
('System Administration', 'IT201', 'Linux and Windows server management', 2, 2),
('Cloud Computing', 'IT301', 'Cloud infrastructure and services', 3, 2);

-- Insert Courses for BBA
INSERT INTO courses (name, code, description, semester, programme_id) VALUES
('Business Management', 'BUS101', 'Principles of business management', 1, 3),
('Accounting Fundamentals', 'BUS201', 'Introduction to accounting', 2, 3),
('Marketing Strategy', 'BUS301', 'Strategic marketing planning', 3, 3);

-- Insert Courses for BFA
INSERT INTO courses (name, code, description, semester, programme_id) VALUES
('Drawing Basics', 'ART101', 'Fundamentals of drawing', 1, 4),
('Digital Design', 'ART201', 'Digital art and design', 2, 4);

-- Assign Lecturers to Courses
INSERT INTO course_lecturers (course_id, lecturer_id) VALUES
(1, 1), (1, 6),
(2, 2),
(3, 1),
(4, 6),
(5, 3),
(6, 7),
(7, 3),
(8, 4),
(9, 8),
(10, 4),
(11, 5),
(12, 5);

-- Sample Evaluations (Optional - for testing)
-- These can be populated through the application UI

