package edu.techbridge.netscan.api.controller;

import edu.techbridge.netscan.service.mock.MockDataService;
import edu.techbridge.netscan.service.mock.MockDataService.MockBlockEntry;
import edu.techbridge.netscan.service.mock.MockDataService.MockDevice;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/control")
@RequiredArgsConstructor
@Slf4j
public class ControlController {

    private final MockDataService mock;

    public record BlockRequest(@NotBlank String targetMac, @NotBlank String reason) {}
    public record BlockResponse(Long blockId, String script, String message) {}

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
