package com.example.techbridge_ict.dto.asset;

import com.example.techbridge_ict.dto.BaseDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class AssignAssetRequest extends BaseDto {
    private Long staffId;
}
