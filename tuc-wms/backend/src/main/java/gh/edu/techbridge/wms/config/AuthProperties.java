package gh.edu.techbridge.wms.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Binds the tucwms.auth.* settings from application.yml / env (SRS §3.3). */
@ConfigurationProperties(prefix = "tucwms.auth")
public class AuthProperties {
    private String allowedDomain = "@techbridge.edu.gh";
    private String jwtSecret;
    private int jwtExpiryMinutes = 15;
    private int jwtRefreshExpiryDays = 7;
    private String totpIssuer = "TUC-WMS";
    private String frontendBase = "https://wms.techbridge.edu.gh";

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
}
