package com.lems.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Resolves a WMS access token to an identity by relaying it to the IdP's
 * /api/me (server-to-server — no shared JWT secret; trust is the relay,
 * exactly the tuc-netscan-100 pattern). Successful lookups are cached
 * briefly so a busy admin screen does not hammer the IdP.
 */
@Service
public class WmsAuthService {

    private static final Duration CACHE_TTL = Duration.ofSeconds(60);
    private static final int CACHE_MAX = 500;

    private record Cached(WmsIdentity identity, long expiresAt) { }

    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5)).build();
    private final ObjectMapper mapper = new ObjectMapper();
    private final Map<String, Cached> cache = new ConcurrentHashMap<>();

    @Value("${lems.wms.base:https://wms.techbridge.edu.gh}")
    private String wmsBase;

    /** Empty = token missing/invalid/expired (the caller answers 401). */
    public Optional<WmsIdentity> resolve(String bearerToken) {
        if (bearerToken == null || bearerToken.isBlank()) return Optional.empty();

        Cached hit = cache.get(bearerToken);
        if (hit != null && hit.expiresAt() > System.currentTimeMillis()) {
            return Optional.of(hit.identity());
        }

        try {
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(wmsBase + "/api/me"))
                    .timeout(Duration.ofSeconds(8))
                    .header("Authorization", "Bearer " + bearerToken)
                    .GET().build();
            HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());
            if (res.statusCode() != 200) return Optional.empty();

            JsonNode body = mapper.readTree(res.body());
            WmsIdentity identity = new WmsIdentity(
                    body.path("email").asText(null),
                    body.path("name").asText(""),
                    body.path("role").asText(""));
            if (identity.email() == null) return Optional.empty();

            if (cache.size() > CACHE_MAX) cache.clear();
            cache.put(bearerToken, new Cached(identity, System.currentTimeMillis() + CACHE_TTL.toMillis()));
            return Optional.of(identity);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return Optional.empty();
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
