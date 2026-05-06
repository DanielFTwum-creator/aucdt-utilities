package com.example.techbridge_ict.exception;


import com.example.techbridge_ict.enums.ResponseMessageEnum;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.io.Serial;

public class BusinessException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1L;

    @Getter
    private HttpStatus httpStatus;

    public BusinessException(String message) {
        super(message);
        this.httpStatus = HttpStatus.BAD_REQUEST;
    }

    public BusinessException(String message, String messageDetail) {
        super(message, new Throwable(messageDetail));
        this.httpStatus = HttpStatus.BAD_REQUEST;
    }

    public BusinessException(ResponseMessageEnum message) {
        super(message.message(), new Throwable(message.messageDetail()));
        this.httpStatus = HttpStatus.BAD_REQUEST;
    }

    public BusinessException(HttpStatus httpStatus, String message) {
        super(message);
        this.httpStatus = httpStatus;
    }
}
