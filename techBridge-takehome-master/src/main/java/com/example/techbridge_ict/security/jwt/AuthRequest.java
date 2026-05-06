package com.example.techbridge_ict.security.jwt;

import lombok.Data;

@Data
public class AuthRequest {


    private String phone;
    private String password;

    @Override
    public String toString() {
        return "AuthRequest{" +
                "phone='" + phone + '\'' +
                '}';
    }
}
