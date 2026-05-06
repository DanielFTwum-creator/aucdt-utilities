CREATE DATABASE IF NOT EXISTS tsapro_mapping;
USE tsapro_mapping;

INSERT INTO mappings (id, source_timetable, target_timetable, mapping_status, reviewed_by) VALUES
('map_001', 'tt_old_001', 'tt_new_001', 'approved', 'admin_001'),
('map_002', 'tt_old_002', 'tt_new_002', 'pending_review', NULL),
('map_003', 'tt_old_003', 'tt_new_003', 'conflict_found', NULL);

INSERT INTO mapping_conflicts (id, mapping_id, conflict_type, conflict_detail, resolution_status) VALUES
('conf_001', 'map_003', 'time_overlap', 'Classes both scheduled at 10:00 AM', 'pending'),
('conf_002', 'map_002', 'room_assignment', 'Room capacity mismatch', 'pending');
