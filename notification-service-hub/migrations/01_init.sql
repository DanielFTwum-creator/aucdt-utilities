CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(255) PRIMARY KEY,
  recipient_id VARCHAR(255),
  notification_type VARCHAR(100),
  title VARCHAR(255),
  message TEXT,
  priority VARCHAR(50),
  read_status BOOLEAN,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_recipient (recipient_id),
  INDEX idx_type (notification_type),
  INDEX idx_priority (priority)
);

CREATE TABLE IF NOT EXISTS notification_channels (
  id VARCHAR(255) PRIMARY KEY,
  notification_id VARCHAR(255),
  channel_type VARCHAR(100),
  delivery_status VARCHAR(50),
  delivery_timestamp DATETIME,
  response_status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (notification_id) REFERENCES notifications(id),
  INDEX idx_notification (notification_id),
  INDEX idx_channel (channel_type),
  INDEX idx_status (delivery_status)
);

INSERT INTO notifications (id, recipient_id, notification_type, title, message, priority, read_status) VALUES
('not_001', 'std_001', 'grade_released', 'Grade Released', 'Your grades for DS101 are now available', 'normal', false),
('not_002', 'fac_001', 'system_alert', 'System Maintenance', 'Server maintenance scheduled for 2024-03-01', 'high', true),
('not_003', 'usr_001', 'course_reminder', 'Course Reminder', 'Enrollment deadline for Spring semester is tomorrow', 'normal', false);

INSERT INTO notification_channels (id, notification_id, channel_type, delivery_status, delivery_timestamp, response_status) VALUES
('chan_001', 'not_001', 'email', 'delivered', '2024-02-25 14:30:00', 'opened'),
('chan_002', 'not_002', 'sms', 'delivered', '2024-02-25 12:00:00', 'acknowledged'),
('chan_003', 'not_003', 'in_app', 'delivered', '2024-02-24 18:45:00', 'pending');
