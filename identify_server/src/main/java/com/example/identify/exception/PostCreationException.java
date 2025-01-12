package com.example.identify.exception;

public class PostCreationException extends RuntimeException {
    public PostCreationException(String message) {
        super(message);
    }

    public PostCreationException(String message, Throwable cause) {
        super(message, cause);
    }
}