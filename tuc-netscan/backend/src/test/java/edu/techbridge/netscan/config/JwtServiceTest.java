package edu.techbridge.netscan.config;

import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private final JwtService jwtService = new JwtService(
        "dev-secret-key-tuc-netscan-2026-not-for-production-use-a-bit-longer-to-satisfy-hmac-sha",
        8
    );

    @Test
    void testGenerateAndExtract() {
        String username = "daniel.twum";
        List<String> roles = List.of("ENGINEER");

        String token = jwtService.generate(username, roles);
        assertNotNull(token);

        String extracted = jwtService.extractUsername(token);
        assertEquals(username, extracted);
    }

    @Test
    void testTokenValidity() {
        String username = "admin";
        List<String> roles = List.of("ADMIN");

        String token = jwtService.generate(username, roles);
        assertTrue(jwtService.isValid(token));
        assertFalse(jwtService.isValid(token + "invalid"));
    }
}
