package gh.edu.tuc.lyriastream.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.util.List;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
    Aim aim,
    Jwt jwt,
    Totp totp,
    Cors cors,
    Audio audio,
    RateLimit rateLimit,
    Quotas quotas
) {
    public record Aim(
        String baseUrl,
        String apiKey,
        @DefaultValue("5000") int connectTimeoutMs,
        @DefaultValue("300000") int readTimeoutMs
    ) {}

    public record Jwt(
        String secret,
        @DefaultValue("900000") long accessExpiryMs,
        @DefaultValue("604800000") long refreshExpiryMs
    ) {}

    public record Totp(
        String encryptionKey
    ) {}

    public record Cors(
        @DefaultValue("http://localhost:3000") String allowedOrigins
    ) {
        public List<String> originList() {
            return List.of(allowedOrigins.split(","));
        }
    }

    public record Audio(
        @DefaultValue("/var/lyriastream/audio") String storagePath
    ) {}

    public record RateLimit(
        @DefaultValue("60") int authenticatedRpm,
        @DefaultValue("10") int anonymousRpm
    ) {}

    public record Quotas(
        @DefaultValue("3") int guest,
        @DefaultValue("20") int free,
        @DefaultValue("100") int pro
    ) {}
}
