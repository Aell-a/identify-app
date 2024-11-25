package com.example.identify.service;

import com.example.identify.model.Media;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class MediaService {

    @Value("${file.storage.location}")
    private String fileStorageLocation;

    @Value("${file.base-url}")
    private String fileBaseUrl;

    public Media uploadMedia(MultipartFile file, Long userId) throws IOException {
        Path rootLocation = Paths.get(fileStorageLocation);
        Path userDirectory = rootLocation.resolve(String.valueOf(userId));

        Files.createDirectories(userDirectory);

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path destinationFile = userDirectory.resolve(filename);
        Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

        String mediaUrl = fileBaseUrl + userId + "/" + filename;

        Media media = new Media();
        media.setMediaUrl(mediaUrl);
        media.setMediaType(Objects.requireNonNull(file.getContentType()));
        media.setMediaFormat(Objects.requireNonNull(FilenameUtils.getExtension(file.getOriginalFilename())));
        return media;
    }
}
