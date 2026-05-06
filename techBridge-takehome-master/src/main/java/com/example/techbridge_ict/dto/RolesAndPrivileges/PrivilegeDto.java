package com.example.techbridge_ict.dto.RolesAndPrivileges;


import com.example.techbridge_ict.dto.BaseDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class PrivilegeDto extends BaseDto {
    private Long id;
    private String name;
}
