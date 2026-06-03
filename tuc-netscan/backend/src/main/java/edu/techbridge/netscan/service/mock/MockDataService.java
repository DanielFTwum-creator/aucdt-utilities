package edu.techbridge.netscan.service.mock;

import edu.techbridge.netscan.model.Device;
import edu.techbridge.netscan.model.Device.DeviceStatus;
import edu.techbridge.netscan.ws.NetScanWebSocketHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * MockDataService — activated when netscan.mock.enabled=true (dev profile).
 * Seeds realistic TUC campus network data and drives live simulation.
 */
@Slf4j
@Service
@ConditionalOnProperty(name = "netscan.mock.enabled", havingValue = "true")
@RequiredArgsConstructor
public class MockDataService {

    @org.springframework.beans.factory.annotation.Autowired
    @org.springframework.context.annotation.Lazy
    private NetScanWebSocketHandler wsHandler;

    private final AtomicLong idSeq = new AtomicLong(1);
    private final Map<Long, MockDevice> devices = new ConcurrentHashMap<>();
    private final List<MockAlert> alerts = Collections.synchronizedList(new ArrayList<>());
    private final List<MockBwSample> bwHistory = Collections.synchronizedList(new ArrayList<>());
    private final List<MockAuditEntry> auditLog = Collections.synchronizedList(new ArrayList<>());
    private final List<MockBlockEntry> blockList = Collections.synchronizedList(new ArrayList<>());
    private final Random rng = new Random();

    // ── Seed data ────────────────────────────────────────────────────

