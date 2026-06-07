package edu.techbridge.netscan.api.controller;

import edu.techbridge.netscan.model.Device;
import edu.techbridge.netscan.service.mock.MockDataService;
import edu.techbridge.netscan.service.mock.MockDataService.MockBwSample;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/bandwidth")
@RequiredArgsConstructor
@Slf4j
public class BandwidthController {

    private final MockDataService mock;

    public record InterfaceStatus(Long id, String name, String description, String ip,
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
            .filter(d -> d.status() == Device.DeviceStatus.ACTIVE)
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
