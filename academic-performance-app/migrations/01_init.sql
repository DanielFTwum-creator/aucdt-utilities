CREATE DATABASE IF NOT EXISTS academic_performance;
USE academic_performance;

INSERT INTO students (id, full_name, student_id, program, enrollment_date) VALUES
('stu_001', 'Ama Owusu', 'STU001', 'Computer Science', '2024-09-15'),
('stu_002', 'Kofi Mensah', 'STU002', 'Engineering', '2024-09-15'),
('stu_003', 'Yaa Boateng', 'STU003', 'Business Administration', '2024-09-15');

INSERT INTO grades (id, student_id, course_code, course_name, grade, points, semester) VALUES
('grade_001', 'stu_001', 'CS101', 'Introduction to Computing', 'A', 4.0, 'Fall 2024'),
('grade_002', 'stu_001', 'CS102', 'Data Structures', 'B', 3.0, 'Fall 2024'),
('grade_003', 'stu_002', 'ENG101', 'Engineering Mechanics', 'A', 4.0, 'Fall 2024');
