package com.example.identify.exception;
public class MediaUploadException extends RuntimeException {
    public MediaUploadException(String message) {
        super(message);
    }

    public MediaUploadException(String message, Throwable cause) {
        super(message, cause);
    }
}