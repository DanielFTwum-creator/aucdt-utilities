-- aucdt-msee-aptitude-test — schema
-- Reconstructed from server.ts queries (the previous init.sql was a 17-byte
-- corrupt file). Load on the production MariaDB (TUC stack, port 3307):
--   mysql -P 3307 msee_test_db < db/init.sql
-- Google SSO auto-provisions a users row on first sign-in (password_hash gets a
-- non-matching sentinel), so no password is required for Google logins.

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'student',
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS exams (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  subject     VARCHAR(255),
  questions   LONGTEXT     NOT NULL,          -- JSON stored as text; parsed in the app
  created_by  INT,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS exam_progress (
  user_id    INT NOT NULL,
  exam_id    INT NOT NULL,
  answers    LONGTEXT,                        -- JSON stored as text
  time_left  INT,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, exam_id)              -- required by the ON DUPLICATE KEY UPDATE upsert
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS audit_logs (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT,
  action     VARCHAR(100) NOT NULL,
  details    TEXT,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
