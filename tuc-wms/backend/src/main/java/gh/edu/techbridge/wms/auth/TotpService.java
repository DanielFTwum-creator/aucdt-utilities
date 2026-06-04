package gh.edu.techbridge.wms.auth;

import com.eatthepath.otp.TimeBasedOneTimePasswordGenerator;
import gh.edu.techbridge.wms.config.AuthProperties;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

/**
 * TOTP MFA (FR-AUTH-008), Google Authenticator compatible. Generates per-user
 * secrets and verifies 6-digit codes with a +/-1 step window for clock skew.
 *
 * NOTE: secrets are returned Base64 here for storage; production should encrypt
 * them at rest (the User.totpSecret column is sized for an encrypted value).
 */
@Service
public class TotpService {

    private final TimeBasedOneTimePasswordGenerator totp = new TimeBasedOneTimePasswordGenerator();
    private final String issuer;

    public TotpService(AuthProperties props) {
        this.issuer = props.getTotpIssuer();
    }

    /** Generate a new HmacSHA1 secret, returned Base64-encoded for storage. */
    public String generateSecret() throws Exception {
        KeyGenerator kg = KeyGenerator.getInstance(totp.getAlgorithm());
        kg.init(160, new SecureRandom());
        return Base64.getEncoder().encodeToString(kg.generateKey().getEncoded());
    }

    /** otpauth:// URI for QR enrolment in an authenticator app. */
    public String provisioningUri(String accountEmail, String base64Secret) {
        String secretB32 = base32(Base64.getDecoder().decode(base64Secret));
        String label = URLEncoder.encode(issuer + ":" + accountEmail, StandardCharsets.UTF_8);
        return "otpauth://totp/" + label
                + "?secret=" + secretB32
                + "&issuer=" + URLEncoder.encode(issuer, StandardCharsets.UTF_8)
                + "&algorithm=SHA1&digits=6&period=30";
    }

    /** Verify a 6-digit code against the stored secret, allowing +/-1 time step. */
    public boolean verify(String base64Secret, String code) {
        try {
            SecretKey key = new SecretKeySpec(Base64.getDecoder().decode(base64Secret), totp.getAlgorithm());
            int submitted = Integer.parseInt(code.trim());
            Instant now = Instant.now();
            for (int step = -1; step <= 1; step++) {
                int expected = totp.generateOneTimePassword(key, now.plusSeconds(step * 30L));
                if (expected == submitted) return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    // Minimal RFC 4648 Base32 (no padding) for the otpauth secret.
    private static String base32(byte[] data) {
        final String A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        StringBuilder sb = new StringBuilder();
        int buffer = 0, bits = 0;
        for (byte b : data) {
            buffer = (buffer << 8) | (b & 0xFF);
            bits += 8;
            while (bits >= 5) {
                sb.append(A.charAt((buffer >> (bits - 5)) & 0x1F));
                bits -= 5;
            }
        }
        if (bits > 0) sb.append(A.charAt((buffer << (5 - bits)) & 0x1F));
        return sb.toString();
    }
}
