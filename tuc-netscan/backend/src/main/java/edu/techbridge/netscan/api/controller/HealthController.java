package edu.techbridge.netscan.api.controller;

import edu.techbridge.netscan.service.mock.MockDataService;
import edu.techbridge.netscan.service.mock.MockDataService.MockSystemHealth;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/health")
@RequiredArgsConstructor
public class HealthController {

    private final MockDataService mock;

    @GetMapping
    public ResponseEntity<MockSystemHealth> health() {
        return ResponseEntity.ok(mock.getHealth());
    }
}