    private static final List<DeviceSeed> SEEDS = List.of(
        new DeviceSeed("00:1A:2B:3C:4D:01", "192.168.1.1",  "tuc-gateway",       "Cisco Systems",       "Cisco ISR 4321 Router",     true,  DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:02", "192.168.1.2",  "tuc-core-switch",   "Cisco Systems",       "Cisco Catalyst 3750 Switch", true, DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:03", "192.168.1.3",  "tuc-wifi-ap-main",  "Ubiquiti Networks",   "UniFi AP AC Pro",            true, DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:04", "192.168.1.4",  "tuc-wifi-ap-lab",   "Ubiquiti Networks",   "UniFi AP AC Lite",           true, DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:05", "192.168.1.5",  "tuc-fileserver",    "Dell Technologies",   "Dell PowerEdge R740",        true, DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:06", "192.168.1.6",  "tuc-moodle-lms",    "HP Inc.",             "HP ProLiant DL380 Gen10",    true, DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:07", "192.168.1.7",  "tuc-print-admin",   "Canon Inc.",          "Canon imageRUNNER ADVANCE",  true, DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:08", "192.168.1.8",  "admin-pc-ict",      "Dell Technologies",   "Dell OptiPlex 7090",         true, DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:09", "192.168.1.10", "lab-pc-01",         "Lenovo",              "ThinkCentre M90",            true, DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:0A", "192.168.1.11", "lab-pc-02",         "Lenovo",              "ThinkCentre M90",            true, DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:0B", "192.168.1.12", "lab-pc-03",         "Lenovo",              "ThinkCentre M90",            true, DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:0C", "192.168.1.13", "lab-pc-04",         "Lenovo",              "ThinkCentre M90",            true, DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:0D", "192.168.1.20", "student-laptop-001","Apple Inc.",          "MacBook Air M2",             false, DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:0E", "192.168.1.21", "student-laptop-002","Samsung Electronics", "Galaxy Book Pro",            false, DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:0F", "192.168.1.22", "student-phone-001", "Apple Inc.",          "iPhone 14 Pro",              false, DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:10", "192.168.1.23", "student-phone-002", "Samsung Electronics", "Galaxy S23",                 false, DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:11", "192.168.1.24", "student-phone-003", "Transsion Holdings",  "Tecno Spark 20",             false, DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:12", "192.168.1.30", "cctv-cam-01",       "Hikvision",           "DS-2CD2143G2-I Camera",      true,  DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:13", "192.168.1.31", "cctv-cam-02",       "Hikvision",           "DS-2CD2143G2-I Camera",      true,  DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:14", "192.168.1.40", "iot-smartboard-01", "Promethean",          "ActivPanel 9 Premium",       true,  DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:15", "192.168.1.41", "iot-smartboard-02", "Promethean",          "ActivPanel 9 Premium",       true,  DeviceStatus.ACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:16", "192.168.1.50", "unknown-device-01", "Unknown",             null,                         false, DeviceStatus.ROGUE),
        new DeviceSeed("00:1A:2B:3C:4D:17", "192.168.1.99", "blocked-device-01", "Realtek Semiconductor","Unknown PC",               false, DeviceStatus.BLOCKED),
        new DeviceSeed("00:1A:2B:3C:4D:18", "192.168.1.100","old-device-01",     "Intel Corporate",     "Old Desktop",                false, DeviceStatus.INACTIVE),
        new DeviceSeed("00:1A:2B:3C:4D:19", "192.168.1.25", "student-laptop-003","Hewlett Packard",     "HP Pavilion 15",             false, DeviceStatus.ACTIVE)
    );

    private static final List<InterfaceSeed> INTERFACES = List.of(
        new InterfaceSeed(1L, "WAN-Upstream",     "Internet uplink — MTN Fibre", "196.47.12.1",   100),
        new InterfaceSeed(2L, "LAN-Core",         "Core campus switch trunk",     "192.168.1.1",   1000),
        new InterfaceSeed(3L, "WiFi-Main-Hall",   "Main hall wireless AP",        "192.168.1.3",   300),
        new InterfaceSeed(4L, "WiFi-Computer-Lab","Computer lab wireless AP",     "192.168.1.4",   300),
        new InterfaceSeed(5L, "VLAN-Admin",       "Administrative VLAN",          "192.168.2.1",   100)
    );

    // ── Lifecycle ────────────────────────────────────────────────────

    @EventListener(ApplicationReadyEvent.class)
    public void seed() {
        log.info("[MockDataService] Seeding {} campus devices", SEEDS.size());
        Instant now = Instant.now();
        for (DeviceSeed s : SEEDS) {
            long id = idSeq.getAndIncrement();
            Instant firstSeen = now.minus(rng.nextInt(90), ChronoUnit.DAYS);
            devices.put(id, new MockDevice(id, s.mac(), s.ip(), s.hostname(),
                s.manufacturer(), s.label(), s.status(), s.inAdr(),
                firstSeen, s.status() == DeviceStatus.INACTIVE ? firstSeen.plus(1, ChronoUnit.DAYS) : now));
        }

        // Seed initial alerts
        seedAlert("ROGUE_DEVICE", "CRITICAL", "Rogue Device Detected",
            "Unknown device 00:1A:2B:3C:4D:16 appeared on 192.168.1.50 — not in ADR.", 22L);
        seedAlert("BANDWIDTH", "WARNING", "WAN Uplink Approaching Capacity",
            "WAN-Upstream utilisation at 87% for 5 consecutive samples.", null);
        seedAlert("PORT_CHANGE", "WARNING", "New Open Port Detected",
            "Port 23 (Telnet) opened on 192.168.1.40 (iot-smartboard-01).", 20L);
        seedAlert("LATENCY", "INFO", "Elevated Latency — WiFi Main Hall",
            "RTT to WiFi-Main-Hall AP averaging 210ms over last 5 minutes.", 3L);

        // Seed block entry for blocked device
        blockList.add(new MockBlockEntry(1L, 23L, "00:1A:2B:3C:4D:17",
            "Torrenting traffic detected consuming 40% of WAN bandwidth during lecture hours.",
            "daniel.twum", Instant.now().minus(2, ChronoUnit.DAYS), null, true,
            generateFirewallScript("192.168.1.99", "00:1A:2B:3C:4D:17")));

        // Seed audit log
        auditLog.add(new MockAuditEntry(1L, "daniel.twum", "BLOCK",
            "00:1A:2B:3C:4D:17", "Torrenting — excessive bandwidth consumption.", now.minus(2, ChronoUnit.DAYS)));
        auditLog.add(new MockAuditEntry(2L, "daniel.twum", "SCAN",
            "192.168.1.0/24", "Manual scan triggered.", now.minus(1, ChronoUnit.HOURS)));

        // Seed historical bandwidth
        seedBandwidthHistory();

        log.info("[MockDataService] Seed complete. {} devices, {} alerts, {} bw samples",
            devices.size(), alerts.size(), bwHistory.size());
    }

    // ── Scheduled simulation ────────────────────────────────────────

    @Scheduled(fixedDelayString = "${netscan.scan.interval-seconds:60}000")
    public void simulateScanCycle() {
        log.debug("[MockDataService] Simulating scan cycle");
        // Randomly flip a student device online/offline
        devices.values().stream()
            .filter(d -> !d.inAdr())
            .filter(d -> d.status() == DeviceStatus.ACTIVE || d.status() == DeviceStatus.INACTIVE)
            .skip(rng.nextInt(5))
            .findFirst()
            .ifPresent(d -> {
                DeviceStatus newStatus = d.status() == DeviceStatus.ACTIVE ? DeviceStatus.INACTIVE : DeviceStatus.ACTIVE;
                devices.put(d.id(), d.withStatus(newStatus).withLastSeen(Instant.now()));
            });

        wsHandler.broadcast("{\"type\":\"SCAN_COMPLETE\",\"timestamp\":\"" + Instant.now() + "\",\"deviceCount\":" + devices.size() + "}");
    }

    @Scheduled(fixedDelayString = "${netscan.scan.interval-seconds:30}000")
    public void simulateBandwidthSample() {
        for (InterfaceSeed iface : INTERFACES) {
            double base = switch (iface.name()) {
                case "WAN-Upstream"     -> 65 + rng.nextGaussian() * 15;
                case "LAN-Core"        -> 20 + rng.nextGaussian() * 8;
                case "WiFi-Main-Hall"  -> 45 + rng.nextGaussian() * 20;
                case "WiFi-Computer-Lab" -> 30 + rng.nextGaussian() * 10;
                default                -> 10 + rng.nextGaussian() * 5;
            };
            double pct = Math.max(0, Math.min(100, base));
            long bytesIn  = (long)(pct / 100.0 * iface.capacityMbps() * 1_000_000 / 8 * 30);
            long bytesOut = (long)(bytesIn * 0.3);
            bwHistory.add(new MockBwSample(iface.id(), iface.name(), bytesIn, bytesOut, pct, Instant.now()));
        }

        // Occasionally fire a bandwidth alert
        if (rng.nextDouble() < 0.1) {
            seedAlert("BANDWIDTH", "WARNING", "WAN Uplink Spike Detected",
                "WAN-Upstream hit " + (int)(80 + rng.nextInt(18)) + "% utilisation.", null);
            wsHandler.broadcast("{\"type\":\"ALERT\",\"severity\":\"WARNING\",\"message\":\"Bandwidth spike on WAN uplink\"}");
        }
    }

    // ── Public query API (used by controllers) ────────────────────

    public List<MockDevice> getDevices() { return new ArrayList<>(devices.values()); }

    public Optional<MockDevice> getDevice(Long id) { return Optional.ofNullable(devices.get(id)); }

    public Optional<MockDevice> getDeviceByMac(String mac) {
        return devices.values().stream().filter(d -> d.mac().equalsIgnoreCase(mac)).findFirst();
    }

    public void annotateDevice(Long id, String label) {
        MockDevice d = devices.get(id);
        if (d != null) devices.put(id, d.withLabel(label));
    }

    public void blockDevice(Long deviceId, String reason, String actor) {
        MockDevice d = devices.get(deviceId);
        if (d == null) return;
        devices.put(deviceId, d.withStatus(DeviceStatus.BLOCKED));
        String script = generateFirewallScript(d.ip(), d.mac());
        blockList.add(new MockBlockEntry(blockList.size() + 1L, deviceId, d.mac(),
            reason, actor, Instant.now(), null, true, script));
        auditLog.add(new MockAuditEntry(auditLog.size() + 1L, actor, "BLOCK", d.mac(), reason, Instant.now()));
    }

    public boolean unblockDevice(Long blockId, String actor) {
        return blockList.stream()
            .filter(b -> b.id().equals(blockId) && b.active())
            .findFirst()
            .map(b -> {
                blockList.set(blockList.indexOf(b), b.withActive(false).withUnblockedAt(Instant.now()));
                MockDevice d = devices.get(b.deviceId());
                if (d != null) devices.put(d.id(), d.withStatus(DeviceStatus.ACTIVE));
                auditLog.add(new MockAuditEntry(auditLog.size() + 1L, actor, "UNBLOCK", b.mac(), "Device unblocked.", Instant.now()));
                return true;
            }).orElse(false);
    }

    public List<MockAlert> getAlerts() { return new ArrayList<>(alerts); }

    public boolean ackAlert(Long id, String note, String actor) {
        return alerts.stream()
            .filter(a -> a.id().equals(id) && "ACTIVE".equals(a.status()))
            .findFirst()
            .map(a -> {
                alerts.set(alerts.indexOf(a), a.withStatus("ACKNOWLEDGED").withAckNote(note).withAckedBy(actor).withAckedAt(Instant.now()));
                auditLog.add(new MockAuditEntry(auditLog.size() + 1L, actor, "ACK_ALERT", String.valueOf(id), note, Instant.now()));
                return true;
            }).orElse(false);
    }

    public List<MockBwSample> getBwHistory() { return new ArrayList<>(bwHistory); }

    public List<MockBwSample> getBwByInterface(String ifaceName) {
        return bwHistory.stream().filter(s -> s.interfaceName().equals(ifaceName)).collect(Collectors.toList());
    }

    public List<InterfaceSeed> getInterfaces() { return INTERFACES; }

    public List<MockAuditEntry> getAuditLog() { return new ArrayList<>(auditLog); }

    public List<MockBlockEntry> getBlockList() { return new ArrayList<>(blockList); }

    public MockSystemHealth getHealth() {
        long active = devices.values().stream().filter(d -> d.status() == DeviceStatus.ACTIVE).count();
        long rogue  = devices.values().stream().filter(d -> d.status() == DeviceStatus.ROGUE).count();
        long alertCount = alerts.stream().filter(a -> "ACTIVE".equals(a.status())).count();
        double wanPct = bwHistory.stream()
            .filter(s -> "WAN-Upstream".equals(s.interfaceName()))
            .sorted(Comparator.comparing(MockBwSample::sampledAt).reversed())
            .findFirst().map(MockBwSample::utilisationPct).orElse(0.0);
        return new MockSystemHealth(true, true, active, rogue, alertCount, wanPct, Instant.now());
    }

    // ── Internal helpers ─────────────────────────────────────────────

    private void seedAlert(String type, String severity, String title, String message, Long deviceId) {
        long id = alerts.size() + 1L;
        alerts.add(new MockAlert(id, type, severity, title, message, deviceId,
            "ACTIVE", null, null, null, Instant.now().minus(rng.nextInt(60), ChronoUnit.MINUTES)));
    }

    private void seedBandwidthHistory() {
        Instant cursor = Instant.now().minus(24, ChronoUnit.HOURS);
        while (cursor.isBefore(Instant.now())) {
            for (InterfaceSeed iface : INTERFACES) {
                double pct = Math.max(0, Math.min(100,
                    (iface.name().equals("WAN-Upstream") ? 55 : 20) + rng.nextGaussian() * 15));
                long bi = (long)(pct / 100.0 * iface.capacityMbps() * 1_000_000 / 8 * 30);
                bwHistory.add(new MockBwSample(iface.id(), iface.name(), bi, (long)(bi * 0.3), pct, cursor));
            }
            cursor = cursor.plus(30, ChronoUnit.SECONDS);
        }
    }

    private String generateFirewallScript(String ip, String mac) {
        return """
            #!/bin/bash
            # TUC NetScan — Generated Block Script
            # Generated: %s
            # Target IP: %s | MAC: %s
            # Apply on campus gateway as root.

            # Block by IP
            iptables -I FORWARD -s %s -j DROP
            iptables -I FORWARD -d %s -j DROP

            # Block by MAC (on same-segment traffic)
            iptables -I FORWARD -m mac --mac-source %s -j DROP

            echo "Block rule applied for %s (%s)"
            """.formatted(Instant.now(), ip, mac, ip, ip, mac, ip, mac);
    }

    // ── Record types ─────────────────────────────────────────────────

    public record DeviceSeed(String mac, String ip, String hostname, String manufacturer, String label, boolean inAdr, DeviceStatus status) {}
    public record InterfaceSeed(Long id, String name, String description, String ipAddress, int capacityMbps) {}

    public record MockDevice(Long id, String mac, String ip, String hostname, String manufacturer,
                              String label, DeviceStatus status, boolean inAdr,
                              Instant firstSeen, Instant lastSeen) {
        public MockDevice withStatus(DeviceStatus s) { return new MockDevice(id, mac, ip, hostname, manufacturer, label, s, inAdr, firstSeen, lastSeen); }
        public MockDevice withLastSeen(Instant t)    { return new MockDevice(id, mac, ip, hostname, manufacturer, label, status, inAdr, firstSeen, t); }
        public MockDevice withLabel(String l)        { return new MockDevice(id, mac, ip, hostname, manufacturer, l, status, inAdr, firstSeen, lastSeen); }
    }

    public record MockAlert(Long id, String alertType, String severity, String title, String message,
                             Long deviceId, String status, String ackNote, String ackedBy,
                             Instant ackedAt, Instant createdAt) {
        public MockAlert withStatus(String s)    { return new MockAlert(id, alertType, severity, title, message, deviceId, s, ackNote, ackedBy, ackedAt, createdAt); }
        public MockAlert withAckNote(String n)   { return new MockAlert(id, alertType, severity, title, message, deviceId, status, n, ackedBy, ackedAt, createdAt); }
        public MockAlert withAckedBy(String u)   { return new MockAlert(id, alertType, severity, title, message, deviceId, status, ackNote, u, ackedAt, createdAt); }
        public MockAlert withAckedAt(Instant t)  { return new MockAlert(id, alertType, severity, title, message, deviceId, status, ackNote, ackedBy, t, createdAt); }
    }

    public record MockBwSample(Long interfaceId, String interfaceName, long bytesIn, long bytesOut,
                                double utilisationPct, Instant sampledAt) {}

    public record MockAuditEntry(Long id, String actor, String actionType, String targetId,
                                  String reason, Instant createdAt) {}

    public record MockBlockEntry(Long id, Long deviceId, String mac, String reason, String blockedBy,
                                  Instant blockedAt, Instant unblockedAt, boolean active, String script) {
        public MockBlockEntry withActive(boolean a)       { return new MockBlockEntry(id, deviceId, mac, reason, blockedBy, blockedAt, unblockedAt, a, script); }
        public MockBlockEntry withUnblockedAt(Instant t)  { return new MockBlockEntry(id, deviceId, mac, reason, blockedBy, blockedAt, t, active, script); }
    }

    public record MockSystemHealth(boolean dbOk, boolean redisOk, long activeDevices, long rogueDevices,
                                    long activeAlerts, double wanUtilisationPct, Instant lastScan) {}
}
