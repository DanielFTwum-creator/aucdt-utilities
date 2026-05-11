CREATE DATABASE IF NOT EXISTS analytics_dashboard;
USE analytics_dashboard;

INSERT INTO analytics_events (id, event_type, user_id, data) VALUES
('evt_001', 'page_view', 'user_001', '{"page":"/dashboard","duration":120}'),
('evt_002', 'button_click', 'user_002', '{"button":"submit_form","section":"enrollment"}'),
('evt_003', 'form_submission', 'user_003', '{"form":"application","status":"success"}');

INSERT INTO dashboards (id, dashboard_name, owner_id, config) VALUES
('dash_001', 'Admin Dashboard', 'admin_001', '{"widgets":["metrics","charts","logs"]}'),
('dash_002', 'User Analytics', 'user_001', '{"widgets":["traffic","timeline"]}'),
('dash_003', 'System Health', 'admin_002', '{"widgets":["cpu","memory","disk"]}');
