package com.example.techbridge_ict.dto.user;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterUser {
    private String phone;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
}
