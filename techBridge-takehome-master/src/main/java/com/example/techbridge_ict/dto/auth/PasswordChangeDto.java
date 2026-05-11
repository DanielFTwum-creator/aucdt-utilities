package com.example.techbridge_ict.dto.auth;

import com.example.techbridge_ict.dto.BaseDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class PasswordChangeDto extends BaseDto {
    private String oldPassword;
    private String newPassword;
}

