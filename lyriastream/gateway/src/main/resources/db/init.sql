-- LyriaStream Database Schema
-- TUC-ICT-SRS-2026-008 v2.0 | MariaDB 10.11 | Charset: utf8mb4
-- All timestamps UTC. Table prefix: ls_

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ── ls_users ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ls_users (
    id                    BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    uuid                  VARCHAR(36)      NOT NULL,
    email                 VARCHAR(255)     NOT NULL,
    password_hash         VARCHAR(255)     NOT NULL,
    display_name          VARCHAR(100),
    role                  ENUM('GUEST','FREE','PRO','ADMIN') NOT NULL DEFAULT 'FREE',
    daily_quota           INT              NOT NULL DEFAULT 20,
    quota_used_today      INT              NOT NULL DEFAULT 0,
    email_verified        TINYINT(1)       NOT NULL DEFAULT 0,
    totp_secret           VARCHAR(255)     NULL COMMENT 'AES-256 encrypted, admins only',
    is_active             TINYINT(1)       NOT NULL DEFAULT 1,
    failed_login_attempts INT              NOT NULL DEFAULT 0,
    locked_until          DATETIME         NULL,
    last_login_at         DATETIME         NULL,
    created_at            DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_uuid  (uuid),
    UNIQUE KEY uq_users_email (email),
    INDEX idx_users_role  (role),
    INDEX idx_users_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── ls_generation_jobs ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ls_generation_jobs (
    id                   VARCHAR(36)      NOT NULL COMMENT 'UUID — returned to client as jobId',
    user_id              BIGINT UNSIGNED  NOT NULL,
    status               ENUM('PENDING','PROCESSING','STREAMING','COMPLETE','FAILED') NOT NULL DEFAULT 'PENDING',
    progress_pct         INT              NOT NULL DEFAULT 0,
    aim_job_id           VARCHAR(36)      NULL,
    prompt               TEXT             NOT NULL,
    blend_recipe_json    JSON             NULL COMMENT '{modelId: weight}',
    quality_mode         VARCHAR(20)      NULL,
    model_versions_json  JSON             NULL,
    error_message        TEXT             NULL,
    started_at           DATETIME         NULL,
    completed_at         DATETIME         NULL,
    created_at           DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_jobs_user FOREIGN KEY (user_id) REFERENCES ls_users(id) ON DELETE CASCADE,
    INDEX idx_jobs_user   (user_id),
    INDEX idx_jobs_status (status),
    INDEX idx_jobs_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── ls_tracks ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ls_tracks (
    id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    uuid             VARCHAR(36)     NOT NULL,
    user_id          BIGINT UNSIGNED NOT NULL,
    job_id           VARCHAR(36)     NOT NULL,
    title            VARCHAR(255)    NOT NULL,
    prompt           TEXT            NOT NULL,
    genre            VARCHAR(50),
    mood             JSON            NULL COMMENT '["upbeat","energetic"]',
    tempo_bpm        INT,
    key_signature    VARCHAR(10),
    duration_seconds INT              NOT NULL,
    file_path        VARCHAR(500)    NOT NULL,
    file_format      ENUM('MP3','WAV','OGG') NOT NULL DEFAULT 'WAV',
    file_size_bytes  BIGINT           NOT NULL DEFAULT 0,
    sha256_hash      CHAR(64)        NOT NULL,
    blend_recipe_json JSON           NULL,
    quality_mode     VARCHAR(20),
    seed             BIGINT          NULL,
    tags             JSON            NULL,
    is_public        TINYINT(1)      NOT NULL DEFAULT 0,
    is_deleted       TINYINT(1)      NOT NULL DEFAULT 0,
    created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_tracks_uuid (uuid),
    CONSTRAINT fk_tracks_user FOREIGN KEY (user_id) REFERENCES ls_users(id) ON DELETE CASCADE,
    INDEX idx_tracks_user    (user_id),
    INDEX idx_tracks_public  (is_public),
    INDEX idx_tracks_deleted (is_deleted),
    INDEX idx_tracks_genre   (genre),
    FULLTEXT INDEX ft_tracks_search (title, prompt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── ls_licences ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ls_licences (
    id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    track_id             BIGINT UNSIGNED NOT NULL,
    licence_uuid         VARCHAR(36)     NOT NULL,
    licence_type         ENUM('CC0','ROYALTY_FREE_TUC','COMMERCIAL') NOT NULL DEFAULT 'ROYALTY_FREE_TUC',
    spdx_identifier      VARCHAR(50),
    model_licences_json  JSON            NULL COMMENT '[{modelId, spdxIdentifier, attribution}]',
    certificate_hash     CHAR(64)        NOT NULL COMMENT 'HMAC-SHA256 of certificate JSON',
    pdf_path             VARCHAR(500),
    issued_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_licences_uuid     (licence_uuid),
    UNIQUE KEY uq_licences_track    (track_id),
    CONSTRAINT fk_licences_track FOREIGN KEY (track_id) REFERENCES ls_tracks(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── ls_models (Model Registry) ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ls_models (
    id                VARCHAR(50)     NOT NULL COMMENT 'e.g. musicgen_medium',
    display_name      VARCHAR(100)    NOT NULL,
    huggingface_slug  VARCHAR(200)    NOT NULL,
    version           VARCHAR(50)     NOT NULL,
    licence_spdx      VARCHAR(50)     NOT NULL,
    params_billions   DECIMAL(5,2),
    vram_gb           DECIMAL(4,1),
    cpu_viable        TINYINT(1)      NOT NULL DEFAULT 0,
    is_active         TINYINT(1)      NOT NULL DEFAULT 1,
    lora_adapter_path VARCHAR(500),
    load_status       ENUM('UNLOADED','LOADING','LOADED','ERROR') NOT NULL DEFAULT 'UNLOADED',
    last_health_check DATETIME,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── ls_blend_recipes ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ls_blend_recipes (
    id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name                 VARCHAR(100)    NOT NULL,
    trigger_genres       JSON            NULL,
    trigger_moods        JSON            NULL,
    min_duration_sec     SMALLINT        NOT NULL DEFAULT 0,
    max_duration_sec     SMALLINT        NOT NULL DEFAULT 999,
    weights_json         JSON            NOT NULL,
    quality_modes        JSON            NOT NULL,
    is_default           TINYINT(1)      NOT NULL DEFAULT 0,
    created_by           BIGINT UNSIGNED NULL,
    updated_at           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_recipes_name (name),
    CONSTRAINT fk_recipes_user FOREIGN KEY (created_by) REFERENCES ls_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── ls_audit_logs (INSERT ONLY — no UPDATE/DELETE) ───────────────────────────
CREATE TABLE IF NOT EXISTS ls_audit_logs (
    id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    actor_user_id BIGINT UNSIGNED NULL,
    action        VARCHAR(100)    NOT NULL COMMENT 'e.g. USER_SUSPENDED, QUOTA_OVERRIDE',
    entity_type   VARCHAR(50),
    entity_id     VARCHAR(100),
    detail_json   JSON,
    ip_address    VARCHAR(45),
    created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES ls_users(id) ON DELETE SET NULL,
    INDEX idx_audit_actor  (actor_user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Seed data ─────────────────────────────────────────────────────────────────
INSERT IGNORE INTO ls_models VALUES
    ('musicgen_medium',   'MusicGen Medium (1.5B)', 'facebook/musicgen-medium',   'v1.0', 'MIT',              1.5,  4.0,  1, 1, NULL, 'UNLOADED', NULL),
    ('musicgen_large',    'MusicGen Large (3.3B)',  'facebook/musicgen-large',    'v1.0', 'MIT',              3.3,  12.0, 0, 1, NULL, 'UNLOADED', NULL),
    ('stable_audio_open', 'Stable Audio Open',      'stabilityai/stable-audio-open-1.0', '1.0', 'LicenseRef-S-Rail', 1.0, 16.0, 0, 1, NULL, 'UNLOADED', NULL),
    ('audioldm2',         'AudioLDM 2',             'cvssp/audioldm2',             'v1.0', 'Apache-2.0',      0.712, 10.0, 0, 1, NULL, 'UNLOADED', NULL),
    ('riffusion',         'Riffusion',              'riffusion/riffusion-model-v1','v1.0', 'MIT',             0.86,  4.0,  1, 1, NULL, 'UNLOADED', NULL);

INSERT IGNORE INTO ls_blend_recipes (name, trigger_genres, trigger_moods, weights_json, quality_modes, is_default) VALUES
    ('cpu_default',   '[]', '[]',                  '{"musicgen_medium":0.70,"riffusion":0.30}', '["cpu_draft"]',            0),
    ('cpu_ambient',   '["ambient","drone","lo-fi"]', '["calm","meditative"]', '{"musicgen_medium":0.50,"riffusion":0.50}', '["cpu_draft"]', 0),
    ('cpu_energetic', '["afrobeats","edm","hiphop"]', '["energetic","upbeat"]', '{"musicgen_medium":0.80,"riffusion":0.20}', '["cpu_draft"]', 0),
    ('gpu_default',   '[]', '[]',                  '{"musicgen_large":0.55,"stable_audio_open":0.30,"riffusion":0.15}', '["gpu_fast","gpu_full"]', 1),
    ('gpu_ambient',   '["ambient","cinematic"]', '["calm","peaceful"]', '{"audioldm2":0.55,"stable_audio_open":0.30,"musicgen_large":0.15}', '["gpu_fast","gpu_full"]', 0),
    ('gpu_long_form', '[]', '[]',                  '{"stable_audio_open":0.60,"musicgen_large":0.40}', '["gpu_full"]', 0);
