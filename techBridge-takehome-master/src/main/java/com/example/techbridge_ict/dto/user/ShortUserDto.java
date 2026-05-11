package com.example.techbridge_ict.dto.user;

import com.example.techbridge_ict.dto.BaseDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

@Data
@EqualsAndHashCode(callSuper = false)
public class ShortUserDto extends BaseDto {

    private Long id;
    private String email;
    private String phone;
    private String firstName;
    private String lastName;
    private Boolean active;
    private Date createdDate;
    private Boolean isApproved;

}

