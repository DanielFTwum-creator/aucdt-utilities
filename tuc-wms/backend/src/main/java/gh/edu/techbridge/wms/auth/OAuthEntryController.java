package gh.edu.techbridge.wms.auth;

import gh.edu.techbridge.wms.config.AuthProperties;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * Preserves the public SRS §3.2 sign-in entry URL documented in AUTH_API.md:
 *
 *   GET /api/auth/google  →  302  →  /api/oauth2/authorization/google
 *
 * The OAuth2 authorization-request filter lives on /api/oauth2/authorization
 * (see SecurityConfig). That base is under /api/ so the Plesk nginx `/api/`
 * proxy reaches the backend — a bare /oauth2/ prefix is NOT proxied and would
 * fall through to the static SPA, looping the user back to /login. It also
 * sits off the /api/auth/{registrationId} path, so it does not shadow the
 * sibling SPA endpoints (/api/auth/exchange, /api/auth/refresh, /api/auth/mfa/**).
 *
 * This is a full-page browser redirect (the UI navigates here directly); it is
 * never called via XHR.
 */
@RestController
@RequestMapping("/api/auth")
public class OAuthEntryController {

    private final AuthProperties props;

    public OAuthEntryController(AuthProperties props) {
        this.props = props;
    }

    /**
     * SSO pass-through (TUC-ICT-SDD-2026-001): an optional {@code app} query param names the
     * originating SPA. When it matches the {@code tucwms.auth.app-bases} allowlist, a short-lived
     * {@code sso_app} cookie is set so OAuthSuccessHandler can redirect back to that app's
     * frontend. Absent/unknown app → no cookie → standard WMS behaviour (default redirect).
     */
    @GetMapping("/google")
    public void startGoogleLogin(@RequestParam(name = "app", required = false) String app,
                                 HttpServletResponse res) throws IOException {
        if (app != null && props.getAppBases().containsKey(app)) {
            res.addHeader(HttpHeaders.SET_COOKIE, SsoAppCookie.write(app, props.getCookieDomain()).toString());
        }
        res.sendRedirect("/api/oauth2/authorization/google");
    }
}
