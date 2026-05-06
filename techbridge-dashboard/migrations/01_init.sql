CREATE DATABASE IF NOT EXISTS dashboard;
USE dashboard;

INSERT INTO widgets (id, title, widget_type, config, position) VALUES
('wid_001', 'User Growth Chart', 'chart', '{"chartType":"line"}', 1),
('wid_002', 'Revenue Widget', 'metric', '{"color":"green"}', 2),
('wid_003', 'System Health', 'status', '{"updateInterval":30}', 3);

INSERT INTO metrics (id, widget_id, metric_name, metric_value) VALUES
('met_001', 'wid_001', 'new_users', 425.50),
('met_002', 'wid_002', 'daily_revenue', 18750.00),
('met_003', 'wid_003', 'uptime_percent', 99.98);
