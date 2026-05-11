package com.example.techbridge_ict.exception;

public class InvalidPasswordException extends BusinessException {

    private static final long serialVersionUID = 1L;

    public InvalidPasswordException() {
        super("invalid password");
    }
}
