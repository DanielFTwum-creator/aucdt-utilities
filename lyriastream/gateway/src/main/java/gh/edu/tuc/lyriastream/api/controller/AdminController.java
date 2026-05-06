package gh.edu.tuc.lyriastream.api.controller;

import gh.edu.tuc.lyriastream.client.AimClient;
import gh.edu.tuc.lyriastream.domain.entity.UserEntity;
import gh.edu.tuc.lyriastream.domain.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

    private final AimClient aimClient;
    private final UserRepository userRepository;

    public AdminController(AimClient aimClient, UserRepository userRepository) {
        this.aimClient = aimClient;
        this.userRepository = userRepository;
    }

    // ── Dashboard ─────────────────────────────────────────────────────────────

    @GetMapping("/dashboard")
    public Mono<Map<String, Object>> dashboard() {
        return aimClient.getHealth()
            .map(health -> Map.of(
                "aimHealth", health,
                "totalUsers", userRepository.count()
            ));
    }

    // ── Model management ──────────────────────────────────────────────────────

    @GetMapping("/models")
    public Mono<Map<String, Object>[]> listModels() {
        return aimClient.listModels();
    }

    @PostMapping("/models/{modelId}/load")
    public Mono<Map<String, Object>> loadModel(
        @PathVariable String modelId,
        @AuthenticationPrincipal UserEntity admin
    ) {
        log.info("Admin {} loading model {}", admin.getEmail(), modelId);
        return aimClient.loadModel(modelId);
    }

    @PostMapping("/models/{modelId}/unload")
    public Mono<Map<String, Object>> unloadModel(
        @PathVariable String modelId,
        @AuthenticationPrincipal UserEntity admin
    ) {
        log.info("Admin {} unloading model {}", admin.getEmail(), modelId);
        return aimClient.unloadModel(modelId);
    }

    // ── User management ───────────────────────────────────────────────────────

    @GetMapping("/users")
    public Mono<Object> listUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return Mono.fromCallable(() ->
            userRepository.findAll(
                org.springframework.data.domain.PageRequest.of(page, size)
            )
        );
    }

    @PatchMapping("/users/{uuid}/suspend")
    public Mono<Map<String, Object>> suspendUser(
        @PathVariable String uuid,
        @AuthenticationPrincipal UserEntity admin
    ) {
        return Mono.fromCallable(() -> {
            UserEntity user = userRepository.findByUuid(uuid)
                .orElseThrow(() -> new RuntimeException("User not found"));
            user.setActive(false);
            userRepository.save(user);
            log.info("Admin {} suspended user {}", admin.getEmail(), uuid);
            return Map.<String, Object>of("status", "suspended", "uuid", uuid);
        });
    }

    @PatchMapping("/users/{uuid}/quota")
    public Mono<Map<String, Object>> overrideQuota(
        @PathVariable String uuid,
        @RequestBody Map<String, Integer> body,
        @AuthenticationPrincipal UserEntity admin
    ) {
        return Mono.fromCallable(() -> {
            UserEntity user = userRepository.findByUuid(uuid)
                .orElseThrow(() -> new RuntimeException("User not found"));
            int newQuota = body.getOrDefault("dailyQuota", user.getDailyQuota());
            user.setDailyQuota(newQuota);
            userRepository.save(user);
            log.info("Admin {} set quota {} for user {}", admin.getEmail(), newQuota, uuid);
            return Map.<String, Object>of("uuid", uuid, "dailyQuota", newQuota);
        });
    }
}
