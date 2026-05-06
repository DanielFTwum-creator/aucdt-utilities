CREATE TABLE IF NOT EXISTS monitored_urls (
  id VARCHAR(255) PRIMARY KEY,
  url VARCHAR(500),
  service_name VARCHAR(255),
  check_interval_seconds INT,
  status VARCHAR(50),
  last_check DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_service (service_name)
);

CREATE TABLE IF NOT EXISTS monitoring_alerts (
  id VARCHAR(255) PRIMARY KEY,
  url_id VARCHAR(255),
  alert_type VARCHAR(100),
  response_code INT,
  response_time_ms INT,
  alert_message TEXT,
  severity VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (url_id) REFERENCES monitored_urls(id),
  INDEX idx_url (url_id),
  INDEX idx_severity (severity)
);

INSERT INTO monitored_urls (id, url, service_name, check_interval_seconds, status, last_check) VALUES
('mon_001', 'https://api.aucdt.edu.gh/health', 'AUCDT API', 300, 'active', '2024-02-25 10:30:00'),
('mon_002', 'https://portal.techbridge.edu.gh/status', 'TechBridge Portal', 300, 'active', '2024-02-25 10:30:00'),
('mon_003', 'https://analytics.aucdt.edu.gh/ping', 'Analytics Service', 300, 'active', '2024-02-25 10:30:00');

INSERT INTO monitoring_alerts (id, url_id, alert_type, response_code, response_time_ms, alert_message, severity) VALUES
('alert_001', 'mon_001', 'response_timeout', 504, 5000, 'Service responding slowly', 'warning'),
('alert_002', 'mon_002', 'status_code_error', 500, 250, 'Internal server error detected', 'critical'),
('alert_003', 'mon_003', 'response_ok', 200, 120, 'Service health check OK', 'info');
