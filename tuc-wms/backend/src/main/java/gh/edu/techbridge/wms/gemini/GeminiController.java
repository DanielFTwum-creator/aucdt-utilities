package gh.edu.techbridge.wms.gemini;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Central Gemini key proxy (Phase 2 of the PM2→WMS migration). Every TUC app that
 * needs Gemini calls here instead of bundling the API key — no key ever reaches a
 * client. Two caller types are accepted on /generate:
 *   - a logged-in WMS user (bearer JWT, populated by JwtAuthFilter), or
 *   - a server-side fleet-app relay presenting the X-Gemini-Proxy-Key service header.
 * Standalone public apps have no WMS login, so they relay via their own server.ts
 * (the OmniExtract pattern) holding the proxy key server-side. Consumers send the raw
 * Gemini generateContent body; the proxy relays Gemini's status + body verbatim.
 */
@RestController
@RequestMapping("/api/gemini")
public class GeminiController {

    private final GeminiProperties props;
    private final GeminiClient client;

    public GeminiController(GeminiProperties props, GeminiClient client) {
        this.props = props;
        this.client = client;
    }

    /**
     * PUBLIC health probe (no auth) — returns ONLY a boolean readiness flag, never
     * the key or any config detail. Lets ops confirm in a browser that the proxy is
     * deployed and the key is loaded: {"ready":true} once GEMINI_API_KEY is set.
     */
    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("ready", props.isEnabled());
    }

    /** Liveness/config probe (auth required) — true once GEMINI_API_KEY is set on the server. */
    @GetMapping("/status")
    public Map<String, Object> status() {
        return Map.of("enabled", props.isEnabled(), "defaultModel", props.getDefaultModel());
    }

    /**
     * Proxy a Gemini generateContent call. Body is the raw Gemini request JSON
     * (contents/generationConfig/...); ?model= overrides the server default.
     */
    @PostMapping(value = "/generate", consumes = MediaType.APPLICATION_JSON_VALUE,
                 produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> generate(@RequestParam(required = false) String model,
                                            @RequestHeader(value = "X-Gemini-Proxy-Key", required = false) String proxyKey,
                                            @RequestBody String requestJson) {
        if (!isAuthorised(proxyKey)) {
            return ResponseEntity.status(401)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"error\":\"Unauthorised: present a WMS bearer token or a valid X-Gemini-Proxy-Key.\"}");
        }
        if (!props.isEnabled()) {
            return ResponseEntity.status(503)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"error\":\"GEMINI_API_KEY not configured on the WMS server.\"}");
        }
        GeminiClient.Result r = client.generateContent(model, requestJson);
        return ResponseEntity.status(r.status())
                .contentType(MediaType.APPLICATION_JSON)
                .body(r.body());
    }

    /** Accept either an authenticated WMS user (JWT) or a valid service proxy key. */
    private boolean isAuthorised(String presentedProxyKey) {
        if (props.matchesProxyKey(presentedProxyKey)) return true;
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.isAuthenticated()
                && !"anonymousUser".equals(String.valueOf(auth.getPrincipal()));
    }
}
