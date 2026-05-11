package gh.edu.tuc.lyriastream.api.controller;

import gh.edu.tuc.lyriastream.client.AimClient;
import gh.edu.tuc.lyriastream.domain.entity.UserEntity;
import gh.edu.tuc.lyriastream.service.GenerationService;
import gh.edu.tuc.lyriastream.service.QuotaService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class GenerateController {

    private static final Logger log = LoggerFactory.getLogger(GenerateController.class);

    private final AimClient aimClient;
    private final GenerationService generationService;
    private final QuotaService quotaService;

    public GenerateController(AimClient aimClient, GenerationService generationService, QuotaService quotaService) {
        this.aimClient = aimClient;
        this.generationService = generationService;
        this.quotaService = quotaService;
    }

    /**
     * POST /api/v1/generate
     * Validates quota, creates DB job record, submits to AIM, returns 202 with jobId.
     */
    @PostMapping("/generate")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public Mono<ResponseEntity<Map<String, Object>>> generate(
        @Valid @RequestBody Map<String, Object> request,
        @AuthenticationPrincipal UserEntity user
    ) {
        return quotaService.checkAndDeduct(user)
            .flatMap(ok -> generationService.submitJob(request, user))
            .map(result -> ResponseEntity.accepted().body(result))
            .onErrorResume(QuotaService.QuotaExceededException.class, e ->
                Mono.just(ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("error", "QUOTA_EXCEEDED", "message", e.getMessage())))
            );
    }

    /**
     * GET /api/v1/generate/preview
     * Dry-run blend recipe preview — no quota deducted.
     */
    @GetMapping("/generate/preview")
    public Mono<Map<String, Object>> previewRecipe(
        @RequestParam String prompt,
        @RequestParam(required = false) String genre,
        @RequestParam(defaultValue = "10") int durationSec,
        @AuthenticationPrincipal UserEntity user
    ) {
        return aimClient.previewRecipe(prompt, genre, durationSec);
    }

    /**
     * GET /api/v1/stream/{jobId}
     * SSE relay: subscribes to AIM's SSE stream and forwards events to browser.
     * Adds heartbeat pings every 15s to prevent proxy timeout.
     */
    @GetMapping(value = "/stream/{jobId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> streamJob(
        @PathVariable String jobId,
        @AuthenticationPrincipal UserEntity user
    ) {
        // Verify job belongs to this user
        Flux<ServerSentEvent<String>> aimStream = aimClient.streamJob(jobId)
            .map(data -> ServerSentEvent.<String>builder()
                .data(data)
                .build())
            .doOnError(e -> log.error("SSE relay error for job {}: {}", jobId, e.getMessage()));

        // Heartbeat pings every 15s (prevent CDN/proxy timeout)
        Flux<ServerSentEvent<String>> heartbeat = Flux.interval(Duration.ofSeconds(15))
            .map(i -> ServerSentEvent.<String>builder()
                .comment("ping")
                .build());

        return Flux.merge(aimStream, heartbeat)
            .takeUntil(sse -> {
                String data = sse.data();
                return data != null && (data.contains("\"done\"") || data.contains("\"error\""));
            });
    }

    /**
     * GET /api/v1/audio/{jobId}/stream
     * Chunked HTTP audio stream — for native <audio src=...> element.
     */
    @GetMapping(value = "/audio/{jobId}/stream", produces = "audio/mpeg")
    public Flux<byte[]> streamAudio(
        @PathVariable String jobId,
        @AuthenticationPrincipal UserEntity user
    ) {
        return aimClient.downloadAudio(jobId);
    }

    /**
     * GET /api/v1/jobs/{jobId}/status
     * Polling fallback for clients that don't support SSE.
     */
    @GetMapping("/jobs/{jobId}/status")
    public Mono<Map<String, Object>> getJobStatus(
        @PathVariable String jobId,
        @AuthenticationPrincipal UserEntity user
    ) {
        return aimClient.getJobStatus(jobId);
    }
}
