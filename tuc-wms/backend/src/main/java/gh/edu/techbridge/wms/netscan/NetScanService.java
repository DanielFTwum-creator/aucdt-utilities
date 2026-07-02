package gh.edu.techbridge.wms.netscan;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

/**
 * NetScan domain service — real JPA persistence.
 * Replaces MockDataService from the standalone tuc-netscan backend.
 *
 * Seed strategy: on first start, if ns_devices is empty, loads the TUC campus
 * device topology. Safe to run in both dev (H2) and production (MariaDB).
 */
@Service
@Transactional
public class NetScanService {

    private static final Logger log = LoggerFactory.getLogger(NetScanService.class);

    private final NsDeviceRepository    devices;
    private final NsAlertRepository     alerts;
    private final NsInterfaceRepository interfaces;
    private final NsBwSampleRepository  bwSamples;
    private final NsBlockEntryRepository blockEntries;
    private final NsAuditEntryRepository auditEntries;

    public NetScanService(NsDeviceRepository devices, NsAlertRepository alerts,
                          NsInterfaceRepository interfaces, NsBwSampleRepository bwSamples,
                          NsBlockEntryRepository blockEntries, NsAuditEntryRepository auditEntries) {
        this.devices      = devices;
        this.alerts       = alerts;
        this.interfaces   = interfaces;
        this.bwSamples    = bwSamples;
        this.blockEntries = blockEntries;
        this.auditEntries = auditEntries;
    }

    // ── Seed ─────────────────────────────────────────────────────────────────

    @EventListener(ApplicationReadyEvent.class)
    public void seedIfEmpty() {
        if (devices.count() > 0) return;
        log.info("[NetScan] Seeding campus topology");

        seedDevices();
        seedInterfaces();
        seedAlerts();
        seedBlockEntry();
        seedAuditLog();
        seedBandwidthHistory();

        log.info("[NetScan] Seed complete — {} devices, {} interfaces, {} alerts",
                devices.count(), interfaces.count(), alerts.count());
    }

