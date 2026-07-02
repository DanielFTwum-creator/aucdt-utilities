package gh.edu.techbridge.wms.netscan;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

/**
 * Scan trigger endpoint. Phase 1: records the intent in the audit log.
 * Real network scanning (nmap/SNMP integration) is a Phase 2 concern.
 */
@RestController
@RequestMapping("/api/v1/netscan/scan")
public class NsScanController {

    private final NetScanService svc;
    private volatile Instant lastScan = Instant.EPOCH;

    public NsScanController(NetScanService svc) { this.svc = svc; }

    public record ScanRequest(String subnet) {}
    public record ScanResult(String status, String subnet, int deviceCount, Instant triggeredAt) {}

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        NetScanService.HealthSnapshot h = svc.getHealth();
        return ResponseEntity.ok(java.util.Map.of(
                "activeDevices",    h.activeDevices(),
                "rogueDevices",     h.rogueDevices(),
                "activeAlerts",     h.activeAlerts(),
                "wanUtilisationPct", h.wanUtilisationPct(),
                "lastScan",         h.checkedAt().toString(),
                "dbOk",             true
        ));
    }

    @PostMapping("/trigger")
    public ResponseEntity<ScanResult> trigger(@RequestBody(required = false) ScanRequest req,
                                               Authentication auth) {
        if (Instant.now().isBefore(lastScan.plusSeconds(60))) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
        }
        lastScan = Instant.now();
        String subnet = (req != null && req.subnet() != null) ? req.subnet() : "192.168.1.0/24";
        svc.recordScan(subnet, auth.getName());
        int deviceCount = svc.getAllDevices().size();
        return ResponseEntity.ok(new ScanResult("STARTED", subnet, deviceCount, lastScan));
    }
}
