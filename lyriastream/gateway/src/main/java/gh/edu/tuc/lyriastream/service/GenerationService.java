package gh.edu.tuc.lyriastream.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import gh.edu.tuc.lyriastream.client.AimClient;
import gh.edu.tuc.lyriastream.domain.entity.UserEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class GenerationService {

    private static final Logger log = LoggerFactory.getLogger(GenerationService.class);

    private final AimClient aimClient;
    private final TrackService trackService;
    private final ObjectMapper objectMapper;

    public GenerationService(AimClient aimClient, TrackService trackService, ObjectMapper objectMapper) {
        this.aimClient = aimClient;
        this.trackService = trackService;
        this.objectMapper = objectMapper;
    }

    @SuppressWarnings("unchecked")
    public Mono<Map<String, Object>> submitJob(Map<String, Object> request, UserEntity user) {
        Map<String, Object> aimRequest = new HashMap<>(request);
        String jobId = UUID.randomUUID().toString();
        aimRequest.put("job_id", jobId);

        return aimClient.submitGeneration(aimRequest)
            .map(result -> {
                // Subscribe in background to persist track when done event fires
                subscribeForDone(jobId, request, user);

                Map<String, Object> response = new HashMap<>(result);
                response.put("quotaRemaining",
                    Math.max(0, user.getDailyQuota() - user.getQuotaUsedToday()));
                return response;
            });
    }

    /**
     * Background subscription to the AIM SSE stream.
     * When the "done" event fires, persists the track to the database.
     * Fire-and-forget — errors are logged, not propagated to the client.
     */
    private void subscribeForDone(String jobId, Map<String, Object> request, UserEntity user) {
        aimClient.streamJob(jobId)
            .filter(data -> data.contains("\"_type\":\"done\"") || data.startsWith("{\"trackUuid\""))
            .next()
            .flatMap(data -> parseDoneAndSave(data, jobId, request, user))
            .doOnError(e -> log.error("Failed to persist track for job {}: {}", jobId, e.getMessage()))
            .subscribe();
    }

    @SuppressWarnings("unchecked")
    private Mono<Void> parseDoneAndSave(String data, String jobId, Map<String, Object> request, UserEntity user) {
        try {
            Map<String, Object> done = objectMapper.readValue(data,
                new TypeReference<Map<String, Object>>() {});

            String filePath       = (String)  done.getOrDefault("filePath", "");
            int    durationSec    = ((Number)  done.getOrDefault("duration", 0)).intValue();
            String prompt         = (String)  request.getOrDefault("prompt", "");
            String qualityMode    = (String)  request.getOrDefault("quality_mode", "auto");
            Map<String, Object> blend = (Map<String, Object>) done.getOrDefault("blendRecipe", Map.of());
            String blendJson      = objectMapper.writeValueAsString(blend);

            // Compute file size
            long fileSize = 0;
            try {
                fileSize = java.nio.file.Files.size(java.nio.file.Path.of(filePath));
            } catch (Exception e) {
                log.warn("Could not stat audio file {}: {}", filePath, e.getMessage());
            }

            return trackService.saveFromJob(
                jobId, prompt, filePath, fileSize,
                "0".repeat(64),   // SHA-256 placeholder — full hashing is a separate concern
                durationSec, blendJson, qualityMode, user
            ).then();

        } catch (Exception e) {
            log.error("Could not parse done event for job {}: {}", jobId, e.getMessage());
            return Mono.empty();
        }
    }
}