    private void seedDevices() {
        record S(String mac, String ip, String hostname, String mfr, String label,
                 NsDevice.Status status, boolean inAdr) {}

        List<S> seeds = List.of(
            new S("00:1A:2B:3C:4D:01","192.168.1.1",  "tuc-gateway",       "Cisco Systems",       "Cisco ISR 4321 Router",      NsDevice.Status.ACTIVE,   true),
            new S("00:1A:2B:3C:4D:02","192.168.1.2",  "tuc-core-switch",   "Cisco Systems",       "Cisco Catalyst 3750 Switch", NsDevice.Status.ACTIVE,   true),
            new S("00:1A:2B:3C:4D:03","192.168.1.3",  "tuc-wifi-ap-main",  "Ubiquiti Networks",   "UniFi AP AC Pro",            NsDevice.Status.ACTIVE,   true),
            new S("00:1A:2B:3C:4D:04","192.168.1.4",  "tuc-wifi-ap-lab",   "Ubiquiti Networks",   "UniFi AP AC Lite",           NsDevice.Status.ACTIVE,   true),
            new S("00:1A:2B:3C:4D:05","192.168.1.5",  "tuc-fileserver",    "Dell Technologies",   "Dell PowerEdge R740",        NsDevice.Status.ACTIVE,   true),
            new S("00:1A:2B:3C:4D:06","192.168.1.6",  "tuc-moodle-lms",    "HP Inc.",             "HP ProLiant DL380 Gen10",    NsDevice.Status.ACTIVE,   true),
            new S("00:1A:2B:3C:4D:07","192.168.1.7",  "tuc-print-admin",   "Canon Inc.",          "Canon imageRUNNER ADVANCE",  NsDevice.Status.ACTIVE,   true),
            new S("00:1A:2B:3C:4D:08","192.168.1.8",  "admin-pc-ict",      "Dell Technologies",   "Dell OptiPlex 7090",         NsDevice.Status.ACTIVE,   true),
            new S("00:1A:2B:3C:4D:09","192.168.1.10", "lab-pc-01",         "Lenovo",              "ThinkCentre M90",            NsDevice.Status.ACTIVE,   true),
            new S("00:1A:2B:3C:4D:0A","192.168.1.11", "lab-pc-02",         "Lenovo",              "ThinkCentre M90",            NsDevice.Status.ACTIVE,   true),
            new S("00:1A:2B:3C:4D:0B","192.168.1.12", "lab-pc-03",         "Lenovo",              "ThinkCentre M90",            NsDevice.Status.ACTIVE,   true),
            new S("00:1A:2B:3C:4D:0C","192.168.1.13", "lab-pc-04",         "Lenovo",              "ThinkCentre M90",            NsDevice.Status.ACTIVE,   true),
            new S("00:1A:2B:3C:4D:0D","192.168.1.20", "student-laptop-001","Apple Inc.",          "MacBook Air M2",             NsDevice.Status.ACTIVE,   false),
            new S("00:1A:2B:3C:4D:0E","192.168.1.21", "student-laptop-002","Samsung Electronics", "Galaxy Book Pro",            NsDevice.Status.ACTIVE,   false),
            new S("00:1A:2B:3C:4D:0F","192.168.1.22", "student-phone-001", "Apple Inc.",          "iPhone 14 Pro",              NsDevice.Status.ACTIVE,   false),
            new S("00:1A:2B:3C:4D:10","192.168.1.23", "student-phone-002", "Samsung Electronics", "Galaxy S23",                 NsDevice.Status.ACTIVE,   false),
            new S("00:1A:2B:3C:4D:11","192.168.1.24", "student-phone-003", "Transsion Holdings",  "Tecno Spark 20",             NsDevice.Status.ACTIVE,   false),
            new S("00:1A:2B:3C:4D:12","192.168.1.30", "cctv-cam-01",       "Hikvision",           "DS-2CD2143G2-I Camera",      NsDevice.Status.ACTIVE,   true),
            new S("00:1A:2B:3C:4D:13","192.168.1.31", "cctv-cam-02",       "Hikvision",           "DS-2CD2143G2-I Camera",      NsDevice.Status.ACTIVE,   true),
            new S("00:1A:2B:3C:4D:14","192.168.1.40", "iot-smartboard-01", "Promethean",          "ActivPanel 9 Premium",       NsDevice.Status.ACTIVE,   true),
            new S("00:1A:2B:3C:4D:15","192.168.1.41", "iot-smartboard-02", "Promethean",          "ActivPanel 9 Premium",       NsDevice.Status.ACTIVE,   true),
            new S("00:1A:2B:3C:4D:16","192.168.1.50", "unknown-device-01", "Unknown",             null,                         NsDevice.Status.ROGUE,    false),
            new S("00:1A:2B:3C:4D:17","192.168.1.99", "blocked-device-01", "Realtek Semiconductor","Unknown PC",               NsDevice.Status.BLOCKED,  false),
            new S("00:1A:2B:3C:4D:18","192.168.1.100","old-device-01",     "Intel Corporate",     "Old Desktop",                NsDevice.Status.INACTIVE, false),
            new S("00:1A:2B:3C:4D:19","192.168.1.25", "student-laptop-003","Hewlett Packard",     "HP Pavilion 15",             NsDevice.Status.ACTIVE,   false)
        );

        for (S s : seeds) {
            devices.save(new NsDevice(s.mac(), s.ip(), s.hostname(), s.mfr(), s.label(), s.status(), s.inAdr()));
        }
    }

    private void seedInterfaces() {
        List.of(
            new NsInterface("WAN-Upstream",      "Internet uplink — MTN Fibre",  "196.47.12.1",  100),
            new NsInterface("LAN-Core",           "Core campus switch trunk",     "192.168.1.1",  1000),
            new NsInterface("WiFi-Main-Hall",     "Main hall wireless AP",        "192.168.1.3",  300),
            new NsInterface("WiFi-Computer-Lab",  "Computer lab wireless AP",     "192.168.1.4",  300),
            new NsInterface("VLAN-Admin",         "Administrative VLAN",          "192.168.2.1",  100)
        ).forEach(interfaces::save);
    }

