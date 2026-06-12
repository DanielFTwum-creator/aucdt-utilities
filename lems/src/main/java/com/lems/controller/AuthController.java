package com.lems.controller;

import com.lems.model.dto.ApiResponse;
import com.lems.security.WmsAuthFilter;
import com.lems.security.WmsIdentity;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Authentication is delegated to TUC-WMS (SSO ecosystem archetype C,
 * TUC-ICT-SRS-2026-013) — the former hard-coded admin password is gone.
 * WmsAuthFilter validates the bearer token via the IdP relay before this
 * controller runs; /auth/me simply reflects the verified identity so the
 * frontend can bootstrap its session and decide admin vs student views.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    @GetMapping("/me")
    public ApiResponse<Map<String, Object>> me(HttpServletRequest request) {
        WmsIdentity identity = (WmsIdentity) request.getAttribute(WmsAuthFilter.IDENTITY_ATTR);
        return ApiResponse.success(Map.of(
                "email", identity.email(),
                "name", identity.name(),
                "role", identity.role(),
                "admin", identity.isAdmin()
        ), "Authenticated");
    }
}
