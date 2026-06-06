package gh.edu.techbridge.wms.notify;

import gh.edu.techbridge.wms.config.MailProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Sends notification email through the TUC hosted gateway
 * (POST {gatewayUrl}, application/json) — the same mechanism TUC RMS / dmcdai use.
 * Best-effort: never throws into the caller; a blank gateway URL is a logged no-op.
 */
@Component
public class MailGatewayClient {

    private static final Logger log = LoggerFactory.getLogger(MailGatewayClient.class);

    private final MailProperties props;
    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(8)).build();

    public MailGatewayClient(MailProperties props) {
        this.props = props;
    }

    /** Fire-and-forget send. Returns true if the gateway accepted it. */
    public boolean send(String toEmail, String toFullName, String subject, String html) {
        if (!props.isEnabled()) {
            log.info("[mail] gateway URL not configured — skipping send to {} (subject: {})", toEmail, subject);
            return false;
        }
        String payload = "{"
                + "\"applicantId\":" + jsonStr("WMS-" + System.currentTimeMillis())
                + ",\"fullName\":" + jsonStr(toFullName == null ? toEmail : toFullName)
                + ",\"senderEmailId\":" + jsonStr(props.getSender())
                + ",\"receiverEmailId\":" + jsonStr(toEmail)
                + ",\"subject\":" + jsonStr(subject)
                + ",\"message\":" + jsonStr(html)
                + "}";
        try {
            HttpRequest req = HttpRequest.newBuilder(URI.create(props.getGatewayUrl()))
                    .timeout(Duration.ofSeconds(15))
                    .header("Content-Type", "application/json")
                    .header("accept", "*/*")
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();
            HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());
            if (res.statusCode() >= 200 && res.statusCode() < 300) {
                log.info("[mail] sent to {} (subject: {})", toEmail, subject);
                return true;
            }
            log.warn("[mail] gateway returned {} for {} — body: {}", res.statusCode(), toEmail, res.body());
            return false;
        } catch (Exception e) {
            log.warn("[mail] send to {} failed: {}", toEmail, e.toString());
            return false;
        }
    }

    /** Minimal JSON string escaping for the payload values. */
    private static String jsonStr(String s) {
        if (s == null) return "\"\"";
        StringBuilder sb = new StringBuilder("\"");
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"'  -> sb.append("\\\"");
                case '\\' -> sb.append("\\\\");
                case '\n' -> sb.append("\\n");
                case '\r' -> sb.append("\\r");
                case '\t' -> sb.append("\\t");
                default   -> { if (c < 0x20) sb.append(String.format("\\u%04x", (int) c)); else sb.append(c); }
            }
        }
        return sb.append('"').toString();
    }
}
