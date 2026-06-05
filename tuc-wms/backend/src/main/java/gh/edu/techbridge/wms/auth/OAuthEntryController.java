package gh.edu.techbridge.wms.auth;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * Preserves the public SRS §3.2 sign-in entry URL documented in AUTH_API.md:
 *
 *   GET /api/auth/google  →  302  →  /oauth2/authorization/google
 *
 * The actual OAuth2 authorization-request filter lives on Spring's default
 * /oauth2/** namespace (see SecurityConfig). Routing login through that base
 * keeps it from shadowing the sibling SPA endpoints (/api/auth/exchange,
 * /api/auth/refresh, /api/auth/mfa/**), which a shared /api/auth base did —
 * causing every exchange to 401 with InvalidClientRegistrationIdException.
 *
 * This is a full-page browser redirect (the UI navigates here directly); it is
 * never called via XHR.
 */
@RestController
@RequestMapping("/api/auth")
public class OAuthEntryController {

    @GetMapping("/google")
    public void startGoogleLogin(HttpServletResponse res) throws IOException {
        res.sendRedirect("/oauth2/authorization/google");
    }
}
