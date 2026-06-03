package edu.techbridge.netscan.cli;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import edu.techbridge.netscan.service.mock.MockDataService;
import edu.techbridge.netscan.service.mock.MockDataService.*;
import lombok.RequiredArgsConstructor;
import org.springframework.shell.standard.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * TUC NetScan CLI — FR-CLI-001 to FR-CLI-004
 * Usage: java -jar tuc-netscan.jar --spring.shell.interactive.enabled=true
 */
@ShellComponent
@RequiredArgsConstructor
public class NetScanCli {

    private final MockDataService mock;
    private final ObjectMapper mapper = new ObjectMapper()
        .registerModule(new JavaTimeModule())
        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
        .enable(SerializationFeature.INDENT_OUTPUT);

    // ── scan ──────────────────────────────────────────────────────────

    @ShellMethod(key = "scan", value = "Trigger an active scan of the specified subnet")
    public String scan(
            @ShellOption(defaultValue = "192.168.1.0/24", help = "CIDR subnet to scan") String subnet,
            @ShellOption(defaultValue = "false", help = "Output as JSON") boolean json) {
        int count = mock.getDevices().size();
        if (json) return toJson(new ScanResult("STARTED", subnet, count));
        return """
            ╔══════════════════════════════════════╗
            ║   TUC NetScan — Scan Triggered       ║
            ╚══════════════════════════════════════╝
             Subnet  : %s
             Mode    : Mock (dev profile active)
             Devices : %d in registry
             Status  : SCAN_STARTED
            """.formatted(subnet, count);
    }

    // ── devices list ─────────────────────────────────────────────────

    @ShellMethod(key = "devices list", value = "List all devices in the registry")
    public String devicesList(
            @ShellOption(defaultValue = "", help = "Filter by status: ACTIVE|INACTIVE|BLOCKED|ROGUE") String status,
            @ShellOption(defaultValue = "false", help = "Output as JSON") boolean json) {
        List<MockDevice> devs = mock.getDevices().stream()
            .filter(d -> status.isBlank() || d.status().name().equalsIgnoreCase(status))
            .collect(Collectors.toList());
        if (json) return toJson(devs);

        StringBuilder sb = new StringBuilder();
        sb.append(String.format("%-5s %-17s %-15s %-25s %-12s%n",
            "ID", "MAC", "IP", "HOSTNAME", "STATUS"));
        sb.append("─".repeat(80)).append("\n");
        for (MockDevice d : devs) {
            sb.append(String.format("%-5d %-17s %-15s %-25s %-12s%n",
                d.id(), d.mac(), d.ip(),
                d.hostname() != null ? d.hostname() : "(unknown)",
                d.status().name()));
        }
        sb.append("\nTotal: ").append(devs.size()).append(" device(s)");
        return sb.toString();
    }

    // ── devices show ─────────────────────────────────────────────────

    @ShellMethod(key = "devices show", value = "Show full detail for a device by ID")
    public String devicesShow(
            @ShellOption(help = "Device ID") Long id,
            @ShellOption(defaultValue = "false", help = "Output as JSON") boolean json) {
        return mock.getDevice(id).map(d -> {
            if (json) return toJson(d);
            return """
                ╔══════════════════════════════════════════════╗
                ║  Device Detail — ID: %-24d ║
                ╚══════════════════════════════════════════════╝
                 MAC          : %s
                 IP           : %s
                 Hostname     : %s
                 Manufacturer : %s
                 Label        : %s
                 OS           : %s
                 Status       : %s
                 In ADR       : %s
                 First Seen   : %s
                 Last Seen    : %s
                """.formatted(d.id(), d.mac(), d.ip(),
                    orNA(d.hostname()), orNA(d.manufacturer()), orNA(d.label()),
                    orNA(d.hostname()), d.status().name(),
                    d.inAdr() ? "YES ✓" : "NO ✗",
                    d.firstSeen(), d.lastSeen());
        }).orElse("Device not found: " + id);
    }

    // ── alert list ────────────────────────────────────────────────────

    @ShellMethod(key = "alert list", value = "List all active alerts")
    public String alertList(
            @ShellOption(defaultValue = "false", help = "Output as JSON") boolean json) {
        List<MockAlert> active = mock.getAlerts().stream()
            .filter(a -> "ACTIVE".equals(a.status()))
            .collect(Collectors.toList());
        if (json) return toJson(active);

        StringBuilder sb = new StringBuilder();
        sb.append(String.format("%-5s %-10s %-12s %-40s%n", "ID", "SEVERITY", "TYPE", "TITLE"));
        sb.append("─".repeat(75)).append("\n");
        for (MockAlert a : active) {
            sb.append(String.format("%-5d %-10s %-12s %-40s%n",
                a.id(), a.severity(), a.alertType(), a.title()));
        }
        sb.append("\nActive alerts: ").append(active.size());
        return sb.toString();
    }

