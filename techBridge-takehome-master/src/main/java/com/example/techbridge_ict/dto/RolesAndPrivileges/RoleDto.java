package com.example.techbridge_ict.dto.RolesAndPrivileges;


import com.example.techbridge_ict.dto.BaseDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = false)
public class RoleDto extends BaseDto {
    private Long id;
    private String name;
    private Set<PrivilegeDto> privileges;
}
