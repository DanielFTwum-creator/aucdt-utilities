package gh.edu.tuc.send.controller;

import gh.edu.tuc.send.dto.AuthRequest;
import gh.edu.tuc.send.dto.AuthResponse;
import gh.edu.tuc.send.entity.User;
import gh.edu.tuc.send.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.username(), req.password()));

        User user = (User) auth.getPrincipal();
        String token = jwtUtil.generateToken(user);

        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getUsername(),
                user.getName(),
                user.getRole().name()));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(Authentication auth) {
        User user = (User) auth.getPrincipal();
        String token = jwtUtil.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(
                token, user.getUsername(), user.getName(), user.getRole().name()));
    }
}
