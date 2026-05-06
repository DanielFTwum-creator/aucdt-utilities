package gh.edu.tuc.send.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Send Platform API",
        version = "1.0.0",
        description = "Techbridge University College — Scheduled Report Delivery REST API",
        contact = @Contact(name = "TUC Engineering", email = "dev@tuc.edu.gh")
    ),
    servers = @Server(url = "/api", description = "Local dev server"),
    security = @SecurityRequirement(name = "bearerAuth")
)
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    description = "Paste the JWT token from POST /api/auth/login"
)
public class OpenApiConfig {}