    // ── alert ack ─────────────────────────────────────────────────────

    @ShellMethod(key = "alert ack", value = "Acknowledge an alert by ID")
    public String alertAck(
            @ShellOption(help = "Alert ID") Long id,
            @ShellOption(defaultValue = "Acknowledged via CLI", help = "Acknowledgement note") String note,
            @ShellOption(defaultValue = "false", help = "Output as JSON") boolean json) {
        boolean ok = mock.ackAlert(id, note, "cli-user");
        if (json) return toJson(new AckResult(id, ok ? "ACKNOWLEDGED" : "NOT_FOUND", note));
        return ok ? "✓ Alert #" + id + " acknowledged." : "✗ Alert #" + id + " not found or already acknowledged.";
    }

    // ── block add ────────────────────────────────────────────────────

    @ShellMethod(key = "block add", value = "Block a device by MAC address")
    public String blockAdd(
            @ShellOption(help = "MAC address to block (format: AA:BB:CC:DD:EE:FF)") String mac,
            @ShellOption(help = "Reason for blocking (required)") String reason,
            @ShellOption(defaultValue = "false", help = "Output as JSON") boolean json) {
        MockDevice device = mock.getDeviceByMac(mac).orElse(null);
        if (device == null) return "✗ Device not found with MAC: " + mac;
        mock.blockDevice(device.id(), reason, "cli-user");
        if (json) return toJson(new BlockResult(mac, "BLOCKED", reason));
        return "✓ Device " + mac + " (" + device.ip() + ") has been flagged as BLOCKED.\n" +
               "  Run 'block list' to retrieve the generated firewall script.";
    }

    // ── block remove ─────────────────────────────────────────────────

    @ShellMethod(key = "block remove", value = "Remove a block entry by ID")
    public String blockRemove(
            @ShellOption(help = "Block entry ID") Long id,
            @ShellOption(defaultValue = "false", help = "Output as JSON") boolean json) {
        boolean ok = mock.unblockDevice(id, "cli-user");
        if (json) return toJson(new BlockResult(String.valueOf(id), ok ? "UNBLOCKED" : "NOT_FOUND", ""));
        return ok ? "✓ Block entry #" + id + " removed. Device status reset to ACTIVE." :
                    "✗ Block entry #" + id + " not found or already inactive.";
    }

    // ── health ────────────────────────────────────────────────────────

    @ShellMethod(key = "health", value = "Show system health status")
    public String health(
            @ShellOption(defaultValue = "false", help = "Output as JSON") boolean json) {
        MockSystemHealth h = mock.getHealth();
        if (json) return toJson(h);
        return """
            ╔══════════════════════════════════════════╗
            ║   TUC NetScan — System Health            ║
            ╚══════════════════════════════════════════╝
             Database     : %s
             Redis        : %s
             Active Devs  : %d
             Rogue Devs   : %d
             Active Alerts: %d
             WAN Usage    : %.1f%%
             Last Scan    : %s
            """.formatted(
                h.dbOk() ? "✓ OK" : "✗ DOWN",
                h.redisOk() ? "✓ OK" : "✗ DOWN (fallback mode)",
                h.activeDevices(), h.rogueDevices(),
                h.activeAlerts(), h.wanUtilisationPct(), h.lastScan());
    }

    // ── report generate ───────────────────────────────────────────────

    @ShellMethod(key = "report generate", value = "Generate daily network health report")
    public String reportGenerate(
            @ShellOption(defaultValue = "false", help = "Output as JSON") boolean json) {
        MockSystemHealth h = mock.getHealth();
        String filename = "tuc-netscan-report-" + java.time.LocalDate.now() + ".csv";
        if (json) return toJson(new ReportResult(filename, "GENERATED", h.activeDevices(), h.activeAlerts()));
        return "✓ Report generated: " + filename + "\n  (In prod mode, file written to /var/netscan/reports/)";
    }

    // ── Helpers ───────────────────────────────────────────────────────

    private String toJson(Object obj) {
        try { return mapper.writeValueAsString(obj); }
        catch (Exception e) { return "{\"error\":\"serialisation failed\"}"; }
    }

    private String orNA(String s) { return s != null ? s : "N/A"; }

    record ScanResult(String status, String subnet, int deviceCount) {}
    record AckResult(Long alertId, String status, String note) {}
    record BlockResult(String target, String status, String reason) {}
    record ReportResult(String filename, String status, long deviceCount, long alertCount) {}
}
