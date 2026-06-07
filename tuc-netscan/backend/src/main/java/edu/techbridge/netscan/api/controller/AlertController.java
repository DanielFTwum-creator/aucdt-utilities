package edu.techbridge.netscan.api.controller;

import edu.techbridge.netscan.service.mock.MockDataService;
import edu.techbridge.netscan.service.mock.MockDataService.MockAlert;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/alerts")
@RequiredArgsConstructor
@Slf4j
public class AlertController {

    private final MockDataService mock;

    public record AckRequest(@NotBlank String note) {}

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
