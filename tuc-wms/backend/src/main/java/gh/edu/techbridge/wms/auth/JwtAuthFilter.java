package gh.edu.techbridge.wms.auth;

import gh.edu.techbridge.wms.user.Role;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Validates the TUC-WMS access JWT (Authorization: Bearer …) and populates the
 * SecurityContext with the user's role authority for RBAC (FR-AUTH-002/003).
 * Stateless — no session.
 */
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthFilter.class);

    private final JwtService jwt;

    public JwtAuthFilter(JwtService jwt) {
        this.jwt = jwt;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String token = bearerToken(req);
        boolean debug = req.getRequestURI().contains("/members");   // TEMP: only log the failing path
        if (token != null) {
            try {
                Claims claims = jwt.parse(token);
                if (!jwt.isRefresh(claims)) {  // refresh tokens are not valid for API access
                    Role role = jwt.roleOf(claims);
                    var auth = new UsernamePasswordAuthenticationToken(
                            claims.getSubject(), null,
                            List.of(new SimpleGrantedAuthority(role.authority())));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    if (debug) log.warn("[AUTH-DEBUG] {} {} authenticated as sub={} role={}",
                            req.getMethod(), req.getRequestURI(), claims.getSubject(), role);
                } else if (debug) {
                    log.warn("[AUTH-DEBUG] {} {} token is a REFRESH token (typ), not accepted for API",
                            req.getMethod(), req.getRequestURI());
                }
            } catch (Exception e) {
                if (debug) log.warn("[AUTH-DEBUG] {} {} token REJECTED: {} — {}",
                        req.getMethod(), req.getRequestURI(), e.getClass().getSimpleName(), e.getMessage());
            }
        } else if (debug) {
            log.warn("[AUTH-DEBUG] {} {} NO bearer token on request (Authorization header={})",
                    req.getMethod(), req.getRequestURI(), req.getHeader("Authorization") == null ? "absent" : "present-but-unparsed");
        }
        chain.doFilter(req, res);
    }

    /**
     * Access token from the Authorization: Bearer header, OR — for the SSE stream only —
     * from an ?access_token= query param. Browsers' EventSource cannot set headers, so the
     * stream endpoint accepts the token in the query string (it is never logged; HTTPS-only).
     */
    private static String bearerToken(HttpServletRequest req) {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) return header.substring(7);
        if (req.getRequestURI().endsWith("/stream")) {
            String q = req.getParameter("access_token");
            if (q != null && !q.isBlank()) return q;
        }
        return null;
    }
}