    private void seedAlerts() {
        alerts.save(new NsAlert("ROGUE_DEVICE", "CRITICAL", "Rogue Device Detected",
            "Unknown device 00:1A:2B:3C:4D:16 appeared on 192.168.1.50 — not in ADR.", null));
        alerts.save(new NsAlert("BANDWIDTH", "WARNING", "WAN Uplink Approaching Capacity",
            "WAN-Upstream utilisation at 87% for 5 consecutive samples.", null));
        alerts.save(new NsAlert("PORT_CHANGE", "WARNING", "New Open Port Detected",
            "Port 23 (Telnet) opened on 192.168.1.40 (iot-smartboard-01).", null));
        alerts.save(new NsAlert("LATENCY", "INFO", "Elevated Latency — WiFi Main Hall",
            "RTT to WiFi-Main-Hall AP averaging 210ms over last 5 minutes.", null));
    }

    private void seedBlockEntry() {
        NsDevice blocked = devices.findByMacIgnoreCase("00:1A:2B:3C:4D:17").orElse(null);
        if (blocked == null) return;
        String script = generateFirewallScript(blocked.getIp(), blocked.getMac());
        NsBlockEntry entry = new NsBlockEntry(blocked.getId(), blocked.getMac(),
            "Torrenting traffic detected consuming 40% of WAN bandwidth during lecture hours.",
            "daniel.twum@techbridge.edu.gh", script);
        blockEntries.save(entry);
    }

    private void seedAuditLog() {
        auditEntries.save(new NsAuditEntry("daniel.twum@techbridge.edu.gh", "BLOCK",
            "00:1A:2B:3C:4D:17", "Torrenting — excessive bandwidth consumption."));
        auditEntries.save(new NsAuditEntry("daniel.twum@techbridge.edu.gh", "SCAN",
            "192.168.1.0/24", "Manual scan triggered."));
    }

    private void seedBandwidthHistory() {
        // Seed 24 h of historical samples (one per interface every 30 min for brevity).
        // The real scanner will write live samples going forward.
        record IfaceSeed(String name, int capacityMbps, double basePct) {}
        List<IfaceSeed> ifaces = List.of(
            new IfaceSeed("WAN-Upstream",     100,  55.0),
            new IfaceSeed("LAN-Core",        1000,  20.0),
            new IfaceSeed("WiFi-Main-Hall",   300,  45.0),
            new IfaceSeed("WiFi-Computer-Lab",300,  30.0),
            new IfaceSeed("VLAN-Admin",       100,  10.0)
        );
        Instant cursor = Instant.now().minus(24, ChronoUnit.HOURS);
        while (cursor.isBefore(Instant.now())) {
            for (IfaceSeed iface : ifaces) {
                double pct = Math.max(0, Math.min(100, iface.basePct() + (Math.random() - 0.5) * 20));
                long bi    = (long)(pct / 100.0 * iface.capacityMbps() * 1_000_000 / 8 * 1800);
                bwSamples.save(new NsBwSample(iface.name(), bi, (long)(bi * 0.3), pct));
            }
            cursor = cursor.plus(30, ChronoUnit.MINUTES);
        }
    }

    // ── Device queries ────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<NsDevice> getAllDevices() { return devices.findAll(); }

    @Transactional(readOnly = true)
    public Optional<NsDevice> getDevice(Long id) { return devices.findById(id); }

    @Transactional(readOnly = true)
    public Optional<NsDevice> getDeviceByMac(String mac) { return devices.findByMacIgnoreCase(mac); }

    public NsDevice annotateDevice(Long id, String label) {
        NsDevice d = devices.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Device not found: " + id));
        d.setLabel(label);
        return devices.save(d);
    }

    // ── Block / unblock ───────────────────────────────────────────────────────

