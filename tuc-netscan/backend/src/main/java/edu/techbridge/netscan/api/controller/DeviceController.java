package edu.techbridge.netscan.api.controller;

import edu.techbridge.netscan.service.mock.MockDataService;
import edu.techbridge.netscan.service.mock.MockDataService.MockDevice;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/devices")
@RequiredArgsConstructor
@Slf4j
public class DeviceController {

    private final MockDataService mock;

    public record AnnotateRequest(@NotBlank String label) {}
    public record DeviceDto(Long id, String mac, String ip, String hostname, String manufacturer,
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
