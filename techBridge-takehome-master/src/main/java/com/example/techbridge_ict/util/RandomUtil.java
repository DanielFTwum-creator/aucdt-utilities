package com.example.techbridge_ict.util;

import org.apache.commons.lang3.RandomStringUtils;

import java.util.Base64;
import java.util.Random;
import java.util.regex.Pattern;

public class RandomUtil {

    private static final int DEF_COUNT = 8;

    private RandomUtil() {
    }

    public static String generatePassword() {
        return RandomStringUtils.secure().nextAlphanumeric(DEF_COUNT);
    }

    public static String generateKey() {
        return RandomStringUtils.secure().nextAlphanumeric(DEF_COUNT);
    }


    public static String randomAlphanumeric() {
        return RandomStringUtils.insecure().nextAlphanumeric(DEF_COUNT);
    }

    public static String randomNumberic() {
        return RandomStringUtils.insecure().nextNumeric(10).concat(String.valueOf(((Double) (Math.random() * 10000)).intValue()));
    }

    public static String generateEncodeKey(String generatedKey) {
        return Base64.getEncoder().encodeToString(generatedKey.getBytes());
    }

    public static String decodeString(String encodedString) {
        byte[] decodedBytes = Base64.getDecoder().decode(encodedString);
        return new String(decodedBytes);
    }

    public   static boolean isValidTurkishPhoneNumber(String number) {
       return Pattern.compile("^\\+90[0-9]{10}$").matcher(number).matches();
    }


    public static int getRandomNumber() {
        int min = Integer.parseInt("1000");
        int max = Integer.parseInt("9999");
        Random foo = new Random();
        int randomNumber = foo.nextInt(max - min) + min;
        if (randomNumber == min) {
            return min + 1;
        } else {
            return randomNumber;
        }
    }
}

