-- TUC NetScan — Base Schema
-- Migration: V1__baseline_schema.sql
-- Document: TUC-ICT-SRS-2026-012

CREATE TABLE IF NOT EXISTS device (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    mac_address      VARCHAR(17)  NOT NULL,
    ip_address       VARCHAR(45)  NOT NULL,
    hostname         VARCHAR(255),
    manufacturer     VARCHAR(255),
    custom_label     VARCHAR(255),
    os_fingerprint   VARCHAR(255),
    status           VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    in_adr           BOOLEAN      NOT NULL DEFAULT FALSE,
    first_seen_at    DATETIME     NOT NULL,
    last_seen_at     DATETIME     NOT NULL,
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_mac UNIQUE (mac_address)
);

CREATE TABLE IF NOT EXISTS network_interface (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    description    VARCHAR(255),
    ip_address     VARCHAR(45),
    link_capacity_mbps INT NOT NULL DEFAULT 100,
    snmp_oid       VARCHAR(255),
    active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bandwidth_sample (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    interface_id     BIGINT       NOT NULL,
    bytes_in         BIGINT       NOT NULL DEFAULT 0,
    bytes_out        BIGINT       NOT NULL DEFAULT 0,
    utilisation_pct  DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    sampled_at       DATETIME     NOT NULL,
    CONSTRAINT fk_bw_iface FOREIGN KEY (interface_id) REFERENCES network_interface(id)
);

CREATE TABLE IF NOT EXISTS port_scan_result (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_id    BIGINT      NOT NULL,
    port         INT         NOT NULL,
    protocol     VARCHAR(5)  NOT NULL DEFAULT 'tcp',
    state        VARCHAR(20) NOT NULL,
    service_name VARCHAR(100),
    version      VARCHAR(255),
    is_new       BOOLEAN     NOT NULL DEFAULT FALSE,
    scanned_at   DATETIME    NOT NULL,
    CONSTRAINT fk_port_device FOREIGN KEY (device_id) REFERENCES device(id)
);

CREATE TABLE IF NOT EXISTS latency_sample (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_id    BIGINT         NOT NULL,
    rtt_ms       DECIMAL(10,3),
    packet_loss  DECIMAL(5,2)   NOT NULL DEFAULT 0.00,
    sampled_at   DATETIME       NOT NULL,
    CONSTRAINT fk_lat_device FOREIGN KEY (device_id) REFERENCES device(id)
);

CREATE TABLE IF NOT EXISTS alert (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    alert_type    VARCHAR(50)  NOT NULL,
    severity      VARCHAR(20)  NOT NULL,
    title         VARCHAR(255) NOT NULL,
    message       TEXT         NOT NULL,
    device_id     BIGINT,
    status        VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    ack_note      TEXT,
    acked_by      VARCHAR(100),
    acked_at      DATETIME,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alert_device FOREIGN KEY (device_id) REFERENCES device(id)
);

CREATE TABLE IF NOT EXISTS block_entry (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_id    BIGINT       NOT NULL,
    reason       TEXT         NOT NULL,
    blocked_by   VARCHAR(100) NOT NULL,
    blocked_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    unblocked_at DATETIME,
    active       BOOLEAN      NOT NULL DEFAULT TRUE,
    script_text  TEXT,
    CONSTRAINT fk_block_device FOREIGN KEY (device_id) REFERENCES device(id)
);

CREATE TABLE IF NOT EXISTS audit_log (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    actor_username  VARCHAR(100) NOT NULL,
    action_type     VARCHAR(50)  NOT NULL,
    target_id       VARCHAR(255),
    reason          TEXT         NOT NULL,
    metadata_json   TEXT,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ict_user (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    username     VARCHAR(100) NOT NULL,
    password     VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    role         VARCHAR(20)  NOT NULL DEFAULT 'ENGINEER',
    active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_username UNIQUE (username)
);

-- Indexes for performance
CREATE INDEX idx_device_status      ON device(status);
CREATE INDEX idx_device_last_seen   ON device(last_seen_at);
CREATE INDEX idx_bw_iface_time      ON bandwidth_sample(interface_id, sampled_at);
CREATE INDEX idx_port_device_time   ON port_scan_result(device_id, scanned_at);
CREATE INDEX idx_lat_device_time    ON latency_sample(device_id, sampled_at);
CREATE INDEX idx_alert_status       ON alert(status, severity);
CREATE INDEX idx_audit_actor        ON audit_log(actor_username, created_at);
