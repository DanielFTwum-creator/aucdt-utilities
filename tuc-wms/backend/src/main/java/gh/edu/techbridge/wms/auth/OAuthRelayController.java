package gh.edu.techbridge.wms.auth;

import gh.edu.techbridge.wms.gemini.GeminiProperties;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Google OAuth token-exchange relay for standalone fleet apps.
 *
 * <p>Public-facing apps keep their own Google login (per the 2026-06-09 audience
 * policy — they serve students/external users, so are NOT onboarded to WMS SSO).
 * Previously each app held the shared GOOGLE_CLIENT_SECRET in its own env to run
 * the server-side code→token exchange. This relay moves that exchange here so the
 * secret lives in exactly one place ({@code /opt/tuc-wms/.env}), matching the same
 * sole-custody model as the Gemini key proxy.
 *
 * <p>Auth: the caller presents the fleet service credential as the
 * {@code X-Gemini-Proxy-Key} header (the same key apps already hold server-side for
 * the Gemini relay). Not domain-gated — unlike WMS SSO — because these apps' end
 * users are not @techbridge.edu.gh accounts. The relay returns Google's token
 * response verbatim, so an app's existing downstream code (decode id_token, set its
 * own session cookie) is unchanged; it just stops holding the secret.
 */
@RestController
@RequestMapping("/api/oauth/google")
public class OAuthRelayController {

    private final GeminiProperties auth;   // reused for X-Gemini-Proxy-Key validation
    private final GoogleTokenClient google;

    public OAuthRelayController(GeminiProperties auth, GoogleTokenClient google) {
        this.auth = auth;
        this.google = google;
    }

    /**
     * Exchange a Google authorization code for tokens. Body: {@code {"code": "...",
     * "redirectUri": "https://.../<app>/auth/google/callback"}}. The redirectUri must
     * match the one the app used to obtain the code.
     */
    @PostMapping(value = "/exchange", consumes = MediaType.APPLICATION_JSON_VALUE,
                 produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> exchange(
            @RequestHeader(value = "X-Gemini-Proxy-Key", required = false) String proxyKey,
            @RequestBody Map<String, Object> body) {

        if (!auth.matchesProxyKey(proxyKey)) {
            return json(401, "{\"error\":\"Unauthorised: present a valid X-Gemini-Proxy-Key.\"}");
        }
        if (!google.isConfigured()) {
            return json(503, "{\"error\":\"Google client credentials not configured on the WMS server.\"}");
        }
        String code = body.get("code") == null ? null : String.valueOf(body.get("code"));
        String redirectUri = body.get("redirectUri") == null ? null : String.valueOf(body.get("redirectUri"));
        if (code == null || code.isBlank() || redirectUri == null || redirectUri.isBlank()) {
            return json(400, "{\"error\":\"Missing 'code' or 'redirectUri'.\"}");
        }

        GoogleTokenClient.Result r = google.exchangeCode(code, redirectUri);
        return json(r.status(), r.body());
    }

    private static ResponseEntity<String> json(int status, String body) {
        return ResponseEntity.status(status).contentType(MediaType.APPLICATION_JSON).body(body);
    }
}
