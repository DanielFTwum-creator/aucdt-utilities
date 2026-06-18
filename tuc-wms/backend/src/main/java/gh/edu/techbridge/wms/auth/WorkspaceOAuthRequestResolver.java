package gh.edu.techbridge.wms.auth;

import gh.edu.techbridge.wms.config.AuthProperties;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

/**
 * Appends hd=<allowed-domain> to every Google authorization URL.
 *
 * Without hd, Google's account chooser can present personal Gmail accounts
 * alongside Workspace accounts. When the browser session holds both, Google
 * may then demand a password for the non-active Workspace account even though
 * the user is already signed in. The hd hint pre-selects the Workspace session
 * and skips that challenge.
 *
 * hd is a hint only — domain enforcement is still done server-side in
 * OAuthSuccessHandler via AuthProperties.allowedDomain.
 */
public class WorkspaceOAuthRequestResolver implements OAuth2AuthorizationRequestResolver {

    private final DefaultOAuth2AuthorizationRequestResolver delegate;
    private final String hostedDomain;

    public WorkspaceOAuthRequestResolver(ClientRegistrationRepository registrations,
                                          String authorizationBase,
                                          AuthProperties props) {
        this.delegate = new DefaultOAuth2AuthorizationRequestResolver(registrations, authorizationBase);
        // Strip the leading "@" so hd=techbridge.edu.gh, not hd=@techbridge.edu.gh
        String domain = props.getAllowedDomain();
        this.hostedDomain = domain.startsWith("@") ? domain.substring(1) : domain;

        this.delegate.setAuthorizationRequestCustomizer(customizer ->
            customizer.additionalParameters(params -> params.put("hd", hostedDomain))
        );
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
        return delegate.resolve(request);
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request, String clientRegistrationId) {
        return delegate.resolve(request, clientRegistrationId);
    }
}
