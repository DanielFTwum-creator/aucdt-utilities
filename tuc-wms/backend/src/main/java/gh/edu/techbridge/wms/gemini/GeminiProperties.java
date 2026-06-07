package gh.edu.techbridge.wms.gemini;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Binds tucwms.gemini.* — the central Gemini API key proxy. The key lives ONLY here
 * (server-side env), never in any client bundle. A blank apiKey disables the proxy
 * (dev default): {@link GeminiClient} then returns a 503 so local runs never hit the
 * network or require a real key.
 */
@ConfigurationProperties(prefix = "tucwms.gemini")
public class GeminiProperties {

    /** Google AI Studio API key. Blank = proxy disabled (dev default). */
    private String apiKey = "";

    /**
     * Service credential for server-side relays (standalone fleet apps that have no
     * WMS user JWT). A relay sends it as the X-Gemini-Proxy-Key header. Held only in
     * each app's SERVER-side env + here — never in any browser bundle. Blank = no
     * service callers accepted (only logged-in WMS users can call the proxy).
     */
    private String proxyKey = "";

    /** Default model when the caller does not specify one. */
    private String defaultModel = "gemini-2.5-flash";

    /** Base URL of the Generative Language REST API. */
    private String baseUrl = "https://generativelanguage.googleapis.com";

    public String getApiKey() { return apiKey; }
    public void setApiKey(String v) { this.apiKey = v; }

    public String getProxyKey() { return proxyKey; }
    public void setProxyKey(String v) { this.proxyKey = v; }

    /** True once a service proxy key is configured (enables relay callers). */
    public boolean hasProxyKey() { return proxyKey != null && !proxyKey.isBlank(); }

    /** Constant-time check of a presented service key against the configured one. */
    public boolean matchesProxyKey(String presented) {
        if (!hasProxyKey() || presented == null) return false;
        byte[] a = proxyKey.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        byte[] b = presented.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        return java.security.MessageDigest.isEqual(a, b);
    }

    public String getDefaultModel() { return defaultModel; }
    public void setDefaultModel(String v) { this.defaultModel = v; }

    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String v) { this.baseUrl = v; }

    public boolean isEnabled() { return apiKey != null && !apiKey.isBlank(); }
}
