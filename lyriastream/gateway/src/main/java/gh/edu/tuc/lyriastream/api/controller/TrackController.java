package gh.edu.tuc.lyriastream.api.controller;

import gh.edu.tuc.lyriastream.domain.entity.UserEntity;
import gh.edu.tuc.lyriastream.service.TrackService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/tracks")
public class TrackController {

    private final TrackService trackService;

    public TrackController(TrackService trackService) {
        this.trackService = trackService;
    }

    /** GET /api/v1/tracks?page=0&size=20 */
    @GetMapping
    public Mono<Map<String, Object>> list(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @AuthenticationPrincipal UserEntity user
    ) {
        return trackService.listTracks(user, page, size);
    }

    /** GET /api/v1/tracks/{uuid} */
    @GetMapping("/{uuid}")
    public Mono<Map<String, Object>> get(
        @PathVariable String uuid,
        @AuthenticationPrincipal UserEntity user
    ) {
        return trackService.getTrack(uuid, user);
    }

    /** PATCH /api/v1/tracks/{uuid} — update title / isPublic */
    @PatchMapping("/{uuid}")
    public Mono<Map<String, Object>> update(
        @PathVariable String uuid,
        @RequestBody Map<String, Object> patch,
        @AuthenticationPrincipal UserEntity user
    ) {
        return trackService.updateTrack(uuid, user, patch);
    }

    /** DELETE /api/v1/tracks/{uuid} — soft delete */
    @DeleteMapping("/{uuid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> delete(
        @PathVariable String uuid,
        @AuthenticationPrincipal UserEntity user
    ) {
        return trackService.deleteTrack(uuid, user);
    }
}
