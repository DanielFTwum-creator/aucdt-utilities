CREATE DATABASE IF NOT EXISTS presentation_platform;
USE presentation_platform;

INSERT INTO presentations (id, title, creator_id, description, status) VALUES
('pres_001', 'TechBridge Introduction 2026', 'creator_001', 'Overview of TechBridge programs and initiatives', 'published'),
('pres_002', 'Digital Transformation in Education', 'creator_002', 'Exploring innovative teaching methodologies', 'draft'),
('pres_003', 'AI and Machine Learning Workshop', 'creator_003', 'Hands-on ML techniques and applications', 'published');

INSERT INTO slides (id, presentation_id, slide_number, slide_title, content, layout_type) VALUES
('slide_001', 'pres_001', 1, 'Welcome to TechBridge', 'Building future tech leaders', 'title_slide'),
('slide_002', 'pres_001', 2, 'Our Programs', 'Computer Science, Engineering, Design', 'two_column'),
('slide_003', 'pres_002', 1, 'Digital Transformation', 'Adapting education for the digital age', 'title_slide');
