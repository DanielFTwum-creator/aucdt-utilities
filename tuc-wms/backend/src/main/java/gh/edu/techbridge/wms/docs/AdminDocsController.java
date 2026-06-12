package gh.edu.techbridge.wms.docs;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

/**
 * Internal documentation served to SYSTEM_ADMIN only. Lives under /api/admin/**,
 * which SecurityConfig already gates with hasRole(SYSTEM_ADMIN) — no extra wiring.
 * The documents ship inside the jar (src/main/resources/docs) so the served copy
 * always matches the deployed build; the markdown in /docs remains the source of
 * truth and the HTML rendering is refreshed alongside it.
 */
@RestController
@RequestMapping("/api/admin/docs")
public class AdminDocsController {

    /** TUC-ICT-SRS-2026-013 — the SSO ecosystem handbook (rich HTML rendering). */
    @GetMapping(value = "/sso-handbook", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<byte[]> ssoHandbook() {
        try {
            byte[] html = new ClassPathResource("docs/sso-handbook.html").getInputStream().readAllBytes();
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_HTML)
                    .cacheControl(CacheControl.noCache())
                    .body(html);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Handbook resource missing from build");
        }
    }
}
