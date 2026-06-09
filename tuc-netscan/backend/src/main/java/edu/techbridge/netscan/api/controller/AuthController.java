package edu.techbridge.netscan.api.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.techbridge.netscan.config.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final ObjectMapper objectMapper;

    /** WMS identity provider base (TUC-ICT-SRS-2026-013). Override per env. */
    @Value("${netscan.sso.wms-base:https://wms.techbridge.edu.gh}")
    private String wmsBase;

    public record LoginRequest(@NotBlank String username, @NotBlank String password) {}
    public record LoginResponse(String token, String username, String role, long expiresIn) {}
    public record SsoExchangeRequest(@NotBlank String wmsToken) {}

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.username(), req.password()));
        List<String> roles = auth.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        String token = jwtService.generate(req.username(), roles);
        return ResponseEntity.ok(new LoginResponse(token, req.username(),
            roles.isEmpty() ? "ENGINEER" : roles.get(0), 28800));
    }

    /**
     * SSO bootstrap (TUC-ICT-SRS-2026-013 §5.1, FR-SSO-008): trust a WMS access token by relaying it
     * to the WMS {@code /api/me} endpoint (no shared secret), then issue NetScan's own JWT with the
     * WMS-derived role. The frontend obtains the WMS token via the standard SSO pass-through flow.
     */
    @PostMapping("/sso-exchange")
    public ResponseEntity<LoginResponse> ssoExchange(@Valid @RequestBody SsoExchangeRequest req) {
        try {
            HttpRequest meReq = HttpRequest.newBuilder()
                .uri(URI.create(wmsBase + "/api/me"))
                .header("Authorization", "Bearer " + req.wmsToken())
                .timeout(Duration.ofSeconds(10))
                .GET().build();
            HttpResponse<String> resp = HttpClient.newHttpClient()
                .send(meReq, HttpResponse.BodyHandlers.ofString());
            if (resp.statusCode() != 200) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            JsonNode me = objectMapper.readTree(resp.body());
            String email = me.path("email").asText("");
            String wmsRole = me.path("role").asText("");
            if (email.isBlank()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

            // Derive NetScan role from the WMS role: admins/HOD -> ADMIN, otherwise ENGINEER.
            String netscanRole = ("SYSTEM_ADMIN".equals(wmsRole) || "HOD".equals(wmsRole))
                ? "ADMIN" : "ENGINEER";
            String token = jwtService.generate(email, List.of("ROLE_" + netscanRole));
            log.info("[SSO] exchange ok for {} (wmsRole={} -> {})", email, wmsRole, netscanRole);
            return ResponseEntity.ok(new LoginResponse(token, email, netscanRole, 28800));
        } catch (Exception e) {
            Thread.currentThread().interrupt();
            log.warn("[SSO] exchange failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
