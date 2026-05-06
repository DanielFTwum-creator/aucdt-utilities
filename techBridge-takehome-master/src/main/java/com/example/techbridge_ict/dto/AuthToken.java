package com.example.techbridge_ict.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthToken {
    @JsonProperty("token")
    private String jwtToken;

    @JsonProperty("refreshtoken")
    private  String jwtRefreshToken;

    private Long expireTime;

    private List<String> privileges;

    private  boolean isApproved;

    public  AuthToken(String jwtToken, String  jwtRefreshToken, Long expireTime, List<String> privileges){
        this.jwtToken = jwtToken;
        this. jwtRefreshToken= jwtRefreshToken;
        this.expireTime = expireTime;
        this.privileges = privileges;
    }

}
