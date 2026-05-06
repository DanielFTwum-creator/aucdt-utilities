package com.lems.controller;

import com.lems.model.AuditLog;
import com.lems.model.dto.ApiResponse;
import com.lems.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {
    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAllLogs() {
        List<AuditLog> logs = auditLogService.getAllLogs();
        return ResponseEntity.ok(ApiResponse.success(logs, "Audit logs retrieved"));
    }

    @GetMapping("/event-type/{eventType}")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getLogsByEventType(@PathVariable String eventType) {
        List<AuditLog> logs = auditLogService.getLogsByEventType(eventType);
        return ResponseEntity.ok(ApiResponse.success(logs, "Audit logs retrieved"));
    }
}

