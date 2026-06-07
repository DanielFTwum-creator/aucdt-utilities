package edu.techbridge.netscan.api.controller;

import edu.techbridge.netscan.service.mock.MockDataService;
import edu.techbridge.netscan.ws.NetScanWebSocketHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1/scan")
@RequiredArgsConstructor
@Slf4j
public class ScanController {

    private final MockDataService mock;
    private final NetScanWebSocketHandler ws;
    private Instant lastScan = Instant.now();

    public record ScanRequest(String subnet) {}
    public record ScanResult(String status, String subnet, int deviceCount, Instant triggeredAt) {}

    @PostMapping("/trigger")
    public ResponseEntity<ScanResult> trigger(@RequestBody(required = false) ScanRequest req) {
        if (Instant.now().isBefore(lastScan.plusSeconds(60))) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
        }
        lastScan = Instant.now();
        String subnet = req != null && req.subnet() != null ? req.subnet() : "192.168.1.0/24";
        ws.broadcast("{\"type\":\"SCAN_STARTED\",\"subnet\":\"" + subnet + "\",\"timestamp\":\"" + Instant.now() + "\"}");
        log.info("[Scan] Manual scan triggered on subnet {} by {}", subnet, currentUser());
        return ResponseEntity.ok(new ScanResult("STARTED", subnet, mock.getDevices().size(), Instant.now()));
    }

    private String currentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : "unknown";
    }
}
