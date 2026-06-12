package com.lems.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

/**
 * Access policy for LEMS (replaces the former hard-coded admin password):
 *
 *   - OPTIONS, /health                       -> public (probes, CORS preflight)
 *   - GET /lecturers|/courses|/programmes    -> public reference data (the
 *                                               evaluation form needs the lists)
 *   - POST /evaluations/submit, GET /auth/me -> any authenticated @techbridge.edu.gh
 *                                               identity (staff or student; WMS SSO)
 *   - everything else                        -> WMS admin roles only
 *
 * The verified identity is exposed to controllers as request attribute
 * {@link #IDENTITY_ATTR}. Identity comes from the IdP relay (WmsAuthService);
 * evaluations themselves are stored WITHOUT identity — only a salted dedupe
 * hash — so eligibility is proven but responses stay anonymous.
 */
@Component
public class WmsAuthFilter extends OncePerRequestFilter {

    public static final String IDENTITY_ATTR = "wms.identity";

    private final WmsAuthService wmsAuth;

    public WmsAuthFilter(WmsAuthService wmsAuth) {
        this.wmsAuth = wmsAuth;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String path = req.getServletPath();   // context-path /api already stripped
        String method = req.getMethod();

        if ("OPTIONS".equals(method) || path.equals("/health") || isPublicRead(method, path)) {
            chain.doFilter(req, res);
            return;
        }

        Optional<WmsIdentity> identity = wmsAuth.resolve(bearer(req));
        if (identity.isEmpty()) {
            deny(res, 401, "Sign in with your @techbridge.edu.gh account (WMS SSO).");
            return;
        }
        req.setAttribute(IDENTITY_ATTR, identity.get());

        boolean anyIdentityOk = (path.equals("/evaluations/submit") && "POST".equals(method))
                || (path.equals("/auth/me") && "GET".equals(method));
        if (anyIdentityOk || identity.get().isAdmin()) {
            chain.doFilter(req, res);
            return;
        }
        deny(res, 403, "This area is restricted to LEMS administrators.");
    }

    private boolean isPublicRead(String method, String path) {
        return "GET".equals(method)
                && (path.startsWith("/lecturers") || path.startsWith("/courses") || path.startsWith("/programmes"));
    }

    private String bearer(HttpServletRequest req) {
        String h = req.getHeader("Authorization");
        return (h != null && h.startsWith("Bearer ")) ? h.substring(7) : null;
    }

    private void deny(HttpServletResponse res, int status, String message) throws IOException {
        res.setStatus(status);
        res.setContentType("application/json");
        res.getWriter().write("{\"success\":false,\"message\":\"" + message + "\"}");
    }
}
