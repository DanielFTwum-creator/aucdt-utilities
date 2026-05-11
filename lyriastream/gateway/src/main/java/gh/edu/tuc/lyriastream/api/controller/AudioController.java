package gh.edu.tuc.lyriastream.api.controller;

import gh.edu.tuc.lyriastream.domain.entity.UserEntity;
import gh.edu.tuc.lyriastream.service.TrackService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/audio")
public class AudioController {

    private static final Map<String, String> CONTENT_TYPES = Map.of(
        "wav", "audio/wav",
        "mp3", "audio/mpeg",
        "ogg", "audio/ogg"
    );

    private final TrackService trackService;

    public AudioController(TrackService trackService) {
        this.trackService = trackService;
    }

    /**
     * GET /api/v1/audio/{uuid}/download?format=wav|mp3|ogg
     * Serves the generated audio file directly. WAV is always available;
     * MP3/OGG served as WAV until transcoding is implemented.
     */
    @GetMapping("/{uuid}/download")
    public Mono<ResponseEntity<Resource>> download(
        @PathVariable String uuid,
        @RequestParam(defaultValue = "wav") String format,
        @AuthenticationPrincipal UserEntity user
    ) {
        String fmt = format.toLowerCase();
        String contentType = CONTENT_TYPES.getOrDefault(fmt, "audio/wav");

        return trackService.resolveAudioPath(uuid, user, fmt)
            .map(path -> {
                Resource resource = new FileSystemResource(Objects.requireNonNull(path));
                String filename = uuid + "." + fmt;
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(Objects.requireNonNull(contentType)))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename(filename).build().toString())
                    .body(resource);
            });
    }

    /**
     * GET /api/v1/audio/{jobId}/stream
     * Already handled by GenerateController — this mapping is for completeness.
     * Clients should prefer the download endpoint after generation completes.
     */
    @GetMapping("/{uuid}/info")
    public Mono<Map<String, Object>> info(
        @PathVariable String uuid,
        @AuthenticationPrincipal UserEntity user
    ) {
        return trackService.getTrack(uuid, user);
    }
}
