package com.example.techbridge_ict.repository;

import com.example.techbridge_ict.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByAssetIdOrderByTimestampDesc(Long assetId);
}
