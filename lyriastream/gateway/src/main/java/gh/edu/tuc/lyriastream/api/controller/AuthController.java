package gh.edu.tuc.lyriastream.api.controller;

import gh.edu.tuc.lyriastream.domain.entity.UserEntity;
import gh.edu.tuc.lyriastream.security.JwtService;
import gh.edu.tuc.lyriastream.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.web.server.ServerWebExchange;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    public record RegisterRequest(
        @Email @NotBlank String email,
        @Size(min = 8, max = 128) @NotBlank String password,
        String displayName
    ) {}

    public record LoginRequest(
        @Email @NotBlank String email,
        @NotBlank String password,
        String totpCode   // required only for ADMIN accounts
    ) {}

    @PostMapping("/register")
    public Mono<ResponseEntity<Map<String, Object>>> register(@Valid @RequestBody RegisterRequest req) {
        return Mono.fromCallable(() -> userService.register(req.email(), req.password(), req.displayName()))
            .map(user -> ResponseEntity.status(HttpStatus.CREATED)
                .<Map<String, Object>>body(Map.of(
                    "userId", user.getUuid(),
                    "message", "Registration successful. Please verify your email."
                )))
            .onErrorResume(UserService.AuthException.class, e ->
                Mono.just(ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "EMAIL_TAKEN", "message", e.getMessage())))
            );
    }

    @PostMapping("/login")
    public Mono<ResponseEntity<Map<String, Object>>> login(
        @Valid @RequestBody LoginRequest req,
        ServerWebExchange exchange
    ) {
        return Mono.fromCallable(() -> userService.authenticate(req.email(), req.password(), req.totpCode()))
            .map(user -> {
                String accessToken  = jwtService.generateAccessToken(user);
                String refreshToken = jwtService.generateRefreshToken(user);

                // Refresh token in httpOnly cookie
                ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("Strict")
                    .path("/api/v1/auth/refresh")
                    .maxAge(7 * 24 * 3600)
                    .build();

                return ResponseEntity.ok()
                    .header("Set-Cookie", cookie.toString())
                    .body(Map.<String, Object>of(
                        "accessToken", accessToken,
                        "role", user.getRole().name(),
                        "quotaRemaining", user.getDailyQuota() - user.getQuotaUsedToday()
                    ));
            })
            .onErrorResume(UserService.AuthException.class, e ->
                Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "AUTH_FAILED", "message", e.getMessage())))
            );
    }

    @PostMapping("/refresh")
    public Mono<Map<String, Object>> refresh(
        @CookieValue(name = "refreshToken", required = false) String refreshToken
    ) {
        if (refreshToken == null || !jwtService.isValid(refreshToken)) {
            return Mono.error(new RuntimeException("Invalid refresh token"));
        }
        String userUuid = jwtService.extractSubject(refreshToken);
        return Mono.fromCallable(() -> userService.findByUuid(userUuid))
            .map(user -> Map.<String, Object>of(
                "accessToken", jwtService.generateAccessToken(user)
            ));
    }
}
