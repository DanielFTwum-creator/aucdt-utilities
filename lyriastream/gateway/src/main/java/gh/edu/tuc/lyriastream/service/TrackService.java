package gh.edu.tuc.lyriastream.service;

import gh.edu.tuc.lyriastream.domain.entity.TrackEntity;
import gh.edu.tuc.lyriastream.domain.entity.UserEntity;
import gh.edu.tuc.lyriastream.domain.repository.TrackRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

@Service
public class TrackService {

    private static final Logger log = LoggerFactory.getLogger(TrackService.class);

    private final TrackRepository trackRepository;

    public TrackService(TrackRepository trackRepository) {
        this.trackRepository = trackRepository;
    }

    // ── List ──────────────────────────────────────────────────────────────────

    public Mono<Map<String, Object>> listTracks(UserEntity user, int page, int size) {
        return Mono.fromCallable(() -> {
            Page<TrackEntity> result = trackRepository.findByUserIdAndDeletedFalse(
                user.getId(),
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
            );
            return Map.<String, Object>of(
                "content",        result.getContent().stream().map(this::toDto).toList(),
                "totalElements",  result.getTotalElements(),
                "totalPages",     result.getTotalPages(),
                "page",           page,
                "size",           size
            );
        }).subscribeOn(Schedulers.boundedElastic());
    }

    // ── Get ───────────────────────────────────────────────────────────────────

    public Mono<Map<String, Object>> getTrack(String uuid, UserEntity user) {
        return Mono.fromCallable(() -> {
            TrackEntity track = trackRepository.findByUuidAndUserIdAndDeletedFalse(uuid, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Track not found"));
            return toDto(track);
        }).subscribeOn(Schedulers.boundedElastic());
    }

    // ── Patch ─────────────────────────────────────────────────────────────────

    @Transactional
    public Mono<Map<String, Object>> updateTrack(String uuid, UserEntity user, Map<String, Object> patch) {
        return Mono.fromCallable(() -> {
            TrackEntity track = trackRepository.findByUuidAndUserIdAndDeletedFalse(uuid, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Track not found"));

            if (patch.containsKey("title")) {
                track.setTitle((String) patch.get("title"));
            }
            if (patch.containsKey("isPublic")) {
                track.setPublic(Boolean.TRUE.equals(patch.get("isPublic")));
            }
            return toDto(trackRepository.save(track));
        }).subscribeOn(Schedulers.boundedElastic());
    }

    // ── Delete (soft) ─────────────────────────────────────────────────────────

    @Transactional
    public Mono<Void> deleteTrack(String uuid, UserEntity user) {
        return Mono.fromCallable(() -> {
            int deleted = trackRepository.softDeleteByUuidAndUserId(uuid, user.getId());
            if (deleted == 0) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Track not found");
            return null;
        }).subscribeOn(Schedulers.boundedElastic()).then();
    }

    // ── Resolve file path for download ────────────────────────────────────────

    public Mono<Path> resolveAudioPath(String uuid, UserEntity user, String format) {
        return Mono.fromCallable(() -> {
            TrackEntity track = trackRepository.findByUuidAndUserIdAndDeletedFalse(uuid, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Track not found"));

            // Base path is the WAV — format conversion is a future feature
            Path path = Path.of(track.getFilePath());
            if (!Files.exists(path)) {
                // Try by job UUID naming convention as fallback
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Audio file not found");
            }
            return path;
        }).subscribeOn(Schedulers.boundedElastic());
    }

    // ── Save track after generation completes ─────────────────────────────────

    @Transactional
    public Mono<TrackEntity> saveFromJob(
        String jobId,
        String prompt,
        String filePath,
        long fileSizeBytes,
        String sha256Hash,
        int durationSeconds,
        String blendRecipeJson,
        String qualityMode,
        UserEntity user
    ) {
        return Mono.fromCallable(() -> {
            if (trackRepository.existsByJobId(jobId)) {
                return trackRepository.findByJobId(jobId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Track not found"));
            }
            TrackEntity track = TrackEntity.builder()
                .uuid(UUID.randomUUID().toString())
                .user(user)
                .jobId(jobId)
                .title(deriveTitle(prompt))
                .prompt(prompt)
                .filePath(filePath)
                .fileFormat(TrackEntity.Format.WAV)
                .fileSizeBytes(fileSizeBytes)
                .sha256Hash(sha256Hash)
                .durationSeconds(durationSeconds)
                .blendRecipeJson(blendRecipeJson)
                .qualityMode(qualityMode)
                .build();
            TrackEntity saved = trackRepository.save(track);
            log.info("Track saved: uuid={} job={}", saved.getUuid(), jobId);
            return saved;
        }).subscribeOn(Schedulers.boundedElastic());
    }

    // ── DTO ───────────────────────────────────────────────────────────────────

    private Map<String, Object> toDto(TrackEntity t) {
        return Map.ofEntries(
            Map.entry("uuid",            t.getUuid()),
            Map.entry("jobId",           t.getJobId()),
            Map.entry("title",           t.getTitle()),
            Map.entry("prompt",          t.getPrompt()),
            Map.entry("genre",           t.getGenre() != null ? t.getGenre() : ""),
            Map.entry("durationSeconds", t.getDurationSeconds()),
            Map.entry("fileFormat",      t.getFileFormat().name()),
            Map.entry("fileSizeBytes",   t.getFileSizeBytes()),
            Map.entry("qualityMode",     t.getQualityMode() != null ? t.getQualityMode() : ""),
            Map.entry("isPublic",        t.isPublic()),
            Map.entry("createdAt",       t.getCreatedAt() != null ? t.getCreatedAt().toString() : "")
        );
    }

    private static String deriveTitle(String prompt) {
        if (prompt == null || prompt.isBlank()) return "Untitled Track";
        String trimmed = prompt.trim();
        return trimmed.length() <= 60 ? trimmed : trimmed.substring(0, 57) + "…";
    }
}
