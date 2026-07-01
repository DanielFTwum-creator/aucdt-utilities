package gh.edu.techbridge.wms.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Server-side client for the Google OAuth token endpoint. Holds the shared Google
 * client-id/secret (server env only, the same registration WMS uses for its own SSO)
 * and performs the authorization-code exchange on behalf of fleet apps, so the
 * client_secret NEVER lives in any app's env or bundle. Mirrors the GeminiClient
 * pattern: plain JDK HttpClient, no extra dependency, upstream status/body relayed
 * verbatim so callers see Google's own error detail.
 */
@Component
public class GoogleTokenClient {

    private static final Logger log = LoggerFactory.getLogger(GoogleTokenClient.class);
    private static final String TOKEN_URL = "https://oauth2.googleapis.com/token";

    private final String clientId;
    private final String clientSecret;
    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10)).build();

    public GoogleTokenClient(
            @Value("${spring.security.oauth2.client.registration.google.client-id:}") String clientId,
            @Value("${spring.security.oauth2.client.registration.google.client-secret:}") String clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    /** Outcome of the upstream exchange: HTTP status to relay + the raw response body. */
    public record Result(int status, String body) {}

    /** True once the shared Google client credentials are configured on this server. */
    public boolean isConfigured() {
        return clientId != null && !clientId.isBlank()
                && clientSecret != null && !clientSecret.isBlank();
    }

    /**
     * Exchange a Google authorization {@code code} for tokens. {@code redirectUri} must
     * match the URI the app used to obtain the code (Google validates it). Returns
     * Google's status and body verbatim (includes id_token/access_token, or error JSON).
     */
    public Result exchangeCode(String code, String redirectUri) {
        Map<String, String> form = new LinkedHashMap<>();
        form.put("client_id", clientId);
        form.put("client_secret", clientSecret);
        form.put("code", code);
        form.put("grant_type", "authorization_code");
        form.put("redirect_uri", redirectUri);

        StringBuilder body = new StringBuilder();
        for (Map.Entry<String, String> e : form.entrySet()) {
            if (body.length() > 0) body.append('&');
            body.append(URLEncoder.encode(e.getKey(), StandardCharsets.UTF_8))
                .append('=')
                .append(URLEncoder.encode(e.getValue() == null ? "" : e.getValue(), StandardCharsets.UTF_8));
        }

        try {
            HttpRequest req = HttpRequest.newBuilder(URI.create(TOKEN_URL))
                    .timeout(Duration.ofSeconds(30))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body.toString(), StandardCharsets.UTF_8))
                    .build();
            HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());
            if (res.statusCode() >= 400) {
                // Log status only — never the request (holds the secret) nor tokens.
                log.warn("[oauth-relay] Google token exchange returned {}", res.statusCode());
            }
            return new Result(res.statusCode(), res.body());
        } catch (Exception e) {
            log.warn("[oauth-relay] Google token exchange call failed: {}", e.toString());
            return new Result(502, "{\"error\":\"google_token_endpoint_unreachable\"}");
        }
    }
}
