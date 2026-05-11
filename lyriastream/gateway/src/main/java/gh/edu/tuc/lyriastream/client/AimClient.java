package gh.edu.tuc.lyriastream.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.core.ParameterizedTypeReference;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * AimClient — reactive proxy to the AI Inference Microservice.
 * All methods return reactive types (Mono / Flux).
 * The AIM is internal-only; this client is the sole entry point.
 */
@Component
public class AimClient {

    private static final Logger log = LoggerFactory.getLogger(AimClient.class);

    private final WebClient webClient;

    public AimClient(@Qualifier("aimWebClient") WebClient webClient) {
        this.webClient = webClient;
    }

    // ── Generation ────────────────────────────────────────────────────────────

    /**
     * POST /aim/v1/generate — submit a generation job.
     * Returns immediately with {jobId, computeMode, blendRecipe, estimatedTtfbSec}.
     */
    public Mono<Map<String, Object>> submitGeneration(Map<String, Object> request) {
        return webClient.post()
            .uri("/aim/v1/generate")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
            .doOnError(e -> log.error("AIM generate failed: {}", e.getMessage()));
    }

    /**
     * GET /aim/v1/jobs/{jobId}/stream — returns raw SSE byte flux.
     * The Gateway relays these bytes directly to the browser SSE connection.
     */
    public Flux<String> streamJob(String jobId) {
        return webClient.get()
            .uri("/aim/v1/jobs/{jobId}/stream", jobId)
            .accept(MediaType.TEXT_EVENT_STREAM)
            .retrieve()
            .bodyToFlux(String.class)
            .doOnSubscribe(s -> log.debug("SSE relay started for job {}", jobId))
            .doOnComplete(() -> log.debug("SSE relay complete for job {}", jobId))
            .doOnError(e -> log.error("SSE relay error for job {}: {}", jobId, e.getMessage()));
    }

    /**
     * GET /aim/v1/jobs/{jobId}/status — poll job status without SSE.
     */
    public Mono<Map<String, Object>> getJobStatus(String jobId) {
        return webClient.get()
            .uri("/aim/v1/jobs/{jobId}/status", jobId)
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {});
    }

    /**
     * GET /aim/v1/jobs/{jobId}/audio — download final WAV from AIM.
     */
    public Flux<byte[]> downloadAudio(String jobId) {
        return webClient.get()
            .uri("/aim/v1/jobs/{jobId}/audio", jobId)
            .retrieve()
            .bodyToFlux(byte[].class);
    }

    /**
     * GET /aim/v1/generate/preview — dry-run blend recipe (no quota deducted).
     */
    public Mono<Map<String, Object>> previewRecipe(String prompt, String genre, int durationSec) {
        return webClient.get()
            .uri(u -> u.path("/aim/v1/generate/preview")
                .queryParam("prompt", prompt)
                .queryParam("genre", genre != null ? genre : "")
                .queryParam("duration_sec", durationSec)
                .build())
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {});
    }

    // ── Model management ──────────────────────────────────────────────────────

    public Mono<Map<String, Object>[]> listModels() {
        return webClient.get()
            .uri("/aim/v1/models")
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<Map<String, Object>[]>() {});
    }

    public Mono<Map<String, Object>> loadModel(String modelId) {
        return webClient.post()
            .uri("/aim/v1/models/{id}/load", modelId)
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {});
    }

    public Mono<Map<String, Object>> unloadModel(String modelId) {
        return webClient.post()
            .uri("/aim/v1/models/{id}/unload", modelId)
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {});
    }

    // ── Health ────────────────────────────────────────────────────────────────

    public Mono<Map<String, Object>> getHealth() {
        return webClient.get()
            .uri("/aim/health")
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
            .doOnError(e -> log.warn("AIM health check failed: {}", e.getMessage()));
    }
}
