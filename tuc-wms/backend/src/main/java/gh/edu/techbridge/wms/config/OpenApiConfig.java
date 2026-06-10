package gh.edu.techbridge.wms.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI metadata for the WMS API docs. Springdoc only serves these when enabled
 * (SWAGGER_ENABLED=true — OFF in production), so this never exposes the live auth API.
 * Declares the Bearer-JWT scheme so the docs reflect that most /api/** endpoints need an
 * access token obtained via the Google OAuth + /api/auth/exchange flow.
 */
@Configuration
@OpenAPIDefinition(info = @Info(
        title = "TUC-WMS API",
        version = "1.0.0",
        description = "Work Management System + fleet SSO/MFA auth backbone. "
                + "Public: the OAuth dance, token exchange/refresh, MFA, logout, health, and the "
                + "Gemini proxy. Everything else under /api/** requires a Bearer JWT; "
                + "/api/admin/** requires the SYSTEM_ADMIN role."
))
@SecurityScheme(
        name = "bearer-jwt",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class OpenApiConfig {
}
