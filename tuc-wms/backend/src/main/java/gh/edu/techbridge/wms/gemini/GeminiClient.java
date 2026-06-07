package gh.edu.techbridge.wms.gemini;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

/**
 * Server-side client for the Google Generative Language REST API. The Gemini API key
 * is held only in {@link GeminiProperties} (server env) and appended to the upstream
 * URL here — it NEVER reaches the browser. Mirrors the MailGatewayClient pattern:
 * plain JDK HttpClient, no extra dependency, best-effort error handling.
 */
@Component
public class GeminiClient {

    private static final Logger log = LoggerFactory.getLogger(GeminiClient.class);

    private final GeminiProperties props;
    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10)).build();

    public GeminiClient(GeminiProperties props) {
        this.props = props;
    }

    /** Outcome of an upstream call: HTTP status to relay + the raw response body. */
    public record Result(int status, String body) {}

    /**
     * Forward a generateContent request to Gemini. {@code requestJson} is the raw
     * Gemini request body (contents/generationConfig/...) supplied by the caller;
     * the proxy adds only the model + key. Returns the upstream status and body
     * verbatim so callers get Gemini's own error detail.
     */
    public Result generateContent(String model, String requestJson) {
        String chosen = (model == null || model.isBlank()) ? props.getDefaultModel() : model;
        String url = props.getBaseUrl()
                + "/v1beta/models/" + URLEncoder.encode(chosen, StandardCharsets.UTF_8)
                + ":generateContent?key=" + URLEncoder.encode(props.getApiKey(), StandardCharsets.UTF_8);
        try {
            HttpRequest req = HttpRequest.newBuilder(URI.create(url))
                    .timeout(Duration.ofSeconds(60))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestJson, StandardCharsets.UTF_8))
                    .build();
            HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());
            if (res.statusCode() >= 400) {
                log.warn("[gemini] upstream {} for model {} — body: {}", res.statusCode(), chosen, res.body());
            }
            return new Result(res.statusCode(), res.body());
        } catch (Exception e) {
            log.warn("[gemini] call for model {} failed: {}", chosen, e.toString());
            return new Result(502, "{\"error\":\"Gemini upstream call failed\"}");
        }
    }
}
