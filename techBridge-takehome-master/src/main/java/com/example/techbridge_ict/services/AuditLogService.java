package com.example.techbridge_ict.services;

import com.example.techbridge_ict.model.AuditLog;

import java.util.List;

public interface AuditLogService {
     public AuditLog create(Long assetId, String action);
    public List<AuditLog> auditLogs(Long assetId);
}
