package com.example.identify.util;

public class StringUtil {
    public static String formatSearchParameters(String input) {
        if (input == null || input.isEmpty()) {
            return null;
        } else {
            return input.substring(0,1).toUpperCase() + input.substring(1).toLowerCase();
        }
    }
}
