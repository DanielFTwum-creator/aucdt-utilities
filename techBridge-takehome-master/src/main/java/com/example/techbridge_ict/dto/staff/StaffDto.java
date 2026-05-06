package com.example.techbridge_ict.dto.staff;

import com.example.techbridge_ict.dto.BaseDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class StaffDto extends BaseDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String department;
    private String jobTitle;
    private String unit;
    private String employeeCode;
}
