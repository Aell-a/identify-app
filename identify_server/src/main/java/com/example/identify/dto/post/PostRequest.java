package com.example.identify.dto.post;

import com.example.identify.dto.media.MediaRequest;
import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
@Getter
public class PostRequest {
    private Long userId;
    private String title;
    private String description;
    private List<MediaRequest> mediaRequests; // List to support multiple media items
    private List<LabelRequest> labelRequests;
    private List<String> colors;
    private List<String> shapes;
    private List<String> materials;
    private String weight;
    private double sizeX;
    private double sizeY;
    private double sizeZ;
    private List<String> tags;
}