    public NsBlockEntry blockDevice(Long deviceId, String reason, String actor) {
        NsDevice d = devices.findById(deviceId)
            .orElseThrow(() -> new IllegalArgumentException("Device not found: " + deviceId));
        d.setStatus(NsDevice.Status.BLOCKED);
        devices.save(d);

        String script = generateFirewallScript(d.getIp(), d.getMac());
        NsBlockEntry entry = new NsBlockEntry(deviceId, d.getMac(), reason, actor, script);
        blockEntries.save(entry);
        audit(actor, "BLOCK", d.getMac(), reason);
        return entry;
    }

    public boolean unblockDevice(Long blockId, String actor) {
        Optional<NsBlockEntry> opt = blockEntries.findById(blockId);
        if (opt.isEmpty() || !opt.get().isActive()) return false;

        NsBlockEntry entry = opt.get();
        entry.setActive(false);
        entry.setUnblockedAt(Instant.now());
        blockEntries.save(entry);

        devices.findById(entry.getDeviceId()).ifPresent(d -> {
            d.setStatus(NsDevice.Status.ACTIVE);
            devices.save(d);
        });

        audit(actor, "UNBLOCK", entry.getMac(), "Device unblocked.");
        return true;
    }

    @Transactional(readOnly = true)
    public List<NsBlockEntry> getBlockList() { return blockEntries.findByActiveTrue(); }

    // ── Alert queries ─────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<NsAlert> getAllAlerts() { return alerts.findAll(); }

    public boolean ackAlert(Long alertId, String note, String actor) {
        Optional<NsAlert> opt = alerts.findById(alertId);
        if (opt.isEmpty() || opt.get().getStatus() != NsAlert.Status.ACTIVE) return false;

        NsAlert a = opt.get();
        a.setStatus(NsAlert.Status.ACKNOWLEDGED);
        a.setAckNote(note);
        a.setAckedBy(actor);
        a.setAckedAt(Instant.now());
        alerts.save(a);
        audit(actor, "ACK_ALERT", String.valueOf(alertId), note);
        return true;
    }

    // ── Bandwidth ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<NsInterface> getInterfaces() { return interfaces.findAll(); }

    @Transactional(readOnly = true)
    public List<NsBwSample> getBwHistory() {
        return bwSamples.findBySampledAtAfterOrderBySampledAtAsc(
            Instant.now().minus(24, ChronoUnit.HOURS));
    }

    @Transactional(readOnly = true)
    public List<NsBwSample> getBwByInterface(String name) {
        return bwSamples.findByInterfaceNameOrderBySampledAtDesc(name);
    }

    @Transactional(readOnly = true)
    public Optional<NsBwSample> getLatestBwSample(String interfaceName) {
        return bwSamples.findLatestByInterfaceName(interfaceName);
    }

    // ── Audit ─────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<NsAuditEntry> getAuditLog() { return auditEntries.findByOrderByCreatedAtDesc(); }

    public void recordScan(String subnet, String actor) {
        audit(actor, "SCAN", subnet, "Manual scan triggered.");
    }

    // ── Health snapshot ───────────────────────────────────────────────────────

    public record HealthSnapshot(long activeDevices, long rogueDevices, long activeAlerts,
                                  double wanUtilisationPct, Instant checkedAt) {}

    @Transactional(readOnly = true)
    public HealthSnapshot getHealth() {
        long active = devices.countByStatus(NsDevice.Status.ACTIVE);
        long rogue  = devices.countByStatus(NsDevice.Status.ROGUE);
        long alertCount = alerts.countByStatus(NsAlert.Status.ACTIVE);
        double wanPct = bwSamples.findLatestByInterfaceName("WAN-Upstream")
            .map(NsBwSample::getUtilisationPct).orElse(0.0);
        return new HealthSnapshot(active, rogue, alertCount, wanPct, Instant.now());
    }

    // ── Internal helpers ──────────────────────────────────────────────────────

    private void audit(String actor, String actionType, String targetId, String reason) {
        auditEntries.save(new NsAuditEntry(actor, actionType, targetId, reason));
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

                # Block by MAC (same-segment traffic)
                iptables -I FORWARD -m mac --mac-source %s -j DROP

                echo "Block rule applied for %s (%s)"
                """.formatted(Instant.now(), ip, mac, ip, ip, mac, ip, mac);
    }
}
