package com.example.techbridge_ict.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@Builder
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class BaseResponseDto extends BaseDto {
    @Builder.Default
    private boolean success = true;
    @Builder.Default
    private int statusCode = HttpStatus.OK.value();
    @Builder.Default
    private String status = HttpStatus.OK.name();
    private String message;
    private String messageDetail;
    @Builder.Default
    private long timestamp = System.currentTimeMillis();
}
