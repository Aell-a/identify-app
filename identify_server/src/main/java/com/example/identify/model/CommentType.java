package com.example.identify.model;

public enum CommentType {
    QUESTION,
    GUESS,
    DISCUSSION,
    DEEPDIVE,
    REPLY;

    public static CommentType fromString(String text) {
        try {
            return valueOf(text.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
