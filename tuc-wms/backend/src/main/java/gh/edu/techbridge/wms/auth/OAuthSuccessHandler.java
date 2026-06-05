package gh.edu.techbridge.wms.auth;

import gh.edu.techbridge.wms.audit.AuditEvent;
import gh.edu.techbridge.wms.audit.AuditService;
import gh.edu.techbridge.wms.config.AuthProperties;
import gh.edu.techbridge.wms.user.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Runs after Google completes the OAuth2 code flow (callback). Implements the
 * SRS §3.2 sequence post-exchange:
 *   FR-AUTH-009 domain gate → FR-AUTH-010 provision → FR-AUTH-008 MFA gate.
 *
 * Best-practice handoff to the (separately-delivered) SPA: redirect to
 * FRONTEND_BASE with a short-lived, single-use token — never the JWT itself:
 *   - role needs MFA  → ?mfa_ticket=…   (SPA collects TOTP, calls /api/auth/mfa/verify)
 *   - otherwise       → ?code=…         (SPA calls /api/auth/exchange for the JWT)
 *   - domain rejected → ?error=domain   (FR-AUTH-009; the 403 is also audited)
 */
@Component
public class OAuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final GoogleOAuthService oauth;
    private final PendingAuthService pending;
    private final AuditService audit;
    private final String frontendBase;

    public OAuthSuccessHandler(GoogleOAuthService oauth, PendingAuthService pending,
                               AuditService audit, AuthProperties props) {
        this.oauth = oauth;
        this.pending = pending;
        this.audit = audit;
        this.frontendBase = props.getFrontendBase();
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse res, Authentication auth)
            throws IOException {
        OAuth2User principal = (OAuth2User) auth.getPrincipal();
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        String picture = principal.getAttribute("picture");
        String ip = clientIp(req);

        try {
            User user = oauth.resolveOrProvision(email, name, picture, ip);

            if (user.getRole().requiresMfa()) {
                // FR-AUTH-008 — do NOT issue a JWT yet; hand the SPA an MFA ticket.
                String ticket = pending.issueMfaTicket(user.getId());
                audit.record(AuditEvent.MFA_CHALLENGED, user.getEmail(), "role=" + user.getRole(), ip);
                redirect(req, res, frontendBase + "/auth/callback?mfa_ticket=" + enc(ticket));
                return;
            }

            // Fully authenticated → single-use code the SPA exchanges for the JWT.
            String code = pending.issueAuthCode(user.getId());
            redirect(req, res, frontendBase + "/auth/callback?code=" + enc(code));

        } catch (GoogleOAuthService.DomainRejectedException e) {
            // FR-AUTH-009 — redirect with an error marker (the 403 semantics + audit
            // are enforced server-side; a browser redirect can't carry a 403 body).
            redirect(req, res, frontendBase + "/auth/callback?error=domain");
        } catch (GoogleOAuthService.AccountDeactivatedException e) {
            redirect(req, res, frontendBase + "/auth/callback?error=deactivated");
        }
    }

    private void redirect(HttpServletRequest req, HttpServletResponse res, String url) throws IOException {
        // Pass the real request — DefaultRedirectStrategy reads request.getContextPath();
        // a null request NPEs here even on a successful callback.
        getRedirectStrategy().sendRedirect(req, res, url);
    }

    private static String enc(String v) { return URLEncoder.encode(v, StandardCharsets.UTF_8); }

    private static String clientIp(HttpServletRequest req) {
        String xff = req.getHeader("X-Forwarded-For");
        return (xff != null && !xff.isBlank()) ? xff.split(",")[0].trim() : req.getRemoteAddr();
    }
}
