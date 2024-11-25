package com.example.identify.dto.post;

import lombok.Data;

import java.util.List;

@Data
public class LabelRequest {
    private String wikidataId;
    private String title;
    private String description;
    private List<String> relatedLabels;
}