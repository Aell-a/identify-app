package com.example.identify.service;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.example.identify.model.Media;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;
import java.util.UUID;

@Service
public class MediaService {

    @Value("${gcp.bucket.name}")
    private String bucketName;

    private final Storage storage;

    public MediaService() {
        this.storage = StorageOptions.getDefaultInstance().getService();
    }

    public Media uploadMedia(MultipartFile file, Long userId) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File must not be empty");
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String objectName = userId + "/" + filename;
        
        BlobId blobId = BlobId.of(bucketName, objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(file.getContentType())
                .build();

        try {
            storage.create(blobInfo, file.getBytes());
        } catch (Exception e) {
            // Log the error and rethrow it
            System.err.println("Error uploading file to Google Cloud Storage: " + e.getMessage());
            throw new IOException("Failed to upload media", e);
        }

        String mediaUrl = String.format("https://storage.googleapis.com/%s/%s", bucketName, objectName);

        Media media = new Media();
        media.setMediaUrl(mediaUrl);
        media.setMediaType(Objects.requireNonNull(file.getContentType()));
        media.setMediaFormat(Objects.requireNonNull(FilenameUtils.getExtension(file.getOriginalFilename())));
        return media;
    }
}
