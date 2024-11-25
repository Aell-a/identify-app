package com.example.identify.dto.media;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class MediaRequest {
    private String description;

    @JsonIgnore
    private MultipartFile file; // Actual media file data if handling upload directly
}