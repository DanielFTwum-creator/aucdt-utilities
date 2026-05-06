package com.example.techbridge_ict.services.impl;

import com.example.techbridge_ict.model.AuditLog;
import com.example.techbridge_ict.repository.AuditLogRepository;
import com.example.techbridge_ict.services.AuditLogService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@AllArgsConstructor
@Service
@Transactional
public class AuditLogServiceImpl implements AuditLogService {
    private AuditLogRepository auditLogRepository;
    @Override
    public AuditLog create(Long assetId, String action) {
        AuditLog auditLog = new AuditLog();
        auditLog.setAssetId(assetId);
        auditLog.setAction(action);
        return auditLogRepository.save(auditLog);
    }

    @Override
    public List<AuditLog> auditLogs(Long assetId) {
        return auditLogRepository.findByAssetIdOrderByTimestampDesc(assetId);
    }
}
