package edu.techbridge.netscan.api.controller;

import edu.techbridge.netscan.service.mock.MockDataService;
import edu.techbridge.netscan.service.mock.MockDataService.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

// ── Shared error envelope ────────────────────────────────────────────
record ApiError(int status, String code, String message, Instant timestamp, String path) {}

// ── Auth Controller ──────────────────────────────────────────────────
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
class AuthController {

    private final AuthenticationManager authManager;
    private final edu.techbridge.netscan.config.JwtService jwtService;

    record LoginRequest(@NotBlank String username, @NotBlank String password) {}
    record LoginResponse(String token, String username, String role, long expiresIn) {}

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.username(), req.password()));
        List<String> roles = auth.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        String token = jwtService.generate(req.username(), roles);
        return ResponseEntity.ok(new LoginResponse(token, req.username(),
            roles.isEmpty() ? "ENGINEER" : roles.get(0), 28800));
    }
}

// ── Device Controller ────────────────────────────────────────────────
@RestController
@RequestMapping("/api/v1/devices")
@RequiredArgsConstructor
@Slf4j
class DeviceController {

    private final MockDataService mock;

    record AnnotateRequest(@NotBlank String label) {}
    record DeviceDto(Long id, String mac, String ip, String hostname, String manufacturer,
                     String label, String status, boolean inAdr, Instant firstSeen, Instant lastSeen) {}

