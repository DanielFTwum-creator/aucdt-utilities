package gh.edu.techbridge.wms.auth;

import gh.edu.techbridge.wms.config.AuthProperties;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseCookie;

import java.time.Duration;

/**
 * SSO pass-through (TUC-ICT-SDD-2026-001) — carries the originating app across the
 * stateless Google OAuth dance via a short-lived cookie, so the success/failure
 * handler can redirect the browser back to the right app frontend.
 *
 * Open-redirect safety: the cookie only holds an opaque appId; the destination URL
 * is always looked up server-side in the {@code tucwms.auth.app-bases} allowlist and
 * falls back to the WMS frontendBase. A request value is never used as a redirect URL.
 */
public final class SsoAppCookie {

    public static final String NAME = "sso_app";
    private static final Duration TTL = Duration.ofMinutes(5);

    private SsoAppCookie() { }

    /** Build the cookie set at OAuth initiation. {@code path=/api} so it is sent to the callback. */
    public static ResponseCookie write(String appId, String cookieDomain) {
        return base(appId, cookieDomain).maxAge(TTL).build();
    }

    /** Build the clearing cookie emitted on the final redirect. */
    public static ResponseCookie clear(String cookieDomain) {
        return base("", cookieDomain).maxAge(0).build();
    }

    private static ResponseCookie.ResponseCookieBuilder base(String value, String cookieDomain) {
        ResponseCookie.ResponseCookieBuilder b = ResponseCookie.from(NAME, value)
                .httpOnly(true).secure(true).sameSite("Lax").path("/api");
        if (cookieDomain != null && !cookieDomain.isBlank()) b.domain(cookieDomain);
        return b;
    }

    /**
     * Resolve the app frontend base from the request's {@code sso_app} cookie, validated
     * against the allowlist. Returns the WMS frontendBase when absent or unknown.
     */
    public static String resolveBase(HttpServletRequest req, AuthProperties props) {
        String appId = readCookie(req);
        if (appId != null) {
            String base = props.getAppBases().get(appId);
            if (base != null) return base;
        }
        return props.getFrontendBase();
    }

    private static String readCookie(HttpServletRequest req) {
        if (req.getCookies() == null) return null;
        for (jakarta.servlet.http.Cookie c : req.getCookies()) {
            if (NAME.equals(c.getName()) && c.getValue() != null && !c.getValue().isBlank()) {
                return c.getValue();
            }
        }
        return null;
    }
}
