package com.lems.service;

import com.lems.model.AuditLog;
import com.lems.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {
    private final AuditLogRepository auditLogRepository;

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<AuditLog> getLogsByEventType(String eventType) {
        return auditLogRepository.findByEventType(eventType);
    }

    public AuditLog createLog(AuditLog log) {
        return auditLogRepository.save(log);
    }
}

