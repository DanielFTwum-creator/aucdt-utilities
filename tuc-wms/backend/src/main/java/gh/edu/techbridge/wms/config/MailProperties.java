package gh.edu.techbridge.wms.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Binds tucwms.mail.* — notification email via the TUC hosted gateway
 * (POST {gatewayUrl}). A blank gatewayUrl disables sending (dev default): the
 * mail service then logs and no-ops, so local runs never hit the network.
 */
@ConfigurationProperties(prefix = "tucwms.mail")
public class MailProperties {
    private String gatewayUrl = "";                       // e.g. https://api.techbridge.edu.gh/aucdt-dev/sendMail
    private String sender = "noreply@techbridge.edu.gh";

    public String getGatewayUrl() { return gatewayUrl; }
    public void setGatewayUrl(String v) { this.gatewayUrl = v; }
    public String getSender() { return sender; }
    public void setSender(String v) { this.sender = v; }

    public boolean isEnabled() { return gatewayUrl != null && !gatewayUrl.isBlank(); }
}