    @GetMapping
    public ResponseEntity<List<DeviceDto>> list(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(
            mock.getDevices().stream()
                .filter(d -> status == null || d.status().name().equalsIgnoreCase(status))
                .filter(d -> search == null ||
                    d.ip().contains(search) || d.mac().toLowerCase().contains(search.toLowerCase()) ||
                    (d.hostname() != null && d.hostname().toLowerCase().contains(search.toLowerCase())))
                .map(this::toDto)
                .collect(Collectors.toList())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeviceDto> get(@PathVariable Long id) {
        return mock.getDevice(id)
            .map(d -> ResponseEntity.ok(toDto(d)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/annotate")
    public ResponseEntity<Void> annotate(@PathVariable Long id,
                                          @Valid @RequestBody AnnotateRequest req) {
        mock.annotateDevice(id, req.label());
        return ResponseEntity.ok().build();
    }

    private DeviceDto toDto(MockDevice d) {
        return new DeviceDto(d.id(), d.mac(), d.ip(), d.hostname(), d.manufacturer(),
            d.label(), d.status().name(), d.inAdr(), d.firstSeen(), d.lastSeen());
    }
}

// ── Scan Controller ──────────────────────────────────────────────────
@RestController
@RequestMapping("/api/v1/scan")
@RequiredArgsConstructor
@Slf4j
class ScanController {

    private final MockDataService mock;
    private final edu.techbridge.netscan.ws.NetScanWebSocketHandler ws;
    private Instant lastScan = Instant.now();

    record ScanRequest(String subnet) {}
    record ScanResult(String status, String subnet, int deviceCount, Instant triggeredAt) {}

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

// ── Bandwidth Controller ─────────────────────────────────────────────
@RestController
@RequestMapping("/api/v1/bandwidth")
@RequiredArgsConstructor
@Slf4j
class BandwidthController {

    private final MockDataService mock;

    record InterfaceStatus(Long id, String name, String description, String ip,
                            int capacityMbps, double utilisationPct, long bytesIn, long bytesOut) {}

    @GetMapping("/interfaces")
    public ResponseEntity<List<InterfaceStatus>> interfaces() {
        List<InterfaceStatus> result = mock.getInterfaces().stream().map(iface -> {
            MockBwSample latest = mock.getBwByInterface(iface.name()).stream()
                .max(Comparator.comparing(MockBwSample::sampledAt))
                .orElse(null);
            return new InterfaceStatus(iface.id(), iface.name(), iface.description(),
                iface.ipAddress(), iface.capacityMbps(),
                latest != null ? latest.utilisationPct() : 0.0,
                latest != null ? latest.bytesIn() : 0L,
                latest != null ? latest.bytesOut() : 0L);
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/history")
    public ResponseEntity<List<MockBwSample>> history(
            @RequestParam(required = false) String iface,
            @RequestParam(required = false, defaultValue = "3600") int seconds) {
        Instant cutoff = Instant.now().minusSeconds(seconds);
        return ResponseEntity.ok(
            mock.getBwHistory().stream()
                .filter(s -> iface == null || iface.equals(s.interfaceName()))
                .filter(s -> s.sampledAt().isAfter(cutoff))
                .sorted(Comparator.comparing(MockBwSample::sampledAt))
                .collect(Collectors.toList())
        );
    }

    @GetMapping("/top-consumers")
    public ResponseEntity<List<Map<String, Object>>> topConsumers(
            @RequestParam(defaultValue = "10") int n) {
        // Mock top consumers based on device type
        List<Map<String, Object>> consumers = mock.getDevices().stream()
            .filter(d -> d.status() == edu.techbridge.netscan.model.Device.DeviceStatus.ACTIVE)
            .limit(n)
            .map(d -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("deviceId", d.id());
                m.put("ip", d.ip());
                m.put("hostname", d.hostname());
                m.put("label", d.label());
                m.put("estimatedMbps", Math.round((Math.random() * 20) * 10.0) / 10.0);
                return m;
            })
            .sorted(Comparator.<Map<String, Object>, Double>comparing(m -> -(Double) m.get("estimatedMbps")))
            .collect(Collectors.toList());
        return ResponseEntity.ok(consumers);
    }
}

// ── Alert Controller ─────────────────────────────────────────────────
@RestController
@RequestMapping("/api/v1/alerts")
@RequiredArgsConstructor
@Slf4j
class AlertController {

    private final MockDataService mock;

    record AckRequest(@NotBlank String note) {}

    @GetMapping
    public ResponseEntity<List<MockAlert>> list(
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(
            mock.getAlerts().stream()
                .filter(a -> severity == null || a.severity().equalsIgnoreCase(severity))
                .filter(a -> status == null || a.status().equalsIgnoreCase(status))
                .sorted(Comparator.comparing(MockAlert::createdAt).reversed())
                .collect(Collectors.toList())
        );
    }

    @PostMapping("/{id}/ack")
    public ResponseEntity<Void> ack(@PathVariable Long id,
                                     @Valid @RequestBody AckRequest req) {
        String actor = currentUser();
        boolean ok = mock.ackAlert(id, req.note(), actor);
        return ok ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    private String currentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : "unknown";
    }
}

// ── Control Controller ───────────────────────────────────────────────
@RestController
@RequestMapping("/api/v1/control")
@RequiredArgsConstructor
@Slf4j
class ControlController {

    private final MockDataService mock;

    record BlockRequest(@NotBlank String targetMac, @NotBlank String reason) {}
    record BlockResponse(Long blockId, String script, String message) {}

    @PostMapping("/block")
    public ResponseEntity<BlockResponse> block(@Valid @RequestBody BlockRequest req) {
        String actor = currentUser();
        MockDevice device = mock.getDeviceByMac(req.targetMac()).orElse(null);
        if (device == null) return ResponseEntity.notFound().build();
        mock.blockDevice(device.id(), req.reason(), actor);
        List<MockBlockEntry> blocks = mock.getBlockList();
        MockBlockEntry latest = blocks.get(blocks.size() - 1);
        log.info("[Control] {} blocked device {} — reason: {}", actor, req.targetMac(), req.reason());
        return ResponseEntity.ok(new BlockResponse(latest.id(), latest.script(),
            "Device " + req.targetMac() + " blocked. Apply the generated script on the campus gateway."));
    }

    @GetMapping("/block")
    public ResponseEntity<List<MockBlockEntry>> listBlocks() {
        return ResponseEntity.ok(mock.getBlockList());
    }

    @DeleteMapping("/block/{id}")
    public ResponseEntity<Void> unblock(@PathVariable Long id) {
        boolean ok = mock.unblockDevice(id, currentUser());
        return ok ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    private String currentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : "unknown";
    }
}

// ── Audit Controller ─────────────────────────────────────────────────
@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
class AuditController {

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

// ── Health Controller ────────────────────────────────────────────────
@RestController
@RequestMapping("/api/v1/health")
@RequiredArgsConstructor
class HealthController {

    private final MockDataService mock;

    @GetMapping
    public ResponseEntity<MockSystemHealth> health() {
        return ResponseEntity.ok(mock.getHealth());
    }
}
