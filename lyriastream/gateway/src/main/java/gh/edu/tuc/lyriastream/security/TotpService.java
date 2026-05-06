package gh.edu.tuc.lyriastream.security;

import dev.samstevens.totp.code.*;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import gh.edu.tuc.lyriastream.config.AppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class TotpService {

    private static final Logger log = LoggerFactory.getLogger(TotpService.class);

    private final AppProperties props;
    private final SecretGenerator secretGenerator = new DefaultSecretGenerator(32);

    public TotpService(AppProperties props) {
        this.props = props;
    }

    // ── Secret generation ─────────────────────────────────────────────────────

    /** Generate a new TOTP secret (base32) — call once at admin registration. */
    public String generateSecret() {
        return secretGenerator.generate();
    }

    /** Encrypt a plaintext TOTP secret before storing in DB. */
    public String encrypt(String plainSecret) {
        try {
            byte[] iv = new byte[16];
            new SecureRandom().nextBytes(iv);
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, aesKey(), new IvParameterSpec(iv));
            byte[] encrypted = cipher.doFinal(plainSecret.getBytes(StandardCharsets.UTF_8));
            // Prepend IV to ciphertext, base64-encode the result
            byte[] combined = new byte[iv.length + encrypted.length];
            System.arraycopy(iv, 0, combined, 0, iv.length);
            System.arraycopy(encrypted, 0, combined, iv.length, encrypted.length);
            return Base64.getEncoder().encodeToString(combined);
        } catch (Exception e) {
            throw new IllegalStateException("TOTP encryption failed", e);
        }
    }

    /** Decrypt a stored TOTP secret for validation. */
    public String decrypt(String encryptedB64) {
        try {
            byte[] combined = Base64.getDecoder().decode(encryptedB64);
            byte[] iv = new byte[16];
            byte[] ciphertext = new byte[combined.length - 16];
            System.arraycopy(combined, 0, iv, 0, 16);
            System.arraycopy(combined, 16, ciphertext, 0, ciphertext.length);
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, aesKey(), new IvParameterSpec(iv));
            return new String(cipher.doFinal(ciphertext), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new IllegalStateException("TOTP decryption failed", e);
        }
    }

    // ── Code verification ─────────────────────────────────────────────────────

    /**
     * Verify a 6-digit TOTP code against an encrypted secret.
     * Allows ±1 time-step window (30 s each side).
     */
    public boolean verify(String encryptedSecret, String code) {
        try {
            String plainSecret = decrypt(encryptedSecret);
            CodeVerifier verifier = new DefaultCodeVerifier(
                new DefaultCodeGenerator(HashingAlgorithm.SHA1, 6),
                new SystemTimeProvider()
            );
            ((DefaultCodeVerifier) verifier).setTimePeriod(30);
            ((DefaultCodeVerifier) verifier).setAllowedTimePeriodDiscrepancy(1);
            return verifier.isValidCode(plainSecret, code);
        } catch (Exception e) {
            log.warn("TOTP verification error: {}", e.getMessage());
            return false;
        }
    }

    // ── Private ───────────────────────────────────────────────────────────────

    private SecretKeySpec aesKey() {
        byte[] key = props.totp().encryptionKey()
            .getBytes(StandardCharsets.UTF_8);
        // Pad or truncate to 32 bytes (AES-256)
        byte[] key32 = new byte[32];
        System.arraycopy(key, 0, key32, 0, Math.min(key.length, 32));
        return new SecretKeySpec(key32, "AES");
    }
}
