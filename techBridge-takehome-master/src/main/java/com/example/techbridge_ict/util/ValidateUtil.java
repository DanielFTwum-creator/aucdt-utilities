package com.example.techbridge_ict.util;



import com.example.techbridge_ict.enums.ResponseMessageEnum;
import com.example.techbridge_ict.exception.BusinessException;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

public class ValidateUtil {

    public static void validateStringField(String field, ResponseMessageEnum message) {
        if (!StringUtils.hasText(field)) {
            throw new BusinessException(message);
        }
    }

    public static void validateObjectField(Object field, ResponseMessageEnum message) {
        if (ObjectUtils.isEmpty(field)) {
            throw new BusinessException(message);
        }
    }
}
