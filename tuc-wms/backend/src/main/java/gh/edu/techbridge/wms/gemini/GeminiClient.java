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

    /** Outcome of a streaming call: status + the live upstream body stream to relay. */
    public record Stream(int status, java.io.InputStream body) {}

    /**
     * Forward a generateContent request to Gemini. {@code requestJson} is the raw
     * Gemini request body (contents/generationConfig/...) supplied by the caller;
     * the proxy adds only the model + key. Returns the upstream status and body
     * verbatim so callers get Gemini's own error detail.
     */
    public Result generateContent(String model, String requestJson) {
        return call(model, "generateContent", requestJson, Duration.ofSeconds(60));
    }

    /**
     * Forward a {@code :predict} request to Gemini — the method Imagen text-to-image
     * models (imagen-4.0-*) use. {@code requestJson} is the raw predict body
     * ({@code {"instances":[...],"parameters":{...}}}) supplied by the caller; the proxy
     * adds only the model + key. Image generation is slower, so the timeout is longer.
     * The key never reaches the browser (same custody as {@link #generateContent}).
     */
    public Result predict(String model, String requestJson) {
        return call(model, "predict", requestJson, Duration.ofSeconds(120));
    }

    /**
     * Forward a {@code :streamGenerateContent} request to Gemini using SSE
     * ({@code alt=sse}) and return the LIVE upstream body stream so the caller can
     * relay each event to the browser as it arrives (progressive BridgeBot answers).
     * Same key custody as {@link #generateContent}: the key is on the URL only and
     * never reaches the browser. On an upstream error the body is drained and
     * re-wrapped so the caller can still relay the detail.
     */
    public Stream streamGenerateContent(String model, String requestJson) {
        String chosen = (model == null || model.isBlank()) ? props.getDefaultModel() : model;
        String url = props.getBaseUrl()
                + "/v1beta/models/" + URLEncoder.encode(chosen, StandardCharsets.UTF_8)
                + ":streamGenerateContent?alt=sse&key=" + URLEncoder.encode(props.getApiKey(), StandardCharsets.UTF_8);
        try {
            HttpRequest req = HttpRequest.newBuilder(URI.create(url))
                    .timeout(Duration.ofSeconds(120))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestJson, StandardCharsets.UTF_8))
                    .build();
            HttpResponse<java.io.InputStream> res = http.send(req, HttpResponse.BodyHandlers.ofInputStream());
            if (res.statusCode() >= 400) {
                String err = new String(res.body().readAllBytes(), StandardCharsets.UTF_8);
                log.warn("[gemini] upstream {} for {}:streamGenerateContent — body: {}", res.statusCode(), chosen, err);
                return new Stream(res.statusCode(),
                        new java.io.ByteArrayInputStream(err.getBytes(StandardCharsets.UTF_8)));
            }
            return new Stream(res.statusCode(), res.body());
        } catch (Exception e) {
            log.warn("[gemini] streamGenerateContent call for model {} failed: {}", chosen, e.toString());
            return new Stream(502, new java.io.ByteArrayInputStream(
                    "{\"error\":\"Gemini upstream stream failed\"}".getBytes(StandardCharsets.UTF_8)));
        }
    }

    /** Shared upstream call for both :generateContent and :predict. */
    private Result call(String model, String method, String requestJson, Duration timeout) {
        String chosen = (model == null || model.isBlank()) ? props.getDefaultModel() : model;
        String url = props.getBaseUrl()
                + "/v1beta/models/" + URLEncoder.encode(chosen, StandardCharsets.UTF_8)
                + ":" + method + "?key=" + URLEncoder.encode(props.getApiKey(), StandardCharsets.UTF_8);
        try {
            HttpRequest req = HttpRequest.newBuilder(URI.create(url))
                    .timeout(timeout)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestJson, StandardCharsets.UTF_8))
                    .build();
            HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());
            if (res.statusCode() >= 400) {
                log.warn("[gemini] upstream {} for {}:{} — body: {}", res.statusCode(), chosen, method, res.body());
            }
            return new Result(res.statusCode(), res.body());
        } catch (Exception e) {
            log.warn("[gemini] {} call for model {} failed: {}", method, chosen, e.toString());
            return new Result(502, "{\"error\":\"Gemini upstream call failed\"}");
        }
    }
}
