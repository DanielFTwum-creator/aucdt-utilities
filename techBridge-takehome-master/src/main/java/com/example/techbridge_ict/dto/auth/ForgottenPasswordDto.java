package com.example.techbridge_ict.dto.auth;


import lombok.Data;

@Data
public class ForgottenPasswordDto {
    private String newPassword;
    private String email;
    private Integer verificationCode;
}

