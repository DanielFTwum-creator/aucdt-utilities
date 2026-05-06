CREATE DATABASE IF NOT EXISTS tsapro;
USE tsapro;

INSERT INTO timetables (id, course_code, instructor, day_of_week, start_time, end_time, location) VALUES
('tt_001', 'CS101', 'Dr. Ama Owusu', 'Monday', '08:00:00', '09:30:00', 'Room 301'),
('tt_002', 'MATH201', 'Prof. Kofi Mensah', 'Tuesday', '10:00:00', '11:30:00', 'Hall A'),
('tt_003', 'PHYS101', 'Dr. Yaa Boateng', 'Wednesday', '14:00:00', '15:30:00', 'Lab 2');

INSERT INTO allocations (id, timetable_id, student_id, status) VALUES
('alloc_001', 'tt_001', 'STU001', 'enrolled'),
('alloc_002', 'tt_002', 'STU002', 'enrolled'),
('alloc_003', 'tt_003', 'STU003', 'waitlisted');
