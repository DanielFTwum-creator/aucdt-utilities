package gh.edu.techbridge.wms.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;
import java.util.Map;

/** Binds the tucwms.auth.* settings from application.yml / env (SRS §3.3). */
@ConfigurationProperties(prefix = "tucwms.auth")
public class AuthProperties {
    private String allowedDomain = "@techbridge.edu.gh";
    private String jwtSecret;
    private int jwtExpiryMinutes = 15;
    private int jwtRefreshExpiryDays = 7;
    private String totpIssuer = "TUC-WMS";
    private String frontendBase = "https://wms.techbridge.edu.gh";

    /**
     * SSO pass-through (TUC-ICT-SDD-2026-001). All three default to single-tenant WMS
     * behaviour, so an unconfigured deployment is unchanged.
     */
    /** Cookie Domain for the refresh cookie. Empty = host-only (current behaviour). Set to ".techbridge.edu.gh" to share across subdomains. */
    private String cookieDomain = "";
    /** CORS allowed origins. Empty = fall back to [frontendBase]. */
    private List<String> allowedOrigins = List.of();
    /** appId → frontend base for the post-login redirect allowlist. Empty = only WMS (frontendBase). */
    private Map<String, String> appBases = Map.of();

    public String getAllowedDomain() { return allowedDomain; }
    public void setAllowedDomain(String v) { this.allowedDomain = v; }
    public String getJwtSecret() { return jwtSecret; }
    public void setJwtSecret(String v) { this.jwtSecret = v; }
    public int getJwtExpiryMinutes() { return jwtExpiryMinutes; }
    public void setJwtExpiryMinutes(int v) { this.jwtExpiryMinutes = v; }
    public int getJwtRefreshExpiryDays() { return jwtRefreshExpiryDays; }
    public void setJwtRefreshExpiryDays(int v) { this.jwtRefreshExpiryDays = v; }
    public String getTotpIssuer() { return totpIssuer; }
    public void setTotpIssuer(String v) { this.totpIssuer = v; }
    public String getFrontendBase() { return frontendBase; }
    public void setFrontendBase(String v) { this.frontendBase = v; }
    public String getCookieDomain() { return cookieDomain; }
    public void setCookieDomain(String v) { this.cookieDomain = v; }
    public List<String> getAllowedOrigins() { return allowedOrigins; }
    public void setAllowedOrigins(List<String> v) { this.allowedOrigins = v; }
    public Map<String, String> getAppBases() { return appBases; }
    public void setAppBases(Map<String, String> v) { this.appBases = v; }
}
