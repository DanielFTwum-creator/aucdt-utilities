package com.example.techbridge_ict.dto.user;


import com.example.techbridge_ict.dto.BaseDto;
import com.example.techbridge_ict.dto.RolesAndPrivileges.RoleDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = false)
public class UserDto extends BaseDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String password;
    private String email;
    private Boolean active;
    private String phone;
    private String createdDate;
    private Set<RoleDto> roles;
}
