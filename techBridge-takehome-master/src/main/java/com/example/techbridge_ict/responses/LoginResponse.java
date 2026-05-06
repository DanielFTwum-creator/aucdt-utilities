package com.example.techbridge_ict.responses;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginResponse {
    private String token;
    private long expiresIn;

    public LoginResponse(String jwtToken, long jwtExpirationTime) {
        this.token = jwtToken;
        this.expiresIn = jwtExpirationTime;
    }
}
