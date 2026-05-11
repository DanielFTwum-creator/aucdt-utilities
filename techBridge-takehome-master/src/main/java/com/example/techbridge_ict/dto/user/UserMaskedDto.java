package com.example.techbridge_ict.dto.user;

import com.example.techbridge_ict.dto.BaseDto;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
public class UserMaskedDto extends BaseDto {

    private Long id;

    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    private String phone;

    public String getFullName() {
        return lastName != null ? firstName + " " + lastName : firstName;
    }

}

