package com.example.techbridge_ict.dto.asset;

import com.example.techbridge_ict.dto.BaseDto;
import com.example.techbridge_ict.enums.AssetStaus;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class AssetDto  extends BaseDto {

    private Long id;
    private String serialNumber;
    private String model;
    private String type;
    private AssetStaus status;
    private Long assignedStaffId;
    private String assignedStaffName;
}
