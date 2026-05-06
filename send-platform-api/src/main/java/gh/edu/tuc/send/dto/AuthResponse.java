package gh.edu.tuc.send.dto;

public record AuthResponse(
        String token,
        String username,
        String name,
        String role
) {}
