package edu.techbridge.netscan.api.controller;

import edu.techbridge.netscan.service.mock.MockDataService;
import edu.techbridge.netscan.service.mock.MockDataService.MockAuditEntry;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
public class AuditController {

    private final MockDataService mock;

    @GetMapping
    public ResponseEntity<List<MockAuditEntry>> list(
            @RequestParam(required = false) String actionType,
            @RequestParam(required = false) String actor) {
        return ResponseEntity.ok(
            mock.getAuditLog().stream()
                .filter(e -> actionType == null || e.actionType().equalsIgnoreCase(actionType))
                .filter(e -> actor == null || e.actor().equalsIgnoreCase(actor))
                .sorted(Comparator.comparing(MockAuditEntry::createdAt).reversed())
                .collect(Collectors.toList())
        );
    }
}
