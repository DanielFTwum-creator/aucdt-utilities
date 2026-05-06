package com.example.techbridge_ict.dto.asset;

import com.example.techbridge_ict.dto.BaseDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Instant;

@Data
@EqualsAndHashCode(callSuper = false)
public class AuditLogDto extends BaseDto {
    private Long id;
    private Long assetId;
    private String assetSerialNumber;
    private String action;
    private Instant timestamp;
}
