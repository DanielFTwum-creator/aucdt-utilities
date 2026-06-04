package gh.edu.techbridge.wms.config;

import gh.edu.techbridge.wms.auth.JwtAuthFilter;
import gh.edu.techbridge.wms.auth.JwtService;
import gh.edu.techbridge.wms.auth.OAuthSuccessHandler;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Security wiring (FR-AUTH-002/003):
 *  - Google OAuth2 login; entry point GET /api/auth/google.
 *  - On success, OAuthSuccessHandler applies the domain gate / provisioning / MFA
 *    gate and redirects the SPA with a one-time code or MFA ticket.
 *  - Stateless JWT bearer auth on every other /api/** request.
 */
@Configuration
@EnableConfigurationProperties(AuthProperties.class)
public class SecurityConfig {

    private final OAuthSuccessHandler successHandler;
    private final JwtService jwtService;
    private final AuthProperties props;

    public SecurityConfig(OAuthSuccessHandler successHandler, JwtService jwtService, AuthProperties props) {
        this.successHandler = successHandler;
        this.jwtService = jwtService;
        this.props = props;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)   // stateless JWT API; refresh cookie is HttpOnly+SameSite
            .cors(cors -> cors.configurationSource(corsSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(reg -> reg
                // Public auth endpoints (the OAuth dance + SPA token exchange/refresh).
                .requestMatchers(
                        "/api/auth/google/**",
                        "/api/auth/exchange",
                        "/api/auth/mfa/**",
                        "/api/auth/refresh",
                        "/api/auth/logout",
                        "/actuator/health"
                ).permitAll()
                // Admin-only user management (FR-AUTH-004).
                .requestMatchers("/api/admin/**").hasRole("SYSTEM_ADMIN")
                .anyRequest().authenticated()
            )
            // Google OAuth2 login. authorizationEndpoint base path gives us
            // GET /api/auth/google (per SRS §3.2 step 2) as the initiation URL.
            .oauth2Login(o -> o
                .authorizationEndpoint(a -> a.baseUri("/api/auth/google"))
                .redirectionEndpoint(r -> r.baseUri("/api/auth/google/callback"))
                .successHandler(successHandler)
                .failureHandler((req, res, ex) ->
                        res.sendRedirect(props.getFrontendBase() + "/auth/callback?error=oauth"))
            )
            // JWT bearer auth for stateless API access.
            .addFilterBefore(new JwtAuthFilter(jwtService), UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(e -> e.authenticationEntryPoint(unauthorizedEntryPoint()));

        return http.build();
    }

    /** Return 401 (not a redirect) for unauthenticated API calls. */
    private AuthenticationEntryPoint unauthorizedEntryPoint() {
        return (req, res, ex) -> res.sendError(HttpStatus.UNAUTHORIZED.value(), "Unauthorized");
    }

    private CorsConfigurationSource corsSource() {
        CorsConfiguration c = new CorsConfiguration();
        c.setAllowedOrigins(List.of(props.getFrontendBase()));
        c.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        c.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        c.setAllowCredentials(true);   // refresh-token HttpOnly cookie
        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", c);
        return src;
    }
}
