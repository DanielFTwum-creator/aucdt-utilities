package com.lems.controller;

import com.lems.model.dto.ApiResponse;
import com.lems.model.dto.AuthRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    @Value("${admin.password}")
    private String adminPassword;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody AuthRequest request) {
        if (adminPassword.equals(request.getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("token", "admin-token-" + System.currentTimeMillis());
            response.put("authenticated", true);
            return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid password", "Authentication failed"));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> verify(@RequestHeader(value = "Authorization", required = false) String token) {
        Map<String, Boolean> response = new HashMap<>();
        response.put("authenticated", token != null && token.startsWith("admin-token-"));
        return ResponseEntity.ok(ApiResponse.success(response, "Verification complete"));
    }
}

